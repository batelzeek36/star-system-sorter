# Task 2.0: Inspect and Integrate Local hdkit - Complete

## Overview

Inspected the local hdkit library at repo root to understand its API surface and identify utilities for computing Human Design data from date/time/location inputs.

## hdkit API Surface Documentation

### Core Files

**hdkit/index.js** - Main entry point
- Exports constants and helper functions
- Pure JavaScript, no external dependencies
- No API keys required (offline computation)

**hdkit/hdkit.js** - Core helper functions
- Gate manipulation utilities
- Pure computation functions

**hdkit/constants.js** - HD system constants
- Gate orders, harmonics, planetary data
- Astrological signs and symbols
- I Ching hexagram mappings
- Amino acids and genetic data
- Rave Mandala colors
- Gate names and descriptions

**hdkit/bodygraph-data.js** - Bodygraph computation logic
- Type, authority, profile, centers, channels calculation
- Definition and incarnation cross logic
- **Note**: This file has errors (ChatGPT conversion from Ruby)

### Sample Apps

**hdkit/sample-apps/hdkit_sample_app/** - Rails reference implementation
- **app/services/hdkit.rb**: Core activation computation from celestial positions
- **app/services/bodygraph_data.rb**: Type, authority, definition, profile logic
- Shows complete flow: celestial positions → activations → bodygraph data

### Key Computation Flow

```
Date/Time/Location
    ↓
Celestial Positions (via Swiss Ephemeris - external dependency)
    ↓
Gate Activations (hdkit.rb: generate_activations)
    ↓
Bodygraph Data (bodygraph_data.rb: type, authority, profile, centers, channels)
```

### Pure/Offline Computation Path

**What hdkit provides (offline, no API keys):**
1. Gate order and harmonic mappings
2. Opposite gate calculation
3. Channel definitions (gate pairs → centers)
4. Type determination (Generator, Manifestor, Projector, Reflector)
5. Authority calculation (Solar Plexus, Sacral, Spleen, Ego, etc.)
6. Definition (Single, Split, Triple Split, Quad Split)
7. Profile and incarnation cross logic
8. Constants for all HD system data

**What hdkit does NOT provide:**
- Celestial position calculation (requires Swiss Ephemeris or astronomy API)
- Date/time/timezone conversion
- Location → lat/lon geocoding

### Key Functions from hdkit/index.js

```javascript
// Gate manipulation
oppositeGate(gate: number): number
harmonicGate(gate: number): number
nextGate(gate: number): number
nextLine(line: number): number
nextGateAndLine(gate: number, line: number): string

// Fixing logic
isFixed(gate: number, planet: string, personalityEntry: object): boolean
```

### Key Constants

```javascript
// Gate order (64 gates in specific sequence)
gateOrder: number[]

// Harmonic gates for each gate
harmonicOrder: (number | number[])[]

// Planet glyphs
planetGlyphs: { Sun: '☉', Earth: '⨁', Moon: '☽', ... }

// Gate metadata
gateOf: { "1": "Gate of Self-Expression", ... }
gateNames: { "1": "The Creative", ... }
gateShortDescriptions: { "1": "Creativity Rooted in Unique Direction", ... }
```

### Activation Computation (from Rails sample)

```ruby
# From hdkit.rb - shows the algorithm
def activation(celestial_position)
  # Adjust from 0° Aries to Gate 41 at 2° Aquarius (58° offset)
  celestial_position += 58
  celestial_position -= 360 if celestial_position > 360
  
  percentage_through = celestial_position / 360.0
  
  # Gate (1 of 64)
  gate = GATES[(percentage_through * 64).to_i]
  
  # Line (1-6)
  exact_line = 384 * percentage_through
  line = (exact_line % 6) + 1
  
  # Color (1-6)
  exact_color = 2304 * percentage_through
  color = (exact_color % 6) + 1
  
  { gate:, line:, color: }
end
```

### Type Determination Logic (from bodygraph_data.rb)

```ruby
def aura_type
  if sacral_defined
    motor_to_throat ? 'Manifesting Generator' : 'Generator'
  elsif motor_to_throat
    'Manifestor'
  elsif no_centers_defined
    'Reflector'
  else
    'Projector'
  end
end
```

### Authority Hierarchy (from bodygraph_data.rb)

```ruby
def inner_authority
  if solar_plexus_defined
    'Solar Plexus'
  elsif sacral_defined
    'Sacral'
  elsif spleen_defined
    'Spleen'
  elsif ego_to_throat || g_to_ego
    'Ego'
  elsif g_to_throat
    'Self Projected'
  elsif head_to_ajna || ajna_to_throat
    'Outer Authority'
  else
    'Lunar'
  end
end
```

### Channel Definitions

Channels are gate pairs that define centers:
```ruby
centers_by_channel = {
  [61, 24] => ['Head', 'Ajna'],
  [43, 23] => ['Ajna', 'Throat'],
  [20, 10] => ['Throat', 'G Center'],
  [20, 57] => ['Throat', 'Spleen'],
  [20, 34] => ['Throat', 'Sacral'],
  # ... 36 total channels
}
```

## Integration Strategy for S³

### What We Need to Build

1. **Celestial Position Calculator** (NEW)
   - Use astronomy library or API to get planetary positions
   - Input: date, time, timezone, lat/lon
   - Output: Sun, Moon, planets in degrees (0-360)

2. **hdkit Adapter** (src/hd/hdkit-adapter.ts)
   - Import hdkit constants and functions
   - Convert celestial positions → gate activations
   - Compute type, authority, profile from activations
   - Return HDExtract interface

3. **HDExtract Interface** (src/hd/types.ts)
   ```typescript
   interface HDExtract {
     type: string;           // Generator, Manifestor, Projector, Reflector
     authority: string;      // Solar Plexus, Sacral, Spleen, Ego, etc.
     profile: string;        // e.g., "1/3", "2/4"
     centers: string[];      // Defined centers
     channels: number[][];   // Activated channels (gate pairs)
     gates: number[];        // All activated gates
   }
   ```

### Dependencies Needed

**For celestial positions:**
- Option 1: Use astronomy API (requires network, not pure offline)
- Option 2: Use JavaScript astronomy library (e.g., astronomia, suncalc)
- Option 3: Port Swiss Ephemeris to JS (complex)

**Recommendation**: Start with astronomy library for MVP, document API option for future.

### Pure Offline Computation

hdkit provides everything EXCEPT celestial positions:
- ✅ Gate/line/color calculation from degrees
- ✅ Type determination from channels
- ✅ Authority hierarchy logic
- ✅ Definition calculation
- ✅ Profile and cross logic
- ✅ All HD system constants

❌ Celestial positions (need external library/API)

## Files Inspected

1. ✅ hdkit/index.js - Main exports
2. ✅ hdkit/hdkit.js - Helper functions
3. ✅ hdkit/constants.js - HD system data
4. ✅ hdkit/bodygraph-data.js - Computation logic (has errors)
5. ✅ hdkit/sample-apps/v1/ - JavaScript sample
6. ✅ hdkit/sample-apps/hdkit_sample_app/ - Rails reference implementation

## Key Findings

1. **hdkit is pure computation** - No API keys, no network calls
2. **Missing piece**: Celestial position calculation (requires Swiss Ephemeris or astronomy library)
3. **Reference implementation**: Rails app shows complete flow
4. **Algorithm documented**: Activation computation from degrees is clear
5. **Type/Authority logic**: Well-defined hierarchy in bodygraph_data.rb
6. **Constants available**: All gate names, channels, centers defined

## Next Steps

1. ✅ Task 2.0 complete - API surface documented
2. → Task 2.1: Configure hdkit path alias in tsconfig/metro
3. → Task 2.2: Create hdkit adapter with celestial position handling
4. → Task 2.3: Add timezone selection to Input screen
5. → Task 2.4: Wire Input screen to hdkit adapter
6. → Task 2.5: Add hdkit licensing
7. → Task 2.6: Write hdkit adapter tests

## License

hdkit is MIT licensed (see hdkit/LICENSE and hdkit/hdkit.js header).
Must copy to third_party/hdkit-LICENSE and add to Attributions.md.

## Status

✅ **Task 2.0 Complete**
- Inspected hdkit/ at repo root
- Found utilities for type, authority, profile, centers, channels, gates
- Identified pure/offline computation path (no API keys)
- Documented hdkit API surface in this file
- Requirements 4.1 satisfied
