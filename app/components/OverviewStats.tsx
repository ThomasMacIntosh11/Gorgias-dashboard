'use client';

import { KPI, MERCHANTS } from '@/app/lib/data';

export default function OverviewStats() {
  const atRisk = MERCHANTS.filter(m =>
    m.stage === 'not_enabled' || m.stage === 'enabled_not_configured' || m.aiResolutionRate < 10
  ).length;

  const renewingSoon = MERCHANTS.filter(m => {
    const days = Math.round((new Date(m.renewalDate).getTime() - Date.now()) / 86400000);
    return days < 60;
  }).length;

  const stats = [
    { label: 'Total Merchants', value: KPI.totalMerchants.toLocaleString(), sub: 'Active base' },
    { label: 'AI Enabled', value: `${KPI.aiEnabledPct}%`, sub: `~${Math.round(17000 * KPI.aiEnabledPct / 100).toLocaleString()} merchants` },
    { label: 'Actively Using AI', value: `${KPI.activelyUsingPct}%`, sub: '>10% resolution rate' },
    { label: 'At-Risk Accounts', value: atRisk, sub: 'Sample — low/no adoption' },
    { label: 'Renewing in 60d', value: renewingSoon, sub: 'Sample — need attention' },
    { label: 'NRR Trend', value: `${KPI.nrrTrend > 0 ? '+' : ''}${KPI.nrrTrend}%`, sub: 'Last 2 quarters' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
      {stats.map(s => (
        <div key={s.label} className="card-sm" style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: 22,
            fontWeight: 700,
            color: s.label === 'NRR Trend' ? 'var(--amber)' : s.label === 'At-Risk Accounts' ? 'var(--red)' : 'var(--text-primary)',
            lineHeight: 1.2,
            marginBottom: 4,
          }}>
            {s.value}
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>{s.label}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.sub}</div>
        </div>
      ))}
    </div>
  );
}
