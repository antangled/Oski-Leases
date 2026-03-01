import { DollarSign, Star, Shield, Handshake, BarChart3 } from 'lucide-react';

interface Proposal {
  rank: number;
  title: string;
  icon: React.ReactNode;
  description: string;
  revenue: string;
  effort: number; // 1-5
  borderColor: string;
}

const proposals: Proposal[] = [
  {
    rank: 1,
    title: 'Featured Listings',
    icon: <Star size={24} />,
    description:
      'Landlords pay $5–15 to boost their listing for 7 days. Boosted listings appear first in search results and get a highlighted pin on the map. Minimal engineering effort with immediate revenue.',
    revenue: '$400–800/semester',
    effort: 1,
    borderColor: '#17252A',
  },
  {
    rank: 2,
    title: 'Semester Subscription',
    icon: <DollarSign size={24} />,
    description:
      'Free users see listings with a 24-hour delay. Subscribers ($4.99/mo or $9.99/semester) get real-time access, saved searches, and email alerts when new listings match their criteria.',
    revenue: '$500–1,000/semester',
    effort: 3,
    borderColor: '#2B7A78',
  },
  {
    rank: 3,
    title: 'Verified Listing Badge',
    icon: <Shield size={24} />,
    description:
      'Charge landlords $20 for a verification process — confirm ownership, review photos, verify lease terms. Verified listings display a trust badge that increases engagement by 40%+.',
    revenue: '$400–600/semester',
    effort: 3,
    borderColor: '#3AAFA9',
  },
  {
    rank: 4,
    title: 'Affiliate Partnerships',
    icon: <Handshake size={24} />,
    description:
      "Partner with moving companies, furniture rental services (CORT, Fernish), and renter's insurance providers. Earn $5–20 per referral for each sign-up through OskiLease.",
    revenue: '$250–1,000/semester',
    effort: 2,
    borderColor: '#3AAFA9',
  },
  {
    rank: 5,
    title: 'Market Data Insights',
    icon: <BarChart3 size={24} />,
    description:
      'Sell anonymized, aggregated market analytics — average rents by block, demand trends by month, time-to-lease metrics — to property management companies and campus housing offices.',
    revenue: '$1,000–5,000/year',
    effort: 5,
    borderColor: '#DEF2F1',
  },
];

function EffortDots({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`inline-block w-2 h-2 rounded-full ${
            i <= level ? 'bg-teal-dark' : 'bg-mint'
          }`}
        />
      ))}
    </div>
  );
}

export default function BusinessModelView() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold text-dark">Monetization Strategy</h1>
        <p className="text-sm text-dark/50 mt-1">
          Five revenue streams ranked by estimated ROI
        </p>
      </div>

      <div className="space-y-4">
        {proposals.map((p) => (
          <div
            key={p.rank}
            className="bg-white rounded-xl shadow-sm border border-mint overflow-hidden animate-fade-in-up"
            style={{ animationDelay: `${p.rank * 80}ms` }}
          >
            <div className="flex">
              {/* Colored rank bar */}
              <div
                className="w-1.5 shrink-0"
                style={{ backgroundColor: p.borderColor }}
              />
              <div className="flex-1 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-mint text-teal-dark shrink-0">
                    {p.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-teal bg-teal/10 px-2 py-0.5 rounded-full">
                        #{p.rank}
                      </span>
                      <h3 className="font-semibold text-dark text-lg">{p.title}</h3>
                    </div>
                    <p className="text-sm text-dark/60 leading-relaxed mb-3">
                      {p.description}
                    </p>
                    <div className="flex items-center gap-6 text-xs">
                      <div>
                        <span className="text-dark/40 uppercase tracking-wider">Revenue</span>
                        <p className="font-semibold text-teal-dark mt-0.5">{p.revenue}</p>
                      </div>
                      <div>
                        <span className="text-dark/40 uppercase tracking-wider">Effort</span>
                        <div className="mt-1">
                          <EffortDots level={p.effort} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary table */}
      <div className="mt-10 bg-white rounded-xl shadow-sm border border-mint overflow-hidden">
        <div className="px-5 py-3 bg-dark text-white">
          <h3 className="font-semibold text-sm">Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-mint">
                <th className="text-left px-5 py-3 font-medium text-dark/50">Strategy</th>
                <th className="text-left px-5 py-3 font-medium text-dark/50">Est. Revenue</th>
                <th className="text-left px-5 py-3 font-medium text-dark/50">Effort</th>
                <th className="text-left px-5 py-3 font-medium text-dark/50">Priority</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((p) => (
                <tr key={p.rank} className="border-b border-mint/50 last:border-none">
                  <td className="px-5 py-3 font-medium text-dark">{p.title}</td>
                  <td className="px-5 py-3 text-teal-dark font-medium">{p.revenue}</td>
                  <td className="px-5 py-3">
                    <EffortDots level={p.effort} />
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        p.rank <= 2
                          ? 'bg-teal/15 text-teal-dark'
                          : p.rank <= 4
                            ? 'bg-mint text-dark/60'
                            : 'bg-mint/50 text-dark/40'
                      }`}
                    >
                      {p.rank <= 2 ? 'High' : p.rank <= 4 ? 'Medium' : 'Low'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
