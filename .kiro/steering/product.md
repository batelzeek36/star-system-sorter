# Product Overview

Star System Sorter (S³) is a React Native mobile application featuring a deterministic star system classification system based on Human Design principles.

## Core Features

- **Star System Classification**: Deterministic scoring system based on Human Design birth data
- **Human Design Integration**: Birth data input and HD chart generation via BodyGraph API
- **Moderation System**: Comprehensive content moderation across all user inputs
- **Server-Side Validation**: Node.js backend with API proxy and caching

## Target Platforms

- iOS (via Xcode)
- Android (via Android Studio)

## Key Principles

- **Determinism**: PCG32 RNG for reproducible scoring
- **Safety-First**: Comprehensive moderation across all user content
- **Type Safety**: TypeScript strict mode throughout
- **Modularity**: Focused files (target 100-200 LOC, soft limit 300 LOC, hard limit 500 LOC)

## Terminology

- Use "star system" (never "house") for classification systems
- App name: "Star System Sorter" or "S³"

## Scope (MVP Non-Goals)

- No authentication, payments, push notifications, or analytics/telemetry
- No web/iframe client
- No remote code execution or dynamic logic downloads

## Legal/UX Copy (verbatim)

**Disclaimer:** "For insight & entertainment. Not medical, financial, or legal advice."

## Compliance Notes

- Use "star system" (never "house")
- Do not store birth data in logs; hash user IDs in any metrics
- Attribute third-party assets and APIs (BodyGraph API usage in `third_party/` and Attributions.md)
