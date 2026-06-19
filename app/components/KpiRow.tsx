'use client';

import { KPI } from '@/app/lib/data';
import { TrendingUp, TrendingDown, Users, Zap, Target, Activity } from 'lucide-react';

function KpiCard({
  label,
  value,
  unit,
  target,
  delta,
  deltaLabel,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  unit: string;
  target?: number;
  delta?: number;
  deltaLabel?: string;
  icon: React.ElementType;
  color: string;
}) {
  const progress = target ? Math.min((value / target) * 100, 100) : null;
  const isPositive = delta !== undefined && delta >= 0;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span className="label">{label}</span>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: `${color}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Icon size={16} color={color} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
          {value}
        </span>
        <span style={{ fontSize: 16, color: 'var(--text-secondary)' }}>{unit}</span>
      </div>

      {progress !== null && target && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Progress to target</span>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Target: {target}{unit}</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%`, background: color }}
            />
          </div>
        </div>
      )}

      {delta !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {isPositive
            ? <TrendingUp size={13} color="var(--green)" />
            : <TrendingDown size={13} color="var(--red)" />}
          <span style={{ fontSize: 12, color: isPositive ? 'var(--green)' : 'var(--red)', fontWeight: 500 }}>
            {isPositive ? '+' : ''}{delta}{unit} {deltaLabel}
          </span>
        </div>
      )}
    </div>
  );
}

export default function KpiRow() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
      <KpiCard
        label="High-Adoption Merchants"
        value={KPI.highAdoptionPct}
        unit="%"
        target={KPI.highAdoptionTarget}
        delta={KPI.highAdoptionDelta24h}
        deltaLabel="in 24h"
        icon={Target}
        color="#E86140"
      />
      <KpiCard
        label="Onboarding Completion"
        value={KPI.onboardingCompletionRate}
        unit="%"
        target={KPI.onboardingTarget}
        delta={KPI.onboardingDelta24h}
        deltaLabel="in 24h"
        icon={Users}
        color="#22c55e"
      />
      <KpiCard
        label="Moderate→High Conversion"
        value={KPI.moderateToHighConversionRate}
        unit="%"
        target={KPI.moderateToHighTarget}
        delta={+3}
        deltaLabel="in 24h"
        icon={TrendingUp}
        color="#C0391C"
      />
      <KpiCard
        label="Median AI Resolution Rate"
        value={KPI.aiResolutionMedian}
        unit="%"
        delta={+0.8}
        deltaLabel="in 24h"
        icon={Zap}
        color="#f59e0b"
      />
    </div>
  );
}
