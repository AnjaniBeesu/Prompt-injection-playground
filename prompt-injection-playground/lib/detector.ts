export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface Finding {
  pattern: string;
  explanation: string;
  points: number;
  severity: Severity;
}

export interface DetectionResult {
  score: number;
  severity: Severity;
  blocked: boolean;
  findings: Finding[];
  recommendation: string;
}

interface PatternRule {
  regex: RegExp;
  pattern: string;
  explanation: string;
  points: number;
  severity: Severity;
}

const RULES: PatternRule[] = [
  {
    regex: /ignore\s+(all\s+)?previous\s+(instructions|directions)/i,
    pattern: "Instruction override",
    explanation: "Attempts to make the model disregard instructions that were provided earlier.",
    points: 30,
    severity: "CRITICAL",
  },
  {
    regex: /ignore\s+(all\s+)?prior\s+(instructions|directions)/i,
    pattern: "Instruction override",
    explanation: "Attempts to replace or override the existing instruction hierarchy.",
    points: 30,
    severity: "CRITICAL",
  },
  {
    regex: /forget\s+(everything|all)\s+(above|before|previously)/i,
    pattern: "Context deletion",
    explanation: "Attempts to remove previously established context or instructions.",
    points: 25,
    severity: "HIGH",
  },
  {
    regex: /disregard\s+(the\s+)?(system|developer|previous)\s+(message|instructions)/i,
    pattern: "Priority manipulation",
    explanation: "Attempts to override higher-priority instructions.",
    points: 30,
    severity: "CRITICAL",
  },
  {
    regex: /(reveal|show|print|output|give)\s+(me\s+)?(the\s+)?system\s+prompt/i,
    pattern: "System prompt extraction",
    explanation: "Requests information that may expose hidden system-level instructions.",
    points: 25,
    severity: "HIGH",
  },
  {
    regex: /what\s+(are|is)\s+(your|the)\s+(system\s+)?instructions/i,
    pattern: "Instruction extraction",
    explanation: "Attempts to discover hidden instructions controlling the model.",
    points: 20,
    severity: "HIGH",
  },
  {
    regex: /you\s+are\s+now\s+(a|an)\s+/i,
    pattern: "Role manipulation",
    explanation: "Attempts to redefine the model's role or behavior.",
    points: 15,
    severity: "MEDIUM",
  },
  {
    regex: /pretend\s+(you\s+are|to\s+be)\s+/i,
    pattern: "Role manipulation",
    explanation: "Uses role-play to attempt to change expected model behavior.",
    points: 12,
    severity: "MEDIUM",
  },
  {
    regex: /act\s+as\s+(if|a|an)\s+/i,
    pattern: "Role manipulation",
    explanation: "Attempts to change the model's operating role through role-play.",
    points: 10,
    severity: "MEDIUM",
  },
  {
    regex: /developer\s+mode/i,
    pattern: "Developer-mode jailbreak",
    explanation: "References a fictional or alternate developer mode to bypass constraints.",
    points: 20,
    severity: "HIGH",
  },
  {
    regex: /jailbreak/i,
    pattern: "Jailbreak indicator",
    explanation: "Explicitly references bypassing model restrictions.",
    points: 25,
    severity: "HIGH",
  },
  {
    regex: /bypass\s+(your|the)\s+(rules|restrictions|safety)/i,
    pattern: "Safety bypass",
    explanation: "Attempts to explicitly bypass safety or behavioral restrictions.",
    points: 25,
    severity: "HIGH",
  },
  {
    regex: /do\s+not\s+follow\s+(your|the)\s+(rules|instructions)/i,
    pattern: "Instruction rejection",
    explanation: "Explicitly tells the model not to follow its established rules.",
    points: 25,
    severity: "HIGH",
  },
  {
    regex: /reveal\s+(hidden|secret|confidential)\s+(information|data|instructions)/i,
    pattern: "Sensitive information extraction",
    explanation: "Requests information described as hidden, secret, or confidential.",
    points: 20,
    severity: "HIGH",
  },
  {
    regex: /send\s+(the\s+)?(data|information|contents)\s+to/i,
    pattern: "Potential data exfiltration",
    explanation: "Attempts to move information to another destination.",
    points: 20,
    severity: "HIGH",
  },
];

export function detectPromptInjection(
  input: string,
  defenseMode: "monitor" | "balanced" | "strict" = "balanced"
): DetectionResult {
  const findings: Finding[] = [];

  for (const rule of RULES) {
    if (rule.regex.test(input)) {
      const alreadyExists = findings.some(
        (finding) => finding.pattern === rule.pattern
      );

      if (!alreadyExists) {
        findings.push({
          pattern: rule.pattern,
          explanation: rule.explanation,
          points: rule.points,
          severity: rule.severity,
        });
      }
    }
  }

  let score = findings.reduce((total, finding) => total + finding.points, 0);

  if (input.length > 500) {
    score += 5;
  }

  score = Math.min(score, 100);

  let severity: Severity = "LOW";

  if (score >= 80) {
    severity = "CRITICAL";
  } else if (score >= 55) {
    severity = "HIGH";
  } else if (score >= 25) {
    severity = "MEDIUM";
  }

  let blocked = false;

  if (defenseMode === "monitor") {
    blocked = false;
  }

  if (defenseMode === "balanced") {
    blocked = score >= 55;
  }

  if (defenseMode === "strict") {
    blocked = score >= 25;
  }

  let recommendation =
    "No significant injection indicators detected. Continue monitoring.";

  if (score >= 80) {
    recommendation =
      "Block this input and investigate the source. Multiple high-risk injection indicators were detected.";
  } else if (score >= 55) {
    recommendation =
      "Treat this input as suspicious. Do not pass it directly to privileged model instructions.";
  } else if (score >= 25) {
    recommendation =
      "Proceed cautiously. Separate user-controlled content from trusted instructions.";
  }

  return {
    score,
    severity,
    blocked,
    findings,
    recommendation,
  };
}
