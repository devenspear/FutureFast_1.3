import { getPublishedCards } from "../lib/notion";

// Define a type for the mapped card structure
interface NotionCard {
  category: string;
  title: string;
  year: string;
  type: string;
  summary: string;
  tag: string;
}

const PLACEHOLDER_CARDS: NotionCard[] = [
  {
    category: "Category",
    title: "Sample Resource Title",
    year: "2025",
    type: "Article",
    summary: "Short summary of the resource goes here. This is a placeholder for dynamic content.",
    tag: "Original"
  },
  {
    category: "Quantum Computing",
    title: "Qubits Unleashed: The Quantum Leap",
    year: "2025",
    type: "Deep Dive",
    summary: "Explore how quantum supremacy is reshaping cryptography, simulation, and the fabric of the digital world.",
    tag: "Insight"
  },
  {
    category: "Synthetic Biology",
    title: "Programmable Life: DNA as Code",
    year: "2025",
    type: "Report",
    summary: "Discover how engineered organisms are revolutionizing medicine, food, and sustainability.",
    tag: "Trend"
  },
  {
    category: "Spatial Computing",
    title: "The Metaverse Gets Physical",
    year: "2025",
    type: "Feature",
    summary: "Spatial computing merges AR, VR, and IoT to create immersive, persistent digital-physical realities.",
    tag: "Hot"
  },
  {
    category: "Neurotech",
    title: "Brain-Computer Interfaces: Mind Over Machine",
    year: "2025",
    type: "Explainer",
    summary: "Interfaces that read and write brain signals are unlocking new frontiers in cognition and communication.",
    tag: "Breakthrough"
  },
  {
    category: "Decentralized Energy",
    title: "Gridless: The Rise of Peer-to-Peer Power",
    year: "2025",
    type: "Analysis",
    summary: "How blockchain and microgrids are disrupting centralized utilities and empowering energy prosumers.",
    tag: "Future"
  }
];

export default async function NotionLibraryGrid() {
  let cards: NotionCard[] = [];
  let error = null;
  try {
    cards = await getPublishedCards();
  } catch (err: any) {
    error = err?.message || String(err);
    console.error("Notion fetch error:", err);
  }

  // Map Notion cards to the visual card structure
  const mappedCards: NotionCard[] = !error && cards.length
    ? cards.map((card: any): NotionCard => ({
        category: card.properties.Type?.select?.name || "Category",
        title: card.properties.Name?.title?.[0]?.plain_text || "Untitled",
        year: "2025", // Optionally map from Notion if you add a year property
        type: card.properties.Type?.select?.name || "Type",
        summary: card.properties.Summary?.rich_text?.[0]?.plain_text || "",
        tag: card.properties.Tags?.multi_select?.[0]?.name || "Tag"
      }))
    : PLACEHOLDER_CARDS;

  return (
    <section className="w-full max-w-6xl mx-auto py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-white">Curated Library</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mappedCards.map((card, idx) => (
          <div key={idx} className="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800">
            <span className="block text-xs font-bold text-purple-300 mb-2">{card.category}</span>
            <h3 className="text-xl font-bold mb-2 text-white">{card.title}</h3>
            <div className="text-gray-400 text-sm mb-1">{card.year} • {card.type}</div>
            <p className="text-gray-300 mb-4">{card.summary}</p>
            <span className="inline-block bg-purple-800 text-purple-100 px-3 py-1 rounded text-xs font-semibold">{card.tag}</span>
          </div>
        ))}
      </div>
      {error && (
        <div className="text-red-500 bg-gray-900 p-4 rounded-lg mt-6 text-center">
          <strong>Error loading Notion content:</strong> {error}
        </div>
      )}
    </section>
  );
}
