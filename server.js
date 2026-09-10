const express = require("express");
const cors = require("cors");
require("dotenv").config();

const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

// =====================================================
// CONFIGURATION
// =====================================================

app.use(cors());
app.use(express.json());

// Servir GameZone 2.0
app.use(express.static(__dirname));

// =====================================================
// ACCUEIL
// =====================================================

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// =====================================================
// ACTUALITÉS GAMING — NEWSAPI
// =====================================================

app.get("/api/news", async (req, res) => {
  try {
    const NEWS_API_KEY = process.env.NEWS_API_KEY;

    if (!NEWS_API_KEY) {
      return res.status(500).json({
        error: "Clé NEWS_API_KEY non configurée."
      });
    }

    const query =
      "gaming OR videogames OR PlayStation OR Xbox OR Nintendo";

    const url =
      "https://newsapi.org/v2/everything" +
      "?q=" +
      encodeURIComponent(query) +
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
    console.error("Erreur NewsAPI :", error);

    res.status(500).json({
      error: "Impossible de récupérer les actualités."
    });
  }
});

// =====================================================
// ÉVÉNEMENTS GAMING
// =====================================================
//
// Cette route ne fabrique aucun événement.
// Les événements vérifiés peuvent être ajoutés dans
// EVENT_SOURCES lorsqu'une source officielle est disponible.
//
// Pour l'instant, on renvoie une liste vide plutôt que
// d'afficher de fausses informations.
// =====================================================

app.get("/api/evenements", async (req, res) => {

  try {

    const evenements = [];

    /*
      Exemple de structure à utiliser lorsqu'un événement
      est vérifié :

      evenements.push({
        titre: "Nom officiel",
        jeu: "Nom du jeu",
        date: "2026-09-20",
        lieu: "Online",
        organisateur: "Organisateur officiel",
        description: "Description vérifiée",
        source: "https://site-officiel.com"
      });
    */

    res.json({
      verified: true,
      source: "Sources officielles GameZone",
      count: evenements.length,
      evenements: evenements
    });

  } catch (error) {

    console.error("Erreur événements :", error);

    res.status(500).json({
      verified: false,
      error: "Impossible de charger les événements."
    });

  }

});

// =====================================================
// CONCOURS GAMING
// =====================================================
//
// IMPORTANT : aucun concours inventé.
//
// Un concours doit être vérifié avant d'être ajouté.
// =====================================================

app.get("/api/concours", async (req, res) => {

  try {

    const concours = [];

    /*
      Exemple de structure pour un concours vérifié :

      concours.push({
        titre: "Nom officiel du concours",
        organisateur: "Organisateur officiel",
        recompense: "Récompense officiellement annoncée",
        dateLimite: "2026-10-01",
        conditions: "Conditions officielles",
        source: "https://site-officiel.com"
      });
    */

    res.json({
      verified: true,
      source: "Sources officielles GameZone",
      count: concours.length,
      concours: concours
    });

  } catch (error) {

    console.error("Erreur concours :", error);

    res.status(500).json({
      verified: false,
      error: "Impossible de charger les concours."
    });

  }

});

// =====================================================
// TEST DU SERVEUR
// =====================================================

app.get("/api/status", (req, res) => {

  res.json({
    project: "GameZone 2.0",
    status: "online",
    server: "Node.js / Express",
    events: "/api/evenements",
    contests: "/api/concours",
    news: "/api/news"
  });

});

// =====================================================
// ERREUR 404
// =====================================================

app.use((req, res) => {

  res.status(404).json({
    error: "Page ou API introuvable."
  });

});

// =====================================================
// DÉMARRAGE
// =====================================================

app.listen(PORT, () => {

  console.log(
    `🎮 GameZone 2.0 démarré sur le port ${PORT}`
  );

});
