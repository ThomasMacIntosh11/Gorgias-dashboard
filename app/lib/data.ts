export type FunnelStage = 'not_enabled' | 'enabled_not_configured' | 'low_resolution' | 'moderate' | 'high';

export interface Merchant {
  id: string;
  name: string;
  stage: FunnelStage;
  aiResolutionRate: number;
  intentsConfigured: number;
  csmOwner: string;
  lastCsmTouch: string; // ISO date
  renewalDate: string;  // ISO date
  csat: number;
  ticketsLast24h: number;
  aiTicketsLast24h: number;
  trend: 'up' | 'down' | 'flat';
  onboardingComplete: boolean;
  mrr: number;
}

export interface CsmRep {
  name: string;
  accountCount: number;
  proactiveEngagements24h: number;
  accountsAtRisk: number;
}

export interface ProductSignal {
  id: string;
  issueType: string;
  frequency: number;
  merchantSegment: string;
  recommendedAction: string;
  triageStatus: 'pending' | 'in_sprint' | 'backlog' | 'resolved';
  daysOpen: number;
}

export interface FunnelSnapshot {
  stage: FunnelStage;
  label: string;
  count: number;
  pct: number;
  delta24h: number;
  delta1w: number;
  delta1m: number;
  delta1q: number;
  color: string;
}

function randomBetween(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomFloat(min: number, max: number, decimals = 1) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
}

const MERCHANT_NAMES = [
  'Maple & Co', 'Dune Collective', 'Haus of Bloom', 'Carver Supply', 'Shoreline Goods',
  'Verdant Market', 'Ollie & June', 'Peak Provisions', 'Solstice Co', 'Crest Supply',
  'Ember & Oak', 'Tide & Trunk', 'Fold Studio', 'Grounded Supply', 'Brim Collective',
  'Alto Goods', 'Haven Market', 'Drift & Co', 'Kindred Supply', 'Basin & Co',
  'Clover & Co', 'Summit Store', 'Pines Collective', 'Ridge Supply', 'Stone & Fern',
  'Harbor Co', 'Glow Market', 'Slate Supply', 'Birch & Bloom', 'Compass Co',
];

const CSM_NAMES = ['Sarah K.', 'Marcus T.', 'Priya N.', 'Jordan L.', 'Casey M.'];

function generateMerchants(): Merchant[] {
  return MERCHANT_NAMES.map((name, i) => {
    const stageRoll = Math.random();
    let stage: FunnelStage;
    let aiRate: number;
    let intents: number;

    if (stageRoll < 0.45) {
      stage = 'not_enabled'; aiRate = 0; intents = 0;
    } else if (stageRoll < 0.60) {
      stage = 'enabled_not_configured'; aiRate = randomBetween(0, 5); intents = randomBetween(0, 2);
    } else if (stageRoll < 0.80) {
      stage = 'low_resolution'; aiRate = randomBetween(2, 10); intents = randomBetween(2, 8);
    } else if (stageRoll < 0.92) {
      stage = 'moderate'; aiRate = randomBetween(10, 39); intents = randomBetween(10, 25);
    } else {
      stage = 'high'; aiRate = randomBetween(40, 72); intents = randomBetween(30, 55);
    }

    const tickets = randomBetween(5, 80);
    const aiTickets = Math.round(tickets * (aiRate / 100));
    const trendRoll = Math.random();

    return {
      id: `M${String(i + 1).padStart(3, '0')}`,
      name,
      stage,
      aiResolutionRate: aiRate,
      intentsConfigured: intents,
      csmOwner: CSM_NAMES[i % CSM_NAMES.length],
      lastCsmTouch: daysAgo(randomBetween(0, 30)),
      renewalDate: daysFromNow(randomBetween(10, 365)),
      csat: randomFloat(2.8, 4.9),
      ticketsLast24h: tickets,
      aiTicketsLast24h: aiTickets,
      trend: trendRoll < 0.4 ? 'up' : trendRoll < 0.7 ? 'flat' : 'down',
      onboardingComplete: stage !== 'not_enabled' && stage !== 'enabled_not_configured',
      mrr: randomBetween(200, 5000),
    };
  });
}

export const MERCHANTS: Merchant[] = generateMerchants();

