const express = require("express");
const cors = require("cors");
require("dotenv").config();

const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;
const NEWS_API_KEY = process.env.NEWS_API_KEY;

app.use(cors());

// Servir les fichiers de GameZone 2.0
app.use(express.static(__dirname));

// Afficher le site GameZone 2.0
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// API des actualités gaming
app.get("/api/news", async (req, res) => {
  try {
    if (!NEWS_API_KEY) {
      return res.status(500).json({
        error: "Clé API NewsAPI non configurée sur le serveur."
      });
    }

    const query =
      "gaming OR videogames OR PlayStation OR Xbox OR Nintendo";

    const url =
      "https://newsapi.org/v2/everything" +
      "?q=" + encodeURIComponent(query) +
      "&language=en" +
      "&sortBy=publishedAt" +
      "&pageSize=20";

    const response = await fetch(url, {
      headers: {
        "X-Api-Key": NEWS_API_KEY
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.message || "Erreur NewsAPI"
      });
    }

    res.json(data);

  } catch (error) {
    console.error("Erreur serveur :", error);

    res.status(500).json({
      error: "Impossible de récupérer les actualités."
    });
  }
});

// API des événements gaming
app.get("/api/evenements", async (req, res) => {
  try {

    const evenements = [
      {
        title: "RLCS World Championship 2026",
        description: "Championnat du monde officiel de Rocket League.",
        date: "15 septembre - 20 septembre 2026",
        location: "Fort Worth, Texas",
        url: "https://www.rocketleague.com/competitive/schedule"
      }
    ];

    res.json({
      verified: true,
      source: "Rocket League - source officielle",
      events: evenements
    });

  } catch (error) {

    console.error("Erreur événements :", error);

    res.status(500).json({
      error: "Impossible de récupérer les événements."
    });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🎮 GameZone Server démarré sur le port ${PORT}`);
});
