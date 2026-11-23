/**
 * Utilities for HTML sanitization, clean text excerpts, and price formatting.
 */

export function stripHtml(input) {
    if (!input || typeof input !== 'string') return '';
    return input
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/\s+/g, ' ')
        .trim();
}

export function cleanExcerpt(text, maxLen = 105, fallback = '') {
    const cleaned = stripHtml(text);
    if (!cleaned) return fallback;
    if (cleaned.length <= maxLen) return cleaned;
    return cleaned.substring(0, maxLen).trim() + '...';
}

export function formatPrice(price, scope = '/ month') {
    if (!price || Number(price) <= 0) return 'Free Demo Available';
    return `₹${Number(price).toLocaleString('en-IN')}${scope ? ` ${scope}` : ''}`;
}
