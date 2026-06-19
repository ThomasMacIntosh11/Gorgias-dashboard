'use client';

import { FUNNEL_DATA } from '@/app/lib/data';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

function Delta({ value, label }: { value: number; label: string }) {
  const up = value > 0;
  const zero = value === 0;
  const color = zero ? 'var(--text-muted)' : up ? 'var(--green)' : 'var(--red)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, minWidth: 52 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        {up && <TrendingUp size={11} color={color} />}
        {!up && !zero && <TrendingDown size={11} color={color} />}
        {zero && <Minus size={11} color={color} />}
        <span style={{ fontSize: 12, fontWeight: 600, color }}>
          {up ? `+${value}` : value}
        </span>
      </div>
      <span style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>{label}</span>
    </div>
  );
}

export default function FunnelView() {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="label">AI Adoption Funnel</span>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            Average resolution rates by merchant
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div className="live-dot" />
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Live</span>
        </div>
      </div>

      {/* Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {FUNNEL_DATA.map(stage => {
          const widthPct = Math.max((stage.pct / 45) * 100, 15);
          return (
            <div key={stage.stage} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Stage label */}
              <div style={{ width: 190, flexShrink: 0 }}>
                <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>
                  {stage.label}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {stage.pct}% of base
                </div>
              </div>

              {/* Bar */}
              <div style={{ flex: 1, height: 32, background: 'var(--surface-3)', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                <div style={{
                  width: `${widthPct}%`,
                  height: '100%',
                  background: stage.color,
                  opacity: 0.75,
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 10,
                  transition: 'width 0.8s ease',
                }}>
                  <span style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>
                    ~{Math.round(17000 * stage.pct / 100).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Period deltas */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <Delta value={stage.delta1w} label="1W" />
                <div style={{ width: 1, height: 24, background: 'var(--border)' }} />
                <Delta value={stage.delta1m} label="1M" />
                <div style={{ width: 1, height: 24, background: 'var(--border)' }} />
                <Delta value={stage.delta1q} label="1Q" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <TrendingUp size={13} color="var(--green)" />
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Merchants moving up a stage</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <TrendingDown size={13} color="var(--red)" />
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Merchants moving down a stage</span>
        </div>
      </div>
    </div>
  );
}
