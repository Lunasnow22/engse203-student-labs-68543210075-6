import { NavLink } from 'react-router-dom';
import { useSession, setSession } from '../services/authSession.js';

const links = [
  ['/', 'Dashboard'],
  ['/requests/new', 'New Request'],
  ['/about', 'About'],
];

function AppHeader() {
  const session = useSession();
  return (
    <header className="site-header">
      <div className="container header-inner">
        <div>
          <p className="eyebrow">ENGSE203 • LAB 13</p>
          <p className="brand">Campus Service Request</p>
        </div>
        <nav aria-label="เมนูหลัก">
          {session ? <button className="nav-link" onClick={() => setSession(null)}>ออกจากระบบ ({session.user.name})</button> : <NavLink className="nav-link" to="/login">เข้าสู่ระบบ</NavLink>}
          {links.map(([to, label]) => (
            <NavLink
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              end={to === '/'}
              key={to}
              to={to}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default AppHeader;
