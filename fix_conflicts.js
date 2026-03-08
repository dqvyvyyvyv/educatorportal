const fs = require('fs');

function fix(f) {
    const content = fs.readFileSync(f, 'utf8');
    const lines = content.split('\n');
    let out = [];
    let state = 0; // 0=normal, 1=in HEAD, 2=in other
    let changed = false;

    for (let l of lines) {
        if (l.startsWith('<<<<<<< HEAD')) {
            state = 1;
            changed = true;
        } else if (l.startsWith('=======')) {
            state = 2;
        } else if (l.startsWith('>>>>>>>')) {
            state = 0;
        } else {
            if (state === 1 || state === 0) {
                out.push(l);
            }
        }
    }

    if (changed) {
        // Fix missing </html> at end if the file ended in HEAD without </html>
        let finalStr = out.join('\n');
        if (!finalStr.includes('</html>')) {
            finalStr += '\n</html>\n';
        }
        fs.writeFileSync(f, finalStr, 'utf8');
        console.log('Fixed', f);
    }
}

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html') || f.endsWith('.css') || f.endsWith('.md'));
for (const f of files) {
    if (f !== 'task.md') {
        fix(__dirname + '/' + f);
    }
}
