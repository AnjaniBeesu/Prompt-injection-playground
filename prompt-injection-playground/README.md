# Prompt Injection Playground — AI Security

An interactive cybersecurity-style playground for experimenting with prompt injection attacks and defensive policies.

## What it does

- Enter a prompt and analyze it locally
- Detect common prompt injection patterns
- Calculate a 0–100 risk score
- Explain why an input was flagged
- Compare Monitor, Balanced, and Strict defense policies
- Return BLOCKED / ALLOWED decisions
- Try pre-built attack scenarios
- Track analysis statistics

## Stack

- Next.js
- TypeScript
- React
- Tailwind CSS
- Local rule-based detection engine
- No database, API, or API key required

## Architecture

```text
USER INPUT
    |
    v
Pattern Engine
    |
    +-- Instruction Override
    +-- Role Manipulation
    +-- Data Extraction
    +-- Safety Bypass
    |
    v
Risk Scoring
    |
    v
Defense Policy
    |
    +-- BLOCK
    +-- ALLOW
```

## Technical story

**Detection** → Regex-based security rules

**Risk Engine** → Weighted scoring

**Policy Engine** → Monitor / Balanced / Strict

**Explainability** → Every detection provides a reason

**UI** → Next.js + TypeScript + Tailwind

**Security concept** → Prompt injection, instruction hierarchy, and data extraction

> Detection is heuristic and does not guarantee complete protection.
