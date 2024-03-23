const PORT = 8000;
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(cors());

const API_KEY = process.env.API_KEY; // Replace with your OpenAI API key

app.post('/completions', async (req, res) => {
    try {
        const { default: fetch } = await import('node-fetch'); // Dynamic import
        const options = {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
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
        const data = await response.json();
        res.send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error'); // Send 500 status code in case of error
    }
});

app.listen(PORT, () => console.log('Your server is running on PORT ' + PORT));
