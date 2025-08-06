import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technology Glossary | AI, Web3 & Exponential Technology Terms | FutureFast",
  description: "Comprehensive glossary of AI, Web3, robotics, and exponential technology terms for executives. From ChatGPT to blockchain, understand the technologies shaping the future.",
  keywords: "AI glossary, Web3 terms, blockchain definitions, ChatGPT explanation, Claude AI, technology dictionary, executive technology guide",
  openGraph: {
    title: "Technology Glossary | FutureFast",
    description: "Comprehensive glossary of AI, Web3, robotics, and exponential technology terms for executives.",
    url: "https://futurefast.ai/technology-glossary",
    type: "website",
    siteName: "FutureFast",
  },
  twitter: {
    card: "summary_large_image",
    title: "Technology Glossary | FutureFast",
    description: "Comprehensive glossary of AI, Web3, robotics, and exponential technology terms for executives.",
  },
};

const technologyTerms = [
  {
    name: "Artificial Intelligence (AI)",
    definition: "Computer systems that can perform tasks typically requiring human intelligence, such as visual perception, speech recognition, decision-making, and language translation. Examples include ChatGPT, Claude AI, and Google Bard.",
    category: "Artificial Intelligence"
  },
  {
    name: "OpenAI ChatGPT",
    definition: "A conversational AI system developed by OpenAI that can understand and generate human-like text responses. Used by millions of users for content creation, coding assistance, and problem-solving.",
    category: "Artificial Intelligence"
  },
  {
    name: "Claude AI",
    definition: "An AI assistant created by Anthropic, designed to be helpful, harmless, and honest. Known for its ability to process long documents and maintain context in extended conversations.",
    category: "Artificial Intelligence"
  },
  {
    name: "Web3",
    definition: "The next generation of the internet built on blockchain technology, emphasizing decentralization, user ownership of data, and peer-to-peer interactions without intermediaries.",
    category: "Blockchain & Web3"
  },
  {
    name: "Blockchain Technology",
    definition: "A distributed ledger technology that maintains a continuously growing list of records, linked and secured using cryptography. Foundation for cryptocurrencies and decentralized applications.",
    category: "Blockchain & Web3"
  },
  {
    name: "DeFi (Decentralized Finance)",
    definition: "Financial services built on blockchain technology that operate without traditional intermediaries like banks. Includes lending, borrowing, and trading using smart contracts.",
    category: "Blockchain & Web3"
  },
  {
    name: "NFT (Non-Fungible Token)",
    definition: "Unique digital assets stored on a blockchain that represent ownership of digital or physical items. Cannot be replicated or exchanged on a like-for-like basis.",
    category: "Blockchain & Web3"
  },
  {
    name: "Industrial Robotics",
    definition: "Automated machines designed to perform manufacturing tasks with precision, speed, and reliability. Used in assembly lines, welding, painting, and quality control processes.",
    category: "Robotics & Automation"
  },
  {
    name: "Humanoid Robots",
    definition: "Robots designed to resemble and mimic human form and behavior. Examples include Boston Dynamics' Atlas and Tesla's Optimus robot for various service applications.",
    category: "Robotics & Automation"
  },
  {
    name: "Machine Learning",
    definition: "A subset of AI that enables computers to learn and improve from experience without being explicitly programmed. Powers recommendation systems, image recognition, and predictive analytics.",
    category: "Artificial Intelligence"
  },
  {
    name: "Digital Transformation",
    definition: "The integration of digital technology into all areas of business, fundamentally changing how organizations operate and deliver value to customers.",
    category: "Business Technology"
  },
  {
    name: "Exponential Technology",
    definition: "Technologies that improve at an exponential rate, doubling in performance or capability while costs decrease. Examples include AI processing power, gene sequencing, and solar energy efficiency.",
    category: "Future Technology"
  },
  {
    name: "Quantum Computing",
    definition: "Computing technology that uses quantum mechanical phenomena to process information exponentially faster than classical computers for specific problems.",
    category: "Future Technology"
  },
  {
    name: "Internet of Things (IoT)",
    definition: "Network of physical devices embedded with sensors, software, and connectivity to exchange data. Enables smart homes, industrial monitoring, and autonomous vehicles.",
    category: "Connected Technology"
  },
  {
    name: "Autonomous Vehicles",
    definition: "Self-driving cars and trucks that use AI, sensors, and mapping technology to navigate without human intervention. Being developed by Tesla, Waymo, and traditional automakers.",
    category: "Transportation Technology"
  }
];

const categories = Array.from(new Set(technologyTerms.map(term => term.category)));

export default function TechnologyGlossaryPage() {
  return (
    <main className="min-h-screen bg-black text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="font-orbitron text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#99731A] via-[#D4AF37] to-[#99731A] bg-clip-text text-transparent">
            Technology Glossary
          </h1>
          <p className="text-xl text-cyan-100 max-w-4xl mx-auto">
            Essential AI, Web3, and exponential technology terms for executives. From <strong>OpenAI ChatGPT</strong> to <strong>blockchain</strong> to <strong>industrial robotics</strong> - understand the technologies driving business transformation.
          </p>
        </header>

        {categories.map(category => (
          <section key={category} className="mb-12">
            <h2 className="text-3xl font-bold text-cyan-400 mb-8 font-orbitron border-b border-cyan-400/30 pb-4">
              {category}
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              {technologyTerms
                .filter(term => term.category === category)
                .map((term, index) => (
                  <article 
                    key={index}
                    className="bg-gray-900/80 rounded-xl p-6 border border-gray-800 hover:border-cyan-400/50 transition-colors"
                    itemScope 
                    itemType="https://schema.org/DefinedTerm"
                  >
                    <h3 
                      className="text-xl font-bold text-white mb-4 font-orbitron"
                      itemProp="name"
                    >
                      {term.name}
                    </h3>
                    <p 
                      className="text-gray-200 leading-relaxed"
                      itemProp="description"
                    >
                      {term.definition}
                    </p>
                    <div 
                      itemScope 
                      itemProp="inDefinedTermSet" 
                      itemType="https://schema.org/DefinedTermSet"
                    >
                      <meta itemProp="name" content="FutureFast Technology Glossary" />
                    </div>
                  </article>
                ))}
            </div>
          </section>
        ))}

        <footer className="text-center mt-16">
          <div className="bg-gray-900/80 rounded-xl p-8 border border-gray-800">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4 font-orbitron">
              Stay Updated on Technology Trends
            </h2>
            <p className="text-lg text-gray-200 mb-6">
              Get executive insights on the latest AI, Web3, and robotics developments that matter for business strategy.
            </p>
            <a 
              href="/"
              className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Explore FutureFast Insights
            </a>
          </div>
        </footer>
      </div>

      {/* DefinedTermSet JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DefinedTermSet",
            "name": "FutureFast Technology Glossary",
            "description": "Comprehensive glossary of AI, Web3, robotics, and exponential technology terms for executives",
            "url": "https://futurefast.ai/technology-glossary",
            "hasDefinedTerm": technologyTerms.map(term => ({
              "@type": "DefinedTerm",
              "name": term.name,
              "description": term.definition,
              "inDefinedTermSet": {
                "@type": "DefinedTermSet",
                "name": "FutureFast Technology Glossary"
              }
            }))
          })
        }}
      />
    </main>
  );
}