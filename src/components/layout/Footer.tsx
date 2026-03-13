import { Link } from 'react-router-dom';
import { GraduationCap, Shield, FileText, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark text-white/70 border-t border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <span className="font-display text-gold text-xl italic">OskiLease</span>
            <p className="text-sm text-white/50 mt-2 max-w-sm leading-relaxed">
              The trusted sublease marketplace for UC Berkeley students. Find or list
              semester-length housing near campus.
            </p>
            <div className="flex items-center gap-2 mt-3 text-xs text-white/40">
              <GraduationCap size={14} />
              <span>Made for Cal, by Cal students</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3">Platform</h4>
            <div className="space-y-2">
              <Link to="/dashboard" className="block text-sm text-white/60 hover:text-gold transition-colors no-underline">
                Browse Listings
              </Link>
              <Link to="/create" className="block text-sm text-white/60 hover:text-gold transition-colors no-underline">
                List Your Place
              </Link>
              <Link to="/pricing" className="block text-sm text-white/60 hover:text-gold transition-colors no-underline">
                Premium Features
              </Link>
              <Link to="/saved" className="block text-sm text-white/60 hover:text-gold transition-colors no-underline">
                Saved Listings
              </Link>
            </div>
          </div>

          {/* Trust & Safety */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3">Trust & Safety</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Shield size={13} />
                <span>Verified Students Only</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <FileText size={13} />
                <span>Free Sublease Templates</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Mail size={13} />
                <span>Berkeley Email Required</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="border-t border-white/10 pt-6">
          <div className="bg-white/5 rounded-lg px-4 py-3 mb-4">
            <p className="text-xs text-white/40 leading-relaxed">
              <span className="font-semibold text-white/50">Legal Disclaimer:</span>{' '}
              OskiLease is a marketplace platform that connects subletters with sublettees.
              OskiLease is not a party to any rental agreement, does not collect rent, and
              does not act as a landlord, broker, or property manager. All transactions occur
              directly between parties. Sublease agreement templates are provided for
              convenience and do not constitute legal advice. Users are advised to seek
              independent legal counsel.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/30">
            <p>&copy; {new Date().getFullYear()} OskiLease. All rights reserved.</p>
            <p>UC Berkeley Student Sublease Marketplace</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
