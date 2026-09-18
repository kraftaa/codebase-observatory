import path from "node:path";

function lines(source) {
  return source ? source.split("\n") : [];
}

function indentation(line) {
  return line.match(/^\s*/)?.[0].replace(/\t/g, "  ").length ?? 0;
}

function indentedEnd(sourceLines, start, indent) {
  let end = start + 1;
  for (let index = start + 1; index < sourceLines.length; index += 1) {
    const text = sourceLines[index];
    if (!text.trim() || text.trim().startsWith("#")) {
      end = index + 1;
      continue;
    }
    if (indentation(text) <= indent) break;
    end = index + 1;
  }
  return end;
}

function braceEnd(sourceLines, start) {
  let depth = 0;
  let opened = false;
  for (let index = start; index < sourceLines.length; index += 1) {
    const scrubbed = sourceLines[index]
      .replace(/\/\/.*$/, "")
      .replace(/"(?:\\.|[^"\\])*"/g, "")
      .replace(/'(?:\\.|[^'\\])*'/g, "");
    for (const character of scrubbed) {
      if (character === "{") {
        depth += 1;
        opened = true;
      } else if (character === "}") depth -= 1;
    }
    if (opened && depth <= 0) return index + 1;
  }
  return start + 1;
}

function symbol(sourceLines, startIndex, end, name, kind, exported) {
  return {
    name,
    kind,
    exported,
    defaultExport: false,
    start: startIndex + 1,
    end,
    text: sourceLines.slice(startIndex, end).join("\n"),
  };
}

function pythonSymbols(source) {
  const sourceLines = lines(source);
  const symbols = [];
  const classes = [];
  for (const [index, raw] of sourceLines.entries()) {
    const indent = indentation(raw);
    while (classes.length && indent <= classes.at(-1).indent) classes.pop();
    const classMatch = raw.match(/^\s*class\s+([A-Za-z_]\w*)\b/);
    if (classMatch) {
      const end = indentedEnd(sourceLines, index, indent);
      symbols.push(symbol(sourceLines, index, end, classMatch[1], "class", !classMatch[1].startsWith("_")));
      classes.push({ name: classMatch[1], indent });
      continue;
    }
    const functionMatch = raw.match(/^\s*(?:async\s+)?def\s+([A-Za-z_]\w*)\s*\(/);
    if (!functionMatch) continue;
    const parent = classes.at(-1);
    const name = parent ? `${parent.name}.${functionMatch[1]}` : functionMatch[1];
    symbols.push(symbol(
      sourceLines,
      index,
      indentedEnd(sourceLines, index, indent),
      name,
      parent ? "method" : "function",
      !functionMatch[1].startsWith("_") && (!parent || !parent.name.startsWith("_")),
    ));
  }
  return symbols;
}

function rubySymbols(source) {
  const sourceLines = lines(source);
  const symbols = [];
  const namespaces = [];
  for (const [index, raw] of sourceLines.entries()) {
    const indent = indentation(raw);
    while (namespaces.length && indent <= namespaces.at(-1).indent) namespaces.pop();
    const namespaceMatch = raw.match(/^\s*(class|module)\s+([A-Z]\w*(?:::[A-Z]\w*)*)\b/);
    if (namespaceMatch) {
      const parent = namespaces.at(-1);
      const name = namespaceMatch[2].includes("::") || !parent
        ? namespaceMatch[2]
        : `${parent.name}::${namespaceMatch[2]}`;
      symbols.push(symbol(sourceLines, index, indentedEnd(sourceLines, index, indent), name, namespaceMatch[1], true));
      namespaces.push({ name, indent });
      continue;
    }
    const methodMatch = raw.match(/^\s*def\s+(?:self\.)?([A-Za-z_]\w*[!?=]?)(?=\s|\(|$)/);
    if (!methodMatch) continue;
    const parent = namespaces.at(-1);
    const name = parent ? `${parent.name}.${methodMatch[1]}` : methodMatch[1];
    symbols.push(symbol(sourceLines, index, indentedEnd(sourceLines, index, indent), name, "method", !methodMatch[1].startsWith("_")));
  }
  return symbols;
}

function rustSymbols(source) {
  const sourceLines = lines(source);
  const symbols = [];
  const impls = [];
  let braceDepth = 0;
  for (const [index, raw] of sourceLines.entries()) {
    while (impls.length && braceDepth <= impls.at(-1).depth) impls.pop();
    const implMatch = raw.match(/^\s*impl(?:<[^>]+>)?\s+(?:[^\s]+\s+for\s+)?([A-Za-z_]\w*)/);
    if (implMatch) impls.push({ name: implMatch[1], depth: braceDepth });
    const declaration = raw.match(/^\s*(pub(?:\([^)]*\))?\s+)?(?:(?:async|unsafe|const)\s+)*(fn|struct|enum|trait|type|const|static)\s+([A-Za-z_]\w*)\b/);
    if (declaration) {
      const parent = declaration[2] === "fn" ? impls.at(-1) : null;
      const name = parent ? `${parent.name}.${declaration[3]}` : declaration[3];
      const kind = parent ? "method" : declaration[2] === "fn" ? "function" : declaration[2];
      symbols.push(symbol(sourceLines, index, braceEnd(sourceLines, index), name, kind, Boolean(declaration[1])));
    }
    const scrubbed = raw.replace(/\/\/.*$/, "").replace(/"(?:\\.|[^"\\])*"/g, "");
    braceDepth += [...scrubbed].filter((value) => value === "{").length;
    braceDepth -= [...scrubbed].filter((value) => value === "}").length;
  }
  return symbols;
}

