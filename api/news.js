export default async function handler(req, res) {
  const { q } = req.query;

  const API_KEY = "0b65fc4fee464b818ef49397aa84b27b";

  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${q}&language=en&sortBy=publishedAt&apiKey=${API_KEY}`
    );

    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch news" });
  }
}