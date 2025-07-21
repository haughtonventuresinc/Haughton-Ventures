require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const saveInsightMeta = require('./save-insight-meta');
const multer = require('multer');

const app = express();
const PORT = 3001;
// --- LOGIN ENDPOINT ---
const jwt = require('jsonwebtoken');

app.use(cors());

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);
app.use('/insights', express.static(path.join(__dirname, 'insights')));


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOADS_DIR);
    },
    filename: function (req, file, cb) {
        // Avoid collisions: prepend timestamp
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext);
        cb(null, base + '-' + Date.now() + ext);
    }
});
const upload = multer({ storage });

// Image upload endpoint
app.post('/api/upload-image', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    // Return relative path for use in HTML
    const url = 'uploads/' + req.file.filename;
    console.log('[UPLOAD] Image uploaded:', url);
    res.json({ success: true, url });
});

app.use(express.json({ limit: '2mb' }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));


const INSIGHTS_DIR = path.join(__dirname, '..', 'insights');
if (!fs.existsSync(INSIGHTS_DIR)) fs.mkdirSync(INSIGHTS_DIR);

// Save (overwrite) an insight HTML file
app.post('/api/save-insight', (req, res) => {
    const { id, content } = req.body;
    if (!id || !content) {
        return res.status(400).json({ error: 'Missing id or content' });
    }
    const filePath = path.join(INSIGHTS_DIR, `${id}.html`);
    fs.writeFile(filePath, content, 'utf8', err => {
        if (err) {
            console.error('[SAVE] Failed to save file:', err);
            return res.status(500).json({ error: 'Failed to save file', details: err.message });
        }
        res.json({ success: true });
        console.log('[SAVE] Writing HTML to:', filePath);
    });
});

// Serve the insight template HTML file
app.get('/api/insight-template', (req, res) => {
    const templatePath = path.join(__dirname, 'insight-template.html');
    if (!fs.existsSync(templatePath)) {
        return res.status(404).send('Template not found');
    }
    res.sendFile(templatePath);
});


app.get('/api/insights-data', (req, res) => {
    const metaPath = path.join(__dirname, 'insights-data.json');
    if (!fs.existsSync(metaPath)) return res.json([]);
    try {
        const data = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to read insights data', details: err.message });
    }
});

// Save or update insight metadata
app.post('/api/save-insight-meta', (req, res) => {
    const { id, title, category, date, excerpt, image, link, content } = req.body;
    if (!id || !title || !category || !date || !excerpt || !link) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        saveInsightMeta({ id, title, category, date, excerpt, image, link, content });
        res.json({ success: true });
    } catch (err) {
        console.error('[SAVE] Failed to save meta:', err);
        res.status(500).json({ error: 'Failed to save meta', details: err.message });
    }
});

// --- HOMEPAGE CONTENT ENDPOINTS ---
const HOMEPAGE_PATH = path.join(__dirname, 'homepage.json');

// Get homepage content
app.get('/api/homepage', (req, res) => {
    if (!fs.existsSync(HOMEPAGE_PATH)) {
        return res.json({ heroTitle: '', heroImages: [], heroSlider: [], services: null, philosophy: null });
    }
    try {
        const data = JSON.parse(fs.readFileSync(HOMEPAGE_PATH, 'utf8'));
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to read homepage content', details: err.message });
    }
});

// Update homepage content
app.put('/api/homepage', (req, res) => {
    const { heroTitle } = req.body;
    if (typeof heroTitle !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid heroTitle' });
    }
    try {
        fs.writeFileSync(HOMEPAGE_PATH, JSON.stringify({ heroTitle }), 'utf8');
        res.json({ success: true });
        console.log('[HOMEPAGE] Updated heroTitle');
    } catch (err) {
        res.status(500).json({ error: 'Failed to save homepage content', details: err.message });
    }
});

// Delete an insight HTML file and remove its metadata
app.post('/api/delete-insight', (req, res) => {
    const { id } = req.body;
    console.log('[DELETE] Request to delete id:', id);
    if (!id) return res.status(400).json({ error: 'Missing id' });

    const filePath = path.join(INSIGHTS_DIR, `${id}.html`);
    const metaPath = path.join(__dirname, 'insights-data.json');

    fs.unlink(filePath, err => {
        if (err && err.code !== 'ENOENT') {
            console.error('[DELETE] Failed to delete HTML file:', err);
            return res.status(500).json({ error: 'Failed to delete HTML file', details: err.message });
        }
        let data = [];
        if (fs.existsSync(metaPath)) {
            try {
                const raw = fs.readFileSync(metaPath, 'utf8');
                data = JSON.parse(raw);
                console.log('[DELETE] Loaded data:', data);
            } catch (readErr) {
                console.error('[DELETE] Failed to read insights-data.json:', readErr);
                return res.status(500).json({ error: 'Failed to read insights-data.json', details: readErr.message });
            }
        }
        const newData = data.filter(item => item.id !== id);
        console.log('[DELETE] New data after filter:', newData);
        try {
            fs.writeFileSync(metaPath, JSON.stringify(newData, null, 2), 'utf8');
            console.log('[DELETE] Successfully wrote new data');
        } catch (writeErr) {
            console.error('[DELETE] Failed to write insights-data.json:', writeErr);
            return res.status(500).json({ error: 'Failed to update insights-data.json', details: writeErr.message });
        }
        res.json({ success: true });
    });
});



