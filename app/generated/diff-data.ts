export const diffReviewMap = {
  "baseRef": "main",
  "headRef": "HEAD",
  "range": "main...HEAD",
  "workingTree": false,
  "summary": {
    "filesChanged": 23,
    "additions": 2420,
    "deletions": 371,
    "runtimeFiles": 8,
    "testFiles": 4,
    "generatedFiles": 1,
    "configFiles": 2,
    "docsFiles": 5
  },
  "changedFiles": [
    {
      "path": "README.md",
      "previousPath": null,
      "status": "modified",
      "additions": 191,
      "deletions": 20,
      "changedLineRanges": [
        {
          "start": 7,
          "end": 7
        },
        {
          "start": 9,
          "end": 11
        },
        {
          "start": 13,
          "end": 17
        },
        {
          "start": 21,
          "end": 25
        },
        {
          "start": 27,
          "end": 28
        },
        {
          "start": 31,
          "end": 150
        },
        {
          "start": 172,
          "end": 218
        },
        {
          "start": 220,
          "end": 224
        },
        {
          "start": 239,
          "end": 241
        }
      ],
      "category": "docs",
      "churnScore": 10,
      "history": {
        "commitsLast90Days": 10,
        "uniqueAuthors": 1,
        "recentBugFixCommits": 0
      },
      "ownership": [
        "Maria Dubyaga"
      ],
      "directDependents": [],
      "transitiveDependentCount": 0,
      "coChangedFiles": [
        {
          "path": "package.json",
          "count": 5
        },
        {
          "path": "scripts/analyze-diff.mjs",
          "count": 4
        },
        {
          "path": "tests/rendered-html.test.mjs",
          "count": 4
        },
        {
          "path": "app/globals.css",
          "count": 3
        },
        {
          "path": "app/observatory.tsx",
          "count": 3
        },
        {
          "path": "bin/observatory.mjs",
          "count": 2
        },
        {
          "path": "docs/IMPACT_SCHEMA.md",
          "count": 2
        },
        {
          "path": "scripts/impact.mjs",
          "count": 2
        },
        {
          "path": "tests/impact.test.mjs",
          "count": 2
        },
        {
          "path": "package-lock.json",
          "count": 2
        },
        {
          "path": "app/review/review-map.tsx",
          "count": 2
        },
        {
          "path": "tests/analyze-diff.test.mjs",
          "count": 2
        },
        {
          "path": "observatory.config.json",
          "count": 2
        },
        {
          "path": "docs/AGENT_WORKFLOW.md",
          "count": 1
        },
        {
          "path": "experiments/METHODOLOGY.md",
          "count": 1
        },
        {
          "path": "experiments/REPORT.md",
          "count": 1
        },
        {
          "path": "experiments/review-study.json",
          "count": 1
        },
        {
          "path": "scripts/review-study.mjs",
          "count": 1
        },
        {
          "path": "tests/review-study.test.mjs",
          "count": 1
        },
        {
          "path": "app/review/page.tsx",
          "count": 1
        },
        {
          "path": "app/generated/repo-data.ts",
          "count": 1
        },
        {
          "path": "scripts/analyze-repo.mjs",
          "count": 1
        }
      ],
      "nearbyTestChanges": [],
      "riskSignals": [
        "10 commits in the last 90 days"
      ],
      "changedSymbols": []
    },
    {
      "path": "app/generated/repo-data.ts",
      "previousPath": null,
      "status": "modified",
      "additions": 288,
      "deletions": 340,
      "changedLineRanges": [
        {
          "start": 2,
          "end": 4
        },
        {
          "start": 6,
          "end": 8
        },
        {
          "start": 12,
          "end": 14
        },
        {
          "start": 16,
          "end": 17
        },
        {
          "start": 20,
          "end": 20
        },
        {
          "start": 23,
          "end": 25
        },
        {
          "start": 27,
          "end": 28
        },
        {
          "start": 31,
          "end": 31
        },
        {
          "start": 34,
          "end": 36
        },
        {
          "start": 38,
          "end": 39
        },
        {
          "start": 42,
          "end": 42
        },
        {
          "start": 45,
          "end": 50
        },
        {
          "start": 53,
          "end": 53
        },
        {
          "start": 56,
          "end": 61
        },
        {
          "start": 64,
          "end": 64
        },
        {
          "start": 67,
          "end": 72
        },
        {
          "start": 75,
          "end": 75
        },
        {
          "start": 78,
          "end": 83
        },
        {
          "start": 86,
          "end": 86
        },
        {
          "start": 89,
          "end": 94
        },
        {
          "start": 97,
          "end": 97
        },
        {
          "start": 100,
          "end": 102
        },
        {
          "start": 104,
          "end": 105
        },
        {
          "start": 108,
          "end": 108
        },
        {
          "start": 113,
          "end": 120
        },
        {
          "start": 123,
          "end": 123
        },
        {
          "start": 125,
          "end": 127
        },
        {
          "start": 129,
          "end": 131
        },
        {
          "start": 134,
          "end": 136
        },
        {
          "start": 138,
          "end": 141
        },
        {
          "start": 144,
          "end": 144
        },
        {
          "start": 146,
          "end": 148
        },
        {
          "start": 150,
          "end": 152
        },
        {
          "start": 155,
          "end": 157
        },
        {
          "start": 159,
          "end": 162
        },
        {
          "start": 167,
          "end": 169
        },
        {
          "start": 171,
          "end": 173
        },
        {
          "start": 176,
          "end": 178
        },
        {
          "start": 180,
          "end": 183
        },
        {
          "start": 186,
          "end": 186
        },
        {
          "start": 188,
          "end": 190
        },
        {
          "start": 192,
          "end": 194
        },
        {
          "start": 197,
          "end": 204
        },
        {
          "start": 209,
          "end": 211
        },
        {
          "start": 213,
          "end": 215
        },
        {
          "start": 218,
          "end": 224
        },
        {
          "start": 228,
          "end": 228
        },
        {
          "start": 230,
          "end": 232
        },
        {
          "start": 234,
          "end": 236
        },
        {
          "start": 239,
          "end": 241
        },
        {
          "start": 243,
          "end": 246
        },
        {
          "start": 249,
          "end": 249
        },
        {
          "start": 251,
          "end": 253
        },
        {
          "start": 255,
          "end": 257
        },
        {
          "start": 260,
          "end": 266
        },
        {
          "start": 270,
          "end": 270
        },
        {
          "start": 272,
          "end": 274
        },
        {
          "start": 276,
          "end": 276
        },
        {
          "start": 281,
          "end": 288
        },
        {
          "start": 291,
          "end": 291
        },
        {
          "start": 293,
          "end": 295
        },
        {
          "start": 297,
          "end": 299
        },
        {
          "start": 302,
          "end": 309
        },
        {
          "start": 312,
          "end": 312
        },
        {
          "start": 314,
          "end": 316
        },
        {
          "start": 318,
          "end": 318
        },
        {
          "start": 325,
          "end": 344
        },
        {
          "start": 349,
          "end": 351
        },
        {
          "start": 355,
          "end": 387
        },
        {
          "start": 392,
          "end": 393
        },
        {
          "start": 398,
          "end": 399
        },
        {
          "start": 405,
          "end": 408
        },
        {
          "start": 411,
          "end": 414
        },
        {
          "start": 417,
          "end": 420
        },
        {
          "start": 423,
          "end": 426
        },
        {
          "start": 429,
          "end": 432
        },
        {
          "start": 435,
          "end": 438
        },
        {
          "start": 441,
          "end": 441
        }
      ],
      "category": "generated",
      "churnScore": 10,
      "history": {
        "commitsLast90Days": 10,
        "uniqueAuthors": 1,
        "recentBugFixCommits": 0
      },
      "ownership": [
        "Maria Dubyaga"
      ],
      "directDependents": [
        "app/observatory.tsx"
      ],
      "transitiveDependentCount": 2,
      "coChangedFiles": [
        {
          "path": "scripts/analyze-repo.mjs",
          "count": 9
        },
        {
          "path": "app/observatory.tsx",
          "count": 8
        },
        {
          "path": "app/globals.css",
          "count": 7
        },
        {
          "path": "tests/rendered-html.test.mjs",
          "count": 5
        },
        {
          "path": "README.md",
          "count": 1
        },
        {
          "path": "package.json",
          "count": 1
        }
      ],
      "nearbyTestChanges": [],
      "riskSignals": [
        "2 transitive dependents",
        "10 commits in the last 90 days"
      ],
      "changedSymbols": []
    },
    {
      "path": "app/globals.css",
      "previousPath": null,
      "status": "modified",
      "additions": 159,
      "deletions": 0,
      "changedLineRanges": [
        {
          "start": 89,
          "end": 247
        }
      ],
      "category": "unknown",
      "churnScore": 14,
      "history": {
        "commitsLast90Days": 14,
        "uniqueAuthors": 1,
        "recentBugFixCommits": 0
      },
      "ownership": [
        "Maria Dubyaga"
      ],
      "directDependents": [
        "app/layout.tsx"
      ],
      "transitiveDependentCount": 1,
      "coChangedFiles": [
        {
          "path": "app/observatory.tsx",
          "count": 12
        },
        {
          "path": "tests/rendered-html.test.mjs",
          "count": 8
        },
        {
          "path": "app/generated/repo-data.ts",
          "count": 7
        },
        {
          "path": "scripts/analyze-repo.mjs",
          "count": 7
        },
        {
          "path": "README.md",
          "count": 3
        },
        {
          "path": "app/review/review-map.tsx",
          "count": 2
        },
        {
          "path": "scripts/analyze-diff.mjs",
          "count": 2
        },
        {
          "path": "tests/analyze-diff.test.mjs",
          "count": 2
        },
        {
          "path": "package.json",
          "count": 2
        },
        {
          "path": "app/review/page.tsx",
          "count": 1
        },
        {
          "path": "observatory.config.json",
          "count": 1
        },
        {
          "path": "package-lock.json",
          "count": 1
        }
      ],
      "nearbyTestChanges": [],
      "riskSignals": [
        "1 transitive dependent",
        "14 commits in the last 90 days"
      ],
      "changedSymbols": []
    },
    {
      "path": "app/observatory.tsx",
      "previousPath": null,
      "status": "modified",
      "additions": 2,
      "deletions": 0,
      "changedLineRanges": [
        {
          "start": 4,
          "end": 4
        },
        {
          "start": 242,
          "end": 242
        }
      ],
      "category": "runtime",
      "churnScore": 13,
      "history": {
        "commitsLast90Days": 13,
        "uniqueAuthors": 1,
        "recentBugFixCommits": 0
      },
      "ownership": [
        "Maria Dubyaga"
      ],
      "directDependents": [
        "app/page.tsx"
      ],
      "transitiveDependentCount": 1,
      "coChangedFiles": [
        {
          "path": "app/globals.css",
          "count": 12
        },
        {
          "path": "app/generated/repo-data.ts",
          "count": 8
        },
        {
          "path": "scripts/analyze-repo.mjs",
          "count": 8
        },
        {
          "path": "tests/rendered-html.test.mjs",
          "count": 7
        },
        {
          "path": "README.md",
          "count": 3
        },
        {
          "path": "package.json",
          "count": 3
        },
        {
          "path": "app/review/page.tsx",
          "count": 1
        },
        {
          "path": "app/review/review-map.tsx",
          "count": 1
        },
        {
          "path": "observatory.config.json",
          "count": 1
        },
        {
          "path": "scripts/analyze-diff.mjs",
          "count": 1
        },
        {
          "path": "tests/analyze-diff.test.mjs",
          "count": 1
        },
        {
          "path": "package-lock.json",
          "count": 1
        }
      ],
      "nearbyTestChanges": [],
      "riskSignals": [
        "runtime source changed",
        "1 transitive dependent",
        "13 commits in the last 90 days",
        "no nearby test file changed"
      ],
      "changedSymbols": [
        {
          "file": "app/observatory.tsx",
          "name": "Observatory",
          "kind": "function",
          "changeType": "modified",
          "exported": true,
          "changedLines": [
            242
          ],
          "directConsumers": [
            {
              "file": "app/page.tsx",
              "symbol": "Home"
            }
          ]
        }
      ]
    },
    {
      "path": "app/review/page.tsx",
      "previousPath": null,
      "status": "added",
      "additions": 11,
      "deletions": 0,
      "changedLineRanges": [
        {
          "start": 1,
          "end": 11
        }
      ],
      "category": "runtime",
      "churnScore": 1,
      "history": {
        "commitsLast90Days": 1,
        "uniqueAuthors": 1,
        "recentBugFixCommits": 0
      },
      "ownership": [
        "Maria Dubyaga"
      ],
      "directDependents": [],
      "transitiveDependentCount": 0,
      "coChangedFiles": [
        {
          "path": "README.md",
          "count": 1
        },
        {
          "path": "app/globals.css",
          "count": 1
        },
        {
          "path": "app/observatory.tsx",
          "count": 1
        },
        {
          "path": "app/review/review-map.tsx",
          "count": 1
        },
        {
          "path": "observatory.config.json",
          "count": 1
        },
        {
          "path": "package.json",
          "count": 1
        },
        {
          "path": "scripts/analyze-diff.mjs",
          "count": 1
        },
        {
          "path": "tests/analyze-diff.test.mjs",
          "count": 1
        },
        {
          "path": "tests/rendered-html.test.mjs",
          "count": 1
        }
      ],
      "nearbyTestChanges": [],
      "riskSignals": [
        "runtime source changed",
        "1 commit in the last 90 days",
        "no nearby test file changed"
      ],
      "changedSymbols": [
        {
          "file": "app/review/page.tsx",
          "name": "metadata",
          "kind": "variable",
          "changeType": "added",
          "exported": true,
          "changedLines": [
            4,
            5,
            6,
            7
          ],
          "directConsumers": []
        },
        {
          "file": "app/review/page.tsx",
          "name": "ReviewPage",
          "kind": "function",
          "changeType": "added",
          "exported": true,
          "changedLines": [
            9,
            10,
            11
          ],
          "directConsumers": []
        }
      ]
    },
    {
      "path": "app/review/review-map.tsx",
      "previousPath": null,
      "status": "added",
      "additions": 182,
      "deletions": 0,
      "changedLineRanges": [
        {
          "start": 1,
          "end": 182
        }
      ],
      "category": "runtime",
      "churnScore": 2,
      "history": {
        "commitsLast90Days": 2,
        "uniqueAuthors": 1,
        "recentBugFixCommits": 0
      },
      "ownership": [
        "Maria Dubyaga"
      ],
      "directDependents": [
        "app/review/page.tsx"
      ],
      "transitiveDependentCount": 1,
      "coChangedFiles": [
        {
          "path": "README.md",
          "count": 2
        },
        {
          "path": "app/globals.css",
          "count": 2
        },
        {
          "path": "scripts/analyze-diff.mjs",
          "count": 2
        },
        {
          "path": "tests/analyze-diff.test.mjs",
          "count": 2
        },
        {
          "path": "tests/rendered-html.test.mjs",
          "count": 2
        },
        {
          "path": "app/observatory.tsx",
          "count": 1
        },
        {
          "path": "app/review/page.tsx",
          "count": 1
        },
        {
          "path": "observatory.config.json",
          "count": 1
        },
        {
          "path": "package.json",
          "count": 1
        }
      ],
      "nearbyTestChanges": [],
      "riskSignals": [
        "runtime source changed",
        "1 transitive dependent",
        "2 commits in the last 90 days",
        "no nearby test file changed"
      ],
      "changedSymbols": [
        {
          "file": "app/review/review-map.tsx",
          "name": "Priority",
          "kind": "type",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            7
          ],
          "directConsumers": []
        },
        {
          "file": "app/review/review-map.tsx",
          "name": "ChangedSymbol",
          "kind": "type",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16
          ],
          "directConsumers": []
        },
        {
          "file": "app/review/review-map.tsx",
          "name": "ReviewUnit",
          "kind": "type",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            25,
            26,
            27,
            28
          ],
          "directConsumers": []
        },
        {
          "file": "app/review/review-map.tsx",
          "name": "units",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            30
          ],
          "directConsumers": []
        },
        {
          "file": "app/review/review-map.tsx",
          "name": "label",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            32,
            33,
            34
          ],
          "directConsumers": []
        },
        {
          "file": "app/review/review-map.tsx",
          "name": "ReviewMap",
          "kind": "function",
          "changeType": "added",
          "exported": true,
          "changedLines": [
            36,
            37,
            38,
            39,
            40,
            41,
            42,
            43,
            44,
            45,
            46,
            47,
            48,
            49,
            50,
            51,
            52,
            53,
            54,
            55,
            56,
            57,
            58,
            59,
            60,
            61,
            62,
            63,
            64,
            65,
            66,
            67,
            68,
            69,
            70,
            71,
            72,
            73,
            74,
            75,
            76,
            77,
            78,
            79,
            80,
            81,
            82,
            83,
            84,
            85,
            86,
            87,
            88,
            89,
            90,
            91,
            92,
            93,
            94,
            95,
            96,
            97,
            98,
            99,
            100,
            101,
            102,
            103,
            104,
            105,
            106,
            107,
            108,
            109,
            110,
            111,
            112,
            113,
            114,
            115,
            116,
            117,
            118,
            119,
            120,
            121,
            122,
            123,
            124,
            125,
            126,
            127,
            128,
            129,
            130,
            131,
            132,
            133,
            134,
            135,
            136,
            137,
            138,
            139,
            140,
            141,
            142,
            143,
            144,
            145,
            146,
            147,
            148,
            149,
            150,
            151,
            152,
            153,
            154,
            155,
            156,
            157,
            158,
            159,
            160,
            161,
            162,
            163,
            164,
            165,
            166,
            167,
            168,
            169,
            170,
            171,
            172,
            173,
            174,
            175,
            176,
            177,
            178,
            179,
            180,
            181,
            182
          ],
          "directConsumers": [
            {
              "file": "app/review/page.tsx",
              "symbol": "ReviewPage"
            }
          ]
        }
      ]
    },
    {
      "path": "bin/observatory.mjs",
      "previousPath": null,
      "status": "added",
      "additions": 19,
      "deletions": 0,
      "changedLineRanges": [
        {
          "start": 1,
          "end": 19
        }
      ],
      "category": "runtime",
      "churnScore": 2,
      "history": {
        "commitsLast90Days": 2,
        "uniqueAuthors": 1,
        "recentBugFixCommits": 0
      },
      "ownership": [
        "Maria Dubyaga"
      ],
      "directDependents": [],
      "transitiveDependentCount": 0,
      "coChangedFiles": [
        {
          "path": "README.md",
          "count": 2
        },
        {
          "path": "docs/IMPACT_SCHEMA.md",
          "count": 2
        },
        {
          "path": "scripts/impact.mjs",
          "count": 2
        },
        {
          "path": "tests/impact.test.mjs",
          "count": 2
        },
        {
          "path": "docs/AGENT_WORKFLOW.md",
          "count": 1
        },
        {
          "path": "scripts/analyze-diff.mjs",
          "count": 1
        },
        {
          "path": "package-lock.json",
          "count": 1
        },
        {
          "path": "package.json",
          "count": 1
        }
      ],
      "nearbyTestChanges": [],
      "riskSignals": [
        "runtime source changed",
        "2 commits in the last 90 days",
        "no nearby test file changed"
      ],
      "changedSymbols": [
        {
          "file": "bin/observatory.mjs",
          "name": "root",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            7
          ],
          "directConsumers": []
        },
        {
          "file": "bin/observatory.mjs",
          "name": "[command, ...args]",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            8
          ],
          "directConsumers": []
        }
      ]
    },
    {
      "path": "docs/AGENT_WORKFLOW.md",
      "previousPath": null,
      "status": "added",
      "additions": 25,
      "deletions": 0,
      "changedLineRanges": [
        {
          "start": 1,
          "end": 25
        }
      ],
      "category": "docs",
      "churnScore": 1,
      "history": {
        "commitsLast90Days": 1,
        "uniqueAuthors": 1,
        "recentBugFixCommits": 0
      },
      "ownership": [
        "Maria Dubyaga"
      ],
      "directDependents": [],
      "transitiveDependentCount": 0,
      "coChangedFiles": [
        {
          "path": "README.md",
          "count": 1
        },
        {
          "path": "bin/observatory.mjs",
          "count": 1
        },
        {
          "path": "docs/IMPACT_SCHEMA.md",
          "count": 1
        },
        {
          "path": "scripts/analyze-diff.mjs",
          "count": 1
        },
        {
          "path": "scripts/impact.mjs",
          "count": 1
        },
        {
          "path": "tests/impact.test.mjs",
          "count": 1
        }
      ],
      "nearbyTestChanges": [],
      "riskSignals": [
        "1 commit in the last 90 days"
      ],
      "changedSymbols": []
    },
    {
      "path": "docs/IMPACT_SCHEMA.md",
      "previousPath": null,
      "status": "added",
      "additions": 57,
      "deletions": 0,
      "changedLineRanges": [
        {
          "start": 1,
          "end": 57
        }
      ],
      "category": "docs",
      "churnScore": 2,
      "history": {
        "commitsLast90Days": 2,
        "uniqueAuthors": 1,
        "recentBugFixCommits": 0
      },
      "ownership": [
        "Maria Dubyaga"
      ],
      "directDependents": [],
      "transitiveDependentCount": 0,
      "coChangedFiles": [
        {
          "path": "README.md",
          "count": 2
        },
        {
          "path": "bin/observatory.mjs",
          "count": 2
        },
        {
          "path": "scripts/impact.mjs",
          "count": 2
        },
        {
          "path": "tests/impact.test.mjs",
          "count": 2
        },
        {
          "path": "docs/AGENT_WORKFLOW.md",
          "count": 1
        },
        {
          "path": "scripts/analyze-diff.mjs",
          "count": 1
        },
        {
          "path": "package-lock.json",
          "count": 1
        },
        {
          "path": "package.json",
          "count": 1
        }
      ],
      "nearbyTestChanges": [],
      "riskSignals": [
        "2 commits in the last 90 days"
      ],
      "changedSymbols": []
    },
    {
      "path": "experiments/METHODOLOGY.md",
      "previousPath": null,
      "status": "added",
      "additions": 46,
      "deletions": 0,
      "changedLineRanges": [
        {
          "start": 1,
          "end": 46
        }
      ],
      "category": "docs",
      "churnScore": 1,
      "history": {
        "commitsLast90Days": 1,
        "uniqueAuthors": 1,
        "recentBugFixCommits": 0
      },
      "ownership": [
        "Maria Dubyaga"
      ],
      "directDependents": [],
      "transitiveDependentCount": 0,
      "coChangedFiles": [
        {
          "path": "README.md",
          "count": 1
        },
        {
          "path": "experiments/REPORT.md",
          "count": 1
        },
        {
          "path": "experiments/review-study.json",
          "count": 1
        },
        {
          "path": "package.json",
          "count": 1
        },
        {
          "path": "scripts/review-study.mjs",
          "count": 1
        },
        {
          "path": "tests/review-study.test.mjs",
          "count": 1
        }
      ],
      "nearbyTestChanges": [],
      "riskSignals": [
        "1 commit in the last 90 days"
      ],
      "changedSymbols": []
    },
    {
      "path": "experiments/REPORT.md",
      "previousPath": null,
      "status": "added",
      "additions": 21,
      "deletions": 0,
      "changedLineRanges": [
        {
          "start": 1,
          "end": 21
        }
      ],
      "category": "docs",
      "churnScore": 1,
      "history": {
        "commitsLast90Days": 1,
        "uniqueAuthors": 1,
        "recentBugFixCommits": 0
      },
      "ownership": [
        "Maria Dubyaga"
      ],
      "directDependents": [],
      "transitiveDependentCount": 0,
      "coChangedFiles": [
        {
          "path": "README.md",
          "count": 1
        },
        {
          "path": "experiments/METHODOLOGY.md",
          "count": 1
        },
        {
          "path": "experiments/review-study.json",
          "count": 1
        },
        {
          "path": "package.json",
          "count": 1
        },
        {
          "path": "scripts/review-study.mjs",
          "count": 1
        },
        {
          "path": "tests/review-study.test.mjs",
          "count": 1
        }
      ],
      "nearbyTestChanges": [],
      "riskSignals": [
        "1 commit in the last 90 days"
      ],
      "changedSymbols": []
    },
    {
      "path": "experiments/review-study.json",
      "previousPath": null,
      "status": "added",
      "additions": 4,
      "deletions": 0,
      "changedLineRanges": [
        {
          "start": 1,
          "end": 4
        }
      ],
      "category": "unknown",
      "churnScore": 1,
      "history": {
        "commitsLast90Days": 1,
        "uniqueAuthors": 1,
        "recentBugFixCommits": 0
      },
      "ownership": [
        "Maria Dubyaga"
      ],
      "directDependents": [],
      "transitiveDependentCount": 0,
      "coChangedFiles": [
        {
          "path": "README.md",
          "count": 1
        },
        {
          "path": "experiments/METHODOLOGY.md",
          "count": 1
        },
        {
          "path": "experiments/REPORT.md",
          "count": 1
        },
        {
          "path": "package.json",
          "count": 1
        },
        {
          "path": "scripts/review-study.mjs",
          "count": 1
        },
        {
          "path": "tests/review-study.test.mjs",
          "count": 1
        }
      ],
      "nearbyTestChanges": [],
      "riskSignals": [
        "1 commit in the last 90 days"
      ],
      "changedSymbols": []
    },
    {
      "path": "observatory.config.json",
      "previousPath": null,
      "status": "added",
      "additions": 11,
      "deletions": 0,
      "changedLineRanges": [
        {
          "start": 1,
          "end": 11
        }
      ],
      "category": "unknown",
      "churnScore": 2,
      "history": {
        "commitsLast90Days": 2,
        "uniqueAuthors": 1,
        "recentBugFixCommits": 0
      },
      "ownership": [
        "Maria Dubyaga"
      ],
      "directDependents": [],
      "transitiveDependentCount": 0,
      "coChangedFiles": [
        {
          "path": "README.md",
          "count": 2
        },
        {
          "path": "scripts/analyze-diff.mjs",
          "count": 2
        },
        {
          "path": "tests/rendered-html.test.mjs",
          "count": 2
        },
        {
          "path": "app/globals.css",
          "count": 1
        },
        {
          "path": "app/observatory.tsx",
          "count": 1
        },
        {
          "path": "app/review/page.tsx",
          "count": 1
        },
        {
          "path": "app/review/review-map.tsx",
          "count": 1
        },
        {
          "path": "package.json",
          "count": 1
        },
        {
          "path": "tests/analyze-diff.test.mjs",
          "count": 1
        }
      ],
      "nearbyTestChanges": [],
      "riskSignals": [
        "2 commits in the last 90 days"
      ],
      "changedSymbols": []
    },
    {
      "path": "package-lock.json",
      "previousPath": null,
      "status": "modified",
      "additions": 3,
      "deletions": 0,
      "changedLineRanges": [
        {
          "start": 10,
          "end": 12
        }
      ],
      "category": "config",
      "churnScore": 2,
      "history": {
        "commitsLast90Days": 2,
        "uniqueAuthors": 1,
        "recentBugFixCommits": 0
      },
      "ownership": [
        "Maria Dubyaga"
      ],
      "directDependents": [],
      "transitiveDependentCount": 0,
      "coChangedFiles": [
        {
          "path": "README.md",
          "count": 2
        },
        {
          "path": "package.json",
          "count": 2
        },
        {
          "path": "bin/observatory.mjs",
          "count": 1
        },
        {
          "path": "docs/IMPACT_SCHEMA.md",
          "count": 1
        },
        {
          "path": "scripts/impact.mjs",
          "count": 1
        },
        {
          "path": "tests/impact.test.mjs",
          "count": 1
        },
        {
          "path": "app/globals.css",
          "count": 1
        },
        {
          "path": "app/observatory.tsx",
          "count": 1
        },
        {
          "path": "tests/rendered-html.test.mjs",
          "count": 1
        }
      ],
      "nearbyTestChanges": [],
      "riskSignals": [
        "2 commits in the last 90 days"
      ],
      "changedSymbols": []
    },
    {
      "path": "package.json",
      "previousPath": null,
      "status": "modified",
      "additions": 7,
      "deletions": 1,
      "changedLineRanges": [
        {
          "start": 5,
          "end": 7
        },
        {
          "start": 13,
          "end": 15
        },
        {
          "start": 19,
          "end": 19
        }
      ],
      "category": "config",
      "churnScore": 5,
      "history": {
        "commitsLast90Days": 5,
        "uniqueAuthors": 1,
        "recentBugFixCommits": 0
      },
      "ownership": [
        "Maria Dubyaga"
      ],
      "directDependents": [],
      "transitiveDependentCount": 0,
      "coChangedFiles": [
        {
          "path": "README.md",
          "count": 5
        },
        {
          "path": "app/observatory.tsx",
          "count": 3
        },
        {
          "path": "package-lock.json",
          "count": 2
        },
        {
          "path": "app/globals.css",
          "count": 2
        },
        {
          "path": "tests/rendered-html.test.mjs",
          "count": 2
        },
        {
          "path": "bin/observatory.mjs",
          "count": 1
        },
        {
          "path": "docs/IMPACT_SCHEMA.md",
          "count": 1
        },
        {
          "path": "scripts/impact.mjs",
          "count": 1
        },
        {
          "path": "tests/impact.test.mjs",
          "count": 1
        },
        {
          "path": "experiments/METHODOLOGY.md",
          "count": 1
        },
        {
          "path": "experiments/REPORT.md",
          "count": 1
        },
        {
          "path": "experiments/review-study.json",
          "count": 1
        },
        {
          "path": "scripts/review-study.mjs",
          "count": 1
        },
        {
          "path": "tests/review-study.test.mjs",
          "count": 1
        },
        {
          "path": "app/review/page.tsx",
          "count": 1
        },
        {
          "path": "app/review/review-map.tsx",
          "count": 1
        },
        {
          "path": "observatory.config.json",
          "count": 1
        },
        {
          "path": "scripts/analyze-diff.mjs",
          "count": 1
        },
        {
          "path": "tests/analyze-diff.test.mjs",
          "count": 1
        },
        {
          "path": "app/generated/repo-data.ts",
          "count": 1
        },
        {
          "path": "scripts/analyze-repo.mjs",
          "count": 1
        }
      ],
      "nearbyTestChanges": [],
      "riskSignals": [
        "5 commits in the last 90 days"
      ],
      "changedSymbols": []
    },
    {
      "path": "scripts/analyze-diff.mjs",
      "previousPath": null,
      "status": "added",
      "additions": 695,
      "deletions": 0,
      "changedLineRanges": [
        {
          "start": 1,
          "end": 695
        }
      ],
      "category": "runtime",
      "churnScore": 5,
      "history": {
        "commitsLast90Days": 5,
        "uniqueAuthors": 1,
        "recentBugFixCommits": 0
      },
      "ownership": [
        "Maria Dubyaga"
      ],
      "directDependents": [],
      "transitiveDependentCount": 0,
      "coChangedFiles": [
        {
          "path": "README.md",
          "count": 4
        },
        {
          "path": "tests/rendered-html.test.mjs",
          "count": 3
        },
        {
          "path": "app/globals.css",
          "count": 2
        },
        {
          "path": "app/review/review-map.tsx",
          "count": 2
        },
        {
          "path": "tests/analyze-diff.test.mjs",
          "count": 2
        },
        {
          "path": "observatory.config.json",
          "count": 2
        },
        {
          "path": "bin/observatory.mjs",
          "count": 1
        },
        {
          "path": "docs/AGENT_WORKFLOW.md",
          "count": 1
        },
        {
          "path": "docs/IMPACT_SCHEMA.md",
          "count": 1
        },
        {
          "path": "scripts/impact.mjs",
          "count": 1
        },
        {
          "path": "tests/impact.test.mjs",
          "count": 1
        },
        {
          "path": "app/observatory.tsx",
          "count": 1
        },
        {
          "path": "app/review/page.tsx",
          "count": 1
        },
        {
          "path": "package.json",
          "count": 1
        }
      ],
      "nearbyTestChanges": [
        "tests/analyze-diff.test.mjs"
      ],
      "riskSignals": [
        "runtime source changed",
        "5 commits in the last 90 days"
      ],
      "changedSymbols": [
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "scriptDir",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            8
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "projectRoot",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            9
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "argv",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            10
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "option",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            12,
            13,
            14,
            15
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "optionNames",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            17
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "positional",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            18,
            19,
            20,
            21
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "range",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            22
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "workingTree",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            23
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "repoArgument",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            24
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "outputPath",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            25,
            26,
            27
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "configPath",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            28,
            29,
            30
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "git",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            32,
            33,
            34,
            35,
            36,
            37,
            38,
            39
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "toPosix",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            41,
            42,
            43
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "globRegex",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            45,
            46,
            47,
            48,
            49,
            50,
            51,
            52,
            53,
            54,
            55,
            56,
            57
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "defaultConfig",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            59,
            60,
            61,
            62,
            63,
            64
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "userConfig",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            66
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "config",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            72
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "generatedMatchers",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            73
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "gitRoot",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            75
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "repoPrefix",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            76
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "pathspec",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            77
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "relativeOutput",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            78
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "outputIsInsideRepo",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            79
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "[requestedBaseRef, requestedHeadRef]",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            80,
            81,
            82,
            83,
            84
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "diffHeadCommit",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            85
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "diffBaseCommit",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            86,
            87,
            88,
            89,
            90
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "diffComparison",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            91
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "relativeToRepo",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            99,
            100,
            101,
            102
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "parseNameStatus",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            104,
            105,
            106,
            107,
            108,
            109,
            110,
            111,
            112,
            113,
            114,
            115,
            116,
            117,
            118,
            119
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "parseNumstat",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            121,
            122,
            123,
            124,
            125,
            126,
            127,
            128,
            129,
            130,
            131,
            132,
            133,
            134,
            135,
            136,
            137,
            138,
            139
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "nameEntries",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            141,
            142,
            143
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "numstat",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            144,
            145,
            146
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "classify",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            167,
            168,
            169,
            170,
            171,
            172,
            173,
            174,
            175,
            176,
            177,
            178,
            179,
            180,
            181
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "showAtRef",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            183,
            184,
            185,
            186,
            187,
            188,
            189,
            190
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "showAtHead",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            192,
            193,
            194,
            195,
            196,
            197,
            198,
            199,
            200,
            201
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "allTracked",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            203,
            204,
            205,
            206,
            207,
            208,
            209
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "trackedSet",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            210,
            211,
            212,
            213
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "resolveImport",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            215,
            216,
            217,
            218,
            219,
            220
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "importsFor",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            222,
            223,
            224,
            225,
            226,
            227,
            228,
            229,
            230,
            231,
            232,
            233,
            234,
            235,
            236,
            237
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "scriptKind",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            239,
            240,
            241,
            242,
            243,
            244
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "isExported",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            246,
            247,
            248,
            249,
            250
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "isDefaultExported",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            252,
            253,
            254
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "nodeName",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            256,
            257,
            258,
            259
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "symbolInventory",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            261,
            262,
            263,
            264,
            265,
            266,
            267,
            268,
            269,
            270,
            271,
            272,
            273,
            274,
            275,
            276,
            277,
            278,
            279,
            280,
            281,
            282,
            283,
            284,
            285,
            286,
            287,
            288,
            289,
            290,
            291,
            292,
            293,
            294,
            295,
            296,
            297,
            298,
            299,
            300,
            301
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "importBindings",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            303,
            304,
            305,
            306,
            307,
            308,
            309,
            310,
            311,
            312,
            313,
            314,
            315,
            316,
            317,
            318,
            319,
            320,
            321,
            322,
            323,
            324,
            325,
            326,
            327,
            328,
            329,
            330,
            331,
            332,
            333
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "linesWithin",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            335,
            336,
            337,
            338,
            339,
            340,
            341
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "importGraph",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            343
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "reverseGraph",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            344
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "bindingsByDependency",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            345
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "headSymbolsByFile",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            346
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "transitiveDependents",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            360,
            361,
            362,
            363,
            364,
            365,
            366,
            367,
            368,
            369,
            370,
            371,
            372,
            373
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "repositoryOutput",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            375
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "historyComparison",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            376
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "latestRelevantCommit",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            377,
            378,
            379,
            380,
            381
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "historyAnchorEpoch",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            382
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "historyStart",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            383
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "historyRaw",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            384,
            385,
            386,
            387
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "history",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            388
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "historyByFile",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            395,
            396,
            397
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "diffRanges",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            411,
            412,
            413,
            414,
            415,
            416,
            417,
            418,
            419,
            420,
            421,
            422,
            423,
            424,
            425,
            426,
            427,
            428,
            429
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "likelyTestMatches",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            431,
            432,
            433,
            434,
            435,
            436,
            437,
            438,
            439,
            440
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "changedTests",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            442
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "rangesByPath",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            443
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "changedFiles",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            444,
            445,
            446,
            447,
            448,
            449,
            450,
            451,
            452,
            453,
            454,
            455,
            456,
            457,
            458,
            459,
            460,
            461,
            462,
            463,
            464,
            465,
            466,
            467,
            468,
            469,
            470,
            471,
            472,
            473,
            474,
            475,
            476,
            477,
            478,
            479,
            480,
            481,
            482
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "containingConsumerSymbols",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            484,
            485,
            486,
            487,
            488,
            489,
            490,
            491,
            492,
            493,
            494,
            495,
            496,
            497,
            498,
            499,
            500,
            501,
            502,
            503,
            504,
            505,
            506,
            507,
            508,
            509,
            510,
            511
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "directConsumersFor",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            513,
            514,
            515,
            516,
            517,
            518,
            519,
            520,
            521,
            522,
            523,
            524,
            525,
            526,
            527,
            528,
            529,
            530,
            531,
            532,
            533
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "changedSymbolsFor",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            535,
            536,
            537,
            538,
            539,
            540,
            541,
            542,
            543,
            544,
            545,
            546,
            547,
            548,
            549,
            550,
            551,
            552,
            553,
            554,
            555,
            556,
            557,
            558,
            559,
            560,
            561,
            562,
            563,
            564,
            565,
            566,
            567,
            568,
            569,
            570,
            571,
            572,
            573,
            574,
            575,
            576,
            577,
            578,
            579,
            580,
            581,
            582
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "changedByPath",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            589
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "runtimeFiles",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            590
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "adjacency",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            591
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "components",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            607
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "visited",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            608
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "commonTitle",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            623,
            624,
            625,
            626,
            627,
            628
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "reviewUnits",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            630,
            631,
            632,
            633,
            634,
            635,
            636,
            637,
            638,
            639,
            640,
            641,
            642,
            643,
            644,
            645,
            646,
            647,
            648,
            649,
            650,
            651,
            652,
            653,
            654,
            655,
            656
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "priorityOrder",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            676
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "summary",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            678,
            679,
            680,
            681,
            682,
            683,
            684,
            685,
            686,
            687
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "baseRef",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            688
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "headRef",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            689
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "diffReviewMap",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            690
          ],
          "directConsumers": []
        }
      ]
    },
    {
      "path": "scripts/analyze-repo.mjs",
      "previousPath": null,
      "status": "modified",
      "additions": 13,
      "deletions": 6,
      "changedLineRanges": [
        {
          "start": 125,
          "end": 125
        },
        {
          "start": 153,
          "end": 153
        },
        {
          "start": 248,
          "end": 255
        },
        {
          "start": 894,
          "end": 894
        },
        {
          "start": 970,
          "end": 970
        },
        {
          "start": 1128,
          "end": 1128
        }
      ],
      "category": "runtime",
      "churnScore": 10,
      "history": {
        "commitsLast90Days": 10,
        "uniqueAuthors": 1,
        "recentBugFixCommits": 0
      },
      "ownership": [
        "Maria Dubyaga"
      ],
      "directDependents": [],
      "transitiveDependentCount": 0,
      "coChangedFiles": [
        {
          "path": "app/generated/repo-data.ts",
          "count": 9
        },
        {
          "path": "app/observatory.tsx",
          "count": 8
        },
        {
          "path": "app/globals.css",
          "count": 7
        },
        {
          "path": "tests/rendered-html.test.mjs",
          "count": 4
        },
        {
          "path": "README.md",
          "count": 1
        },
        {
          "path": "package.json",
          "count": 1
        }
      ],
      "nearbyTestChanges": [],
      "riskSignals": [
        "runtime source changed",
        "10 commits in the last 90 days",
        "no nearby test file changed"
      ],
      "changedSymbols": [
        {
          "file": "scripts/analyze-repo.mjs",
          "name": "roleFor",
          "kind": "function",
          "changeType": "modified",
          "exported": false,
          "changedLines": [
            125
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-repo.mjs",
          "name": "adapterFor",
          "kind": "function",
          "changeType": "modified",
          "exported": false,
          "changedLines": [
            153
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-repo.mjs",
          "name": "dbtBuildCommand",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            248,
            249,
            250,
            251,
            252,
            253,
            254
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-repo.mjs",
          "name": "commandForReview",
          "kind": "function",
          "changeType": "modified",
          "exported": false,
          "changedLines": [
            894
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-repo.mjs",
          "name": "reviewActions",
          "kind": "function",
          "changeType": "modified",
          "exported": false,
          "changedLines": [
            970
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-repo.mjs",
          "name": "repoData",
          "kind": "variable",
          "changeType": "modified",
          "exported": false,
          "changedLines": [
            1128
          ],
          "directConsumers": []
        }
      ]
    },
    {
      "path": "scripts/impact.mjs",
      "previousPath": null,
      "status": "added",
      "additions": 213,
      "deletions": 0,
      "changedLineRanges": [
        {
          "start": 1,
          "end": 213
        }
      ],
      "category": "runtime",
      "churnScore": 2,
      "history": {
        "commitsLast90Days": 2,
        "uniqueAuthors": 1,
        "recentBugFixCommits": 0
      },
      "ownership": [
        "Maria Dubyaga"
      ],
      "directDependents": [],
      "transitiveDependentCount": 0,
      "coChangedFiles": [
        {
          "path": "README.md",
          "count": 2
        },
        {
          "path": "bin/observatory.mjs",
          "count": 2
        },
        {
          "path": "docs/IMPACT_SCHEMA.md",
          "count": 2
        },
        {
          "path": "tests/impact.test.mjs",
          "count": 2
        },
        {
          "path": "docs/AGENT_WORKFLOW.md",
          "count": 1
        },
        {
          "path": "scripts/analyze-diff.mjs",
          "count": 1
        },
        {
          "path": "package-lock.json",
          "count": 1
        },
        {
          "path": "package.json",
          "count": 1
        }
      ],
      "nearbyTestChanges": [
        "tests/impact.test.mjs"
      ],
      "riskSignals": [
        "runtime source changed",
        "2 commits in the last 90 days"
      ],
      "changedSymbols": [
        {
          "file": "scripts/impact.mjs",
          "name": "scriptDir",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            7
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/impact.mjs",
          "name": "projectRoot",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            8
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/impact.mjs",
          "name": "args",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            9
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/impact.mjs",
          "name": "option",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            11,
            12,
            13,
            14
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/impact.mjs",
          "name": "git",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            16,
            17,
            18
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/impact.mjs",
          "name": "parseGenerated",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            20,
            21,
            22
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/impact.mjs",
          "name": "symbolKey",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            24,
            25,
            26
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/impact.mjs",
          "name": "workingTree",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            28
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/impact.mjs",
          "name": "baseRef",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            29
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/impact.mjs",
          "name": "headRef",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            30
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/impact.mjs",
          "name": "range",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            31
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/impact.mjs",
          "name": "repo",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            32
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/impact.mjs",
          "name": "temporaryDirectory",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            33
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/impact.mjs",
          "name": "generatedPath",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            34
          ],
          "directConsumers": []
        }
      ]
    },
    {
      "path": "scripts/review-study.mjs",
      "previousPath": null,
      "status": "added",
      "additions": 202,
      "deletions": 0,
      "changedLineRanges": [
        {
          "start": 1,
          "end": 202
        }
      ],
      "category": "runtime",
      "churnScore": 1,
      "history": {
        "commitsLast90Days": 1,
        "uniqueAuthors": 1,
        "recentBugFixCommits": 0
      },
      "ownership": [
        "Maria Dubyaga"
      ],
      "directDependents": [],
      "transitiveDependentCount": 0,
      "coChangedFiles": [
        {
          "path": "README.md",
          "count": 1
        },
        {
          "path": "experiments/METHODOLOGY.md",
          "count": 1
        },
        {
          "path": "experiments/REPORT.md",
          "count": 1
        },
        {
          "path": "experiments/review-study.json",
          "count": 1
        },
        {
          "path": "package.json",
          "count": 1
        },
        {
          "path": "tests/review-study.test.mjs",
          "count": 1
        }
      ],
      "nearbyTestChanges": [
        "tests/review-study.test.mjs"
      ],
      "riskSignals": [
        "runtime source changed",
        "1 commit in the last 90 days"
      ],
      "changedSymbols": [
        {
          "file": "scripts/review-study.mjs",
          "name": "scriptDir",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            7
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/review-study.mjs",
          "name": "projectRoot",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            8
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/review-study.mjs",
          "name": "args",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            9
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/review-study.mjs",
          "name": "command",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            10
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/review-study.mjs",
          "name": "option",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            12,
            13,
            14,
            15
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/review-study.mjs",
          "name": "required",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            17,
            18,
            19,
            20,
            21
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/review-study.mjs",
          "name": "metric",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            23,
            24,
            25,
            26,
            27
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/review-study.mjs",
          "name": "studyPath",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            29
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/review-study.mjs",
          "name": "loadStudy",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            31,
            32,
            33,
            34,
            35,
            36,
            37,
            38,
            39,
            40
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/review-study.mjs",
          "name": "saveStudy",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            42,
            43,
            44,
            45,
            46,
            47
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/review-study.mjs",
          "name": "git",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            49,
            50,
            51
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/review-study.mjs",
          "name": "parseGenerated",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            53,
            54,
            55
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/review-study.mjs",
          "name": "collect",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            57,
            58,
            59,
            60,
            61,
            62,
            63,
            64,
            65,
            66,
            67,
            68,
            69,
            70,
            71,
            72,
            73,
            74,
            75,
            76,
            77,
            78,
            79,
            80,
            81,
            82,
            83,
            84,
            85,
            86,
            87,
            88,
            89,
            90,
            91,
            92,
            93,
            94,
            95,
            96,
            97,
            98,
            99,
            100,
            101,
            102,
            103,
            104,
            105,
            106,
            107,
            108,
            109,
            110,
            111,
            112,
            113,
            114,
            115,
            116,
            117,
            118,
            119,
            120
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/review-study.mjs",
          "name": "session",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            122,
            123,
            124,
            125,
            126,
            127,
            128,
            129,
            130,
            131,
            132,
            133,
            134,
            135,
            136,
            137,
            138,
            139,
            140,
            141
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/review-study.mjs",
          "name": "average",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            143,
            144,
            145
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/review-study.mjs",
          "name": "formatNumber",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            147,
            148,
            149
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/review-study.mjs",
          "name": "report",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            151,
            152,
            153,
            154,
            155,
            156,
            157,
            158,
            159,
            160,
            161,
            162,
            163,
            164,
            165,
            166,
            167,
            168,
            169,
            170,
            171,
            172,
            173,
            174,
            175,
            176,
            177,
            178,
            179,
            180,
            181,
            182,
            183,
            184,
            185,
            186,
            187,
            188,
            189,
            190,
            191,
            192,
            193,
            194,
            195
          ],
          "directConsumers": []
        }
      ]
    },
    {
      "path": "tests/analyze-diff.test.mjs",
      "previousPath": null,
      "status": "added",
      "additions": 80,
      "deletions": 0,
      "changedLineRanges": [
        {
          "start": 1,
          "end": 80
        }
      ],
      "category": "test",
      "churnScore": 2,
      "history": {
        "commitsLast90Days": 2,
        "uniqueAuthors": 1,
        "recentBugFixCommits": 0
      },
      "ownership": [
        "Maria Dubyaga"
      ],
      "directDependents": [],
      "transitiveDependentCount": 0,
      "coChangedFiles": [
        {
          "path": "README.md",
          "count": 2
        },
        {
          "path": "app/globals.css",
          "count": 2
        },
        {
          "path": "app/review/review-map.tsx",
          "count": 2
        },
        {
          "path": "scripts/analyze-diff.mjs",
          "count": 2
        },
        {
          "path": "tests/rendered-html.test.mjs",
          "count": 2
        },
        {
          "path": "app/observatory.tsx",
          "count": 1
        },
        {
          "path": "app/review/page.tsx",
          "count": 1
        },
        {
          "path": "observatory.config.json",
          "count": 1
        },
        {
          "path": "package.json",
          "count": 1
        }
      ],
      "nearbyTestChanges": [],
      "riskSignals": [
        "2 commits in the last 90 days"
      ],
      "changedSymbols": []
    },
    {
      "path": "tests/impact.test.mjs",
      "previousPath": null,
      "status": "added",
      "additions": 114,
      "deletions": 0,
      "changedLineRanges": [
        {
          "start": 1,
          "end": 114
        }
      ],
      "category": "test",
      "churnScore": 2,
      "history": {
        "commitsLast90Days": 2,
        "uniqueAuthors": 1,
        "recentBugFixCommits": 0
      },
      "ownership": [
        "Maria Dubyaga"
      ],
      "directDependents": [],
      "transitiveDependentCount": 0,
      "coChangedFiles": [
        {
          "path": "README.md",
          "count": 2
        },
        {
          "path": "bin/observatory.mjs",
          "count": 2
        },
        {
          "path": "docs/IMPACT_SCHEMA.md",
          "count": 2
        },
        {
          "path": "scripts/impact.mjs",
          "count": 2
        },
        {
          "path": "docs/AGENT_WORKFLOW.md",
          "count": 1
        },
        {
          "path": "scripts/analyze-diff.mjs",
          "count": 1
        },
        {
          "path": "package-lock.json",
          "count": 1
        },
        {
          "path": "package.json",
          "count": 1
        }
      ],
      "nearbyTestChanges": [],
      "riskSignals": [
        "2 commits in the last 90 days"
      ],
      "changedSymbols": []
    },
    {
      "path": "tests/rendered-html.test.mjs",
      "previousPath": null,
      "status": "modified",
      "additions": 24,
      "deletions": 4,
      "changedLineRanges": [
        {
          "start": 28,
          "end": 36
        },
        {
          "start": 74,
          "end": 88
        }
      ],
      "category": "test",
      "churnScore": 10,
      "history": {
        "commitsLast90Days": 10,
        "uniqueAuthors": 1,
        "recentBugFixCommits": 0
      },
      "ownership": [
        "Maria Dubyaga"
      ],
      "directDependents": [],
      "transitiveDependentCount": 0,
      "coChangedFiles": [
        {
          "path": "app/globals.css",
          "count": 8
        },
        {
          "path": "app/observatory.tsx",
          "count": 7
        },
        {
          "path": "app/generated/repo-data.ts",
          "count": 5
        },
        {
          "path": "README.md",
          "count": 4
        },
        {
          "path": "scripts/analyze-repo.mjs",
          "count": 4
        },
        {
          "path": "scripts/analyze-diff.mjs",
          "count": 3
        },
        {
          "path": "app/review/review-map.tsx",
          "count": 2
        },
        {
          "path": "tests/analyze-diff.test.mjs",
          "count": 2
        },
        {
          "path": "observatory.config.json",
          "count": 2
        },
        {
          "path": "package.json",
          "count": 2
        },
        {
          "path": "app/review/page.tsx",
          "count": 1
        },
        {
          "path": "package-lock.json",
          "count": 1
        }
      ],
      "nearbyTestChanges": [],
      "riskSignals": [
        "10 commits in the last 90 days"
      ],
      "changedSymbols": []
    },
    {
      "path": "tests/review-study.test.mjs",
      "previousPath": null,
      "status": "added",
      "additions": 53,
      "deletions": 0,
      "changedLineRanges": [
        {
          "start": 1,
          "end": 53
        }
      ],
      "category": "test",
      "churnScore": 1,
      "history": {
        "commitsLast90Days": 1,
        "uniqueAuthors": 1,
        "recentBugFixCommits": 0
      },
      "ownership": [
        "Maria Dubyaga"
      ],
      "directDependents": [],
      "transitiveDependentCount": 0,
      "coChangedFiles": [
        {
          "path": "README.md",
          "count": 1
        },
        {
          "path": "experiments/METHODOLOGY.md",
          "count": 1
        },
        {
          "path": "experiments/REPORT.md",
          "count": 1
        },
        {
          "path": "experiments/review-study.json",
          "count": 1
        },
        {
          "path": "package.json",
          "count": 1
        },
        {
          "path": "scripts/review-study.mjs",
          "count": 1
        }
      ],
      "nearbyTestChanges": [],
      "riskSignals": [
        "1 commit in the last 90 days"
      ],
      "changedSymbols": []
    }
  ],
  "reviewUnits": [
    {
      "id": "runtime-1",
      "title": "Observatory",
      "files": [
        "app/observatory.tsx",
        "scripts/analyze-repo.mjs"
      ],
      "reason": [
        "2 runtime files changed",
        "7 changed symbols",
        "1 externally used changed symbol",
        "1 direct symbol consumer affected",
        "1 downstream file at the broadest point",
        "2 runtime changes without a nearby test change",
        "grouped by imports or strong historical co-change"
      ],
      "blastRadius": 1,
      "untestedRuntimeFiles": [
        "app/observatory.tsx",
        "scripts/analyze-repo.mjs"
      ],
      "changedSymbols": [
        {
          "file": "app/observatory.tsx",
          "name": "Observatory",
          "kind": "function",
          "changeType": "modified",
          "exported": true,
          "changedLines": [
            242
          ],
          "directConsumers": [
            {
              "file": "app/page.tsx",
              "symbol": "Home"
            }
          ]
        },
        {
          "file": "scripts/analyze-repo.mjs",
          "name": "roleFor",
          "kind": "function",
          "changeType": "modified",
          "exported": false,
          "changedLines": [
            125
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-repo.mjs",
          "name": "adapterFor",
          "kind": "function",
          "changeType": "modified",
          "exported": false,
          "changedLines": [
            153
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-repo.mjs",
          "name": "dbtBuildCommand",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            248,
            249,
            250,
            251,
            252,
            253,
            254
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-repo.mjs",
          "name": "commandForReview",
          "kind": "function",
          "changeType": "modified",
          "exported": false,
          "changedLines": [
            894
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-repo.mjs",
          "name": "reviewActions",
          "kind": "function",
          "changeType": "modified",
          "exported": false,
          "changedLines": [
            970
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-repo.mjs",
          "name": "repoData",
          "kind": "variable",
          "changeType": "modified",
          "exported": false,
          "changedLines": [
            1128
          ],
          "directConsumers": []
        }
      ],
      "externallyUsedChangedSymbols": 1,
      "affectedConsumers": [
        "app/page.tsx"
      ],
      "priority": "medium"
    },
    {
      "id": "runtime-2",
      "title": "Page",
      "files": [
        "app/review/page.tsx",
        "app/review/review-map.tsx",
        "scripts/analyze-diff.mjs"
      ],
      "reason": [
        "3 runtime files changed",
        "87 changed symbols",
        "1 externally used changed symbol",
        "1 direct symbol consumer affected",
        "1 downstream file at the broadest point",
        "2 runtime changes without a nearby test change",
        "grouped by imports or strong historical co-change"
      ],
      "blastRadius": 1,
      "untestedRuntimeFiles": [
        "app/review/page.tsx",
        "app/review/review-map.tsx"
      ],
      "changedSymbols": [
        {
          "file": "app/review/page.tsx",
          "name": "metadata",
          "kind": "variable",
          "changeType": "added",
          "exported": true,
          "changedLines": [
            4,
            5,
            6,
            7
          ],
          "directConsumers": []
        },
        {
          "file": "app/review/page.tsx",
          "name": "ReviewPage",
          "kind": "function",
          "changeType": "added",
          "exported": true,
          "changedLines": [
            9,
            10,
            11
          ],
          "directConsumers": []
        },
        {
          "file": "app/review/review-map.tsx",
          "name": "Priority",
          "kind": "type",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            7
          ],
          "directConsumers": []
        },
        {
          "file": "app/review/review-map.tsx",
          "name": "ChangedSymbol",
          "kind": "type",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16
          ],
          "directConsumers": []
        },
        {
          "file": "app/review/review-map.tsx",
          "name": "ReviewUnit",
          "kind": "type",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            25,
            26,
            27,
            28
          ],
          "directConsumers": []
        },
        {
          "file": "app/review/review-map.tsx",
          "name": "units",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            30
          ],
          "directConsumers": []
        },
        {
          "file": "app/review/review-map.tsx",
          "name": "label",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            32,
            33,
            34
          ],
          "directConsumers": []
        },
        {
          "file": "app/review/review-map.tsx",
          "name": "ReviewMap",
          "kind": "function",
          "changeType": "added",
          "exported": true,
          "changedLines": [
            36,
            37,
            38,
            39,
            40,
            41,
            42,
            43,
            44,
            45,
            46,
            47,
            48,
            49,
            50,
            51,
            52,
            53,
            54,
            55,
            56,
            57,
            58,
            59,
            60,
            61,
            62,
            63,
            64,
            65,
            66,
            67,
            68,
            69,
            70,
            71,
            72,
            73,
            74,
            75,
            76,
            77,
            78,
            79,
            80,
            81,
            82,
            83,
            84,
            85,
            86,
            87,
            88,
            89,
            90,
            91,
            92,
            93,
            94,
            95,
            96,
            97,
            98,
            99,
            100,
            101,
            102,
            103,
            104,
            105,
            106,
            107,
            108,
            109,
            110,
            111,
            112,
            113,
            114,
            115,
            116,
            117,
            118,
            119,
            120,
            121,
            122,
            123,
            124,
            125,
            126,
            127,
            128,
            129,
            130,
            131,
            132,
            133,
            134,
            135,
            136,
            137,
            138,
            139,
            140,
            141,
            142,
            143,
            144,
            145,
            146,
            147,
            148,
            149,
            150,
            151,
            152,
            153,
            154,
            155,
            156,
            157,
            158,
            159,
            160,
            161,
            162,
            163,
            164,
            165,
            166,
            167,
            168,
            169,
            170,
            171,
            172,
            173,
            174,
            175,
            176,
            177,
            178,
            179,
            180,
            181,
            182
          ],
          "directConsumers": [
            {
              "file": "app/review/page.tsx",
              "symbol": "ReviewPage"
            }
          ]
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "scriptDir",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            8
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "projectRoot",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            9
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "argv",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            10
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "option",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            12,
            13,
            14,
            15
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "optionNames",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            17
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "positional",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            18,
            19,
            20,
            21
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "range",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            22
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "workingTree",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            23
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "repoArgument",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            24
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "outputPath",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            25,
            26,
            27
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "configPath",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            28,
            29,
            30
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "git",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            32,
            33,
            34,
            35,
            36,
            37,
            38,
            39
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "toPosix",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            41,
            42,
            43
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "globRegex",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            45,
            46,
            47,
            48,
            49,
            50,
            51,
            52,
            53,
            54,
            55,
            56,
            57
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "defaultConfig",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            59,
            60,
            61,
            62,
            63,
            64
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "userConfig",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            66
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "config",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            72
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "generatedMatchers",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            73
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "gitRoot",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            75
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "repoPrefix",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            76
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "pathspec",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            77
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "relativeOutput",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            78
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "outputIsInsideRepo",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            79
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "[requestedBaseRef, requestedHeadRef]",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            80,
            81,
            82,
            83,
            84
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "diffHeadCommit",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            85
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "diffBaseCommit",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            86,
            87,
            88,
            89,
            90
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "diffComparison",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            91
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "relativeToRepo",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            99,
            100,
            101,
            102
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "parseNameStatus",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            104,
            105,
            106,
            107,
            108,
            109,
            110,
            111,
            112,
            113,
            114,
            115,
            116,
            117,
            118,
            119
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "parseNumstat",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            121,
            122,
            123,
            124,
            125,
            126,
            127,
            128,
            129,
            130,
            131,
            132,
            133,
            134,
            135,
            136,
            137,
            138,
            139
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "nameEntries",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            141,
            142,
            143
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "numstat",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            144,
            145,
            146
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "classify",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            167,
            168,
            169,
            170,
            171,
            172,
            173,
            174,
            175,
            176,
            177,
            178,
            179,
            180,
            181
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "showAtRef",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            183,
            184,
            185,
            186,
            187,
            188,
            189,
            190
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "showAtHead",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            192,
            193,
            194,
            195,
            196,
            197,
            198,
            199,
            200,
            201
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "allTracked",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            203,
            204,
            205,
            206,
            207,
            208,
            209
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "trackedSet",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            210,
            211,
            212,
            213
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "resolveImport",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            215,
            216,
            217,
            218,
            219,
            220
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "importsFor",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            222,
            223,
            224,
            225,
            226,
            227,
            228,
            229,
            230,
            231,
            232,
            233,
            234,
            235,
            236,
            237
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "scriptKind",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            239,
            240,
            241,
            242,
            243,
            244
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "isExported",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            246,
            247,
            248,
            249,
            250
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "isDefaultExported",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            252,
            253,
            254
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "nodeName",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            256,
            257,
            258,
            259
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "symbolInventory",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            261,
            262,
            263,
            264,
            265,
            266,
            267,
            268,
            269,
            270,
            271,
            272,
            273,
            274,
            275,
            276,
            277,
            278,
            279,
            280,
            281,
            282,
            283,
            284,
            285,
            286,
            287,
            288,
            289,
            290,
            291,
            292,
            293,
            294,
            295,
            296,
            297,
            298,
            299,
            300,
            301
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "importBindings",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            303,
            304,
            305,
            306,
            307,
            308,
            309,
            310,
            311,
            312,
            313,
            314,
            315,
            316,
            317,
            318,
            319,
            320,
            321,
            322,
            323,
            324,
            325,
            326,
            327,
            328,
            329,
            330,
            331,
            332,
            333
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "linesWithin",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            335,
            336,
            337,
            338,
            339,
            340,
            341
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "importGraph",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            343
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "reverseGraph",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            344
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "bindingsByDependency",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            345
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "headSymbolsByFile",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            346
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "transitiveDependents",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            360,
            361,
            362,
            363,
            364,
            365,
            366,
            367,
            368,
            369,
            370,
            371,
            372,
            373
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "repositoryOutput",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            375
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "historyComparison",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            376
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "latestRelevantCommit",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            377,
            378,
            379,
            380,
            381
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "historyAnchorEpoch",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            382
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "historyStart",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            383
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "historyRaw",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            384,
            385,
            386,
            387
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "history",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            388
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "historyByFile",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            395,
            396,
            397
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "diffRanges",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            411,
            412,
            413,
            414,
            415,
            416,
            417,
            418,
            419,
            420,
            421,
            422,
            423,
            424,
            425,
            426,
            427,
            428,
            429
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "likelyTestMatches",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            431,
            432,
            433,
            434,
            435,
            436,
            437,
            438,
            439,
            440
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "changedTests",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            442
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "rangesByPath",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            443
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "changedFiles",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            444,
            445,
            446,
            447,
            448,
            449,
            450,
            451,
            452,
            453,
            454,
            455,
            456,
            457,
            458,
            459,
            460,
            461,
            462,
            463,
            464,
            465,
            466,
            467,
            468,
            469,
            470,
            471,
            472,
            473,
            474,
            475,
            476,
            477,
            478,
            479,
            480,
            481,
            482
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "containingConsumerSymbols",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            484,
            485,
            486,
            487,
            488,
            489,
            490,
            491,
            492,
            493,
            494,
            495,
            496,
            497,
            498,
            499,
            500,
            501,
            502,
            503,
            504,
            505,
            506,
            507,
            508,
            509,
            510,
            511
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "directConsumersFor",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            513,
            514,
            515,
            516,
            517,
            518,
            519,
            520,
            521,
            522,
            523,
            524,
            525,
            526,
            527,
            528,
            529,
            530,
            531,
            532,
            533
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "changedSymbolsFor",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            535,
            536,
            537,
            538,
            539,
            540,
            541,
            542,
            543,
            544,
            545,
            546,
            547,
            548,
            549,
            550,
            551,
            552,
            553,
            554,
            555,
            556,
            557,
            558,
            559,
            560,
            561,
            562,
            563,
            564,
            565,
            566,
            567,
            568,
            569,
            570,
            571,
            572,
            573,
            574,
            575,
            576,
            577,
            578,
            579,
            580,
            581,
            582
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "changedByPath",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            589
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "runtimeFiles",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            590
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "adjacency",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            591
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "components",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            607
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "visited",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            608
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "commonTitle",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            623,
            624,
            625,
            626,
            627,
            628
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "reviewUnits",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            630,
            631,
            632,
            633,
            634,
            635,
            636,
            637,
            638,
            639,
            640,
            641,
            642,
            643,
            644,
            645,
            646,
            647,
            648,
            649,
            650,
            651,
            652,
            653,
            654,
            655,
            656
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "priorityOrder",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            676
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "summary",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            678,
            679,
            680,
            681,
            682,
            683,
            684,
            685,
            686,
            687
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "baseRef",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            688
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "headRef",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            689
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/analyze-diff.mjs",
          "name": "diffReviewMap",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            690
          ],
          "directConsumers": []
        }
      ],
      "externallyUsedChangedSymbols": 1,
      "affectedConsumers": [
        "app/review/page.tsx"
      ],
      "priority": "medium"
    },
    {
      "id": "runtime-3",
      "title": "Observatory",
      "files": [
        "bin/observatory.mjs",
        "scripts/impact.mjs"
      ],
      "reason": [
        "2 runtime files changed",
        "16 changed symbols",
        "1 runtime change without a nearby test change",
        "grouped by imports or strong historical co-change"
      ],
      "blastRadius": 0,
      "untestedRuntimeFiles": [
        "bin/observatory.mjs"
      ],
      "changedSymbols": [
        {
          "file": "bin/observatory.mjs",
          "name": "root",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            7
          ],
          "directConsumers": []
        },
        {
          "file": "bin/observatory.mjs",
          "name": "[command, ...args]",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            8
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/impact.mjs",
          "name": "scriptDir",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            7
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/impact.mjs",
          "name": "projectRoot",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            8
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/impact.mjs",
          "name": "args",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            9
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/impact.mjs",
          "name": "option",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            11,
            12,
            13,
            14
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/impact.mjs",
          "name": "git",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            16,
            17,
            18
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/impact.mjs",
          "name": "parseGenerated",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            20,
            21,
            22
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/impact.mjs",
          "name": "symbolKey",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            24,
            25,
            26
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/impact.mjs",
          "name": "workingTree",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            28
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/impact.mjs",
          "name": "baseRef",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            29
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/impact.mjs",
          "name": "headRef",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            30
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/impact.mjs",
          "name": "range",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            31
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/impact.mjs",
          "name": "repo",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            32
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/impact.mjs",
          "name": "temporaryDirectory",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            33
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/impact.mjs",
          "name": "generatedPath",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            34
          ],
          "directConsumers": []
        }
      ],
      "externallyUsedChangedSymbols": 0,
      "affectedConsumers": [],
      "priority": "medium"
    },
    {
      "id": "runtime-4",
      "title": "Scripts",
      "files": [
        "scripts/review-study.mjs"
      ],
      "reason": [
        "1 runtime file changed",
        "17 changed symbols"
      ],
      "blastRadius": 0,
      "untestedRuntimeFiles": [],
      "changedSymbols": [
        {
          "file": "scripts/review-study.mjs",
          "name": "scriptDir",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            7
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/review-study.mjs",
          "name": "projectRoot",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            8
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/review-study.mjs",
          "name": "args",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            9
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/review-study.mjs",
          "name": "command",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            10
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/review-study.mjs",
          "name": "option",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            12,
            13,
            14,
            15
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/review-study.mjs",
          "name": "required",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            17,
            18,
            19,
            20,
            21
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/review-study.mjs",
          "name": "metric",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            23,
            24,
            25,
            26,
            27
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/review-study.mjs",
          "name": "studyPath",
          "kind": "variable",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            29
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/review-study.mjs",
          "name": "loadStudy",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            31,
            32,
            33,
            34,
            35,
            36,
            37,
            38,
            39,
            40
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/review-study.mjs",
          "name": "saveStudy",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            42,
            43,
            44,
            45,
            46,
            47
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/review-study.mjs",
          "name": "git",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            49,
            50,
            51
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/review-study.mjs",
          "name": "parseGenerated",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            53,
            54,
            55
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/review-study.mjs",
          "name": "collect",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            57,
            58,
            59,
            60,
            61,
            62,
            63,
            64,
            65,
            66,
            67,
            68,
            69,
            70,
            71,
            72,
            73,
            74,
            75,
            76,
            77,
            78,
            79,
            80,
            81,
            82,
            83,
            84,
            85,
            86,
            87,
            88,
            89,
            90,
            91,
            92,
            93,
            94,
            95,
            96,
            97,
            98,
            99,
            100,
            101,
            102,
            103,
            104,
            105,
            106,
            107,
            108,
            109,
            110,
            111,
            112,
            113,
            114,
            115,
            116,
            117,
            118,
            119,
            120
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/review-study.mjs",
          "name": "session",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            122,
            123,
            124,
            125,
            126,
            127,
            128,
            129,
            130,
            131,
            132,
            133,
            134,
            135,
            136,
            137,
            138,
            139,
            140,
            141
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/review-study.mjs",
          "name": "average",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            143,
            144,
            145
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/review-study.mjs",
          "name": "formatNumber",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            147,
            148,
            149
          ],
          "directConsumers": []
        },
        {
          "file": "scripts/review-study.mjs",
          "name": "report",
          "kind": "function",
          "changeType": "added",
          "exported": false,
          "changedLines": [
            151,
            152,
            153,
            154,
            155,
            156,
            157,
            158,
            159,
            160,
            161,
            162,
            163,
            164,
            165,
            166,
            167,
            168,
            169,
            170,
            171,
            172,
            173,
            174,
            175,
            176,
            177,
            178,
            179,
            180,
            181,
            182,
            183,
            184,
            185,
            186,
            187,
            188,
            189,
            190,
            191,
            192,
            193,
            194,
            195
          ],
          "directConsumers": []
        }
      ],
      "externallyUsedChangedSymbols": 0,
      "affectedConsumers": [],
      "priority": "medium"
    },
    {
      "id": "config",
      "title": "Configuration",
      "files": [
        "package-lock.json",
        "package.json"
      ],
      "reason": [
        "2 config files",
        "11 changed lines"
      ],
      "blastRadius": 0,
      "untestedRuntimeFiles": [],
      "changedSymbols": [],
      "externallyUsedChangedSymbols": 0,
      "affectedConsumers": [],
      "priority": "low"
    },
    {
      "id": "docs",
      "title": "Documentation",
      "files": [
        "README.md",
        "docs/AGENT_WORKFLOW.md",
        "docs/IMPACT_SCHEMA.md",
        "experiments/METHODOLOGY.md",
        "experiments/REPORT.md"
      ],
      "reason": [
        "5 docs files",
        "360 changed lines"
      ],
      "blastRadius": 0,
      "untestedRuntimeFiles": [],
      "changedSymbols": [],
      "externallyUsedChangedSymbols": 0,
      "affectedConsumers": [],
      "priority": "low"
    },
    {
      "id": "generated",
      "title": "Generated changes",
      "files": [
        "app/generated/repo-data.ts"
      ],
      "reason": [
        "1 generated file",
        "628 changed lines"
      ],
      "blastRadius": 0,
      "untestedRuntimeFiles": [],
      "changedSymbols": [],
      "externallyUsedChangedSymbols": 0,
      "affectedConsumers": [],
      "priority": "low"
    },
    {
      "id": "unknown",
      "title": "Other changes",
      "files": [
        "app/globals.css",
        "experiments/review-study.json",
        "observatory.config.json"
      ],
      "reason": [
        "3 unknown files",
        "174 changed lines"
      ],
      "blastRadius": 0,
      "untestedRuntimeFiles": [],
      "changedSymbols": [],
      "externallyUsedChangedSymbols": 0,
      "affectedConsumers": [],
      "priority": "low"
    },
    {
      "id": "test",
      "title": "Test changes",
      "files": [
        "tests/analyze-diff.test.mjs",
        "tests/impact.test.mjs",
        "tests/rendered-html.test.mjs",
        "tests/review-study.test.mjs"
      ],
      "reason": [
        "4 test files",
        "275 changed lines"
      ],
      "blastRadius": 0,
      "untestedRuntimeFiles": [],
      "changedSymbols": [],
      "externallyUsedChangedSymbols": 0,
      "affectedConsumers": [],
      "priority": "low"
    }
  ]
} as const;
