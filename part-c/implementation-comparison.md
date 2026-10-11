# Part C — Implementation Comparison

This report compares the AI's independent implementation (`Task 5/part-c/discount-code-validator.ts`) with my original implementation (`lib/validation/discount-code.ts`).

| Behaviour | Original implementation | AI implementation | Difference or omission |
|---|---|---|---|
| Input type for details | `DiscountCodeDetails` with `exists`, `isActive`, `expiresAt: Date | null`, `minimumOrderAmount`, `usageCount`, `usageLimit` (lines 1–8) | Identical fields and types (lines 1–8) | None |
| Function signature | `validateDiscountCode(code, details, orderAmount, now)` (line 22) | Identical parameters and order (line 20) | None |
| Result type name | `DiscountCodeValidationResult` (line 10) | `ValidationResult` (line 10) | Naming only; behaviour identical |
| Failure field name | `{ ok: false; reason: string }` (line 12) | `{ ok: false; error: string }` (line 12) | Field is `reason` vs `error` |
| Validation order | blank code → invalid amount → exists → active → expired → minimum → usage (lines 28–52) | exists → active → expired → minimum → usage (lines 26–42) | AI omits the two leading checks |
| Blank / whitespace code | `code.trim() === ''` → `CODE_EMPTY` (lines 28–30) | Not checked | Omitted by AI |
| Invalid order amount | `orderAmount < 0 || !Number.isFinite(orderAmount)` → `INVALID_ORDER_AMOUNT` (lines 32–34) | Not checked | Omitted by AI |
| Expiry handling | `expiresAt !== null && now.getTime() >= expiresAt.getTime()` → `CODE_EXPIRED` (line 44) | Identical logic (line 34) | None (null = never expires; equal counts as expired) |
| Minimum amount boundary | `orderAmount < minimumOrderAmount` → `ORDER_BELOW_MINIMUM` (line 48) | Identical logic (line 38) | None (amount equal to minimum is accepted) |
| Usage limits | `usageLimit <= 0 || usageCount >= usageLimit` → `USAGE_LIMIT_REACHED` (line 52) | `usageCount >= usageLimit` → `USAGE_LIMIT_REACHED` (line 42) | AI omits the explicit `usageLimit <= 0` guard (equivalent in practice for non-negative `usageCount`, but not stated explicitly) |
| Successful result | `{ ok: true, code }` (line 56) | `{ ok: true, code }` (line 46) | None |
| Error constants | `CODE_EMPTY`, `INVALID_ORDER_AMOUNT`, `CODE_NOT_FOUND`, `CODE_INACTIVE`, `CODE_EXPIRED`, `ORDER_BELOW_MINIMUM`, `USAGE_LIMIT_REACHED` (lines 14–20) | `ERR_NOT_FOUND`, `ERR_INACTIVE`, `ERR_EXPIRED`, `ERR_BELOW_MINIMUM`, `ERR_USAGE_LIMIT` (lines 14–18) | Naming differs; string values match where both exist; AI has no blank/invalid-amount constants |

## Summary

The two implementations are largely equivalent. They share the same input type, the same five core checks in the same relative order, identical expiry and minimum-amount boundary behaviour, and the same successful result shape.

The most important differences are:

1. **Two missing checks.** The AI implementation does not reject blank/whitespace-only codes or invalid order amounts (negative, `NaN`, or infinite). These two checks appear only in the original implementation, placed before the existence check. They were intentionally omitted from the AI version because the pseudocode (`pseudocode-for-ai.md`) did not mention them.

2. **Failure field name.** The original returns `{ ok: false, reason }` while the AI returns `{ ok: false, error }`. Same idea, different property name.

3. **Result type name.** The original names the union `DiscountCodeValidationResult`; the AI names it `ValidationResult`. Cosmetic only.

4. **Usage-limit guard.** The original explicitly rejects a zero or negative usage limit (`usageLimit <= 0`). The AI version only checks `usageCount >= usageLimit`. For normal (non-negative) usage counts these behave the same, but the AI version does not document or explicitly guard the zero/negative-limit case.

No tests were run for this comparison, and neither implementation nor any existing test was modified.

## C2 — Genuine ambiguity in the original pseudocode

The pseudocode lists five validation rules but never states how the two **inputs themselves** are validated. It never says a blank/whitespace code is invalid, and "below the minimum" gives no rule for negative, `NaN`, or infinite amounts (literally `NaN < 50` is `false`). The AI read this literally and implemented only the five listed rules (`discount-code-validator.ts:26–44`), so it accepts a blank code and a `NaN` amount — the cause of the three differences in ten-input cases 2, 3 and 4.

### Original ambiguity (preserved for the record)

The original pseudocode read:

```
2. CHECK whether the discount code exists.
3. IF the code does not exist, RETURN an error and stop.
8. CHECK whether the order meets the minimum purchase amount.
9. IF the order is below the minimum, RETURN an error and stop.
```

### Corrected pseudocode (now in `pseudocode-for-ai.md.txt`)

Steps 2–5 were inserted before the existence check and the remaining steps renumbered:

```
2. CHECK whether the discount code is empty or contains only whitespace.
3. IF the code is empty or whitespace-only, RETURN an error and stop.
4. CHECK whether the order amount is a finite number that is not negative.
5. IF the order amount is negative or not a finite number, RETURN an error and stop.
6. CHECK whether the discount code exists.
7. IF the code does not exist, RETURN an error and stop.
```

The corrected wording matches the behaviour the original implementation already has. (The separate `usageLimit <= 0` wording gap noted in the summary is not part of this ambiguity.)