app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const envUser = process.env.DASHBOARD_USER;
    const envPass = process.env.DASHBOARD_PASS;
    const secret = process.env.SESSION_SECRET || 'keyboardcat';
    if (!username || !password) {
        return res.status(400).json({ error: 'Missing username or password' });
    }
    if (username === envUser && password === envPass) {
        const token = jwt.sign({ username }, secret, { expiresIn: '2h' });
        return res.json({ success: true, token });
    } else {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
});

// --- CONTACT PAGE ENDPOINTS ---
const CONTACT_DATA_PATH = path.join(__dirname, 'contact-data.json');
// Remove the CONTACT_HTML_PATH since backend won't access frontend files

// Get contact page data
app.get('/api/contact-data', (req, res) => {
    if (!fs.existsSync(CONTACT_DATA_PATH)) {
        // Return default contact data
        const defaultData = {
            heroTitle: "It's time to talk",
            heroSubtitle: "Leave us a message and we will get back to you as soon as we can.",
            heroImage: "../cdn.prod.website-files.com/687563dc787e44a7f4a50a72/687563dc787e44a7f4a50af2_Rectangle%20324.webp",
            sectionTitle: "Inquire now",
            contactDescription: "Fill out the form to the right and we will get back to you soon. Don't like forms? No worries, feel free to send us a direct email.",
            emailLabel: "Email",
            contactEmail: "contact@haughtonventures.com"
        };
        return res.json({ success: true, data: defaultData });
    }
    
    try {
        const data = JSON.parse(fs.readFileSync(CONTACT_DATA_PATH, 'utf8'));
        res.json({ success: true, data });
    } catch (err) {
        console.error('[CONTACT] Failed to read contact data:', err);
        res.status(500).json({ error: 'Failed to read contact data', details: err.message });
    }
});

// Save contact page data
app.post('/api/save-contact', (req, res) => {
    const contactData = req.body;
    
    // Validate required fields
    const requiredFields = ['heroTitle', 'heroSubtitle', 'sectionTitle', 'contactDescription', 'emailLabel', 'contactEmail'];
    for (const field of requiredFields) {
        if (!contactData[field]) {
            return res.status(400).json({ error: `Missing required field: ${field}` });
        }
    }
    
    try {
        // Save contact data to JSON file
        fs.writeFileSync(CONTACT_DATA_PATH, JSON.stringify(contactData, null, 2), 'utf8');
        console.log('[CONTACT] Contact data saved successfully');
        res.json({ success: true, message: 'Contact data saved successfully' });
    } catch (err) {
        console.error('[CONTACT] Failed to save contact data:', err);
        res.status(500).json({ error: 'Failed to save contact data', details: err.message });
    }
});

// --- PORTFOLIO ENDPOINTS ---
const PORTFOLIO_DATA_PATH = path.join(__dirname, 'portfolio-data.json');

// Get portfolio data
app.get('/api/portfolio-data', (req, res) => {
    try {
        if (fs.existsSync(PORTFOLIO_DATA_PATH)) {
            const data = JSON.parse(fs.readFileSync(PORTFOLIO_DATA_PATH, 'utf8'));
            res.json({ success: true, data });
        } else {
            res.json({ success: false, error: 'Portfolio data not found' });
        }
    } catch (error) {
        console.error('[PORTFOLIO] Error reading portfolio data:', error);
        res.status(500).json({ success: false, error: 'Failed to load portfolio data' });
    }
});

// Save portfolio data
app.post('/api/save-portfolio', (req, res) => {
    try {
        const portfolioData = req.body;
        fs.writeFileSync(PORTFOLIO_DATA_PATH, JSON.stringify(portfolioData, null, 2));
        console.log('[PORTFOLIO] Portfolio data saved successfully');
        res.json({ success: true, message: 'Portfolio data saved successfully' });
    } catch (error) {
        console.error('[PORTFOLIO] Error saving portfolio data:', error);
        res.status(500).json({ success: false, error: 'Failed to save portfolio data' });
    }
});

// About data endpoints
const ABOUT_DATA_PATH = path.join(__dirname, 'about-data.json');

// Get about data
app.get('/api/about-data', (req, res) => {
    if (!fs.existsSync(ABOUT_DATA_PATH)) {
        return res.status(404).json({ error: 'About data not found' });
    }
    try {
        const data = JSON.parse(fs.readFileSync(ABOUT_DATA_PATH, 'utf8'));
        res.json(data);
    } catch (err) {
        console.error('[ABOUT] Failed to read about data:', err);
        res.status(500).json({ error: 'Failed to read about data', details: err.message });
    }
});

// Save about data
app.post('/api/save-about', (req, res) => {
    try {
        fs.writeFileSync(ABOUT_DATA_PATH, JSON.stringify(req.body, null, 2));
        res.json({ success: true });
        console.log('[ABOUT] About data saved successfully');
    } catch (err) {
        console.error('[ABOUT] Failed to save about data:', err);
        res.status(500).json({ error: 'Failed to save about data', details: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});

