'use client';

import { INTENT_PERFORMANCE } from '@/app/lib/data';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

function RateBar({ value }: { value: number }) {
  const color = value >= 50 ? 'var(--green)' : value >= 25 ? 'var(--amber)' : 'var(--red)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 5, background: 'var(--surface-3)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 99 }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color, minWidth: 32, textAlign: 'right' }}>
        {value}%
      </span>
    </div>
  );
}

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'flat' }) {
  if (trend === 'up') return <TrendingUp size={13} color="var(--green)" />;
  if (trend === 'down') return <TrendingDown size={13} color="var(--red)" />;
  return <Minus size={13} color="var(--text-muted)" />;
}

export default function IntentPerformance() {
  const sorted = [...INTENT_PERFORMANCE].sort((a, b) => b.volume - a.volume);

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <span className="label">Intent Performance</span>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
          AI resolution rate by configured intent
        </p>
      </div>

      {/* Header row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 72px 140px 36px',
        gap: 12,
        padding: '0 2px',
      }}>
        {['Intent', 'Volume', 'AI Resolution Rate', ''].map(h => (
          <span key={h} style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            {h}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {sorted.map(intent => (
          <div
            key={intent.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 72px 140px 36px',
              gap: 12,
              alignItems: 'center',
              padding: '8px 8px',
              borderRadius: 7,
              background: 'var(--surface-2)',
            }}
          >
            <span style={{ fontSize: 13, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {intent.intentName}
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
              {intent.volume.toLocaleString()}
            </span>
            <RateBar value={intent.aiResolutionRate} />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <TrendIcon trend={intent.trend} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
