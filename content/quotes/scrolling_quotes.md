---
# Scrolling Quotes Configuration
# Each quote should be in quotation marks with an optional author/source
# Format: quotes: ["Quote text", "Another quote", "Yet another quote"]
# For quotes with attribution: quotes_with_attribution: [{"text": "Quote text", "author": "Author Name"}, {...}]
---

# Simple Quotes
# Use this format if you only need the quote text without attribution
quotes:
  - "The best way to predict the future is to create it."
  - "Innovation distinguishes between a leader and a follower."
  - "The future belongs to those who believe in the beauty of their dreams."

# Quotes with Attribution
# Use this format if you want to include the author or source of each quote
quotes_with_attribution:
  - text: "The best way to predict the future is to create it."
    author: "Alan Kay"
  - text: "Innovation distinguishes between a leader and a follower."
    author: "Steve Jobs"
  - text: "The future belongs to those who believe in the beauty of their dreams."
    author: "Eleanor Roosevelt"
  - text: "The future is already here – it's just not evenly distributed."
    author: "William Gibson"
  - text: "The only limit to our realization of tomorrow will be our doubts of today."
    author: "Franklin D. Roosevelt"

# Speed and Animation Settings
# Optional settings to control the scrolling behavior
settings:
  speed: "medium"  # Options: slow, medium, fast
  pause_on_hover: true
  direction: "left-to-right"  # Options: left-to-right, right-to-left
