const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 5080;

// Set view engine to Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serve static assets from /public
app.use(express.static(path.join(__dirname, 'public')));

// Serve Font Awesome from node_modules
app.use('/fontawesome', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free')));

// Enable CORS for all routes
app.use(cors());


// Helper: weather descriptions
const weatherDescriptions = {
  0: { label: 'Unknown', icon: 'fa-question-circle', color: 'gray' },
  1000: { label: 'Clear', icon: 'fa-sun', color: '#fbc531' },    
  1001: { label: 'Cloudy', icon: 'fa-cloud', color: '#7f8fa6' },
  1100: { label: 'Mostly Clear', icon: 'fa-cloud-sun', color: '#fbc531' },
  1101: { label: 'Partly Cloudy', icon: 'fa-cloud-sun', color: '#e1b12c' },
  1102: { label: 'Mostly Cloudy', icon: 'fa-cloud', color: '#778ca3' },
  2000: { label: 'Fog', icon: 'fa-smog', color: '#a4b0be' },
  2100: { label: 'Light Fog', icon: 'fa-smog', color: '#ced6e0' },
  3000: { label: 'Light Wind', icon: 'fa-wind', color: '#00cec9' },
  3001: { label: 'Wind', icon: 'fa-wind', color: '#0984e3' },
  3002: { label: 'Strong Wind', icon: 'fa-wind', color: '#0652DD' },
  4000: { label: 'Drizzle', icon: 'fa-cloud-rain', color: '#74b9ff' },
  4001: { label: 'Rain', icon: 'fa-cloud-showers-heavy', color: '#3498db' },
  4200: { label: 'Light Rain', icon: 'fa-cloud-rain', color: '#74b9ff' },
  4201: { label: 'Heavy Rain', icon: 'fa-cloud-showers-heavy', color: '#2980b9' },
  5000: { label: 'Snow', icon: 'fa-snowflake', color: '#00a8ff' },
  5001: { label: 'Flurries', icon: 'fa-snowflake', color: '#00a8ff' },
  5100: { label: 'Light Snow', icon: 'fa-snowflake', color: '#9cffff' },
  5101: { label: 'Heavy Snow', icon: 'fa-snowflake', color: '#273c75' },
  6000: { label: 'Freezing Drizzle', icon: 'fa-snowflake', color: '#81ecec' },
  6001: { label: 'Freezing Rain', icon: 'fa-snowflake', color: '#00cec9' },
  6200: { label: 'Light Freezing Rain', icon: 'fa-snowflake', color: '#81ecec' },
  6201: { label: 'Heavy Freezing Rain', icon: 'fa-snowflake', color: '#00a8ff' },
  7000: { label: 'Ice Pellets', icon: 'fa-snowflake', color: '#7ed6df' },
  7101: { label: 'Heavy Ice Pellets', icon: 'fa-snowflake', color: '#487eb0' },
  7102: { label: 'Light Ice Pellets', icon: 'fa-snowflake', color: '#dff9fb' },
  8000: { label: 'Thunderstorm', icon: 'fa-bolt', color: '#e84118' }
};



// Route: Home Page
app.get('/', async (req, res) => {
  const location = req.query.location;

  if (!location) {
    return res.render('index', {
      forecast: null,
      attractions: [],
      location: null,
      mapApiKey: process.env.GOOGLE_PLACES_API_KEY,
      weatherDescriptions
    });
  }

  const apiKey = process.env.TOMORROW_API_KEY;
  const googleKey = process.env.GOOGLE_PLACES_API_KEY;

  try {
    const weatherRes = await axios.get(`https://api.tomorrow.io/v4/weather/forecast`, {
      params: {
        location,
        timesteps: '1d',
        units: 'metric',
        apikey: apiKey
      }
    });

    const geoRes = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json`, {
      params: { query: location, key: googleKey }
    });

    const place = geoRes.data.results[0];
    const { lat, lng } = place.geometry.location;

    let allResults = [];
    let nextPageToken = null;
    let pageCount = 0;

    do {
      const nearbyRes = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
        params: {
          location: `${lat},${lng}`,
          radius: 5000,
          type: 'tourist_attraction',
          key: googleKey,
          pagetoken: nextPageToken
        }
      });

      allResults.push(...nearbyRes.data.results);
      nextPageToken = nearbyRes.data.next_page_token || null;
      pageCount++;
      if (nextPageToken) await new Promise((resolve) => setTimeout(resolve, 2000));
    } while (nextPageToken && pageCount < 3);

    const attractions = await Promise.all(
      allResults.map(async (a) => {
        let details = {};
        try {
          const detailsRes = await axios.get(
            `https://maps.googleapis.com/maps/api/place/details/json`,
            {
              params: {
                place_id: a.place_id,
                key: googleKey,
                fields: 'opening_hours,formatted_address,international_phone_number,url',
              },
            }
          );
          details = detailsRes.data.result;
        } catch (e) {
          console.warn(`Details fetch failed for ${a.name}`);
        }
    
        return {
          name: a.name,
          description: a.types?.join(', ') || '',
          photoRef: a.photos?.[0]?.photo_reference || '',
          placeId: a.place_id,
          address: details.formatted_address || a.vicinity,
          rating: a.rating,
          phone: details.international_phone_number || '',
          googleMapsUrl: details.url || '',
          opening_hours: details.opening_hours?.weekday_text || [],
          open_now: details.opening_hours?.open_now,
        };
      })
    );
    
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 8;
    const totalPages = Math.ceil(attractions.length / itemsPerPage);
    const start = (page - 1) * itemsPerPage;
    const paginatedAttractions = attractions.slice(start, start + itemsPerPage);
    
    res.render('index', {
      location,
      forecast: weatherRes.data,
      attractions: paginatedAttractions,
      weatherDescriptions,
      mapApiKey: googleKey,
      currentPage: page,
      totalPages
    });
    
    

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Failed to load page');
  }
});



// Route: API photo proxy
app.get('/api/photo', async (req, res) => {
  const { photoRef } = req.query;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!photoRef) return res.status(400).json({ error: 'Missing photo reference' });

  try {
    const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${apiKey}`;
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });

    res.setHeader('Content-Type', response.headers['content-type']);
    response.data.pipe(res);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});



app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
