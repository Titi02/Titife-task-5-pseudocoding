# Task 5 — Pseudocoding Assessment

This assessment writes pseudocode for several functions and compares it with real implementations. Evidence is split into four folders, each listed below with its main files.

## part-a — A1 and A3
- `advance-transaction-status.md.txt` — A1 pseudocode, three hand-traces, hand-trace comparison table, and actual execution comparison.
- `A3-bug-identification.md.txt` — A3 actual/intended pseudocode, the planted bug, example input, and corrected condition.

## part-a2 — A2 library-function analyses
- `function-1-prisma-transaction.md.txt` — Prisma `$transaction()`.
- `function-2-zod-safeparse.md.txt` — Zod `safeParse()`.
- `function-3-prisma-upsert.md.txt` — Prisma `user.upsert()`.
Each file has my first-pass pseudocode, AI comparison, source-code verification, and lessons.

## part-b — Discount Code Validator
- `discount-code-validator.md.txt` — feature pseudocode, manual traces, implementation decisions, step-to-code/test traceability, and test results (9 passed, 0 failed; TypeScript pass; ESLint pass).
- Implementation: `lib/validation/discount-code.ts` and tests: `tests/records/discount-code.test.ts` (in the linked Titife project).

## part-c — AI comparison and listener feedback
- `pseudocode-original-for-ai.md.txt` — original pseudocode given to the AI.
- `pseudocode-for-ai.md.txt` — corrected pseudocode.
- `implementation-comparison.md` — difference table and C2 ambiguity.
- `ten-input-comparison.md` — ten inputs with observed outputs.
- `part-clistener-feedback.md.txt` — nontechnical listener feedback.
- `discount-code-validator.ts` — the AI-generated implementation.

The Part C explanation recording is not included; this evidence remains missing.

Folder structure: `part-a`, `part-a2`, `part-b`, `part-c` (this README sits at the root).
