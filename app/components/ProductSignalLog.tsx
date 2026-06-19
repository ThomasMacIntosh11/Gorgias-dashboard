'use client';

import { useState, useEffect } from 'react';
import { CX_SIGNALS, type CXSignal } from '@/app/lib/data';
import { AlertTriangle, Clock, Sparkles } from 'lucide-react';

const TRIAGE_CONFIG = {
  pending: { label: 'Pending', cls: 'pill-amber' },
  in_sprint: { label: 'In Sprint', cls: 'pill-blue' },
  backlog: { label: 'Backlog', cls: 'pill-muted' },
  resolved: { label: 'Resolved', cls: 'pill-green' },
};

function SignalCard({ signal, index }: { signal: CXSignal; index: number }) {
  const [aiRec, setAiRec] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issueType: signal.issueType,
          frequency: signal.frequency,
          merchantSegment: signal.merchantSegment,
          daysOpen: signal.daysOpen,
          triageStatus: signal.triageStatus,
          recommendedAction: signal.recommendedAction,
        }),
      })
        .then(r => r.json())
        .then(d => setAiRec(d.recommendation))
        .catch(() => setAiRec(null))
        .finally(() => setLoading(false));
    }, index * 300);
    return () => clearTimeout(timer);
  }, [signal.id]);

  const config = TRIAGE_CONFIG[signal.triageStatus];
  const isAging = signal.daysOpen > 7 && signal.triageStatus === 'pending';

  return (
    <div style={{
      background: 'var(--surface-2)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '14px 16px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16,
      alignItems: 'start',
    }}>
      {/* Left: signal info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
            {isAging && <AlertTriangle size={13} color="var(--red)" style={{ flexShrink: 0, marginTop: 1 }} />}
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.4 }}>
              {signal.issueType}
            </span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {signal.merchantSegment}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div>
            <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
              {signal.frequency}
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>tickets</span>
          </div>
          <span className={`pill ${config.cls}`} style={{ fontSize: 11 }}>
            {config.label}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Clock size={11} color={isAging ? 'var(--red)' : 'var(--text-muted)'} />
          <span style={{ fontSize: 11, color: isAging ? 'var(--red)' : 'var(--text-muted)' }}>
            Open {signal.daysOpen} day{signal.daysOpen !== 1 ? 's' : ''}
            {isAging ? ' — needs triage' : ''}
          </span>
        </div>
      </div>

      {/* Right: AI recommendation */}
      <div style={{
        background: 'var(--accent-dim)',
        border: '1px solid var(--accent-mid)',
        borderRadius: 8,
        padding: '10px 12px',
        fontSize: 12,
        lineHeight: 1.5,
        height: '100%',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
          <Sparkles size={12} color="var(--accent-mid)" />
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent-mid)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            AI Recommended Next Step
          </span>
        </div>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div className="shimmer" style={{ height: 10, borderRadius: 4, width: '90%' }} />
            <div className="shimmer" style={{ height: 10, borderRadius: 4, width: '70%' }} />
          </div>
        ) : aiRec ? (
          <span style={{ color: 'var(--text-primary)' }}>{aiRec}</span>
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>Recommendation unavailable.</span>
        )}
      </div>
    </div>
  );
}

export default function ProductSignalLog() {
  const sortedSignals = [...CX_SIGNALS].sort((a, b) => b.frequency - a.frequency);

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="label">CX Signals</span>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            Patterns surfaced from CX tickets, ready to pass to Product
          </p>
        </div>
        <span className="pill pill-amber" style={{ fontSize: 11 }}>
          {sortedSignals.filter(s => s.triageStatus === 'pending').length} pending triage
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sortedSignals.map((signal, i) => (
          <SignalCard key={signal.id} signal={signal} index={i} />
        ))}
      </div>
    </div>
  );
}
