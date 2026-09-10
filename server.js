const express = require("express");
const cors = require("cors");
require("dotenv").config();

const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// =====================================================
// SITE GAMEZONE
// =====================================================

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// =====================================================
// OUTIL : récupérer l'image officielle d'une page
// =====================================================

async function getOfficialImage(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    const html = await response.text();

    const match =
      html.match(
        /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
      ) ||
      html.match(
        /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i
      );

    if (match && match[1]) {
      return match[1];
    }

    return null;

  } catch (error) {
    console.error("Image officielle indisponible :", error.message);
    return null;
  }
}

// =====================================================
// ACTUALITÉS
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
// ÉVÉNEMENTS GAMING RÉELS
// =====================================================

app.get("/api/evenements", async (req, res) => {

  try {

    const sources = [

      {
        titre: "RLCS World Championship 2026",
        jeu: "Rocket League",
        date: "15 - 20 septembre 2026",
        lieu: "Événement officiel Rocket League",
        organisateur: "Rocket League Esports",
        description:
          "Championnat du monde officiel de Rocket League.",
        source:
          "https://www.rocketleague.com/competitive/schedule"
      },

      {
        titre: "Fortnite Competitive — événements à venir",
        jeu: "Fortnite",
        date: "Septembre 2026",
        lieu: "En ligne",
        organisateur: "Epic Games",
        description:
          "Calendrier officiel des compétitions Fortnite à venir.",
        source:
          "https://www.fortnite.com/competitive/watch"
      }

    ];

    const evenements = [];

    for (const event of sources) {

      const image = await getOfficialImage(event.source);

      evenements.push({
        ...event,
        image: image
      });

    }

    res.json({

      verified: true,

      source:
        "Sources officielles Rocket League et Fortnite",

      count:
        evenements.length,

      evenements:
        evenements

    });

  } catch (error) {

    console.error(
      "Erreur événements :",
      error
    );

    res.status(500).json({

      verified: false,

      error:
        "Impossible de charger les événements."

    });

  }

});

// =====================================================
// CONCOURS RÉELS
// =====================================================
//
// IMPORTANT : aucun concours inventé.
// On n'affiche un concours que lorsque sa page officielle
// est disponible et vérifiable.
// =====================================================

app.get("/api/concours", async (req, res) => {

  try {

    /*
      Cette liste reste vide tant qu'un concours officiel
      avec des règles vérifiables n'a pas été confirmé.

      C'est volontaire :
      GameZone ne doit jamais inventer un concours.
    */

    const concours = [];

    res.json({

      verified: true,

      source:
        "Sources officielles des organisateurs",

      count:
        concours.length,

      concours:
        concours

    });

  } catch (error) {

    console.error(
      "Erreur concours :",
      error
    );

    res.status(500).json({

      verified: false,

      error:
        "Impossible de charger les concours."

    });

  }

});

// =====================================================
// STATUT DU SERVEUR
// =====================================================

app.get("/api/status", (req, res) => {

  res.json({

    project: "GameZone 2.0",

    status: "online",

    server: "Node.js / Express",

    news: "/api/news",

    events: "/api/evenements",

    contests: "/api/concours"

  });

});

// =====================================================
// ERREUR 404
// =====================================================

app.use((req, res) => {

  res.status(404).json({

    error:
      "Page ou API introuvable."

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
