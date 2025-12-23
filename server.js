import express from "express";
import yts from "yt-search";
import ytdl from "ytdl-core";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Missing query" });

  try {
    const r = await yts(query);
    const videos = r.videos.slice(0, 10).map(v => ({
      videoId: v.videoId,
      title: v.title,
      author: v.author.name,
      duration: v.timestamp
    }));
    res.json({ videos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/audio", async (req, res) => {
  const videoId = req.query.id;
  if (!videoId) return res.status(400).json({ error: "Missing videoId" });

  try {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
    res.json({ audioUrl: format.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
