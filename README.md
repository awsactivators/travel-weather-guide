# 🌍 Travel Planner & Weather Guide

A responsive web app that helps users search any city and view:

- 🗺️ Top attractions with details and images
- 🌤️ 6-day weather forecast with icons
- 📍 Interactive Google Maps

Built using **Node.js**, **Express**, **Pug**, **CSS**, and public APIs.

---

## 🚀 Features

- Search for any city
- View weather forecasts using [Tomorrow.io API](https://www.tomorrow.io/)
- Discover top attractions with [Google Places API](https://developers.google.com/maps/documentation/places/web-service/overview)
- Clickable map modal for each location
- Pagination for large attraction results
- Fixed header & footer with icons

---

## 🛠️ Tech Stack

- **Backend:** Node.js + Express
- **Templating:** Pug (formerly Jade)
- **Frontend:** HTML + CSS (responsive design)
- **APIs:** Tomorrow.io, Google Places, Google Maps Embed

---

## 📦 Installation

```bash
# Clone the project
git clone https://github.com/awsactivators/travel-weather-guide.git
cd travel-weather-guide

# Install dependencies
npm install
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root:

```env
GOOGLE_PLACES_API_KEY=your_google_api_key
TOMORROW_API_KEY=your_tomorrow_io_api_key
```

Ensure your Google API key has these APIs enabled:
- Maps Embed API
- Places API

---

## 🧪 Run the App

```bash
npm run dev
```

Then go to: [http://localhost:5080](http://localhost:5080)

---

## 📁 Folder Structure

```
project-root/
├── public/
│   ├── css/
│   └── js/
│   └── image/    
├── views/
│   ├── common/
│   └── index.pug
│   └── layout.pug
├── .env
├── index.js
└── package.json
```

---

## 🔑 API References

- **Tomorrow.io Weather API** – [Docs](https://docs.tomorrow.io/reference/overview)
- **Google Maps & Places API** – [Docs](https://developers.google.com/maps/documentation/places/web-service/overview)

---

## 📷 Screenshots

Home Page
![Home Page](https://res.cloudinary.com/dqtokk1cn/image/upload/v1743109854/travel-weather-app/ltmejgjfjzf34tnxaurw.png)

Result Page
![Result](https://res.cloudinary.com/dqtokk1cn/image/upload/v1743109853/travel-weather-app/apvcp4yeg3woxfct3jal.png)

---

## 📃 License

MIT License — feel free to use and modify!

---

## 👩‍💻 Author

**Genevieve**  
DevOps + Web Developer  
[LinkedIn](https://linkedin.com/in/vieve-awa)

---

