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

export interface CXSignal {
  id: string;
  issueType: string;
  frequency: number;
  merchantSegment: string;
  recommendedAction: string;
  triageStatus: 'pending' | 'in_sprint' | 'backlog' | 'resolved';
  daysOpen: number;
}

export interface IntentPerformance {
  id: string;
  intentName: string;
  volume: number;
  aiResolutionRate: number;
  handoffRate: number;
  trend: 'up' | 'down' | 'flat';
}

export interface EscalationReason {
  id: string;
  reason: string;
  description: string;
  count: number;
  pct: number;
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
  'Northfold Co', 'Cinder & Stone', 'Bloom Bureau', 'Westbrook Supply', 'Coastal Thread',
  'Lush Collective', 'Finch & Fox', 'Cedar Provisions', 'Equinox Co', 'Bluff Supply',
  'Flint & Fern', 'Salt & Timber', 'Stitch Studio', 'Rootwork Supply', 'Brace Collective',
  'Mesa Goods', 'Hollow Market', 'Swell & Co', 'Kindred Works', 'Vale & Co',
  'Thistle & Co', 'Ridgeline Store', 'Grove Collective', 'Dusk Supply', 'Chalk & Moss',
  'Inlet Co', 'Luminary Market', 'Quartz Supply', 'Aspen & Bloom', 'True North Co',
];

const CSM_NAMES = ['Emma R.', 'Daniel W.', 'Aisha M.', 'Tyler B.', 'Morgan S.'];

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
    pct: 43,
    delta24h: -1,
    delta1w: -15,
    delta1m: -58,
    delta1q: -193,
    color: '#ef4444',
  },
  {
    stage: 'enabled_not_configured',
    label: 'Enabled, Not Configured',
    count: MERCHANTS.filter(m => m.stage === 'enabled_not_configured').length,
    pct: 18,
    delta24h: +2,
    delta1w: +5,
    delta1m: -9,
    delta1q: -31,
    color: '#f97316',
  },
  {
    stage: 'low_resolution',
    label: 'Low Resolution (<10%)',
    count: MERCHANTS.filter(m => m.stage === 'low_resolution').length,
    pct: 21,
    delta24h: 0,
    delta1w: +8,
    delta1m: +22,
    delta1q: +51,
    color: '#eab308',
  },
  {
    stage: 'moderate',
    label: 'Moderate (10–40%)',
    count: MERCHANTS.filter(m => m.stage === 'moderate').length,
    pct: 13,
    delta24h: +2,
    delta1w: +11,
    delta1m: +34,
    delta1q: +87,
    color: '#E86140',
  },
  {
    stage: 'high',
    label: 'High Resolution (40%+)',
    count: MERCHANTS.filter(m => m.stage === 'high').length,
    pct: 5,
    delta24h: +1,
    delta1w: +17,
    delta1m: +54,
    delta1q: +162,
    color: '#22c55e',
  },
];

export const CSM_REPS: CsmRep[] = CSM_NAMES.map(name => ({
  name,
  accountCount: randomBetween(60, 80),
  proactiveEngagements24h: randomBetween(2, 12),
  accountsAtRisk: randomBetween(3, 12),
}));

