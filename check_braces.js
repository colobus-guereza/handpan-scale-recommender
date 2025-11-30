
const fs = require('fs');
const content = fs.readFileSync('components/ScaleList.tsx', 'utf8');

let braces = 0;
let parens = 0;
let line = 1;
let col = 0;

for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char === '\n') {
        line++;
        col = 0;
    } else {
        col++;
    }

    if (char === '{') braces++;
    if (char === '}') braces--;
    if (char === '(') parens++;
    if (char === ')') parens--;

    if (braces < 0) {
        console.log(`Error: Unexpected '}' at line ${line}:${col}`);
        process.exit(1);
    }
    if (parens < 0) {
        console.log(`Error: Unexpected ')' at line ${line}:${col}`);
        process.exit(1);
    }
}

if (braces !== 0) {
    console.log(`Error: Unbalanced braces. Count: ${braces}`);
} else if (parens !== 0) {
    console.log(`Error: Unbalanced parentheses. Count: ${parens}`);
} else {
    console.log('Success: Braces and parentheses are balanced.');
}
