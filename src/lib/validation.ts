/**
 * Validation Configuration
 * 
 * Zod is the single source of truth for all validation in this application.
 * 
 * Usage:
 * - Forms: Use with react-hook-form via @hookform/resolvers/zod
 * - API: Validate requests/responses with Zod schemas
 * - Runtime: Use Zod for type-safe parsing and validation
 * 
 * Example:
 * ```typescript
 * import { z } from 'zod';
 * import { zodResolver } from '@hookform/resolvers/zod';
 * import { useForm } from 'react-hook-form';
 * 
 * const schema = z.object({
 *   date: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/),
 *   time: z.string().regex(/^\d{2}:\d{2} (AM|PM)$/),
 * });
 * 
 * const form = useForm({
 *   resolver: zodResolver(schema),
 * });
 * ```
 */

export { z } from 'zod';
export { zodResolver } from '@hookform/resolvers/zod';
