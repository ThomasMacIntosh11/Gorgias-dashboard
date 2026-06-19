'use client';

import { useState } from 'react';
import Sidebar from './components/Sidebar';
import FunnelView from './components/FunnelView';
import InitiativeKpis from './components/InitiativeKpis';
import ResolutionChart from './components/ResolutionChart';
import ProductSignalLog from './components/ProductSignalLog';
import IntentPerformance from './components/IntentPerformance';
import EscalationReasons from './components/EscalationReasons';

export default function Home() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main style={{ flex: 1, overflow: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>
              {activeTab === 'overview' && 'Gorgias AI Adoption Dashboard'}
              {activeTab === 'ai' && 'AI Performance'}
              {activeTab === 'product' && 'CX Signals'}
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Last 24 hours · {new Date().toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="live-dot" />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Auto-refresh</span>
          </div>
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <>
            <InitiativeKpis />
            <ResolutionChart />
            <FunnelView />
          </>
        )}

        {/* AI Performance */}
        {activeTab === 'ai' && (
          <>
            <IntentPerformance />
            <EscalationReasons />
          </>
        )}

        {/* CX Signals */}
        {activeTab === 'product' && (
          <ProductSignalLog />
        )}
      </main>
    </div>
  );
}