export const FUNNEL_DATA: FunnelSnapshot[] = [
  {
    stage: 'not_enabled',
    label: 'Not Enabled',
    count: MERCHANTS.filter(m => m.stage === 'not_enabled').length,
    pct: 45,
    delta24h: -2,
    delta1w: -18,
    delta1m: -64,
    delta1q: -210,
    color: '#ef4444',
  },
  {
    stage: 'enabled_not_configured',
    label: 'Enabled, Not Configured',
    count: MERCHANTS.filter(m => m.stage === 'enabled_not_configured').length,
    pct: 15,
    delta24h: +1,
    delta1w: +4,
    delta1m: -12,
    delta1q: -38,
    color: '#f97316',
  },
  {
    stage: 'low_resolution',
    label: 'Low Resolution (<10%)',
    count: MERCHANTS.filter(m => m.stage === 'low_resolution').length,
    pct: 20,
    delta24h: 0,
    delta1w: +6,
    delta1m: +19,
    delta1q: +42,
    color: '#eab308',
  },
  {
    stage: 'moderate',
    label: 'Moderate (10–40%)',
    count: MERCHANTS.filter(m => m.stage === 'moderate').length,
    pct: 12,
    delta24h: +3,
    delta1w: +14,
    delta1m: +38,
    delta1q: +95,
    color: '#E86140',
  },
  {
    stage: 'high',
    label: 'High Resolution (40%+)',
    count: MERCHANTS.filter(m => m.stage === 'high').length,
    pct: 8,
    delta24h: +2,
    delta1w: +22,
    delta1m: +67,
    delta1q: +184,
    color: '#22c55e',
  },
];

export const CSM_REPS: CsmRep[] = CSM_NAMES.map(name => ({
  name,
  accountCount: randomBetween(60, 80),
  proactiveEngagements24h: randomBetween(2, 12),
  accountsAtRisk: randomBetween(3, 12),
}));

export const PRODUCT_SIGNALS: ProductSignal[] = [
  {
    id: 'PS001',
    issueType: 'Order tracking intent fails on 3PL integrations',
    frequency: 142,
    merchantSegment: 'Mid-market, Apparel',
    recommendedAction: 'Expand intent to support ShipBob / ShipStation tokens',
    triageStatus: 'in_sprint',
    daysOpen: 4,
  },
  {
    id: 'PS002',
    issueType: 'Refund flow breaks when order >90 days old',
    frequency: 89,
    merchantSegment: 'SMB, All verticals',
    recommendedAction: 'Add conditional logic for aged orders',
    triageStatus: 'pending',
    daysOpen: 9,
  },
  {
    id: 'PS003',
    issueType: 'AI escalates "where is my order" during setup wizard',
    frequency: 67,
    merchantSegment: 'New merchants (<30 days)',
    recommendedAction: 'Pre-seed WISMO intent in onboarding flow',
    triageStatus: 'backlog',
    daysOpen: 14,
  },
  {
    id: 'PS004',
    issueType: 'Discount code intent does not handle stacked discounts',
    frequency: 54,
    merchantSegment: 'SMB, DTC brands',
    recommendedAction: 'Update intent logic for multi-code cart scenarios',
    triageStatus: 'pending',
    daysOpen: 6,
  },
  {
    id: 'PS005',
    issueType: 'Spanish-language tickets dropped by AI, not escalated',
    frequency: 38,
    merchantSegment: 'US merchants with LATAM customers',
    recommendedAction: 'Enable multilingual fallback routing',
    triageStatus: 'pending',
    daysOpen: 11,
  },
];

// 24h resolution rate trend (hourly buckets, last 24h)
export function generate24hTrend() {
  const hours = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const t = new Date(now);
    t.setHours(t.getHours() - i);
    const progress = (23 - i) / 23;
    hours.push({
      hour: t.getHours() === 0 ? '12am' : t.getHours() < 12 ? `${t.getHours()}am` : t.getHours() === 12 ? '12pm' : `${t.getHours() - 12}pm`,
      aiResolution: randomFloat(22 + progress * 4, 28 + progress * 4),
      ticketVolume: randomBetween(180, 420),
    });
  }
  return hours;
}

export function generate7dTrend() {
  const days = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const t = new Date(now);
    t.setDate(t.getDate() - i);
    const progress = (6 - i) / 6;
    days.push({
      hour: dayNames[t.getDay()],
      aiResolution: randomFloat(20 + progress * 6, 26 + progress * 4),
      ticketVolume: randomBetween(2800, 5200),
    });
  }
  return days;
}

export function generate30dTrend() {
  const days = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const t = new Date(now);
    t.setDate(t.getDate() - i);
    const progress = (29 - i) / 29;
    const month = t.toLocaleDateString('en-US', { month: 'short' });
    const day = t.getDate();
    days.push({
      hour: `${month} ${day}`,
      aiResolution: randomFloat(15 + progress * 10, 22 + progress * 8),
      ticketVolume: randomBetween(2400, 6000),
    });
  }
  return days;
}

export const HOURLY_TREND = generate24hTrend();
export const WEEKLY_TREND = generate7dTrend();
export const MONTHLY_TREND = generate30dTrend();

// Headline KPIs
export const KPI = {
  highAdoptionPct: 8.2,
  highAdoptionTarget: 16.0,
  highAdoptionDelta24h: +0.3,
  onboardingCompletionRate: 67,
  onboardingTarget: 85,
  onboardingDelta24h: +2,
  moderateToHighConversionRate: 38,
  moderateToHighTarget: 50,
  aiResolutionMedian: 27,
  totalMerchants: 17000,
  aiEnabledPct: 55,
  activelyUsingPct: 40,
  nrrTrend: -1.2,
};
