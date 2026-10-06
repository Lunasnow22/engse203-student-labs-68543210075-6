import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/apiClient.js';
import { setSession } from '../services/authSession.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true); setError('');
    try {
      setSession(await apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: data.get('email'), password: data.get('password') }) }));
      navigate('/');
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <section className="panel"><h1>เข้าสู่ระบบเจ้าหน้าที่</h1>
    <p>ผู้ใช้ทั่วไปดูและส่งคำร้องได้ เจ้าหน้าที่เข้าสู่ระบบเพื่อเปลี่ยนสถานะหรือลบคำร้อง</p>
    <form onSubmit={submit} className="login-form">
      <label>อีเมล<input name="email" type="email" autoComplete="username" maxLength={254} required /></label>
      <label>รหัสผ่าน<input name="password" type="password" autoComplete="current-password" maxLength={200} required /></label>
      {error && <p role="alert">{error}</p>}
      <button className="button primary" disabled={busy}>{busy ? 'กำลังเข้าสู่ระบบ…' : 'เข้าสู่ระบบ'}</button>
    </form></section>;
}
