const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');

// --- MODULES ---
const connectDB = require(path.join(__dirname, 'config', 'db.js'));
const Vertical = require(path.join(__dirname, 'models', 'Vertical.js'));

// --- ROUTE IMPORTS ---
const authRoutes = require(path.join(__dirname, 'routes', 'authRoutes.js'));
const verticalRoutes = require(path.join(__dirname, 'routes', 'verticalRoutes.js'));
const profileRoutes = require(path.join(__dirname, 'routes', 'profileRoutes.js'));
const quizRoutes = require(path.join(__dirname, 'routes', 'quizRoutes.js'));
const aiRoutes = require(path.join(__dirname, 'routes', 'aiRoutes.js')); // <-- ADD THIS LINE

// --- INITIALIZE APP & DB CONNECTION ---
const app = express();
connectDB();

// --- MIDDLEWARE ---
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// --- API ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/verticals', verticalRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/ai', aiRoutes); // <-- ADD THIS LINE

app.get('/', (req, res) => {
    res.send('Prometheus Ascent API is running.');
});

// --- DATABASE SEEDING ---
async function seedDatabase() {
    try {
        const count = await Vertical.countDocuments();
        if (count === 0) {
            console.log("No verticals found, seeding database...");
            await Vertical.create([
                { name: "Software Engineering", description: "Assess your skills in modern software development, from languages to cloud infrastructure.", skillTaxonomy: { "Programming Languages": ["JavaScript / TypeScript", "Python", "Go", "Java", "Rust"], "Frontend Frameworks": ["React", "Vue.js", "Svelte", "Angular"], "Backend Frameworks": ["Node.js (Express/NestJS)", "Django / Flask", "Go (Gin/Echo)", "Spring Boot"], "Databases": ["PostgreSQL", "MongoDB", "Redis", "MySQL"], "Cloud & DevOps": ["AWS (EC2, S3, Lambda)", "Docker", "Kubernetes (K8s)", "CI/CD (GitHub Actions)"] } },
                { name: "Finance & Accounting", description: "Evaluate your expertise in financial analysis, modeling, accounting principles, and more.", skillTaxonomy: { "Financial Analysis": ["Financial Modeling", "Valuation", "FP&A", "Equity Research"], "Accounting": ["GAAP", "IFRS", "Auditing", "Tax Accounting"], "Tools & Technology": ["Excel", "QuickBooks", "SAP", "Bloomberg Terminal"] } }
            ]);
            console.log("Database seeded with initial verticals.");
        }
    } catch (error) {
        console.error("Error seeding database:", error);
    }
}

mongoose.connection.once('open', () => {
    seedDatabase();
});

// --- START SERVER ---
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});