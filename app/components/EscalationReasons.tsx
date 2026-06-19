'use client';

import { useState, useEffect } from 'react';
import { ESCALATION_REASONS, type EscalationReason } from '@/app/lib/data';
import { Sparkles } from 'lucide-react';

function EscalationRow({ row, index }: { row: EscalationReason; index: number }) {
  const [fix, setFix] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetch('/api/fix-escalation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: row.reason,
          description: row.description,
          count: row.count,
          pct: row.pct,
        }),
      })
        .then(r => r.json())
        .then(d => setFix(d.fix))
        .catch(() => setFix(null))
        .finally(() => setLoading(false));
    }, index * 350);
    return () => clearTimeout(timer);
  }, [row.id]);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '220px 80px 1fr',
      gap: 12,
      alignItems: 'start',
      padding: '10px 8px',
      borderRadius: 7,
      background: 'var(--surface-2)',
    }}>
      {/* Reason + description */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 3 }}>
          {row.reason}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>
          {row.description}
        </div>
      </div>

      {/* Volume + % share */}
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
          {row.count.toLocaleString()}
        </div>
        <div style={{ marginTop: 4, height: 4, background: 'var(--surface-3)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ width: `${row.pct}%`, height: '100%', background: 'var(--accent-mid)', borderRadius: 99 }} />
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{row.pct}% of escalations</div>
      </div>

      {/* AI fix */}
      <div style={{
        background: 'var(--accent-dim)',
        border: '1px solid var(--accent-mid)',
        borderRadius: 7,
        padding: '8px 10px',
        fontSize: 12,
        lineHeight: 1.5,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
          <Sparkles size={11} color="var(--accent-mid)" />
          <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--accent-mid)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            AI Recommended Fix
          </span>
        </div>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <div className="shimmer" style={{ height: 9, borderRadius: 4, width: '88%' }} />
            <div className="shimmer" style={{ height: 9, borderRadius: 4, width: '65%' }} />
          </div>
        ) : fix ? (
          <span style={{ color: 'var(--text-primary)' }}>{fix}</span>
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>Recommendation unavailable.</span>
        )}
      </div>
    </div>
  );
}

export default function EscalationReasons() {
  const sorted = [...ESCALATION_REASONS].sort((a, b) => b.count - a.count);
  const total = sorted.reduce((s, r) => s + r.count, 0);

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span className="label">Escalation Reasons</span>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            Why the AI is handing off to human agents
          </p>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
            {total.toLocaleString()}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>total escalations</div>
        </div>
      </div>

      {/* Column headers */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 80px 1fr', gap: 12, padding: '0 8px' }}>
        {['Reason', 'Volume', 'AI Recommended Fix'].map(h => (
          <span key={h} style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            {h}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {sorted.map((row, i) => (
          <EscalationRow key={row.id} row={row} index={i} />
        ))}
      </div>
    </div>
  );
}
