---
videos:
  - url: 'https://www.youtube.com/watch?v=ziLmtuLm-LU&t=2261s'
    title: Generative AI Playbook for Enterprise Leaders
    description: >-
      Strategic breakdown of how large organizations are building AI-first operations,
      including data foundation upgrades, talent models, guardrails for responsible deployment,
      and board-level metrics for tracking value creation from automation.
    category: AI & Future of Work
    featured: false
  - url: 'https://www.youtube.com/watch?v=reVebuAf_Cs'
    title: '[Pending YouTube API]'
    description: '[Will be filled by API]'
    category: Interview
    featured: false
    publishedAt: '2025-05-30T22:00:17Z'
    channelName: Bitcoin Magazine
  - url: 'https://www.youtube.com/watch?v=6aGnTgkw0kA&t=3907s'
    title: Future Tech Conference
    description: Comprehensive overview of future technology trends from industry leaders.
    category: Tech Conferences
    featured: false
    publishedAt: '2025-05-22T22:00:33Z'
    channelName: Peter H. Diamandis
  - url: 'https://www.youtube.com/watch?v=64lXQP6cs5M&t=47s'
    title: Latest AI Developments
    description: >-
      Recent breakthroughs and updates in artificial intelligence technology and
      applications.
    category: AI Technology
    featured: true
    publishedAt: '2025-05-22T21:06:29Z'
    channelName: Dwarkesh Patel
  - url: 'https://www.youtube.com/watch?v=o8NiE3XMPrM'
    title: Digital Transformation Strategies
    description: >-
      Strategic approaches to digital transformation in modern business
      environments.
    category: Digital Strategy
    featured: false
    publishedAt: '2025-05-20T19:05:53Z'
    channelName: Google
  - url: 'https://www.youtube.com/watch?v=ceV3RsG946s&t=48s'
    title: Emerging Technologies Overview
    description: >-
      Comprehensive look at the most promising emerging technologies and their
      potential impact.
    category: Emerging Tech
    featured: false
    publishedAt: '2025-05-20T01:46:11Z'
    channelName: Microsoft
  - url: 'https://www.youtube.com/watch?v=0kS8Fj8wOLE&t=2183s'
    title: The Metaverse and Virtual Reality
    description: >-
      Exploring the possibilities and challenges of virtual worlds and immersive
      digital experiences.
    category: VR & Metaverse
    featured: false
    publishedAt: '2025-05-19T13:00:02Z'
    channelName: Limitless FT
  - url: 'https://www.youtube.com/watch?v=TLzna9__DnI'
    title: Innovation and Disruption
    description: >-
      Understanding how innovation creates disruption across industries and
      markets.
    category: Innovation
    featured: false
    publishedAt: '2025-05-19T04:58:22Z'
    channelName: NVIDIA
  - url: 'https://www.youtube.com/watch?v=TnCDM1IdGFE&t=958s'
    title: Technology Innovation Insights
    description: >-
      Expert analysis on emerging technology trends and their business
      implications.
    category: Tech Innovation
    featured: false
    publishedAt: '2025-05-19T03:22:15Z'
    channelName: Wes Roth
  - url: 'https://www.youtube.com/watch?v=ctcMA6chfDY&t=472s'
    title: Business Technology Integration
    description: >-
      How businesses can effectively integrate new technologies into their
      operations.
    category: Business Tech
    featured: false
    publishedAt: '2025-05-12T18:35:45Z'
    channelName: Sequoia Capital
  - url: 'https://www.youtube.com/watch?v=b-Kn7Ft9LLw&t=3399s'
    title: Technology Trends Analysis
    description: Deep dive into current and future technology trends shaping our world.
    category: Tech Analysis
    featured: false
    publishedAt: '2025-05-12T13:00:59Z'
    channelName: Limitless FT
  - url: 'https://youtu.be/qyH3NxFz3Aw?si=iW8qrA8aZBZGvAIA'
    title: 'AI, Automation and the Future of Work'
    description: >-
      Exploring how artificial intelligence and automation are reshaping the
      workplace and what it means for the future of employment.
    category: AI & Future of Work
    featured: true
  - url: 'https://youtu.be/v9JBMnxuPX8?si=iK2IqaUncuuu0XgB'
    title: Web3 and the Decentralized Internet
    description: >-
      Understanding the next evolution of the internet through blockchain
      technology and decentralized applications.
    category: Web3 & Blockchain
    featured: false
  - url: 'https://www.youtube.com/watch?v=jpkQvkiNtsc'
    title: Robotics Revolution in Manufacturing
    description: >-
      How advanced robotics are transforming manufacturing processes and
      creating new possibilities for industry.
    category: Robotics & Manufacturing
    featured: false
  - url: 'https://www.youtube.com/watch?v=GhIJs4zbH0o'
    title: Quantum Computing Breakthroughs
    description: >-
      Latest developments in quantum computing and their potential impact on
      technology and society.
    category: Quantum Computing
    featured: false
---

# YouTube Videos Configuration

This file manages the YouTube videos displayed in the YouTube Channels section of the FutureFast website.

## How to Edit

1. **Add new videos**: Add a new entry under the `videos:` section
2. **Update existing videos**: Modify the title, description, or category
3. **Feature videos**: Set `featured: true` to highlight important videos
4. **Categories**: Use descriptive categories that match your content themes

## Video Properties

- **url**: The full YouTube URL (supports youtu.be and youtube.com formats)
- **title**: Display title for the video card
- **description**: Brief description of the video content
- **category**: Content category for organization
- **featured**: Whether to highlight this video (true/false)

## Notes

- Videos are automatically sorted by publication date (newest first)
- Real video metadata (thumbnails, dates, channel info) is fetched from YouTube API
- If YouTube API is unavailable, fallback data from this file is used
- Changes to this file are automatically reflected on the website 
