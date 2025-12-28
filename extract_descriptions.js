const fs = require('fs');
const path = require('path');

const scalesPath = path.join(process.cwd(), 'data/handpan-data/scales.ts');
const content = fs.readFileSync(scalesPath, 'utf8');

const scales = [];
const lines = content.split('\n');
let currentId = null;
let currentName = null;

for (let line of lines) {
    if (line.trim().startsWith('id:')) {
        const match = line.match(/id:\s*"([^"]+)"/);
        if (match) currentId = match[1];
    }
    if (line.trim().startsWith('name:')) {
        const match = line.match(/name:\s*"([^"]+)"/);
        if (match) currentName = match[1];
    }
    if (line.trim().startsWith('description:')) {
        const match = line.match(/description:\s*"([^"]+)"/);
        if (match && currentId) {
            scales.push({
                id: currentId,
                name: currentName,
                description: match[1]
            });
            currentId = null;
            currentName = null;
        }
    }
}

fs.writeFileSync('descriptions.json', JSON.stringify(scales, null, 2));
console.log('Descriptions saved to descriptions.json');
