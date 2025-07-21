const path = require('path');
const Profile = require(path.join(__dirname, '..', 'models', 'Profile.js'));
const Vertical = require(path.join(__dirname, '..', 'models', 'Vertical.js'));
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// @desc    Analyze a user's assessment for a specific vertical
// @route   POST /api/ai/analyze
// @access  Private
const analyzeAssessment = async (req, res) => {
    try {
        const { verticalId } = req.body;
        const userId = req.user.id;

        if (!verticalId) {
            return res.status(400).json({ message: 'Vertical ID is required.' });
        }

        // Fetch the profile and the vertical's name simultaneously
        const [profile, vertical] = await Promise.all([
            Profile.findOne({ user: userId }),
            Vertical.findById(verticalId, 'name')
        ]);

        if (!profile) {
            return res.status(404).json({ message: 'User profile not found.' });
        }
        if (!vertical) {
            return res.status(404).json({ message: 'Vertical not found.' });
        }

        const assessment = profile.assessments.get(verticalId);
        if (!assessment || !assessment.skills) {
            return res.status(404).json({ message: 'Assessment for this vertical not found.' });
        }

        // Format the skill data for the prompt
        const skillDataString = JSON.stringify(assessment.skills, null, 2);

        // Construct the expert-level prompt
        const promptText = `
            You are "Analyst AI," a sophisticated career development assistant for the Prometheus Ascent platform.
            Your task is to provide an expert-level analysis of a user's self-assessed skills.

            **User's Vertical:** ${vertical.name}
            **User's Skill Data (1=Familiar, 5=Expert):**
            ${skillDataString}

            **Your Instructions:**
            1.  **Analyze Strengths:** Identify 2-3 key areas where the user shows high proficiency. Explain why these skills are valuable in the ${vertical.name} industry.
            2.  **Identify Growth Areas:** Pinpoint 2-3 skills with lower ratings that represent significant opportunities for growth. Frame this constructively, not negatively.
            3.  **Provide Actionable Next Steps:** Offer 3 concrete, actionable recommendations for improvement. These should be specific (e.g., "Focus on building a small project using React's Context API to manage state," not just "Learn React").
            4.  **Maintain a Professional Tone:** The analysis should be encouraging, insightful, and professional.

            Return the entire response as a single, well-formatted markdown string. Do not wrap it in a JSON object or use code fences.
        `;

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
        
        const payload = { contents: [{ parts: [{ text: promptText }] }] };
        const geminiResponse = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

        if (!geminiResponse.ok) {
            const errorBody = await geminiResponse.text();
            console.error("Gemini API Error:", errorBody);
            throw new Error('Failed to get analysis from AI service.');
        }

        const geminiResult = await geminiResponse.json();
        const analysisText = geminiResult.candidates[0].content.parts[0].text;

        res.json({ analysis: analysisText });

    } catch (error) {
        console.error("AI Analysis Error:", error);
        res.status(500).json({ message: 'Server error during AI analysis.' });
    }
};

module.exports = {
    analyzeAssessment,
};