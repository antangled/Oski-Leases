import { useState } from 'react';
import { Users, Home, DollarSign, TrendingUp } from 'lucide-react';

interface RevenueStream {
  id: string;
  name: string;
  side: 'Searcher' | 'Lister' | 'Neither';
  pricePerUnit: number;
  priceLabel: string;
  defaultConversion: number; // percentage (0-100)
  appliesTo: 'searchers' | 'listers';
}

const STREAMS: RevenueStream[] = [
  {
    id: 'match-alerts',
    name: 'Match Alerts',
    side: 'Searcher',
    pricePerUnit: 5,
    priceLabel: '$5 one-time',
    defaultConversion: 12,
    appliesTo: 'searchers',
  },
  {
    id: 'featured',
    name: 'Featured Listings',
    side: 'Lister',
    pricePerUnit: 7.5,
    priceLabel: '$5–10/week',
    defaultConversion: 20,
    appliesTo: 'listers',
  },
  {
    id: 'urgent',
    name: 'Urgent Boost',
    side: 'Lister',
    pricePerUnit: 15,
    priceLabel: '$15 one-time',
    defaultConversion: 8,
    appliesTo: 'listers',
  },
  {
    id: 'verified',
    name: 'Verified Badge',
    side: 'Lister',
    pricePerUnit: 7.5,
    priceLabel: '$5–10',
    defaultConversion: 25,
    appliesTo: 'listers',
  },
  {
    id: 'affiliate',
    name: 'Affiliate Partnerships',
    side: 'Neither',
    pricePerUnit: 12,
    priceLabel: '$5–20 avg referral',
    defaultConversion: 5,
    appliesTo: 'searchers',
  },
];

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (val: number) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-dark/70">{label}</label>
        <span className="text-sm font-semibold text-teal-dark tabular-nums">
          {unit === '$' ? `$${value.toLocaleString()}` : `${value.toLocaleString()}${unit}`}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-mint rounded-lg appearance-none cursor-pointer accent-teal"
      />
      <div className="flex justify-between text-xs text-dark/30">
        <span>{unit === '$' ? `$${min}` : `${min}${unit}`}</span>
        <span>{unit === '$' ? `$${max.toLocaleString()}` : `${max.toLocaleString()}${unit}`}</span>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [totalSearchers, setTotalSearchers] = useState(1000);
  const [totalListers, setTotalListers] = useState(200);
  const [conversions, setConversions] = useState<Record<string, number>>(
    Object.fromEntries(STREAMS.map((s) => [s.id, s.defaultConversion])),
  );
  const [prices, setPrices] = useState<Record<string, number>>(
    Object.fromEntries(STREAMS.map((s) => [s.id, s.pricePerUnit])),
  );

  const updateConversion = (id: string, val: number) =>
    setConversions((prev) => ({ ...prev, [id]: val }));
  const updatePrice = (id: string, val: number) =>
    setPrices((prev) => ({ ...prev, [id]: val }));

  const revenues = STREAMS.map((stream) => {
    const pool = stream.appliesTo === 'searchers' ? totalSearchers : totalListers;
    const buyers = Math.round(pool * (conversions[stream.id] / 100));
    const revenue = buyers * prices[stream.id];
    return { ...stream, pool, buyers, revenue };
  });

  const totalRevenue = revenues.reduce((sum, r) => sum + r.revenue, 0);
  const maxRevenue = Math.max(...revenues.map((r) => r.revenue), 1);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
            ADMIN ONLY
          </span>
        </div>
        <h1 className="text-2xl font-bold text-dark">Revenue Simulator</h1>
        <p className="text-sm text-dark/50 mt-1">
          Adjust assumptions to compare projected revenue across business models
        </p>
      </div>

      {/* Platform stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-mint">
          <div className="flex items-center gap-2 text-dark/50 text-xs font-medium mb-2">
            <Users size={14} />
            TOTAL SEARCHERS
          </div>
          <SliderRow
            label=""
            value={totalSearchers}
            min={50}
            max={5000}
            step={50}
            unit=""
            onChange={setTotalSearchers}
          />
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-mint">
          <div className="flex items-center gap-2 text-dark/50 text-xs font-medium mb-2">
            <Home size={14} />
            TOTAL LISTERS
          </div>
          <SliderRow
            label=""
            value={totalListers}
            min={10}
            max={1000}
            step={10}
            unit=""
            onChange={setTotalListers}
          />
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-mint">
          <div className="flex items-center gap-2 text-dark/50 text-xs font-medium mb-2">
            <DollarSign size={14} />
            PROJECTED REVENUE
          </div>
          <div className="text-3xl font-bold text-teal-dark mt-2">
            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className="text-xs text-dark/40 mt-0.5">per semester</div>
        </div>
      </div>

      {/* Revenue streams */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-dark flex items-center gap-2">
          <TrendingUp size={18} className="text-teal" />
          Revenue Streams
        </h2>

        {revenues.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-xl shadow-sm border border-mint overflow-hidden"
          >
            <div className="flex">
              {/* Revenue bar */}
              <div
                className="w-1.5 shrink-0 bg-teal transition-all"
                style={{ opacity: Math.max(r.revenue / maxRevenue, 0.15) }}
              />
              <div className="flex-1 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-dark">{r.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          r.side === 'Searcher'
                            ? 'bg-blue-50 text-blue-700'
                            : r.side === 'Lister'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-gray-50 text-gray-600'
                        }`}
                      >
                        {r.side}
                      </span>
                      <span className="text-xs text-dark/40">{r.priceLabel}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-teal-dark">
                      ${r.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-xs text-dark/40">
                      {r.buyers} buyers &middot; {r.pool.toLocaleString()} pool
                    </div>
                  </div>
                </div>

                {/* Revenue bar visual */}
                <div className="h-3 bg-mint rounded-full mb-4 overflow-hidden">
                  <div
                    className="h-full bg-teal rounded-full transition-all duration-300"
                    style={{ width: `${(r.revenue / maxRevenue) * 100}%` }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SliderRow
                    label="Conversion rate"
                    value={conversions[r.id]}
                    min={0}
                    max={50}
                    step={1}
                    unit="%"
                    onChange={(val) => updateConversion(r.id, val)}
                  />
                  <SliderRow
                    label="Price per unit"
                    value={prices[r.id]}
                    min={1}
                    max={r.id === 'urgent' ? 30 : 20}
                    step={0.5}
                    unit="$"
                    onChange={(val) => updatePrice(r.id, val)}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div className="bg-white rounded-xl shadow-sm border border-mint overflow-hidden">
        <div className="px-5 py-3 bg-dark text-white">
          <h3 className="font-semibold text-sm">Side-by-Side Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-mint">
                <th className="text-left px-5 py-3 font-medium text-dark/50">Stream</th>
                <th className="text-left px-5 py-3 font-medium text-dark/50">Who Pays</th>
                <th className="text-right px-5 py-3 font-medium text-dark/50">Price</th>
                <th className="text-right px-5 py-3 font-medium text-dark/50">Conv.</th>
                <th className="text-right px-5 py-3 font-medium text-dark/50">Buyers</th>
                <th className="text-right px-5 py-3 font-medium text-dark/50">Revenue</th>
                <th className="text-right px-5 py-3 font-medium text-dark/50">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {revenues.map((r) => (
                <tr key={r.id} className="border-b border-mint/50 last:border-none">
                  <td className="px-5 py-3 font-medium text-dark">{r.name}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        r.side === 'Searcher'
                          ? 'bg-blue-50 text-blue-700'
                          : r.side === 'Lister'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-gray-50 text-gray-600'
                      }`}
                    >
                      {r.side}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums">${prices[r.id].toFixed(2)}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{conversions[r.id]}%</td>
                  <td className="px-5 py-3 text-right tabular-nums">{r.buyers}</td>
                  <td className="px-5 py-3 text-right font-semibold text-teal-dark tabular-nums">
                    ${r.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-dark/50">
                    {totalRevenue > 0 ? ((r.revenue / totalRevenue) * 100).toFixed(1) : 0}%
                  </td>
                </tr>
              ))}
              <tr className="bg-mint/30 font-semibold">
                <td className="px-5 py-3 text-dark" colSpan={5}>
                  Total
                </td>
                <td className="px-5 py-3 text-right text-teal-dark tabular-nums">
                  ${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </td>
                <td className="px-5 py-3 text-right tabular-nums">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
