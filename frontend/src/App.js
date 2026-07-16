import React, { useState, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  ShieldCheck, Shield, User, Users, Crown, Lock, Crosshair, TrendingUp, History,
  FolderOpen, Brain, Check, X, AlertTriangle, Zap, CheckCircle2, Loader2, Bot,
  Siren, FileText, Network, MapPin, BarChart3, KeyRound, Building2, ClipboardList,
  Search, LayoutDashboard, Circle, Newspaper, RotateCcw, Hourglass,
} from 'lucide-react';

const API = 'http://localhost:5000/api';

const SEV = {
  CRITICAL: { bg: '#FEF2F2', border: '#FCA5A5', badge: '#DC2626', dot: '#EF4444', text: '#991B1B' },
  ALERT:    { bg: '#FFFBEB', border: '#FCD34D', badge: '#D97706', dot: '#F59E0B', text: '#92400E' },
  WATCH:    { bg: '#FEFCE8', border: '#FDE047', badge: '#CA8A04', dot: '#EAB308', text: '#713F12' },
  NORMAL:   { bg: '#F0FDF4', border: '#86EFAC', badge: '#16A34A', dot: '#22C55E', text: '#14532D' },
};

const ROLES = {
  employee: { label: 'Employee', level: 1, color: '#64748B', bg: '#F8FAFC' },
  ciso:     { label: 'CISO',     level: 3, color: '#7A3A52', bg: '#F5EEF0' },
  md:       { label: 'MD',       level: 4, color: '#1B2A41', bg: '#EEF1F4' },
};

const FONT_UI   = "'Manrope', 'Segoe UI', system-ui, sans-serif";
const FONT_MONO = "'JetBrains Mono', 'SFMono-Regular', Consolas, monospace";
const FONT_SEAL = "'Fraunces', 'Georgia', serif";
const CARD_SHADOW = '0 1px 2px rgba(15,23,42,0.04), 0 1px 8px rgba(15,23,42,0.05)';
const BRASS = '#A9762F';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap');
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes slideIn { from{opacity:0;transform:translateX(10px)} to{opacity:1;transform:translateX(0)} }
  @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} }
  * { box-sizing: border-box; }
  body {
    background-color: #F4F4F1 !important;
    background-image: radial-gradient(#00000008 0.7px, transparent 0.7px);
    background-size: 18px 18px;
    margin: 0; font-family: ${FONT_UI};
  }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
  .card-hover:hover { box-shadow: 0 6px 20px rgba(15,23,42,0.08) !important; transform: translateY(-1px); transition: all 0.2s; }
  .btn-hover:hover { opacity: 0.92; transform: translateY(-1px); transition: all 0.15s; }
  .spin-icon { animation: spin 0.8s linear infinite; }
`;


function AnimCounter({ value, color, size = 22 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i++;
      setN(Math.round((i / 40) * value));
      if (i >= 40) { setN(value); clearInterval(t); }
    }, 20);
    return () => clearInterval(t);
  }, [value]);
  return <span style={{ color, fontSize: size, fontWeight: 800, fontFamily: FONT_MONO }}>{n}</span>;
}


function TypeWriter({ text, speed = 10 }) {
  const [d, setD] = useState('');
  useEffect(() => {
    setD(''); let i = 0;
    const t = setInterval(() => { setD(text.slice(0, ++i)); if (i >= text.length) clearInterval(t); }, speed);
    return () => clearInterval(t);
  }, [text]);
  return <span style={{ fontFamily: FONT_MONO }}>{d}<span style={{ color: '#3D5872', animation: 'pulse 1s infinite' }}>▍</span></span>;
}


function LiveClock() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const i = setInterval(() => setT(new Date()), 1000); return () => clearInterval(i); }, []);
  return (
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', fontFamily: FONT_MONO }}>
        {t.toLocaleTimeString('en-IN', { hour12: false })}
      </div>
      <div style={{ fontSize: 10, color: '#64748B' }}>
        {t.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} IST
      </div>
    </div>
  );
}


function RiskRing({ score, size = 64 }) {
  const sev = score >= 76 ? 'CRITICAL' : score >= 51 ? 'ALERT' : score >= 31 ? 'WATCH' : 'NORMAL';
  const color = SEV[sev].dot;
  const r = size / 2 - 6;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E2E8F0" strokeWidth={5}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease' }}/>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color, fontWeight: 800, fontSize: size * 0.22, lineHeight: 1, fontFamily: FONT_MONO }}>{score}</span>
        <span style={{ color: '#94A3B8', fontSize: size * 0.11 }}>risk</span>
      </div>
    </div>
  );
}


function Sparkline({ data, color }) {
  if (!data || data.length < 2) return null;
  const chartData = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width={80} height={28}>
      <AreaChart data={chartData} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`sg${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3}/>
            <stop offset="100%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#sg${color.replace('#','')})`} dot={false}/>
      </AreaChart>
    </ResponsiveContainer>
  );
}


