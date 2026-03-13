import { NavLink, useNavigate } from 'react-router-dom';
import { Map, LayoutDashboard, PlusCircle, Heart, Menu, X, LogIn, LogOut, Crown } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface Props {
  savedCount?: number;
}

const links = [
  { to: '/', label: 'Map', icon: Map },
  { to: '/dashboard', label: 'Browse', icon: LayoutDashboard },
  { to: '/saved', label: 'Saved', icon: Heart },
  { to: '/create', label: 'List Your Place', icon: PlusCircle },
  { to: '/pricing', label: 'Premium', icon: Crown },
];

export default function Navbar({ savedCount = 0 }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const displayEmail = user?.email
    ? user.email.length > 20
      ? user.email.slice(0, 17) + '...'
      : user.email
    : null;

  return (
    <nav className="bg-dark text-white sticky top-0 z-[1000] shadow-lg">
      {/* Gold accent line at top */}
      <div className="h-1 bg-gradient-to-r from-gold/0 via-gold to-gold/0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center gap-2.5 no-underline group">
            <span className="font-display text-gold text-2xl italic tracking-tight group-hover:text-gold-dark transition-colors">
              OskiLease
            </span>
          </NavLink>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all no-underline relative ${
                    isActive
                      ? 'bg-gold text-dark'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon size={17} />
                {label}
                {label === 'Saved' && savedCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {savedCount > 99 ? '99+' : savedCount}
                  </span>
                )}
              </NavLink>
            ))}

            {/* Auth button */}
            <div className="ml-2 pl-2 border-l border-white/15">
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/50 hidden lg:inline">{displayEmail}</span>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all bg-transparent border-none cursor-pointer"
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all no-underline ${
                      isActive
                        ? 'bg-gold text-dark'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <LogIn size={16} />
                  Sign In
                </NavLink>
              )}
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-white/80 hover:text-gold transition-colors bg-transparent border-none cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1 border-t border-white/10 pt-3">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-4 py-3 rounded-lg text-base font-semibold transition-all no-underline ${
                    isActive
                      ? 'bg-gold text-dark'
                      : 'text-white/80 hover:bg-white/10'
                  }`
                }
              >
                <Icon size={20} />
                {label}
                {label === 'Saved' && savedCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-auto">
                    {savedCount}
                  </span>
                )}
              </NavLink>
            ))}

            {/* Mobile auth */}
            <div className="pt-2 mt-2 border-t border-white/10">
              {user ? (
                <>
                  <p className="px-4 py-1 text-xs text-white/40">{user.email}</p>
                  <button
                    onClick={() => { handleSignOut(); setMobileOpen(false); }}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-lg text-base font-semibold text-white/80 hover:bg-white/10 transition-all bg-transparent border-none cursor-pointer w-full text-left"
                  >
                    <LogOut size={20} />
                    Sign Out
                  </button>
                </>
              ) : (
                <NavLink
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-4 py-3 rounded-lg text-base font-semibold transition-all no-underline ${
                      isActive
                        ? 'bg-gold text-dark'
                        : 'text-white/80 hover:bg-white/10'
                    }`
                  }
                >
                  <LogIn size={20} />
                  Sign In
                </NavLink>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
