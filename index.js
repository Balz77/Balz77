const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());

async function fetchTextFromURL(query) {
  const encodedQuery = encodeURIComponent(query);
  const url = `https://letmegpt.com/search?q=${encodedQuery}`;

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    return $('#gptans').text();
  } catch (error) {
    console.log('Error:', error);
    return null;
  }
}

app.get('/api/chatgpt', async (req, res) => {
  const teks = req.query.teks;
  if (!teks) {
    return res.status(400).json({ error: 'Missing query parameter "teks"' });
  }

  const response = await fetchTextFromURL(teks);

  if (response) {
    res.json({ response });
  } else {
    res.status(500).json({ error: 'Failed to get response from ChatGPT' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});