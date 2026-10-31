"""Build dist/gm-ledger.html: one engine, shared assets, and a content bundle per language.
A language bundle uses src/i18n/<lang>/<file> where a translation exists, else the English file."""
import glob, os, subprocess, sys, re, base64, json
root = os.path.dirname(os.path.abspath(__file__))
LANGS = ['en', 'zh-TW']  # a language with no files in src/i18n/<lang>/ yet falls back to English content
out_path = f'{root}/dist/gm-ledger.html'
if len(sys.argv) > 1: out_path = sys.argv[1]

shell = open(f'{root}/src/shell.html').read()
if len(sys.argv) <= 1 or not os.path.exists(f'{root}/src/_tmpl.js'):
    tm = {os.path.basename(f): base64.b64encode(open(f, 'rb').read()).decode() for f in sorted(glob.glob(f'{root}/templates/*.xlsx'))}
    open(f'{root}/src/_tmpl.js', 'w').write('BW.tmplData=' + json.dumps(tm) + ';\n')

SHARED = ['ui_strings.js', 'viz.js', 'reports.js', 'reportview.js', '_tmpl.js']  # ui_strings.js: interface catalog + BW.T
CONTENT = sorted(os.path.basename(f) for f in glob.glob(f'{root}/src/m[0-9][0-9].js')) + ['cap.js', 'packs.js', 'extras.js', 'gloss.js', 'visuals.js', 'stories.js', 'kitx.js', 'tools.js', 'learn.js']
# Interface-only scripts, loaded once after every language bundle; their text goes through BW.T.
TAIL = ['ask.js', 'cmt.js']

def wrap(name, code):
    return f'/* ---- {name} ---- */\n(function(){{\n{code}\n}})();\n'

parts = [open(f'{root}/src/{f}').read() for f in SHARED]
used = {}
for L in LANGS:
    parts.append(f"BW.beginLang('{L}');")
    used[L] = []
    for f in CONTENT:
        tr = f'{root}/src/i18n/{L}/{f}'
        src = tr if (L != 'en' and os.path.exists(tr)) else f'{root}/src/{f}'
        if src == tr: used[L].append(f)
        parts.append(wrap(f'{L}/{f}', open(src).read()))
    parts.append(f"BW.endLang('{L}');")
for f in TAIL:
    parts.append(wrap(f, open(f'{root}/src/{f}').read()))
parts.append("BW.useLang((function(){ try{ return localStorage.getItem('gmledger.lang')||'en'; }catch(e){ return 'en'; } })());")
mods = '\n'.join(parts)
assert '</script' not in mods.lower(), 'script close tag in module'
out = shell.replace('/*MODULES*/', mods)
os.makedirs(os.path.dirname(out_path), exist_ok=True)
open(out_path, 'w').write(out)
scripts = re.findall(r'<script>(.*?)</script>', out, re.S)
ok = True
for i, sc in enumerate(scripts):
    chk = f'/tmp/_chk_{os.getpid()}.js'
    open(chk, 'w').write(sc)
    r = subprocess.run(['node', '--check', chk], capture_output=True, text=True)
    os.unlink(chk)
    if r.returncode: ok = False; print('SCRIPT', i, 'ERROR', r.stderr[:2000])
print('translated:', {L: len(used[L]) for L in LANGS if L != 'en'}, 'size', len(out), 'ok' if ok else 'FAIL')

# A standalone copy that works as a plain file or on any website: a full document with charset and viewport.
if ok:
    sa = os.path.join(os.path.dirname(out_path), 'gm-ledger-standalone.html')
    open(sa, 'w').write('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n' + out + '\n</html>\n')
    print('standalone', os.path.getsize(sa))
