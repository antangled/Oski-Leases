import { Link } from 'react-router-dom';
import { Shield, Zap, FileText, Users, Crown, Check, ArrowRight } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-gold/10 text-dark px-3 py-1.5 rounded-full text-xs font-semibold mb-4 border border-gold/20">
          <Crown size={13} className="text-gold" />
          Premium Features
        </div>
        <h1 className="font-display text-3xl md:text-4xl text-dark italic mb-3">
          Free tools. Premium visibility.
        </h1>
        <p className="text-base text-dark/60 leading-relaxed">
          OskiLease is free to browse and post. Our trust and safety tools are free for everyone.
          Premium features help your listing stand out.
        </p>
      </div>

      {/* Free Features */}
      <div>
        <h2 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
          <Check size={20} className="text-emerald-500" />
          Free for Everyone
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: Shield,
              title: 'Verified Badge',
              desc: 'Upload your landlord permission letter and get a "Landlord Approved" badge on your listing. Builds trust with potential sublettees.',
            },
            {
              icon: FileText,
              title: 'Sublease Templates',
              desc: 'Auto-generate a California-compliant sublease agreement pre-filled with your listing details. Download as PDF.',
            },
            {
              icon: Users,
              title: 'Background Checks',
              desc: 'Students can run a background check to prove trustworthiness to subletters. Reduces friction for everyone.',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-xl p-5 border border-dark/8 shadow-sm">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-3">
                <Icon size={20} className="text-emerald-600" />
              </div>
              <h3 className="text-sm font-bold text-dark mb-1">{title}</h3>
              <p className="text-xs text-dark/50 leading-relaxed">{desc}</p>
              <span className="inline-block mt-3 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                Free
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Features */}
      <div>
        <h2 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
          <Zap size={20} className="text-gold" />
          Premium Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Boosted Listing */}
          <div className="bg-white rounded-xl p-6 border-2 border-gold/30 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-bl-full" />
            <div className="relative">
              <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center mb-3">
                <Zap size={20} className="text-gold" />
              </div>
              <h3 className="text-base font-bold text-dark mb-1">Boosted Listing</h3>
              <p className="text-sm text-dark/50 leading-relaxed mb-4">
                Pin your listing to the top of search results with a "Featured" badge.
                Get 3-4x more visibility and find a sublettee faster.
              </p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-extrabold text-dark">$5&ndash;10</span>
                <span className="text-sm text-dark/40">/week</span>
              </div>
              <ul className="space-y-2 mb-5">
                {[
                  'Pinned to top of search results',
                  '"Featured" badge on your listing',
                  '3-4x more views than standard listings',
                  'Gold highlight on map',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-dark/70">
                    <Check size={14} className="text-gold shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/create"
                className="inline-flex items-center gap-2 bg-gold text-dark px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-gold-dark transition-colors no-underline"
              >
                Boost Your Listing
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Multiple Listings */}
          <div className="bg-white rounded-xl p-6 border border-dark/8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-dark/[0.02] rounded-bl-full" />
            <div className="relative">
              <div className="w-10 h-10 bg-dark/5 rounded-lg flex items-center justify-center mb-3">
                <Crown size={20} className="text-dark" />
              </div>
              <h3 className="text-base font-bold text-dark mb-1">Multiple Active Listings</h3>
              <p className="text-sm text-dark/50 leading-relaxed mb-4">
                For property managers with multiple units. Free tier includes 1 active listing.
                Upgrade for unlimited active listings.
              </p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-extrabold text-dark">$10</span>
                <span className="text-sm text-dark/40">/month</span>
              </div>
              <ul className="space-y-2 mb-5">
                {[
                  'Unlimited active listings',
                  'Bulk listing management tools',
                  'Priority customer support',
                  'Analytics dashboard',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-dark/70">
                    <Check size={14} className="text-dark/40 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/create"
                className="inline-flex items-center gap-2 bg-dark text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-berkeley-blue-light transition-colors no-underline"
              >
                Upgrade
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Legal note */}
      <div className="bg-cream rounded-xl p-4 border border-dark/5 text-center">
        <p className="text-xs text-dark/40">
          OskiLease is a marketplace platform. We do not collect rent, manage properties, or act
          as a landlord or broker. All transactions occur directly between parties.
        </p>
      </div>
    </div>
  );
}