export const CX_SIGNALS: CXSignal[] = [
  {
    id: 'CX001',
    issueType: 'Customers contact support to re-send order confirmation emails',
    frequency: 118,
    merchantSegment: 'Mid-market, Home & Lifestyle',
    recommendedAction: 'Add self-serve confirmation email resend option to the order status page',
    triageStatus: 'in_sprint',
    daysOpen: 4,
  },
  {
    id: 'CX002',
    issueType: 'Return portal rejects orders placed as guest — customers stuck',
    frequency: 84,
    merchantSegment: 'SMB, All verticals',
    recommendedAction: 'Allow guest-order returns via email + order number lookup, bypassing account requirement',
    triageStatus: 'pending',
    daysOpen: 11,
  },
  {
    id: 'CX003',
    issueType: 'Store credit not accepted at checkout when combined with a promo code',
    frequency: 69,
    merchantSegment: 'All segments',
    recommendedAction: 'Fix checkout discount stacking logic to allow store credit alongside promo codes',
    triageStatus: 'backlog',
    daysOpen: 21,
  },
  {
    id: 'CX004',
    issueType: 'Subscription pause option not visible — customers cancelling instead',
    frequency: 57,
    merchantSegment: 'Mid-market, Food & Wellness',
    recommendedAction: 'Surface the pause option earlier in the cancellation flow to reduce involuntary churn',
    triageStatus: 'pending',
    daysOpen: 8,
  },
  {
    id: 'CX005',
    issueType: 'Address change requests arriving after cut-off — no self-serve option',
    frequency: 38,
    merchantSegment: 'SMB, DTC brands',
    recommendedAction: 'Build a timed self-serve address edit window in the order confirmation page before fulfilment locks',
    triageStatus: 'pending',
    daysOpen: 6,
  },
];

export const INTENT_PERFORMANCE: IntentPerformance[] = [
  { id: 'INT001', intentName: 'Where is my order (WISMO)', volume: 4821, aiResolutionRate: 61, handoffRate: 14, trend: 'up' },
  { id: 'INT002', intentName: 'Refund request', volume: 3104, aiResolutionRate: 38, handoffRate: 31, trend: 'flat' },
  { id: 'INT003', intentName: 'Order cancellation', volume: 2267, aiResolutionRate: 44, handoffRate: 22, trend: 'up' },
  { id: 'INT004', intentName: 'Exchange / return initiation', volume: 1893, aiResolutionRate: 27, handoffRate: 48, trend: 'down' },
  { id: 'INT005', intentName: 'Discount code help', volume: 1456, aiResolutionRate: 71, handoffRate: 9, trend: 'up' },
  { id: 'INT006', intentName: 'Shipping address change', volume: 987, aiResolutionRate: 19, handoffRate: 61, trend: 'down' },
  { id: 'INT007', intentName: 'Account login / access', volume: 834, aiResolutionRate: 55, handoffRate: 18, trend: 'flat' },
  { id: 'INT008', intentName: 'Product availability', volume: 612, aiResolutionRate: 83, handoffRate: 5, trend: 'up' },
];

export const ESCALATION_REASONS: EscalationReason[] = [
  { id: 'ESC001', reason: 'No matching intent', description: 'Customer query did not match any configured intent — AI passed to human without attempting a response', count: 2814, pct: 34 },
  { id: 'ESC002', reason: 'Low confidence score', description: 'AI matched an intent but confidence was below the threshold, triggering a safe handoff', count: 1976, pct: 24 },
  { id: 'ESC003', reason: 'Policy rule triggered', description: 'A merchant-configured rule (e.g. VIP customer, order value > $500) forced escalation regardless of AI capability', count: 1322, pct: 16 },
  { id: 'ESC004', reason: 'Customer requested human', description: 'Customer explicitly asked to speak with a person mid-conversation', count: 1074, pct: 13 },
  { id: 'ESC005', reason: 'Multi-turn timeout', description: 'Conversation exceeded the max AI turn limit without reaching a resolution', count: 743, pct: 9 },
  { id: 'ESC006', reason: 'Sensitive topic detected', description: 'AI flagged the conversation as emotionally sensitive (complaint, threat, distress) and deferred to a human', count: 331, pct: 4 },
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
  highAdoptionPct: 6.8,
  highAdoptionTarget: 15.0,
  highAdoptionDelta24h: +0.2,
  onboardingCompletionRate: 71,
  onboardingTarget: 88,
  onboardingDelta24h: +1,
  moderateToHighConversionRate: 33,
  moderateToHighTarget: 50,
  aiResolutionMedian: 24,
  totalMerchants: 12400,
  aiEnabledPct: 51,
  activelyUsingPct: 37,
  nrrTrend: -0.8,
};
