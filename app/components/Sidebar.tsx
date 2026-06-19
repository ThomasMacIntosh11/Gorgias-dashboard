'use client';

import { BarChart2, Zap, Brain } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: BarChart2 },
  { id: 'ai', label: 'AI Performance', icon: Brain },
  { id: 'product', label: 'CX Signals', icon: Zap },
];

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <div style={{
      width: 220,
      flexShrink: 0,
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: 'var(--accent-mid)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={15} color="#fff" fill="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Gorgias CX</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>AI Adoption Dashboard</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 10px', flex: 1 }}>
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '4px 10px 8px' }}>
            Views
          </div>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 10px',
                  borderRadius: 8,
                  border: 'none',
                  background: isActive ? 'var(--accent-dim)' : 'transparent',
                  color: isActive ? 'var(--accent-mid)' : 'var(--text-secondary)',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  textAlign: 'left',
                  marginBottom: 2,
                  transition: 'all 0.15s',
                }}
              >
                <Icon size={15} />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <div className="live-dot" />
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Live — refreshes every 60s</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          {new Date().toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </div>
    </div>
  );
}
