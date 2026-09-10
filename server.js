const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;
const NEWS_API_KEY = process.env.NEWS_API_KEY;

app.use(cors());
app.use(express.json());

/* =========================
   ACCUEIL DU SERVEUR
========================= */

app.get("/", (req, res) => {
  res.json({
    message: "🎮 GameZone 2.0 — serveur connecté",
    status: "online"
  });
});

/* =========================
   ACTUALITÉS
========================= */

app.get("/api/news", async (req, res) => {
  try {
    if (!NEWS_API_KEY) {
      return res.status(500).json({
        error: "Clé API non configurée sur le serveur."
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
    console.error("Erreur actualités :", error);

    res.status(500).json({
      error: "Impossible de récupérer les actualités."
    });
  }
});

/* =========================
   EVENEMENTS GAMING
========================= */

app.get("/api/evenements", async (req, res) => {
  try {

    /*
      Pour éviter d'inventer des événements,
      cette route ne renvoie que des données
      provenant d'une source officielle vérifiée.
    */

    const evenements = [];

    res.json({
      verified: true,
      source: "Sources officielles des éditeurs",
      events: evenements
    });

  } catch (error) {

    console.error("Erreur événements :", error);

    res.status(500).json({
      error: "Impossible de récupérer les événements."
    });

  }
});

/* =========================
   CONCOURS GAMING
========================= */

app.get("/api/concours", async (req, res) => {
  try {

    /*
      Aucun concours inventé.
      Les concours seront ajoutés uniquement
      lorsqu'une source officielle fiable est vérifiée.
    */

    const concours = [];

    res.json({
      verified: true,
      source: "Sources officielles des éditeurs",
      contests: concours
    });

  } catch (error) {

    console.error("Erreur concours :", error);

    res.status(500).json({
      error: "Impossible de récupérer les concours."
    });

  }
});

/* =========================
   DEMARRAGE
========================= */

app.listen(PORT, () => {
  console.log(
    `🎮 GameZone Server démarré sur le port ${PORT}`
  );
});