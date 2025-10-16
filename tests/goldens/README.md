# Golden Test Fixtures

This directory contains known birth data inputs and their expected Human Design chart outputs and star system mappings.

## Purpose

Golden fixtures provide deterministic test cases that allow automated testing to verify:
1. HD chart API integration works correctly
2. Star system scoring produces consistent results
3. UI displays the correct information

## How to Create Golden Fixtures

1. **Run the app manually** with specific birth data
2. **Capture the HD chart results** from the BodyGraph API
3. **Note the star system classification** from the scorer
4. **Save as JSON** in this directory

## Fixture Format

```json
{
  "description": "Brief description of test case",
  "input": {
    "name": "Test Name",
    "birthDate": "YYYY-MM-DD",
    "birthTime": "HH:MM",
    "location": "City, State",
    "timezone": "America/New_York"
  },
  "expected": {
    "hdType": "Generator | Manifesting Generator | Projector | Manifestor | Reflector",
    "profile": "1/3 | 2/4 | etc.",
    "authority": "Sacral | Emotional | etc.",
    "channels": ["32-54", "29-46"],
    "gates": [13, 33, 54],
    "starSystem": {
      "primary": "Orion",
      "secondary": "Osirian"
    },
    "reasoning": ["Gate54→Ambition", "Gate13→Prodigal"]
  }
}
```

## Test Cases Needed

Create fixtures for:
- [ ] Each HD type (Generator, MG, Projector, Manifestor, Reflector)
- [ ] Each star system mapping
- [ ] Edge cases (undefined gates, rare profiles)
- [ ] Known historical figures (if using public data)

## Usage

These fixtures are used by:
1. Maestro E2E tests to verify UI correctness
2. Unit tests for scorer validation
3. Integration tests for HD API client
4. Regression testing after changes
