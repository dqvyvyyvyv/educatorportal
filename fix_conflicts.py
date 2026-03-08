import sys
import glob

def fix(f):
    try:
        with open(f, 'r', encoding='utf-8') as file:
            lines = file.readlines()
    except UnicodeDecodeError:
        return
    
    out = []
    state = 0 # 0=normal, 1=in HEAD, 2=in other
    changed = False
    for l in lines:
        if l.startswith('<<<<<<< HEAD'):
            state = 1
            changed = True
        elif l.startswith('======='):
            state = 2
        elif l.startswith('>>>>>>>'):
            state = 0
        else:
            if state == 1 or state == 0:
                out.append(l)
    
    if changed:
        with open(f, 'w', encoding='utf-8') as file:
            file.writelines(out)
        print(f"Fixed {f}")

for f in glob.glob("*.html"):
    fix(f)