function LoginScreen({ onLogin }) {
  const [role, setRole] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr]   = useState('');

  const USERS = {
    'ciso123':     { role: 'ciso', name: 'Kavya Menon',   label: 'CISO' },
    'md123':       { role: 'md',   name: 'Rajesh Sharma', label: 'MD' },
    'employee123': { role: 'employee', name: 'SOC Officer', label: 'Employee' },
  };

  const login = () => {
    const user = USERS[pass];
    if (user) { setErr(''); onLogin(user); }
    else { setErr('Invalid credentials'); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0F172A 0%, #1B2A41 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{CSS}</style>
      <div style={{ background: '#fff', borderRadius: 16, padding: 40, width: 380, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: '#1B2A41', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(30,58,95,0.28)', border: '2px solid #A9762F', outline: '1px solid #1B2A41', outlineOffset: 3 }}><ShieldCheck size={28} color="#fff" strokeWidth={1.75}/></div>
          <div style={{ fontFamily: FONT_SEAL, fontWeight: 700, fontSize: 26, color: '#0F172A', letterSpacing: '0.06em' }}>PRAHARI</div>
          <div style={{ color: '#64748B', fontSize: 12, marginTop: 4 }}>Insider Threat Intelligence Platform</div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Select Role</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[['employee', <><User size={12}/> Employee</>],['ciso', <><Shield size={12}/> CISO</>],['md', <><Crown size={12}/> MD</>]].map(([r, label]) => (
              <button key={r} onClick={() => { setRole(r); setPass(r === 'employee' ? 'employee123' : r === 'ciso' ? 'ciso123' : 'md123'); }} style={{
                flex: 1, padding: '8px 4px', borderRadius: 8, border: `2px solid ${role === r ? '#3D5872' : '#E2E8F0'}`,
                background: role === r ? '#EEF1F4' : '#F8FAFC', color: role === r ? '#1B2A41' : '#64748B',
                fontWeight: 600, fontSize: 11, cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              }}>{label}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Password</div>
          <input
            type="password" value={pass}
            onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            placeholder="Enter password..."
            style={{ width: '100%', padding: '10px 12px', border: `1px solid ${err ? '#FCA5A5' : '#E2E8F0'}`, borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: FONT_MONO }}
          />
          {err && <div style={{ color: '#DC2626', fontSize: 11, marginTop: 4 }}>{err}</div>}
        </div>

        <button onClick={login} className="btn-hover" style={{
          width: '100%', padding: 12, borderRadius: 10, border: 'none',
          background: '#1B2A41', color: '#fff',
          fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 14px rgba(30,58,95,0.28)',
        }}>Login to PRAHARI</button>

        <div style={{ marginTop: 20, background: '#F8FAFC', borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', marginBottom: 6 }}>Demo Credentials:</div>
          {[['Employee','employee123'],['CISO','ciso123'],['MD','md123']].map(([r,p]) => (
            <div key={r} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#374151', marginBottom: 3 }}>
              <span>{r}:</span><span style={{ fontFamily: FONT_MONO, color: '#3D5872' }}>{p}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


function EmployeeCard({ emp, selected, onClick, trajectory, currentUser }) {
  const cfg = SEV[emp.severity];
  const trend = trajectory && trajectory.length >= 7 ? trajectory[trajectory.length-1] - trajectory[trajectory.length-7] : 0;
  const canSuspend = currentUser?.role === 'md' || (currentUser?.role === 'ciso' && emp.hierarchy_level === 'EMPLOYEE');
  return (
    <div onClick={() => onClick(emp)} className="card-hover" style={{
      background: selected ? cfg.bg : '#FFFFFF',
      border: `1.5px solid ${selected ? cfg.border : '#E2E8F0'}`,
      borderLeft: `4px solid ${cfg.dot}`,
      borderRadius: 10, padding: '12px 14px', cursor: 'pointer',
      marginBottom: 8, transition: 'all 0.2s',
      boxShadow: selected ? '0 2px 12px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.04)',
      opacity: emp.is_frozen ? 0.75 : 1,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A', marginBottom: 2 }}>{emp.name}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>{emp.role}</div>
          <div style={{ fontSize: 11, color: '#94A3B8' }}>{emp.branch}</div>
          {emp.is_frozen && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
              <span style={{ fontSize: 10, color: '#DC2626', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3 }}><Lock size={10}/> SUSPENDED</span>
              {emp.frozen_by && <span style={{ fontSize: 9, color: '#94A3B8' }}>by {emp.frozen_by}</span>}
            </div>
          )}
        </div>
        <RiskRing score={emp.risk_score} size={56}/>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <span style={{ background: cfg.badge, color: '#fff', borderRadius: 5, fontSize: 9, padding: '2px 7px', fontWeight: 700 }}>{emp.severity}</span>
          {emp.honeypot_accessed && <span style={{ background: '#DC2626', color: '#fff', borderRadius: 5, fontSize: 9, padding: '2px 7px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3 }}><Crosshair size={9}/> TRAP</span>}
          {emp.hierarchy_level && <span style={{ background: '#E0E7FF', color: '#3730A3', borderRadius: 5, fontSize: 9, padding: '2px 7px', fontWeight: 600 }}>{emp.hierarchy_level}</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Sparkline data={trajectory} color={cfg.dot}/>
          {trend > 0 && <span style={{ color: '#EF4444', fontSize: 10, fontWeight: 700 }}>↑{trend}</span>}
          {trend < 0 && <span style={{ color: '#22C55E', fontSize: 10, fontWeight: 700 }}>↓{Math.abs(trend)}</span>}
        </div>
      </div>
      {emp.context_signals?.length > 0 && (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
          {emp.context_signals.map((s, i) => (
            <span key={i} style={{ background: '#FEF9C3', color: '#854D0E', border: '1px solid #FDE047', borderRadius: 4, fontSize: 9, padding: '1px 5px' }}>
              {s.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}


function TrajectoryChart({ data }) {
  if (!data || data.length === 0) return null;
  const last  = data[data.length-1];
  const color = last >= 76 ? '#EF4444' : last >= 51 ? '#F59E0B' : last >= 31 ? '#EAB308' : '#22C55E';
  const chartData = data.map((v, i) => ({ day: `D${i+1}`, score: v }));
  return (
    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'inline-flex', alignItems: 'center', gap: 5 }}><TrendingUp size={12}/> 30-Day Risk Trajectory</span>
        <span style={{ color, fontFamily: FONT_MONO, fontSize: 13, fontWeight: 700 }}>{last}/100</span>
      </div>
      <ResponsiveContainer width="100%" height={90}>
        <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.2}/>
              <stop offset="100%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="day" tick={{ fill: '#9CA3AF', fontSize: 9 }} tickLine={false} axisLine={false} interval={9}/>
          <YAxis domain={[0,100]} tick={{ fill: '#9CA3AF', fontSize: 9 }} tickLine={false} axisLine={false}/>
          <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 11 }} formatter={(v) => [`${v}/100`, 'Risk']}/>
          <Area type="monotone" dataKey="score" stroke={color} strokeWidth={2} fill="url(#tg)" dot={false}/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}


function AttackTimeline({ events }) {
  const [vis, setVis] = useState(0);
  useEffect(() => {
    setVis(0);
    if (!events?.length) return;
    let i = 0;
    const t = setInterval(() => { i++; setVis(i); if (i >= events.length) clearInterval(t); }, 700);
    return () => clearInterval(t);
  }, [events]);
  if (!events?.length) return null;
  const dc = d => d >= 20 ? '#EF4444' : d >= 10 ? '#F59E0B' : d > 0 ? '#EAB308' : '#22C55E';
  return (
    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 5 }}><History size={13}/> Attack Behaviour Timeline</div>
      <div style={{ position: 'relative', paddingLeft: 22 }}>
        <div style={{ position: 'absolute', left: 7, top: 0, bottom: 0, width: 1, background: '#E2E8F0' }}/>
        {events.slice(0, vis).map((e, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10, animation: 'slideIn 0.3s ease' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: dc(e.risk_delta), flexShrink: 0, marginTop: 5, position: 'relative', zIndex: 1 }}/>
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, padding: '8px 12px', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ color: '#3D5872', fontSize: 11, fontFamily: FONT_MONO, fontWeight: 600 }}>{e.time}</span>
                {e.risk_delta > 0 && <span style={{ color: '#EF4444', fontSize: 10, fontWeight: 700 }}>+{e.risk_delta} risk</span>}
              </div>
              <div style={{ color: '#374151', fontSize: 12 }}>{e.action}</div>
              {e.records > 0 && <div style={{ color: '#F59E0B', fontSize: 10, marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}><FolderOpen size={10}/> {e.records.toLocaleString()} records</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


function ScoreBreakdown({ breakdown }) {
  if (!breakdown || !Object.keys(breakdown).length) return null;
  const total = Object.values(breakdown).reduce((a, b) => a+b, 0);
  const max   = Math.max(...Object.values(breakdown));
  return (
    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 5 }}><Brain size={13}/> AI Risk Score Breakdown</div>
      {Object.entries(breakdown).map(([sig, pts], i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ color: '#64748B', fontSize: 12, textTransform: 'capitalize' }}>{sig.replace(/_/g,' ')}</span>
            <span style={{ color: pts >= 30 ? '#EF4444' : pts >= 15 ? '#F59E0B' : '#EAB308', fontWeight: 700, fontSize: 12, fontFamily: FONT_MONO }}>+{pts}</span>
          </div>
          <div style={{ height: 5, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(pts/max)*100}%`, background: pts >= 30 ? '#EF4444' : pts >= 15 ? '#F59E0B' : '#EAB308', borderRadius: 3, transition: 'width 0.8s ease' }}/>
          </div>
        </div>
      ))}
      <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 12, marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>Total Risk Score</span>
        <span style={{ fontWeight: 900, fontSize: 18, color: '#EF4444', fontFamily: FONT_MONO }}>{total}</span>
      </div>
    </div>
  );
}


function ZeroTrust({ score, breakdown }) {
  const color = score >= 70 ? '#22C55E' : score >= 40 ? '#F59E0B' : '#EF4444';
  const label = score >= 70 ? 'HIGH TRUST — Verified' : score >= 40 ? 'MEDIUM TRUST — MFA Required' : 'LOW TRUST — Flagged';
  return (
    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 5 }}><ShieldCheck size={13}/> Zero Trust Confidence Score</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ color, fontSize: 12, fontWeight: 600 }}>{label}</span>
        <span style={{ color, fontWeight: 900, fontSize: 24, fontFamily: FONT_MONO }}>{score}%</span>
      </div>
      <div style={{ height: 8, background: '#E2E8F0', borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
        <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: 4, transition: 'width 1s ease' }}/>
      </div>
      {breakdown && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {Object.entries(breakdown).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, background: v > 0 ? '#F0FDF4' : '#FEF2F2', border: `1px solid ${v>0?'#86EFAC':'#FCA5A5'}`, borderRadius: 6, padding: '5px 8px' }}>
              <span style={{ color: v>0?'#16A34A':'#DC2626', fontSize: 12, display: 'inline-flex' }}>{v>0? <Check size={12}/> : <X size={12}/>}</span>
              <span style={{ color: '#64748B', fontSize: 10 }}>{k.replace(/_/g,' ')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


function TagsPanel({ mitre, compliance }) {
  if (!mitre?.length && !compliance?.length) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {mitre?.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>MITRE ATT&CK</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {mitre.map((t,i) => <span key={i} style={{ background: '#F5EEF0', color: '#7A3A52', border: '1px solid #E3C9D2', borderRadius: 5, fontSize: 10, padding: '3px 8px', fontFamily: FONT_MONO }}>{t}</span>)}
          </div>
        </div>
      )}
      {compliance?.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Compliance</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {compliance.map((t,i) => <span key={i} style={{ background: '#ECFEFF', color: '#0E7490', border: '1px solid #A5F3FC', borderRadius: 5, fontSize: 10, padding: '3px 8px' }}>{t}</span>)}
          </div>
        </div>
      )}
    </div>
  );
}


function FreezeModal({ emp, currentUser, onClose, onFreeze }) {
  const CHECKLIST = [
    'Terminate active session immediately',
    'Rotate all passwords for this employee',
    'Disable VPN and remote access privileges',
    'Notify CISO and HR Manager',
    'Preserve USB and system logs as evidence',
    'File RBI Fraud Report — CSF 2016 Section 4.2',
  ];
  const [checked, setChecked]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);
  const [needsMD, setNeedsMD]   = useState(false);

  const toggle = (i) => {
    setChecked(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  };

  const allChecked = checked.length === CHECKLIST.length;
  const isCISO     = currentUser?.role === 'ciso';
  const isMD       = currentUser?.role === 'md';

  const handleFreeze = async () => {
    if (!allChecked) return;
    setLoading(true);
    try {
      const res  = await fetch(`${API}/freeze/${emp.id}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frozen_by: currentUser?.name || 'SOC', role: currentUser?.role }),
      });
      const data = await res.json();
      if (data.success) {
        if (isCISO) setNeedsMD(true);
        else { setDone(true); onFreeze(emp.id); }
      }
    } catch { alert('Error.'); }
    setLoading(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 520, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ background: isCISO ? '#4A2233' : '#B91C1C', padding: '18px 24px' }}>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: 16, display: 'flex', alignItems: 'center', gap: 7 }}><Lock size={16}/> Freeze Access — SOC Protocol</div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 4 }}>{emp.name} · {emp.role} · Risk: {emp.risk_score}/100</div>
          {isCISO && <div style={{ color: '#E3C9D2', fontSize: 11, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={11}/> CISO action requires MD final approval</div>}
        </div>

        <div style={{ padding: 24 }}>
          {!done && !needsMD ? (
            <>
              <div style={{ fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 16 }}>Complete all checklist items before freezing access:</div>
              {CHECKLIST.map((item, i) => (
                <div key={i} onClick={() => toggle(i)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, border: `1px solid ${checked.includes(i) ? '#86EFAC' : '#E2E8F0'}`, background: checked.includes(i) ? '#F0FDF4' : '#F8FAFC', marginBottom: 8, cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${checked.includes(i) ? '#16A34A' : '#CBD5E1'}`, background: checked.includes(i) ? '#16A34A' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                    {checked.includes(i) && <span style={{ color: '#fff', fontSize: 12, fontWeight: 700, display: 'inline-flex' }}><Check size={12}/></span>}
                  </div>
                  <span style={{ color: checked.includes(i) ? '#15803D' : '#374151', fontSize: 13, fontWeight: checked.includes(i) ? 600 : 400 }}>{item}</span>
                </div>
              ))}

              <div style={{ marginTop: 8, padding: '8px 12px', background: '#F8FAFC', borderRadius: 8, fontSize: 11, color: '#64748B', marginBottom: 16 }}>
                {checked.length}/{CHECKLIST.length} items completed
              </div>

              <button onClick={handleFreeze} disabled={!allChecked || loading} className="btn-hover" style={{
                width: '100%', padding: 13, borderRadius: 10, border: 'none',
                background: allChecked ? (isCISO ? '#4A2233' : '#B91C1C') : '#E2E8F0',
                color: allChecked ? '#fff' : '#94A3B8', fontWeight: 700, fontSize: 14,
                cursor: allChecked ? 'pointer' : 'not-allowed', transition: 'all 0.3s',
                boxShadow: allChecked ? '0 4px 14px rgba(220,38,38,0.25)' : 'none',
              }}>
                {loading ? <><Loader2 size={14} className="spin-icon"/> Processing...</> : !allChecked ? `Check all items to enable freeze (${checked.length}/${CHECKLIST.length})` : isCISO ? <><Lock size={14}/> Freeze Access (Pending MD Approval)</> : <><Lock size={14}/> Freeze Access (MD Final Action)</>}
              </button>
            </>
          ) : needsMD ? (
            <div style={{ textAlign: 'center', padding: 20 }}>
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}><Hourglass size={40} color="#D97706"/></div>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#5C2A3D', marginBottom: 8 }}>CISO Action Recorded</div>
              <div style={{ color: '#64748B', fontSize: 13, marginBottom: 16 }}>All checklist items completed by CISO. Employee session terminated. Waiting for MD final approval to complete suspension.</div>
              <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: 8, padding: 12, marginBottom: 16 }}>
                <div style={{ color: '#D97706', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}><Hourglass size={12}/> Dual Authorization Required</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8, justifyContent: 'center' }}>
                  <span style={{ background: '#16A34A', color: '#fff', borderRadius: 5, fontSize: 10, padding: '3px 8px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3 }}><Check size={10}/> CISO Approved</span>
                  <span style={{ background: '#E2E8F0', color: '#64748B', borderRadius: 5, fontSize: 10, padding: '3px 8px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3 }}><Hourglass size={10}/> MD Pending</span>
                </div>
              </div>
              <div style={{ color: '#374151', fontSize: 12 }}>This action has been logged in the immutable audit trail and will appear in the next RBI report.</div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 20 }}>
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}><CheckCircle2 size={40} color="#16A34A"/></div>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#DC2626', marginBottom: 8 }}>Access Frozen Successfully</div>
              <div style={{ color: '#64748B', fontSize: 13 }}>{emp.name} has been suspended. All access revoked. Audit log updated. RBI report will include this action.</div>
            </div>
          )}
        </div>

        <div style={{ padding: '12px 24px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 8, color: '#64748B', fontWeight: 600, fontSize: 13, padding: '8px 18px', cursor: 'pointer' }}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ── Investigate Panel ──
function InvestigatePanel({ emp, currentUser, onFreezeClick }) {
  const [report, setReport]   = useState('');
  const [loading, setLoading] = useState(false);
  const [aiStep, setAiStep]   = useState('');

  const aiSteps = [
    'Reading access event logs...',
    'Analysing behavioural deviations...',
    'Cross-referencing MITRE ATT&CK...',
    'Evaluating employee context signals...',
    'Generating investigation report...',
  ];

  const investigate = async () => {
    setLoading(true); setReport('');
    for (const s of aiSteps) { setAiStep(s); await new Promise(r => setTimeout(r, 500)); }
    try {
      const res  = await fetch(`${API}/investigate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(emp) });
      const data = await res.json();
      setReport(data.report);
    } catch { setReport('Error connecting to backend.'); }
    setLoading(false); setAiStep('');
  };

  const canFreeze = currentUser?.role === 'md' || (currentUser?.role === 'ciso' && emp?.hierarchy_level === 'EMPLOYEE');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {loading && (
        <div style={{ background: '#F5EEF0', border: '1px solid #E3C9D2', borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7A3A52', animation: 'pulse 1s infinite' }}/>
          <span style={{ color: '#7A3A52', fontSize: 12, fontFamily: FONT_MONO, display: 'inline-flex', alignItems: 'center', gap: 5 }}><Bot size={13}/> {aiStep}</span>
        </div>
      )}

      <button onClick={investigate} disabled={loading} className="btn-hover" style={{
        width: '100%', padding: 12, borderRadius: 10, border: 'none',
        background: loading ? '#EAD9DF' : '#4A2233',
        color: '#fff', fontWeight: 700, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer',
        boxShadow: loading ? 'none' : '0 4px 14px rgba(109,40,217,0.25)',
      }}>
        {loading ? <><Loader2 size={14} className="spin-icon"/> AI Investigating...</> : <><Bot size={14}/> Investigate Incident — LLM Agent</>}
      </button>

      {report && (
        <div style={{ background: '#F5EEF0', border: '1px solid #C4B5FD', borderRadius: 10, padding: 16 }}>
          <div style={{ color: '#5C2A3D', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 5 }}><Bot size={13}/> LLM Investigation Report</div>
          <div style={{ color: '#374151', fontSize: 12, lineHeight: 1.8, whiteSpace: 'pre-wrap', fontFamily: FONT_MONO }}>
            <TypeWriter text={report} speed={8}/>
          </div>
        </div>
      )}

      {canFreeze && !emp.is_frozen && (
        <button onClick={onFreezeClick} className="btn-hover" style={{
          width: '100%', padding: 12, borderRadius: 10, border: 'none',
          background: '#B91C1C',
          color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(220,38,38,0.25)',
        }}>
          <><Lock size={16} style={{verticalAlign:'-3px', marginRight:6}}/>Freeze Access — SOC Protocol ({currentUser?.role?.toUpperCase()})</>
        </button>
      )}

      {emp.is_frozen && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: 16 }}>
          <div style={{ color: '#DC2626', fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><Lock size={14}/> ACCESS FROZEN — EMPLOYEE SUSPENDED</div>
          {emp.frozen_by && <div style={{ color: '#64748B', fontSize: 12, marginTop: 4 }}>Frozen by: {emp.frozen_by} at {emp.frozen_at}</div>}
        </div>
      )}
    </div>
  );
}


function HoneypotPanel({ honeypots }) {
  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: 18, color: '#0F172A', marginBottom: 4 }}>Honeypot Trap Files</div>
      <div style={{ color: '#64748B', fontSize: 13, marginBottom: 16 }}>Decoy sensitive files. Any access = confirmed malicious intent. Zero false positives.</div>
      <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 8, padding: '8px 14px', marginBottom: 20, display: 'inline-block' }}>
        <span style={{ color: '#16A34A', fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}><Check size={12}/> {honeypots.filter(h=>!h.accessed).length}/{honeypots.length} files secure · Zero false positive guarantee</span>
      </div>
      {honeypots.map((h, i) => (
        <div key={i} style={{ background: h.accessed ? '#FEF2F2' : '#F8FAFC', border: `1.5px solid ${h.accessed ? '#FCA5A5' : '#E2E8F0'}`, borderLeft: `4px solid ${h.accessed ? '#EF4444' : '#22C55E'}`, borderRadius: 10, padding: 16, marginBottom: 10, boxShadow: h.accessed ? '0 2px 12px rgba(239,68,68,0.1)' : 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ display: 'inline-flex' }}>{h.accessed ? <Siren size={18} color="#DC2626"/> : <FileText size={18} color="#94A3B8"/>}</span>
                <span style={{ fontWeight: 700, fontSize: 13, color: '#0F172A', fontFamily: FONT_MONO }}>{h.name}</span>
              </div>
              <div style={{ color: '#94A3B8', fontSize: 11, marginBottom: h.accessed ? 10 : 0 }}>{h.path}</div>
              {h.accessed && (
                <>
                  <div style={{ color: '#DC2626', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}><AlertTriangle size={12}/> Accessed by {h.accessed_by} at {h.accessed_at}</div>
                  <div style={{ background: '#F5EEF0', border: '1px solid #E3C9D2', borderRadius: 5, padding: '3px 8px', display: 'inline-block', marginTop: 6 }}>
                    <span style={{ color: '#7A3A52', fontSize: 10, fontFamily: FONT_MONO }}>{h.mitre_tag}</span>
                  </div>
                </>
              )}
            </div>
            <span style={{ background: h.accessed ? '#DC2626' : '#16A34A', color: '#fff', borderRadius: 6, fontSize: 10, padding: '4px 10px', fontWeight: 700, flexShrink: 0 }}>
              {h.accessed ? 'BREACHED' : 'SECURE'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}


function AlertFeed({ employees, currentUser }) {
  const alerts = employees.filter(e => e.severity !== 'NORMAL').sort((a,b) => b.risk_score - a.risk_score);

  
  const cisoAlert = currentUser?.role === 'md' ? {
    id: 'CISO-001', name: 'Kavya Menon (CISO)', role: 'CISO · HQ Mumbai',
    severity: 'WATCH', risk_score: 11, mitre_tags: [], compliance_tags: [],
    note: 'CISO attempted to suppress Alert A-007 at 02:53 — BLOCKED by dual auth',
  } : null;

  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: 18, color: '#0F172A', marginBottom: 4 }}>Live Alert Feed</div>
      <div style={{ color: '#64748B', fontSize: 13, marginBottom: 20 }}>{alerts.length} active alerts{currentUser?.role === 'md' ? ' + CISO activity' : ''}</div>

      {cisoAlert && (
        <div style={{ background: '#FFFBEB', border: '1.5px solid #FCD34D', borderLeft: '4px solid #F59E0B', borderRadius: 10, padding: 16, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#0F172A' }}>{cisoAlert.name}</div>
              <div style={{ color: '#64748B', fontSize: 12 }}>{cisoAlert.role}</div>
            </div>
            <span style={{ background: '#D97706', color: '#fff', borderRadius: 5, fontSize: 10, padding: '3px 8px', fontWeight: 700 }}>CISO ACTIVITY</span>
          </div>
          <div style={{ color: '#92400E', fontSize: 12, background: '#FEF3C7', borderRadius: 6, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 5 }}><AlertTriangle size={12}/> {cisoAlert.note}</div>
        </div>
      )}

      {alerts.map((emp, i) => {
        const cfg = SEV[emp.severity];
        return (
          <div key={i} style={{ background: cfg.bg, border: `1.5px solid ${cfg.border}`, borderLeft: `4px solid ${cfg.dot}`, borderRadius: 10, padding: 16, marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#0F172A' }}>{emp.name}</div>
                <div style={{ color: '#64748B', fontSize: 12 }}>{emp.role} · {emp.branch}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ background: cfg.badge, color: '#fff', borderRadius: 5, fontSize: 10, padding: '3px 8px', fontWeight: 700 }}>{emp.severity}</span>
                <div style={{ color: cfg.dot, fontWeight: 900, fontSize: 22, fontFamily: FONT_MONO, marginTop: 4 }}>{emp.risk_score}</div>
              </div>
            </div>
            {emp.mitre_tags?.length > 0 && <div style={{ color: '#7A3A52', fontSize: 11, fontFamily: FONT_MONO, marginBottom: 4 }}>{emp.mitre_tags[0]}</div>}
            {emp.compliance_tags?.length > 0 && <div style={{ color: '#0E7490', fontSize: 11 }}>{emp.compliance_tags[0]}</div>}
          </div>
        );
      })}
    </div>
  );
}


function AuditLog({ logs }) {
  const [selected, setSelected] = useState(null);
  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: 18, color: '#0F172A', marginBottom: 4 }}>System Audit Log</div>
      <div style={{ color: '#64748B', fontSize: 13, marginBottom: 8 }}>Immutable write-once records — no user, including CISO or MD, can modify or delete.</div>
      <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 8, padding: '8px 14px', marginBottom: 20, display: 'inline-block' }}>
        <span style={{ color: '#16A34A', fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}><Check size={12}/> DPDP Act 2023 Compliant · Write-once tamper-proof · {logs.length} entries · Click any entry for details</span>
      </div>

      {selected && (
        <div style={{ background: '#EEF1F4', border: '1px solid #C9D2DC', borderRadius: 10, padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#1B2A41', display: 'flex', alignItems: 'center', gap: 6 }}><ClipboardList size={15}/> Audit Entry Details</div>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', display: 'flex' }}><X size={16}/></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              ['Timestamp', selected.time],
              ['Action', selected.action],
              ['Performed By', selected.by],
              ['Severity', selected.severity],
              ['Record Type', 'Immutable — Cannot be deleted'],
              ['Compliance', 'DPDP Act 2023 · RBI CSF 2016'],
            ].map(([k, v]) => (
              <div key={k} style={{ background: '#fff', border: '1px solid #C9D2DC', borderRadius: 7, padding: '8px 12px' }}>
                <div style={{ color: '#94A3B8', fontSize: 10, marginBottom: 2 }}>{k}</div>
                <div style={{ color: '#0F172A', fontSize: 12, fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {logs.map((log, i) => (
        <div key={i} onClick={() => setSelected(log)} className="card-hover" style={{
          background: log.severity === 'CRITICAL' ? '#FEF2F2' : log.severity === 'WARNING' ? '#FFFBEB' : '#F8FAFC',
          border: `1px solid ${log.severity === 'CRITICAL' ? '#FCA5A5' : log.severity === 'WARNING' ? '#FCD34D' : '#E2E8F0'}`,
          borderRadius: 8, padding: '10px 14px', display: 'flex', gap: 14, marginBottom: 8,
          cursor: 'pointer', transition: 'all 0.2s',
        }}>
          <span style={{ color: '#3D5872', fontFamily: FONT_MONO, fontSize: 11, flexShrink: 0, fontWeight: 600 }}>{log.time}</span>
          <span style={{ color: log.severity === 'CRITICAL' ? '#DC2626' : log.severity === 'WARNING' ? '#D97706' : '#374151', fontSize: 12, flex: 1 }}>{log.action}</span>
          <span style={{ color: '#94A3B8', fontSize: 10, flexShrink: 0 }}>by: {log.by}</span>
          <span style={{ color: '#CBD5E1', fontSize: 12, flexShrink: 0 }}>›</span>
        </div>
      ))}
    </div>
  );
}


function CollusionPanel({ pairs, employees, onViewEmployee }) {
  const [selected, setSelected] = useState(null);
  if (!pairs?.length) return (
    <div style={{ textAlign: 'center', padding: 60 }}>
      <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}><Network size={48} color="#94A3B8"/></div>
      <div style={{ color: '#64748B', fontSize: 14 }}>No collusion patterns detected</div>
    </div>
  );
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16 }}>
      {/* Left — Cases list */}
      <div>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#374151', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6 }}><Network size={14}/> Collusion Cases ({pairs.length})</div>
        {pairs.map((pair, i) => {
          const empA = employees.find(e => e.id === pair.employee_a);
          const empB = employees.find(e => e.id === pair.employee_b);
          return (
            <div key={i} onClick={() => setSelected(pair)} className="card-hover" style={{
              background: selected === pair ? '#FEF2F2' : '#fff',
              border: `1.5px solid ${selected === pair ? '#FCA5A5' : '#E2E8F0'}`,
              borderLeft: '4px solid #EF4444', borderRadius: 10, padding: 14, marginBottom: 10, cursor: 'pointer',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#EF4444', animation: 'pulse 1.5s infinite' }}/>
                <span style={{ color: '#DC2626', fontWeight: 700, fontSize: 12 }}>{pair.risk_level} RISK</span>
              </div>
              <div style={{ fontWeight: 600, fontSize: 12, color: '#0F172A', marginBottom: 4 }}>{empA?.name} ↔ {empB?.name}</div>
              <div style={{ color: '#64748B', fontSize: 11 }}>{pair.time_window}</div>
            </div>
          );
        })}
      </div>

      {/* Right — Detail */}
      <div>
        {selected ? (() => {
          const empA = employees.find(e => e.id === selected.employee_a);
          const empB = employees.find(e => e.id === selected.employee_b);
          return (
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444', animation: 'pulse 1.5s infinite' }}/>
                <span style={{ color: '#DC2626', fontWeight: 700, fontSize: 14 }}>Collusion Risk: {selected.risk_level}</span>
                <span style={{ background: '#F5EEF0', color: '#7A3A52', border: '1px solid #E3C9D2', borderRadius: 4, fontSize: 9, padding: '2px 7px', fontFamily: FONT_MONO }}>MITRE TA0008 Lateral Movement</span>
              </div>

              {/* Visual */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 20 }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#FEE2E2', border: '2px solid #FCA5A5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}><User size={28} color="#DC2626"/></div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>{empA?.name}</div>
                  <div style={{ color: '#64748B', fontSize: 11, marginBottom: 8 }}>{empA?.role}</div>
                  <RiskRing score={empA?.risk_score || 0} size={52}/>
                  <button onClick={() => onViewEmployee && onViewEmployee(empA)} style={{ marginTop: 8, background: '#EEF1F4', border: '1px solid #C9D2DC', borderRadius: 6, color: '#1B2A41', fontSize: 10, padding: '4px 10px', cursor: 'pointer', fontWeight: 600 }}>View Profile</button>
                </div>
                <div style={{ flex: 1, padding: '0 12px', textAlign: 'center' }}>
                  <div style={{ height: 3, background: 'linear-gradient(90deg, #EF4444, #F97316, #EF4444)', borderRadius: 2, marginBottom: 8, animation: 'pulse 2s infinite' }}/>
                  <div style={{ color: '#DC2626', fontSize: 9, fontWeight: 700, letterSpacing: '0.06em' }}>COORDINATED ACCESS</div>
                  <div style={{ color: '#64748B', fontSize: 10, marginTop: 4 }}>{selected.time_window}</div>
                  <div style={{ height: 3, background: 'linear-gradient(90deg, #EF4444, #F97316, #EF4444)', borderRadius: 2, marginTop: 8, animation: 'pulse 2s infinite' }}/>
                </div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#FEE2E2', border: '2px solid #FCA5A5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}><User size={28} color="#DC2626"/></div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>{empB?.name}</div>
                  <div style={{ color: '#64748B', fontSize: 11, marginBottom: 8 }}>{empB?.role}</div>
                  <RiskRing score={empB?.risk_score || 0} size={52}/>
                  <button onClick={() => onViewEmployee && onViewEmployee(empB)} style={{ marginTop: 8, background: '#EEF1F4', border: '1px solid #C9D2DC', borderRadius: 6, color: '#1B2A41', fontSize: 10, padding: '4px 10px', cursor: 'pointer', fontWeight: 600 }}>View Profile</button>
                </div>
              </div>

              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: 12 }}>
                <div style={{ color: '#374151', fontSize: 12, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 5 }}><MapPin size={12}/> {selected.reason}</div>
                <div style={{ color: '#7A3A52', fontSize: 10, fontFamily: FONT_MONO }}>{selected.mitre_tag}</div>
              </div>
            </div>
          );
        })() : (
          <div style={{ background: '#F8FAFC', border: '2px dashed #E2E8F0', borderRadius: 12, padding: 40, textAlign: 'center' }}>
            <div style={{ marginBottom: 12, opacity: 0.4, display: 'flex', justifyContent: 'center' }}><Network size={40}/></div>
            <div style={{ color: '#64748B', fontSize: 14 }}>Select a collusion case to view details</div>
          </div>
        )}
      </div>
    </div>
  );
}


function CISOPanel({ cisoData, onWhistleblower, currentUser }) {
  const [wbMsg, setWbMsg]       = useState('');
  const [wbSent, setWbSent]     = useState(false);
  const [wbLoading, setWbLoading] = useState(false);
  if (!cisoData) return <div style={{ color: '#64748B', padding: 20 }}>Loading CISO security data...</div>;
  const { ciso_profile, protection_layers, rbi_reports_sent, last_rbi_report, next_rbi_report } = cisoData;

  const submitWB = async () => {
    if (!wbMsg.trim()) return;
    setWbLoading(true);
    try {
      const res  = await fetch(`${API}/whistleblower`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: wbMsg }) });
      const data = await res.json();
      if (data.success) { setWbSent(true); if (onWhistleblower) onWhistleblower(); }
    } catch { alert('Error.'); }
    setWbLoading(false);
  };

  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: 18, color: '#0F172A', marginBottom: 4 }}>CISO Security Intelligence</div>
      <div style={{ color: '#64748B', fontSize: 13, marginBottom: 20 }}>Multi-layer protection against rogue CISO, MD, and board-level fraud</div>

      {/* CISO Profile */}
      <div style={{ background: '#F0FDF4', border: '1.5px solid #86EFAC', borderRadius: 12, padding: 16, marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#14532D', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><Shield size={14}/> CISO is also monitored by PRAHARI</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            ['CISO Name', ciso_profile.name],
            ['Risk Score', `${ciso_profile.risk_score}/100 (${ciso_profile.severity})`],
            ['Alert Destination', 'MD + Board of Directors'],
          ].map(([k, v]) => (
            <div key={k} style={{ background: '#fff', border: '1px solid #86EFAC', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ color: '#94A3B8', fontSize: 10, marginBottom: 3 }}>{k}</div>
              <div style={{ color: '#0F172A', fontWeight: 700, fontSize: 12 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 5 Layers */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 12 }}>5 Protection Layers Against Rogue CISO</div>
        {protection_layers.map((layer) => (
          <div key={layer.id} style={{ display: 'flex', gap: 14, marginBottom: 12, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EEF1F4', border: '2px solid #3D5872', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#1B2A41', fontSize: 14, flexShrink: 0 }}>{layer.id}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A', marginBottom: 4 }}>{layer.title}</div>
              <div style={{ color: '#64748B', fontSize: 12, lineHeight: 1.5 }}>{layer.description}</div>
            </div>
            <span style={{ background: '#F0FDF4', color: '#16A34A', border: '1px solid #86EFAC', borderRadius: 5, fontSize: 9, padding: '3px 8px', fontWeight: 700, flexShrink: 0, alignSelf: 'flex-start' }}>ACTIVE</span>
          </div>
        ))}
      </div>

      {/* RBI Auto Reports */}
      <div style={{ background: '#EEF1F4', border: '1px solid #C9D2DC', borderRadius: 12, padding: 16, marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#1B2A41', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><BarChart3 size={14}/> Automated RBI Reports</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
          {[
            ['Reports Sent', rbi_reports_sent],
            ['Last Report', last_rbi_report],
            ['Next Report', next_rbi_report],
          ].map(([k, v]) => (
            <div key={k} style={{ background: '#fff', border: '1px solid #C9D2DC', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ color: '#94A3B8', fontSize: 10 }}>{k}</div>
              <div style={{ color: '#1B2A41', fontWeight: 700, fontSize: 12, fontFamily: FONT_MONO }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ color: '#1B2A41', fontSize: 11, fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 5 }}><Check size={12}/> Auto-submitted every 6 days — no CISO or MD approval required. Suppressions included in report.</div>
      </div>

      {/* Whistleblower */}
      {currentUser?.role !== 'md' && (
        <div style={{ background: '#FEF2F2', border: '1.5px solid #FCA5A5', borderRadius: 12, padding: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#991B1B', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}><KeyRound size={14}/> Anonymous Whistleblower Channel</div>
          <div style={{ color: '#64748B', fontSize: 12, marginBottom: 14 }}>Report directly to Board of Directors — encrypted, anonymous, CISO completely bypassed. RBI Whistleblower Framework aligned.</div>
          {!wbSent ? (
            <>
              <textarea value={wbMsg} onChange={e => setWbMsg(e.target.value)} placeholder="Describe the suspicious activity..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #FCA5A5', borderRadius: 8, fontSize: 12, minHeight: 80, resize: 'vertical', outline: 'none', fontFamily: 'inherit' }}/>
              <button onClick={submitWB} disabled={wbLoading || !wbMsg.trim()} className="btn-hover" style={{ marginTop: 10, padding: '10px 20px', borderRadius: 8, border: 'none', background: !wbMsg.trim() ? '#FCA5A5' : '#991B1B', color: '#fff', fontWeight: 700, fontSize: 12, cursor: !wbMsg.trim() ? 'not-allowed' : 'pointer' }}>
                {wbLoading ? <><Loader2 size={14} className="spin-icon"/> Sending...</> : <><KeyRound size={14}/> Submit to Board — Encrypted & Anonymous</>}
              </button>
            </>
          ) : (
            <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 8, padding: 14, textAlign: 'center' }}>
              <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'center' }}><CheckCircle2 size={24} color="#16A34A"/></div>
              <div style={{ color: '#16A34A', fontWeight: 700, fontSize: 13 }}>Report Submitted — Forwarded to Board</div>
              <div style={{ color: '#64748B', fontSize: 12, marginTop: 4 }}>CISO has NOT been notified.</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


function BranchesPanel({ branches, employees, onSelectEmployee }) {
  const [selectedBranch, setSelectedBranch] = useState(null);

  const branchEmployees = selectedBranch
    ? employees.filter(e => e.branch === selectedBranch.branch)
    : [];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      {/* Left — Branch List */}
      <div>
        <div style={{ fontWeight: 800, fontSize: 18, color: '#0F172A', marginBottom: 4 }}>Branch-Level Risk Rollup</div>
        <div style={{ color: '#64748B', fontSize: 13, marginBottom: 20 }}>Click any branch to see employee details</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {branches.map((b, i) => {
            const maxSev = b.critical > 0 ? 'CRITICAL' : b.alert > 0 ? 'ALERT' : b.watch > 0 ? 'WATCH' : 'NORMAL';
            const cfg = SEV[maxSev];
            const isSelected = selectedBranch?.branch === b.branch;
            return (
              <div key={i} onClick={() => setSelectedBranch(b)} className="card-hover" style={{ background: isSelected ? cfg.bg : '#fff', border: `1.5px solid ${isSelected ? cfg.border : '#E2E8F0'}`, borderLeft: `4px solid ${cfg.dot}`, borderRadius: 10, padding: 16, cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#0F172A' }}>{b.branch}</div>
                    <div style={{ color: '#64748B', fontSize: 11 }}>{b.employees} employees monitored</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: cfg.dot, fontWeight: 800, fontSize: 22, fontFamily: FONT_MONO }}>{b.max_risk}</div>
                    <span style={{ background: cfg.badge, color: '#fff', borderRadius: 4, fontSize: 9, padding: '2px 6px', fontWeight: 700 }}>{maxSev}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {b.critical > 0 && <span style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: 4, fontSize: 10, padding: '2px 7px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 3 }}><Circle size={7} fill="#DC2626" stroke="none"/> {b.critical} Critical</span>}
                  {b.alert > 0   && <span style={{ background: '#FFFBEB', color: '#D97706', border: '1px solid #FCD34D', borderRadius: 4, fontSize: 10, padding: '2px 7px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 3 }}><Circle size={7} fill="#D97706" stroke="none"/> {b.alert} Alert</span>}
                  {b.watch > 0   && <span style={{ background: '#FEFCE8', color: '#CA8A04', border: '1px solid #FDE047', borderRadius: 4, fontSize: 10, padding: '2px 7px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 3 }}><Circle size={7} fill="#CA8A04" stroke="none"/> {b.watch} Watch</span>}
                  {b.normal > 0  && <span style={{ background: '#F0FDF4', color: '#16A34A', border: '1px solid #86EFAC', borderRadius: 4, fontSize: 10, padding: '2px 7px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 3 }}><Circle size={7} fill="#16A34A" stroke="none"/> {b.normal} Normal</span>}
                  {b.frozen_count > 0 && <span style={{ background: '#F1F5F9', color: '#64748B', border: '1px solid #CBD5E1', borderRadius: 4, fontSize: 10, padding: '2px 7px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 3 }}><Lock size={9}/> {b.frozen_count} Frozen</span>}
                </div>
                {b.top_threat && <div style={{ color: '#64748B', fontSize: 11, marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={11}/> Top threat: <strong style={{ color: '#DC2626' }}>{b.top_threat}</strong></div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right — Branch Detail */}
      <div>
        {selectedBranch ? (
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20, position: 'sticky', top: 100 }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#0F172A', marginBottom: 4 }}>{selectedBranch.branch}</div>
            <div style={{ color: '#64748B', fontSize: 12, marginBottom: 16 }}>{selectedBranch.employees} employees · Max risk: {selectedBranch.max_risk}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {branchEmployees.sort((a,b) => b.risk_score - a.risk_score).map((emp, i) => {
                const cfg = SEV[emp.severity];
                return (
                  <div key={i} onClick={() => onSelectEmployee && onSelectEmployee(emp)} className="card-hover" style={{ background: cfg.bg, border: `1.5px solid ${cfg.border}`, borderLeft: `4px solid ${cfg.dot}`, borderRadius: 8, padding: 12, cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>{emp.name}</div>
                        <div style={{ color: '#64748B', fontSize: 11 }}>{emp.role}</div>
                        {emp.is_frozen && <div style={{ color: '#DC2626', fontSize: 10, fontWeight: 700, marginTop: 2, display: 'flex', alignItems: 'center', gap: 3 }}><Lock size={10}/> SUSPENDED</div>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ background: cfg.badge, color: '#fff', borderRadius: 5, fontSize: 9, padding: '2px 7px', fontWeight: 700 }}>{emp.severity}</span>
                        <span style={{ color: cfg.dot, fontWeight: 900, fontSize: 18, fontFamily: FONT_MONO }}>{emp.risk_score}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div style={{ background: '#F8FAFC', border: '2px dashed #E2E8F0', borderRadius: 12, padding: 40, textAlign: 'center' }}>
            <div style={{ marginBottom: 12, opacity: 0.4, display: 'flex', justifyContent: 'center' }}><Building2 size={40}/></div>
            <div style={{ color: '#64748B', fontSize: 14 }}>Select a branch to view employee details</div>
          </div>
        )}
      </div>
    </div>
  );
}

function RBIReportsPanel({ rbiData }) {
  if (!rbiData) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#64748B', padding: 20 }}>
      <div style={{ width: 16, height: 16, border: '2px solid #3D5872', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}/>
      Loading RBI Reports...
    </div>
  );
  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: 18, color: '#0F172A', marginBottom: 4 }}>RBI Compliance Reports</div>
      <div style={{ color: '#64748B', fontSize: 13, marginBottom: 8 }}>Auto-generated every 6 days — submitted directly to RBI portal. No CISO or MD approval needed.</div>

      <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 8, padding: '8px 14px', marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: '#16A34A', fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}><Check size={12}/> Auto-submitted · CISO cannot intercept · MD cannot block · CBI access enabled</span>
      </div>

      {/* Report Header */}
      <div style={{ background: '#1B2A41', borderRadius: 12, padding: 20, marginBottom: 20, color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4, letterSpacing: '0.05em' }}>REPORT REFERENCE</div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 14, fontWeight: 700 }}>{rbiData.report_id}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>GENERATED AT</div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 13 }}>{rbiData.generated_at}</div>
          </div>
        </div>
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>BANK</div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{rbiData.bank}</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          ['Employees Monitored', rbiData.total_employees_monitored, '#3D5872'],
          ['High Risk Employees', rbiData.high_risk_employees?.length || 0, '#EF4444'],
          ['Honeypot Breaches', rbiData.honeypot_breaches, '#F59E0B'],
          ['Frozen Accounts', rbiData.frozen_accounts, '#7A3A52'],
          ['Collusion Cases', rbiData.collusion_detected, '#DC2626'],
          ['CBI Access', rbiData.cbi_access_enabled ? 'ENABLED' : 'DISABLED', '#22C55E'],
          ['Auto-Submitted', rbiData.auto_submitted ? 'YES' : 'NO', '#16A34A'],
          ['CISO Approval Needed', rbiData.ciso_approval_required ? 'YES' : 'NO', '#22C55E'],
        ].map(([label, value, color]) => (
          <div key={label} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: 14, textAlign: 'center' }}>
            <div style={{ color, fontWeight: 800, fontSize: 18, fontFamily: FONT_MONO }}>{value}</div>
            <div style={{ color: '#64748B', fontSize: 10, marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* High Risk Employees */}
      {rbiData.high_risk_employees?.length > 0 && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#991B1B', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><AlertTriangle size={14}/> High Risk Employees (Reported to RBI)</div>
          {rbiData.high_risk_employees.map((emp, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#fff', border: '1px solid #FECACA', borderRadius: 7, marginBottom: 6 }}>
              <div>
                <span style={{ fontWeight: 600, fontSize: 13, color: '#0F172A' }}>{emp.name}</span>
                <span style={{ color: '#64748B', fontSize: 11, marginLeft: 8 }}>{emp.branch}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: FONT_MONO, fontWeight: 800, fontSize: 16, color: '#DC2626' }}>{emp.score}/100</span>
                <span style={{ fontSize: 10, color: '#64748B', fontFamily: FONT_MONO }}>{emp.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Compliance */}
      <div style={{ background: '#EEF1F4', border: '1px solid #C9D2DC', borderRadius: 12, padding: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#1B2A41', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}><ClipboardList size={14}/> Compliance Framework</div>
        <div style={{ color: '#374151', fontSize: 12, marginBottom: 8 }}>{rbiData.compliance_framework}</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['RBI CSF 2016', 'RBI Master Direction IT 2023', 'ISO 27001:2022', 'CERT-In', 'DPDP Act 2023'].map(tag => (
            <span key={tag} style={{ background: '#fff', color: '#1B2A41', border: '1px solid #C9D2DC', borderRadius: 5, fontSize: 10, padding: '3px 8px', fontWeight: 600 }}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}



export default function App() {
  const [currentUser,  setCurrentUser]  = useState(null);
  const [employees,    setEmployees]    = useState([]);
  const [honeypots,    setHoneypots]    = useState([]);
  const [auditLogs,    setAuditLogs]    = useState([]);
  const [collusion,    setCollusion]    = useState([]);
  const [trajectories, setTraj]         = useState({});
  const [branches,     setBranches]     = useState([]);
  const [cisoData,     setCisoData]     = useState(null);
  const [rbiData,      setRbiData]      = useState(null);
  const [selected,     setSelected]     = useState(null);
  const [tab,          setTab]          = useState('dashboard');
  const [loading,      setLoading]      = useState(true);
  const [freezeEmp,    setFreezeEmp]    = useState(null);

  useEffect(() => { if (currentUser) fetchAll(); }, [currentUser]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [eR, hR, aR, cR, bR, csR, rR] = await Promise.all([
        fetch(`${API}/employees`),
        fetch(`${API}/honeypots`),
        fetch(`${API}/audit`),
        fetch(`${API}/collusion`),
        fetch(`${API}/branches`),
        fetch(`${API}/ciso-security`),
        fetch(`${API}/rbi-report`),
      ]);
      const emps = await eR.json();
      setEmployees(emps);
      setHoneypots(await hR.json());
      setAuditLogs(await aR.json());
      setCollusion(await cR.json());
      setBranches(await bR.json());
      setCisoData(await csR.json());
      setRbiData(await rR.json());
      const tj = {};
      await Promise.all(emps.map(async e => {
        try {
          const r = await fetch(`${API}/trajectory/${e.id}`);
          const d = await r.json();
          tj[e.id] = d.trajectory;
        } catch { tj[e.id] = [e.risk_score]; }
      }));
      setTraj(tj);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const simulateAttack = () => {
    const raj = employees.find(e => e.name === 'Raj Kumar');
    if (raj) { setSelected(raj); setTab('dashboard'); }
  };

  const handleFreeze = (empId) => {
    setEmployees(prev => prev.map(e =>
      e.id === empId ? { ...e, is_frozen: true, status: 'SUSPENDED', frozen_by: currentUser?.name } : e
    ));
    setFreezeEmp(null);
    setTimeout(fetchAll, 500);
  };

  if (!currentUser) return <LoginScreen onLogin={setCurrentUser}/>;

  const critical = employees.filter(e => e.severity === 'CRITICAL').length;
  const alert    = employees.filter(e => e.severity === 'ALERT').length;
  const watch    = employees.filter(e => e.severity === 'WATCH').length;
  const normal   = employees.filter(e => e.severity === 'NORMAL').length;
  const topRisk  = [...employees].sort((a,b) => b.risk_score - a.risk_score)[0];
  const isMD     = currentUser?.role === 'md';
  const isCISO   = currentUser?.role === 'ciso';

  const TABS = [
    { id: 'dashboard', label: 'Dashboard',     icon: LayoutDashboard, roles: ['ciso','md'] },
    { id: 'honeypot',  label: 'Honeypot',      icon: Crosshair,       roles: ['ciso','md'] },
    { id: 'alerts',    label: 'Alerts',        icon: Siren,           roles: ['ciso','md'] },
    { id: 'collusion', label: 'Collusion',     icon: Network,         roles: ['ciso','md'] },
    { id: 'audit',     label: 'Audit Log',     icon: ClipboardList,   roles: ['ciso','md'] },
    { id: 'ciso',      label: 'CISO Security', icon: KeyRound,        roles: ['ciso','md'] },
    { id: 'branches',  label: 'Branches',      icon: Building2,       roles: ['md'] },
    { id: 'rbi',       label: 'RBI Reports',   icon: BarChart3,       roles: ['md'] },
  ].filter(t => t.roles.includes(currentUser?.role));

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F4F4F1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <style>{CSS}</style>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#1B2A41', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #A9762F', outline: '1px solid #1B2A41', outlineOffset: 3 }}><ShieldCheck size={26} color="#fff" strokeWidth={1.75}/></div>
      <div style={{ fontFamily: FONT_SEAL, fontWeight: 700, fontSize: 20, color: '#0F172A', letterSpacing: '0.04em' }}>PRAHARI v2.0</div>
      <div style={{ color: '#64748B', fontSize: 12 }}>Loading security data...</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F4F4F1', fontFamily: FONT_UI }}>
      <style>{CSS}</style>

      {freezeEmp && (
        <FreezeModal emp={freezeEmp} currentUser={currentUser} onClose={() => setFreezeEmp(null)} onFreeze={handleFreeze}/>
      )}

      {/* HEADER */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ height: 2, background: isMD ? '#1B2A41' : '#4A2233' }}/>
        <div style={{ padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: isMD ? '#1B2A41' : '#4A2233', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(30,58,95,0.28)', border: `1.5px solid ${isMD ? '#A9762F' : '#B8863B'}` }}><ShieldCheck size={19} color="#fff" strokeWidth={1.75}/></div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: FONT_SEAL, fontWeight: 700, fontSize: 19, color: '#0F172A', letterSpacing: '0.05em' }}>PRAHARI</span>
                  <span style={{ background: '#F1F5F9', color: '#64748B', border: '1px solid #E2E8F0', borderRadius: 4, fontSize: 9, padding: '2px 6px', fontWeight: 700, fontFamily: FONT_MONO, letterSpacing: '0.03em' }}>v2.0</span>
                </div>
                <div style={{ color: '#64748B', fontSize: 10, letterSpacing: '0.06em' }}>INSIDER THREAT INTELLIGENCE PLATFORM</div>
              </div>
            </div>
            <div style={{ width: 1, height: 36, background: '#E2E8F0' }}/>
            <div style={{ display: 'flex', gap: 20 }}>
              {[['CRITICAL',critical,'#EF4444'],['ALERT',alert,'#F59E0B'],['WATCH',watch,'#EAB308'],['NORMAL',normal,'#22C55E']].map(([l,c,col]) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <AnimCounter value={c} color={col} size={22}/>
                  <div style={{ color: '#94A3B8', fontSize: 9, letterSpacing: '0.07em', marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: isMD ? '#EEF1F4' : '#F5EEF0', border: `1px solid ${isMD ? '#C9D2DC' : '#E3C9D2'}`, borderRadius: 8, padding: '6px 12px', textAlign: 'right' }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: isMD ? '#1B2A41' : '#5C2A3D' }}>{currentUser.name}</div>
              <div style={{ fontSize: 10, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'flex-end' }}>{isMD ? <><Crown size={10}/> MD Access</> : <><Shield size={10}/> CISO Access</>}</div>
            </div>
            <LiveClock/>
            <div style={{ width: 1, height: 36, background: '#E2E8F0' }}/>
            <button onClick={simulateAttack} className="btn-hover" style={{ background: '#B91C1C', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, fontSize: 12, padding: '10px 18px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(220,38,38,0.25)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Zap size={13}/> SIMULATE ATTACK
            </button>
            <button onClick={fetchAll} className="btn-hover" style={{ background: '#EEF1F4', border: '1px solid #C9D2DC', borderRadius: 8, color: '#1B2A41', fontWeight: 700, fontSize: 12, padding: '10px 14px', cursor: 'pointer', display: 'flex' }}><RotateCcw size={14}/></button>
            <button onClick={() => setCurrentUser(null)} style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, color: '#DC2626', fontWeight: 700, fontSize: 12, padding: '10px 14px', cursor: 'pointer' }}>Logout</button>
          </div>
        </div>
      </div>

      {/* Role Banner */}
      {isMD && <div style={{ background: '#EEF1F4', borderBottom: '1px solid #C9D2DC', padding: '8px 24px', display: 'flex', alignItems: 'center', gap: 8 }}><Crown size={14} color="#1B2A41"/><span style={{ color: '#1B2A41', fontSize: 13, fontWeight: 600 }}>MD Dashboard — Full access to all systems including CISO activities and RBI Reports</span></div>}
      {isCISO && <div style={{ background: '#F5EEF0', borderBottom: '1px solid #E3C9D2', padding: '8px 24px', display: 'flex', alignItems: 'center', gap: 8 }}><Shield size={14} color="#5C2A3D"/><span style={{ color: '#5C2A3D', fontSize: 13, fontWeight: 600 }}>CISO Dashboard — Employee monitoring. Critical actions require MD approval.</span></div>}

      {/* MD Fraud Warning */}
      {isMD && (
        <div style={{ background: '#FFFBEB', borderBottom: '1px solid #FCD34D', padding: '8px 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={14} color="#D97706"/>
          <span style={{ color: '#92400E', fontSize: 12 }}>
            All MD actions are automatically logged in immutable audit trail and included in weekly RBI reports. Actions cannot be deleted by anyone.
          </span>
        </div>
      )}

      {/* Critical Banner */}
      {critical > 0 && (
        <div style={{ background: '#FEF2F2', borderBottom: '1px solid #FECACA', padding: '9px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444', animation: 'pulse 1s infinite' }}/>
          <span style={{ color: '#DC2626', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Siren size={14}/> CRITICAL THREAT — {employees.filter(e => e.severity === 'CRITICAL').map(e => e.name).join(' & ')} — Immediate SOC review required
          </span>
        </div>
      )}

      {/* Tabs */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', padding: '0 24px', display: 'flex', overflowX: 'auto' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: 'none', border: 'none',
            borderBottom: `2px solid ${tab === t.id ? (isMD ? '#3D5872' : '#7A3A52') : 'transparent'}`,
            color: tab === t.id ? (isMD ? '#1B2A41' : '#5C2A3D') : '#64748B',
            fontWeight: tab === t.id ? 700 : 400,
            fontSize: 12, padding: '13px 16px', cursor: 'pointer', whiteSpace: 'nowrap',
            display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.2s',
          }}>
            <t.icon size={14}/><span>{t.label}</span>
            {t.id === 'rbi' && <span style={{ background: '#16A34A', color: '#fff', borderRadius: 4, fontSize: 8, padding: '1px 5px', fontWeight: 700 }}>MD ONLY</span>}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: 24 }}>
        {tab === 'dashboard' && (
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderTop: `3px solid ${isMD ? '#24405C' : '#5C2A3D'}`, borderRadius: 12, padding: 18, boxShadow: CARD_SHADOW }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: isMD ? '#1B2A41' : '#5C2A3D', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Newspaper size={13}/> {isMD ? 'MD' : 'CISO'} Intelligence Digest
                </div>
                {topRisk && (
                  <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: 12, marginBottom: 14 }}>
                    <div style={{ color: '#DC2626', fontSize: 10, fontWeight: 700, marginBottom: 5, display: 'flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={11}/> HIGHEST RISK</div>
                    <div style={{ fontWeight: 800, fontSize: 14, color: '#0F172A' }}>{topRisk.name}</div>
                    <div style={{ color: '#64748B', fontSize: 11, marginTop: 2 }}>{topRisk.role} · {topRisk.branch}</div>
                    <div style={{ color: '#EF4444', fontWeight: 800, fontSize: 14, marginTop: 6, fontFamily: FONT_MONO }}>{topRisk.risk_score}/100</div>
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[['Critical',critical,'#EF4444','#FEF2F2','#FECACA'],['Alert',alert,'#F59E0B','#FFFBEB','#FDE68A'],['Watch',watch,'#EAB308','#FEFCE8','#FEF08A'],['Normal',normal,'#22C55E','#F0FDF4','#86EFAC']].map(([l,c,col,bg,bdr]) => (
                    <div key={l} style={{ background: bg, border: `1px solid ${bdr}`, borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                      <AnimCounter value={c} color={col} size={22}/>
                      <div style={{ color: '#64748B', fontSize: 9, letterSpacing: '0.07em', marginTop: 3, textTransform: 'uppercase' }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ color: '#64748B', fontSize: 11, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 10, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}><Users size={13}/> {employees.length} Employees Monitored</div>
                <div style={{ maxHeight: 'calc(100vh - 440px)', overflowY: 'auto', paddingRight: 4 }}>
                  {[...employees].sort((a,b) => b.risk_score - a.risk_score).map(emp => (
                    <EmployeeCard key={emp.id} emp={emp} selected={selected?.id === emp.id} onClick={setSelected} trajectory={trajectories[emp.id]} currentUser={currentUser}/>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 24, overflowY: 'auto', maxHeight: 'calc(100vh - 180px)', boxShadow: CARD_SHADOW }}>
              {selected ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 16, borderBottom: '1px solid #F1F5F9' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <h2 style={{ fontWeight: 900, fontSize: 22, color: '#0F172A', margin: 0 }}>{selected.name}</h2>
                        <span style={{ background: SEV[selected.severity].badge, color: '#fff', borderRadius: 5, fontSize: 10, padding: '3px 9px', fontWeight: 700 }}>{selected.severity}</span>
                        {selected.is_frozen && <span style={{ background: '#64748B', color: '#fff', borderRadius: 5, fontSize: 10, padding: '3px 9px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3 }}><Lock size={10}/> SUSPENDED</span>}
                      </div>
                      <div style={{ color: '#64748B', fontSize: 13, marginBottom: 4 }}>{selected.role} · {selected.branch}</div>
                      <div style={{ color: '#94A3B8', fontSize: 11, fontFamily: FONT_MONO }}>ID: {selected.id} · Level: {selected.hierarchy_level}</div>
                      {selected.honeypot_accessed && (
                        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 7, padding: '6px 12px', marginTop: 10, display: 'inline-block' }}>
                          <span style={{ color: '#DC2626', fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 5 }}><Crosshair size={13}/> HONEYPOT: {selected.honeypot_file}</span>
                        </div>
                      )}
                    </div>
                    <RiskRing score={selected.risk_score} size={96}/>
                  </div>
                  {trajectories[selected.id] && <TrajectoryChart data={trajectories[selected.id]}/>}
                  <ZeroTrust score={selected.confidence_score} breakdown={selected.confidence_breakdown}/>
                  <TagsPanel mitre={selected.mitre_tags} compliance={selected.compliance_tags}/>
                  <AttackTimeline events={selected.access_events}/>
                  <ScoreBreakdown breakdown={selected.score_breakdown}/>
                  {selected.severity !== 'NORMAL' && (
                    <InvestigatePanel emp={selected} currentUser={currentUser} onFreezeClick={() => setFreezeEmp(selected)}/>
                  )}
                </div>
              ) : (
                <div style={{ height: '100%', minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                  <div style={{ width: 80, height: 80, borderRadius: 20, background: '#F1F5F9', border: '2px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Search size={32} color="#94A3B8"/></div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: '#374151' }}>Select an Employee</div>
                  <div style={{ color: '#64748B', fontSize: 13 }}>Click any card to view their Security Passport</div>
                  <button onClick={simulateAttack} className="btn-hover" style={{ background: '#B91C1C', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 13, padding: '12px 24px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(220,38,38,0.25)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Zap size={14}/> Run Attack Simulation
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'honeypot'  && <div style={{ maxWidth: 780, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 24, boxShadow: CARD_SHADOW }}><HoneypotPanel honeypots={honeypots}/></div>}
        {tab === 'alerts'    && <div style={{ maxWidth: 780, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 24, boxShadow: CARD_SHADOW }}><AlertFeed employees={employees} currentUser={currentUser}/></div>}
        {tab === 'collusion' && <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 24, boxShadow: CARD_SHADOW }}><CollusionPanel pairs={collusion} employees={employees} onViewEmployee={(emp) => { setSelected(emp); setTab('dashboard'); }}/></div>}
        {tab === 'audit'     && <div style={{ maxWidth: 780, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 24, boxShadow: CARD_SHADOW }}><AuditLog logs={auditLogs}/></div>}
        {tab === 'ciso'      && <div style={{ maxWidth: 780, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 24, boxShadow: CARD_SHADOW }}><CISOPanel cisoData={cisoData} onWhistleblower={fetchAll} currentUser={currentUser}/></div>}
        {tab === 'branches'  && <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 24, boxShadow: CARD_SHADOW }}><BranchesPanel branches={branches} employees={employees} onSelectEmployee={(emp) => { setSelected(emp); setTab('dashboard'); }}/></div>}
        {tab === 'rbi'       && <div style={{ maxWidth: 900, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 24, boxShadow: CARD_SHADOW }}><RBIReportsPanel rbiData={rbiData}/></div>}
      </div>

      {/* Footer */}
      <div style={{ padding: '14px 24px', borderTop: '1px solid #E2E8F0', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: '#94A3B8', fontSize: 11, fontFamily: FONT_MONO }}>
          PRAHARI v2.0 · FinSpark '26 · Bank of Maharashtra · Logged in as {currentUser.name} ({currentUser.label})
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[['RBI CSF 2016','#16A34A'],['ISO 27001','#0E7490'],['CERT-In','#7A3A52'],['DPDP 2023','#D97706']].map(([l,c]) => (
            <span key={l} style={{ color: c, fontSize: 9, fontWeight: 700, background: '#F8FAFC', border: `1px solid ${c}30`, borderRadius: 4, padding: '2px 6px' }}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
