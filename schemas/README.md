# JSON Schemas

This directory contains auto-generated JSON Schema files derived from the Zod schemas defined in `src/lib/schemas.ts`.

## Purpose

These JSON schemas serve multiple purposes:

1. **Documentation**: Provide machine-readable schema documentation
2. **Validation**: Enable validation in non-TypeScript environments
3. **Tooling**: Support IDE autocomplete, API documentation generators, and other tools
4. **Contract Definition**: Define clear API contracts between client and server

## Generation

Schemas are generated using `zod-to-json-schema` from the source Zod schemas.

### Generate Schemas

```bash
npm run schemas:generate
```

This will:
- Read all Zod schemas from `src/lib/schemas.ts`
- Convert them to JSON Schema format (Draft 07)
- Write individual `.json` files to this directory
- Create an `index.json` with metadata about all schemas

### When to Regenerate

Regenerate schemas whenever you:
- Add new Zod schemas to `src/lib/schemas.ts`
- Modify existing schema definitions
- Change validation rules or constraints

## Schema Categories

Schemas are organized into the following categories:

### Client (`client/`)
- **BirthDataForm**: Form validation for birth data input

### API (`api/`)
- **BirthDataAPIRequest**: Client → Server birth data format
- **HDExtract**: Human Design data structure

### Server (`server/`)
- **BodyGraphRequest**: Server → BodyGraph API request
- **BodyGraphResponse**: BodyGraph API response structure

### Scorer (`scorer/`)
- **Contributor**: HD attribute contributor to score
- **SystemScore**: Detailed star system scoring
- **Ally**: Allied star system data
- **ClassificationResult**: Complete classification output
- **TiePolicy**: Tie-breaking configuration
- **ClassificationOptions**: Classification algorithm options

### Canon (`canon/`)
- **SystemWeights**: Star system scoring weights
- **Canon**: Complete canon data structure

### Navigation (`navigation/`)
- **ResultScreenParams**: Result screen navigation params
- **WhyScreenParams**: Why screen navigation params

### Error (`error/`)
- **APIErrorResponse**: Standard API error format
- **ValidationError**: Zod validation error details

### Cache (`cache/`)
- **CacheKey**: HD data cache key structure
- **CacheEntry**: Cached HD extract with metadata

## Schema Format

All schemas follow JSON Schema Draft 07 specification and include:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://star-system-sorter.app/schemas/[SchemaName].json",
  "title": "[SchemaName]",
  "description": "[Human-readable description]",
  "category": "[client|api|server|scorer|canon|navigation|error|cache]",
  ...
}
```

## Usage Examples

### In TypeScript (Use Zod directly)

```typescript
import { BirthDataFormSchema } from '@/lib/schemas';

// Validate data
const result = BirthDataFormSchema.safeParse(data);
```

### In Documentation Tools

```bash
# Generate API docs from JSON schemas
npx @apidevtools/swagger-cli bundle schemas/index.json
```

### In Non-TypeScript Environments

```javascript
// Load JSON schema for validation
const schema = require('./schemas/BirthDataForm.json');
const Ajv = require('ajv');
const ajv = new Ajv();
const validate = ajv.compile(schema);
const valid = validate(data);
```

## Index File

The `index.json` file provides:
- Complete list of all schemas with descriptions
- Category definitions
- File references for each schema
- Version information

Use this file to:
- Discover available schemas
- Generate documentation
- Build schema registries
- Create API documentation

## Notes

- **Do not edit these files manually** - they are auto-generated
- The source of truth is `src/lib/schemas.ts` (Zod schemas)
- Schemas use `$refStrategy: 'none'` to inline all definitions
- All schemas include metadata for better tooling support

## Compatibility

- **JSON Schema Version**: Draft 07
- **Zod Version**: 4.x (with legacy peer deps for zod-to-json-schema)
- **Generator**: zod-to-json-schema 3.x

### Known Limitations

**Zod v4 Compatibility**: The current version of `zod-to-json-schema` (3.x) was designed for Zod v3 and has limited support for Zod v4 features. As a result:

- Some complex schemas may be simplified in the JSON output
- Advanced Zod v4 features (like branded types, pipelines) may not convert fully
- The schemas are installed with `--legacy-peer-deps` to bypass peer dependency conflicts

**Workarounds**:
1. For documentation purposes, refer to the TypeScript types and Zod schemas in `src/lib/schemas.ts`
2. For runtime validation, use the Zod schemas directly (they are the source of truth)
3. Monitor `zod-to-json-schema` for Zod v4 support updates

**Source of Truth**: The Zod schemas in `src/lib/schemas.ts` are the authoritative schema definitions. These JSON schemas are provided for tooling and documentation purposes but may not capture all validation logic.

## Requirements

Task 4.2 - Generate JSON Schemas from Zod definitions
