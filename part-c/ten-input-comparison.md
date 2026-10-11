# Part C — Ten-Input Comparison

This document defines ten inputs to compare the two implementations:

- **Original:** `lib/validation/discount-code.ts`
- **AI-generated:** `Task 5/part-c/discount-code-validator.ts`

**Note on result shapes:** the original returns failures as `{ ok: false, reason: "..." }`, while the AI version returns `{ ok: false, error: "..." }`. The string values are the same; only the property name differs. This is reflected in the "Expected" columns below.

Base inputs used unless a case overrides a field:
`exists: true`, `isActive: true`, `expiresAt: null`, `minimumOrderAmount: 50`, `usageCount: 0`, `usageLimit: 10`, and `now = 2026-10-11T00:00:00.000Z`.

| # | Input case | Expected — Original | Expected — AI | Actual result | Match? | Why it matters |
|---|---|---|---|---|---|---|
| 1 | Fully valid: `code="SAVE10"`, `orderAmount=100` | `{ ok: true, code: "SAVE10" }` | `{ ok: true, code: "SAVE10" }` | Original `{"ok":true,"code":"SAVE10"}`; AI `{"ok":true,"code":"SAVE10"}` | Match | Baseline: both should agree and return the same success shape. |
| 2 | Blank/whitespace code: `code="   "`, `orderAmount=100` | `{ ok: false, reason: "CODE_EMPTY" }` | `{ ok: true, code: "   " }` | Original `{"ok":false,"reason":"CODE_EMPTY"}`; AI `{"ok":true,"code":"   "}` | Differ | Divergence: original rejects blank codes; AI has no blank check and passes through to success. |
| 3 | Negative order amount: `code="SAVE10"`, `orderAmount=-5` | `{ ok: false, reason: "INVALID_ORDER_AMOUNT" }` | `{ ok: false, error: "ORDER_BELOW_MINIMUM" }` | Original `{"ok":false,"reason":"INVALID_ORDER_AMOUNT"}`; AI `{"ok":false,"error":"ORDER_BELOW_MINIMUM"}` | Differ | Divergence: original rejects the amount outright; AI lacks that check and reports it as below minimum (`-5 < 50`). |
| 4 | NaN order amount: `code="SAVE10"`, `orderAmount=NaN` | `{ ok: false, reason: "INVALID_ORDER_AMOUNT" }` | `{ ok: true, code: "SAVE10" }` | Original `{"ok":false,"reason":"INVALID_ORDER_AMOUNT"}`; AI `{"ok":true,"code":"SAVE10"}` | Differ | Key divergence: `NaN < 50` is false, so AI accepts `NaN` as valid; original rejects it. |
| 5 | Code does not exist: `code="GHOST"`, `exists=false`, `orderAmount=100` | `{ ok: false, reason: "CODE_NOT_FOUND" }` | `{ ok: false, error: "CODE_NOT_FOUND" }` | Original `{"ok":false,"reason":"CODE_NOT_FOUND"}`; AI `{"ok":false,"error":"CODE_NOT_FOUND"}` | Same value, field name differs | Same outcome, different field name (`reason` vs `error`). |
| 6 | Inactive code: `code="SAVE10"`, `isActive=false`, `orderAmount=100` | `{ ok: false, reason: "CODE_INACTIVE" }` | `{ ok: false, error: "CODE_INACTIVE" }` | Original `{"ok":false,"reason":"CODE_INACTIVE"}`; AI `{"ok":false,"error":"CODE_INACTIVE"}` | Same value, field name differs | Same outcome, different field name. |
| 7 | Expired at the exact boundary: `code="SAVE10"`, `expiresAt=now`, `orderAmount=100` | `{ ok: false, reason: "CODE_EXPIRED" }` | `{ ok: false, error: "CODE_EXPIRED" }` | Original `{"ok":false,"reason":"CODE_EXPIRED"}`; AI `{"ok":false,"error":"CODE_EXPIRED"}` | Same value, field name differs | Verifies `now >= expiresAt` counts as expired in both. |
| 8 | Order below minimum: `code="SAVE10"`, `minimumOrderAmount=50`, `orderAmount=49.99` | `{ ok: false, reason: "ORDER_BELOW_MINIMUM" }` | `{ ok: false, error: "ORDER_BELOW_MINIMUM" }` | Original `{"ok":false,"reason":"ORDER_BELOW_MINIMUM"}`; AI `{"ok":false,"error":"ORDER_BELOW_MINIMUM"}` | Same value, field name differs | Both reject a below-minimum order. |
| 9 | Order exactly at minimum: `code="SAVE10"`, `minimumOrderAmount=50`, `orderAmount=50` | `{ ok: true, code: "SAVE10" }` | `{ ok: true, code: "SAVE10" }` | Original `{"ok":true,"code":"SAVE10"}`; AI `{"ok":true,"code":"SAVE10"}` | Match | Verifies equal-to-minimum is accepted (only `<` rejects). |
| 10 | Usage limit reached: `code="SAVE10"`, `usageCount=10`, `usageLimit=10`, `orderAmount=100` | `{ ok: false, reason: "USAGE_LIMIT_REACHED" }` | `{ ok: false, error: "USAGE_LIMIT_REACHED" }` | Original `{"ok":false,"reason":"USAGE_LIMIT_REACHED"}`; AI `{"ok":false,"error":"USAGE_LIMIT_REACHED"}` | Same value, field name differs | Both reject when usage count meets the limit; also exercises the zero/negative-limit boundary indirectly. |

## Results summary

- **Match (identical output):** cases 1 and 9.
- **Same value, field name differs (`reason` vs `error`):** cases 5, 6, 7, 8, 10.
- **Differ (behavioural):** cases 2, 3, 4.

The three behavioural differences are blank/whitespace code, negative order amount, and `NaN` order amount. They are caused by the two checks the original has but the AI version does not: blank/whitespace code rejection (`CODE_EMPTY`) and invalid order amount rejection (`INVALID_ORDER_AMOUNT` for negative and `NaN` amounts).

## How this was run

A temporary runner (`run-comparison.ts`) was created at the project root, imported both functions, and ran all ten cases with identical inputs. It was executed with `npx tsx run-comparison.ts`, produced the results recorded above, and was then deleted. The recorded results are the observed output; no values were invented.
