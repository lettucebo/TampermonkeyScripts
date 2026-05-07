// Quick standalone smoke-tests for the pure modules.
// Run with: node test/pure-modules.test.js
// The userscript file uses unsafeWindow / Tampermonkey APIs that don't exist
// in Node, so we hand-port the pure parser/sanitizer here. Update both when
// the implementation changes.

const courseParser = (() => {
    function parseRowName(name) {
        if (!name || typeof name !== 'string') return { code: '', title: '', languageHint: null };
        const idx = name.indexOf(':');
        let code, rest;
        if (idx === -1) { code = ''; rest = name.trim(); }
        else { code = name.slice(0, idx).trim(); rest = name.slice(idx + 1).trim(); }
        const { title, languageHint } = stripLanguageSuffix(rest);
        return { code, title, languageHint };
    }
    function stripLanguageSuffix(title) {
        if (!title) return { title: '', languageHint: null };
        const m = title.match(/^(.*)\s*\(([^()]+)\)\s*$/);
        if (m) return { title: m[1].trim(), languageHint: m[2].trim() };
        return { title: title.trim(), languageHint: null };
    }
    function resolveLanguage(file) {
        const raw = file && file.language;
        if (!raw) return 'Unknown';
        const m = raw.match(/^(.*?)\s*\([a-z]{2,3}-[a-z]{2,4}\)\s*$/i);
        return (m ? m[1] : raw).trim();
    }
    function canonicalCourseDirName(blobUrl) {
        if (!blobUrl) return '';
        const segs = String(blobUrl).split('/');
        if (segs.length < 2) return segs[0] || '';
        const courseSeg = segs[segs.length - 2];
        const { code, title } = parseRowName(courseSeg);
        if (code) return title ? `${code} ${title}` : code;
        return courseSeg.replace(/:\s*/g, ' ');
    }
    return { parseRowName, stripLanguageSuffix, resolveLanguage, canonicalCourseDirName };
})();

