const Anthropic = require("@anthropic-ai/sdk");

// Initialize the Anthropic client
const client = new Anthropic();

// Sample financial news articles for sentiment analysis
const financialNews = [
  {
    id: 1,
    title: "Tech stocks surge as AI investments accelerate",
    content:
      "Major technology companies reported strong quarterly earnings driven by increased investments in artificial intelligence and cloud computing. Investors are optimistic about future growth prospects.",
  },
  {
    id: 2,
    title: "Market volatility increases amid inflation concerns",
    content:
      "Financial markets experienced significant fluctuations today as new inflation data raised concerns about interest rate hikes. Analysts warn of potential economic slowdown ahead.",
  },
  {
    id: 3,
    title: "Green energy companies report record revenues",
    content:
      "Renewable energy sector demonstrates exceptional performance with multiple companies achieving record revenue milestones. Government incentives continue to drive sector growth and investor confidence.",
  },
  {
    id: 4,
    title: "Banking sector faces regulatory scrutiny",
    content:
      "Financial regulators announced new investigations into banking practices. Compliance costs are expected to increase, potentially impacting profitability.",
  },
  {
    id: 5,
    title: "Consumer spending remains resilient despite headwinds",
    content:
      "Latest retail data shows consumer spending continues to hold steady despite economic uncertainties. This positive trend suggests consumer confidence remains relatively intact.",
  },
];

// Multi-turn conversation to analyze sentiments with context
class SentimentAnalyzer {
  constructor() {
    this.conversationHistory = [];
  }

  async addMessage(role, content) {
    this.conversationHistory.push({
      role: role,
      content: content,
    });
  }

  async analyzeWithContext() {
    try {
      const response = await client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 8096,
        system: `You are an expert financial sentiment analyst. Analyze news articles and provide:
1. Sentiment score (0-100, where 0 is very negative and 100 is very positive)
2. Sentiment category (Very Negative, Negative, Neutral, Positive, Very Positive)
3. Key risk factors or opportunities identified
4. Impact on different market sectors
5. Investment implications

Be concise but thorough in your analysis.`,
        messages: this.conversationHistory,
      });

      return response.content[0].text;
    } catch (error) {
      console.error("Error calling API:", error);
      throw error;
    }
  }
}

async function runSentimentAnalysis() {
  console.log("🚀 Financial News Sentiment Analyzer Bot");
  console.log("=========================================\n");

  const analyzer = new SentimentAnalyzer();

  // Initial request to analyze all news articles
  const newsContent = financialNews
    .map(
      (article, index) =>
        `Article ${index + 1}: "${article.title}"\nContent: ${article.content}`
    )
    .join("\n\n");

  const initialPrompt = `Please analyze the sentiment of the following financial news articles and provide a comprehensive sentiment analysis for each:\n\n${newsContent}`;

  console.log("📰 Analyzing financial news articles...\n");
  await analyzer.addMessage("user", initialPrompt);

  let response = await analyzer.analyzeWithContext();
  console.log("Initial Analysis:\n");
  console.log(response);
  console.log("\n" + "=".repeat(50) + "\n");

  // Second turn: Ask for summary and investment recommendations
  const followUpPrompt =
    "Based on your analysis, what would be the overall market sentiment? Provide a summary and investment recommendations.";

  console.log("📊 Requesting market sentiment summary and recommendations...\n");
  await analyzer.addMessage("assistant", response);
  await analyzer.addMessage("user", followUpPrompt);

  response = await analyzer.analyzeWithContext();
  console.log("Market Sentiment Summary & Recommendations:\n");
  console.log(response);
  console.log("\n" + "=".repeat(50) + "\n");

  // Third turn: Ask for sector-specific analysis
  const sectorPrompt =
    "Which sectors show the most positive sentiment and which show the most negative? Provide specific recommendations for each sector.";

  console.log("🏢 Analyzing sector-specific sentiment...\n");
  await analyzer.addMessage("assistant", response);
  await analyzer.addMessage("user", sectorPrompt);

  response = await analyzer.analyzeWithContext();
  console.log("Sector-Specific Analysis:\n");
  console.log(response);
  console.log("\n" + "=".repeat(50) + "\n");

  // Fourth turn: Risk assessment
  const riskPrompt =
    "What are the top 3 risks identified across all the news? How might they impact different investor profiles?";

  console.log("⚠️  Assessing risks and investor impact...\n");
  await analyzer.addMessage("assistant", response);
  await analyzer.addMessage("user", riskPrompt);

  response = await analyzer.analyzeWithContext();
  console.log("Risk Assessment & Investor Impact:\n");
  console.log(response);
  console.log("\n" + "=".repeat(50) + "\n");

  console.log("✅ Sentiment analysis complete!");
}

// Run the sentiment analyzer
runSentimentAnalysis().catch(console.error);