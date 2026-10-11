export type DiscountCodeDetails = {
  exists: boolean;
  isActive: boolean;
  expiresAt: Date | null;
  minimumOrderAmount: number;
  usageCount: number;
  usageLimit: number;
};

export type ValidationResult =
  | { ok: true; code: string }
  | { ok: false; error: string };

const ERR_NOT_FOUND = 'CODE_NOT_FOUND';
const ERR_INACTIVE = 'CODE_INACTIVE';
const ERR_EXPIRED = 'CODE_EXPIRED';
const ERR_BELOW_MINIMUM = 'ORDER_BELOW_MINIMUM';
const ERR_USAGE_LIMIT = 'USAGE_LIMIT_REACHED';

export function validateDiscountCode(
  code: string,
  details: DiscountCodeDetails,
  orderAmount: number,
  now: Date
): ValidationResult {
  if (!details.exists) {
    return { ok: false, error: ERR_NOT_FOUND };
  }

  if (!details.isActive) {
    return { ok: false, error: ERR_INACTIVE };
  }

  if (details.expiresAt !== null && now.getTime() >= details.expiresAt.getTime()) {
    return { ok: false, error: ERR_EXPIRED };
  }

  if (orderAmount < details.minimumOrderAmount) {
    return { ok: false, error: ERR_BELOW_MINIMUM };
  }

  if (details.usageCount >= details.usageLimit) {
    return { ok: false, error: ERR_USAGE_LIMIT };
  }

  return { ok: true, code };
}
