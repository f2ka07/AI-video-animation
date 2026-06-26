// Slide splits per course - synced from courses/{courseId}/slide-splits.json
// Run: npx tsx scripts/syncSlideSplitsToTs.ts
// Used by GenericModule at runtime (browser-compatible)

import type { SlideSplitsConfig } from "./expandSlidesWithSplits";

export const slideSplitsByCourse: Record<string, SlideSplitsConfig> = {
  "ai-in-automation-networks": {
    "ai-coding-workflows-plain-language": {
      "splitAt": [
        12.4,
        24.79
      ],
      "segments": [
        {
          "points": [
            "Before we open a model",
            "You describe the task and constraints in a structured",
            "Platform idempotency forbidden"
          ],
          "keyWords": [
            [
              "open",
              "model"
            ],
            [
              "ai",
              "describe",
              "task",
              "constraints"
            ],
            [
              "platform",
              "idempotency",
              "forbidden"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.15,
              "end": 1.57
            },
            {
              "start": 2.05,
              "end": 9.22
            },
            {
              "start": 10.75,
              "end": 12.51
            }
          ]
        },
        {
          "points": [
            "The model returns a draft A human engineer reads",
            "Only after that review do"
          ],
          "keyWords": [
            [
              "model",
              "returns",
              "draft",
              "human"
            ],
            [
              "review"
            ]
          ],
          "phraseTimes": [
            {
              "start": 12.51,
              "end": 20.91
            },
            {
              "start": 21.57,
              "end": 24.68
            }
          ]
        },
        {
          "points": [
            "Treat those steps as non — optional Skipping review",
            "YAML reaches production and breaks"
          ],
          "keyWords": [
            [
              "Treat",
              "steps",
              "non-optional",
              "Skipping"
            ],
            [
              "YAML",
              "reaches",
              "production",
              "breaks"
            ]
          ],
          "phraseTimes": [
            {
              "start": 25.959999,
              "end": 33.290001
            },
            {
              "start": 34.049999,
              "end": 36.950001
            }
          ]
        }
      ]
    },
    "benefits-of-ai-assisted-coding": {
      "splitAt": [
        11.75,
        23.5
      ],
      "segments": [
        {
          "points": [
            "Used well a model is a fast first pair",
            "It can draft the repetitive skeleton",
            "VLAN playbook suggest Ansible task structure"
          ],
          "keyWords": [
            [
              "ai",
              "well",
              "model",
              "fast"
            ],
            [
              "draft",
              "repetitive",
              "skeleton"
            ],
            [
              "VLAN",
              "playbook",
              "suggest",
              "Ansible"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.13,
              "end": 4.81
            },
            {
              "start": 5.32,
              "end": 7.78
            },
            {
              "start": 9.18,
              "end": 11.96
            }
          ]
        },
        {
          "points": [
            "You are new to a module or translate between",
            "JSON intent and YAML",
            "You are tired of indentation errors None of",
            "That removes"
          ],
          "keyWords": [
            [
              "new",
              "module",
              "translate"
            ],
            [
              "JSON",
              "intent",
              "YAML"
            ],
            [
              "tired",
              "indentation",
              "errors",
              "None"
            ],
            [
              "removes"
            ]
          ],
          "phraseTimes": [
            {
              "start": 12.04,
              "end": 15.51
            },
            {
              "start": 16.09,
              "end": 17.16
            },
            {
              "start": 17.959999,
              "end": 21.73
            },
            {
              "start": 22.290001,
              "end": 23.49
            }
          ]
        },
        {
          "points": [
            "The VLAN numbers",
            "The target devices still must come from inventory AI"
          ],
          "keyWords": [
            [
              "VLAN",
              "numbers"
            ],
            [
              "AI",
              "target",
              "devices",
              "still"
            ]
          ],
          "phraseTimes": [
            {
              "start": 23.639999,
              "end": 26.129999
            },
            {
              "start": 26.700001,
              "end": 35.07
            }
          ]
        }
      ]
    },
    "risks-privacy-ip-ownership": {
      "splitAt": [
        13.25,
        26.5
      ],
      "segments": [
        {
          "points": [
            "Speed without guardrails creates exposure you may not see",
            "CCNA lab Pasting a production running — config",
            "VPN details or credentials in comments Your"
          ],
          "keyWords": [
            [
              "Speed",
              "creates",
              "exposure",
              "without"
            ],
            [
              "CCNA",
              "lab",
              "Pasting",
              "production"
            ],
            [
              "VPN",
              "details",
              "credentials",
              "comments"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.09,
              "end": 3.36
            },
            {
              "start": 3.99,
              "end": 9.02
            },
            {
              "start": 9.52,
              "end": 13.61
            }
          ]
        },
        {
          "points": [
            "Employer may have rules about who owns generated code",
            "Models also invent APIs that sound"
          ],
          "keyWords": [
            [
              "employer",
              "rules",
              "about",
              "owns"
            ],
            [
              "Models",
              "also",
              "invent",
              "APIs"
            ]
          ],
          "phraseTimes": [
            {
              "start": 13.91,
              "end": 19.450001
            },
            {
              "start": 20.059999,
              "end": 26.469999
            }
          ]
        },
        {
          "points": [
            "The fix is the same",
            "Discipline you already practice validate before merge",
            "Correctness"
          ],
          "keyWords": [
            [
              "fix"
            ],
            [
              "discipline",
              "already",
              "practice",
              "validate"
            ],
            [
              "correctness"
            ]
          ],
          "phraseTimes": [
            {
              "start": 26.780001,
              "end": 32.439999
            },
            {
              "start": 33.73,
              "end": 37.209999
            },
            {
              "start": 37.66,
              "end": 39.43
            }
          ]
        }
      ]
    },
    "code-validation-after-generation": {
      "splitAt": [
        12.08,
        24.15
      ],
      "segments": [
        {
          "points": [
            "Here is the habit that separates a demo",
            "Run the same gates on AI output",
            "That you run on human — written playbooks",
            "Ansible — lint"
          ],
          "keyWords": [
            [
              "Here",
              "habit",
              "separates",
              "demo"
            ],
            [
              "Run",
              "gates",
              "AI",
              "output"
            ],
            [
              "run",
              "human-written",
              "playbooks"
            ],
            [
              "ansible-lint"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.1,
              "end": 4.58
            },
            {
              "start": 5.11,
              "end": 7.8
            },
            {
              "start": 8.29,
              "end": 10.09
            },
            {
              "start": 11.47,
              "end": 12.13
            }
          ]
        },
        {
          "points": [
            "Yamllint schema checks on intent files",
            "Store the prompt and the generated file"
          ],
          "keyWords": [
            [
              "yamllint",
              "schema",
              "checks",
              "intent"
            ],
            [
              "Store",
              "prompt",
              "generated",
              "file"
            ]
          ],
          "phraseTimes": [
            {
              "start": 13.36,
              "end": 16.41
            },
            {
              "start": 17.5,
              "end": 24.52
            }
          ]
        },
        {
          "points": [
            "If check mode fails you re — prompt",
            "YAML just to make the pipeline green"
          ],
          "keyWords": [
            [
              "If",
              "check",
              "mode",
              "fails"
            ],
            [
              "YAML",
              "make",
              "pipeline",
              "green"
            ]
          ],
          "phraseTimes": [
            {
              "start": 24.52,
              "end": 33.290001
            },
            {
              "start": 34.169998,
              "end": 36
            }
          ]
        }
      ]
    },
    "security-risks-ai-automation": {
      "splitAt": [
        11.87,
        23.74
      ],
      "segments": [
        {
          "points": [
            "New attack surfaces appear when models and tools enter",
            "Prompt injection tries to override your instructions inside user",
            "Over — privileged tools let an assistant"
          ],
          "keyWords": [
            [
              "New",
              "attack",
              "surfaces",
              "appear"
            ],
            [
              "Prompt",
              "injection",
              "tries",
              "override"
            ],
            [
              "Over-privileged",
              "tools",
              "let",
              "assistant"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.13,
              "end": 4.13
            },
            {
              "start": 4.63,
              "end": 8.62
            },
            {
              "start": 9.18,
              "end": 11.93
            }
          ]
        },
        {
          "points": [
            "Sensitive context sent to the wrong",
            "Generated scripts sometimes disable TLS verification"
          ],
          "keyWords": [
            [
              "Sensitive",
              "context",
              "sent",
              "wrong"
            ],
            [
              "Generated",
              "scripts",
              "sometimes",
              "disable"
            ]
          ],
          "phraseTimes": [
            {
              "start": 11.93,
              "end": 16.719999
            },
            {
              "start": 17.35,
              "end": 23.92
            }
          ]
        },
        {
          "points": [
            "API keys because the model pattern — matched insecure",
            "New attack surfaces appear when models and tools enter",
            "Prompt injection tries to override your instructions inside user",
            "Over — privileged tools let an assistant push configuration"
          ],
          "keyWords": [
            [
              "API",
              "keys",
              "because",
              "model"
            ]
          ],
          "phraseTimes": [
            {
              "start": 23.92,
              "end": 35.439999
            }
          ]
        }
      ]
    },
    "governance-for-ai-automation": {
      "splitAt": [
        8.95,
        17.89
      ],
      "segments": [
        {
          "points": [
            "Governance is how policy survives contact with a busy",
            "Publish which models and endpoints are approved, which data",
            "Align that with secret management from course three —",
            "The assistant is a power tool; your change process"
          ],
          "keyWords": [
            [
              "Governance",
              "policy",
              "survives",
              "contact"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.1,
              "end": 9.12
            }
          ]
        },
        {
          "points": [
            "Align that with secret management from course three —",
            "Governance is how policy survives contact with a busy",
            "Publish which models and endpoints are approved, which data",
            "The assistant is a power tool; your change process"
          ],
          "keyWords": [
            [
              "Align",
              "secret",
              "management",
              "course"
            ]
          ],
          "phraseTimes": [
            {
              "start": 9.12,
              "end": 18.34
            }
          ]
        },
        {
          "points": [
            "The assistant is a power tool your change process",
            "Governance is how policy survives contact with a busy",
            "Publish which models and endpoints are approved, which data",
            "Align that with secret management from course three —"
          ],
          "keyWords": [
            [
              "assistant",
              "power",
              "tool",
              "your"
            ]
          ],
          "phraseTimes": [
            {
              "start": 18.34,
              "end": 26.76
            }
          ]
        }
      ]
    },
    "story-beat-recap-ai-assisted": {
      "splitAt": [
        9.86,
        19.71
      ],
      "segments": [
        {
          "points": [
            "Before the lab You have seen why teams reach",
            "Before the lab.",
            "Why teams reach for models, what can go wrong,",
            "Next you will live the workflow in netops_ai_lab: write"
          ],
          "keyWords": [
            [
              "lab",
              "Pause",
              "seen",
              "teams"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.14,
              "end": 9.91
            }
          ]
        },
        {
          "points": [
            "Next you will live the workflow",
            "VLAN playbook"
          ],
          "keyWords": [
            [
              "Next",
              "live",
              "workflow"
            ],
            [
              "VLAN",
              "playbook"
            ]
          ],
          "phraseTimes": [
            {
              "start": 9.91,
              "end": 13.42
            },
            {
              "start": 14.33,
              "end": 19.41
            }
          ]
        },
        {
          "points": [
            "Save the draft lint it and run",
            "Use lab topology only in prompts If a step"
          ],
          "keyWords": [
            [
              "save",
              "draft",
              "lint",
              "run"
            ],
            [
              "lab",
              "ai",
              "Use",
              "topology"
            ]
          ],
          "phraseTimes": [
            {
              "start": 19.77,
              "end": 21.77
            },
            {
              "start": 22.360001,
              "end": 29.379999
            }
          ]
        }
      ]
    },
    "lab-setup-ai-lab": {
      "splitAt": [
        10.18,
        20.37
      ],
      "segments": [
        {
          "points": [
            "Lab portion",
            "Today you will not touch production devices",
            "Create netops_ai_lab beside"
          ],
          "keyWords": [
            [
              "Welcome",
              "lab",
              "portion"
            ],
            [
              "Today",
              "touch",
              "production",
              "devices"
            ],
            [
              "netops_ai_lab",
              "Create",
              "beside"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.14,
              "end": 2.23
            },
            {
              "start": 2.95,
              "end": 6.06
            },
            {
              "start": 6.55,
              "end": 9.17
            }
          ]
        },
        {
          "points": [
            "IaC and ops repos with three folders prompts",
            "Today you will not touch production devices.",
            "Create netops_ai_lab beside your IaC and ops repos",
            "That separation mirrors how mature teams keep untrusted drafts"
          ],
          "keyWords": [
            [
              "IaC",
              "ops",
              "repos",
              "three"
            ]
          ],
          "phraseTimes": [
            {
              "start": 10.26,
              "end": 20.42
            }
          ]
        },
        {
          "points": [
            "Separation mirrors how mature teams keep untrusted",
            "Every command appears on screen pause when you need"
          ],
          "keyWords": [
            [
              "separation",
              "mirrors",
              "mature",
              "teams"
            ],
            [
              "command",
              "appears",
              "screen",
              "pause"
            ]
          ],
          "phraseTimes": [
            {
              "start": 20.42,
              "end": 24.049999
            },
            {
              "start": 25,
              "end": 30.41
            }
          ]
        }
      ]
    },
    "ai-assisted-ready-for-mcp": {
      "splitAt": [
        9.56,
        19.11
      ],
      "segments": [
        {
          "points": [
            "You now have a defensible AI drafting workflow",
            "File generated draft lint"
          ],
          "keyWords": [
            [
              "AI",
              "review",
              "now",
              "defensible"
            ],
            [
              "file",
              "generated",
              "draft",
              "lint"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.15,
              "end": 7.07
            },
            {
              "start": 7.54,
              "end": 9.89
            }
          ]
        },
        {
          "points": [
            "Results check mode output and approval",
            "That is the foundation intelligent automation builds"
          ],
          "keyWords": [
            [
              "results",
              "check",
              "mode",
              "output"
            ],
            [
              "foundation",
              "intelligent",
              "automation",
              "builds"
            ]
          ],
          "phraseTimes": [
            {
              "start": 10.21,
              "end": 12.64
            },
            {
              "start": 13.28,
              "end": 19.139999
            }
          ]
        },
        {
          "points": [
            "Tackles the next problem models have on their own",
            "VLANs unless you give them safe read access through"
          ],
          "keyWords": [
            [
              "next",
              "tackles",
              "problem",
              "models"
            ],
            [
              "MCP",
              "VLANs",
              "unless",
              "give"
            ]
          ],
          "phraseTimes": [
            {
              "start": 19.42,
              "end": 23.73
            },
            {
              "start": 24.469999,
              "end": 27.879999
            }
          ]
        }
      ]
    },
    "what-mcp-means-plain-language": {
      "splitAt": [
        9.29,
        18.57
      ],
      "segments": [
        {
          "points": [
            "MCP stands for Model Context Protocol In everyday terms",
            "MCP stands for Model Context Protocol.",
            "In everyday terms it is a standard way",
            "FastMCP is a Python library that turns ordinary functions"
          ],
          "keyWords": [
            [
              "MCP",
              "stands",
              "Model",
              "Context"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.65,
              "end": 9.62
            }
          ]
        },
        {
          "points": [
            "FastMCP is a Python library that turns ordinary functions",
            "MCP stands for Model Context Protocol.",
            "In everyday terms it is a standard way",
            "You focus on what the tool should return —"
          ],
          "keyWords": [
            [
              "MCP",
              "FastMCP",
              "Python",
              "library"
            ]
          ],
          "phraseTimes": [
            {
              "start": 9.9,
              "end": 18.620001
            }
          ]
        },
        {
          "points": [
            "You focus on what the tool should",
            "VLAN list device inventory — not on reinventing",
            "RPC glue for every integration"
          ],
          "keyWords": [
            [
              "focus",
              "tool"
            ],
            [
              "VLAN",
              "list",
              "device",
              "inventory"
            ],
            [
              "RPC",
              "glue",
              "integration"
            ]
          ],
          "phraseTimes": [
            {
              "start": 18.860001,
              "end": 21.91
            },
            {
              "start": 22.42,
              "end": 26.32
            },
            {
              "start": 26.32,
              "end": 27.76
            }
          ]
        }
      ]
    },
    "mcp-architecture-components": {
      "splitAt": [
        9.42,
        18.83
      ],
      "segments": [
        {
          "points": [
            "Three pieces work together The host runs the LLM",
            "The MCP server registers tools"
          ],
          "keyWords": [
            [
              "Three",
              "pieces",
              "work",
              "together"
            ],
            [
              "MCP",
              "server",
              "registers",
              "tools"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.09,
              "end": 5.73
            },
            {
              "start": 6.29,
              "end": 8.83
            }
          ]
        },
        {
          "points": [
            "JSON the model can parse",
            "Transport is often stdio in a lab or HTTP"
          ],
          "keyWords": [
            [
              "JSON",
              "model",
              "parse"
            ],
            [
              "Transport",
              "often",
              "stdio",
              "lab"
            ]
          ],
          "phraseTimes": [
            {
              "start": 9.97,
              "end": 13.94
            },
            {
              "start": 15.2,
              "end": 18.66
            }
          ]
        },
        {
          "points": [
            "When each piece is clear troubleshooting is easier",
            "The wrong tool or is the server returning bad"
          ],
          "keyWords": [
            [
              "piece",
              "clear",
              "troubleshooting",
              "easier"
            ],
            [
              "wrong",
              "tool",
              "server",
              "returning"
            ]
          ],
          "phraseTimes": [
            {
              "start": 19.09,
              "end": 24.610001
            },
            {
              "start": 25.07,
              "end": 27.940001
            }
          ]
        }
      ]
    },
    "tool-orchestration-patterns": {
      "splitAt": [
        9.09,
        18.18
      ],
      "segments": [
        {
          "points": [
            "Design tools the way you design",
            "Return intent slices inventory"
          ],
          "keyWords": [
            [
              "tool",
              "Design",
              "tools",
              "way"
            ],
            [
              "Return",
              "intent",
              "slices",
              "inventory"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.15,
              "end": 1.71
            },
            {
              "start": 2.39,
              "end": 9.43
            }
          ]
        },
        {
          "points": [
            "Rows or telemetry summaries as JSON",
            "Defer push_config until module three and keep writes behind"
          ],
          "keyWords": [
            [
              "rows",
              "telemetry",
              "summaries",
              "JSON"
            ],
            [
              "tool",
              "Defer",
              "push_config",
              "until"
            ]
          ],
          "phraseTimes": [
            {
              "start": 9.7,
              "end": 12.8
            },
            {
              "start": 13.51,
              "end": 17.73
            }
          ]
        },
        {
          "points": [
            "Are easier to test easier to benchmark later",
            "Design tools the way you design firewall rules: start",
            "Return intent slices, inventory rows, or telemetry summaries",
            "Defer push_config until module three and keep writes behind"
          ],
          "keyWords": [
            [
              "easier",
              "test",
              "benchmark",
              "later"
            ]
          ],
          "phraseTimes": [
            {
              "start": 18.33,
              "end": 25.76
            }
          ]
        }
      ]
    },
    "expose-network-data-safely": {
      "splitAt": [
        8.33,
        16.66
      ],
      "segments": [
        {
          "points": [
            "Expose the minimum data the assistant needs — not",
            "In this lab"
          ],
          "keyWords": [
            [
              "Expose",
              "data",
              "minimum",
              "assistant"
            ],
            [
              "lab"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.11,
              "end": 4.05
            },
            {
              "start": 4.9,
              "end": 8.15
            }
          ]
        },
        {
          "points": [
            "YAML and a simple inventory",
            "In production"
          ],
          "keyWords": [
            [
              "YAML",
              "simple",
              "inventory"
            ],
            [
              "production"
            ]
          ],
          "phraseTimes": [
            {
              "start": 9.99,
              "end": 13.04
            },
            {
              "start": 15.3,
              "end": 16.74
            }
          ]
        },
        {
          "points": [
            "MCP transport rate — limit calls and log which",
            "Expose the minimum data the assistant needs — not",
            "In this lab, tools read netops_iac_lab",
            "In production you authenticate MCP transport, rate — limit"
          ],
          "keyWords": [
            [
              "MCP",
              "transport",
              "rate-limit",
              "calls"
            ]
          ],
          "phraseTimes": [
            {
              "start": 16.74,
              "end": 24.870001
            }
          ]
        }
      ]
    },
    "story-beat-recap-mcp": {
      "splitAt": [
        9.13,
        18.25
      ],
      "segments": [
        {
          "points": [
            "You understand why MCP exists and how to expose",
            "Next you build netops_ai_lab/mcp/server.",
            "Py with list_vlans and get_lab_inventory.",
            "Keep both tools read — only so the agent"
          ],
          "keyWords": [
            [
              "understand",
              "MCP",
              "exists",
              "expose"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.07,
              "end": 8.98
            }
          ]
        },
        {
          "points": [
            "Keep both tools read — only so the agent",
            "You understand why MCP exists and how to expose",
            "Next you build netops_ai_lab/mcp/server.",
            "Py with list_vlans and get_lab_inventory."
          ],
          "keyWords": [
            [
              "Keep",
              "tools",
              "read-only",
              "agent"
            ]
          ],
          "phraseTimes": [
            {
              "start": 10.21,
              "end": 16.700001
            }
          ]
        },
        {
          "points": [
            "Three can answer questions without pushing configuration on its",
            "You understand why MCP exists and how to expose",
            "Next you build netops_ai_lab/mcp/server.",
            "Py with list_vlans and get_lab_inventory."
          ],
          "keyWords": [
            [
              "three",
              "answer",
              "questions",
              "without"
            ]
          ],
          "phraseTimes": [
            {
              "start": 18.27,
              "end": 21.77
            }
          ]
        }
      ]
    },
    "lab-setup-mcp": {
      "splitAt": [
        7.76,
        15.53
      ],
      "segments": [
        {
          "points": [
            "Extend netops_ai_lab with an mcp folder serverpy",
            "Extend netops_ai_lab with an mcp folder: server.",
            "Py and requirements — mcp.",
            "Use a dedicated virtualenv so MCP package versions do"
          ],
          "keyWords": [
            [
              "Extend",
              "netops_ai_lab",
              "mcp",
              "folder"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.13,
              "end": 4.71
            }
          ]
        },
        {
          "points": [
            "Use a dedicated virtualenv so MCP package versions do",
            "Extend netops_ai_lab with an mcp folder: server.",
            "Py and requirements — mcp.",
            "Isolated environments are boring until an upgrade breaks one"
          ],
          "keyWords": [
            [
              "MCP",
              "Use",
              "dedicated",
              "virtualenv"
            ]
          ],
          "phraseTimes": [
            {
              "start": 9.22,
              "end": 13.99
            }
          ]
        },
        {
          "points": [
            "Ansible or ops tooling Isolated environments are boring until",
            "Extend netops_ai_lab with an mcp folder: server.",
            "Py and requirements — mcp.",
            "Use a dedicated virtualenv so MCP package versions do"
          ],
          "keyWords": [
            [
              "Ansible",
              "ops",
              "tooling",
              "Isolated"
            ]
          ],
          "phraseTimes": [
            {
              "start": 15.88,
              "end": 23.059999
            }
          ]
        }
      ]
    },
    "mcp-ready-for-agents": {
      "splitAt": [
        6.79,
        13.59
      ],
      "segments": [
        {
          "points": [
            "Your MCP server returns real VLAN and inventory data",
            "Module three puts a conversational layer on top so",
            "Writes still wait for human approval — we"
          ],
          "keyWords": [
            [
              "MCP",
              "Your",
              "server",
              "returns"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.16,
              "end": 6.68
            }
          ]
        },
        {
          "points": [
            "Module three puts a conversational layer on top so",
            "VLANs exist"
          ],
          "keyWords": [
            [
              "Module",
              "three",
              "puts",
              "conversational"
            ],
            [
              "VLANs",
              "exist"
            ]
          ],
          "phraseTimes": [
            {
              "start": 6.83,
              "end": 11.45
            },
            {
              "start": 11.92,
              "end": 13.61
            }
          ]
        },
        {
          "points": [
            "Python Writes still wait for human approval — we",
            "Your MCP server returns real VLAN and inventory data",
            "Module three puts a conversational layer on top so",
            "Writes still wait for human approval — we"
          ],
          "keyWords": [
            [
              "Python",
              "Writes",
              "still",
              "wait"
            ]
          ],
          "phraseTimes": [
            {
              "start": 13.61,
              "end": 18.629999
            }
          ]
        }
      ]
    },
    "conversational-agent-plain-language": {
      "splitAt": [
        7.79,
        15.59
      ],
      "segments": [
        {
          "points": [
            "A conversational agent is not magic chat",
            "Get_lab_inventory"
          ],
          "keyWords": [
            [
              "conversational",
              "agent",
              "magic",
              "chat"
            ],
            [
              "get_lab_inventory"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.09,
              "end": 5.63
            },
            {
              "start": 6.29,
              "end": 7.44
            }
          ]
        },
        {
          "points": [
            "JSON to context and summarize",
            "Write actions stay blocked until"
          ],
          "keyWords": [
            [
              "JSON",
              "context",
              "summarize"
            ],
            [
              "Write",
              "actions",
              "stay",
              "blocked"
            ]
          ],
          "phraseTimes": [
            {
              "start": 8.09,
              "end": 13.08
            },
            {
              "start": 13.54,
              "end": 16.57
            }
          ]
        },
        {
          "points": [
            "That pattern keeps the helpful parts of natural language",
            "A conversational agent is not magic chat.",
            "It is orchestration: route the question, call list_vlans",
            "Write actions stay blocked until a human types approve."
          ],
          "keyWords": [
            [
              "language",
              "pattern",
              "keeps",
              "helpful"
            ]
          ],
          "phraseTimes": [
            {
              "start": 16.57,
              "end": 23.09
            }
          ]
        }
      ]
    },
    "llm-orchestration-patterns": {
      "splitAt": [
        7.97,
        15.95
      ],
      "segments": [
        {
          "points": [
            "In this lab one agent loop is enough plan",
            "MCP observe"
          ],
          "keyWords": [
            [
              "lab",
              "one",
              "agent",
              "loop"
            ],
            [
              "MCP",
              "observe"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.09,
              "end": 6.24
            },
            {
              "start": 7.13,
              "end": 8.42
            }
          ]
        },
        {
          "points": [
            "Larger deployments sometimes split planner",
            "And executor roles the idea"
          ],
          "keyWords": [
            [
              "Larger",
              "deployments",
              "sometimes",
              "split"
            ],
            [
              "executor",
              "roles",
              "idea"
            ]
          ],
          "phraseTimes": [
            {
              "start": 8.67,
              "end": 13.74
            },
            {
              "start": 14.35,
              "end": 16.02
            }
          ]
        },
        {
          "points": [
            "The model proposes steps your tool registry and approval",
            "In this lab one agent loop is enough: plan",
            "Larger deployments sometimes split planner and executor roles;"
          ],
          "keyWords": [
            [
              "model",
              "proposes",
              "steps",
              "your"
            ]
          ],
          "phraseTimes": [
            {
              "start": 16.370001,
              "end": 23.700001
            }
          ]
        }
      ]
    },
    "agent-loop-think-act-observe": {
      "splitAt": [
        8.86,
        17.71
      ],
      "segments": [
        {
          "points": [
            "Think is the model deciding the next step",
            "Act is invoking an MCP tool with concrete arguments.",
            "Observe is feeding tool output back into context before",
            "Loop until you have an answer or until"
          ],
          "keyWords": [
            [
              "Think",
              "Act",
              "model",
              "deciding"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.17,
              "end": 8.12
            }
          ]
        },
        {
          "points": [
            "Observe is feeding tool output back into context before",
            "Think is the model deciding the next step",
            "Act is invoking an MCP tool with concrete arguments.",
            "Loop until you have an answer or until"
          ],
          "keyWords": [
            [
              "Observe",
              "feeding",
              "tool",
              "output"
            ]
          ],
          "phraseTimes": [
            {
              "start": 9.05,
              "end": 17.889999
            }
          ]
        },
        {
          "points": [
            "Have an answer or until a proposed write needs",
            "Skipping observe is how agents answer from memory instead"
          ],
          "keyWords": [
            [
              "answer",
              "until",
              "proposed",
              "write"
            ],
            [
              "observe",
              "Skipping",
              "agents",
              "answer"
            ]
          ],
          "phraseTimes": [
            {
              "start": 17.889999,
              "end": 21.4
            },
            {
              "start": 21.860001,
              "end": 26.32
            }
          ]
        }
      ]
    },
    "network-operator-agent-design": {
      "splitAt": [
        8.19,
        16.38
      ],
      "segments": [
        {
          "points": [
            "Scope the agent like you scope",
            "Allow VLAN and inventory queries"
          ],
          "keyWords": [
            [
              "Scope",
              "agent",
              "like"
            ],
            [
              "Allow",
              "VLAN",
              "inventory",
              "queries"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.14,
              "end": 2.68
            },
            {
              "start": 3.29,
              "end": 8.37
            }
          ]
        },
        {
          "points": [
            "Put lab topology in the system prompt so",
            "Scope the agent like you scope a firewall policy.",
            "Allow VLAN and inventory queries; refuse arbitrary shell commands",
            "A narrow agent is easier to test, easier"
          ],
          "keyWords": [
            [
              "Put",
              "lab",
              "topology",
              "system"
            ]
          ],
          "phraseTimes": [
            {
              "start": 8.37,
              "end": 16.530001
            }
          ]
        },
        {
          "points": [
            "A narrow agent is easier to test easier",
            "Scope the agent like you scope a firewall policy.",
            "Allow VLAN and inventory queries; refuse arbitrary shell commands",
            "Put lab topology in the system prompt so"
          ],
          "keyWords": [
            [
              "agent",
              "narrow",
              "easier",
              "test"
            ]
          ],
          "phraseTimes": [
            {
              "start": 16.690001,
              "end": 24.450001
            }
          ]
        }
      ]
    },
    "story-beat-recap-agents": {
      "splitAt": [
        7.37,
        14.74
      ],
      "segments": [
        {
          "points": [
            "How agents plan",
            "Next you wire"
          ],
          "keyWords": [
            [
              "agent",
              "seen",
              "agents",
              "plan"
            ],
            [
              "Next",
              "wire"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.09,
              "end": 2.24
            },
            {
              "start": 2.74,
              "end": 7.36
            }
          ]
        },
        {
          "points": [
            "MCP server from module two and walk through",
            "VLAN question a proposed change and an explicit"
          ],
          "keyWords": [
            [
              "MCP",
              "server",
              "module",
              "two"
            ],
            [
              "VLAN",
              "question",
              "proposed",
              "change"
            ]
          ],
          "phraseTimes": [
            {
              "start": 7.39,
              "end": 11.58
            },
            {
              "start": 12.4,
              "end": 14.82
            }
          ]
        },
        {
          "points": [
            "Keep API keys in the environment",
            "Not in Git"
          ],
          "keyWords": [
            [
              "Keep",
              "API",
              "keys",
              "environment"
            ],
            [
              "Git"
            ]
          ],
          "phraseTimes": [
            {
              "start": 14.88,
              "end": 18.219999
            },
            {
              "start": 18.85,
              "end": 19.59
            }
          ]
        }
      ]
    },
    "lab-setup-agent": {
      "splitAt": [
        7.38,
        14.75
      ],
      "segments": [
        {
          "points": [
            "Create netops_ai_labagent with agentpy and configyaml",
            "Create netops_ai_lab/agent with agent.",
            "Py and config.",
            "Yaml for the model endpoint."
          ],
          "keyWords": [
            [
              "agent",
              "lab",
              "Create",
              "netops_ai_labagent"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.14,
              "end": 7.42
            }
          ]
        },
        {
          "points": [
            "Secrets live in env loaded at runtime",
            "Create netops_ai_lab/agent with agent.",
            "Py and config.",
            "Yaml for the model endpoint."
          ],
          "keyWords": [
            [
              "Secrets",
              "live",
              "env",
              "loaded"
            ]
          ],
          "phraseTimes": [
            {
              "start": 9.23,
              "end": 14.78
            }
          ]
        },
        {
          "points": [
            "Use an approved enterprise endpoint or a local sandbox",
            "Create netops_ai_lab/agent with agent.",
            "Py and config.",
            "Yaml for the model endpoint."
          ],
          "keyWords": [
            [
              "lab",
              "Use",
              "approved",
              "enterprise"
            ]
          ],
          "phraseTimes": [
            {
              "start": 14.81,
              "end": 21.59
            }
          ]
        }
      ]
    },
    "agents-ready-for-evaluation": {
      "splitAt": [
        4.92,
        9.84
      ],
      "segments": [
        {
          "points": [
            "You have a conversational agent grounded",
            "MCP with approval on writes"
          ],
          "keyWords": [
            [
              "conversational",
              "agent",
              "grounded"
            ],
            [
              "MCP",
              "approval",
              "writes"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.17,
              "end": 2.35
            },
            {
              "start": 2.93,
              "end": 5.24
            }
          ]
        },
        {
          "points": [
            "Remaining question is quantitative how often",
            "Module four builds"
          ],
          "keyWords": [
            [
              "remaining",
              "question",
              "quantitative",
              "often"
            ],
            [
              "Module",
              "builds"
            ]
          ],
          "phraseTimes": [
            {
              "start": 5.24,
              "end": 8.06
            },
            {
              "start": 8.67,
              "end": 10.08
            }
          ]
        },
        {
          "points": [
            "Golden questions and a score you can track",
            "You have a conversational agent grounded in MCP",
            "The remaining question is quantitative: how often",
            "Module four builds golden questions and a score"
          ],
          "keyWords": [
            [
              "golden",
              "questions",
              "score",
              "track"
            ]
          ],
          "phraseTimes": [
            {
              "start": 10.08,
              "end": 14.54
            }
          ]
        }
      ]
    },
    "why-evaluate-ai-recommendations": {
      "splitAt": [
        7.84,
        15.67
      ],
      "segments": [
        {
          "points": [
            "Operators trust tools that fail predictably",
            "Measurably not tools that fail"
          ],
          "keyWords": [
            [
              "ai",
              "Operators",
              "trust",
              "tools"
            ],
            [
              "ai",
              "measurably",
              "tools",
              "fail"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.17,
              "end": 4.44
            },
            {
              "start": 5.42,
              "end": 7.99
            }
          ]
        },
        {
          "points": [
            "A benchmark suite turns trust into data Run",
            "Operators trust tools that fail predictably and measurably, not",
            "A benchmark suite turns trust into data.",
            "Run it when you change prompts, swap models,"
          ],
          "keyWords": [
            [
              "benchmark",
              "suite",
              "turns",
              "trust"
            ]
          ],
          "phraseTimes": [
            {
              "start": 8.07,
              "end": 16.139999
            }
          ]
        },
        {
          "points": [
            "Models or add a new",
            "Regression should show up in scores before it shows"
          ],
          "keyWords": [
            [
              "models",
              "add",
              "new"
            ],
            [
              "Regression",
              "show",
              "up",
              "scores"
            ]
          ],
          "phraseTimes": [
            {
              "start": 16.610001,
              "end": 17.719999
            },
            {
              "start": 18.18,
              "end": 23.290001
            }
          ]
        }
      ]
    },
    "hallucinations-in-network-context": {
      "splitAt": [
        7.01,
        14.02
      ],
      "segments": [
        {
          "points": [
            "In networking hallucination is not abstract —",
            "MCP grounding reduces guesses but does not eliminate them.",
            "Count what remains after grounding so you know whether"
          ],
          "keyWords": [
            [
              "networking",
              "hallucination",
              "abstract",
              "VLAN"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.15,
              "end": 6.6
            }
          ]
        },
        {
          "points": [
            "IOS command",
            "MCP grounding"
          ],
          "keyWords": [
            [
              "IOS",
              "command"
            ],
            [
              "MCP",
              "grounding"
            ]
          ],
          "phraseTimes": [
            {
              "start": 7.97,
              "end": 9.41
            },
            {
              "start": 10.1,
              "end": 14.32
            }
          ]
        },
        {
          "points": [
            "Count what remains after grounding so you know whether",
            "In networking, hallucination is not abstract —",
            "MCP grounding reduces guesses but does not eliminate them."
          ],
          "keyWords": [
            [
              "Count",
              "remains",
              "grounding",
              "know"
            ]
          ],
          "phraseTimes": [
            {
              "start": 14.37,
              "end": 20.83
            }
          ]
        }
      ]
    },
    "accuracy-metrics-plain-language": {
      "splitAt": [
        6.53,
        13.05
      ],
      "segments": [
        {
          "points": [
            "Start simple For structured answers check whether the VLAN",
            "For structured answers, check whether the VLAN list",
            "Track how often the agent calls the right tool",
            "Optional human rubrics help judge explanation quality, but field"
          ],
          "keyWords": [
            [
              "Start",
              "simple",
              "structured",
              "answers"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.17,
              "end": 6.6
            }
          ]
        },
        {
          "points": [
            "Track how often the agent calls the right tool",
            "For structured answers, check whether the VLAN list",
            "Optional human rubrics help judge explanation quality, but field"
          ],
          "keyWords": [
            [
              "Track",
              "often",
              "agent",
              "calls"
            ]
          ],
          "phraseTimes": [
            {
              "start": 7.18,
              "end": 11.97
            }
          ]
        },
        {
          "points": [
            "Rubrics help judge explanation quality but field match",
            "For structured answers, check whether the VLAN list",
            "Track how often the agent calls the right tool",
            "Optional human rubrics help judge explanation quality, but field"
          ],
          "keyWords": [
            [
              "rubrics",
              "help",
              "judge",
              "explanation"
            ]
          ],
          "phraseTimes": [
            {
              "start": 13.34,
              "end": 19.379999
            }
          ]
        }
      ]
    },
    "benchmark-dataset-design": {
      "splitAt": [
        7.93,
        15.87
      ],
      "segments": [
        {
          "points": [
            "Build ten to twenty questions from files you already",
            "JSON Include"
          ],
          "keyWords": [
            [
              "Build",
              "ten",
              "twenty",
              "questions"
            ],
            [
              "JSON",
              "Include"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.13,
              "end": 3.69
            },
            {
              "start": 5.87,
              "end": 8.32
            }
          ]
        },
        {
          "points": [
            "Negative cases false premises the agent should",
            "Refuse or questions that require a tool",
            "Call instead of memory Version"
          ],
          "keyWords": [
            [
              "negative",
              "cases",
              "false",
              "premises"
            ],
            [
              "refuse",
              "questions",
              "require",
              "tool"
            ],
            [
              "call",
              "instead",
              "memory",
              "Version"
            ]
          ],
          "phraseTimes": [
            {
              "start": 8.78,
              "end": 10.9
            },
            {
              "start": 11.53,
              "end": 13.83
            },
            {
              "start": 14.35,
              "end": 16.209999
            }
          ]
        },
        {
          "points": [
            "Git like any test fixture so scores are comparable",
            "Build ten to twenty questions from files you already",
            "Yaml, inventory JSON.",
            "Include negative cases: false premises the agent should refuse,"
          ],
          "keyWords": [
            [
              "Git",
              "like",
              "any",
              "test"
            ]
          ],
          "phraseTimes": [
            {
              "start": 16.209999,
              "end": 21.469999
            }
          ]
        }
      ]
    },
    "safety-guardrails-for-agents": {
      "splitAt": [
        8.29,
        16.58
      ],
      "segments": [
        {
          "points": [
            "Guardrails are the policies you already believe enforced",
            "Code no writes without approval refuse out — of"
          ],
          "keyWords": [
            [
              "Guardrails",
              "policies",
              "already",
              "believe"
            ],
            [
              "out-of-scope",
              "scope",
              "code",
              "writes"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.68,
              "end": 4.4
            },
            {
              "start": 5.09,
              "end": 8.43
            }
          ]
        },
        {
          "points": [
            "They connect back",
            "TLS and secret handling"
          ],
          "keyWords": [
            [
              "connect",
              "back"
            ],
            [
              "TLS",
              "secret",
              "handling"
            ]
          ],
          "phraseTimes": [
            {
              "start": 8.47,
              "end": 13.55
            },
            {
              "start": 14.84,
              "end": 16.82
            }
          ]
        },
        {
          "points": [
            "From earlier courses — intelligent automation still sits",
            "Guardrails are the policies you already believe, enforced",
            "They connect back to TLS and secret handling"
          ],
          "keyWords": [
            [
              "earlier",
              "courses",
              "intelligent",
              "automation"
            ]
          ],
          "phraseTimes": [
            {
              "start": 16.99,
              "end": 24.639999
            }
          ]
        }
      ]
    },
    "story-beat-recap-evaluation": {
      "splitAt": [
        7.03,
        14.05
      ],
      "segments": [
        {
          "points": [
            "You know why benchmarks matter and how to design",
            "Next you create benchmarks/golden_qa.",
            "Jsonl and run_eval.",
            "Py against your agent."
          ],
          "keyWords": [
            [
              "Next",
              "benchmark",
              "know",
              "benchmarks"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.09,
              "end": 5.6
            }
          ]
        },
        {
          "points": [
            "And run_evalpy against your agent Treat",
            "Failed rows as engineering work"
          ],
          "keyWords": [
            [
              "run_evalpy",
              "against",
              "your",
              "agent"
            ],
            [
              "failed",
              "rows",
              "engineering",
              "work"
            ]
          ],
          "phraseTimes": [
            {
              "start": 7.05,
              "end": 11.86
            },
            {
              "start": 12.35,
              "end": 14.61
            }
          ]
        },
        {
          "points": [
            "Mandatory tool calls path fixes or stronger system prompts",
            "You know why benchmarks matter and how to design",
            "Next you create benchmarks/golden_qa.",
            "Jsonl and run_eval."
          ],
          "keyWords": [
            [
              "mandatory",
              "tool",
              "calls",
              "path"
            ]
          ],
          "phraseTimes": [
            {
              "start": 15.38,
              "end": 19.23
            }
          ]
        }
      ]
    },
    "lab-setup-benchmark": {
      "splitAt": [
        6,
        12
      ],
      "segments": [
        {
          "points": [
            "Add netops_ai_labbenchmarks with golden_qajsonl and run_evalpy Store",
            "Add netops_ai_lab/benchmarks with golden_qa.",
            "Jsonl and run_eval.",
            "Store results under results so you can compare runs"
          ],
          "keyWords": [
            [
              "benchmark",
              "lab",
              "Add",
              "netops_ai_labbenchmarks"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.12,
              "end": 6.17
            }
          ]
        },
        {
          "points": [
            "Results under results so you can compare runs after",
            "Add netops_ai_lab/benchmarks with golden_qa.",
            "Jsonl and run_eval.",
            "Store results under results so you can compare runs"
          ],
          "keyWords": [
            [
              "results",
              "compare",
              "runs",
              "prompt"
            ]
          ],
          "phraseTimes": [
            {
              "start": 6.36,
              "end": 11.49
            }
          ]
        },
        {
          "points": [
            "Add netops_ai_lab/benchmarks with golden_qa.",
            "Jsonl and run_eval.",
            "Store results under results so you can compare runs"
          ],
          "phraseTimes": []
        }
      ]
    },
    "evaluation-ready-for-capstone": {
      "splitAt": [
        4.78,
        9.55
      ],
      "segments": [
        {
          "points": [
            "You can score the agent against golden questions",
            "The capstone runs the full pipeline — draft, tools,"
          ],
          "keyWords": [
            [
              "score",
              "agent",
              "against",
              "golden"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.14,
              "end": 4.51
            }
          ]
        },
        {
          "points": [
            "The capstone runs the full pipeline — draft tools",
            "You can score the agent against golden questions"
          ],
          "keyWords": [
            [
              "capstone",
              "runs",
              "full",
              "pipeline"
            ]
          ],
          "phraseTimes": [
            {
              "start": 4.98,
              "end": 9.34
            }
          ]
        },
        {
          "points": [
            "Conversation measurement — in one operator session you could",
            "You can score the agent against golden questions",
            "The capstone runs the full pipeline — draft, tools,"
          ],
          "keyWords": [
            [
              "conversation",
              "measurement",
              "one",
              "operator"
            ]
          ],
          "phraseTimes": [
            {
              "start": 9.77,
              "end": 14.09
            }
          ]
        }
      ]
    },
    "capstone-integrates-four-modules": {
      "splitAt": [
        8.12,
        16.24
      ],
      "segments": [
        {
          "points": [
            "Module one gave you reviewed AI — generated code",
            "Two grounded answers in real intent Module",
            "Three let operators ask"
          ],
          "keyWords": [
            [
              "Module",
              "one",
              "gave",
              "reviewed"
            ],
            [
              "two",
              "grounded",
              "answers",
              "real"
            ],
            [
              "three",
              "let",
              "operators",
              "ask"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.23,
              "end": 2.8
            },
            {
              "start": 3.26,
              "end": 6.33
            },
            {
              "start": 6.78,
              "end": 8.57
            }
          ]
        },
        {
          "points": [
            "Module four measures accuracy Courses",
            "One through three still supply the IaC"
          ],
          "keyWords": [
            [
              "Module",
              "measures",
              "accuracy",
              "Courses"
            ],
            [
              "one",
              "three",
              "still",
              "supply"
            ]
          ],
          "phraseTimes": [
            {
              "start": 8.57,
              "end": 12.97
            },
            {
              "start": 13.45,
              "end": 15.98
            }
          ]
        },
        {
          "points": [
            "The capstone proves those pieces work together not",
            "Module one gave you reviewed AI — generated code.",
            "Module two grounded answers in real intent.",
            "Module three let operators ask questions in plain language."
          ],
          "keyWords": [
            [
              "capstone",
              "proves",
              "pieces",
              "work"
            ]
          ],
          "phraseTimes": [
            {
              "start": 17.15,
              "end": 24.129999
            }
          ]
        }
      ]
    },
    "capstone-lab-layout": {
      "splitAt": [
        8.48,
        16.96
      ],
      "segments": [
        {
          "points": [
            "Know where artifacts live before you start",
            "Netops_ai_lab holds prompts generated drafts"
          ],
          "keyWords": [
            [
              "Know",
              "artifacts",
              "live",
              "start"
            ],
            [
              "lab",
              "netops_ai_lab",
              "holds",
              "prompts"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.15,
              "end": 2.78
            },
            {
              "start": 3.8,
              "end": 7.28
            }
          ]
        },
        {
          "points": [
            "Netops_iac_lab",
            "YAML and validation scripts"
          ],
          "keyWords": [
            [
              "lab",
              "netops_iac_lab"
            ],
            [
              "YAML",
              "validation",
              "scripts"
            ]
          ],
          "phraseTimes": [
            {
              "start": 8.94,
              "end": 12.4
            },
            {
              "start": 13.16,
              "end": 17.110001
            }
          ]
        },
        {
          "points": [
            "Something fails you fix the owning folder instead of",
            "Know where artifacts live before you start.",
            "Netops_ai_lab holds prompts, generated drafts, reviews, mcp, agent,",
            "Netops_iac_lab and netops_ops_lab supply intent YAML and validation scripts."
          ],
          "keyWords": [
            [
              "capstone",
              "something",
              "fails",
              "fix"
            ]
          ],
          "phraseTimes": [
            {
              "start": 17.209999,
              "end": 20.540001
            }
          ]
        }
      ]
    },
    "six-steps-ai-capstone-runbook": {
      "splitAt": [
        7.18,
        14.35
      ],
      "segments": [
        {
          "points": [
            "Run six steps in order start",
            "MCP and agent record a benchmark",
            "Baseline ask"
          ],
          "keyWords": [
            [
              "six",
              "steps",
              "order",
              "six steps in order"
            ],
            [
              "MCP",
              "agent",
              "record",
              "benchmark"
            ],
            [
              "baseline",
              "ask"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.15,
              "end": 2.35
            },
            {
              "start": 3.07,
              "end": 5.73
            },
            {
              "start": 6.2,
              "end": 7.6
            }
          ]
        },
        {
          "points": [
            "VLAN question let the agent propose a change",
            "Approve and validate then record the final score"
          ],
          "keyWords": [
            [
              "VLAN",
              "question",
              "let",
              "agent"
            ],
            [
              "approve",
              "validate",
              "then",
              "record"
            ]
          ],
          "phraseTimes": [
            {
              "start": 7.79,
              "end": 10.79
            },
            {
              "start": 11.58,
              "end": 14.46
            }
          ]
        },
        {
          "points": [
            "Skipping a step breaks the story you would tell",
            "Run six steps in order: start MCP and agent,"
          ],
          "keyWords": [
            [
              "Skipping",
              "step",
              "breaks",
              "story"
            ]
          ],
          "phraseTimes": [
            {
              "start": 14.64,
              "end": 21.35
            }
          ]
        }
      ]
    },
    "five-objectives-capstone-chain": {
      "splitAt": [
        9.01,
        18.03
      ],
      "segments": [
        {
          "points": [
            "One session chains every skill you built governed code",
            "Log shows who approved what; results/score.",
            "Txt shows whether the assistant still passes after"
          ],
          "keyWords": [
            [
              "One",
              "session",
              "chains",
              "skill"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.15,
              "end": 9.04
            }
          ]
        },
        {
          "points": [
            "measured accuracy reviewsreviewlog shows who approved what resultsscoretxt shows",
            "One session chains every skill you built: governed code",
            "Log shows who approved what; results/score.",
            "Txt shows whether the assistant still passes after"
          ],
          "keyWords": [
            [
              "measured",
              "accuracy",
              "reviewsreviewlog",
              "shows"
            ]
          ],
          "phraseTimes": [
            {
              "start": 9.04,
              "end": 17.110001
            }
          ]
        },
        {
          "points": [
            "The assistant still passes after the full workflow",
            "One session chains every skill you built: governed code",
            "Log shows who approved what; results/score.",
            "Txt shows whether the assistant still passes after"
          ],
          "keyWords": [
            [
              "full",
              "assistant",
              "still",
              "passes"
            ]
          ],
          "phraseTimes": [
            {
              "start": 18.77,
              "end": 25.02
            }
          ]
        }
      ]
    },
    "verify-capstone-before-close": {
      "splitAt": [
        6.47,
        12.95
      ],
      "segments": [
        {
          "points": [
            "Before you close the lab confirm",
            "MCP returns live intent data your benchmark meets"
          ],
          "keyWords": [
            [
              "close",
              "lab",
              "confirm"
            ],
            [
              "MCP",
              "returns",
              "live",
              "intent"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.14,
              "end": 2.08
            },
            {
              "start": 2.63,
              "end": 6.8
            }
          ]
        },
        {
          "points": [
            "Set and approval is logged before",
            "IaC edit These checks mirror"
          ],
          "keyWords": [
            [
              "set",
              "approval",
              "logged"
            ],
            [
              "IaC",
              "edit",
              "checks",
              "mirror"
            ]
          ],
          "phraseTimes": [
            {
              "start": 7.12,
              "end": 9.01
            },
            {
              "start": 9.61,
              "end": 12.96
            }
          ]
        },
        {
          "points": [
            "Production readiness review — proof the system is safe",
            "To rely on not a formality to rush through"
          ],
          "keyWords": [
            [
              "production",
              "readiness",
              "review",
              "proof"
            ],
            [
              "rely",
              "formality",
              "rush"
            ]
          ],
          "phraseTimes": [
            {
              "start": 12.99,
              "end": 16.129999
            },
            {
              "start": 16.66,
              "end": 19.049999
            }
          ]
        }
      ]
    },
    "capstone-nothing-new-ai": {
      "splitAt": [
        5.47,
        10.95
      ],
      "segments": [
        {
          "points": [
            "If MCP agent or benchmark fails here return",
            "The capstone is integration, not a second chance",
            "Reuse what you built; repair what is broken."
          ],
          "keyWords": [
            [
              "If",
              "MCP",
              "agent",
              "benchmark"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.11,
              "end": 5.39
            }
          ]
        },
        {
          "points": [
            "The capstone is integration not a second chance",
            "If MCP, agent, or benchmark fails here, return",
            "Reuse what you built; repair what is broken."
          ],
          "keyWords": [
            [
              "capstone",
              "integration",
              "chance"
            ]
          ],
          "phraseTimes": [
            {
              "start": 5.48,
              "end": 10.76
            }
          ]
        },
        {
          "points": [
            "FastMCP from scratch Reuse what you built repair what",
            "If MCP, agent, or benchmark fails here, return",
            "The capstone is integration, not a second chance",
            "Reuse what you built; repair what is broken."
          ],
          "keyWords": [
            [
              "FastMCP",
              "scratch",
              "Reuse",
              "built"
            ]
          ],
          "phraseTimes": [
            {
              "start": 11.71,
              "end": 16.15
            }
          ]
        }
      ]
    },
    "story-beat-recap-ai-capstone": {
      "splitAt": [
        4.45,
        8.91
      ],
      "segments": [
        {
          "points": [
            "The following code slides walk the six — step",
            "Line by line Keep both"
          ],
          "keyWords": [
            [
              "following",
              "code",
              "slides",
              "walk"
            ],
            [
              "line",
              "Keep"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.11,
              "end": 2.58
            },
            {
              "start": 3.15,
              "end": 4.82
            }
          ]
        },
        {
          "points": [
            "AI and IaC repos open use sandbox",
            "The following code slides walk the six — step",
            "Keep both AI and IaC repos open, use sandbox"
          ],
          "keyWords": [
            [
              "AI",
              "IaC",
              "repos",
              "open"
            ]
          ],
          "phraseTimes": [
            {
              "start": 4.91,
              "end": 9.02
            }
          ]
        },
        {
          "points": [
            "Models only and treat the runbook as evidence",
            "The following code slides walk the six — step",
            "Keep both AI and IaC repos open, use sandbox"
          ],
          "keyWords": [
            [
              "models",
              "treat",
              "runbook",
              "evidence"
            ]
          ],
          "phraseTimes": [
            {
              "start": 9.18,
              "end": 13.27
            }
          ]
        }
      ]
    },
    "lab-setup-ai-capstone": {
      "splitAt": [
        5.25,
        10.5
      ],
      "segments": [
        {
          "points": [
            "Start the MCP server in the background launch",
            "Log so approvals appear as you go.",
            "Baseline the benchmark before you change prompts mid —"
          ],
          "keyWords": [
            [
              "Start",
              "MCP",
              "server",
              "background"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.15,
              "end": 4.79
            }
          ]
        },
        {
          "points": [
            "Tail reviewslog",
            "Start the MCP server in the background, launch",
            "Log so approvals appear as you go.",
            "Baseline the benchmark before you change prompts mid —"
          ],
          "keyWords": [
            [
              "Tail",
              "reviewslog"
            ]
          ],
          "phraseTimes": [
            {
              "start": 6.53,
              "end": 9.23
            }
          ]
        },
        {
          "points": [
            "Baseline the benchmark before you change prompts mid —",
            "Start the MCP server in the background, launch",
            "Log so approvals appear as you go."
          ],
          "keyWords": [
            [
              "Baseline",
              "benchmark",
              "change",
              "prompts"
            ]
          ],
          "phraseTimes": [
            {
              "start": 10.63,
              "end": 15.61
            }
          ]
        }
      ]
    },
    "resume-ai-capstone-prerequisites": {
      "splitAt": [
        9.64,
        19.29
      ],
      "segments": [
        {
          "points": [
            "Confirm modules one through four are green governed",
            "List_vlans"
          ],
          "keyWords": [
            [
              "modules",
              "Confirm",
              "one",
              "green"
            ],
            [
              "list_vlans"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.08,
              "end": 4.2
            },
            {
              "start": 4.76,
              "end": 9.21
            }
          ]
        },
        {
          "points": [
            "Activate venv — mcp",
            "Confirm modules one through four are green: governed playbook",
            "Py prints a score.",
            "Activate venv — mcp and verify netops_iac_lab/intended/vlans."
          ],
          "keyWords": [
            [
              "Activate",
              "venv-mcp"
            ]
          ],
          "phraseTimes": [
            {
              "start": 11.82,
              "end": 19.375
            }
          ]
        },
        {
          "points": [
            "Starting the capstone on a broken foundation wastes",
            "Confirm modules one through four are green: governed playbook",
            "Py prints a score.",
            "Activate venv — mcp and verify netops_iac_lab/intended/vlans."
          ],
          "keyWords": [
            [
              "Starting",
              "capstone",
              "broken",
              "foundation"
            ]
          ],
          "phraseTimes": [
            {
              "start": 19.375,
              "end": 24.18
            }
          ]
        }
      ]
    },
    "ai-capstone-complete": {
      "splitAt": [
        8.45,
        16.89
      ],
      "segments": [
        {
          "points": [
            "You finish course four with something concrete an auditable",
            "MCP guarded by human approval"
          ],
          "keyWords": [
            [
              "finish",
              "course",
              "something",
              "concrete"
            ],
            [
              "MCP",
              "guarded",
              "human",
              "approval"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.2,
              "end": 5.58
            },
            {
              "start": 6.49,
              "end": 8.69
            }
          ]
        },
        {
          "points": [
            "And measured by benchmarks — built on automate version",
            "You finish course four with something concrete: an auditable",
            "Intelligent automation here means safer operations with a paper"
          ],
          "keyWords": [
            [
              "measured",
              "benchmarks",
              "built",
              "automate"
            ]
          ],
          "phraseTimes": [
            {
              "start": 8.69,
              "end": 17.219999
            }
          ]
        },
        {
          "points": [
            "Intelligent automation here means safer operations with a paper",
            "You finish course four with something concrete: an auditable"
          ],
          "keyWords": [
            [
              "automation",
              "ai",
              "Intelligent",
              "here"
            ]
          ],
          "phraseTimes": [
            {
              "start": 17.219999,
              "end": 25.040001
            }
          ]
        }
      ]
    }
  },
  "infrastructure-as-code-versioned-networks": {
    "what-git-does-plain-language": {
      "splitAt": [
        13.48,
        26.97
      ],
      "segments": [
        {
          "points": [
            "Git watches a folder on disk"
          ],
          "keyWords": [
            [
              "Git",
              "version",
              "control",
              "tool"
            ],
            [
              "git",
              "mark",
              "snapshots",
              "commit"
            ],
            [
              "short",
              "message",
              "like",
              "save"
            ],
            [
              "create",
              "branches"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.16,
              "end": 4.959999999999999
            },
            {
              "start": 5.68,
              "end": 8.36
            },
            {
              "start": 8.87,
              "end": 11.870000000000001
            },
            {
              "start": 12.34,
              "end": 13.51
            }
          ]
        },
        {
          "points": [
            "Git commit marks labeled save points"
          ],
          "keyWords": [
            [
              "VLAN",
              "change",
              "without",
              "touching"
            ]
          ],
          "phraseTimes": [
            {
              "start": 13.509999,
              "end": 27.27
            }
          ]
        },
        {
          "points": [
            "Exam: merge, cherry — pick, reset, revert"
          ],
          "keyWords": [
            [
              "module",
              "focuses",
              "handful",
              "CCNP"
            ],
            [
              "checkout",
              "revert"
            ]
          ],
          "phraseTimes": [
            {
              "start": 27.29,
              "end": 37.739999
            },
            {
              "start": 38.309999,
              "end": 39.870000000000005
            }
          ]
        }
      ]
    },
    "commits-as-save-points": {
      "splitAt": [
        13.37,
        26.73
      ],
      "segments": [
        {
          "points": [
            "Changes, message, author, timestamp"
          ],
          "keyWords": [
            [
              "commit",
              "captures",
              "three",
              "things"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.25,
              "end": 13.42
            }
          ]
        },
        {
          "points": [
            "Stage files with git add first"
          ],
          "keyWords": [
            [
              "commit",
              "stage",
              "files",
              "git"
            ],
            [
              "commits",
              "Small"
            ]
          ],
          "phraseTimes": [
            {
              "start": 13.42,
              "end": 21.580000000000002
            },
            {
              "start": 22.52,
              "end": 27.009999999999998
            }
          ]
        },
        {
          "points": [
            "One logical change per commit"
          ],
          "keyWords": [
            [
              "VLAN",
              "routing",
              "ACL",
              "changes"
            ]
          ],
          "phraseTimes": [
            {
              "start": 27.08,
              "end": 39.83
            }
          ]
        }
      ]
    },
    "merge-and-conflicts-explained": {
      "splitAt": [
        14.05,
        28.09
      ],
      "segments": [
        {
          "points": [
            "One branch edited: auto — merge"
          ],
          "keyWords": [
            [
              "If",
              "one",
              "branch",
              "edited"
            ],
            [
              "forward",
              "main",
              "simply",
              "moves"
            ],
            [
              "If",
              "branches",
              "edited",
              "line"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.18,
              "end": 4.08
            },
            {
              "start": 4.19,
              "end": 10.79
            },
            {
              "start": 11.27,
              "end": 13.57
            }
          ]
        },
        {
          "points": [
            "Same line edited: conflict markers"
          ],
          "keyWords": [
            [
              "conflict",
              "Git",
              "stops",
              "marks"
            ],
            [
              "edit",
              "file",
              "keep",
              "correct"
            ],
            [
              "merge",
              "add",
              "fixed",
              "file"
            ]
          ],
          "phraseTimes": [
            {
              "start": 14.19,
              "end": 17.079999
            },
            {
              "start": 17.559999,
              "end": 23.51
            },
            {
              "start": 24.27,
              "end": 28.32
            }
          ]
        },
        {
          "points": [
            "Fix file, git add, commit merge"
          ],
          "keyWords": [
            [
              "merge",
              "conflict",
              "resolution",
              "merge and conflict resolution"
            ],
            [
              "Ansible",
              "pipelines",
              "fail",
              "parsing"
            ]
          ],
          "phraseTimes": [
            {
              "start": 28.32,
              "end": 38.32
            },
            {
              "start": 39.13,
              "end": 41.94
            }
          ]
        }
      ]
    },
    "reset-revert-cherry-pick-checkout": {
      "splitAt": [
        15.7,
        31.39
      ],
      "segments": [
        {
          "points": [
            "Cherry — pick: one commit onto branch"
          ],
          "keyWords": [
            [
              "commands",
              "exam",
              "expects",
              "know"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.11,
              "end": 15.889999
            }
          ]
        },
        {
          "points": [
            "Revert: safe undo on shared main"
          ],
          "keyWords": [
            [
              "creates",
              "new",
              "commit",
              "undoes"
            ]
          ],
          "phraseTimes": [
            {
              "start": 16.16,
              "end": 31.259999
            }
          ]
        },
        {
          "points": [
            "Reset and checkout restore branch or file"
          ],
          "keyWords": [
            [
              "exam",
              "hard",
              "reset",
              "discards"
            ]
          ],
          "phraseTimes": [
            {
              "start": 31.599999,
              "end": 46.92
            }
          ]
        }
      ]
    },
    "story-beat-recap-git": {
      "splitAt": [
        12.77,
        25.54
      ],
      "segments": [
        {
          "points": [
            "Commits, branches, merge, conflicts"
          ],
          "keyWords": [
            [
              "Git",
              "Pause",
              "seen",
              "copy"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.67,
              "end": 13.15
            }
          ]
        },
        {
          "points": [
            "Cherry — pick, revert, reset, checkout"
          ],
          "keyWords": [
            [
              "Next",
              "lab",
              "Git",
              "netops"
            ],
            [
              "YAML",
              "file",
              "branch",
              "merge"
            ]
          ],
          "phraseTimes": [
            {
              "start": 13.219999,
              "end": 19.919999999999998
            },
            {
              "start": 21.65,
              "end": 25.69
            }
          ]
        },
        {
          "points": [
            "Lab: netops_iac_lab step by step"
          ],
          "keyWords": [
            [
              "Open",
              "terminal",
              "WSL",
              "Mac"
            ]
          ],
          "phraseTimes": [
            {
              "start": 25.75,
              "end": 38.13999999999999
            }
          ]
        }
      ]
    },
    "lab-setup-git-for-networks": {
      "splitAt": [
        14.16,
        28.33
      ],
      "segments": [
        {
          "points": [
            "Create netops_iac_lab project folder"
          ],
          "keyWords": [
            [
              "Git",
              "lab",
              "Welcome",
              "Create"
            ],
            [
              "Inside",
              "add"
            ],
            [
              "Infrastructure",
              "Code"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.04,
              "end": 3.31
            },
            {
              "start": 4.41,
              "end": 14.2
            },
            {
              "start": 7.2,
              "end": 8.46
            }
          ]
        },
        {
          "points": [
            "Add intended/vlans.yaml VLAN intent file"
          ],
          "keyWords": [
            [
              "VLAN",
              "IDs",
              "names",
              "kind"
            ],
            [
              "Git",
              "If",
              "command",
              "found"
            ]
          ],
          "phraseTimes": [
            {
              "start": 14.309999,
              "end": 21.73
            },
            {
              "start": 22.4,
              "end": 29.08
            }
          ]
        },
        {
          "points": [
            "Confirm Git installed: git — — version"
          ],
          "keyWords": [
            [
              "lab",
              "Windows",
              "use",
              "your"
            ]
          ],
          "phraseTimes": [
            {
              "start": 29.219999,
              "end": 42.019999999999996
            }
          ]
        }
      ]
    },
    "certification-alignment-git": {
      "splitAt": [
        12.89,
        25.78
      ],
      "segments": [
        {
          "points": [
            "2.1a: merge, squash, conflict resolution"
          ],
          "keyWords": [
            [
              "exam",
              "objective",
              "Module",
              "one"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.15,
              "end": 12.919998999999999
            }
          ]
        },
        {
          "points": [
            "2.1b — e: cherry — pick, reset, checkout, revert"
          ],
          "keyWords": [
            [
              "Cherry",
              "pick",
              "dot",
              "Reset"
            ],
            [
              "Exam",
              "Revert",
              "dot",
              "scenarios"
            ]
          ],
          "phraseTimes": [
            {
              "start": 12.99,
              "end": 18.63
            },
            {
              "start": 19.55,
              "end": 26.27
            }
          ]
        },
        {
          "points": [
            "Explain each command from lab history"
          ],
          "keyWords": [
            [
              "Module",
              "two",
              "adds",
              "GitLab"
            ]
          ],
          "phraseTimes": [
            {
              "start": 26.29,
              "end": 38.489999999999995
            }
          ]
        }
      ]
    },
    "git-ready-for-cicd": {
      "splitAt": [
        14.09,
        28.18
      ],
      "segments": [
        {
          "points": [
            "Repo with branches and exam commands"
          ],
          "keyWords": [
            [
              "started",
              "module",
              "saving",
              "configs"
            ],
            [
              "Git",
              "repository",
              "feature",
              "branches"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.14,
              "end": 4.97
            },
            {
              "start": 5.45,
              "end": 14.190000000000001
            }
          ]
        },
        {
          "points": [
            "Versioned intent before any pipeline"
          ],
          "keyWords": [
            [
              "foundation",
              "infrastructure",
              "code",
              "builds"
            ],
            [
              "Git",
              "Module",
              "two",
              "connects"
            ]
          ],
          "phraseTimes": [
            {
              "start": 14.21,
              "end": 23.25
            },
            {
              "start": 23.82,
              "end": 27.259999
            }
          ]
        },
        {
          "points": [
            "Module two: GitLab CI/CD stages next"
          ],
          "keyWords": [
            [
              "build",
              "prevalidation",
              "deploy",
              "post"
            ],
            [
              "netops_iac_lab",
              "commit",
              "often",
              "clear"
            ]
          ],
          "phraseTimes": [
            {
              "start": 28.65,
              "end": 34.169999999999995
            },
            {
              "start": 36.109999,
              "end": 42.1
            }
          ]
        }
      ]
    },
    "manual-deploy-breaks-teams": {
      "splitAt": [
        12.77,
        25.55
      ],
      "segments": [
        {
          "points": [
            "Manual ansible — playbook from jump host"
          ],
          "keyWords": [
            [
              "Without",
              "pipeline",
              "senior",
              "engineer"
            ],
            [
              "SSHs",
              "jump",
              "host"
            ],
            [
              "Nobody",
              "sees",
              "log",
              "unless"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.17,
              "end": 2.15
            },
            {
              "start": 2.96,
              "end": 4.62
            },
            {
              "start": 5.93,
              "end": 11.41
            }
          ]
        },
        {
          "points": [
            "Bad YAML reaches switches unchecked"
          ],
          "keyWords": [
            [
              "typo",
              "vlans",
              "dot",
              "yaml"
            ],
            [
              "because",
              "nobody",
              "ran",
              "linter"
            ],
            [
              "Tuesday",
              "CICD"
            ],
            [
              "replace"
            ]
          ],
          "phraseTimes": [
            {
              "start": 12.9,
              "end": 17.209999
            },
            {
              "start": 18.52,
              "end": 21.629999
            },
            {
              "start": 22.440001,
              "end": 24.82
            },
            {
              "start": 25.469999,
              "end": 25.769999499999997
            }
          ]
        },
        {
          "points": [
            "Rollback means guessing last deploy"
          ],
          "keyWords": [
            [
              "lab",
              "adds"
            ],
            [
              "netops_iac_lab"
            ],
            [
              "repo",
              "module",
              "one"
            ]
          ],
          "phraseTimes": [
            {
              "start": 25.769999499999997,
              "end": 31.23
            },
            {
              "start": 32.860001,
              "end": 34.959999
            },
            {
              "start": 37.189999,
              "end": 38.119999
            }
          ]
        }
      ]
    },
    "what-cicd-does-plain-language": {
      "splitAt": [
        14.99,
        29.97
      ],
      "segments": [
        {
          "points": [
            "CI: automated checks on every push"
          ],
          "keyWords": [
            [
              "CI",
              "means",
              "continuous",
              "integration"
            ],
            [
              "YAML",
              "never",
              "merges",
              "quietly"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.59,
              "end": 7.39
            },
            {
              "start": 8.03,
              "end": 15.26
            }
          ]
        },
        {
          "points": [
            "CD: deploy after checks pass"
          ],
          "keyWords": [
            [
              "GitLab",
              "CE",
              "stores",
              "pipeline"
            ],
            [
              "dot",
              "gitlab-ci",
              "dot gitlab",
              "definitions"
            ],
            [
              "dot",
              "yml",
              "repository",
              "root"
            ],
            [
              "GitLab",
              "reads",
              "file",
              "spawns"
            ]
          ],
          "phraseTimes": [
            {
              "start": 15.26,
              "end": 21.92
            },
            {
              "start": 23.290001,
              "end": 25.73
            },
            {
              "start": 26.74,
              "end": 28.030001
            },
            {
              "start": 28.5,
              "end": 30.32
            }
          ]
        },
        {
          "points": [
            "Gitlab — ci.yml defines jobs on runners"
          ],
          "keyWords": [
            [
              "network",
              "automation",
              "runners",
              "often"
            ],
            [
              "DMZ",
              "cloud",
              "VPC",
              "reachability"
            ]
          ],
          "phraseTimes": [
            {
              "start": 30.360001,
              "end": 36.459999
            },
            {
              "start": 36.939999,
              "end": 44.799999
            }
          ]
        }
      ]
    },
    "four-pipeline-stages-exam": {
      "splitAt": [
        10.74,
        21.48,
        32.22
      ],
      "segments": [
        {
          "points": [
            "Build: install Python and Ansible"
          ],
          "keyWords": [
            [
              "Exam",
              "stages",
              "objective",
              "two"
            ],
            [
              "GitLab",
              "CE",
              "Build",
              "prepares"
            ],
            [
              "install",
              "Python"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.1,
              "end": 4.7
            },
            {
              "start": 5.79,
              "end": 8.58
            },
            {
              "start": 9.42,
              "end": 11
            }
          ]
        },
        {
          "points": [
            "Prevalidation: YAML lint and schema"
          ],
          "keyWords": [
            [
              "Ansible",
              "collections",
              "requirements",
              "dot"
            ],
            [
              "checks",
              "intent",
              "any",
              "device"
            ]
          ],
          "phraseTimes": [
            {
              "start": 11.04,
              "end": 15.61
            },
            {
              "start": 16.17,
              "end": 21.75
            }
          ]
        },
        {
          "points": [
            "Deploy check mode; post — validation asserts"
          ],
          "keyWords": [
            [
              "Deploy",
              "applies",
              "automation",
              "often"
            ],
            [
              "then"
            ]
          ],
          "phraseTimes": [
            {
              "start": 22.01,
              "end": 30.75
            },
            {
              "start": 31.68,
              "end": 32.599998
            }
          ]
        },
        {
          "points": [],
          "keyWords": [
            [
              "Post-validation",
              "confirms",
              "outcome"
            ],
            [
              "API",
              "polling",
              "script",
              "asserts"
            ]
          ],
          "phraseTimes": [
            {
              "start": 32.869999,
              "end": 34.689999
            },
            {
              "start": 35.68,
              "end": 42.779999
            }
          ]
        }
      ]
    },
    "gitlab-ci-yaml-anatomy": {
      "splitAt": [
        12.39,
        24.77
      ],
      "segments": [
        {
          "points": [
            "Stages list runs top to bottom"
          ],
          "keyWords": [
            [
              "dot",
              "gitlab-ci",
              "yml",
              "file"
            ],
            [
              "GitLab",
              "runs",
              "top",
              "bottom"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.09,
              "end": 5.88
            },
            {
              "start": 6.42,
              "end": 12.56
            }
          ]
        },
        {
          "points": [
            "Jobs: name, stage, image, script"
          ],
          "keyWords": [
            [
              "Jobs",
              "stage",
              "run"
            ],
            [
              "Use",
              "rules",
              "clauses",
              "run"
            ]
          ],
          "phraseTimes": [
            {
              "start": 12.56,
              "end": 20.059999
            },
            {
              "start": 20.51,
              "end": 24.66
            }
          ]
        },
        {
          "points": [
            "Rules limit deploy to main branch"
          ],
          "keyWords": [
            [
              "Artifacts",
              "pass",
              "files",
              "jobs"
            ],
            [
              "virtualenv"
            ],
            [
              "Network",
              "teams",
              "keep",
              "playbooks"
            ]
          ],
          "phraseTimes": [
            {
              "start": 25.15,
              "end": 27.809999
            },
            {
              "start": 28.299999,
              "end": 30.43
            },
            {
              "start": 31.57,
              "end": 36.860001
            }
          ]
        }
      ]
    },
    "diagnose-pipeline-failures": {
      "splitAt": [
        14.44,
        28.87
      ],
      "segments": [
        {
          "points": [
            "Missing dependency: command not found"
          ],
          "keyWords": [
            [
              "diagnose",
              "Exam",
              "objective",
              "two"
            ],
            [
              "pipeline",
              "failures",
              "GitLab",
              "CE"
            ],
            [
              "Missing",
              "dependency",
              "job",
              "log"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.14,
              "end": 3.92
            },
            {
              "start": 4.85,
              "end": 8.74
            },
            {
              "start": 9.84,
              "end": 14.63
            }
          ]
        },
        {
          "points": [
            "Version conflict: pip or Ansible error"
          ],
          "keyWords": [
            [
              "found",
              "because",
              "requirements",
              "dot"
            ],
            [
              "Incompatible",
              "versions",
              "Ansible",
              "core"
            ],
            [
              "log",
              "shows",
              "ERROR"
            ]
          ],
          "phraseTimes": [
            {
              "start": 15.56,
              "end": 19.639999
            },
            {
              "start": 20.27,
              "end": 25.65
            },
            {
              "start": 26.110001,
              "end": 29.35
            }
          ]
        },
        {
          "points": [
            "Failed tests: post — validation assertion"
          ],
          "keyWords": [
            [
              "Failed",
              "tests",
              "post-validation",
              "script"
            ],
            [
              "Reading",
              "failed",
              "job",
              "log"
            ]
          ],
          "phraseTimes": [
            {
              "start": 29.379999,
              "end": 38.59
            },
            {
              "start": 39.060001,
              "end": 42.66
            }
          ]
        }
      ]
    },
    "story-beat-recap-cicd": {
      "splitAt": [
        13.92,
        27.83
      ],
      "segments": [
        {
          "points": [
            "CI/CD meaning and four exam stages"
          ],
          "keyWords": [
            [
              "Pause",
              "seen",
              "manual"
            ],
            [
              "Ansible",
              "runs",
              "fail",
              "teams"
            ],
            [
              "post-validation"
            ],
            [
              "lab",
              "dot",
              "gitlab-ci"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.14,
              "end": 2.52
            },
            {
              "start": 3.08,
              "end": 8.33
            },
            {
              "start": 9.51,
              "end": 11.89
            },
            {
              "start": 12.59,
              "end": 13.95
            }
          ]
        },
        {
          "points": [
            "Gitlab — ci.yml structure and main gates"
          ],
          "keyWords": [
            [
              "dot",
              "yml",
              "structured",
              "pipelines"
            ],
            [
              "Next",
              "failure",
              "logs",
              "missing"
            ]
          ],
          "phraseTimes": [
            {
              "start": 13.95,
              "end": 19.379999
            },
            {
              "start": 19.98,
              "end": 26.16
            }
          ]
        },
        {
          "points": [
            "Lab: extend netops_iac_lab pipeline"
          ],
          "keyWords": [
            [
              "lab",
              "extend",
              "netops_iac_lab",
              "requirements"
            ],
            [
              "Lab",
              "GitLab",
              "pipeline",
              "file"
            ],
            [
              "continuing"
            ]
          ],
          "phraseTimes": [
            {
              "start": 28.23,
              "end": 32.040001
            },
            {
              "start": 32.599998,
              "end": 38.470001
            },
            {
              "start": 39.580002,
              "end": 41.599998
            }
          ]
        }
      ]
    },
    "lab-setup-cicd-for-networks": {
      "splitAt": [
        16.58,
        33.17
      ],
      "segments": [
        {
          "points": [
            "Add requirements.txt with pinned versions"
          ],
          "keyWords": [
            [
              "lab",
              "Open",
              "your",
              "netops_iac_lab"
            ],
            [
              "CICD",
              "requirements"
            ],
            [
              "dot",
              "txt",
              "listing",
              "ansible-core"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.16,
              "end": 4.02
            },
            {
              "start": 4.58,
              "end": 8.48
            },
            {
              "start": 10.18,
              "end": 17.01
            }
          ]
        },
        {
          "points": [
            "Add deploy_vlans.yml VLAN playbook file"
          ],
          "keyWords": [
            [
              "playbooks",
              "slash",
              "deploy_vlans",
              "dot"
            ],
            [
              "push",
              "yml",
              "playbook",
              "reads"
            ],
            [
              "scripts",
              "slash"
            ]
          ],
          "phraseTimes": [
            {
              "start": 17.809999,
              "end": 20.77
            },
            {
              "start": 21.25,
              "end": 27.23
            },
            {
              "start": 28.34,
              "end": 33.17
            }
          ]
        },
        {
          "points": [
            "Add validate_intent.py post — validation script"
          ],
          "keyWords": [
            [
              "Python",
              "script"
            ],
            [
              "post-validation",
              "job",
              "runs",
              "Create"
            ],
            [
              "lab",
              "dot",
              "gitlab-ci",
              "yml"
            ],
            [
              "root",
              "last",
              "understand"
            ],
            [
              "Push",
              "commit-and-push",
              "commit",
              "Lab"
            ]
          ],
          "phraseTimes": [
            {
              "start": 33.17,
              "end": 35.720001
            },
            {
              "start": 36.950001,
              "end": 38.080002
            },
            {
              "start": 39.529999,
              "end": 41.77
            },
            {
              "start": 42.43,
              "end": 42.98
            },
            {
              "start": 44.560001,
              "end": 49.599998
            }
          ]
        }
      ]
    },
    "certification-alignment-cicd": {
      "splitAt": [
        13.47,
        26.93
      ],
      "segments": [
        {
          "points": [
            "2.2: diagnose pipeline failures from logs"
          ],
          "keyWords": [
            [
              "exam",
              "objectives",
              "Module",
              "two"
            ],
            [
              "GitLab",
              "CE",
              "pipeline",
              "failures"
            ],
            [
              "fixed",
              "missing",
              "ansible-core",
              "version"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.08,
              "end": 5.78
            },
            {
              "start": 7.09,
              "end": 9.64
            },
            {
              "start": 10.29,
              "end": 13.91
            }
          ]
        },
        {
          "points": [
            "2.3: build, prevalidation, deploy, post — validation"
          ],
          "keyWords": [
            [
              "Two",
              "point",
              "three",
              "construct"
            ],
            [
              "post-validation"
            ],
            [
              "stages",
              "dot"
            ]
          ],
          "phraseTimes": [
            {
              "start": 13.91,
              "end": 18.719999
            },
            {
              "start": 19.870001,
              "end": 23.1
            },
            {
              "start": 24.559999,
              "end": 27
            }
          ]
        },
        {
          "points": [
            "Match snippet to missing stage or error"
          ],
          "keyWords": [
            [
              "Exam",
              "items",
              "show",
              "pipeline"
            ]
          ],
          "phraseTimes": [
            {
              "start": 27,
              "end": 37.830002
            }
          ]
        }
      ]
    },
    "cicd-ready-for-containers": {
      "splitAt": [
        11.34,
        22.67
      ],
      "segments": [
        {
          "points": [
            "Four — stage pipeline with failure drills"
          ],
          "keyWords": [
            [
              "started",
              "module",
              "running"
            ],
            [
              "finish",
              "four-stage"
            ],
            [
              "GitLab",
              "pipeline",
              "Git",
              "pinned"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.12,
              "end": 2.2
            },
            {
              "start": 2.86,
              "end": 5.52
            },
            {
              "start": 6.11,
              "end": 11.38
            }
          ]
        },
        {
          "points": [
            "Versioned files to automated delivery"
          ],
          "keyWords": [
            [
              "infrastructure",
              "code",
              "moving",
              "versioned"
            ]
          ],
          "phraseTimes": [
            {
              "start": 11.46,
              "end": 22.75
            }
          ]
        },
        {
          "points": [
            "Module three: Docker Compose and CML"
          ],
          "keyWords": [
            [
              "Docker",
              "Compose",
              "Cisco",
              "Modeling"
            ]
          ],
          "phraseTimes": [
            {
              "start": 22.75,
              "end": 33.779999
            }
          ]
        }
      ]
    },
    "deploy-without-lab-breaks": {
      "splitAt": [
        12.31,
        24.63
      ],
      "segments": [
        {
          "points": [
            "Green pipeline does not prove VLAN works"
          ],
          "keyWords": [
            [
              "green",
              "pipeline",
              "main",
              "prove"
            ],
            [
              "VLAN",
              "intent",
              "works",
              "your"
            ],
            [
              "Without",
              "lab",
              "production",
              "run"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.15,
              "end": 2.88
            },
            {
              "start": 3.59,
              "end": 5.67
            },
            {
              "start": 6.36,
              "end": 10.77
            }
          ]
        },
        {
          "points": [
            "First production run becomes the test"
          ],
          "keyWords": [
            [
              "Containers",
              "give",
              "cheap",
              "repeatable"
            ],
            [
              "CML",
              "gives",
              "Cisco-like"
            ]
          ],
          "phraseTimes": [
            {
              "start": 12.53,
              "end": 19.6
            },
            {
              "start": 20.549999,
              "end": 24.389999
            }
          ]
        },
        {
          "points": [
            "Compose and CML de — risk before change window"
          ],
          "keyWords": [
            [
              "Module",
              "two"
            ],
            [
              "post-validation",
              "checked",
              "file",
              "module"
            ],
            [
              "belong",
              "mature",
              "workflow",
              "change"
            ]
          ],
          "phraseTimes": [
            {
              "start": 24.690001,
              "end": 27.66
            },
            {
              "start": 28.15,
              "end": 32.52
            },
            {
              "start": 32.990002,
              "end": 36.860001
            }
          ]
        }
      ]
    },
    "containers-plain-language": {
      "splitAt": [
        11.1,
        22.19
      ],
      "segments": [
        {
          "points": [
            "Isolated process with own filesystem"
          ],
          "keyWords": [
            [
              "container",
              "lightweight",
              "isolated",
              "process"
            ],
            [
              "filesystem",
              "slice",
              "full"
            ],
            [
              "image",
              "read-only"
            ],
            [
              "template",
              "running",
              "container"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.14,
              "end": 3.48
            },
            {
              "start": 4.23,
              "end": 6.29
            },
            {
              "start": 6.95,
              "end": 8.9
            },
            {
              "start": 9.64,
              "end": 11.51
            }
          ]
        },
        {
          "points": [
            "Image is template; container is instance"
          ],
          "keyWords": [
            [
              "containers",
              "Docker",
              "pulls",
              "images"
            ],
            [
              "containers",
              "automation",
              "solve",
              "works"
            ]
          ],
          "phraseTimes": [
            {
              "start": 11.51,
              "end": 19.200001
            },
            {
              "start": 19.75,
              "end": 22.23
            }
          ]
        },
        {
          "points": [
            "Compose starts linked containers together"
          ],
          "keyWords": [
            [
              "Ansible",
              "version"
            ],
            [
              "Python",
              "packages",
              "match",
              "CI"
            ]
          ],
          "phraseTimes": [
            {
              "start": 22.57,
              "end": 25.610001
            },
            {
              "start": 26.309999,
              "end": 33.040001
            }
          ]
        }
      ]
    },
    "compose-four-concepts-exam": {
      "splitAt": [
        9.32,
        18.65,
        27.97
      ],
      "segments": [
        {
          "points": [
            "Services: containers you define"
          ],
          "keyWords": [
            [
              "Exam",
              "Compose",
              "objective",
              "two"
            ],
            [
              "Services",
              "containers"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.09,
              "end": 5.47
            },
            {
              "start": 5.94,
              "end": 8.14
            }
          ]
        },
        {
          "points": [
            "Networks: virtual L2 between services"
          ],
          "keyWords": [
            [
              "Networks",
              "connect"
            ],
            [
              "L2",
              "segments",
              "lab",
              "underscore"
            ]
          ],
          "phraseTimes": [
            {
              "start": 10.01,
              "end": 13.44
            },
            {
              "start": 14.15,
              "end": 18.77
            }
          ]
        },
        {
          "points": [
            "Volumes: mount host dirs; links via depends_on"
          ],
          "keyWords": [
            [
              "Volumes",
              "persist",
              "mount"
            ],
            [
              "host",
              "directories",
              "containers",
              "mount"
            ]
          ],
          "phraseTimes": [
            {
              "start": 18.77,
              "end": 23.57
            },
            {
              "start": 24.209999,
              "end": 28.030001
            }
          ]
        },
        {
          "points": [],
          "keyWords": [
            [
              "Compose",
              "Links",
              "connected",
              "containers"
            ]
          ],
          "phraseTimes": [
            {
              "start": 28.08,
              "end": 37.209999
            }
          ]
        }
      ]
    },
    "reading-docker-compose": {
      "splitAt": [
        12.8,
        25.6
      ],
      "segments": [
        {
          "points": [
            "Top — level services key per container"
          ],
          "keyWords": [
            [
              "compose",
              "file",
              "YAML",
              "top-level"
            ],
            [
              "service",
              "names",
              "image",
              "command"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.11,
              "end": 5.8
            },
            {
              "start": 6.27,
              "end": 12.73
            }
          ]
        },
        {
          "points": [
            "Trace volume mounts and networks"
          ],
          "keyWords": [
            [
              "networks",
              "section",
              "declares",
              "named"
            ]
          ],
          "phraseTimes": [
            {
              "start": 12.87,
              "end": 25.459999
            }
          ]
        },
        {
          "points": [
            "Repo mounted at /workspace in lab"
          ],
          "keyWords": [
            [
              "snippet",
              "trace",
              "service",
              "mounts"
            ],
            [
              "ansible",
              "service",
              "slash",
              "workspace"
            ]
          ],
          "phraseTimes": [
            {
              "start": 25.77,
              "end": 33.040001
            },
            {
              "start": 33.549999,
              "end": 36.509998
            }
          ]
        }
      ]
    },
    "cml-plain-language": {
      "splitAt": [
        13.18,
        26.36
      ],
      "segments": [
        {
          "points": [
            "Virtual Cisco routers on lab server"
          ],
          "keyWords": [
            [
              "CML",
              "Cisco",
              "Modeling",
              "Labs"
            ],
            [
              "web",
              "UI"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.07,
              "end": 9.28
            },
            {
              "start": 10.34,
              "end": 13.2
            }
          ]
        },
        {
          "points": [
            "Topology in web UI with management IPs"
          ],
          "keyWords": [
            [
              "IOSv",
              "CSR",
              "nodes",
              "connect"
            ],
            [
              "node",
              "gets",
              "management",
              "IP"
            ]
          ],
          "phraseTimes": [
            {
              "start": 13.33,
              "end": 17.190001
            },
            {
              "start": 17.700001,
              "end": 26.634999
            }
          ]
        },
        {
          "points": [
            "Exam 2.4: construct simulation for automation"
          ],
          "keyWords": [
            [
              "simulation",
              "test",
              "network",
              "automation"
            ],
            [
              "automation"
            ],
            [
              "CML",
              "licensed",
              "software",
              "if"
            ]
          ],
          "phraseTimes": [
            {
              "start": 26.634999,
              "end": 29.4
            },
            {
              "start": 30.42,
              "end": 32.759998
            },
            {
              "start": 33.580002,
              "end": 39.389999
            }
          ]
        }
      ]
    },
    "story-beat-recap-containers": {
      "splitAt": [
        12.86,
        25.72
      ],
      "segments": [
        {
          "points": [
            "Containers, Compose, four exam concepts"
          ],
          "keyWords": [
            [
              "simulation",
              "Pause",
              "seen",
              "follows"
            ],
            [
              "CICD",
              "containers",
              "Compose"
            ],
            [
              "Compose",
              "concepts",
              "services",
              "networks"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.09,
              "end": 3.29
            },
            {
              "start": 4.5,
              "end": 7.67
            },
            {
              "start": 8.17,
              "end": 13.44
            }
          ]
        },
        {
          "points": [
            "CML for Cisco lab simulation"
          ],
          "keyWords": [
            [
              "links",
              "read",
              "compose",
              "file"
            ],
            [
              "lab",
              "CML",
              "provides",
              "Cisco"
            ],
            [
              "Next",
              "CML",
              "add",
              "docker"
            ]
          ],
          "phraseTimes": [
            {
              "start": 13.47,
              "end": 16.799999
            },
            {
              "start": 17.389999,
              "end": 21.26
            },
            {
              "start": 21.91,
              "end": 24.73
            }
          ]
        },
        {
          "points": [
            "Lab: docker — compose.yml and CML inventory"
          ],
          "keyWords": [
            [
              "Ansible",
              "plus"
            ],
            [
              "target",
              "stack",
              "then",
              "wire"
            ],
            [
              "CML",
              "topology",
              "Install",
              "Docker"
            ]
          ],
          "phraseTimes": [
            {
              "start": 26.49,
              "end": 30.950001
            },
            {
              "start": 31.49,
              "end": 32.959999
            },
            {
              "start": 33.48,
              "end": 38.380001
            }
          ]
        }
      ]
    },
    "lab-setup-containers-simulation": {
      "splitAt": [
        12.21,
        24.41
      ],
      "segments": [
        {
          "points": [
            "Create docker/ for compose files"
          ],
          "keyWords": [
            [
              "lab",
              "Inside",
              "netops_iac_lab",
              "create"
            ],
            [
              "yml",
              "there",
              "keeps",
              "container"
            ],
            [
              "separate",
              "playbooks",
              "intent",
              "Confirm"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.1,
              "end": 5.64
            },
            {
              "start": 6.31,
              "end": 8.54
            },
            {
              "start": 9.29,
              "end": 12.17
            }
          ]
        },
        {
          "points": [
            "Confirm docker and compose versions"
          ],
          "keyWords": [
            [
              "Docker",
              "works",
              "minus",
              "version"
            ],
            [
              "slash",
              "compose",
              "dot",
              "yml"
            ]
          ],
          "phraseTimes": [
            {
              "start": 12.29,
              "end": 18.790001
            },
            {
              "start": 19.450001,
              "end": 23.299999
            }
          ]
        },
        {
          "points": [
            "Add inventory/compose.yml and inventory/cml.yml"
          ],
          "keyWords": [
            [
              "inventory",
              "slash",
              "cml",
              "dot"
            ],
            [
              "CML",
              "section",
              "playbooks",
              "different"
            ],
            [
              "CML",
              "admin",
              "passwords",
              "use"
            ]
          ],
          "phraseTimes": [
            {
              "start": 24.870001,
              "end": 26.65
            },
            {
              "start": 27.549999,
              "end": 31.49
            },
            {
              "start": 32.220001,
              "end": 36.470001
            }
          ]
        }
      ]
    },
    "certification-alignment-containers": {
      "splitAt": [
        12.96,
        25.93
      ],
      "segments": [
        {
          "points": [
            "2.5: interpret Compose services and networks"
          ],
          "keyWords": [
            [
              "exam",
              "objectives",
              "Module",
              "three"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.15,
              "end": 13.28
            }
          ]
        },
        {
          "points": [
            "2.4: construct CML simulation and validate"
          ],
          "keyWords": [
            [
              "Two",
              "point",
              "construct"
            ],
            [
              "CML",
              "simulation",
              "built"
            ],
            [
              "Exam",
              "items",
              "show",
              "compose"
            ]
          ],
          "phraseTimes": [
            {
              "start": 13.58,
              "end": 15.86
            },
            {
              "start": 16.66,
              "end": 18.139999
            },
            {
              "start": 18.620001,
              "end": 25.959999
            }
          ]
        },
        {
          "points": [
            "Trace network use and reachability steps"
          ],
          "keyWords": [
            [
              "snippet",
              "ask",
              "network",
              "service"
            ],
            [
              "Module",
              "adds",
              "source",
              "truth"
            ]
          ],
          "phraseTimes": [
            {
              "start": 26.040001,
              "end": 32.040001
            },
            {
              "start": 32.970001,
              "end": 38.84
            }
          ]
        }
      ]
    },
    "simulation-ready-for-sot": {
      "splitAt": [
        10.7,
        21.4
      ],
      "segments": [
        {
          "points": [
            "Compose smoke tests plus CML workflow"
          ],
          "keyWords": [
            [
              "started",
              "module",
              "deploying",
              "faith"
            ],
            [
              "Ansible",
              "test",
              "targets"
            ],
            [
              "CML",
              "workflow"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.14,
              "end": 6.35
            },
            {
              "start": 7.17,
              "end": 8.48
            },
            {
              "start": 8.98,
              "end": 11
            }
          ]
        },
        {
          "points": [
            "De — risk automation before production touch"
          ],
          "keyWords": [
            [
              "simulation",
              "Cisco",
              "plus",
              "CI"
            ],
            [
              "Compose",
              "infrastructure",
              "code",
              "de-risks"
            ]
          ],
          "phraseTimes": [
            {
              "start": 11.09,
              "end": 13.99
            },
            {
              "start": 14.46,
              "end": 21.6
            }
          ]
        },
        {
          "points": [
            "Module four: YANG and structured intent"
          ],
          "keyWords": [
            [
              "YANG",
              "intent",
              "files",
              "structured"
            ],
            [
              "YAML",
              "Keep",
              "compose",
              "dot"
            ],
            [
              "CML",
              "inventory",
              "Git",
              "alongside"
            ]
          ],
          "phraseTimes": [
            {
              "start": 21.6,
              "end": 25.530001
            },
            {
              "start": 26.459999,
              "end": 27.530001
            },
            {
              "start": 28.379999,
              "end": 31.18
            }
          ]
        }
      ]
    },
    "running-config-not-sot": {
      "splitAt": [
        13.97,
        27.95
      ],
      "segments": [
        {
          "points": [
            "Scraped config includes mistakes and drift"
          ],
          "keyWords": [
            [
              "running",
              "config",
              "Scraping",
              "show"
            ],
            [
              "Source",
              "truth",
              "starts",
              "intent"
            ],
            [
              "VLAN",
              "one",
              "hundred"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.12,
              "end": 8.59
            },
            {
              "start": 9.17,
              "end": 12.16
            },
            {
              "start": 13.12,
              "end": 14.32
            }
          ]
        },
        {
          "points": [
            "SoT starts with designed intent in Git"
          ],
          "keyWords": [
            [
              "DATA",
              "underscore",
              "VLAN",
              "because"
            ],
            [
              "config",
              "intent",
              "renders",
              "pushes"
            ]
          ],
          "phraseTimes": [
            {
              "start": 14.32,
              "end": 20.77
            },
            {
              "start": 21.66,
              "end": 27.620001
            }
          ]
        },
        {
          "points": [
            "Hotfix without intent update brings drift"
          ],
          "keyWords": [
            [
              "If",
              "someone",
              "SSHs",
              "hotfix"
            ],
            [
              "SoT",
              "solution",
              "Git",
              "plus"
            ]
          ],
          "phraseTimes": [
            {
              "start": 28.76,
              "end": 34.98
            },
            {
              "start": 35.59,
              "end": 41.84
            }
          ]
        }
      ]
    },
    "source-of-truth-plain-language": {
      "splitAt": [
        11.66,
        23.31
      ],
      "segments": [
        {
          "points": [
            "Single trusted description of network"
          ],
          "keyWords": [
            [
              "Source",
              "truth",
              "single",
              "place"
            ],
            [
              "NetBox",
              "Nautobot"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.23,
              "end": 8.57
            },
            {
              "start": 10.74,
              "end": 11.85
            }
          ]
        },
        {
          "points": [
            "Git, NetBox, or database as SoT"
          ],
          "keyWords": [
            [
              "Git",
              "works",
              "well",
              "course"
            ]
          ],
          "phraseTimes": [
            {
              "start": 11.85,
              "end": 23.620001
            }
          ]
        },
        {
          "points": [
            "Update intent first, then pipeline deploys"
          ],
          "keyWords": [
            [
              "key",
              "behavior",
              "one",
              "direction"
            ],
            [
              "Never",
              "treat",
              "switch",
              "authoritative"
            ]
          ],
          "phraseTimes": [
            {
              "start": 23.83,
              "end": 28.219999
            },
            {
              "start": 28.99,
              "end": 34.740002
            }
          ]
        }
      ]
    },
    "intent-vs-implementation": {
      "splitAt": [
        12.69,
        25.37
      ],
      "segments": [
        {
          "points": [
            "Intent: VLAN name on building A switches"
          ],
          "keyWords": [
            [
              "intent",
              "implementation",
              "Data",
              "abstraction"
            ],
            [
              "VLAN",
              "two",
              "hundred",
              "name"
            ],
            [
              "VLAN",
              "access",
              "switches",
              "building"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.07,
              "end": 4.94
            },
            {
              "start": 5.85,
              "end": 8.68
            },
            {
              "start": 9.53,
              "end": 12.72
            }
          ]
        },
        {
          "points": [
            "Implementation: IOS syntax or gNMI paths"
          ],
          "keyWords": [
            [
              "Implementation",
              "exact",
              "IOS",
              "NX-OS"
            ],
            [
              "OpenConfig"
            ]
          ],
          "phraseTimes": [
            {
              "start": 12.72,
              "end": 16.9
            },
            {
              "start": 17.700001,
              "end": 25.42
            }
          ]
        },
        {
          "points": [
            "Same intent JSON, different vendor templates"
          ],
          "keyWords": [
            [
              "paths",
              "pushed",
              "via",
              "gNMI"
            ],
            [
              "JSON",
              "render",
              "Cisco",
              "IOS"
            ]
          ],
          "phraseTimes": [
            {
              "start": 25.48,
              "end": 27.99
            },
            {
              "start": 28.5,
              "end": 37.84
            }
          ]
        }
      ]
    },
    "yang-plain-language": {
      "splitAt": [
        10.87,
        21.73
      ],
      "segments": [
        {
          "points": [
            "RFC 8028 data modeling language"
          ],
          "keyWords": [
            [
              "YANG",
              "language",
              "data",
              "modeling"
            ],
            [
              "YANG",
              "RFC",
              "eight",
              "zero"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.15,
              "end": 4.86
            },
            {
              "start": 5.82,
              "end": 10.3
            }
          ]
        },
        {
          "points": [
            "Containers, lists with keys, typed leaves"
          ],
          "keyWords": [
            [
              "containers",
              "like",
              "vlans",
              "lists"
            ],
            [
              "Tools",
              "validate",
              "instance"
            ]
          ],
          "phraseTimes": [
            {
              "start": 11.09,
              "end": 16.68
            },
            {
              "start": 17.379999,
              "end": 21.73
            }
          ]
        },
        {
          "points": [
            "Validate instance data before push"
          ],
          "keyWords": [
            [
              "memorize"
            ],
            [
              "Cisco",
              "native",
              "module",
              "AUTOCOR"
            ]
          ],
          "phraseTimes": [
            {
              "start": 21.73,
              "end": 26.865001
            },
            {
              "start": 26.865001,
              "end": 32.459999
            }
          ]
        }
      ]
    },
    "yaml-json-from-yang-exam": {
      "splitAt": [
        12.64,
        25.29
      ],
      "segments": [
        {
          "points": [
            "Read list names, keys, leaf identifiers"
          ],
          "keyWords": [
            [
              "YAML",
              "JSON",
              "YANG",
              "Exam"
            ],
            [
              "Read",
              "module",
              "find",
              "list"
            ],
            [
              "JSON",
              "identifiers",
              "uses"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.14,
              "end": 6.01
            },
            {
              "start": 6.67,
              "end": 11.02
            },
            {
              "start": 11.52,
              "end": 13.29
            }
          ]
        },
        {
          "points": [
            "JSON arrays; YAML uses indentation"
          ],
          "keyWords": [
            [
              "nested",
              "objects",
              "arrays",
              "vlan"
            ],
            [
              "YAML",
              "name",
              "keys",
              "uses"
            ],
            [
              "indentation"
            ]
          ],
          "phraseTimes": [
            {
              "start": 13.33,
              "end": 20.809999
            },
            {
              "start": 21.35,
              "end": 23.870001
            },
            {
              "start": 24.34,
              "end": 25.41
            }
          ]
        },
        {
          "points": [
            "Wrong key or type fails validation"
          ],
          "keyWords": [
            [
              "JSON",
              "YAML",
              "build",
              "Wrong"
            ],
            [
              "yang",
              "Python",
              "script",
              "standing"
            ]
          ],
          "phraseTimes": [
            {
              "start": 25.440001,
              "end": 33.779999
            },
            {
              "start": 34.41,
              "end": 36.549999
            }
          ]
        }
      ]
    },
    "story-beat-recap-sot": {
      "splitAt": [
        11.21,
        22.41
      ],
      "segments": [
        {
          "points": [
            "SoT, intent vs implementation, YANG"
          ],
          "keyWords": [
            [
              "Pause",
              "seen",
              "running"
            ],
            [
              "SoT",
              "golden",
              "intent",
              "means"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.11,
              "end": 2.19
            },
            {
              "start": 2.72,
              "end": 11.37
            }
          ]
        },
        {
          "points": [
            "Model families and JSON/YAML mapping"
          ],
          "keyWords": [
            [
              "model",
              "families",
              "exam",
              "two"
            ],
            [
              "Next",
              "JSON",
              "YAML",
              "add"
            ],
            [
              "lab",
              "netops_iac_lab"
            ]
          ],
          "phraseTimes": [
            {
              "start": 11.77,
              "end": 14.98
            },
            {
              "start": 15.75,
              "end": 19.780001
            },
            {
              "start": 20.6,
              "end": 23
            }
          ]
        },
        {
          "points": [
            "Lab: models/intent and validation in CI"
          ],
          "keyWords": [
            [
              "JSON",
              "YAML",
              "instances",
              "validate"
            ],
            [
              "CI",
              "render",
              "IOS",
              "VLAN"
            ]
          ],
          "phraseTimes": [
            {
              "start": 24.67,
              "end": 27.129999
            },
            {
              "start": 28.219999,
              "end": 33.490002
            }
          ]
        }
      ]
    },
    "lab-setup-sot-yang": {
      "splitAt": [
        13.87,
        27.75
      ],
      "segments": [
        {
          "points": [
            "Models/yang for VLAN YANG file"
          ],
          "keyWords": [
            [
              "lab",
              "Inside",
              "netops_iac_lab",
              "create"
            ],
            [
              "SoT",
              "JSON",
              "YAML",
              "instances"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.11,
              "end": 5.75
            },
            {
              "start": 6.35,
              "end": 14.06
            }
          ]
        },
        {
          "points": [
            "Models/intent for JSON or YAML instances"
          ],
          "keyWords": [
            [
              "Create",
              "templates",
              "slash",
              "vlans"
            ],
            [
              "IOS",
              "syntax",
              "Keep",
              "legacy"
            ],
            [
              "lab",
              "migrates",
              "structured"
            ]
          ],
          "phraseTimes": [
            {
              "start": 14.06,
              "end": 19.889999
            },
            {
              "start": 21.030001,
              "end": 26.41
            },
            {
              "start": 26.860001,
              "end": 28.219999
            }
          ]
        },
        {
          "points": [
            "Templates/vlans.j2 renders IOS syntax"
          ],
          "keyWords": [
            [
              "Add",
              "scripts",
              "slash"
            ],
            [
              "Commit",
              "model"
            ],
            [
              "intent",
              "together",
              "history",
              "shows"
            ]
          ],
          "phraseTimes": [
            {
              "start": 29.639999,
              "end": 30.860001
            },
            {
              "start": 31.540001,
              "end": 33.990002
            },
            {
              "start": 34.650002,
              "end": 37.220001
            }
          ]
        }
      ]
    },
    "certification-alignment-sot": {
      "splitAt": [
        11.52,
        23.03
      ],
      "segments": [
        {
          "points": [
            "2.6: integrate SoT into full solution"
          ],
          "keyWords": [
            [
              "exam",
              "objectives",
              "Module",
              "maps"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.17,
              "end": 10.46
            }
          ]
        },
        {
          "points": [
            "2.7: construct JSON/YAML from YANG"
          ],
          "keyWords": [
            [
              "CI",
              "Ansible",
              "renders",
              "SoT"
            ],
            [
              "Two",
              "point",
              "seven",
              "construct"
            ]
          ],
          "phraseTimes": [
            {
              "start": 11.55,
              "end": 15.99
            },
            {
              "start": 16.66,
              "end": 23.08
            }
          ]
        },
        {
          "points": [
            "Trace leaf names and types carefully"
          ],
          "keyWords": [
            [
              "Exam",
              "items",
              "show"
            ]
          ],
          "phraseTimes": [
            {
              "start": 23.08,
              "end": 34.290001
            }
          ]
        }
      ]
    },
    "sot-ready-for-capstone": {
      "splitAt": [
        11.47,
        22.95
      ],
      "segments": [
        {
          "points": [
            "Git, CI/CD, simulation, structured SoT"
          ],
          "keyWords": [
            [
              "started",
              "course",
              "two",
              "saving"
            ],
            [
              "Module",
              "one",
              "added",
              "Git"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.09,
              "end": 1.74
            },
            {
              "start": 2.2,
              "end": 11.87
            }
          ]
        },
        {
          "points": [
            "JSON, YAML, validation, rendered configs"
          ],
          "keyWords": [
            [
              "YANG-shaped",
              "intent",
              "JSON"
            ],
            [
              "capstone",
              "YAML",
              "validation",
              "rendered"
            ]
          ],
          "phraseTimes": [
            {
              "start": 11.87,
              "end": 15.34
            },
            {
              "start": 16.280001,
              "end": 21.610001
            }
          ]
        },
        {
          "points": [
            "Capstone ties all four modules together"
          ],
          "keyWords": [
            [
              "Git",
              "CICD",
              "simulate",
              "deploy"
            ],
            [
              "Keep",
              "intent",
              "models",
              "slash"
            ],
            [
              "intent",
              "never",
              "edit",
              "running"
            ],
            [
              "SoT",
              "without",
              "updating"
            ]
          ],
          "phraseTimes": [
            {
              "start": 23.32,
              "end": 25.48
            },
            {
              "start": 27.139999,
              "end": 30.200001
            },
            {
              "start": 30.67,
              "end": 31.76
            },
            {
              "start": 32.360001,
              "end": 34.34
            }
          ]
        }
      ]
    },
    "capstone-integrates-four-modules": {
      "splitAt": [
        13.91,
        27.81
      ],
      "segments": [
        {
          "points": [
            "Add VLAN 300 LAB_CAPSTONE to intent"
          ],
          "keyWords": [
            [
              "Module",
              "ended",
              "models",
              "slash"
            ],
            [
              "vlans",
              "dot",
              "json"
            ],
            [
              "capstone",
              "adds",
              "one",
              "VLAN"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.17,
              "end": 4.03
            },
            {
              "start": 4.65,
              "end": 6.82
            },
            {
              "start": 8,
              "end": 14.07
            }
          ]
        },
        {
          "points": [
            "Full chain: Git, pipeline, simulate"
          ],
          "keyWords": [
            [
              "CAPSTONE",
              "runs",
              "full",
              "chain"
            ],
            [
              "module",
              "modules",
              "one"
            ],
            [
              "Git",
              "tracks",
              "intent",
              "change"
            ]
          ],
          "phraseTimes": [
            {
              "start": 14.07,
              "end": 17.08
            },
            {
              "start": 17.74,
              "end": 19.58
            },
            {
              "start": 20.51,
              "end": 27.969999
            }
          ]
        },
        {
          "points": [
            "Same repo; fixed step order"
          ],
          "keyWords": [
            [
              "Compose",
              "smoke-tests",
              "connectivity",
              "CML"
            ],
            [
              "steps",
              "fixed",
              "order",
              "repo"
            ]
          ],
          "phraseTimes": [
            {
              "start": 29.200001,
              "end": 38.41
            },
            {
              "start": 38.41,
              "end": 41.349998
            }
          ]
        }
      ]
    },
    "capstone-repo-layout": {
      "splitAt": [
        17.97,
        35.93
      ],
      "segments": [
        {
          "points": [
            "Models/intent: golden VLAN data"
          ],
          "keyWords": [
            [
              "lab",
              "know",
              "files",
              "live"
            ],
            [
              "models",
              "slash",
              "intent",
              "holds"
            ],
            [
              "data",
              "models",
              "slash",
              "yang"
            ],
            [
              "file",
              "dot",
              "gitlab-ci",
              "yml"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.14,
              "end": 2.47
            },
            {
              "start": 3.3,
              "end": 7.64
            },
            {
              "start": 8.21,
              "end": 12.52
            },
            {
              "start": 12.99,
              "end": 18.120001
            }
          ]
        },
        {
          "points": [
            "Models/yang and .gitlab — ci.yml pipeline"
          ],
          "keyWords": [
            [
              "SoT",
              "Compose",
              "jobs",
              "modules"
            ],
            [
              "three",
              "docker",
              "slash"
            ],
            [
              "Compose",
              "lab",
              "inventory",
              "slash"
            ],
            [
              "Ansible",
              "your",
              "CML",
              "routers"
            ],
            [
              "render",
              "sot"
            ]
          ],
          "phraseTimes": [
            {
              "start": 18.120001,
              "end": 23.049999
            },
            {
              "start": 23.57,
              "end": 25.469999
            },
            {
              "start": 26.16,
              "end": 29.450001
            },
            {
              "start": 30.200001,
              "end": 34.27
            },
            {
              "start": 35.310001,
              "end": 35.59
            }
          ]
        },
        {
          "points": [
            "Docker folder, cml inventory, templates"
          ],
          "keyWords": [
            [
              "sot",
              "dot",
              "yml",
              "templates"
            ],
            [
              "vlans",
              "dot",
              "two",
              "turn"
            ],
            [
              "IOS",
              "syntax",
              "edit",
              "intent"
            ]
          ],
          "phraseTimes": [
            {
              "start": 36.419998,
              "end": 38.799999
            },
            {
              "start": 39.509998,
              "end": 41.360001
            },
            {
              "start": 43.5,
              "end": 47.950001
            }
          ]
        }
      ]
    },
    "six-steps-capstone-runbook": {
      "splitAt": [
        15.38,
        30.75
      ],
      "segments": [
        {
          "points": [
            "Edit intent; branch, commit, push"
          ],
          "keyWords": [
            [
              "order",
              "Run",
              "capstone",
              "time"
            ],
            [
              "VLAN",
              "three",
              "hundred",
              "Two"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.1,
              "end": 6.36
            },
            {
              "start": 7.32,
              "end": 14.59
            }
          ]
        },
        {
          "points": [
            "Validate, render, CML check mode"
          ],
          "keyWords": [
            [
              "Three",
              "run",
              "local",
              "validate"
            ],
            [
              "render",
              "watch",
              "prevalidation",
              "jobs"
            ],
            [
              "ansible-playbook",
              "check",
              "mode",
              "against"
            ]
          ],
          "phraseTimes": [
            {
              "start": 15.43,
              "end": 17.84
            },
            {
              "start": 18.639999,
              "end": 22.559999
            },
            {
              "start": 24.389999,
              "end": 31.25
            }
          ]
        },
        {
          "points": [
            "Merge main; verify render and logs"
          ],
          "keyWords": [
            [
              "Six",
              "open",
              "rendered",
              "slash"
            ],
            [
              "VLAN",
              "three",
              "hundred",
              "appears"
            ],
            [
              "if",
              "any",
              "stage",
              "fails"
            ]
          ],
          "phraseTimes": [
            {
              "start": 31.610001,
              "end": 39.18
            },
            {
              "start": 39.939999,
              "end": 43.279999
            },
            {
              "start": 43.880001,
              "end": 45.990002
            }
          ]
        }
      ]
    },
    "four-files-capstone-chain": {
      "splitAt": [
        15.17,
        30.35
      ],
      "segments": [
        {
          "points": [
            "Vlans.json intent; gitlab — ci.yml gates"
          ],
          "keyWords": [
            [
              "artifacts",
              "capstone",
              "carry",
              "story"
            ],
            [
              "models",
              "slash",
              "intent",
              "vlans"
            ],
            [
              "seven",
              "shape",
              "dot"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.05,
              "end": 2.33
            },
            {
              "start": 2.99,
              "end": 12.23
            },
            {
              "start": 12.92,
              "end": 15
            }
          ]
        },
        {
          "points": [
            "Inventory/cml.yml holds simulation targets"
          ],
          "keyWords": [
            [
              "CICD",
              "gates",
              "run"
            ],
            [
              "exam",
              "two",
              "point",
              "three"
            ],
            [
              "dot",
              "yml",
              "simulation",
              "targets"
            ]
          ],
          "phraseTimes": [
            {
              "start": 15.44,
              "end": 19.280001
            },
            {
              "start": 19.85,
              "end": 24.84
            },
            {
              "start": 25.33,
              "end": 27.49
            }
          ]
        },
        {
          "points": [
            "Rendered/vlans.cfg generated config proof"
          ],
          "keyWords": [
            [
              "exam",
              "two",
              "point",
              "rendered"
            ],
            [
              "cfg",
              "generated",
              "output",
              "templates"
            ],
            [
              "SoT",
              "became",
              "config",
              "text"
            ],
            [
              "next",
              "already",
              "know"
            ]
          ],
          "phraseTimes": [
            {
              "start": 30.35,
              "end": 32.880001
            },
            {
              "start": 33.959999,
              "end": 34.619999
            },
            {
              "start": 35.57,
              "end": 40.16
            },
            {
              "start": 41.029999,
              "end": 42.540001
            }
          ]
        }
      ]
    },
    "verify-pipeline-before-close": {
      "splitAt": [
        12.5,
        24.99
      ],
      "segments": [
        {
          "points": [
            "Post — validation job must exit zero"
          ],
          "keyWords": [
            [
              "render",
              "stop",
              "git",
              "merge"
            ],
            [
              "vlans",
              "dot",
              "cfg"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.14,
              "end": 8.81
            },
            {
              "start": 10.13,
              "end": 11.93
            }
          ]
        },
        {
          "points": [
            "Rendered/vlans.cfg shows VLAN 300"
          ],
          "keyWords": [
            [
              "LAB",
              "underscore",
              "CAPSTONE",
              "appear"
            ],
            [
              "If",
              "use",
              "CML",
              "SSH"
            ]
          ],
          "phraseTimes": [
            {
              "start": 12.93,
              "end": 17.76
            },
            {
              "start": 18.469999,
              "end": 25.16
            }
          ]
        },
        {
          "points": [
            "Fix intent in Git, not device only"
          ],
          "keyWords": [
            [
              "VLAN",
              "three",
              "hundred",
              "approved"
            ]
          ],
          "phraseTimes": [
            {
              "start": 25.16,
              "end": 37.259998
            }
          ]
        }
      ]
    },
    "capstone-nothing-new": {
      "splitAt": [
        13.94,
        27.87
      ],
      "segments": [
        {
          "points": [
            "Git, GitLab, Docker, Python already installed"
          ],
          "keyWords": [
            [
              "install",
              "already",
              "installed",
              "everything"
            ],
            [
              "GitLab",
              "runner",
              "dot",
              "com"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.11,
              "end": 4.99
            },
            {
              "start": 5.84,
              "end": 12.41
            }
          ]
        },
        {
          "points": [
            "Push fails: fix module one remote"
          ],
          "keyWords": [
            [
              "Python",
              "Ansible",
              "jinja2",
              "modules"
            ],
            [
              "If",
              "pipeline",
              "fails",
              "missing"
            ],
            [
              "requirements"
            ]
          ],
          "phraseTimes": [
            {
              "start": 14.7,
              "end": 19.889999
            },
            {
              "start": 20.440001,
              "end": 25.82
            },
            {
              "start": 26.940001,
              "end": 27.98
            }
          ]
        },
        {
          "points": [
            "Pipeline, compose, or validate fails: fix that module"
          ],
          "keyWords": [
            [
              "If",
              "compose",
              "ping",
              "fails"
            ],
            [
              "If",
              "validate_yang_intent",
              "fails",
              "fix"
            ]
          ],
          "phraseTimes": [
            {
              "start": 27.98,
              "end": 31.280001
            },
            {
              "start": 32.330002,
              "end": 39.290001
            }
          ]
        }
      ]
    },
    "story-beat-recap-capstone": {
      "splitAt": [
        10.9,
        21.79
      ],
      "segments": [
        {
          "points": [
            "Module four plus one VLAN change"
          ],
          "keyWords": [
            [
              "capstone",
              "Pause",
              "module",
              "plus"
            ],
            [
              "Lab",
              "VLAN",
              "change",
              "run"
            ],
            [
              "Compose",
              "CML",
              "check",
              "mode"
            ],
            [
              "know",
              "repo"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.1,
              "end": 3.06
            },
            {
              "start": 3.82,
              "end": 6.39
            },
            {
              "start": 7.04,
              "end": 7.83
            },
            {
              "start": 8.74,
              "end": 10.77
            }
          ]
        },
        {
          "points": [
            "Six steps and four artifacts to inspect"
          ],
          "keyWords": [
            [
              "Next",
              "slides",
              "walk",
              "commands"
            ],
            [
              "line",
              "branch"
            ]
          ],
          "phraseTimes": [
            {
              "start": 11.4,
              "end": 16.790001
            },
            {
              "start": 17.799999,
              "end": 21.639999
            }
          ]
        },
        {
          "points": [
            "Commands line by line in netops_iac_lab"
          ],
          "keyWords": [
            [
              "CML",
              "check",
              "merge",
              "pipeline"
            ],
            [
              "Lab",
              "Git",
              "commands",
              "Open"
            ],
            [
              "simulation",
              "targets"
            ]
          ],
          "phraseTimes": [
            {
              "start": 21.799999,
              "end": 26.02
            },
            {
              "start": 26.76,
              "end": 29.139999
            },
            {
              "start": 30.01,
              "end": 31.16
            }
          ]
        }
      ]
    },
    "lab-setup-capstone-lab": {
      "splitAt": [
        14.22,
        28.44
      ],
      "segments": [
        {
          "points": [
            "Cd netops_iac_lab; clean main branch"
          ],
          "keyWords": [
            [
              "capstone",
              "lab",
              "Welcome",
              "cd"
            ],
            [
              "working",
              "tree",
              "clean",
              "main"
            ],
            [
              "lab",
              "Confirm",
              "dot",
              "gitlab-ci"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.15,
              "end": 6.39
            },
            {
              "start": 7.44,
              "end": 8.93
            },
            {
              "start": 9.41,
              "end": 14.47
            }
          ]
        },
        {
          "points": [
            "Confirm .gitlab — ci.yml has all jobs"
          ],
          "keyWords": [
            [
              "build",
              "prevalidation",
              "deploy",
              "post-validation"
            ],
            [
              "SoT",
              "Compose",
              "jobs",
              "later"
            ],
            [
              "Confirm",
              "models",
              "slash",
              "intent"
            ]
          ],
          "phraseTimes": [
            {
              "start": 14.47,
              "end": 16.940001
            },
            {
              "start": 17.48,
              "end": 21.09
            },
            {
              "start": 22.48,
              "end": 28.799999
            }
          ]
        },
        {
          "points": [
            "Confirm vlans.json has VLANs 100, 200"
          ],
          "keyWords": [
            [
              "VLANs",
              "one",
              "hundred"
            ],
            [
              "Lab",
              "Docker",
              "GitLab",
              "access"
            ]
          ],
          "phraseTimes": [
            {
              "start": 28.799999,
              "end": 30.360001
            },
            {
              "start": 31.34,
              "end": 41.91
            }
          ]
        }
      ]
    },
    "resume-capstone-prerequisites": {
      "splitAt": [
        13.17,
        26.33
      ],
      "segments": [
        {
          "points": [
            "Modules 1 — 2: git remote and CI lint"
          ],
          "keyWords": [
            [
              "editing",
              "intent",
              "run",
              "sixty-second"
            ],
            [
              "Module",
              "two",
              "requirements"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.08,
              "end": 4.66
            },
            {
              "start": 5.14,
              "end": 10.21
            }
          ]
        },
        {
          "points": [
            "Module 3: compose up and cml IPs"
          ],
          "keyWords": [
            [
              "installs",
              "dot",
              "gitlab-ci",
              "yml"
            ],
            [
              "Module",
              "three",
              "docker",
              "compose"
            ],
            [
              "docker",
              "folder",
              "inventory"
            ]
          ],
          "phraseTimes": [
            {
              "start": 13.21,
              "end": 21.110001
            },
            {
              "start": 21.93,
              "end": 24.620001
            },
            {
              "start": 25.129999,
              "end": 26.57
            }
          ]
        },
        {
          "points": [
            "Module 4: validate_yang_intent passes"
          ],
          "keyWords": [
            [
              "slash",
              "cml",
              "dot",
              "yml"
            ],
            [
              "IPs",
              "Module",
              "validate_yang_intent",
              "dot"
            ]
          ],
          "phraseTimes": [
            {
              "start": 27.389999,
              "end": 29.08
            },
            {
              "start": 29.889999,
              "end": 39.299999
            }
          ]
        }
      ]
    },
    "course-two-complete": {
      "splitAt": [
        12.16,
        24.32
      ],
      "segments": [
        {
          "points": [
            "AUTOCOR 2.1–2.7 in one repo"
          ],
          "keyWords": [
            [
              "Course",
              "two",
              "infrastructure-as-code",
              "objectives"
            ],
            [
              "CICD",
              "stages"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.12,
              "end": 8.78
            },
            {
              "start": 10.34,
              "end": 12.19
            }
          ]
        },
        {
          "points": [
            "Git, CI/CD, simulation, YANG SoT"
          ],
          "keyWords": [
            [
              "Docker",
              "Compose",
              "CML"
            ],
            [
              "YANG-modeled",
              "source",
              "truth",
              "JSON"
            ],
            [
              "YAML",
              "instances",
              "ran",
              "them"
            ]
          ],
          "phraseTimes": [
            {
              "start": 12.19,
              "end": 16.32
            },
            {
              "start": 16.99,
              "end": 21.02
            },
            {
              "start": 21.52,
              "end": 23.709999
            }
          ]
        },
        {
          "points": [
            "Netops_iac_lab as reference repo"
          ],
          "keyWords": [
            [
              "Course",
              "one",
              "repo",
              "netops_iac_lab"
            ],
            [
              "CCNP",
              "path",
              "picks",
              "up"
            ],
            [
              "two",
              "AUTOCOR",
              "section"
            ]
          ],
          "phraseTimes": [
            {
              "start": 24.370001,
              "end": 28.190001
            },
            {
              "start": 29.09,
              "end": 31.690001
            },
            {
              "start": 33,
              "end": 33.57
            }
          ]
        }
      ]
    },
    "iac-capstone-complete": {
      "splitAt": [
        11.47,
        22.95
      ],
      "segments": [
        {
          "points": [
            "Golden intent in Git with pipeline gates"
          ],
          "keyWords": [
            [
              "started",
              "course",
              "two",
              "copying"
            ],
            [
              "finish",
              "golden",
              "intent",
              "Git"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.1,
              "end": 1.81
            },
            {
              "start": 2.7,
              "end": 11.42
            }
          ]
        },
        {
          "points": [
            "Compose, CML, rendered YANG — shaped configs"
          ],
          "keyWords": [
            [
              "infrastructure",
              "code"
            ],
            [
              "AUTOCOR",
              "section",
              "two",
              "story"
            ],
            [
              "Keep",
              "netops_iac_lab"
            ]
          ],
          "phraseTimes": [
            {
              "start": 11.51,
              "end": 18.280001
            },
            {
              "start": 18.889999,
              "end": 21.17
            },
            {
              "start": 21.780001,
              "end": 23.110001
            }
          ]
        },
        {
          "points": [
            "Update intent first, always"
          ],
          "keyWords": [
            [
              "Update",
              "intent",
              "always"
            ]
          ],
          "phraseTimes": [
            {
              "start": 23.110001,
              "end": 26.92
            }
          ]
        }
      ]
    }
  },
  "network-automation-program-networks": {
    "built-for-ccna-ready-engineers": {
      "splitAt": [
        6.15,
        12.31
      ],
      "segments": [
        {
          "points": [
            "Built for students preparing for certification and engineers shipping",
            "You already know VLANs, OSPF, and ACL basics.",
            "You are not expected to be a senior developer.",
            "You are expected to verify every change, use check"
          ],
          "keyWords": [
            [
              "Built",
              "students",
              "preparing",
              "certification"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.14,
              "end": 6.06
            }
          ]
        },
        {
          "points": [
            "VLANs OSPF and ACL basics You are not expected",
            "Built for students preparing for certification and engineers shipping",
            "You already know VLANs, OSPF, and ACL basics.",
            "You are not expected to be a senior developer."
          ],
          "keyWords": [
            [
              "VLANs",
              "OSPF",
              "ACL",
              "basics"
            ]
          ],
          "phraseTimes": [
            {
              "start": 7.76,
              "end": 12.88
            }
          ]
        },
        {
          "points": [
            "You are expected to verify every change use check",
            "Built for students preparing for certification and engineers shipping",
            "You already know VLANs, OSPF, and ACL basics.",
            "You are not expected to be a senior developer."
          ],
          "keyWords": [
            [
              "expected",
              "verify",
              "change",
              "use"
            ]
          ],
          "phraseTimes": [
            {
              "start": 12.88,
              "end": 18.290001
            }
          ]
        }
      ]
    },
    "pillar-program-and-automate": {
      "splitAt": [
        7.02,
        14.05
      ],
      "segments": [
        {
          "points": [
            "Course one connects programming to live networks Manual",
            "CLI fails when the same change"
          ],
          "keyWords": [
            [
              "one",
              "program",
              "Course",
              "connects"
            ],
            [
              "CLI",
              "fails",
              "change"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.12,
              "end": 4.46
            },
            {
              "start": 5.16,
              "end": 7.1
            }
          ]
        },
        {
          "points": [
            "Labs walk Python",
            "RESTCONF — style"
          ],
          "keyWords": [
            [
              "Labs",
              "walk",
              "Python"
            ],
            [
              "RESTCONF-style"
            ]
          ],
          "phraseTimes": [
            {
              "start": 7.1,
              "end": 11.9
            },
            {
              "start": 12.77,
              "end": 14.13
            }
          ]
        },
        {
          "points": [
            "APIs and Ansible playbooks that apply intent consistently",
            "AUTOCOR assumes you can execute"
          ],
          "keyWords": [
            [
              "build-and-program",
              "build",
              "program",
              "APIs"
            ],
            [
              "AUTOCOR",
              "assumes",
              "execute"
            ]
          ],
          "phraseTimes": [
            {
              "start": 15.24,
              "end": 18.91
            },
            {
              "start": 19.5,
              "end": 20.75
            }
          ]
        }
      ]
    },
    "pillar-version-network-intent": {
      "splitAt": [
        7.23,
        14.47
      ],
      "segments": [
        {
          "points": [
            "Course two versions network intent",
            "A saved running — config on a file share"
          ],
          "keyWords": [
            [
              "two",
              "intent",
              "version",
              "Course"
            ],
            [
              "saved",
              "running-config",
              "file",
              "share"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.09,
              "end": 2.13
            },
            {
              "start": 2.67,
              "end": 7.07
            }
          ]
        },
        {
          "points": [
            "Labs store VLAN and OSPF YAML in Git branch",
            "Course two versions network intent.",
            "A saved running — config on a file share"
          ],
          "keyWords": [
            [
              "Labs",
              "store",
              "VLAN",
              "OSPF"
            ]
          ],
          "phraseTimes": [
            {
              "start": 7.42,
              "end": 14.84
            }
          ]
        },
        {
          "points": [
            "Review and revert bad commits safely preparing",
            "Course two versions network intent.",
            "A saved running — config on a file share",
            "Labs store VLAN and OSPF YAML in Git, branch"
          ],
          "keyWords": [
            [
              "review",
              "revert",
              "bad",
              "commits"
            ]
          ],
          "phraseTimes": [
            {
              "start": 14.88,
              "end": 21.440001
            }
          ]
        }
      ]
    },
    "pillar-operate-and-validate": {
      "splitAt": [
        6.21,
        12.43
      ],
      "segments": [
        {
          "points": [
            "Course three proves the network stays healthy after deploy",
            "Snapshot polling misses fast failures.",
            "Labs stream model — driven telemetry, tie events"
          ],
          "keyWords": [
            [
              "three",
              "Course",
              "proves",
              "network"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.08,
              "end": 6.21
            }
          ]
        },
        {
          "points": [
            "Labs stream model — driven telemetry tie events",
            "Validation and harden"
          ],
          "keyWords": [
            [
              "Labs",
              "stream",
              "model-driven",
              "telemetry"
            ],
            [
              "validation",
              "harden"
            ]
          ],
          "phraseTimes": [
            {
              "start": 6.46,
              "end": 10.39
            },
            {
              "start": 11.16,
              "end": 12.48
            }
          ]
        },
        {
          "points": [
            "TLS and secret handling the operate — and —",
            "Course three proves the network stays healthy after deploy.",
            "Snapshot polling misses fast failures.",
            "Labs stream model — driven telemetry, tie events"
          ],
          "keyWords": [
            [
              "operate-and-secure",
              "operate",
              "secure",
              "TLS"
            ]
          ],
          "phraseTimes": [
            {
              "start": 12.48,
              "end": 17.17
            }
          ]
        }
      ]
    },
    "pillar-ai-with-guardrails": {
      "splitAt": [
        8.24,
        16.49
      ],
      "segments": [
        {
          "points": [
            "Course four governs AI — assisted automation Labs",
            "Ansible from a prompt",
            "Require human review"
          ],
          "keyWords": [
            [
              "AI",
              "Course",
              "governs",
              "AI-assisted"
            ],
            [
              "Ansible",
              "prompt"
            ],
            [
              "require",
              "human",
              "review"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.13,
              "end": 3.48
            },
            {
              "start": 4.03,
              "end": 6.76
            },
            {
              "start": 7.21,
              "end": 8.61
            }
          ]
        },
        {
          "points": [
            "Exam focus benefits risks privacy",
            "Course four governs AI — assisted automation.",
            "Labs generate Ansible from a prompt, require human review,",
            "Exam focus: benefits, risks, privacy, IP ownership, and validation,"
          ],
          "keyWords": [
            [
              "Exam",
              "focus",
              "benefits",
              "risks"
            ]
          ],
          "phraseTimes": [
            {
              "start": 8.81,
              "end": 16.24
            }
          ]
        },
        {
          "points": [
            "IP ownership and validation not novelty for its own",
            "Your networking judgment stays in charge"
          ],
          "keyWords": [
            [
              "IP",
              "ownership",
              "validation",
              "novelty"
            ],
            [
              "Your",
              "networking",
              "judgment",
              "stays"
            ]
          ],
          "phraseTimes": [
            {
              "start": 16.639999,
              "end": 21.35
            },
            {
              "start": 22.01,
              "end": 24.459999
            }
          ]
        }
      ]
    },
    "evolution-of-network-operations": {
      "splitAt": [
        14.88,
        29.75
      ]
    },
    "what-automation-means": {
      "splitAt": [
        13.59,
        27.19
      ]
    },
    "importance-of-idempotency": {
      "splitAt": [
        13.86,
        27.72
      ]
    },
    "architecture-patterns-overview": {
      "splitAt": [
        10.61,
        21.23,
        31.84
      ]
    },
    "story-beat-recap": {
      "splitAt": [
        12.12,
        24.24
      ]
    },
    "lab-setup-introduction": {
      "splitAt": [
        12.92,
        25.85
      ]
    },
    "choose-your-lab-environment": {
      "splitAt": [
        12.75,
        25.51
      ]
    },
    "open-your-terminal": {
      "splitAt": [
        12.31,
        24.63
      ]
    },
    "story-beat-common-mistake": {
      "splitAt": [
        12.17,
        24.34
      ]
    },
    "certification-alignment": {
      "splitAt": [
        13.69,
        27.39
      ]
    },
    "automation-as-infrastructure": {
      "splitAt": [
        13.37,
        26.74
      ]
    },
    "python-essentials-for-networkers": {
      "splitAt": [
        11.44,
        22.89,
        34.33
      ]
    },
    "reading-python-without-fear": {
      "splitAt": [
        13.54,
        27.07
      ]
    },
    "data-structures-for-device-data": {
      "splitAt": [
        13.64,
        27.27
      ]
    },
    "config-data-from-files": {
      "splitAt": [
        13.82,
        27.63
      ]
    },
    "error-handling-that-saves-outages": {
      "splitAt": [
        14.09,
        28.19
      ]
    },
    "netmiko-connection-pattern": {
      "splitAt": [
        13.6,
        27.21
      ]
    },
    "story-beat-recap-python": {
      "splitAt": [
        12.2,
        24.4
      ]
    },
    "lab-setup-python-automation": {
      "splitAt": [
        13.88,
        27.75
      ]
    },
    "resume-your-lab-environment": {
      "splitAt": [
        14.45,
        28.89
      ]
    },
    "story-beat-common-mistake-python": {
      "splitAt": [
        12.33,
        24.66
      ]
    },
    "certification-alignment-python": {
      "splitAt": [
        13.85,
        27.71
      ]
    },
    "python-automation-ready": {
      "splitAt": [
        13.21,
        26.42
      ]
    },
    "what-is-rest": {
      "splitAt": [
        17.54,
        35.07
      ]
    },
    "rest-for-network-engineers": {
      "splitAt": [
        15.67,
        31.34
      ]
    },
    "yang-explained-plain-language": {
      "splitAt": [
        13.4,
        26.81
      ]
    },
    "yang-structure-basics": {
      "splitAt": [
        13.48,
        26.95
      ]
    },
    "restconf-urls-and-methods": {
      "splitAt": [
        15.34,
        30.67
      ]
    },
    "api-auth-and-rate-limits": {
      "splitAt": [
        15.42,
        30.85
      ]
    },
    "http-errors-and-pagination": {
      "splitAt": [
        16.08,
        32.17
      ]
    },
    "story-beat-recap-apis": {
      "splitAt": [
        13.65,
        27.31
      ]
    },
    "lab-setup-restconf": {
      "splitAt": [
        14.57,
        29.13
      ]
    },
    "resume-lab-install-restconf-tools": {
      "splitAt": [
        15.13,
        30.26
      ]
    },
    "story-beat-common-mistake-restconf": {
      "splitAt": [
        14.11,
        28.21
      ]
    },
    "certification-alignment-apis": {
      "splitAt": [
        13.71,
        27.41
      ]
    },
    "apis-programmability-ready": {
      "splitAt": [
        12.94,
        25.87
      ]
    },
    "why-ansible-for-networks": {
      "splitAt": [
        13.95,
        27.91,
        41.86
      ]
    },
    "ansible-playbook-anatomy": {
      "splitAt": [
        13.43,
        26.87
      ]
    },
    "ansible-modules-and-idempotency": {
      "splitAt": [
        13.72,
        27.45
      ]
    },
    "terraform-selection-basics": {
      "splitAt": [
        17.53,
        35.06
      ]
    },
    "low-code-vs-custom-automation": {
      "splitAt": [
        15.8,
        31.59
      ]
    },
    "choosing-your-automation-approach": {
      "splitAt": [
        15.38,
        30.75
      ]
    },
    "story-beat-recap-toolchains": {
      "splitAt": [
        13.57,
        27.13
      ]
    },
    "lab-setup-full-workflow": {
      "splitAt": [
        13.89,
        27.78
      ]
    },
    "resume-lab-ansible-ready": {
      "splitAt": [
        13.92,
        27.85
      ]
    },
    "story-beat-common-mistake-toolchains": {
      "splitAt": [
        14.06,
        28.13
      ]
    },
    "certification-alignment-toolchains": {
      "splitAt": [
        13.82,
        27.64
      ]
    },
    "toolchains-ready-capstone-next": {
      "splitAt": [
        13.36,
        26.71
      ]
    },
    "capstone-integrates-four-modules": {
      "splitAt": [
        18.75,
        37.51
      ]
    },
    "branch-network-reference-design": {
      "splitAt": [
        16.59,
        33.18
      ]
    },
    "git-as-source-of-truth": {
      "splitAt": [
        15.54,
        31.07
      ]
    },
    "architecture-pillars-in-practice": {
      "splitAt": [
        15.67,
        31.34
      ]
    },
    "capstone-change-runbook": {
      "splitAt": [
        16.74,
        33.47
      ]
    },
    "verify-before-you-close": {
      "splitAt": [
        15.1,
        30.21
      ]
    },
    "capstone-tool-matrix": {
      "splitAt": [
        15.81,
        31.61
      ]
    },
    "story-beat-recap-capstone": {
      "splitAt": [
        15.43,
        30.85
      ]
    },
    "lab-setup-enterprise-branch": {
      "splitAt": [
        15.72,
        31.43
      ]
    },
    "resume-all-modules-lab": {
      "splitAt": [
        15.34,
        30.69
      ]
    },
    "story-beat-common-mistake-capstone": {
      "splitAt": [
        14.09,
        28.18
      ]
    },
    "certification-alignment-full-course": {
      "splitAt": [
        16.77,
        33.54
      ]
    },
    "course-complete-enterprise-automation": {
      "splitAt": [
        14.17,
        28.35
      ]
    }
  },
  "network-operations-automated-networks": {
    "polling-vs-streaming": {
      "splitAt": [
        13.39,
        26.77
      ],
      "segments": [
        {
          "points": [
            "Traditional monitoring often polls every five minutes an NMS",
            "SNMP get requests and stores whatever counters happened",
            "That works for slow — moving links but misses"
          ],
          "keyWords": [
            [
              "Traditional",
              "monitoring",
              "often",
              "polls"
            ],
            [
              "SNMP",
              "get",
              "requests",
              "stores"
            ],
            [
              "works",
              "slow-moving",
              "links",
              "misses"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.15,
              "end": 4.78
            },
            {
              "start": 5.43,
              "end": 10.06
            },
            {
              "start": 10.63,
              "end": 13.78
            }
          ]
        },
        {
          "points": [
            "CPU spike or a flap that cleared before",
            "Every second or on change —"
          ],
          "keyWords": [
            [
              "Streaming",
              "telemetry",
              "CPU",
              "spike"
            ],
            [
              "change"
            ]
          ],
          "phraseTimes": [
            {
              "start": 14.18,
              "end": 22.16
            },
            {
              "start": 22.719999,
              "end": 25.01
            }
          ]
        },
        {
          "points": [
            "The device is the publisher your collector listens",
            "Data feeds validation scripts dashboards and anomaly detectors without"
          ],
          "keyWords": [
            [
              "streaming",
              "device",
              "publisher",
              "your"
            ],
            [
              "data",
              "feeds",
              "validation",
              "scripts"
            ]
          ],
          "phraseTimes": [
            {
              "start": 26.99,
              "end": 33.990002
            },
            {
              "start": 35.119999,
              "end": 40.07
            }
          ]
        }
      ]
    },
    "what-model-driven-telemetry-means": {
      "splitAt": [
        14.37,
        28.73
      ],
      "segments": [
        {
          "points": [
            "Model — driven telemetry often shortened to MDT",
            "YANG models the platform already understands — not random"
          ],
          "keyWords": [
            [
              "Model-driven",
              "telemetry",
              "Model",
              "often"
            ],
            [
              "model",
              "YANG",
              "models",
              "platform"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.13,
              "end": 2.79
            },
            {
              "start": 3.86,
              "end": 14.56
            }
          ]
        },
        {
          "points": [
            "The model is the contract between",
            "Model — driven telemetry, often shortened to MDT, means",
            "A path like interfaces — state slash interface slash",
            "The model is the contract between producer and consumer."
          ],
          "keyWords": [
            [
              "model",
              "contract"
            ]
          ],
          "phraseTimes": [
            {
              "start": 14.75,
              "end": 29.190001
            }
          ]
        },
        {
          "points": [
            "That is why exam three point one focuses",
            "OID from legacy SNMP"
          ],
          "keyWords": [
            [
              "exam",
              "three",
              "point",
              "one"
            ],
            [
              "OID",
              "legacy",
              "SNMP"
            ]
          ],
          "phraseTimes": [
            {
              "start": 29.34,
              "end": 39.669998
            },
            {
              "start": 40.279999,
              "end": 42.009998
            }
          ]
        }
      ]
    },
    "mdt-architecture-components": {
      "splitAt": [
        11.01,
        22.02,
        33.03
      ],
      "segments": [
        {
          "points": [
            "Exam three point one names",
            "Four architectural pieces you should sketch from memory",
            "The data producer is the network device — router"
          ],
          "keyWords": [
            [
              "Exam",
              "three",
              "point",
              "one"
            ],
            [
              "architectural",
              "pieces",
              "sketch",
              "memory"
            ],
            [
              "data",
              "producer",
              "network",
              "device"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.14,
              "end": 1.97
            },
            {
              "start": 2.52,
              "end": 5.75
            },
            {
              "start": 6.26,
              "end": 11.06
            }
          ]
        },
        {
          "points": [
            "A telemetry agent that reads",
            "The transport is usually gRPC over TCP sometimes"
          ],
          "keyWords": [
            [
              "telemetry",
              "agent",
              "reads"
            ],
            [
              "transport",
              "usually",
              "gRPC",
              "over"
            ]
          ],
          "phraseTimes": [
            {
              "start": 11.06,
              "end": 13.27
            },
            {
              "start": 13.76,
              "end": 22.209999
            }
          ]
        },
        {
          "points": [
            "YANG path or sensor group to an update policy",
            "The consumer is anything that ingests"
          ],
          "keyWords": [
            [
              "YANG",
              "path",
              "sensor",
              "group"
            ],
            [
              "consumer",
              "anything",
              "ingests"
            ]
          ],
          "phraseTimes": [
            {
              "start": 22.209999,
              "end": 29.709999
            },
            {
              "start": 30.98,
              "end": 32.900002
            }
          ]
        },
        {
          "points": [
            "Prometheus with a gNMI exporter Telegraf Kafka or your",
            "Config looks correct"
          ],
          "keyWords": [
            [
              "Prometheus",
              "gNMI",
              "exporter",
              "Telegraf"
            ],
            [
              "config",
              "looks",
              "correct"
            ]
          ],
          "phraseTimes": [
            {
              "start": 33.41,
              "end": 42.34
            },
            {
              "start": 42.91,
              "end": 43.869999
            }
          ]
        }
      ]
    },
    "yang-models-in-telemetry": {
      "splitAt": [
        15.05,
        30.09
      ],
      "segments": [
        {
          "points": [
            "YANG models from module four of course two reappear",
            "Cisco — IOS — XE — platform — oper"
          ],
          "keyWords": [
            [
              "YANG",
              "models",
              "Cisco",
              "module"
            ],
            [
              "Cisco-IOS-XE-platform-oper",
              "Cisco",
              "oper",
              "platform"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.09,
              "end": 9.31
            },
            {
              "start": 10.38,
              "end": 14.34
            }
          ]
        },
        {
          "points": [
            "CPU and memory A subscription references these paths —",
            "XPath or OpenConfig equivalents depending on platform The collector",
            "Names it decodes what"
          ],
          "keyWords": [
            [
              "CPU",
              "memory",
              "subscription",
              "references"
            ],
            [
              "platform",
              "XPath",
              "OpenConfig",
              "equivalents"
            ],
            [
              "names",
              "decodes"
            ]
          ],
          "phraseTimes": [
            {
              "start": 15.28,
              "end": 21.379999
            },
            {
              "start": 22.110001,
              "end": 28.41
            },
            {
              "start": 28.99,
              "end": 30.469999
            }
          ]
        },
        {
          "points": [
            "When troubleshooting empty streams verify the path exists",
            "YANG models from module four of course two reappear",
            "Cisco publishes models such as Cisco — IOS —",
            "A subscription references these paths — either native XPath"
          ],
          "keyWords": [
            [
              "platform",
              "stream",
              "troubleshooting",
              "empty"
            ]
          ],
          "phraseTimes": [
            {
              "start": 30.790001,
              "end": 44.970001
            }
          ]
        }
      ]
    },
    "story-beat-recap-telemetry": {
      "splitAt": [
        12.63,
        25.25
      ],
      "segments": [
        {
          "points": [
            "Why polling misses real problems what model — driven",
            "YANG models"
          ],
          "keyWords": [
            [
              "telemetry",
              "Pause",
              "seen",
              "polling"
            ],
            [
              "YANG",
              "models"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.1,
              "end": 6.15
            },
            {
              "start": 7.16,
              "end": 12.71
            }
          ]
        },
        {
          "points": [
            "Stand up",
            "Netops_ops_lab with a collector container enable",
            "IOS XE style"
          ],
          "keyWords": [
            [
              "Next",
              "stand",
              "up"
            ],
            [
              "lab",
              "netops_ops_lab",
              "collector",
              "container"
            ],
            [
              "IOS",
              "XE",
              "style"
            ]
          ],
          "phraseTimes": [
            {
              "start": 13.27,
              "end": 17.99
            },
            {
              "start": 18.870001,
              "end": 22.540001
            },
            {
              "start": 23.629999,
              "end": 25.299999
            }
          ]
        },
        {
          "points": [
            "Prometheus Open",
            "WSL or Linux workflow as courses one"
          ],
          "keyWords": [
            [
              "Prometheus",
              "Open"
            ],
            [
              "WSL",
              "Linux",
              "workflow",
              "courses"
            ]
          ],
          "phraseTimes": [
            {
              "start": 25.299999,
              "end": 31.879999
            },
            {
              "start": 32.66,
              "end": 37.66
            }
          ]
        }
      ]
    },
    "lab-setup-telemetry": {
      "splitAt": [
        14.83,
        29.66
      ],
      "segments": [
        {
          "points": [
            "Telemetry lab",
            "Create a folder named netops_ops_lab beside your course",
            "Operate and observe not replace your"
          ],
          "keyWords": [
            [
              "telemetry",
              "lab",
              "Welcome"
            ],
            [
              "lab",
              "Create",
              "folder",
              "named"
            ],
            [
              "operate",
              "observe",
              "replace",
              "your"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.07,
              "end": 1.6
            },
            {
              "start": 2.15,
              "end": 10.16
            },
            {
              "start": 10.75,
              "end": 14.83
            }
          ]
        },
        {
          "points": [
            "Git repo Inside netops_ops_lab add a docker — compose",
            "Prometheus and a gNMI or MDT",
            "Collector image the exact file",
            "Is on the next slides"
          ],
          "keyWords": [
            [
              "lab",
              "Git",
              "repo",
              "Inside"
            ],
            [
              "Prometheus",
              "gNMI",
              "MDT"
            ],
            [
              "collector",
              "image",
              "exact",
              "file"
            ],
            [
              "next",
              "slides"
            ]
          ],
          "phraseTimes": [
            {
              "start": 15.06,
              "end": 18.48
            },
            {
              "start": 19.83,
              "end": 23.83
            },
            {
              "start": 24.389999,
              "end": 26.01
            },
            {
              "start": 26.83,
              "end": 27.65
            }
          ]
        },
        {
          "points": [
            "CML node to the collector IP on port",
            "Five seven five zero zero for gRPC Confirm",
            "This lab never touches production use sandbox credentials only"
          ],
          "keyWords": [
            [
              "CML",
              "node",
              "collector",
              "IP"
            ],
            [
              "five",
              "seven",
              "zero",
              "gRPC"
            ],
            [
              "lab",
              "never",
              "touches",
              "production"
            ]
          ],
          "phraseTimes": [
            {
              "start": 30.57,
              "end": 34.029999
            },
            {
              "start": 35.09,
              "end": 38.41
            },
            {
              "start": 38.919998,
              "end": 44.240002
            }
          ]
        }
      ]
    },
    "certification-alignment-telemetry": {
      "splitAt": [
        11.38,
        22.75
      ],
      "segments": [
        {
          "points": [
            "Module one maps to exam objective three point one",
            "You should explain producer, transport, subscription, and consumer without",
            "Compare SNMP polling to gNMI streaming.",
            "Describe dial — out versus dial — in."
          ],
          "keyWords": [
            [
              "exam",
              "objective",
              "Module",
              "one"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.18,
              "end": 11.81
            }
          ]
        },
        {
          "points": [
            "Compare SNMP polling to gNMI streaming Describe dial —",
            "Module one maps to exam objective three point one",
            "You should explain producer, transport, subscription, and consumer without",
            "Compare SNMP polling to gNMI streaming."
          ],
          "keyWords": [
            [
              "Compare",
              "SNMP",
              "polling",
              "gNMI"
            ]
          ],
          "phraseTimes": [
            {
              "start": 11.99,
              "end": 22.809999
            }
          ]
        },
        {
          "points": [
            "Exam scenarios may show a broken diagram and ask",
            "Module one maps to exam objective three point one",
            "You should explain producer, transport, subscription, and consumer without",
            "Compare SNMP polling to gNMI streaming."
          ],
          "keyWords": [
            [
              "Exam",
              "scenarios",
              "show",
              "broken"
            ]
          ],
          "phraseTimes": [
            {
              "start": 22.809999,
              "end": 33.799999
            }
          ]
        }
      ]
    },
    "telemetry-ready-for-logging": {
      "splitAt": [
        12.9,
        25.8
      ],
      "segments": [
        {
          "points": [
            "You started this module with show commands and five",
            "That stream is evidence"
          ],
          "keyWords": [
            [
              "started",
              "module",
              "show",
              "commands"
            ],
            [
              "stream",
              "evidence"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.1,
              "end": 9.65
            },
            {
              "start": 10.37,
              "end": 13.36
            }
          ]
        },
        {
          "points": [
            "— the same kind of evidence module two uses",
            "When syslog and webhooks capture",
            "Keep netops_ops_lab running module two",
            "Adds structured logging targets and teaches"
          ],
          "keyWords": [
            [
              "kind",
              "evidence",
              "module",
              "two"
            ],
            [
              "syslog",
              "webhooks",
              "capture"
            ],
            [
              "Keep",
              "netops_ops_lab",
              "running",
              "module"
            ],
            [
              "logging",
              "adds",
              "structured",
              "targets"
            ]
          ],
          "phraseTimes": [
            {
              "start": 13.58,
              "end": 16.530001
            },
            {
              "start": 17.27,
              "end": 19.85
            },
            {
              "start": 21,
              "end": 24.49
            },
            {
              "start": 24.969999,
              "end": 25.809999
            }
          ]
        },
        {
          "points": [
            "Teaches you to diagnose pipeline failures from log",
            "Never point telemetry collectors at production without change control",
            "TLS planning — module four covers"
          ],
          "keyWords": [
            [
              "teaches",
              "diagnose",
              "pipeline",
              "failures"
            ],
            [
              "telemetry",
              "Never",
              "point",
              "collectors"
            ],
            [
              "TLS",
              "planning",
              "module",
              "covers"
            ]
          ],
          "phraseTimes": [
            {
              "start": 25.809999,
              "end": 29.59
            },
            {
              "start": 30.18,
              "end": 32.73
            },
            {
              "start": 34.91,
              "end": 36.779999
            }
          ]
        }
      ]
    },
    "metrics-without-logs-blind-spots": {
      "splitAt": [
        13.81,
        27.61
      ],
      "segments": [
        {
          "points": [
            "Prometheus may show interface errors climbing while your",
            "Playbook log sits on one engineer's laptop",
            "GitLab shows a red pipeline X but not"
          ],
          "keyWords": [
            [
              "Prometheus",
              "show",
              "interface",
              "errors"
            ],
            [
              "playbook",
              "log",
              "sits",
              "one"
            ],
            [
              "GitLab",
              "shows",
              "red",
              "pipeline"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.13,
              "end": 3.79
            },
            {
              "start": 4.4,
              "end": 6.56
            },
            {
              "start": 7.36,
              "end": 13.75
            }
          ]
        },
        {
          "points": [
            "A syslog gap means",
            "BGP flap timestamp with a config push",
            "Logging strategy means deciding what to record at which"
          ],
          "keyWords": [
            [
              "syslog",
              "gap",
              "means"
            ],
            [
              "BGP",
              "flap",
              "timestamp",
              "config"
            ],
            [
              "Logging",
              "strategy",
              "means",
              "deciding"
            ]
          ],
          "phraseTimes": [
            {
              "start": 14.09,
              "end": 16.799999
            },
            {
              "start": 17.34,
              "end": 22.57
            },
            {
              "start": 23.08,
              "end": 27.690001
            }
          ]
        },
        {
          "points": [
            "Network automation multiplies",
            "APIs and webhooks Each layer must emit events"
          ],
          "keyWords": [
            [
              "Network",
              "automation",
              "multiplies"
            ],
            [
              "APIs",
              "webhooks",
              "layer",
              "emit"
            ]
          ],
          "phraseTimes": [
            {
              "start": 27.690001,
              "end": 34.66
            },
            {
              "start": 36.389999,
              "end": 41.240002
            }
          ]
        }
      ]
    },
    "what-logging-strategy-means": {
      "splitAt": [
        16.32,
        32.65
      ],
      "segments": [
        {
          "points": [
            "Exam three point two asks you to implement",
            "In plain language choose log sources",
            "Python scripts Ansible"
          ],
          "keyWords": [
            [
              "logging",
              "strategy",
              "Exam",
              "three"
            ],
            [
              "plain",
              "language",
              "choose",
              "log"
            ],
            [
              "Python",
              "scripts",
              "Ansible"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.15,
              "end": 5.65
            },
            {
              "start": 6.19,
              "end": 11.63
            },
            {
              "start": 13.53,
              "end": 16.52
            }
          ]
        },
        {
          "points": [
            "GitLab jobs IOS XE — pick a format",
            "JSON beats unparsed text for search — select transports"
          ],
          "keyWords": [
            [
              "GitLab",
              "jobs",
              "IOS",
              "XE"
            ],
            [
              "JSON",
              "beats",
              "unparsed",
              "text"
            ]
          ],
          "phraseTimes": [
            {
              "start": 16.700001,
              "end": 21.65
            },
            {
              "start": 22.43,
              "end": 32.389999
            }
          ]
        },
        {
          "points": [
            "A strategy document lists severity levels required fields like",
            "And which destination receives which event class",
            "Device config changes might go to syslog Pipeline",
            "One size does not fit all destinations"
          ],
          "keyWords": [
            [
              "strategy",
              "document",
              "lists",
              "severity"
            ],
            [
              "destination",
              "receives",
              "event",
              "class"
            ],
            [
              "Device",
              "config",
              "changes",
              "go"
            ],
            [
              "One",
              "size",
              "fit",
              "destinations"
            ]
          ],
          "phraseTimes": [
            {
              "start": 32.720001,
              "end": 38.299999
            },
            {
              "start": 38.849998,
              "end": 40.669998
            },
            {
              "start": 41.639999,
              "end": 43.25
            },
            {
              "start": 43.860001,
              "end": 48.66
            }
          ]
        }
      ]
    },
    "logging-architecture-components": {
      "splitAt": [
        10.22,
        20.43,
        30.65
      ],
      "segments": [
        {
          "points": [
            "Mirror the telemetry mental model with four logging pieces",
            "Python log dot"
          ],
          "keyWords": [
            [
              "logging",
              "pieces",
              "Mirror",
              "telemetry"
            ],
            [
              "Python",
              "log",
              "dot"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.08,
              "end": 6.56
            },
            {
              "start": 7.06,
              "end": 10.34
            }
          ]
        },
        {
          "points": [
            "The format encodes fields — plain syslog text",
            "Mirror the telemetry mental model with four logging pieces.",
            "The event producer emits a record — a switch",
            "The transport delivers — syslog forwarder, HTTPS webhook,"
          ],
          "keyWords": [
            [
              "format",
              "encodes",
              "fields",
              "plain"
            ]
          ],
          "phraseTimes": [
            {
              "start": 10.59,
              "end": 16.42
            }
          ]
        },
        {
          "points": [
            "The transport delivers — syslog forwarder HTTPS webhook",
            "The sink stores and indexes — rsyslog files Elasticsearch"
          ],
          "keyWords": [
            [
              "transport",
              "delivers",
              "syslog",
              "forwarder"
            ],
            [
              "sink",
              "stores",
              "indexes",
              "rsyslog"
            ]
          ],
          "phraseTimes": [
            {
              "start": 21.02,
              "end": 22.879999
            },
            {
              "start": 23.77,
              "end": 30.780001
            }
          ]
        },
        {
          "points": [
            "A broken strategy usually omits correlation IDs —",
            "ID in both log"
          ],
          "keyWords": [
            [
              "broken",
              "strategy",
              "usually",
              "omits"
            ],
            [
              "ID",
              "log"
            ]
          ],
          "phraseTimes": [
            {
              "start": 30.780001,
              "end": 35.34
            },
            {
              "start": 35.790001,
              "end": 40.790001
            }
          ]
        }
      ]
    },
    "structured-vs-unstructured-logs": {
      "splitAt": [
        14.75,
        29.5
      ],
      "segments": [
        {
          "points": [
            "Unstructured logs read well",
            "Ansible failed on host sw1 — but grep"
          ],
          "keyWords": [
            [
              "logs",
              "structured",
              "Unstructured",
              "read"
            ],
            [
              "Structured",
              "Ansible",
              "failed",
              "host"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.87,
              "end": 2.83
            },
            {
              "start": 3.4,
              "end": 12.57
            }
          ]
        },
        {
          "points": [
            "JSON fields timestamp level request_id host playbook task error",
            "JSON lines — one JSON object per line —"
          ],
          "keyWords": [
            [
              "Automation",
              "JSON",
              "fields",
              "timestamp"
            ],
            [
              "JSON",
              "lines",
              "one",
              "object"
            ]
          ],
          "phraseTimes": [
            {
              "start": 14.81,
              "end": 23.309999
            },
            {
              "start": 24.58,
              "end": 29.709999
            }
          ]
        },
        {
          "points": [
            "Exam scenarios may show a log snippet and ask",
            "JSON formatter is enough for lab work",
            "Versioning"
          ],
          "keyWords": [
            [
              "Exam",
              "scenarios",
              "show",
              "log"
            ],
            [
              "JSON",
              "formatter",
              "enough",
              "lab"
            ],
            [
              "versioning"
            ]
          ],
          "phraseTimes": [
            {
              "start": 29.709999,
              "end": 37.200001
            },
            {
              "start": 38.419998,
              "end": 41.279999
            },
            {
              "start": 41.75,
              "end": 43.459999
            }
          ]
        }
      ]
    },
    "event-workflows-for-automation": {
      "splitAt": [
        13.06,
        26.11
      ],
      "segments": [
        {
          "points": [
            "Event workflow means what happens after something is logged",
            "A typical automation flow: trigger — merge to main",
            "Module one telemetry might trigger an alert on threshold;",
            "Design workflows so noisy INFO logs do not page"
          ],
          "keyWords": [
            [
              "Event",
              "workflow",
              "means",
              "happens"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.11,
              "end": 13.22
            }
          ]
        },
        {
          "points": [
            "And end with job ID —",
            "ID in GitLab Ansible",
            "ERROR level —"
          ],
          "keyWords": [
            [
              "end",
              "job",
              "ID"
            ],
            [
              "ID",
              "GitLab",
              "Ansible"
            ],
            [
              "ERROR",
              "level"
            ]
          ],
          "phraseTimes": [
            {
              "start": 13.22,
              "end": 15.54
            },
            {
              "start": 17.43,
              "end": 22.459999
            },
            {
              "start": 23.02,
              "end": 26.115001
            }
          ]
        },
        {
          "points": [
            "Act — engineer or runbook",
            "Module one telemetry might trigger an alert on threshold",
            "Design workflows so noisy INFO logs do not page",
            "CRITICAL webhook failures do"
          ],
          "keyWords": [
            [
              "act",
              "engineer",
              "runbook"
            ],
            [
              "Module",
              "one",
              "telemetry",
              "trigger"
            ],
            [
              "workflows",
              "Design",
              "noisy",
              "INFO"
            ],
            [
              "CRITICAL",
              "webhook",
              "failures"
            ]
          ],
          "phraseTimes": [
            {
              "start": 26.115001,
              "end": 27.49
            },
            {
              "start": 28.049999,
              "end": 31.15
            },
            {
              "start": 31.73,
              "end": 36.75
            },
            {
              "start": 36.779999,
              "end": 38.889999
            }
          ]
        }
      ]
    },
    "root-cause-analysis-plain-language": {
      "splitAt": [
        14.35,
        28.69
      ],
      "segments": [
        {
          "points": [
            "Root cause analysis RCA is not blame —",
            "Exam three point three gives you logs and output",
            "Start at the symptom — pipeline red, VLAN missing",
            "Hypothesis, test with one log query, confirm or eliminate."
          ],
          "keyWords": [
            [
              "Root",
              "cause",
              "analysis",
              "RCA"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.17,
              "end": 14.78
            }
          ]
        },
        {
          "points": [
            "Event and asks what failed and why Start",
            "VLAN missing — walk backward through timestamps — prevalidation"
          ],
          "keyWords": [
            [
              "event",
              "asks",
              "failed",
              "Start"
            ],
            [
              "VLAN",
              "missing",
              "walk",
              "backward"
            ]
          ],
          "phraseTimes": [
            {
              "start": 14.78,
              "end": 18.51
            },
            {
              "start": 19.26,
              "end": 28.99
            }
          ]
        },
        {
          "points": [
            "Oh four — compare layers",
            "Hypothesis test with one",
            "The wrong answer picks the first error line without"
          ],
          "keyWords": [
            [
              "oh",
              "compare",
              "layers"
            ],
            [
              "Hypothesis",
              "test",
              "one"
            ],
            [
              "wrong",
              "answer",
              "picks",
              "error"
            ]
          ],
          "phraseTimes": [
            {
              "start": 29.280001,
              "end": 32.580002
            },
            {
              "start": 33.040001,
              "end": 37.09
            },
            {
              "start": 37.540001,
              "end": 42.84
            }
          ]
        }
      ]
    },
    "diagnose-automation-from-logs": {
      "splitAt": [
        14.42,
        28.85
      ],
      "segments": [
        {
          "points": [
            "Three failure patterns repeat",
            "AUTOCOR exam for three point",
            "Missing dependency — job",
            "ModuleNotFoundError or command not found — fix requirements"
          ],
          "keyWords": [
            [
              "Three",
              "failure",
              "patterns",
              "repeat"
            ],
            [
              "AUTOCOR",
              "exam",
              "three",
              "point"
            ],
            [
              "Missing",
              "dependency",
              "job"
            ],
            [
              "ModuleNotFoundError",
              "command",
              "found",
              "fix"
            ],
            [
              "Wrong",
              "inventory"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.1,
              "end": 2.11
            },
            {
              "start": 2.58,
              "end": 4.2
            },
            {
              "start": 4.69,
              "end": 6.82
            },
            {
              "start": 8.35,
              "end": 12.64
            },
            {
              "start": 13.31,
              "end": 14.87
            }
          ]
        },
        {
          "points": [
            "Ansible skips hosts or targets production — log shows",
            "Script exits one — log shows assert VLAN two"
          ],
          "keyWords": [
            [
              "log",
              "Ansible",
              "skips",
              "hosts"
            ],
            [
              "log",
              "script",
              "exits",
              "one"
            ]
          ],
          "phraseTimes": [
            {
              "start": 14.91,
              "end": 24.969999
            },
            {
              "start": 25.66,
              "end": 29.040001
            }
          ]
        },
        {
          "points": [
            "Webhook not received —",
            "Pipeline succeeded locally but SIEM",
            "URL TLS and firewall Always read the first ERROR"
          ],
          "keyWords": [
            [
              "Webhook",
              "received"
            ],
            [
              "pipeline",
              "succeeded",
              "locally",
              "SIEM"
            ],
            [
              "URL",
              "TLS",
              "firewall",
              "Always"
            ]
          ],
          "phraseTimes": [
            {
              "start": 29.26,
              "end": 33.93
            },
            {
              "start": 34.5,
              "end": 35.59
            },
            {
              "start": 36.669998,
              "end": 43.040001
            }
          ]
        }
      ]
    },
    "story-beat-recap-logging": {
      "splitAt": [
        12.87,
        25.75
      ],
      "segments": [
        {
          "points": [
            "Why metrics need logs what a logging strategy covers",
            "Structured"
          ],
          "keyWords": [
            [
              "logging",
              "Pause",
              "seen",
              "metrics"
            ],
            [
              "structured"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.15,
              "end": 5.43
            },
            {
              "start": 6.24,
              "end": 12.77
            }
          ]
        },
        {
          "points": [
            "JSON for search event workflows RCA steps and common",
            "Extend netops_ops_lab with a Python"
          ],
          "keyWords": [
            [
              "JSON",
              "search",
              "event",
              "workflows"
            ],
            [
              "Next",
              "lab",
              "extend",
              "netops_ops_lab"
            ]
          ],
          "phraseTimes": [
            {
              "start": 12.92,
              "end": 19.540001
            },
            {
              "start": 20.6,
              "end": 25.07
            }
          ]
        },
        {
          "points": [
            "JSON logs an rsyslog receiver for syslog",
            "It still runs logging adds a parallel evidence path"
          ],
          "keyWords": [
            [
              "JSON",
              "logs",
              "rsyslog",
              "receiver"
            ],
            [
              "logging",
              "still",
              "runs",
              "adds"
            ]
          ],
          "phraseTimes": [
            {
              "start": 26,
              "end": 35.939999
            },
            {
              "start": 36.419998,
              "end": 38.380001
            }
          ]
        }
      ]
    },
    "lab-setup-logging": {
      "splitAt": [
        13.29,
        26.57
      ],
      "segments": [
        {
          "points": [
            "In netops_ops_lab create a logging subfolder Add scripts slash",
            "In netops_ops_lab create a logging subfolder.",
            "Add scripts slash run_deploy dot py — a Python",
            "Add docker — compose override or extend compose"
          ],
          "keyWords": [
            [
              "netops_ops_lab",
              "logging",
              "create",
              "subfolder"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.13,
              "end": 13.14
            }
          ]
        },
        {
          "points": [
            "Add docker — compose override",
            "Or extend compose with an rsyslog container listening",
            "Add webhook slash handler dot py —"
          ],
          "keyWords": [
            [
              "Add",
              "docker-compose",
              "override"
            ],
            [
              "extend",
              "compose",
              "rsyslog",
              "container"
            ],
            [
              "Add",
              "webhook",
              "slash",
              "handler"
            ]
          ],
          "phraseTimes": [
            {
              "start": 13.51,
              "end": 16.879999
            },
            {
              "start": 17.540001,
              "end": 22.040001
            },
            {
              "start": 22.6,
              "end": 26.84
            }
          ]
        },
        {
          "points": [
            "Flask or http dot server listener on port eight",
            "GitLab pipeline webhooks No production secrets in webhook URLs"
          ],
          "keyWords": [
            [
              "Flask",
              "http",
              "dot",
              "server"
            ],
            [
              "GitLab",
              "pipeline",
              "webhooks",
              "production"
            ]
          ],
          "phraseTimes": [
            {
              "start": 26.870001,
              "end": 31.07
            },
            {
              "start": 31.540001,
              "end": 39.75
            }
          ]
        }
      ]
    },
    "certification-alignment-logging": {
      "splitAt": [
        14.03,
        28.07
      ],
      "segments": [
        {
          "points": [
            "Module two maps to exam objectives three",
            "With syslog and webhook destinations explain sources format"
          ],
          "keyWords": [
            [
              "exam",
              "objectives",
              "Module",
              "two"
            ],
            [
              "syslog",
              "webhook",
              "destinations",
              "explain"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.16,
              "end": 7.93
            },
            {
              "start": 8.62,
              "end": 14.05
            }
          ]
        },
        {
          "points": [
            "Three point three — diagnose",
            "Automation problems given log snippets build timeline identify missing",
            "Inventory failed validation or missing"
          ],
          "keyWords": [
            [
              "Three",
              "point",
              "diagnose"
            ],
            [
              "automation",
              "problems",
              "given",
              "log"
            ],
            [
              "inventory",
              "failed",
              "validation",
              "missing"
            ]
          ],
          "phraseTimes": [
            {
              "start": 14.05,
              "end": 16.49
            },
            {
              "start": 17.34,
              "end": 24.32
            },
            {
              "start": 25.23,
              "end": 28.01
            }
          ]
        },
        {
          "points": [
            "Practice explaining RCA out loud using your chg —",
            "Module three adds pyATS change validation before",
            "You trust deploy logs that say success"
          ],
          "keyWords": [
            [
              "Practice",
              "explaining",
              "RCA",
              "out"
            ],
            [
              "Module",
              "three",
              "adds",
              "pyATS"
            ],
            [
              "trust",
              "deploy",
              "logs",
              "say"
            ]
          ],
          "phraseTimes": [
            {
              "start": 28.23,
              "end": 32.59
            },
            {
              "start": 34.5,
              "end": 36.34
            },
            {
              "start": 36.950001,
              "end": 39.349998
            }
          ]
        }
      ]
    },
    "logging-ready-for-validation": {
      "splitAt": [
        14.89,
        29.79
      ],
      "segments": [
        {
          "points": [
            "You started module two with Prometheus counters that could",
            "You finish with JSON application",
            "Logs syslog collection webhook pipeline"
          ],
          "keyWords": [
            [
              "started",
              "module",
              "two",
              "Prometheus"
            ],
            [
              "finish",
              "JSON",
              "application"
            ],
            [
              "logs",
              "syslog",
              "collection",
              "webhook"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.14,
              "end": 6.22
            },
            {
              "start": 7.23,
              "end": 9.89
            },
            {
              "start": 10.9,
              "end": 14.52
            }
          ]
        },
        {
          "points": [
            "Logs tell you something broke",
            "Do not always prove the network matches",
            "Module three"
          ],
          "keyWords": [
            [
              "Logs",
              "tell",
              "something",
              "broke"
            ],
            [
              "always",
              "prove",
              "network",
              "matches"
            ],
            [
              "Module",
              "three"
            ]
          ],
          "phraseTimes": [
            {
              "start": 15.36,
              "end": 19.950001
            },
            {
              "start": 20.75,
              "end": 23.48
            },
            {
              "start": 27.42,
              "end": 30.200001
            }
          ]
        },
        {
          "points": [
            "CLI validation and automated rollback — exam three",
            "Keep netops_ops_lab logging running validation jobs should emit",
            "Same request_id for one continuous audit chain"
          ],
          "keyWords": [
            [
              "validation",
              "CLI",
              "automated",
              "rollback"
            ],
            [
              "logging",
              "validation",
              "Keep",
              "netops_ops_lab"
            ],
            [
              "request_id",
              "one",
              "continuous",
              "audit"
            ]
          ],
          "phraseTimes": [
            {
              "start": 30.92,
              "end": 36.419998
            },
            {
              "start": 37.970001,
              "end": 41.490002
            },
            {
              "start": 42.400002,
              "end": 44.48
            }
          ]
        }
      ]
    },
    "deploy-success-without-proof": {
      "splitAt": [
        13.85,
        27.71
      ],
      "segments": [
        {
          "points": [
            "Three false confidence traps appear in network automation incidents",
            "Ansible recap shows ok equals three changed equals zero",
            "GitLab post — validation passed —"
          ],
          "keyWords": [
            [
              "Three",
              "false",
              "confidence",
              "traps"
            ],
            [
              "Ansible",
              "recap",
              "shows",
              "ok"
            ],
            [
              "GitLab",
              "post-validation",
              "passed"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.14,
              "end": 4.52
            },
            {
              "start": 5.12,
              "end": 10.75
            },
            {
              "start": 11.74,
              "end": 14.1
            }
          ]
        },
        {
          "points": [
            "Python script only parsed",
            "Syslog shows config commit — but the wrong feature"
          ],
          "keyWords": [
            [
              "Python",
              "script",
              "parsed"
            ],
            [
              "Syslog",
              "shows",
              "config",
              "commit"
            ]
          ],
          "phraseTimes": [
            {
              "start": 14.1,
              "end": 17.280001
            },
            {
              "start": 18.629999,
              "end": 27.85
            }
          ]
        },
        {
          "points": [
            "Testing network state against expected outcomes",
            "UI alone pyATS adds device — side test cases"
          ],
          "keyWords": [
            [
              "testing",
              "network",
              "state",
              "against"
            ],
            [
              "UI",
              "alone",
              "pyATS",
              "adds"
            ]
          ],
          "phraseTimes": [
            {
              "start": 27.85,
              "end": 29.190001
            },
            {
              "start": 29.809999,
              "end": 40.82
            }
          ]
        }
      ]
    },
    "what-change-validation-means": {
      "splitAt": [
        14.89,
        29.77
      ],
      "segments": [
        {
          "points": [
            "Exam three point four — implement change validation",
            "CLI tools Change validation",
            "Gate that asks after automation ran does"
          ],
          "keyWords": [
            [
              "change",
              "validation",
              "Exam",
              "three"
            ],
            [
              "Change",
              "validation",
              "CLI",
              "tools"
            ],
            [
              "gate",
              "asks",
              "automation",
              "ran"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.11,
              "end": 4.1
            },
            {
              "start": 5.04,
              "end": 8.38
            },
            {
              "start": 9.07,
              "end": 14.69
            }
          ]
        },
        {
          "points": [
            "It includes pre — change baseline capture post —",
            "CLI entry points — pyats run job"
          ],
          "keyWords": [
            [
              "change",
              "includes",
              "pre-change",
              "baseline"
            ],
            [
              "CLI",
              "entry",
              "points",
              "pyats"
            ]
          ],
          "phraseTimes": [
            {
              "start": 14.93,
              "end": 20.889999
            },
            {
              "start": 22.17,
              "end": 29.76
            }
          ]
        },
        {
          "points": [
            "Pyats learn pyats diff —",
            "Python test cases under the aetest framework Validation runs",
            "Fail validation and you do not celebrate —",
            "You rollback or fix forward with evidence"
          ],
          "keyWords": [
            [
              "pyats",
              "learn",
              "diff"
            ],
            [
              "Validation",
              "Python",
              "test",
              "cases"
            ],
            [
              "validation",
              "Fail",
              "celebrate"
            ],
            [
              "rollback",
              "fix",
              "forward",
              "evidence"
            ]
          ],
          "phraseTimes": [
            {
              "start": 29.809999,
              "end": 32.970001
            },
            {
              "start": 33.700001,
              "end": 38.790001
            },
            {
              "start": 39.349998,
              "end": 41.98
            },
            {
              "start": 42.68,
              "end": 44.369999
            }
          ]
        }
      ]
    },
    "testing-strategy-for-automation": {
      "splitAt": [
        12.64,
        25.27
      ],
      "segments": [
        {
          "points": [
            "A testing strategy layers gates before and after deploy",
            "Pre — change — lint intent dry — run",
            "Change window — apply"
          ],
          "keyWords": [
            [
              "testing",
              "strategy",
              "layers",
              "testing strategy layers"
            ],
            [
              "Pre-change",
              "lint",
              "intent",
              "dry-run"
            ],
            [
              "Change",
              "window",
              "apply"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.15,
              "end": 3.72
            },
            {
              "start": 4.37,
              "end": 6.65
            },
            {
              "start": 7.22,
              "end": 12.45
            }
          ]
        },
        {
          "points": [
            "Automation with request_id in logs from module",
            "Post — change — pyats run job",
            "With test cases for VLANs",
            "API responses Regression"
          ],
          "keyWords": [
            [
              "automation",
              "request_id",
              "logs",
              "module"
            ],
            [
              "Post-change",
              "pyats",
              "run",
              "job"
            ],
            [
              "test",
              "cases",
              "VLANs"
            ],
            [
              "API",
              "responses",
              "Regression"
            ]
          ],
          "phraseTimes": [
            {
              "start": 13.63,
              "end": 16.879999
            },
            {
              "start": 17.379999,
              "end": 18.99
            },
            {
              "start": 19.889999,
              "end": 22.440001
            },
            {
              "start": 23,
              "end": 25.07
            }
          ]
        },
        {
          "points": [
            "— optional nightly jobs on lab testbed",
            "The exam cares that you can place pyATS",
            "In the post — change slot and interpret job",
            "Passed failed errored — not that you built"
          ],
          "keyWords": [
            [
              "optional",
              "nightly",
              "jobs",
              "lab"
            ],
            [
              "exam",
              "cares",
              "place",
              "pyATS"
            ],
            [
              "post-change",
              "slot",
              "interpret",
              "job"
            ],
            [
              "passed",
              "failed",
              "errored",
              "built"
            ]
          ],
          "phraseTimes": [
            {
              "start": 26.059999,
              "end": 28.110001
            },
            {
              "start": 29.16,
              "end": 30.43
            },
            {
              "start": 30.889999,
              "end": 33.98
            },
            {
              "start": 34.939999,
              "end": 37.73
            }
          ]
        }
      ]
    },
    "pyats-plain-language": {
      "splitAt": [
        15.54,
        31.08
      ],
      "segments": [
        {
          "points": [
            "Python Automated Test System — is Cisco's framework",
            "A testbed YAML file lists devices addresses credentials"
          ],
          "keyWords": [
            [
              "Python",
              "Automated",
              "Test",
              "System"
            ],
            [
              "testbed",
              "YAML",
              "file",
              "lists"
            ]
          ],
          "phraseTimes": [
            {
              "start": 1.33,
              "end": 6.02
            },
            {
              "start": 6.66,
              "end": 13.84
            }
          ]
        },
        {
          "points": [
            "Job file orchestrates sections — common setup connects devices",
            "Easypy wraps",
            "Jobs for reporting The CLI",
            "AUTOCOR pyats version shows install pyats run job"
          ],
          "keyWords": [
            [
              "job",
              "file",
              "orchestrates",
              "sections"
            ],
            [
              "Easypy",
              "wraps"
            ],
            [
              "jobs",
              "reporting",
              "CLI"
            ],
            [
              "pyats",
              "AUTOCOR",
              "version",
              "shows"
            ]
          ],
          "phraseTimes": [
            {
              "start": 15.65,
              "end": 20.719999
            },
            {
              "start": 22.27,
              "end": 24.16
            },
            {
              "start": 24.700001,
              "end": 25.610001
            },
            {
              "start": 27.07,
              "end": 31.3050005
            }
          ]
        },
        {
          "points": [
            "Executes a job against a testbed pyats learn captures",
            "Install with pip install pyats",
            "Ansible is fine"
          ],
          "keyWords": [
            [
              "pyats",
              "executes",
              "job",
              "against"
            ],
            [
              "pyats",
              "Install",
              "pip"
            ],
            [
              "Ansible",
              "fine"
            ]
          ],
          "phraseTimes": [
            {
              "start": 31.3050005,
              "end": 36.130001
            },
            {
              "start": 37.200001,
              "end": 40.59
            },
            {
              "start": 41.700001,
              "end": 46.419998
            }
          ]
        }
      ]
    },
    "pyats-architecture-components": {
      "splitAt": [
        9.77,
        19.54,
        29.31
      ],
      "segments": [
        {
          "points": [
            "Four pyATS pieces mirror telemetry and logging",
            "Testbed — inventory of devices",
            "Under test"
          ],
          "keyWords": [
            [
              "pyATS",
              "pieces",
              "mirror",
              "telemetry"
            ],
            [
              "Testbed",
              "inventory",
              "devices"
            ],
            [
              "test"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.05,
              "end": 4.26
            },
            {
              "start": 4.97,
              "end": 7.93
            },
            {
              "start": 8.43,
              "end": 9.4
            }
          ]
        },
        {
          "points": [
            "Ansible inventory but pyATS native Job — Python",
            "File with aetest sections and test cases Runtime"
          ],
          "keyWords": [
            [
              "pyATS",
              "Ansible",
              "inventory",
              "native"
            ],
            [
              "file",
              "aetest",
              "sections",
              "test"
            ]
          ],
          "phraseTimes": [
            {
              "start": 10.21,
              "end": 15.39
            },
            {
              "start": 15.89,
              "end": 19.75
            }
          ]
        },
        {
          "points": [
            "Easypy to execute and log results Artifacts — learn",
            "Output and job reports stored on disk"
          ],
          "keyWords": [
            [
              "Easypy",
              "execute",
              "log",
              "results"
            ],
            [
              "output",
              "job",
              "reports",
              "stored"
            ]
          ],
          "phraseTimes": [
            {
              "start": 20.08,
              "end": 25.92
            },
            {
              "start": 26.5,
              "end": 28.530001
            }
          ]
        },
        {
          "points": [
            "In GitLab post — validation stage you call pyats",
            "Keep testbed credentials in CI variables — module four"
          ],
          "keyWords": [
            [
              "pyats",
              "GitLab",
              "post-validation",
              "stage"
            ],
            [
              "Keep",
              "testbed",
              "credentials",
              "CI"
            ]
          ],
          "phraseTimes": [
            {
              "start": 29.389999,
              "end": 33.619999
            },
            {
              "start": 34.09,
              "end": 38.98
            }
          ]
        }
      ]
    },
    "change-assurance-workflow": {
      "splitAt": [
        14.53,
        29.07
      ],
      "segments": [
        {
          "points": [
            "Change assurance is the end — to — end",
            "Git tag on intent Step two — deploy",
            "With request_id logged"
          ],
          "keyWords": [
            [
              "Change",
              "assurance",
              "end-to-end",
              "story"
            ],
            [
              "Git",
              "tag",
              "intent",
              "Step"
            ],
            [
              "request_id",
              "logged"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.12,
              "end": 6.34
            },
            {
              "start": 6.94,
              "end": 11.29
            },
            {
              "start": 12.15,
              "end": 14.02
            }
          ]
        },
        {
          "points": [
            "Step three — pyats run job post — validation",
            "The change fail triggers rollback",
            "Step five —"
          ],
          "keyWords": [
            [
              "Step",
              "three",
              "pyats",
              "run"
            ],
            [
              "change",
              "fail",
              "triggers",
              "rollback"
            ],
            [
              "Step",
              "five"
            ]
          ],
          "phraseTimes": [
            {
              "start": 14.62,
              "end": 21.01
            },
            {
              "start": 22.200001,
              "end": 25.379999
            },
            {
              "start": 26.09,
              "end": 28.639999
            }
          ]
        },
        {
          "points": [
            "Modules one and two supply telemetry and logs",
            "Change assurance is the end — to — end",
            "Step one — baseline with pyats learn",
            "Step two — deploy with request_id logged."
          ],
          "keyWords": [
            [
              "Modules",
              "one",
              "two",
              "supply"
            ]
          ],
          "phraseTimes": [
            {
              "start": 29.110001,
              "end": 43.349998
            }
          ]
        }
      ]
    },
    "automated-rollback-when-validation-fails": {
      "splitAt": [
        14.92,
        29.84
      ],
      "segments": [
        {
          "points": [
            "Automated rollback means validation failure starts a scripted undo",
            "Ansible — playbook"
          ],
          "keyWords": [
            [
              "rollback",
              "validation",
              "Automated",
              "means"
            ],
            [
              "ansible-playbook"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.09,
              "end": 13.02
            },
            {
              "start": 14.32,
              "end": 15.04
            }
          ]
        },
        {
          "points": [
            "With previous intent or push last — known —",
            "PyATS re — run confirms rollback — second pyats",
            "Wire rollback in GitLab as a manual job"
          ],
          "keyWords": [
            [
              "last-known-good",
              "last",
              "known",
              "good"
            ],
            [
              "rollback",
              "pyATS",
              "re-run",
              "confirms"
            ],
            [
              "rollback",
              "Wire",
              "GitLab",
              "manual"
            ]
          ],
          "phraseTimes": [
            {
              "start": 15.04,
              "end": 18.76
            },
            {
              "start": 20.4,
              "end": 25.65
            },
            {
              "start": 26.139999,
              "end": 30.190001
            }
          ]
        },
        {
          "points": [
            "A failed — post — validation trigger with strict",
            "Same request_id from module two",
            "Fail closed — if validation is unreachable do not"
          ],
          "keyWords": [
            [
              "failed-post-validation",
              "failed",
              "post",
              "validation"
            ],
            [
              "request_id",
              "module",
              "two"
            ],
            [
              "validation",
              "Fail",
              "closed",
              "if"
            ]
          ],
          "phraseTimes": [
            {
              "start": 30.370001,
              "end": 34.02
            },
            {
              "start": 35.16,
              "end": 38.84
            },
            {
              "start": 39.380001,
              "end": 44.549999
            }
          ]
        }
      ]
    },
    "story-beat-recap-validation": {
      "splitAt": [
        12.3,
        24.6
      ],
      "segments": [
        {
          "points": [
            "Why deploy success is not enough what change validation",
            "CLI tools pre versus post — change gates"
          ],
          "keyWords": [
            [
              "Pause",
              "seen",
              "deploy",
              "success"
            ],
            [
              "CLI",
              "tools",
              "pre",
              "versus"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.06,
              "end": 7.09
            },
            {
              "start": 8.14,
              "end": 12.57
            }
          ]
        },
        {
          "points": [
            "Change assurance workflow and rollback when pyATS fails Next",
            "We add a pyats folder to netops"
          ],
          "keyWords": [
            [
              "pyATS",
              "Next",
              "change",
              "assurance"
            ],
            [
              "pyats",
              "add",
              "folder",
              "netops"
            ]
          ],
          "phraseTimes": [
            {
              "start": 12.63,
              "end": 18.32
            },
            {
              "start": 18.790001,
              "end": 24.26
            }
          ]
        },
        {
          "points": [
            "YAML a minimal",
            "Validation job pyats learn baseline simulated deploy pyats run",
            "Point pyATS at production without approval"
          ],
          "keyWords": [
            [
              "YAML",
              "minimal"
            ],
            [
              "pyats",
              "validation",
              "job",
              "learn"
            ],
            [
              "pyATS",
              "point",
              "production",
              "without"
            ]
          ],
          "phraseTimes": [
            {
              "start": 25.040001,
              "end": 27.200001
            },
            {
              "start": 27.969999,
              "end": 34.189999
            },
            {
              "start": 34.91,
              "end": 36.68
            }
          ]
        }
      ]
    },
    "lab-setup-pyats": {
      "splitAt": [
        12.44,
        24.87
      ],
      "segments": [
        {
          "points": [
            "Inside netops_ops_lab create pyats slash testbed dot yaml pyats",
            "Activate the same Python virtualenv you used",
            "Your testbed needs at least one lab router",
            "If you have no live device today, the job"
          ],
          "keyWords": [
            [
              "netops_ops_lab",
              "pyats",
              "Inside",
              "create"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.13,
              "end": 13.01
            }
          ]
        },
        {
          "points": [
            "Requirements — pyats dot txt with pinned pyats",
            "Activate the same Python virtualenv you used"
          ],
          "keyWords": [
            [
              "pyats",
              "requirements-pyats",
              "dot",
              "txt"
            ],
            [
              "pyats",
              "Activate",
              "Python",
              "virtualenv"
            ]
          ],
          "phraseTimes": [
            {
              "start": 13.36,
              "end": 17.709999
            },
            {
              "start": 18.209999,
              "end": 24.32
            }
          ]
        },
        {
          "points": [
            "Needs at least one lab router or switch reachable",
            "SSH — CML VIRL or a sandbox from course",
            "Real hostnames before the exam lab"
          ],
          "keyWords": [
            [
              "needs",
              "least",
              "one",
              "lab"
            ],
            [
              "SSH",
              "CML",
              "VIRL",
              "sandbox"
            ],
            [
              "real",
              "hostnames",
              "exam",
              "lab"
            ]
          ],
          "phraseTimes": [
            {
              "start": 25.860001,
              "end": 27.68
            },
            {
              "start": 28.309999,
              "end": 35.549999
            },
            {
              "start": 36.029999,
              "end": 37.040001
            }
          ]
        }
      ]
    },
    "certification-alignment-validation": {
      "splitAt": [
        10.74,
        21.49
      ],
      "segments": [
        {
          "points": [
            "Module three maps to exam objective three point four",
            "CLI tools You should run pyats run"
          ],
          "keyWords": [
            [
              "exam",
              "objective",
              "Module",
              "three"
            ],
            [
              "CLI",
              "tools",
              "run",
              "pyats"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.13,
              "end": 5.52
            },
            {
              "start": 7.1,
              "end": 10.84
            }
          ]
        },
        {
          "points": [
            "Job with a testbed interpret pass and fail",
            "Use pyats learn for baseline",
            "And pyats diff for comparison and describe rollback"
          ],
          "keyWords": [
            [
              "job",
              "testbed",
              "interpret",
              "pass"
            ],
            [
              "use",
              "pyats",
              "learn",
              "baseline"
            ],
            [
              "pyats",
              "diff",
              "comparison",
              "describe"
            ]
          ],
          "phraseTimes": [
            {
              "start": 10.91,
              "end": 13.82
            },
            {
              "start": 14.48,
              "end": 16.290001
            },
            {
              "start": 16.91,
              "end": 21.77
            }
          ]
        },
        {
          "points": [
            "Practice explaining each CLI without reading notes",
            "Module four adds TLS certificate deployment and secure coding",
            "Testbed passwords move out of plain YAML"
          ],
          "keyWords": [
            [
              "Practice",
              "explaining",
              "CLI",
              "without"
            ],
            [
              "Module",
              "adds",
              "TLS",
              "certificate"
            ],
            [
              "testbed",
              "passwords",
              "move",
              "out"
            ]
          ],
          "phraseTimes": [
            {
              "start": 21.84,
              "end": 24.209999
            },
            {
              "start": 25.1,
              "end": 29.030001
            },
            {
              "start": 29.66,
              "end": 31.690001
            }
          ]
        }
      ]
    },
    "validation-ready-for-security": {
      "splitAt": [
        13.19,
        26.39
      ],
      "segments": [
        {
          "points": [
            "You started module three with green deploy logs",
            "PyATS test cases learn baselines diff evidence"
          ],
          "keyWords": [
            [
              "started",
              "module",
              "three",
              "green"
            ],
            [
              "pyATS",
              "test",
              "cases",
              "learn"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.07,
              "end": 5.81
            },
            {
              "start": 6.81,
              "end": 12
            }
          ]
        },
        {
          "points": [
            "Validation proves state",
            "Does not encrypt your SSH",
            "Passwords or sign your gRPC sessions",
            "Module four covers CA — signed TLS deployment"
          ],
          "keyWords": [
            [
              "Validation",
              "proves",
              "state"
            ],
            [
              "encrypt",
              "your",
              "SSH"
            ],
            [
              "passwords",
              "sign",
              "your",
              "gRPC"
            ],
            [
              "Module",
              "covers",
              "CA-signed",
              "TLS"
            ]
          ],
          "phraseTimes": [
            {
              "start": 13.3,
              "end": 14.95
            },
            {
              "start": 15.69,
              "end": 17.530001
            },
            {
              "start": 19.25,
              "end": 22.309999
            },
            {
              "start": 22.76,
              "end": 26.290001
            }
          ]
        },
        {
          "points": [
            "And secure coding — input validation authentication secret management",
            "Pyats slash testbed dot yaml free of committed production"
          ],
          "keyWords": [
            [
              "validation",
              "secure",
              "coding",
              "input"
            ],
            [
              "pyats",
              "slash",
              "testbed",
              "dot"
            ]
          ],
          "phraseTimes": [
            {
              "start": 26.58,
              "end": 34.41
            },
            {
              "start": 34.98,
              "end": 38.779999
            }
          ]
        }
      ]
    },
    "plaintext-secrets-risk": {
      "splitAt": [
        16.04,
        32.08
      ],
      "segments": [
        {
          "points": [
            "Two habits from earlier modules must not reach production",
            "Git pyATS testbed YAML with a literal password"
          ],
          "keyWords": [
            [
              "Two",
              "habits",
              "earlier",
              "modules"
            ],
            [
              "Git",
              "pyATS",
              "testbed",
              "YAML"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.11,
              "end": 6.81
            },
            {
              "start": 9.33,
              "end": 16.110001
            }
          ]
        },
        {
          "points": [
            "API tokens in playbooks Anyone with repo read access",
            "Module one telemetry with grpc — tcp"
          ],
          "keyWords": [
            [
              "API",
              "tokens",
              "playbooks",
              "Anyone"
            ],
            [
              "Module",
              "one",
              "telemetry",
              "grpc-tcp"
            ]
          ],
          "phraseTimes": [
            {
              "start": 16.110001,
              "end": 25.790001
            },
            {
              "start": 27.629999,
              "end": 30.58
            }
          ]
        },
        {
          "points": [
            "TLS module two HTTP webhooks unencrypted syslog across untrusted",
            "Attackers replay tokens or inject fake webhook events Security"
          ],
          "keyWords": [
            [
              "TLS",
              "module",
              "two",
              "HTTP"
            ],
            [
              "Attackers",
              "replay",
              "tokens",
              "inject"
            ]
          ],
          "phraseTimes": [
            {
              "start": 33.169998,
              "end": 37.740002
            },
            {
              "start": 38.310001,
              "end": 47.900002
            }
          ]
        }
      ]
    },
    "what-tls-protects-in-automation": {
      "splitAt": [
        15.77,
        31.55
      ],
      "segments": [
        {
          "points": [
            "TLS — Transport Layer Security — encrypts data",
            "For network automation that covers HTTPS GitLab"
          ],
          "keyWords": [
            [
              "TLS",
              "Transport",
              "Layer",
              "Security"
            ],
            [
              "network",
              "automation",
              "covers",
              "HTTPS"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.48,
              "end": 5.3
            },
            {
              "start": 5.75,
              "end": 15.54
            }
          ]
        },
        {
          "points": [
            "TLS REST APIs on controllers and HTTPS downloads of",
            "Does not replace authentication — it protects credentials",
            "It does not validate"
          ],
          "keyWords": [
            [
              "TLS",
              "REST",
              "APIs",
              "controllers"
            ],
            [
              "replace",
              "authentication",
              "protects",
              "credentials"
            ],
            [
              "validate"
            ]
          ],
          "phraseTimes": [
            {
              "start": 16.379999,
              "end": 23.799999
            },
            {
              "start": 24.27,
              "end": 29.76
            },
            {
              "start": 31.110001,
              "end": 31.764999
            }
          ]
        },
        {
          "points": [
            "Pair TLS on the transport with token or certificate",
            "Server certificate not every cipher suite name"
          ],
          "keyWords": [
            [
              "TLS",
              "Pair",
              "transport",
              "token"
            ],
            [
              "server",
              "certificate",
              "cipher",
              "suite"
            ]
          ],
          "phraseTimes": [
            {
              "start": 31.764999,
              "end": 44.66
            },
            {
              "start": 45.220001,
              "end": 47.16
            }
          ]
        }
      ]
    },
    "pki-plain-language": {
      "splitAt": [
        15.99,
        31.98
      ],
      "segments": [
        {
          "points": [
            "Public Key Infrastructure PKI is the trust system",
            "TLS A Certificate Authority CA signs certificates that bind",
            "Your server"
          ],
          "keyWords": [
            [
              "PKI",
              "Public",
              "Key",
              "Infrastructure"
            ],
            [
              "TLS",
              "Certificate",
              "Authority",
              "CA"
            ],
            [
              "Your",
              "server"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.14,
              "end": 5.19
            },
            {
              "start": 6.24,
              "end": 12.11
            },
            {
              "start": 12.74,
              "end": 16.139999
            }
          ]
        },
        {
          "points": [
            "Clients trust the CA root or intermediate chain installed",
            "CA — Microsoft AD CS"
          ],
          "keyWords": [
            [
              "Clients",
              "trust",
              "CA",
              "root"
            ],
            [
              "CA",
              "Microsoft",
              "AD",
              "CS"
            ]
          ],
          "phraseTimes": [
            {
              "start": 16.139999,
              "end": 26.969999
            },
            {
              "start": 28.450001,
              "end": 32.110001
            }
          ]
        },
        {
          "points": [
            "OpenSSL private CA or Cisco PKI —",
            "Self — signed certs work",
            "CA — signed certs chain to a root your"
          ],
          "keyWords": [
            [
              "PKI",
              "OpenSSL",
              "private",
              "CA"
            ],
            [
              "Self-signed",
              "certs",
              "work"
            ],
            [
              "CA-signed",
              "certs",
              "chain",
              "root"
            ]
          ],
          "phraseTimes": [
            {
              "start": 32.369999,
              "end": 35.400002
            },
            {
              "start": 36.02,
              "end": 39.950001
            },
            {
              "start": 40.43,
              "end": 47.700001
            }
          ]
        }
      ]
    },
    "obtain-ca-signed-cert-process": {
      "splitAt": [
        17.52,
        35.05
      ],
      "segments": [
        {
          "points": [
            "Exam three point five — describe the process",
            "Certificate Signing Request CSR with subject"
          ],
          "keyWords": [
            [
              "obtain",
              "deploy",
              "CA-signed",
              "obtain and deploy CA"
            ],
            [
              "Certificate",
              "Signing",
              "Request",
              "CSR"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.16,
              "end": 14.62
            },
            {
              "start": 15.88,
              "end": 17.790001
            }
          ]
        },
        {
          "points": [
            "DNS name clients use Step three — submit CSR",
            "Exam three point five — describe the process",
            "Step one — generate a private key",
            "Step two — create a Certificate Signing Request, CSR,"
          ],
          "keyWords": [
            [
              "DNS",
              "name",
              "clients",
              "use"
            ]
          ],
          "phraseTimes": [
            {
              "start": 17.790001,
              "end": 33.82
            }
          ]
        },
        {
          "points": [
            "GitLab runner IOS XE trustpoint for gRPC Step six",
            "Automation"
          ],
          "keyWords": [
            [
              "GitLab",
              "runner",
              "IOS",
              "XE"
            ],
            [
              "automation"
            ]
          ],
          "phraseTimes": [
            {
              "start": 35.349998,
              "end": 45.98
            },
            {
              "start": 47.23,
              "end": 52.459999
            }
          ]
        }
      ]
    },
    "deploy-tls-on-automation-services": {
      "splitAt": [
        16.87,
        33.73
      ],
      "segments": [
        {
          "points": [
            "Deploy means matching certificate to the service clients actually",
            "Webhook handler — terminate TLS",
            "Python with cert"
          ],
          "keyWords": [
            [
              "Deploy",
              "means",
              "matching",
              "certificate"
            ],
            [
              "TLS",
              "Webhook",
              "handler",
              "terminate"
            ],
            [
              "Python",
              "cert"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.08,
              "end": 4.21
            },
            {
              "start": 4.94,
              "end": 8.54
            },
            {
              "start": 9.05,
              "end": 12.4
            }
          ]
        },
        {
          "points": [
            "GitLab webhook URL becomes https gRPC telemetry",
            "IOS XE trustpoint references CA cert telemetry receiver uses",
            "Cert on port five seven five zero zero GitLab",
            "APIs — runner trusts"
          ],
          "keyWords": [
            [
              "GitLab",
              "webhook",
              "URL",
              "becomes"
            ],
            [
              "IOS",
              "XE",
              "trustpoint",
              "references"
            ],
            [
              "cert",
              "port",
              "five",
              "seven"
            ],
            [
              "APIs",
              "runner",
              "trusts"
            ]
          ],
          "phraseTimes": [
            {
              "start": 18.049999,
              "end": 22.469999
            },
            {
              "start": 22.93,
              "end": 25.1
            },
            {
              "start": 25.99,
              "end": 30.059999
            },
            {
              "start": 30.91,
              "end": 33.77
            }
          ]
        },
        {
          "points": [
            "Device cert or presents client",
            "TLS required Ansible over HTTPS network APIs — verify",
            "Document which file is cert which is key which"
          ],
          "keyWords": [
            [
              "device",
              "cert",
              "presents",
              "client"
            ],
            [
              "TLS",
              "required",
              "Ansible",
              "over"
            ],
            [
              "Document",
              "file",
              "cert",
              "key"
            ]
          ],
          "phraseTimes": [
            {
              "start": 34.560001,
              "end": 38.029999
            },
            {
              "start": 38.799999,
              "end": 43.849998
            },
            {
              "start": 44.490002,
              "end": 50.419998
            }
          ]
        }
      ]
    },
    "secure-coding-three-pillars": {
      "splitAt": [
        15.34,
        30.67
      ],
      "segments": [
        {
          "points": [
            "Exam three point six — implement secure coding practices",
            "Input validation — never trust YAML JSON or API"
          ],
          "keyWords": [
            [
              "three",
              "secure",
              "coding",
              "Exam"
            ],
            [
              "Input",
              "validation",
              "never",
              "trust"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.14,
              "end": 8.06
            },
            {
              "start": 8.57,
              "end": 14.95
            }
          ]
        },
        {
          "points": [
            "VLAN IDs outside policy before ansible runs",
            "Authentication — prove who calls your script or webhook",
            "TLS or SSH"
          ],
          "keyWords": [
            [
              "VLAN",
              "IDs",
              "outside",
              "policy"
            ],
            [
              "Authentication",
              "prove",
              "calls",
              "your"
            ],
            [
              "TLS",
              "SSH"
            ]
          ],
          "phraseTimes": [
            {
              "start": 16.17,
              "end": 22.48
            },
            {
              "start": 22.959999,
              "end": 28.629999
            },
            {
              "start": 29.139999,
              "end": 31.389999
            }
          ]
        },
        {
          "points": [
            "Secret management — load credentials from environment variables vaults",
            "Pipeline job and webhook handler you built in courses"
          ],
          "keyWords": [
            [
              "Secret",
              "management",
              "load",
              "credentials"
            ],
            [
              "three",
              "pipeline",
              "job",
              "webhook"
            ]
          ],
          "phraseTimes": [
            {
              "start": 31.450001,
              "end": 42.529999
            },
            {
              "start": 43.060001,
              "end": 45.860001
            }
          ]
        }
      ]
    },
    "input-validation-for-automation": {
      "splitAt": [
        16.28,
        32.56
      ],
      "segments": [
        {
          "points": [
            "Input validation blocks malicious or accidental bad intent early",
            "Parse YAML with safe_load not load Validate against JSON",
            "From course two — VLAN"
          ],
          "keyWords": [
            [
              "Input",
              "validation",
              "Input validation",
              "blocks"
            ],
            [
              "Parse",
              "YAML",
              "safe_load",
              "load"
            ],
            [
              "course",
              "two",
              "VLAN"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.09,
              "end": 5.06
            },
            {
              "start": 5.6,
              "end": 14.43
            },
            {
              "start": 14.92,
              "end": 16.459999
            }
          ]
        },
        {
          "points": [
            "ID range one to four zero nine four names",
            "File arguments — no dot dot",
            "Sanitize data before shell commands"
          ],
          "keyWords": [
            [
              "ID",
              "range",
              "one",
              "zero"
            ],
            [
              "file",
              "arguments",
              "dot"
            ],
            [
              "Sanitize",
              "data",
              "shell",
              "commands"
            ]
          ],
          "phraseTimes": [
            {
              "start": 16.459999,
              "end": 23.459999
            },
            {
              "start": 23.969999,
              "end": 27.620001
            },
            {
              "start": 28.59,
              "end": 30.129999
            }
          ]
        },
        {
          "points": [
            "Os dot system with f — strings from webhook",
            "JSON GitLab prevalidation stage runs yamllint and schema checks",
            "Show a webhook payload and ask what validation"
          ],
          "keyWords": [
            [
              "os",
              "dot",
              "system",
              "f-strings"
            ],
            [
              "validation",
              "JSON",
              "GitLab",
              "prevalidation"
            ],
            [
              "validation",
              "show",
              "webhook",
              "payload"
            ]
          ],
          "phraseTimes": [
            {
              "start": 32.799999,
              "end": 35.099998
            },
            {
              "start": 35.630001,
              "end": 41.580002
            },
            {
              "start": 43.200001,
              "end": 45.57
            }
          ]
        }
      ]
    },
    "secret-management-practices": {
      "splitAt": [
        16.17,
        32.34
      ],
      "segments": [
        {
          "points": [
            "Practical secret management for AUTOCOR labs and exams One",
            "— dot gitignore for local env",
            "Two — GitLab Settings CI slash"
          ],
          "keyWords": [
            [
              "secret",
              "management",
              "Practical",
              "AUTOCOR"
            ],
            [
              "dot",
              "gitignore",
              "local",
              "env"
            ],
            [
              "Two",
              "GitLab",
              "Settings",
              "CI"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.15,
              "end": 5.47
            },
            {
              "start": 6.41,
              "end": 10.06
            },
            {
              "start": 10.7,
              "end": 16.540001
            }
          ]
        },
        {
          "points": [
            "CD Variables with masked and protected flags for LAB_SSH_PASSWORD",
            "Four — least",
            "VLANs only not enable secret Five — audit access",
            "Variable settings"
          ],
          "keyWords": [
            [
              "SECRET",
              "CD",
              "Variables",
              "masked"
            ],
            [
              "least"
            ],
            [
              "secret",
              "VLANs",
              "enable",
              "Five"
            ],
            [
              "variable",
              "settings"
            ]
          ],
          "phraseTimes": [
            {
              "start": 16.639999,
              "end": 21.15
            },
            {
              "start": 21.65,
              "end": 25.290001
            },
            {
              "start": 26.33,
              "end": 30.66
            },
            {
              "start": 31.379999,
              "end": 31.530001
            }
          ]
        },
        {
          "points": [
            "Ansible Vault encrypts files you may commit — password",
            "CI variable only Module four lab",
            "Refactors pyats testbed and webhook handler to read secrets",
            "To the webhook listener"
          ],
          "keyWords": [
            [
              "Ansible",
              "Vault",
              "encrypts",
              "files"
            ],
            [
              "CI",
              "variable",
              "Module",
              "lab"
            ],
            [
              "secret",
              "refactors",
              "pyats",
              "testbed"
            ],
            [
              "webhook",
              "listener"
            ]
          ],
          "phraseTimes": [
            {
              "start": 33.650002,
              "end": 35.73
            },
            {
              "start": 37.169998,
              "end": 39.580002
            },
            {
              "start": 42.279999,
              "end": 46.490002
            },
            {
              "start": 47.200001,
              "end": 48.389999
            }
          ]
        }
      ]
    },
    "story-beat-recap-security": {
      "splitAt": [
        15.75,
        31.49
      ],
      "segments": [
        {
          "points": [
            "TLS and PKI basics the CA — signed obtain",
            "CA — signed where TLS lands",
            "Validation"
          ],
          "keyWords": [
            [
              "obtain-and-deploy",
              "obtain",
              "deploy",
              "Pause"
            ],
            [
              "CA-signed",
              "TLS",
              "lands"
            ],
            [
              "validation"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.1,
              "end": 6.46
            },
            {
              "start": 6.93,
              "end": 8.8
            },
            {
              "start": 9.3,
              "end": 15.72
            }
          ]
        },
        {
          "points": [
            "CI variable practices Next we create a lab CA",
            "With openssl sign a cert"
          ],
          "keyWords": [
            [
              "Next",
              "lab",
              "CI",
              "variable"
            ],
            [
              "openssl",
              "sign",
              "cert"
            ]
          ],
          "phraseTimes": [
            {
              "start": 16.200001,
              "end": 24.540001
            },
            {
              "start": 26.290001,
              "end": 29.26
            }
          ]
        },
        {
          "points": [
            "HTTPS refactor pyats testbed credentials to environment variables add",
            "VLAN intent and configure",
            "GitLab masked variables Remove any plaintext production passwords"
          ],
          "keyWords": [
            [
              "HTTPS",
              "refactor",
              "pyats",
              "testbed"
            ],
            [
              "VLAN",
              "intent",
              "configure"
            ],
            [
              "Lab",
              "GitLab",
              "masked",
              "variables"
            ]
          ],
          "phraseTimes": [
            {
              "start": 32.290001,
              "end": 38.150002
            },
            {
              "start": 38.700001,
              "end": 40.689999
            },
            {
              "start": 41.299999,
              "end": 46.990002
            }
          ]
        }
      ]
    },
    "lab-setup-security": {
      "splitAt": [
        14.05,
        28.09
      ],
      "segments": [
        {
          "points": [
            "In netops_ops_lab add tls slash with ca server cert",
            "Update webhook handler",
            "HTTPS or place nginx"
          ],
          "keyWords": [
            [
              "netops_ops_lab",
              "tls",
              "add",
              "slash"
            ],
            [
              "Update",
              "webhook",
              "handler"
            ],
            [
              "HTTPS",
              "place",
              "nginx"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.08,
              "end": 7.41
            },
            {
              "start": 8.72,
              "end": 9.67
            },
            {
              "start": 11.99,
              "end": 14.17
            }
          ]
        },
        {
          "points": [
            "Copy pyats slash testbed dot",
            "Yaml to testbed dot yaml dot example without secrets",
            "Create dot",
            "LAB_SSH_PASSWORD"
          ],
          "keyWords": [
            [
              "Copy",
              "pyats",
              "slash",
              "testbed"
            ],
            [
              "yaml",
              "testbed",
              "dot",
              "example"
            ],
            [
              "Create",
              "dot"
            ],
            [
              "LAB_SSH_PASSWORD"
            ],
            [
              "WEBHOOK_SECRET",
              "real"
            ]
          ],
          "phraseTimes": [
            {
              "start": 14.17,
              "end": 17.200001
            },
            {
              "start": 18.790001,
              "end": 22.17
            },
            {
              "start": 22.76,
              "end": 24.290001
            },
            {
              "start": 25.17,
              "end": 26.370001
            },
            {
              "start": 26.98,
              "end": 27.43
            }
          ]
        },
        {
          "points": [
            "You need openssl on your runner",
            "Linux and WSL"
          ],
          "keyWords": [
            [
              "openssl",
              "your",
              "runner"
            ],
            [
              "Linux",
              "WSL"
            ]
          ],
          "phraseTimes": [
            {
              "start": 28.9,
              "end": 32.540001
            },
            {
              "start": 33.240002,
              "end": 35.200001
            }
          ]
        }
      ]
    },
    "certification-alignment-security": {
      "splitAt": [
        15.6,
        31.21
      ],
      "segments": [
        {
          "points": [
            "Module four maps to exam objectives three point five",
            "TLS certificates generate key CSR CA"
          ],
          "keyWords": [
            [
              "exam",
              "objectives",
              "Module",
              "maps"
            ],
            [
              "TLS",
              "certificates",
              "generate",
              "key"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.05,
              "end": 10.44
            },
            {
              "start": 11.5,
              "end": 15.79
            }
          ]
        },
        {
          "points": [
            "Three point six",
            "Automation",
            "API callers manage secrets via env",
            "CI variables not Git"
          ],
          "keyWords": [
            [
              "Three",
              "point",
              "six"
            ],
            [
              "automation"
            ],
            [
              "API",
              "callers",
              "manage",
              "secrets"
            ],
            [
              "CI",
              "variables",
              "Git"
            ]
          ],
          "phraseTimes": [
            {
              "start": 15.79,
              "end": 20.190001
            },
            {
              "start": 20.76,
              "end": 24.379999
            },
            {
              "start": 24.860001,
              "end": 29.549999
            },
            {
              "start": 30.09,
              "end": 31.360000499999998
            }
          ]
        },
        {
          "points": [
            "Practice narrating the openssl flow",
            "PEM file installs Capstone module five",
            "TLS into one secure zero — touch operations pipeline"
          ],
          "keyWords": [
            [
              "Practice",
              "narrating",
              "openssl",
              "flow"
            ],
            [
              "PEM",
              "file",
              "installs",
              "Capstone"
            ],
            [
              "TLS",
              "one",
              "secure",
              "zero-touch"
            ]
          ],
          "phraseTimes": [
            {
              "start": 31.360000499999998,
              "end": 32.02
            },
            {
              "start": 33.029999,
              "end": 37.209999
            },
            {
              "start": 39.68,
              "end": 46.66
            }
          ]
        }
      ]
    },
    "security-ready-for-capstone": {
      "splitAt": [
        14.57,
        29.15
      ],
      "segments": [
        {
          "points": [
            "You started module four with plaintext passwords and HTTP",
            "CA signed server certificate HTTPS",
            "Webhook with token"
          ],
          "keyWords": [
            [
              "started",
              "module",
              "plaintext",
              "passwords"
            ],
            [
              "CA",
              "signed",
              "server",
              "certificate"
            ],
            [
              "webhook",
              "token"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.08,
              "end": 6.91
            },
            {
              "start": 7.39,
              "end": 12.29
            },
            {
              "start": 12.95,
              "end": 14.03
            }
          ]
        },
        {
          "points": [
            "Credentials",
            "VLAN intent and GitLab masked variables Course",
            "Three capstone runs the full operate — validate —",
            "Structured"
          ],
          "keyWords": [
            [
              "credentials"
            ],
            [
              "VLAN",
              "intent",
              "GitLab",
              "masked"
            ],
            [
              "capstone",
              "operate-validate-secure",
              "operate",
              "validate"
            ],
            [
              "structured"
            ]
          ],
          "phraseTimes": [
            {
              "start": 14.87,
              "end": 18.26
            },
            {
              "start": 18.73,
              "end": 23.74
            },
            {
              "start": 24.25,
              "end": 27.15
            },
            {
              "start": 28.42,
              "end": 29.240001
            }
          ]
        },
        {
          "points": [
            "TLS — protected webhooks — on the repos",
            "Netops_ops_lab and netops_iac_lab for stray secrets",
            "Before the capstone merge"
          ],
          "keyWords": [
            [
              "TLS-protected",
              "webhooks",
              "repos",
              "built"
            ],
            [
              "netops_ops_lab",
              "netops_iac_lab",
              "stray",
              "secrets"
            ],
            [
              "capstone",
              "merge"
            ]
          ],
          "phraseTimes": [
            {
              "start": 29.240001,
              "end": 36.080002
            },
            {
              "start": 36.91,
              "end": 39.700001
            },
            {
              "start": 40.209999,
              "end": 41.619999
            }
          ]
        }
      ]
    },
    "capstone-integrates-four-modules": {
      "splitAt": [
        17.72,
        35.44
      ],
      "segments": [
        {
          "points": [
            "Module four ended with HTTPS webhooks and secrets",
            "Module one — telemetry stream still healthy in Prometheus"
          ],
          "keyWords": [
            [
              "capstone",
              "Module",
              "ended",
              "HTTPS"
            ],
            [
              "Module",
              "one",
              "telemetry",
              "stream"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.14,
              "end": 8.43
            },
            {
              "start": 9.4,
              "end": 17.860001
            }
          ]
        },
        {
          "points": [
            "JSON deploy logs",
            "Chg — capstone",
            "Module three — pyats run job must pass after",
            "TLS and WEBHOOK_SECRET pyATS reads LAB_SSH_PASSWORD from env not"
          ],
          "keyWords": [
            [
              "JSON",
              "deploy",
              "logs"
            ],
            [
              "capstone",
              "chg-capstone"
            ],
            [
              "Module",
              "three",
              "pyats",
              "run"
            ],
            [
              "TLS",
              "WEBHOOK_SECRET",
              "pyATS",
              "reads"
            ]
          ],
          "phraseTimes": [
            {
              "start": 18.25,
              "end": 20.379999
            },
            {
              "start": 22.540001,
              "end": 24.129999
            },
            {
              "start": 25.059999,
              "end": 28.450001
            },
            {
              "start": 29.15,
              "end": 35.23
            }
          ]
        },
        {
          "points": [
            "You add VLAN three fifty to intended slash vlans",
            "Dot yaml in netops_iac_lab — same pattern as course",
            "Pass criteria include ops gates not only green GitLab"
          ],
          "keyWords": [
            [
              "add",
              "VLAN",
              "three",
              "fifty"
            ],
            [
              "capstone",
              "dot",
              "yaml",
              "netops_iac_lab"
            ],
            [
              "pass",
              "criteria",
              "include",
              "ops"
            ]
          ],
          "phraseTimes": [
            {
              "start": 35.610001,
              "end": 37.75
            },
            {
              "start": 39.41,
              "end": 43.279999
            },
            {
              "start": 44.130001,
              "end": 48.450001
            }
          ]
        }
      ]
    },
    "capstone-two-repo-layout": {
      "splitAt": [
        15.38,
        30.77
      ],
      "segments": [
        {
          "points": [
            "Know which repo owns which concern before",
            "Lab netops_iac_lab — intended slash",
            "Deploy_vlans",
            "Netops_ops_lab"
          ],
          "keyWords": [
            [
              "Know",
              "repo",
              "owns",
              "concern"
            ],
            [
              "lab",
              "netops_iac_lab",
              "intended",
              "slash"
            ],
            [
              "deploy_vlans"
            ],
            [
              "netops_ops_lab"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.15,
              "end": 2.76
            },
            {
              "start": 4.08,
              "end": 6.37
            },
            {
              "start": 7.3,
              "end": 12.97
            },
            {
              "start": 14.1,
              "end": 15.73
            }
          ]
        },
        {
          "points": [
            "Prometheus and rsyslog",
            "Validate_vlans",
            "PEM files from module"
          ],
          "keyWords": [
            [
              "Prometheus",
              "rsyslog"
            ],
            [
              "validate_vlans"
            ],
            [
              "PEM",
              "files",
              "module"
            ]
          ],
          "phraseTimes": [
            {
              "start": 15.85,
              "end": 19.440001
            },
            {
              "start": 20.07,
              "end": 22.75
            },
            {
              "start": 23.299999,
              "end": 28.040001
            }
          ]
        },
        {
          "points": [
            "The pipeline runs in iac repo ops",
            "CI jobs call across directories with relative paths"
          ],
          "keyWords": [
            [
              "pipeline",
              "runs",
              "iac",
              "repo"
            ],
            [
              "CI",
              "jobs",
              "call",
              "across"
            ]
          ],
          "phraseTimes": [
            {
              "start": 32.709999,
              "end": 37.18
            },
            {
              "start": 37.849998,
              "end": 45.869999
            }
          ]
        }
      ]
    },
    "seven-steps-ops-runbook": {
      "splitAt": [
        16.56,
        33.12
      ],
      "segments": [
        {
          "points": [
            "Run the capstone in this order One — start",
            "Prometheus rsyslog HTTPS webhook handler",
            "Two — edit VLAN three fifty",
            "Netops_iac_lab on a feature branch Three —"
          ],
          "keyWords": [
            [
              "order",
              "Run",
              "capstone",
              "One"
            ],
            [
              "Prometheus",
              "rsyslog",
              "HTTPS",
              "webhook"
            ],
            [
              "Two",
              "edit",
              "VLAN",
              "three"
            ],
            [
              "netops_iac_lab",
              "feature",
              "branch",
              "Three"
            ],
            [
              "local",
              "validate_intent_secure",
              "pipeline"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.12,
              "end": 4.46
            },
            {
              "start": 7.44,
              "end": 10.53
            },
            {
              "start": 11.15,
              "end": 12.87
            },
            {
              "start": 13.37,
              "end": 15.44
            },
            {
              "start": 16.01,
              "end": 16.52
            }
          ]
        },
        {
          "points": [
            "Four — merge to main deploy job runs",
            "Confirm telemetry metrics still flow",
            "And grep logs for request_id Six —",
            "Pyats run job"
          ],
          "keyWords": [
            [
              "merge",
              "main",
              "deploy",
              "job"
            ],
            [
              "confirm",
              "telemetry",
              "metrics",
              "still"
            ],
            [
              "grep",
              "logs",
              "request_id",
              "Six"
            ],
            [
              "pyats",
              "run",
              "job"
            ]
          ],
          "phraseTimes": [
            {
              "start": 16.85,
              "end": 23.74
            },
            {
              "start": 24.950001,
              "end": 28.07
            },
            {
              "start": 28.969999,
              "end": 30.57
            },
            {
              "start": 31.41,
              "end": 32.310001
            }
          ]
        },
        {
          "points": [
            "Seven — read HTTPS webhook",
            "Stop at the first red gate and use",
            "RCA on the logs"
          ],
          "keyWords": [
            [
              "Seven",
              "read",
              "HTTPS",
              "webhook"
            ],
            [
              "Stop",
              "red",
              "gate",
              "use"
            ],
            [
              "RCA",
              "logs"
            ]
          ],
          "phraseTimes": [
            {
              "start": 34.580002,
              "end": 37.720001
            },
            {
              "start": 39.369999,
              "end": 43.75
            },
            {
              "start": 45.709999,
              "end": 46.720001
            }
          ]
        }
      ]
    },
    "four-pillars-capstone-chain": {
      "splitAt": [
        12.03,
        24.07
      ],
      "segments": [
        {
          "points": [
            "Four pillars carry the capstone evidence chain — maps",
            "Telemetry — Prometheus query shows interface counters during change"
          ],
          "keyWords": [
            [
              "pillars",
              "evidence",
              "carry",
              "capstone"
            ],
            [
              "Telemetry",
              "Prometheus",
              "query",
              "shows"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.08,
              "end": 5.66
            },
            {
              "start": 6.12,
              "end": 12.19
            }
          ]
        },
        {
          "points": [
            "Logging — deploy dot json and syslog with chg",
            "Validation — pyats run job exit"
          ],
          "keyWords": [
            [
              "Logging",
              "deploy",
              "dot",
              "json"
            ],
            [
              "Validation",
              "pyats",
              "run",
              "job"
            ]
          ],
          "phraseTimes": [
            {
              "start": 12.25,
              "end": 19.620001
            },
            {
              "start": 20.18,
              "end": 24.6
            }
          ]
        },
        {
          "points": [
            "Security —",
            "HTTPS webhook with token and secrets from CI variables",
            "Exercising"
          ],
          "keyWords": [
            [
              "Security"
            ],
            [
              "HTTPS",
              "webhook",
              "token",
              "secrets"
            ],
            [
              "exercising"
            ]
          ],
          "phraseTimes": [
            {
              "start": 25.98,
              "end": 27.99
            },
            {
              "start": 28.450001,
              "end": 33.389999
            },
            {
              "start": 33.959999,
              "end": 35.900002
            }
          ]
        }
      ]
    },
    "verify-ops-pipeline-before-close": {
      "splitAt": [
        13.7,
        27.41
      ],
      "segments": [
        {
          "points": [
            "Do not close the capstone when git merge succeeds",
            "GitLab post — validation job must pass",
            "PASSED for validate_vlans Prometheus"
          ],
          "keyWords": [
            [
              "close",
              "capstone",
              "git",
              "merge"
            ],
            [
              "GitLab",
              "post-validation",
              "job",
              "pass"
            ],
            [
              "PASSED",
              "validate_vlans",
              "Prometheus"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.14,
              "end": 3.93
            },
            {
              "start": 4.77,
              "end": 7.14
            },
            {
              "start": 8.38,
              "end": 12.83
            }
          ]
        },
        {
          "points": [
            "Return non — zero series for interface metrics —",
            "Json must contain chg — capstone with deploy ok"
          ],
          "keyWords": [
            [
              "return",
              "non-zero",
              "series",
              "interface"
            ],
            [
              "json",
              "contain",
              "chg-capstone",
              "deploy"
            ]
          ],
          "phraseTimes": [
            {
              "start": 13.72,
              "end": 19.790001
            },
            {
              "start": 20.299999,
              "end": 26.16
            }
          ]
        },
        {
          "points": [
            "HTTPS webhook handler",
            "JSON line If any",
            "Pillar is missing the change is not zero —"
          ],
          "keyWords": [
            [
              "HTTPS",
              "webhook",
              "handler"
            ],
            [
              "JSON",
              "line",
              "If",
              "any"
            ],
            [
              "pillar",
              "missing",
              "change",
              "zero-touch"
            ]
          ],
          "phraseTimes": [
            {
              "start": 27.559999,
              "end": 30.190001
            },
            {
              "start": 30.690001,
              "end": 33.34
            },
            {
              "start": 33.860001,
              "end": 39.41
            }
          ]
        }
      ]
    },
    "capstone-nothing-new-ops": {
      "splitAt": [
        14.36,
        28.73
      ],
      "segments": [
        {
          "points": [
            "You already built every tool this capstone needs",
            "Module one — docker compose telemetry stack Module",
            "Two — run_deploy dot py",
            "And rsyslog Module"
          ],
          "keyWords": [
            [
              "already",
              "built",
              "tool",
              "capstone"
            ],
            [
              "Module",
              "one",
              "docker",
              "compose"
            ],
            [
              "two",
              "run_deploy",
              "dot",
              "py"
            ],
            [
              "rsyslog",
              "Module"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.09,
              "end": 2.96
            },
            {
              "start": 3.45,
              "end": 7
            },
            {
              "start": 7.54,
              "end": 10.77
            },
            {
              "start": 12.36,
              "end": 13.18
            }
          ]
        },
        {
          "points": [
            "Module four — tls certs",
            "Course two —",
            "If pyats connection fails fix module three"
          ],
          "keyWords": [
            [
              "Module",
              "tls",
              "certs"
            ],
            [
              "Course",
              "two"
            ],
            [
              "If",
              "pyats",
              "connection",
              "fails"
            ]
          ],
          "phraseTimes": [
            {
              "start": 15.42,
              "end": 23.549999
            },
            {
              "start": 24.07,
              "end": 25.120001
            },
            {
              "start": 25.65,
              "end": 28.530001
            }
          ]
        },
        {
          "points": [
            "If webhook returns four zero one",
            "WEBHOOK_SECRET in module four If Prometheus empty fix",
            "The capstone passes when one VLAN intent change flows"
          ],
          "keyWords": [
            [
              "If",
              "webhook",
              "returns",
              "zero"
            ],
            [
              "WEBHOOK_SECRET",
              "module",
              "If",
              "Prometheus"
            ],
            [
              "new",
              "install",
              "capstone",
              "passes"
            ]
          ],
          "phraseTimes": [
            {
              "start": 29.549999,
              "end": 31.74
            },
            {
              "start": 32.369999,
              "end": 37.77
            },
            {
              "start": 38.220001,
              "end": 42.130001
            }
          ]
        }
      ]
    },
    "story-beat-recap-ops-capstone": {
      "splitAt": [
        13.39,
        26.79
      ],
      "segments": [
        {
          "points": [
            "The capstone is course two intent change plus course",
            "Gates in seven steps You",
            "Know the two — repo layout the four evidence"
          ],
          "keyWords": [
            [
              "capstone",
              "operate-validate-secure",
              "operate",
              "validate"
            ],
            [
              "gates",
              "seven",
              "steps"
            ],
            [
              "know",
              "two-repo",
              "layout",
              "evidence"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.14,
              "end": 6.89
            },
            {
              "start": 7.6,
              "end": 9.79
            },
            {
              "start": 10.32,
              "end": 13.68
            }
          ]
        },
        {
          "points": [
            "Next slides walk commands line by line — start",
            "Validate merge log"
          ],
          "keyWords": [
            [
              "Next",
              "slides",
              "walk",
              "commands"
            ],
            [
              "validate",
              "merge",
              "log"
            ]
          ],
          "phraseTimes": [
            {
              "start": 13.68,
              "end": 22.190001
            },
            {
              "start": 23.34,
              "end": 25.360001
            }
          ]
        },
        {
          "points": [
            "Correlation pyATS webhook optional rollback drill — the same",
            "Both netops_iac_lab and netops_ops_lab Lab",
            "And simulation targets only"
          ],
          "keyWords": [
            [
              "correlation",
              "pyATS",
              "webhook",
              "optional"
            ],
            [
              "Lab",
              "netops_iac_lab",
              "netops_ops_lab"
            ],
            [
              "simulation",
              "targets"
            ]
          ],
          "phraseTimes": [
            {
              "start": 27.76,
              "end": 33.220001
            },
            {
              "start": 34.150002,
              "end": 36.119999
            },
            {
              "start": 36.84,
              "end": 38.799999
            }
          ]
        }
      ]
    },
    "lab-setup-ops-capstone": {
      "splitAt": [
        14.36,
        28.73
      ],
      "segments": [
        {
          "points": [
            "Capstone lab setup checklist In netops_ops_lab run docker compose",
            "Prometheus rsyslog and collector Start webhook handler_tls dot py"
          ],
          "keyWords": [
            [
              "Capstone",
              "lab",
              "setup",
              "Capstone lab setup"
            ],
            [
              "Prometheus",
              "rsyslog",
              "collector",
              "Start"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.1,
              "end": 6.9
            },
            {
              "start": 7.65,
              "end": 13.16
            }
          ]
        },
        {
          "points": [
            "WEBHOOK_SECRET from dot env",
            "In netops_iac_lab run git status on main — clean",
            "Confirm GitLab CI variables LAB_SSH_PASSWORD and WEBHOOK_SECRET"
          ],
          "keyWords": [
            [
              "WEBHOOK_SECRET",
              "dot",
              "env"
            ],
            [
              "lab",
              "netops_iac_lab",
              "run",
              "git"
            ],
            [
              "Lab",
              "Confirm",
              "GitLab",
              "CI"
            ]
          ],
          "phraseTimes": [
            {
              "start": 15.12,
              "end": 17.809999
            },
            {
              "start": 19.01,
              "end": 21
            },
            {
              "start": 23.32,
              "end": 28.68
            }
          ]
        },
        {
          "points": [
            "Export REQUEST_ID equals chg — capstone for this run",
            "Before editing intent"
          ],
          "keyWords": [
            [
              "capstone",
              "Export",
              "REQUEST_ID",
              "equals"
            ],
            [
              "Pause",
              "editing",
              "intent"
            ]
          ],
          "phraseTimes": [
            {
              "start": 28.83,
              "end": 31.700001
            },
            {
              "start": 32.200001,
              "end": 34.25
            }
          ]
        }
      ]
    },
    "resume-ops-capstone-prerequisites": {
      "splitAt": [
        10.42,
        20.85
      ],
      "segments": [
        {
          "points": [
            "Sixty — second readiness across course three modules",
            "Module two — logger test line",
            "Appears in rsyslog"
          ],
          "keyWords": [
            [
              "modules",
              "one",
              "Sixty-second",
              "readiness"
            ],
            [
              "Module",
              "two",
              "logger",
              "test"
            ],
            [
              "appears",
              "rsyslog"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.04,
              "end": 6.05
            },
            {
              "start": 6.6,
              "end": 8.54
            },
            {
              "start": 9.36,
              "end": 10.79
            }
          ]
        },
        {
          "points": [
            "Module three — pyats version works and testbed loads",
            "Sixty — second readiness across course three modules.",
            "Module one — curl Prometheus query returns data.",
            "Module two — logger test line appears in rsyslog"
          ],
          "keyWords": [
            [
              "Module",
              "three",
              "pyats",
              "version"
            ]
          ],
          "phraseTimes": [
            {
              "start": 10.79,
              "end": 20.9
            }
          ]
        },
        {
          "points": [
            "CA Course two — ansible — playbook check",
            "If any step fails repair that module before capstone"
          ],
          "keyWords": [
            [
              "CA",
              "Course",
              "two",
              "ansible-playbook"
            ],
            [
              "one",
              "If",
              "any",
              "step"
            ]
          ],
          "phraseTimes": [
            {
              "start": 20.9,
              "end": 25.07
            },
            {
              "start": 25.690001,
              "end": 31.059999
            }
          ]
        }
      ]
    },
    "course-three-objectives-complete": {
      "splitAt": [
        14.63,
        29.27
      ],
      "segments": [
        {
          "points": [
            "Course three capstone maps AUTOCOR network operations objectives three",
            "Three point two and three point three"
          ],
          "keyWords": [
            [
              "Course",
              "three",
              "objectives",
              "capstone"
            ],
            [
              "Three",
              "point",
              "two"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.15,
              "end": 11.32
            },
            {
              "start": 11.79,
              "end": 15.07
            }
          ]
        },
        {
          "points": [
            "Request_id",
            "Three point four — pyATS post — change validation",
            "TLS webhook",
            "Secure secrets in CI You"
          ],
          "keyWords": [
            [
              "request_id"
            ],
            [
              "Three",
              "point",
              "pyATS",
              "post-change"
            ],
            [
              "TLS",
              "webhook"
            ],
            [
              "secure",
              "secrets",
              "CI"
            ]
          ],
          "phraseTimes": [
            {
              "start": 15.07,
              "end": 18.950001
            },
            {
              "start": 20.58,
              "end": 24.639999
            },
            {
              "start": 25.790001,
              "end": 27.67
            },
            {
              "start": 28.690001,
              "end": 29.3550005
            }
          ]
        },
        {
          "points": [
            "Ran them across netops_ops_lab and netops_iac_lab — not",
            "The CCNP AUTOCOR track continues beyond section three"
          ],
          "keyWords": [
            [
              "ran",
              "them",
              "across",
              "netops_ops_lab"
            ],
            [
              "three",
              "CCNP",
              "AUTOCOR",
              "track"
            ]
          ],
          "phraseTimes": [
            {
              "start": 29.3550005,
              "end": 35.189999
            },
            {
              "start": 36.07,
              "end": 40.990002
            }
          ]
        }
      ]
    },
    "ops-capstone-complete": {
      "splitAt": [
        13.71,
        27.41
      ],
      "segments": [
        {
          "points": [
            "You started course three asking how to know",
            "You finish with streaming",
            "Telemetry correlated syslog and JSON logs"
          ],
          "keyWords": [
            [
              "network",
              "started",
              "course",
              "three"
            ],
            [
              "finish",
              "streaming"
            ],
            [
              "telemetry",
              "correlated",
              "syslog",
              "JSON"
            ]
          ],
          "phraseTimes": [
            {
              "start": 0.15,
              "end": 5.37
            },
            {
              "start": 6.36,
              "end": 8.33
            },
            {
              "start": 8.82,
              "end": 13.58
            }
          ]
        },
        {
          "points": [
            "VLAN intent landed TLS — protected webhooks and secrets",
            "That is secure zero — touch",
            "Operations"
          ],
          "keyWords": [
            [
              "VLAN",
              "intent",
              "landed",
              "TLS-protected"
            ],
            [
              "secure",
              "zero-touch"
            ],
            [
              "operations"
            ]
          ],
          "phraseTimes": [
            {
              "start": 13.97,
              "end": 21.24
            },
            {
              "start": 21.92,
              "end": 25.93
            },
            {
              "start": 26.43,
              "end": 27.4449995
            }
          ]
        },
        {
          "points": [
            "AUTOCOR section three story Keep netops_ops_lab beside netops_iac_lab",
            "Observe first validate before close secure every"
          ],
          "keyWords": [
            [
              "AUTOCOR",
              "section",
              "three",
              "story"
            ],
            [
              "validate",
              "Observe",
              "close",
              "secure"
            ]
          ],
          "phraseTimes": [
            {
              "start": 27.4449995,
              "end": 32.189999
            },
            {
              "start": 32.73,
              "end": 36.48
            }
          ]
        }
      ]
    }
  }
};
