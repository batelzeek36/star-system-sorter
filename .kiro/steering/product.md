# Product Overview

Star System Sorter (S³) is a hybrid mobile application that combines React Native UI with an embedded Flutter/Flame game (Super Dash). The app features a deterministic star system classification system based on Human Design principles.

## Core Features

- **Star System Classification**: Deterministic scoring system based on Human Design birth data
- **Team-Based Gaming**: Async competition with Flutter/Flame game integration
- **Human Design Integration**: Birth data input and HD chart generation via BodyGraph API
- **Moderation System**: Comprehensive content moderation across all user inputs
- **Server-Side Validation**: Node.js backend with API proxy and caching

## Target Platforms

- iOS (via Xcode)
- Android (via Android Studio)

## Key Principles

- **Determinism**: PCG32 RNG with fixed timestep for reproducible gameplay
- **Safety-First**: Comprehensive moderation across all user content
- **Native-First**: React Native UI with Flutter native modules for game
- **Modularity**: Small, focused files (60-120 LOC preferred, ≤150 LOC max)

## Terminology

- Use "star system" (never "house") for classification systems
- App name: "Star System Sorter" or "S³"

## Scope (MVP Non-Goals)

- No authentication, payments, push notifications, or analytics/telemetry
- No real-time multiplayer (async only), no web/iframe client
- No remote code execution or dynamic game logic downloads

## Legal/UX Copy (verbatim)

**Disclaimer:** "For insight & entertainment. Not medical, financial, or legal advice."

## Compliance Notes

- Use "star system" (never "house")
- Do not store birth data in logs; hash user IDs in any metrics
- Age gating default 18+; under-18 limited to abstract crest avatars; DMs disabled
- Attribute third-party assets and APIs (BodyGraph API usage in `third_party/` and Attributions.md)
