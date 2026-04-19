export async function shareArticle(article) {
  const data = {
    title: article.title,
    text: article.description || article.title,
    url: article.url,
  };

  // Native share (mobile)
  if (navigator.share) {
    try {
      await navigator.share(data);
      return "native";
    } catch { /* cancelled */ }
  }

  // Fallback: copy to clipboard
  try {
    await navigator.clipboard.writeText(article.url);
    return "copied";
  } catch {
    return "failed";
  }
}

export const SOCIAL_SHARE = {
  twitter: (article) =>
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(article.url)}`,
  whatsapp: (article) =>
    `https://wa.me/?text=${encodeURIComponent(article.title + " " + article.url)}`,
  linkedin: (article) =>
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(article.url)}`,
  facebook: (article) =>
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(article.url)}`,
};
