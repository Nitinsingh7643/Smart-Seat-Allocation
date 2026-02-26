/**
 * Shared date utility — always use UTC day boundaries.
 * "2026-02-26" → start = 2026-02-26T00:00:00.000Z, end = 2026-02-26T23:59:59.999Z
 */
export function utcDayRange(dateStr: string): { start: Date; end: Date } {
    const start = new Date(dateStr + 'T00:00:00.000Z');
    const end = new Date(dateStr + 'T23:59:59.999Z');
    return { start, end };
}

/** Parse a YYYY-MM-DD string as UTC midnight */
export function utcMidnight(dateStr: string): Date {
    return new Date(dateStr + 'T00:00:00.000Z');
}
