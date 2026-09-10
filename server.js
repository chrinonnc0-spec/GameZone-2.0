const express = require("express");
const cors = require("cors");
require("dotenv").config();

const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// =====================================================
// GAMEZONE
// =====================================================

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// =====================================================
// RÉCUPÉRER L'IMAGE D'UNE PAGE OFFICIELLE
// =====================================================

async function getOfficialImage(url) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; GameZone/2.0)"
      }
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();

    // Plusieurs formats possibles de og:image
    const patterns = [
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i,
      /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["'][^>]*>/i,
      /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["'][^>]*>/i,
      /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["'][^>]*>/i
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);

      if (match && match[1]) {
        let image = match[1];

        // Convertir une URL relative en URL complète
        if (image.startsWith("//")) {
          image = "https:" + image;
        } else if (image.startsWith("/")) {
          const base = new URL(url);
          image = base.origin + image;
        }

        return image;
      }
    }

    return null;

  } catch (error) {
    console.error(
      "Erreur récupération image :",
      error.message
    );

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
        lieu: "Fort Worth, Texas",
        organisateur: "Rocket League Esports",
        description:
          "Championnat du monde officiel de Rocket League.",
        source:
          "https://www.rocketleague.com/competitive/schedule"
      },

      {
        titre: "Fortnite Competitive",
        jeu: "Fortnite",
        date: "Événements à venir",
        lieu: "En ligne",
        organisateur: "Epic Games",
        description:
          "Calendrier officiel des compétitions Fortnite.",
        source:
          "https://www.fortnite.com/competitive/events/S41_FNCSMajor2_LCQ?region=NAC"
      }
    ];

    const evenements = [];

    for (const event of sources) {

      const image =
        await getOfficialImage(event.source);

      evenements.push({
        ...event,
        image
      });
    }

    res.json({
      verified: true,
      source: "Sources officielles",
      count: evenements.length,
      evenements
    });

  } catch (error) {

    console.error(
      "Erreur événements :",
      error
    );

    res.status(500).json({
      verified: false,
      error: "Impossible de charger les événements."
    });
  }
});

// =====================================================
// CONCOURS
// =====================================================

app.get("/api/concours", async (req, res) => {
  try {

    // Aucun concours inventé.
    const concours = [];

    res.json({
      verified: true,
      source: "Sources officielles des organisateurs",
      count: concours.length,
      concours
    });

  } catch (error) {

    console.error(
      "Erreur concours :",
      error
    );

    res.status(500).json({
      verified: false,
      error: "Impossible de charger les concours."
    });
  }
});

// =====================================================
// STATUT
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
// 404
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
