# Strict Tagless TypeScript TSDoc Rules

You must generate documentation layers strictly aligned with the project's architectural standards.

## Critical Instructions:

1. **Absolute Tag Prohibition:** You are STRICTLY FORBIDDEN from using any JSDoc/TSDoc tags starting with the `@` symbol. Do NOT use `@param`, `@return`, `@returns`, `@typeParam`, `@component`, `@property`, `@template`, `@example`, or `@type`.
2. **Pure Textual Documentation:** Write comments as plain, highly dense engineering prose in English. Describe only the structural or business intent that TypeScript types cannot express.
3. **Property-Level Documentation:** Document fields implicitly inside the TypeScript `interface` or `type` block directly above each property using clean multiline or single-line blocks without tags.

## Correct Blueprint Target:

```typescript
interface SegmentedControlProps {
  /** Reactive array tracking available options inside the selection viewport */
  readonly options: string[];
}

/**
 * Segmented control component for displaying mutually exclusive layout options.
 * Handles generic types internally via type inference matrices.
 */
export function SegmentedControl({ options }: SegmentedControlProps) { ... }
```