function pythonModuleCandidates(from, specifier) {
  const leading = specifier.match(/^\.+/)?.[0].length ?? 0;
  const moduleName = specifier.slice(leading).replace(/\./g, "/");
  let base = "";
  if (leading) {
    base = path.posix.dirname(from);
    for (let index = 1; index < leading; index += 1) base = path.posix.dirname(base);
  }
  const raw = path.posix.normalize(path.posix.join(base, moduleName));
  return [`${raw}.py`, `${raw}/__init__.py`];
}

function pythonBindings(file, source, trackedSet) {
  const bindings = [];
  for (const raw of lines(source)) {
    const fromMatch = raw.match(/^\s*from\s+([.A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*)\s+import\s+(.+?)(?:\s+#.*)?$/);
    if (fromMatch) {
      for (const item of fromMatch[2].replace(/[()]/g, "").split(",")) {
        const match = item.trim().match(/^([A-Za-z_]\w*|\*)(?:\s+as\s+([A-Za-z_]\w*))?$/);
        if (!match) continue;
        const dependency = pythonModuleCandidates(file, fromMatch[1]).find((candidate) => trackedSet.has(candidate)) ??
          pythonModuleCandidates(file, `${fromMatch[1]}${fromMatch[1].endsWith(".") ? "" : "."}${match[1]}`).find((candidate) => trackedSet.has(candidate));
        if (dependency) bindings.push({ dependency, imported: match[1], local: match[2] ?? match[1] });
      }
      continue;
    }
    const importMatch = raw.match(/^\s*import\s+([.A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*)(?:\s+as\s+([A-Za-z_]\w*))?/);
    if (!importMatch) continue;
    const dependency = pythonModuleCandidates(file, importMatch[1]).find((candidate) => trackedSet.has(candidate));
    if (dependency) bindings.push({ dependency, imported: "*", local: importMatch[2] ?? importMatch[1].split(".").at(-1) });
  }
  return bindings;
}

function rubyBindings(file, source, trackedSet) {
  const bindings = [];
  for (const match of source.matchAll(/^\s*require_relative\s*[('" ]+([^)'"\s]+)[)'"]*\s*$/gm)) {
    const raw = path.posix.normalize(path.posix.join(path.posix.dirname(file), match[1]));
    const dependency = [raw, `${raw}.rb`, `${raw}/init.rb`].find((candidate) => trackedSet.has(candidate));
    if (dependency) bindings.push({ dependency, imported: "*", local: "*" });
  }
  return bindings;
}

function rustCandidates(file, specifier) {
  const cleaned = specifier.replace(/^::/, "");
  let parts = cleaned.split("::").filter(Boolean);
  let base = path.posix.dirname(file);
  if (parts[0] === "crate") {
    parts = parts.slice(1);
    const nestedSource = file.lastIndexOf("/src/");
    base = file.startsWith("src/") ? "src" : nestedSource >= 0 ? file.slice(0, nestedSource + 4) : "";
  } else {
    while (parts[0] === "super") {
      base = path.posix.dirname(base);
      parts = parts.slice(1);
    }
    if (parts[0] === "self") parts = parts.slice(1);
  }
  const moduleParts = parts.slice(0, -1);
  const raw = path.posix.join(base, ...moduleParts);
  return [`${raw}.rs`, `${raw}/mod.rs`, path.posix.join(raw, `${parts.at(-1)}.rs`)].filter((value) => value !== file);
}

function rustBindings(file, source, trackedSet) {
  const bindings = [];
  for (const match of source.matchAll(/^\s*(?:pub\s+)?use\s+([^;{]+?)(?:::\{([^}]+)\})?\s*;/gm)) {
    const base = match[1].trim();
    const names = match[2] ? match[2].split(",").map((value) => value.trim()) : [base.split("::").at(-1)];
    const dependency = rustCandidates(file, base).find((candidate) => trackedSet.has(candidate));
    if (!dependency) continue;
    for (const item of names) {
      const alias = item.match(/^([A-Za-z_]\w*)(?:\s+as\s+([A-Za-z_]\w*))?$/);
      if (alias) bindings.push({ dependency, imported: alias[1], local: alias[2] ?? alias[1] });
    }
  }
  for (const match of source.matchAll(/^\s*(?:pub\s+)?mod\s+([A-Za-z_]\w*)\s*;/gm)) {
    const raw = path.posix.join(path.posix.dirname(file), match[1]);
    const dependency = [`${raw}.rs`, `${raw}/mod.rs`].find((candidate) => trackedSet.has(candidate));
    if (dependency) bindings.push({ dependency, imported: "*", local: match[1] });
  }
  return bindings;
}

export const languageAnalyzers = [
  {
    id: "python",
    label: "Python",
    supports: (file) => /\.py$/i.test(file),
    symbolInventory: pythonSymbols,
    importBindings: pythonBindings,
    coverage: "partial",
    explanation: "Python functions, classes, methods, local imports, consumers, history, and nearby-test signals were inspected; dynamic imports and runtime dispatch remain outside scope.",
  },
  {
    id: "ruby-rails",
    label: "Ruby/Rails",
    supports: (file) => /\.rb$/i.test(file),
    symbolInventory: rubySymbols,
    importBindings: rubyBindings,
    coverage: "partial",
    explanation: "Ruby classes, modules, methods, require_relative links, Rails constant consumers, history, and nearby RSpec/test signals were inspected; metaprogramming and runtime dispatch remain outside scope.",
  },
  {
    id: "rust",
    label: "Rust",
    supports: (file) => /\.rs$/i.test(file),
    symbolInventory: rustSymbols,
    importBindings: rustBindings,
    coverage: "partial",
    explanation: "Rust functions, types, traits, modules, use links, consumers, history, and test signals were inspected; macro expansion and compiler-resolved dispatch remain outside scope.",
  },
];

export function analyzerFor(file) {
  return languageAnalyzers.find((analyzer) => analyzer.supports(file)) ?? null;
}

export function isAdditionalRuntime(file) {
  return Boolean(analyzerFor(file));
}

export function isAdditionalTest(file) {
  const name = path.posix.basename(file);
  return /(^|\/)(spec|tests?)(\/|$)/i.test(file) ||
    /^test_.*\.py$/i.test(name) || /_test\.py$/i.test(name) ||
    /_(spec|test)\.rb$/i.test(name);
}

export function nearbyTestsFor(file, changedTests) {
  const extension = path.posix.extname(file);
  const withoutExtension = file.slice(0, -extension.length);
  const base = path.posix.basename(withoutExtension);
  const directory = path.posix.dirname(withoutExtension);
  if (extension === ".py") {
    return changedTests.filter((test) => {
      const testName = path.posix.basename(test);
      return test === `${withoutExtension}_test.py` || testName === `test_${base}.py` || testName === `${base}_test.py`;
    });
  }
  if (extension === ".rb") {
    const railsRelative = withoutExtension.replace(/^(app|lib)\//, "");
    return changedTests.filter((test) =>
      test === `${withoutExtension}_spec.rb` || test === `${withoutExtension}_test.rb` ||
      test === `spec/${railsRelative}_spec.rb` || test === `test/${railsRelative}_test.rb` ||
      path.posix.basename(test) === `${base}_spec.rb` || path.posix.basename(test) === `${base}_test.rb`,
    );
  }
  if (extension === ".rs") {
    return changedTests.filter((test) => test.includes(base) || test.startsWith(`${directory}/tests/`));
  }
  return [];
}

export function constantBindingsForRuby(files, sources, inventories) {
  const result = [];
  const rubyFiles = files.filter((file) => /\.rb$/i.test(file));
  const dependenciesByConstant = new Map();
  const dependenciesByShortName = new Map();
  for (const dependency of rubyFiles) {
    const constants = (inventories.get(dependency) ?? [])
      .filter((item) => item.exported && ["class", "module"].includes(item.kind))
      .map((item) => item.name);
    for (const constant of constants) {
      const dependencies = dependenciesByConstant.get(constant) ?? new Set();
      dependencies.add(dependency);
      dependenciesByConstant.set(constant, dependencies);
      const shortName = constant.split("::").at(-1);
      const shortDependencies = dependenciesByShortName.get(shortName) ?? new Set();
      shortDependencies.add(dependency);
      dependenciesByShortName.set(shortName, shortDependencies);
    }
  }
  for (const file of rubyFiles) {
    const source = sources.get(file) ?? "";
    const declared = new Set((inventories.get(file) ?? [])
      .filter((item) => ["class", "module"].includes(item.kind))
      .flatMap((item) => [item.name, item.name.split("::").at(-1)]));
    const referenceSource = source
      .replace(/#.*$/gm, "")
      .replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, "");
    const referenced = new Set([...referenceSource.matchAll(/\b[A-Z]\w*(?:::[A-Z]\w*)*\b/g)]
      .map((match) => match[0]));
    for (const constant of referenced) {
      const shortName = constant.split("::").at(-1);
      const exact = dependenciesByConstant.get(constant);
      const short = dependenciesByShortName.get(shortName);
      const dependencies = exact?.size === 1 ? exact : !constant.includes("::") && short?.size === 1 ? short : [];
      for (const dependency of dependencies) {
        if (dependency === file || declared.has(constant) || declared.has(shortName)) continue;
        result.push({ dependency, file, imported: constant, local: constant });
      }
    }
  }
  return result;
}
