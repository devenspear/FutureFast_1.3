import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ | FutureFast: AI, Web3 & Technology Insights",
  description: "Frequently asked questions about FutureFast's executive insights on AI, Web3, robotics, and exponential technology disruption.",
  openGraph: {
    title: "FAQ | FutureFast",
    description: "Frequently asked questions about FutureFast's executive insights on AI, Web3, robotics, and exponential technology disruption.",
    url: "https://futurefast.ai/faq",
    type: "website",
    siteName: "FutureFast",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ | FutureFast",
    description: "Frequently asked questions about FutureFast's executive insights on AI, Web3, robotics, and exponential technology disruption.",
  },
};

const faqData = [
  {
    question: "What is FutureFast?",
    answer: "FutureFast provides executive-level insights on AI, Web3, robotics, and exponential technology disruption. We curate the world's most important tech stories and provide real signals without hype, specifically for decision makers navigating the future of business."
  },
  {
    question: "How does FutureFast help executives?",
    answer: "We track emerging technologies like OpenAI's ChatGPT, Claude AI, blockchain innovations, and industrial robotics to provide C-suite executives with actionable insights. Our content helps leaders understand how exponential technology disruption will impact their industries and business strategies."
  },
  {
    question: "What topics does FutureFast cover?",
    answer: "We focus on Artificial Intelligence (including OpenAI, Google Bard, Claude), Web3 technologies (blockchain, DeFi, NFTs), robotics and automation, future of work trends, digital transformation strategies, and emerging technologies that create exponential business disruption."
  },
  {
    question: "Who should read FutureFast content?",
    answer: "Our content is designed for C-suite executives, technology leaders, business strategists, and decision makers who need to understand how emerging technologies like AI, Web3, and robotics will impact their organizations and industries."
  },
  {
    question: "How is FutureFast different from other tech news sources?",
    answer: "Unlike typical tech news, we provide executive-first analysis focused on business impact rather than technical details. We curate insights from credible sources like McKinsey, CB Insights, and leading research organizations, presenting information that's radically clear and actionable for business leaders."
  },
  {
    question: "What is exponential technology disruption?",
    answer: "Exponential technology disruption occurs when technological advancement accelerates beyond linear expectations, fundamentally changing entire industries. Examples include how AI like ChatGPT transformed content creation, how blockchain enabled DeFi, and how robotics is revolutionizing manufacturing."
  },
  {
    question: "How can I stay updated with FutureFast insights?",
    answer: "Subscribe to our Disruption Weekly newsletter on LinkedIn for regular insights on AI developments, Web3 innovations, robotics breakthroughs, and strategic guidance for navigating exponential technology change."
  }
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-black text-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="font-orbitron text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#99731A] via-[#D4AF37] to-[#99731A] bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-cyan-100 max-w-3xl mx-auto">
            Everything you need to know about FutureFast&apos;s executive insights on AI, Web3, robotics, and exponential technology disruption.
          </p>
        </header>

        <section className="space-y-8" itemScope itemType="https://schema.org/FAQPage">
          {faqData.map((faq, index) => (
            <article 
              key={index}
              className="bg-gray-900/80 rounded-xl p-8 border border-gray-800"
              itemScope 
              itemProp="mainEntity" 
              itemType="https://schema.org/Question"
            >
              <h2 
                className="text-2xl font-bold text-cyan-400 mb-4 font-orbitron"
                itemProp="name"
              >
                {faq.question}
              </h2>
              <div 
                itemScope 
                itemProp="acceptedAnswer" 
                itemType="https://schema.org/Answer"
              >
                <p 
                  className="text-lg text-gray-200 leading-relaxed"
                  itemProp="text"
                >
                  {faq.answer}
                </p>
              </div>
            </article>
          ))}
        </section>

        <footer className="text-center mt-16">
          <div className="bg-gray-900/80 rounded-xl p-8 border border-gray-800">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4 font-orbitron">
              Have More Questions?
            </h2>
            <p className="text-lg text-gray-200 mb-6">
              Ready to navigate the future of exponential technology disruption?
            </p>
            <Link 
              href="/"
              className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Explore FutureFast Insights
            </Link>
          </div>
        </footer>
      </div>

      {/* FAQ JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqData.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />
    </main>
  );
}