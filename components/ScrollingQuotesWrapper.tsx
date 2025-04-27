import ScrollingQuotes from './ScrollingQuotes';

// This is a placeholder for server-side loading of quotes
// In a production environment, you would fetch this data from the markdown file
const quotesData = {
  quotes: [
    "The best way to predict the future is to create it.",
    "Innovation distinguishes between a leader and a follower.",
    "The future belongs to those who believe in the beauty of their dreams."
  ],
  quotes_with_attribution: [
    { text: "The best way to predict the future is to create it.", author: "Alan Kay" },
    { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "The future is already here – it's just not evenly distributed.", author: "William Gibson" },
    { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" }
  ],
  settings: {
    speed: "medium",
    pause_on_hover: true,
    direction: "left-to-right"
  }
};

export default function ScrollingQuotesWrapper() {
  // Use quotes with attribution by default
  const quotes = quotesData.quotes_with_attribution;
  const { speed, pause_on_hover, direction } = quotesData.settings;
  
  return (
    <ScrollingQuotes 
      quotes={quotes} 
      speed={speed as 'slow' | 'medium' | 'fast'} 
      pauseOnHover={pause_on_hover} 
      direction={direction as 'left-to-right' | 'right-to-left'} 
    />
  );
}
