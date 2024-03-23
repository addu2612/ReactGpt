const PORT = 8000;
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(cors());

const API_KEY = process.env.API_KEY; // Ensure this is set in your .env file
const MODEL_ID = process.env.MODEL_ID || 'gpt-3.5-turbo'; // Default to 'gpt-3.5-turbo' if not specified

app.post('/completions', async (req, res) => {
    if (!req.body.message) {
        return res.status(400).send('Bad Request: Missing message in request body.');
    }

    try {
        const { default: fetch } = await import('node-fetch'); // Dynamic import
        const options = {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: MODEL_ID,
                messages: [
                    {
                        role: 'user',
                        content: req.body.message
                    }
                ],
                max_tokens: 100,
            })
        };

        const response = await fetch('https://api.openai.com/v1/chat/completions', options);
        if (!response.ok) {
            throw new Error(`OpenAI API Error: ${response.statusText}`);
        }
        const data = await response.json();
        res.send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => console.log(`Your server is running on PORT ${PORT}`));
