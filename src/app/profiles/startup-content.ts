/**
 * Illustrative content for the BBA startup profile redesign.
 * This is presentation/demo content, not verified company intelligence.
 * Replace values with sourced company information before publishing.
 */
export type StartupPerson = {
  name: string;
  role: string;
  bio?: string;
  initials?: string;
};

export type StartupProduct = {
  name: string;
  category: string;
  description: string;
  image?: string;
  url?: string;
};

export type StartupMilestone = {
  year: string;
  title: string;
  description: string;
};

export type StartupContent = {
  tagline: string;
  verified: boolean;
  logo?: string;
  website?: string;
  industry: string;
  businessModel: string;
  founded: string;
  stage: string;
  teamSize: string;
  markets: string[];
  overview: string;
  problem: string;
  solution: string;
  products: StartupProduct[];
  founders: StartupPerson[];
  funding: { total: string; latestRound: string; note: string };
  milestones: StartupMilestone[];
  investors: string[];
  partners: string[];
  related: string[];
  tags: string[];
};

const demoProductImage = 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&q=85';

export const STARTUP_CONTENT: Record<string, StartupContent> = {
  paystack: {
    tagline: 'The infrastructure layer for modern African commerce.',
    verified: false,
    website: 'https://paystack.com',
    industry: 'Financial technology',
    businessModel: 'B2B · Payments infrastructure',
    founded: '2015',
    stage: 'Growth stage',
    teamSize: '200–500',
    markets: ['Nigeria', 'Ghana', 'South Africa', 'Kenya'],
    overview: 'A technology company building the tools businesses need to accept payments, manage transactions and participate in the digital economy. This sample profile demonstrates how BBA can explain a company beyond a one-line directory description.',
    problem: 'Businesses operating across African markets often face fragmented payment methods, complex integrations and limited visibility across their transactions.',
    solution: 'A unified payments platform that gives businesses tools to accept and manage payments across digital channels.',
    products: [
      { name: 'Paystack Payments', category: 'Payments infrastructure', description: 'A sample product feature describing the core payment experience, from checkout to transaction management.', image: demoProductImage, url: 'https://paystack.com' },
      { name: 'Business Dashboard', category: 'Operations', description: 'A central workspace for viewing transactions, managing payment activity and understanding business performance.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=85' },
    ],
    founders: [
      { name: 'Leadership profile', role: 'Founding team', initials: 'FT', bio: 'Founder and leadership information can be introduced here when the relevant profiles are available.' },
      { name: 'Executive team', role: 'Company leadership', initials: 'EX', bio: 'A short biography and professional links make this section useful beyond a list of names.' },
    ],
    funding: { total: 'Illustrative', latestRound: 'Funding history', note: 'Demo content only. Replace with sourced funding rounds and investor attribution.' },
    milestones: [
      { year: '2015', title: 'Company founded', description: 'The company begins building its product and establishing its market presence.' },
      { year: '2018', title: 'Market expansion', description: 'An illustrative expansion milestone showing how geographic growth can be represented.' },
      { year: '2022', title: 'Product evolution', description: 'A product and platform milestone that gives visitors a sense of company progression.' },
    ],
    investors: ['Investor profile', 'Institutional backer'],
    partners: ['Technology partner', 'Ecosystem partner'],
    related: ['Flutterwave', 'Yoco', 'Chipper Cash'],
    tags: ['Fintech', 'Payments', 'B2B', 'Infrastructure'],
  },
  wasoko: {
    tagline: 'Reimagining how essential goods move through local commerce.',
    verified: false,
    website: 'https://wasoko.com',
    industry: 'Commerce & supply chain',
    businessModel: 'B2B · Digital commerce',
    founded: '2016',
    stage: 'Growth stage',
    teamSize: '201–500',
    markets: ['Kenya', 'Tanzania', 'Uganda'],
    overview: 'A sample company profile for a digital commerce business serving retailers and the wider distribution ecosystem. The page connects the company proposition to its products, markets and growth story.',
    problem: 'Independent retailers can face fragmented supply chains, inconsistent stock availability and time-consuming procurement processes.',
    solution: 'A digital ordering and distribution experience designed to make sourcing everyday goods more convenient for retailers.',
    products: [{ name: 'Retailer ordering platform', category: 'Commerce platform', description: 'A product showcase slot for the retailer-facing ordering experience.', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=85' }],
    founders: [{ name: 'Founding team', role: 'Leadership', initials: 'FT', bio: 'Founder biographies and professional profiles can be added as verified information becomes available.' }],
    funding: { total: 'Illustrative', latestRound: 'Funding history', note: 'Demo content only. Add confirmed round details and source links.' },
    milestones: [
      { year: '2016', title: 'Company founded', description: 'An illustrative starting point for the company timeline.' },
      { year: '2020', title: 'Distribution expansion', description: 'A sample milestone illustrating growth into additional markets.' },
      { year: '2024', title: 'Platform development', description: 'A sample product milestone.' },
    ],
    investors: ['Venture capital partner', 'Growth investor'],
    partners: ['Distribution network', 'Retail ecosystem'],
    related: ['Twiga Foods', 'MAX', 'M-KOPA'],
    tags: ['Commerce', 'Retail', 'Supply chain', 'B2B'],
  },
  flutterwave: {
    tagline: 'Payment technology for businesses with a global outlook.',
    verified: false,
    website: 'https://flutterwave.com',
    industry: 'Financial technology',
    businessModel: 'B2B · Payments infrastructure',
    founded: '2016',
    stage: 'Growth stage',
    teamSize: '201–500',
    markets: ['Nigeria', 'Ghana', 'Kenya', 'South Africa'],
    overview: 'An illustrative profile for a payments technology company. Use this layout to communicate the company proposition, product ecosystem, market presence and key developments in one cohesive destination.',
    problem: 'Businesses need dependable ways to collect payments from customers across different markets and payment preferences.',
    solution: 'A payments technology layer that helps businesses accept payments and manage digital commerce activity.',
    products: [{ name: 'Checkout', category: 'Payments', description: 'A dedicated product card for the company’s checkout and payment acceptance experience.', image: demoProductImage }],
    founders: [{ name: 'Founding team', role: 'Leadership', initials: 'FT', bio: 'Founder and leadership details are represented as placeholders in this design preview.' }],
    funding: { total: 'Illustrative', latestRound: 'Funding history', note: 'Demo content only. Populate with sourced funding information.' },
    milestones: [
      { year: '2016', title: 'Company founded', description: 'An illustrative company timeline entry.' },
      { year: '2020', title: 'New market presence', description: 'A sample market expansion milestone.' },
      { year: '2023', title: 'Product ecosystem growth', description: 'A sample product development milestone.' },
    ],
    investors: ['Institutional investor', 'Venture partner'],
    partners: ['Payments network', 'Technology partner'],
    related: ['Paystack', 'Chipper Cash', 'Yoco'],
    tags: ['Fintech', 'Payments', 'Commerce', 'Infrastructure'],
  },
};
