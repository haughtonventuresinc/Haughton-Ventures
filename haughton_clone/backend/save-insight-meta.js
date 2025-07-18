const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, 'insights-data.json');

function saveInsightMeta(meta) {
    let data = [];
    if (fs.existsSync(DATA_PATH)) {
        data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    }
    // Remove old entry if exists
    const idx = data.findIndex(item => item.id === meta.id);
    if (idx !== -1) {
        data[idx] = meta;
    } else {
        data.push(meta);
    }
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = saveInsightMeta;
