import { NavLink } from 'react-router-dom';
import { Map, LayoutDashboard, PlusCircle, Menu, X } from 'lucide-react';
import { useState } from 'react';

const links = [
  { to: '/', label: 'Map', icon: Map },
  { to: '/dashboard', label: 'Browse', icon: LayoutDashboard },
  { to: '/create', label: 'List Your Place', icon: PlusCircle },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-dark text-white sticky top-0 z-[1000] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <NavLink to="/" className="flex items-center gap-2 no-underline">
            <span className="text-teal font-extrabold text-2xl tracking-tight">OskiLease</span>
          </NavLink>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-5 py-2.5 rounded-full text-base font-semibold transition-all no-underline ${
                    isActive
                      ? 'bg-teal text-dark shadow-md'
                      : 'text-mint hover:bg-teal-dark/50 hover:text-white'
                  }`
                }
              >
                <Icon size={20} />
                {label}
              </NavLink>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-mint hover:text-teal transition-colors bg-transparent border-none cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 rounded-lg text-base font-semibold transition-all no-underline ${
                    isActive
                      ? 'bg-teal text-dark'
                      : 'text-mint hover:bg-teal-dark/50'
                  }`
                }
              >
                <Icon size={20} />
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
