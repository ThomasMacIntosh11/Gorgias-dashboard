'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

interface KpiItem {
  type: 'leading' | 'lagging';
  value: string;
  label: string;
  description: string;
  trend: string;
  trendUp: boolean;
}

interface KpiGroup {
  initiative: string;
  subtitle: string;
  kpis: KpiItem[];
}

const GROUPS: KpiGroup[] = [
  {
    initiative: 'Initiative 1',
    subtitle: 'AI-embedded onboarding and automated intent workflows',
    kpis: [
      {
        type: 'leading',
        value: '142',
        label: 'Merchants activating pre-built intents per week',
        description: 'Tracked from launch',
        trend: '+20% vs last week',
        trendUp: true,
      },
      {
        type: 'lagging',
        value: '34%',
        label: 'AI resolution rate at day 90 for new/non-enabled cohorts',
        description: 'Target: 40%+',
        trend: '+3pp vs prior cohort',
        trendUp: true,
      },
    ],
  },
  {
    initiative: 'Initiative 2',
    subtitle: 'Automating low-value CSM activities',
    kpis: [
      {
        type: 'leading',
        value: '284',
        label: 'CSM merchant conversations per week',
        description: 'Trending upward month over month',
        trend: '+12% MoM',
        trendUp: true,
      },
      {
        type: 'lagging',
        value: '+7',
        label: 'Net positive funnel stage migrations this month',
        description: 'Within 90 days of launch',
        trend: '+3 vs prior month',
        trendUp: true,
      },
    ],
  },
  {
    initiative: 'Initiative 3',
    subtitle: '12-week rescue sprint for threshold merchants',
    kpis: [
      {
        type: 'leading',
        value: '71%',
        label: 'Sprint merchants completing savings model review in 6 weeks',
        description: 'Target: 80%+',
        trend: '+8pp this sprint',
        trendUp: true,
      },
      {
        type: 'lagging',
        value: '48%',
        label: 'Merchants crossing 40% AI resolution threshold within 12 weeks',
        description: 'Target: 50%',
        trend: '+6pp this sprint',
        trendUp: true,
      },
    ],
  },
];

function TypeBadge({ type }: { type: 'leading' | 'lagging' }) {
  const isLeading = type === 'leading';
  return (
    <span style={{
      display: 'inline-block',
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      padding: '2px 7px',
      borderRadius: 4,
      background: isLeading ? 'var(--accent-dim)' : 'var(--surface-3)',
      color: isLeading ? 'var(--accent-mid)' : 'var(--text-muted)',
    }}>
      {type}
    </span>
  );
}

export default function InitiativeKpis() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
      {GROUPS.map(group => (
        <div key={group.initiative} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{group.initiative}</div>
            <div style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--text-secondary)' }}>{group.subtitle}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {group.kpis.map((kpi, i) => (
              <div key={i} style={{
                paddingTop: i > 0 ? 14 : 0,
                borderTop: i > 0 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ marginBottom: 6 }}>
                  <TypeBadge type={kpi.type} />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
                    {kpi.value}
                  </span>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 3,
                    fontSize: 11, fontWeight: 500,
                    color: kpi.trendUp ? 'var(--green)' : 'var(--red)',
                    background: kpi.trendUp ? 'var(--green-dim)' : 'var(--red-dim)',
                    borderRadius: 999, padding: '2px 7px',
                  }}>
                    {kpi.trendUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {kpi.trend}
                  </span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 2 }}>
                  {kpi.label}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {kpi.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