const MAX_FILENAME_LEN = 150;
const pathSanitizer = (() => {
    const WIN_RESERVED = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(\..*)?$/i;
    const ILLEGAL = /[<>:"/\\|?*\x00-\x1F]/g;
    function shortHash(s) {
        let h = 0x811c9dc5;
        for (let i = 0; i < s.length; i++) {
            h ^= s.charCodeAt(i);
            h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
        }
        return h.toString(36).slice(0, 8);
    }
    function sanitizeSegment(name) {
        if (!name) return '_';
        let s = String(name).replace(ILLEGAL, '-');
        s = s.replace(/[\s.]+$/g, '').replace(/^\s+/, '');
        if (!s) s = '_';
        if (WIN_RESERVED.test(s)) s = '_' + s;
        if (s.length > MAX_FILENAME_LEN) {
            const dot = s.lastIndexOf('.');
            if (dot > 0 && s.length - dot <= 10) {
                const base = s.slice(0, dot);
                const ext = s.slice(dot);
                const trim = base.slice(0, MAX_FILENAME_LEN - ext.length - 9);
                s = `${trim}-${shortHash(name)}${ext}`;
            } else {
                s = `${s.slice(0, MAX_FILENAME_LEN - 9)}-${shortHash(name)}`;
            }
        }
        return s;
    }
    return { sanitizeSegment, shortHash };
})();

let pass = 0, fail = 0;
function eq(actual, expected, label) {
    const a = JSON.stringify(actual);
    const b = JSON.stringify(expected);
    if (a === b) { pass++; }
    else { fail++; console.error(`FAIL: ${label}\n  expected: ${b}\n  actual:   ${a}`); }
}

// Course parser tests
eq(courseParser.parseRowName('AZ-040T00: Automate Administration with PowerShell'),
    { code: 'AZ-040T00', title: 'Automate Administration with PowerShell', languageHint: null },
    'AZ-040T00 plain');
eq(courseParser.parseRowName('AZ-040T00: Automate Administration with PowerShell (Japanese)'),
    { code: 'AZ-040T00', title: 'Automate Administration with PowerShell', languageHint: 'Japanese' },
    'AZ-040T00 with Japanese');
eq(courseParser.parseRowName('MS-700T00: Managing Microsoft Teams'),
    { code: 'MS-700T00', title: 'Managing Microsoft Teams', languageHint: null },
    'MS-700T00 keeps T00');
eq(courseParser.parseRowName('PL-300T00A: Microsoft Power BI Data Analyst'),
    { code: 'PL-300T00A', title: 'Microsoft Power BI Data Analyst', languageHint: null },
    'PL-300T00A keeps full code');
eq(courseParser.parseRowName('100-100: Example'),
    { code: '100-100', title: 'Example', languageHint: null },
    'numeric-prefix code');
eq(courseParser.parseRowName('AI-3017: Microsoft AI for business leaders'),
    { code: 'AI-3017', title: 'Microsoft AI for business leaders', languageHint: null },
    'AI-3017');
eq(courseParser.parseRowName('AZ-1002: Configure secure access (Chinese Simplified)'),
    { code: 'AZ-1002', title: 'Configure secure access', languageHint: 'Chinese Simplified' },
    'multi-word language');

// Language resolver tests
eq(courseParser.resolveLanguage({ language: 'Japanese (ja-jp)' }), 'Japanese', 'lang ja-jp');
eq(courseParser.resolveLanguage({ language: 'English' }), 'English', 'lang English');
eq(courseParser.resolveLanguage({ language: 'Chinese Simplified (zh-cn)' }), 'Chinese Simplified', 'lang zh-cn');
eq(courseParser.resolveLanguage({ language: 'Portuguese Brazil (pt-br)' }), 'Portuguese Brazil', 'lang pt-br');
eq(courseParser.resolveLanguage({}), 'Unknown', 'lang missing');

// Canonical course dir name
eq(courseParser.canonicalCourseDirName(
    'Azure/AZ-040T00: Automate Administration with PowerShell/AZ-040T00A-ENU-Powerpoint.zip'),
    'AZ-040T00 Automate Administration with PowerShell',
    'canonical from blob path');
eq(courseParser.canonicalCourseDirName(
    'Azure/AZ-040T00: Automate Administration with PowerShell (Japanese)/AZ-040T00-PowerPoint.ja-JP.zip'),
    'AZ-040T00 Automate Administration with PowerShell',
    'canonical drops language suffix');

// Sanitizer tests
eq(pathSanitizer.sanitizeSegment('AZ-040T00 Automate Administration with PowerShell'),
    'AZ-040T00 Automate Administration with PowerShell', 'normal name unchanged');
eq(pathSanitizer.sanitizeSegment('Has<illegal>:chars*?'), 'Has-illegal--chars--', 'illegal chars replaced');
eq(pathSanitizer.sanitizeSegment('CON'), '_CON', 'reserved CON');
eq(pathSanitizer.sanitizeSegment('com1'), '_com1', 'reserved com1 case-insensitive');
eq(pathSanitizer.sanitizeSegment('NUL.txt'), '_NUL.txt', 'reserved NUL.txt');
eq(pathSanitizer.sanitizeSegment('trailing.   '), 'trailing', 'trailing dots/spaces stripped');
eq(pathSanitizer.sanitizeSegment(''), '_', 'empty');
eq(pathSanitizer.sanitizeSegment(null), '_', 'null');
eq(pathSanitizer.sanitizeSegment('x'.repeat(200)).length <= MAX_FILENAME_LEN, true, 'long name truncated');
const longExt = pathSanitizer.sanitizeSegment('a'.repeat(200) + '.zip');
eq(longExt.endsWith('.zip'), true, 'long name preserves extension');
eq(longExt.length <= MAX_FILENAME_LEN, true, 'long name+ext within limit');

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
