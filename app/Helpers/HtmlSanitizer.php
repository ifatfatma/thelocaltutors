<?php

namespace App\Helpers;

class HtmlSanitizer
{
    /**
     * Allowed HTML tags for rich content formatting
     */
    protected static $allowedTags = '<p><br><strong><b><em><i><u><s><strike><h2><h3><h4><h5><h6><ul><ol><li><blockquote><a><span><div>';

    /**
     * Clean and sanitize incoming HTML before persisting to the database.
     * Strips dangerous executable tags (<script>, <iframe>, <style>, <embed>, <object>),
     * dangerous attributes (onload, onclick, onerror, etc.), and javascript: URLs.
     *
     * @param string|null $html
     * @return string
     */
    public static function clean(?string $html): string
    {
        if (empty($html)) {
            return '';
        }

        // 1. Remove dangerous script, iframe, style, object, embed blocks completely
        $html = preg_replace('/<\s*(script|style|iframe|object|embed|applet)[^>]*>.*?<\s*\/\s*\1\s*>/is', '', $html);
        $html = preg_replace('/<\s*(script|style|iframe|object|embed|applet)[^>]*>/is', '', $html);

        // 2. Strip tags not in the allowed list
        $cleaned = strip_tags($html, self::$allowedTags);

        // 3. Remove inline JavaScript event handlers (onabort, onclick, onerror, onload, onmouseover, etc.)
        $cleaned = preg_replace('/\s*on[a-zA-Z]+\s*=\s*(["\']).*?\1/is', '', $cleaned);
        $cleaned = preg_replace('/\s*on[a-zA-Z]+\s*=\s*[^"\'>\s]+/is', '', $cleaned);

        // 4. Neutralize javascript:, vbscript:, and data: URIs (both quoted and unquoted)
        $cleaned = preg_replace('/href\s*=\s*(["\'])\s*(javascript|vbscript|data):[^"\']*\1/is', 'href="#"', $cleaned);
        $cleaned = preg_replace('/href\s*=\s*(javascript|vbscript|data):[^\s>]+/is', 'href="#"', $cleaned);

        // 5. If content is just empty tags (e.g. <p><br></p> or whitespace), return empty string
        $plain = trim(strip_tags($cleaned));
        if ($plain === '' && !str_contains($cleaned, '<img') && !str_contains($cleaned, '<hr')) {
            // Check if only empty tags exist
            $withoutTags = preg_replace('/<[^>]+>/', '', $cleaned);
            if (trim($withoutTags) === '') {
                return '';
            }
        }

        return trim($cleaned);
    }
}
