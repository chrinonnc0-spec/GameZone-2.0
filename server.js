const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;
const NEWS_API_KEY = process.env.NEWS_API_KEY;

app.use(cors());
app.use(express.json());

// Servir tous les fichiers du site
app.use(express.static(__dirname));

// Afficher index.html à l'accueil
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// API Actualités
app.get("/api/news", async (req, res) => {
  try {
    if (!NEWS_API_KEY) {
      return res.status(500).json({
        error: "NEWS_API_KEY manquante"
      });
    }

    const url =
      "https://newsapi.org/v2/everything?" +
      "q=gaming%20OR%20videogames%20OR%20PlayStation%20OR%20Xbox%20OR%20Nintendo" +
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
      return res.status(response.status).json(data);
    }

    res.json(data);

  } catch (error) {
    console.error("Erreur actualités :", error);

    res.status(500).json({
      error: "Impossible de charger les actualités"
    });
  }
});

// Route de test du serveur
app.get("/api/status", (req, res) => {
  res.json({
    message: "🎮 GameZone 2.0 — serveur connecté",
    status: "online"
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🎮 GameZone 2.0 lancé sur le port ${PORT}`);
});
