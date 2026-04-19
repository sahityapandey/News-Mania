const QUOTES = [
  { text: "The truth will set you free, but first it will make you miserable.", author: "James A. Garfield" },
  { text: "Journalism is printing what someone else does not want printed; everything else is public relations.", author: "George Orwell" },
  { text: "The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion.", author: "Albert Camus" },
  { text: "In a time of deceit, telling the truth is a revolutionary act.", author: "George Orwell" },
  { text: "Knowledge will forever govern ignorance; and a people who mean to be their own governors must arm themselves with the power which knowledge gives.", author: "James Madison" },
  { text: "The press is the best instrument for enlightening the mind of man, and improving him as a rational, moral, and social being.", author: "Thomas Jefferson" },
  { text: "An informed citizenry is the only true repository of the public will.", author: "Thomas Jefferson" },
  { text: "Without freedom of thought, there can be no such thing as wisdom.", author: "Benjamin Franklin" },
  { text: "A free press can be good or bad, but, most certainly, without freedom, the press will be bad.", author: "Albert Camus" },
  { text: "The most courageous act is still to think for yourself. Aloud.", author: "Coco Chanel" },
  { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
  { text: "It is not the strongest of the species that survive, nor the most intelligent, but the one most responsive to change.", author: "Charles Darwin" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Do not go where the path may lead; go instead where there is no path and leave a trail.", author: "Ralph Waldo Emerson" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
  { text: "When you reach the end of your rope, tie a knot in it and hang on.", author: "Franklin D. Roosevelt" },
  { text: "Always remember that you are absolutely unique. Just like everyone else.", author: "Margaret Mead" },
  { text: "Do not wait to strike till the iron is hot, but make it hot by striking.", author: "William Butler Yeats" },
  { text: "Great minds discuss ideas; average minds discuss events; small minds discuss people.", author: "Eleanor Roosevelt" },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison" },
  { text: "If you want to lift yourself up, lift up someone else.", author: "Booker T. Washington" },
  { text: "No one can make you feel inferior without your consent.", author: "Eleanor Roosevelt" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "The world is a book, and those who do not travel read only one page.", author: "Saint Augustine" },
  { text: "Spread love everywhere you go. Let no one ever come to you without leaving happier.", author: "Mother Teresa" },
];

export function getDailyQuote() {
  // Pick deterministically by day-of-year so it changes daily
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return QUOTES[dayOfYear % QUOTES.length];
}
