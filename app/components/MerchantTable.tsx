'use client';

import { useState } from 'react';
import { MERCHANTS, type FunnelStage } from '@/app/lib/data';
import { Search, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const STAGE_LABELS: Record<FunnelStage, string> = {
  not_enabled: 'Not Enabled',
  enabled_not_configured: 'Not Configured',
  low_resolution: 'Low (<10%)',
  moderate: 'Moderate',
  high: 'High (40%+)',
};

const STAGE_CLASSES: Record<FunnelStage, string> = {
  not_enabled: 'pill-red',
  enabled_not_configured: 'pill-amber',
  low_resolution: 'pill-amber',
  moderate: 'pill-blue',
  high: 'pill-green',
};

function ResolutionBar({ value }: { value: number }) {
  const color = value >= 40 ? '#22c55e' : value >= 10 ? '#E86140' : value > 0 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div className="progress-bar" style={{ width: 60 }}>
        <div className="progress-fill" style={{ width: `${Math.min(value, 100)}%`, background: color }} />
      </div>
      <span style={{ fontSize: 12, color, fontWeight: 600 }}>{value}%</span>
    </div>
  );
}

export default function MerchantTable() {
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<FunnelStage | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'aiResolutionRate' | 'renewalDate'>('aiResolutionRate');
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 8;

  const filtered = MERCHANTS
    .filter(m => {
      const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.csmOwner.toLowerCase().includes(search.toLowerCase());
      const matchStage = stageFilter === 'all' || m.stage === stageFilter;
      return matchSearch && matchStage;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'aiResolutionRate') return b.aiResolutionRate - a.aiResolutionRate;
      if (sortBy === 'renewalDate') return a.renewalDate.localeCompare(b.renewalDate);
      return 0;
    });

  const pages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const renewalDaysLeft = (date: string) => {
    const diff = Math.round((new Date(date).getTime() - Date.now()) / 86400000);
    return diff;
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <span className="label">Account View — 24h Activity</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={13} color="var(--text-muted)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0); }}
              placeholder="Search merchants or CSM..."
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '7px 12px 7px 30px',
                color: 'var(--text-primary)',
                fontSize: 13,
                width: 220,
                outline: 'none',
              }}
            />
          </div>

          {/* Stage filter */}
          <select
            value={stageFilter}
            onChange={e => { setStageFilter(e.target.value as FunnelStage | 'all'); setPage(0); }}
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '7px 12px',
              color: 'var(--text-secondary)',
              fontSize: 13,
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Stages</option>
            <option value="not_enabled">Not Enabled</option>
            <option value="enabled_not_configured">Not Configured</option>
            <option value="low_resolution">Low Resolution</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'name' | 'aiResolutionRate' | 'renewalDate')}
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '7px 12px',
              color: 'var(--text-secondary)',
              fontSize: 13,
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="aiResolutionRate">Sort: AI Rate</option>
            <option value="name">Sort: Name</option>
            <option value="renewalDate">Sort: Renewal</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Merchant</th>
              <th>Stage</th>
              <th>AI Resolution</th>
              <th>Intents</th>
              <th>Tickets (24h)</th>
              <th>24h Trend</th>
              <th>CSM</th>
              <th>Renewal</th>
              <th>CSAT</th>
            </tr>
          </thead>
          <tbody>
            {paged.map(m => {
              const days = renewalDaysLeft(m.renewalDate);
              const renewalColor = days < 30 ? 'var(--red)' : days < 90 ? 'var(--amber)' : 'var(--text-secondary)';
              return (
                <tr key={m.id}>
                  <td>
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: 13 }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.id}</div>
                  </td>
                  <td>
                    <span className={`pill ${STAGE_CLASSES[m.stage]}`} style={{ fontSize: 11 }}>
                      {STAGE_LABELS[m.stage]}
                    </span>
                  </td>
                  <td><ResolutionBar value={m.aiResolutionRate} /></td>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{m.intentsConfigured}</td>
                  <td>
                    <span style={{ color: 'var(--text-primary)' }}>{m.ticketsLast24h}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: 11 }}> ({m.aiTicketsLast24h} AI)</span>
                  </td>
                  <td>
                    {m.trend === 'up' && <TrendingUp size={14} color="var(--green)" />}
                    {m.trend === 'down' && <TrendingDown size={14} color="var(--red)" />}
                    {m.trend === 'flat' && <Minus size={14} color="var(--text-muted)" />}
                  </td>
                  <td>{m.csmOwner}</td>
                  <td style={{ color: renewalColor, fontWeight: days < 60 ? 600 : 400 }}>
                    {days}d
                  </td>
                  <td>
                    <span style={{ color: m.csat >= 4.5 ? 'var(--green)' : m.csat >= 3.5 ? 'var(--amber)' : 'var(--red)', fontWeight: 500 }}>
                      {m.csat}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{filtered.length} merchants</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              style={{
                width: 28, height: 28,
                borderRadius: 6,
                border: '1px solid var(--border)',
                background: i === page ? 'var(--accent-dim)' : 'transparent',
                color: i === page ? 'var(--accent-mid)' : 'var(--text-muted)',
                fontSize: 12, cursor: 'pointer',
                fontWeight: i === page ? 600 : 400,
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
