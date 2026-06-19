'use client';

import { CSM_REPS } from '@/app/lib/data';

export default function CsmPanel() {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <span className="label">CSM Performance — 24h</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {CSM_REPS.map(csm => {
          const proactiveRatio = Math.round((csm.proactiveEngagements24h / csm.accountCount) * 100);
          return (
            <div key={csm.name} style={{
              background: 'var(--surface-2)',
              borderRadius: 10,
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              border: '1px solid var(--border)',
            }}>
              {/* Avatar */}
              <div style={{
                width: 36, height: 36, borderRadius: 9,
                background: 'var(--accent-dim)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: 'var(--accent-mid)',
                flexShrink: 0,
              }}>
                {csm.name.split(' ').map(n => n[0]).join('')}
              </div>

              {/* Name + accounts */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{csm.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{csm.accountCount} accounts</div>
              </div>

              {/* Proactive engagements */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {csm.proactiveEngagements24h}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>outreaches</div>
              </div>

              {/* At risk */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: csm.accountsAtRisk > 8 ? 'var(--red)' : 'var(--amber)' }}>
                  {csm.accountsAtRisk}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>at risk</div>
              </div>

              {/* Proactive ratio */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <span className={`pill ${proactiveRatio > 10 ? 'pill-green' : 'pill-amber'}`} style={{ fontSize: 11 }}>
                  {proactiveRatio}% proactive
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{
        background: 'var(--surface-2)',
        borderRadius: 8,
        padding: '10px 12px',
        fontSize: 12,
        color: 'var(--text-muted)',
      }}>
        Target: flip CSM time from 20% proactive / 80% reactive → 50/50 via automation
      </div>
    </div>
  );
}
