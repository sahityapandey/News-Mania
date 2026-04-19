export default async function handler(req, res) {
  const { q } = req.query;

  const API_KEY = "pub_7ba2b4e1dfa7405e821a6c002ef4de99";

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