const express = require("express");
const axios = require("axios");
const NodeCache = require("node-cache");

const app = express();
const cache = new NodeCache({ stdTTL: 300 }); // 5 dakika cache süresi

const PORT = 5000;

// RSS Kaynakları
const RSS_SOURCES = [
    { name: "TRT Haber", url: "https://www.trthaber.com/sondakika_articles.rss" },
    { name: "Habertürk", url: "https://www.haberturk.com/rss" },
    { name: "CNN Türk", url: "https://www.cnnturk.com/feed/rss/all/news" },
    { name: "Sözcü", url: "https://www.sozcu.com.tr/feeds-son-dakika" },
    { name: "NTV", url: "https://www.ntv.com.tr/son-dakika.rss" },
    { name: "En Son Haber", url: "https://www.ensonhaber.com/rss/ensonhaber.xml" }
];

// Haberleri Çekme Fonksiyonu
async function fetchNews(rssUrl) {
    try {
        const cachedData = cache.get(rssUrl);
        if (cachedData) {
            return cachedData;
        }

        const response = await axios.get(rssUrl);
        cache.set(rssUrl, response.data);
        return response.data;
    } catch (error) {
        console.error("RSS çekme hatası:", error);
        return null;
    }
}

// API Endpoint: Tüm Haberleri Getir
app.get("/news", async (req, res) => {
    const results = [];

    for (let source of RSS_SOURCES) {
        const news = await fetchNews(source.url);
        if (news) {
            results.push({ source: source.name, news });
        }
    }

    res.json(results);
});

app.get("/", (req, res) => {
    res.send("API Çalışıyor! 🚀");
});


// API'yi Başlat
app.listen(PORT, () => {
    console.log(`🚀 Server ${PORT} portunda çalışıyor...`);
});
