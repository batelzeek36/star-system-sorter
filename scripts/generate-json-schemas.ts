#!/usr/bin/env tsx
/**
 * Generate JSON Schemas from Zod Schemas
 * 
 * This script converts all Zod schemas defined in src/lib/schemas.ts
 * to JSON Schema format for documentation, validation, and tooling.
 * 
 * Output: schemas/*.json files
 * 
 * Requirements: 4.2
 */

import { zodToJsonSchema } from 'zod-to-json-schema';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import {
  // Client-Side Schemas
  BirthDataFormSchema,
  
  // API Schemas
  BirthDataAPIRequestSchema,
  HDExtractSchema,
  
  // Server-Side Schemas
  BodyGraphRequestSchema,
  BodyGraphResponseSchema,
  
  // Scorer Schemas
  ContributorSchema,
  SystemScoreSchema,
  AllySchema,
  ClassificationResultSchema,
  TiePolicySchema,
  ClassificationOptionsSchema,
  
  // Canon Schemas
  SystemWeightsSchema,
  CanonSchema,
  
  // Navigation Schemas
  ResultScreenParamsSchema,
  WhyScreenParamsSchema,
  
  // Error Schemas
  APIErrorResponseSchema,
  ValidationErrorSchema,
  
  // Cache Schemas
  CacheKeySchema,
  CacheEntrySchema,
} from '../src/lib/schemas';

// Schema definitions with metadata
const schemas = [
  // Client-Side Schemas
  {
    name: 'BirthDataForm',
    schema: BirthDataFormSchema,
    description: 'Birth data form validation schema for InputScreen',
    category: 'client',
  },
  
  // API Schemas
  {
    name: 'BirthDataAPIRequest',
    schema: BirthDataAPIRequestSchema,
    description: 'Birth data API request format (client → server)',
    category: 'api',
  },
  {
    name: 'HDExtract',
    schema: HDExtractSchema,
    description: 'Human Design data extracted from birth chart',
    category: 'api',
  },
  
  // Server-Side Schemas
  {
    name: 'BodyGraphRequest',
    schema: BodyGraphRequestSchema,
    description: 'BodyGraph Chart API request format',
    category: 'server',
  },
  {
    name: 'BodyGraphResponse',
    schema: BodyGraphResponseSchema,
    description: 'BodyGraph Chart API response format (partial)',
    category: 'server',
  },
  
  // Scorer Schemas
  {
    name: 'Contributor',
    schema: ContributorSchema,
    description: 'Single HD attribute contributor to system score',
    category: 'scorer',
  },
  {
    name: 'SystemScore',
    schema: SystemScoreSchema,
    description: 'Detailed scoring information for a star system',
    category: 'scorer',
  },
  {
    name: 'Ally',
    schema: AllySchema,
    description: 'Allied star system with percentage',
    category: 'scorer',
  },
  {
    name: 'ClassificationResult',
    schema: ClassificationResultSchema,
    description: 'Complete classification result from scorer',
    category: 'scorer',
  },
  {
    name: 'TiePolicy',
    schema: TiePolicySchema,
    description: 'Configuration for tie-breaking logic',
    category: 'scorer',
  },
  {
    name: 'ClassificationOptions',
    schema: ClassificationOptionsSchema,
    description: 'Optional configuration for classification algorithm',
    category: 'scorer',
  },
  
  // Canon Schemas
  {
    name: 'SystemWeights',
    schema: SystemWeightsSchema,
    description: 'Weighted scoring rules for a star system',
    category: 'canon',
  },
  {
    name: 'Canon',
    schema: CanonSchema,
    description: 'Complete canon data structure with all star system definitions',
    category: 'canon',
  },
  
  // Navigation Schemas
  {
    name: 'ResultScreenParams',
    schema: ResultScreenParamsSchema,
    description: 'Parameters passed to Result screen after classification',
    category: 'navigation',
  },
  {
    name: 'WhyScreenParams',
    schema: WhyScreenParamsSchema,
    description: 'Parameters passed to Why screen for explanation',
    category: 'navigation',
  },
  
  // Error Schemas
  {
    name: 'APIErrorResponse',
    schema: APIErrorResponseSchema,
    description: 'Standard API error response format',
    category: 'error',
  },
  {
    name: 'ValidationError',
    schema: ValidationErrorSchema,
    description: 'Zod validation error details',
    category: 'error',
  },
  
  // Cache Schemas
  {
    name: 'CacheKey',
    schema: CacheKeySchema,
    description: 'Key structure for HD data caching',
    category: 'cache',
  },
  {
    name: 'CacheEntry',
    schema: CacheEntrySchema,
    description: 'Cached HD extract with metadata',
    category: 'cache',
  },
];

// Create schemas directory
const schemasDir = join(process.cwd(), 'schemas');
mkdirSync(schemasDir, { recursive: true });

// Generate JSON schemas
console.log('🔄 Generating JSON Schemas from Zod...\n');

let successCount = 0;
let errorCount = 0;

for (const { name, schema, description, category } of schemas) {
  try {
    const jsonSchema = zodToJsonSchema(schema, {
      name,
      $refStrategy: 'none',
    });
    
    // Add metadata
    const schemaWithMeta = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      $id: `https://star-system-sorter.app/schemas/${name}.json`,
      title: name,
      description,
      category,
      ...jsonSchema,
    };
    
    // Write to file
    const filename = `${name}.json`;
    const filepath = join(schemasDir, filename);
    writeFileSync(filepath, JSON.stringify(schemaWithMeta, null, 2));
    
    console.log(`✅ ${filename} (${category})`);
    successCount++;
  } catch (error) {
    console.error(`❌ Failed to generate ${name}:`, error);
    errorCount++;
  }
}

// Generate index file with all schemas
const indexContent = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Star System Sorter - Schema Index',
  description: 'Index of all JSON schemas for the Star System Sorter application',
  version: '1.0.0',
  schemas: schemas.map(({ name, description, category }) => ({
    name,
    description,
    category,
    file: `${name}.json`,
  })),
  categories: {
    client: 'Client-side form validation schemas',
    api: 'API request/response schemas',
    server: 'Server-side schemas for external APIs',
    scorer: 'Star system classification and scoring schemas',
    canon: 'Canon data structure schemas',
    navigation: 'React Navigation parameter schemas',
    error: 'Error response schemas',
    cache: 'Client-side caching schemas',
  },
};

writeFileSync(
  join(schemasDir, 'index.json'),
  JSON.stringify(indexContent, null, 2)
);

console.log(`\n✅ index.json (metadata)\n`);
console.log(`📊 Summary:`);
console.log(`   Generated: ${successCount} schemas`);
console.log(`   Failed: ${errorCount} schemas`);
console.log(`   Output: ${schemasDir}/\n`);

if (errorCount > 0) {
  process.exit(1);
}
