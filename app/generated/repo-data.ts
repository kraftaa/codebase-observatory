export const repoData = {
  "repoName": "observatory",
  "targetPath": "observatory",
  "generatedAt": "2026-09-16T18:55:32.646Z",
  "stats": {
    "trackedFiles": 39,
    "commits": 30,
    "dbtManifest": false
  },
  "modules": [
    {
      "id": "root",
      "label": "Root",
      "files": 10,
      "churn": 100,
      "risk": 79,
      "owner": "Maria Dubyaga",
      "x": 490,
      "y": 115,
      "radius": 60
    },
    {
      "id": "app",
      "label": "App",
      "files": 7,
      "churn": 100,
      "risk": 77,
      "owner": "Maria Dubyaga",
      "x": 680,
      "y": 164,
      "radius": 57
    },
    {
      "id": "scripts",
      "label": "Scripts",
      "files": 4,
      "churn": 100,
      "risk": 57,
      "owner": "Maria Dubyaga",
      "x": 781,
      "y": 289,
      "radius": 52
    },
    {
      "id": "tests",
      "label": "Tests",
      "files": 4,
      "churn": 80,
      "risk": 46,
      "owner": "Maria Dubyaga",
      "x": 745,
      "y": 430,
      "radius": 52
    },
    {
      "id": "experiments",
      "label": "Experiments",
      "files": 3,
      "churn": 17,
      "risk": 12,
      "owner": "Maria Dubyaga",
      "x": 591,
      "y": 522,
      "radius": 50
    },
    {
      "id": "app-generated",
      "label": "App/Generated",
      "files": 2,
      "churn": 97,
      "risk": 55,
      "owner": "Maria Dubyaga",
      "x": 389,
      "y": 522,
      "radius": 48
    },
    {
      "id": "db",
      "label": "Db",
      "files": 2,
      "churn": 11,
      "risk": 12,
      "owner": "Maria Dubyaga",
      "x": 235,
      "y": 430,
      "radius": 48
    },
    {
      "id": "docs",
      "label": "Docs",
      "files": 2,
      "churn": 17,
      "risk": 12,
      "owner": "Maria Dubyaga",
      "x": 199,
      "y": 289,
      "radius": 48
    },
    {
      "id": "openai",
      "label": ".Openai",
      "files": 1,
      "churn": 8,
      "risk": 12,
      "owner": "Maria Dubyaga",
      "x": 300,
      "y": 164,
      "radius": 45
    }
  ],
  "files": [
    {
      "id": "app-globals-css",
      "path": "app/globals.css",
      "module": "app",
      "role": "Visual system",
      "created": "2026-09-15",
      "owner": "Maria Dubyaga",
      "touches": 14,
      "importers": 1,
      "dbtDownstream": 0,
      "dbtRefs": [],
      "bugFixes": 0,
      "coupling": [
        "app/observatory.tsx",
        "tests/rendered-html.test.mjs",
        "app/generated/repo-data.ts"
      ],
      "summary": "app/globals.css is a visual system in App. It has 14 Git touches, 1 direct importer, 0 dbt downstream models, and a critical risk signal from churn, coupling, and ownership.",
      "x": 665,
      "y": 178
    },
    {
      "id": "app-observatory-tsx",
      "path": "app/observatory.tsx",
      "module": "app",
      "role": "Interface logic",
      "created": "2026-09-15",
      "owner": "Maria Dubyaga",
      "touches": 13,
      "importers": 1,
      "dbtDownstream": 0,
      "dbtRefs": [],
      "bugFixes": 0,
      "coupling": [
        "app/globals.css",
        "app/generated/repo-data.ts",
        "scripts/analyze-repo.mjs"
      ],
      "summary": "app/observatory.tsx is a interface logic in App. It has 13 Git touches, 1 direct importer, 0 dbt downstream models, and a critical risk signal from churn, coupling, and ownership.",
      "x": 682,
      "y": 140
    },
    {
      "id": "app-generated-repo-data-ts",
      "path": "app/generated/repo-data.ts",
      "module": "app-generated",
      "role": "Interface logic",
      "created": "2026-07-11",
      "owner": "Maria Dubyaga",
      "touches": 9,
      "importers": 1,
      "dbtDownstream": 0,
      "dbtRefs": [],
      "bugFixes": 0,
      "coupling": [
        "scripts/analyze-repo.mjs",
        "app/observatory.tsx",
        "app/globals.css"
      ],
      "summary": "app/generated/repo-data.ts is a interface logic in App/Generated. It has 9 Git touches, 1 direct importer, 0 dbt downstream models, and a watch risk signal from churn, coupling, and ownership.",
      "x": 405,
      "y": 543
    },
    {
      "id": "app-generated-diff-data-ts",
      "path": "app/generated/diff-data.ts",
      "module": "app-generated",
      "role": "Interface logic",
      "created": "2026-09-16",
      "owner": "Maria Dubyaga",
      "touches": 8,
      "importers": 1,
      "dbtDownstream": 0,
      "dbtRefs": [],
      "bugFixes": 0,
      "coupling": [
        "README.md",
        "observatory.config.json",
        "scripts/analyze-diff.mjs"
      ],
      "summary": "app/generated/diff-data.ts is a interface logic in App/Generated. It has 8 Git touches, 1 direct importer, 0 dbt downstream models, and a stable risk signal from churn, coupling, and ownership.",
      "x": 359,
      "y": 517
    },
    {
      "id": "scripts-analyze-repo-mjs",
      "path": "scripts/analyze-repo.mjs",
      "module": "scripts",
      "role": "Source file",
      "created": "2026-09-16",
      "owner": "Maria Dubyaga",
      "touches": 10,
      "importers": 0,
      "dbtDownstream": 0,
      "dbtRefs": [],
      "bugFixes": 0,
      "coupling": [
        "app/generated/repo-data.ts",
        "app/observatory.tsx",
        "app/globals.css"
      ],
      "summary": "scripts/analyze-repo.mjs is a source file in Scripts. It has 10 Git touches, 0 direct importers, 0 dbt downstream models, and a stable risk signal from churn, coupling, and ownership.",
      "x": 809,
      "y": 271
    },
    {
      "id": "tests-rendered-html-test-mjs",
      "path": "tests/rendered-html.test.mjs",
      "module": "tests",
      "role": "Render verification",
      "created": "2026-09-15",
      "owner": "Maria Dubyaga",
      "touches": 9,
      "importers": 0,
      "dbtDownstream": 0,
      "dbtRefs": [],
      "bugFixes": 0,
      "coupling": [
        "app/globals.css",
        "app/observatory.tsx",
        "README.md"
      ],
      "summary": "tests/rendered-html.test.mjs is a render verification in Tests. It has 9 Git touches, 0 direct importers, 0 dbt downstream models, and a stable risk signal from churn, coupling, and ownership.",
      "x": 736,
      "y": 465
    },
    {
      "id": "app-review-review-map-tsx",
      "path": "app/review/review-map.tsx",
      "module": "app",
      "role": "Interface logic",
      "created": "2026-09-15",
      "owner": "Maria Dubyaga",
      "touches": 2,
      "importers": 1,
      "dbtDownstream": 0,
      "dbtRefs": [],
      "bugFixes": 0,
      "coupling": [
        "README.md",
        "app/globals.css",
        "scripts/analyze-diff.mjs"
      ],
      "summary": "app/review/review-map.tsx is a interface logic in App. It has 2 Git touches, 1 direct importer, 0 dbt downstream models, and a stable risk signal from churn, coupling, and ownership.",
      "x": 662,
      "y": 129
    },
    {
      "id": "readme-md",
      "path": "README.md",
      "module": "root",
      "role": "Project documentation",
      "created": "2026-09-16",
      "owner": "Maria Dubyaga",
      "touches": 10,
      "importers": 0,
      "dbtDownstream": 0,
      "dbtRefs": [],
      "bugFixes": 0,
      "coupling": [
        "package.json",
        "scripts/analyze-diff.mjs",
        "tests/rendered-html.test.mjs"
      ],
      "summary": "README.md is a project documentation in Root. It has 10 Git touches, 0 direct importers, 0 dbt downstream models, and a stable risk signal from churn, coupling, and ownership.",
      "x": 529,
      "y": 129
    },
    {
      "id": "openai-hosting-json",
      "path": ".openai/hosting.json",
      "module": "openai",
      "role": "Project metadata",
      "created": "2026-07-10",
      "owner": "Maria Dubyaga",
      "touches": 1,
      "importers": 1,
      "dbtDownstream": 0,
      "dbtRefs": [],
      "bugFixes": 0,
      "coupling": [
        "README.md",
        "app/chatgpt-auth.ts",
        "app/globals.css"
      ],
      "summary": ".openai/hosting.json is a project metadata in .Openai. It has 1 Git touch, 1 direct importer, 0 dbt downstream models, and a stable risk signal from churn, coupling, and ownership.",
      "x": 269,
      "y": 177
    },
    {
      "id": "build-sites-vite-plugin-ts",
      "path": "build/sites-vite-plugin.ts",
      "module": "root",
      "role": "Source file",
      "created": "2026-07-10",
      "owner": "Maria Dubyaga",
      "touches": 1,
      "importers": 1,
      "dbtDownstream": 0,
      "dbtRefs": [],
      "bugFixes": 0,
      "coupling": [
        ".openai/hosting.json",
        "README.md",
        "app/chatgpt-auth.ts"
      ],
      "summary": "build/sites-vite-plugin.ts is a source file in Root. It has 1 Git touch, 1 direct importer, 0 dbt downstream models, and a stable risk signal from churn, coupling, and ownership.",
      "x": 510,
      "y": 72
    }
  ],
  "links": [
    {
      "source": "root",
      "target": "openai",
      "weight": 1,
      "kind": "imports"
    },
    {
      "source": "app",
      "target": "app-generated",
      "weight": 2,
      "kind": "imports"
    },
    {
      "source": "app-generated",
      "target": "scripts",
      "weight": 11,
      "kind": "cochange"
    },
    {
      "source": "scripts",
      "target": "tests",
      "weight": 10,
      "kind": "cochange"
    },
    {
      "source": "app",
      "target": "scripts",
      "weight": 10,
      "kind": "cochange"
    },
    {
      "source": "app",
      "target": "tests",
      "weight": 8,
      "kind": "cochange"
    },
    {
      "source": "root",
      "target": "scripts",
      "weight": 7,
      "kind": "cochange"
    },
    {
      "source": "root",
      "target": "tests",
      "weight": 7,
      "kind": "cochange"
    },
    {
      "source": "app-generated",
      "target": "tests",
      "weight": 6,
      "kind": "cochange"
    },
    {
      "source": "app",
      "target": "root",
      "weight": 4,
      "kind": "cochange"
    },
    {
      "source": "app-generated",
      "target": "root",
      "weight": 3,
      "kind": "cochange"
    },
    {
      "source": "docs",
      "target": "root",
      "weight": 2,
      "kind": "cochange"
    },
    {
      "source": "docs",
      "target": "scripts",
      "weight": 2,
      "kind": "cochange"
    }
  ],
  "events": [
    {
      "month": "Sep",
      "title": "Refresh agent impact review data",
      "detail": "1 tracked file changed by Maria Dubyaga.",
      "module": "app-generated"
    },
    {
      "month": "Sep",
      "title": "Support agent working-tree impact checks",
      "detail": "7 tracked files changed by Maria Dubyaga.",
      "module": "root"
    },
    {
      "month": "Sep",
      "title": "Refresh working-tree impact review data",
      "detail": "1 tracked file changed by Maria Dubyaga.",
      "module": "app-generated"
    },
    {
      "month": "Sep",
      "title": "Document agent impact workflow",
      "detail": "1 tracked file changed by Maria Dubyaga.",
      "module": "root"
    },
    {
      "month": "Sep",
      "title": "Refresh documented workflow review data",
      "detail": "1 tracked file changed by Maria Dubyaga.",
      "module": "app-generated"
    },
    {
      "month": "Sep",
      "title": "Remove repository-specific analyzer assumptions",
      "detail": "1 tracked file changed by Maria Dubyaga.",
      "module": "scripts"
    }
  ],
  "branchReview": null
} as const;
