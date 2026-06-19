'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/');
      router.refresh();
    } else {
      setError('Incorrect password.');
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
    }}>
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '36px 32px',
        width: '100%',
        maxWidth: 360,
      }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            Gorgias Dashboard
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Enter your password to continue.
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onInput={e => setPassword((e.target as HTMLInputElement).value)}
            autoFocus
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${error ? 'var(--red)' : 'var(--border-strong)'}`,
              borderRadius: 8,
              fontSize: 14,
              background: 'var(--surface)',
              color: 'var(--text-primary)',
              outline: 'none',
            }}
          />
          {error && (
            <span style={{ fontSize: 12, color: 'var(--red)' }}>{error}</span>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            style={{
              padding: '10px 16px',
              background: loading || !password ? 'var(--surface-3)' : 'var(--accent)',
              color: loading || !password ? 'var(--text-muted)' : '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: loading || !password ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
