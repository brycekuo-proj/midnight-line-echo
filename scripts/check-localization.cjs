#!/usr/bin/env node
/* Dependency-free catalog coverage, syntax, and presentation-contract checks. */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const {execFileSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const files = ['js/engine.js', 'js/minigames.js', ...fs.readdirSync(path.join(root, 'chapters')).filter(f => f.endsWith('.js')).map(f => 'chapters/' + f)];
const cjk = /[\u3400-\u9fff]/;
const errors = [];
const intentionalEnglishCJK = new Set(); // Add exact catalog keys only, with a documented reason.
function context(language) {
  const ctx = { window: {}, console: {warn() {}}, URLSearchParams, location: {search: ''},
    localStorage: {getItem: () => language}, NodeFilter: {SHOW_TEXT: 4},
    document: {documentElement: {}, createTreeWalker: () => ({nextNode: () => false}), querySelectorAll: () => []} };
  vm.createContext(ctx);
  vm.runInContext(read('js/locales/en.js'), ctx);
  vm.runInContext(read('js/i18n.js'), ctx);
  return ctx.window;
}
const en = context('en'), zh = context('zh-TW');
const catalog = en.ECHO_EN;
for (const [key, value] of Object.entries(catalog)) {
  if (typeof value !== 'string' || !value.trim()) errors.push('Empty value: ' + key);
  if (cjk.test(value) && !intentionalEnglishCJK.has(key)) errors.push('CJK in English value: ' + key);
}
// Small lexical scanner: comments and regular expressions are skipped, quoted
// literals are returned with offsets. Templates must be explicitly reviewed.
function strings(source) {
  const out = []; let i = 0, previous = '';
  while (i < source.length) {
    const ch = source[i];
    if (/\s/.test(ch)) { i++; continue; }
    if (source.startsWith('//', i)) { i = source.indexOf('\n', i); if (i < 0) break; continue; }
    if (source.startsWith('/*', i)) { const end = source.indexOf('*/', i + 2); i = end < 0 ? source.length : end + 2; continue; }
    if (ch === '"' || ch === "'" || ch === '`') {
      const start = i++, quote = ch;
      while (i < source.length) { if (source[i] === '\\') { i += 2; continue; } if (source[i++] === quote) break; }
      out.push({start, raw: source.slice(start, i)}); previous = 'literal'; continue;
    }
    if (ch === '/' && (!previous || /^[\(=,:!\[?{;]$/.test(previous) || previous === 'return')) {
      i++; let bracket = false;
      while (i < source.length) {
        if (source[i] === '\\') { i += 2; continue; }
        if (source[i] === '[') bracket = true;
        if (source[i] === ']') bracket = false;
        if (source[i++] === '/' && !bracket) break;
      }
      while (/[a-z]/i.test(source[i] || '') && i < source.length) i++;
      previous = 'regexp'; continue;
    }
    const word = source.slice(i).match(/^[\w$]+/);
    if (word) { previous = word[0]; i += word[0].length; } else { previous = ch; i++; }
  }
  return out;
}
let literals = 0;
for (const file of files) {
  const source = read(file);
  execFileSync(process.execPath, ['--check', path.join(root, file)]);
  for (const token of strings(source)) {
    if (!cjk.test(token.raw)) continue;
    const line = source.slice(0, token.start).split('\n').length;
    if (!/ECHO_I18N\.t\(\s*$/.test(source.slice(0, token.start))) errors.push(`${file}:${line}: unwrapped CJK literal`);
    if (token.raw[0] === '`' && token.raw.includes('${')) { errors.push(`${file}:${line}: use named translations for interpolated templates`); continue; }
    const original = vm.runInNewContext(token.raw);
    const translated = en.ECHO_I18N.t(original);
    assert.equal(zh.ECHO_I18N.t(original), original, 'Chinese must remain byte-for-byte identical');
    if (cjk.test(translated)) errors.push(`${file}:${line}: untranslated output: ${translated}`);
    const tags = value => value.match(/<[^>]*>/g) || [];
    assert.deepEqual(tags(translated), tags(original), `${file}:${line}: markup changed`);
    if (original.startsWith('__AUDIO:')) assert.ok(translated.startsWith('__AUDIO:'), 'Audio dispatch marker changed');
    literals++;
  }
}
for (const file of ['index.html', 'engineering.html']) {
  let html = read(file).replace(/<!--[\s\S]*?-->|<script[\s\S]*?<\/script>/g, '');
  html = html.replace(/<div[^>]*data-language-choice[\s\S]*?<\/div>/, '');
  if (cjk.test(en.ECHO_I18N.t(html))) errors.push(file + ': untranslated static text or attribute');
  assert.ok(read(file).indexOf('js/i18n.js') < read(file).indexOf('js/engine.js'), 'Localization must load first');
}
for (const file of ['js/i18n.js', 'js/locales/en.js', 'js/telemetry.js', 'js/script.js']) execFileSync(process.execPath, ['--check', path.join(root, file)]);
for (const key of en.ECHO_I18N.missing) errors.push('Missing key: ' + key);
assert.equal(catalog['林雨晴'], 'Lin Yuqing');
assert.equal(zh.ECHO_I18N.language, 'zh-TW');
assert.equal(en.ECHO_I18N.language, 'en');
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`PASS: ${Object.keys(catalog).length} English entries; ${literals} localized JS literals; both HTML entries; Chinese identity, markup, audio markers, coverage, CJK and syntax checks.`);
