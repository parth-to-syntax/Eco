import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const DebugPanel = () => {
  const { debug } = useAuth();
  if (!debug) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 0, right: 0, width: 360,
      maxHeight: '50vh', overflow: 'auto', fontSize: 12,
      fontFamily: 'monospace', background: '#111', color: '#eee',
      padding: '8px', border: '1px solid #333', zIndex: 9999
    }}>
      <strong>Auth Debug</strong>
      <div>lastAction: {debug.lastAction || '—'}</div>
      <div>lastError: {debug.lastError || '—'}</div>
      <div style={{wordBreak:'break-all'}}>token: {debug.token ? debug.token.slice(0,32)+'...' : '—'}</div>
      <hr style={{margin:'6px 0'}} />
      <strong>Recent Requests</strong>
      {(debug.requestLog || []).slice(-10).reverse().map((r,i) => (
        <div key={i} style={{marginBottom:4}}>
          <div>[{r.type}] {r.method || r.status} {r.url}</div>
        </div>
      ))}
    </div>
  );
};

export default DebugPanel;
