const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());

app.post('/generate-image', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt in body' });
  }

  try {
    const response = await fetch('https://api.modelslab.com/v3/text2img', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.MODEL_LAB_API_KEY}`,  // Use MODEL_LAB_API_KEY here
      },
      body: JSON.stringify({
        prompt,
        width: 512,
        height: 512,
        steps: 30,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      res.json(data);  // Return the full response as JSON
    } else {
      res.status(response.status).json({ error: 'API Error', details: data });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server Error', message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

