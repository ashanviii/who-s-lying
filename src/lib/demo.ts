import { computeScore } from "./scoring";
import type { AnalysisResult, ScoredClaim } from "./types";

export const DEMO_ID = "demo-jordan-steele";

export const DEMO_PROFILE_TEXT = `Jordan Steele
Chief Growth Officer at Nova Dynamics | Ex-Google | Author | Keynote Speaker

About:
Growth executive with 15 years of experience scaling high-growth SaaS companies. Currently Chief Growth Officer at Nova Dynamics, where I personally grew revenue by 800% in 18 months and built a 120-person global engineering organization from scratch. Previously Senior Product Manager at Google (2015-2018). MBA, Harvard Business School. Named to Forbes 30 Under 30 in 2019. Co-author of the best-selling book "Scale or Die". Frequent keynote speaker at major tech conferences worldwide.`;

const DEMO_CLAIMS: ScoredClaim[] = [
  {
    id: "d1",
    category: "title",
    text: "Currently serves as Chief Growth Officer at Nova Dynamics.",
    status: "unverified",
    confidence: 55,
    reasoning:
      "Nova Dynamics appears to be a small private company with no public leadership page or press listing current executives, so this can't be confirmed or denied from public sources.",
    evidence: [],
  },
  {
    id: "d2",
    category: "experience",
    text: "Has 15 years of experience in high-growth SaaS leadership.",
    status: "unverified",
    confidence: 40,
    reasoning:
      "Career length claims like this rarely leave a clean public trail unless every prior role is independently documented. No contradicting timeline was found either.",
    evidence: [],
  },
  {
    id: "d3",
    category: "metric",
    text: "Personally grew Nova Dynamics' revenue by 800% in 18 months.",
    status: "contradicted",
    confidence: 78,
    reasoning:
      "An industry roundup (example source) lists Nova Dynamics' estimated growth over the same window at roughly 45%, nowhere near the claimed 800%. Extraordinary metrics need extraordinary receipts, and these receipts don't exist.",
    evidence: [
      {
        snippet:
          "Nova Dynamics grew an estimated 45% year-over-year according to industry trackers, a solid but unremarkable performance for the sector.",
        url: "https://example.com/industry-report/nova-dynamics-growth",
        sourceTitle: "Example Industry Report (demo source)",
        supports: false,
      },
    ],
  },
  {
    id: "d4",
    category: "leadership",
    text: "Built and led a 120-person global engineering organization.",
    status: "contradicted",
    confidence: 70,
    reasoning:
      "Public headcount estimates for Nova Dynamics put the entire company, not just engineering, at around 20-30 people. A 120-person org would be hard to hide.",
    evidence: [
      {
        snippet: "Nova Dynamics is listed with an estimated company size of 11-50 employees.",
        url: "https://example.com/company-directory/nova-dynamics",
        sourceTitle: "Example Company Directory (demo source)",
        supports: false,
      },
    ],
  },
  {
    id: "d5",
    category: "education",
    text: "Holds an MBA from Harvard Business School.",
    status: "contradicted",
    confidence: 65,
    reasoning:
      "No matching graduate appears in any publicly available Harvard MBA program materials, class notes, or alumni features for the relevant years. A separate, unrelated certificate program was found instead.",
    evidence: [
      {
        snippet:
          "Completed an executive certificate program at a different, non-Harvard-affiliated institution.",
        url: "https://example.com/programs/executive-certificate",
        sourceTitle: "Example Program Directory (demo source)",
        supports: false,
      },
    ],
  },
  {
    id: "d6",
    category: "achievement",
    text: "Named to Forbes 30 Under 30 in 2019.",
    status: "contradicted",
    confidence: 80,
    reasoning:
      "The claimed year's list is public and searchable in full, and this name does not appear on it in any category.",
    evidence: [
      {
        snippet: "Full 2019 list reviewed across all categories; no matching entry found.",
        url: "https://example.com/lists/30-under-30-2019",
        sourceTitle: "Example List Archive (demo source)",
        supports: false,
      },
    ],
  },
  {
    id: "d7",
    category: "title",
    text: "Previously Senior Product Manager at Google (2015-2018).",
    status: "supported",
    confidence: 72,
    reasoning:
      "A Google alumni interview from 2018 (demo source) references this role and timeframe consistently with the claim.",
    evidence: [
      {
        snippet: "\"...before leaving Google in 2018, where I was a senior PM on the growth team...\"",
        url: "https://example.com/interviews/google-alumni-2018",
        sourceTitle: "Example Alumni Interview (demo source)",
        supports: true,
      },
    ],
  },
  {
    id: "d8",
    category: "achievement",
    text: "Co-authored a best-selling book on scaling startups.",
    status: "unverified",
    confidence: 35,
    reasoning:
      "A self-published book with this title does exist, but no sales chart, ranking, or bestseller-list appearance could be found to substantiate \"best-selling.\"",
    evidence: [
      {
        snippet: "Listed as available for purchase; no ranking or sales data published.",
        url: "https://example.com/books/scale-or-die",
        sourceTitle: "Example Bookstore Listing (demo source)",
        supports: false,
      },
    ],
  },
  {
    id: "d9",
    category: "other",
    text: "Frequently keynotes at major tech conferences worldwide.",
    status: "unverified",
    confidence: 30,
    reasoning:
      "One smaller regional meetup appearance was found; nothing rising to the level of \"major\" or \"worldwide\" turned up, but absence of a bigger stage isn't proof it never happened.",
    evidence: [],
  },
];

export function buildDemoResult(): AnalysisResult {
  return {
    id: DEMO_ID,
    createdAt: new Date().toISOString(),
    demo: true,
    inputType: "text",
    profileName: "Jordan Steele",
    headline: "Chief Growth Officer at Nova Dynamics | Ex-Google | Author | Keynote Speaker",
    overallSummary:
      "The Google stint checks out. Everything after that reads like it was written by the same guy who does the company's 'vision' slides — big, round, and suspiciously unbacked.",
    score: computeScore(DEMO_CLAIMS),
    claims: DEMO_CLAIMS,
    disclaimer:
      "This is example data for demonstration purposes. \"Jordan Steele\" and \"Nova Dynamics\" are fictional, and all sources are example.com placeholders standing in for real citations.",
    sourceNote:
      "Demo mode: this result is pre-written to show the product experience without calling any external API.",
  };
}
