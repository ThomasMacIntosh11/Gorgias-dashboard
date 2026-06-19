'use client';

import { useState, useMemo } from 'react';
import { HOURLY_TREND, WEEKLY_TREND, MONTHLY_TREND } from '@/app/lib/data';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type Period = '1D' | '1W' | '1M';

const PERIOD_CONFIG: Record<Period, {
  data: typeof HOURLY_TREND;
  label: string;
  subtitle: string;
  tickEvery: number;
}> = {
  '1D': { data: HOURLY_TREND, label: 'Last 24 Hours', subtitle: 'Hourly median across active merchants', tickEvery: 4 },
  '1W': { data: WEEKLY_TREND,  label: 'Last 7 Days',   subtitle: 'Daily median across active merchants',  tickEvery: 1 },
  '1M': { data: MONTHLY_TREND, label: 'Last 30 Days',  subtitle: 'Daily median across active merchants',  tickEvery: 5 },
};

function linearTrend(data: { aiResolution: number }[]) {
  const n = data.length;
  const sumX = (n * (n - 1)) / 2;
  const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;
  const sumY = data.reduce((s, d) => s + d.aiResolution, 0);
  const sumXY = data.reduce((s, d, i) => s + i * d.aiResolution, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  return data.map((_, i) => parseFloat((slope * i + intercept).toFixed(2)));
}

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border-strong)',
      boxShadow: '0 4px 12px rgba(60,30,15,0.10)',
      borderRadius: 8,
      padding: '10px 14px',
      fontSize: 12,
    }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 6 }}>{label}</div>
      {payload.filter(p => p.name !== 'Trend').map((p) => (
        <div key={p.name} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 3 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: p.color }} />
          <span style={{ color: 'var(--text-secondary)' }}>{p.name}:</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
            {p.name === 'AI Resolution %' ? `${p.value}%` : p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function ResolutionChart() {
  const [period, setPeriod] = useState<Period>('1D');
  const config = PERIOD_CONFIG[period];

  const chartData = useMemo(() => {
    const trend = linearTrend(config.data);
    return config.data.map((d, i) => ({ ...d, trend: trend[i] }));
  }, [period, config.data]);

  const tickEvery = config.tickEvery;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span className="label">AI Resolution Rate — {config.label}</span>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{config.subtitle}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Legend */}
          <div style={{ display: 'flex', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 3, borderRadius: 2, background: '#E86140' }} />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>AI Resolution %</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 3, borderRadius: 2, background: 'var(--text-muted)', opacity: 0.5, borderStyle: 'dashed' }} />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Trend</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 8, borderRadius: 2, background: 'var(--surface-3)' }} />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Ticket Volume</span>
            </div>
          </div>
          {/* Period toggle */}
          <div className="tab-nav" style={{ padding: '3px' }}>
            {(['1D', '1W', '1M'] as Period[]).map(p => (
              <button
                key={p}
                className={`tab-btn${period === p ? ' active' : ''}`}
                onClick={() => setPeriod(p)}
                style={{ padding: '5px 12px', fontSize: 12 }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="0" vertical={false} />
          <XAxis
            dataKey="hour"
            tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
            tickFormatter={(val, i) => i % tickEvery === 0 ? val : ''}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
            axisLine={false}
            tickLine={false}
            domain={[0, 60]}
            tickFormatter={(v) => `${v}%`}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            yAxisId="right"
            dataKey="ticketVolume"
            name="Ticket Volume"
            fill="var(--surface-3)"
            radius={[2, 2, 0, 0]}
            maxBarSize={20}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="aiResolution"
            name="AI Resolution %"
            stroke="#E86140"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4, fill: '#E86140', strokeWidth: 0 }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="trend"
            name="Trend"
            stroke="var(--text-muted)"
            strokeWidth={1.5}
            strokeDasharray="5 4"
            dot={false}
            activeDot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
