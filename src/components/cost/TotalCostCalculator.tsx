import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

interface Props {
  price: number;
  utilitiesIncluded: boolean;
  furnished: boolean;
}

interface LineItem {
  label: string;
  amount: number;
}

function IncrementButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-5 h-5 flex items-center justify-center rounded bg-dark/5 hover:bg-dark/10 transition-colors"
    >
      <Plus size={10} className="text-dark/60" />
    </button>
  );
}

function DecrementButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-5 h-5 flex items-center justify-center rounded bg-dark/5 hover:bg-dark/10 transition-colors"
    >
      <Minus size={10} className="text-dark/60" />
    </button>
  );
}

export default function TotalCostCalculator({ price, utilitiesIncluded }: Props) {
  const [rent, setRent] = useState(price);
  const [utilities, setUtilities] = useState(utilitiesIncluded ? 0 : 150);
  const [internet, setInternet] = useState(utilitiesIncluded ? 0 : 50);
  const [insurance, setInsurance] = useState(20);

  const total = rent + utilities + internet + insurance;
  const savings = utilitiesIncluded ? 150 + 50 : 0;

  const items: { label: string; value: number; set: (v: number) => void }[] = [
    { label: 'Rent', value: rent, set: setRent },
    { label: 'Utilities', value: utilities, set: setUtilities },
    { label: 'Internet', value: internet, set: setInternet },
    { label: "Renter's Insurance", value: insurance, set: setInsurance },
  ];

  return (
    <div className="bg-cream rounded-xl border border-dark/5 p-4">
      <h4 className="font-display text-sm font-bold text-dark mb-3">
        Estimated Monthly Cost
      </h4>

      <div className="space-y-2">
        {items.map(({ label, value, set }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-xs text-dark/70">{label}</span>
            <div className="flex items-center gap-1.5">
              <DecrementButton onClick={() => set(Math.max(0, value - 10))} />
              <span className="text-xs font-medium text-dark w-12 text-right">
                ${value}
              </span>
              <IncrementButton onClick={() => set(value + 10)} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-dark/10">
        <div className="flex items-center justify-between bg-gold/10 rounded-lg px-3 py-2">
          <span className="text-sm font-bold text-dark">Total</span>
          <span className="text-lg font-extrabold text-dark">
            ${total.toLocaleString()}/mo
          </span>
        </div>

        {savings > 0 && (
          <p className="text-xs font-semibold text-emerald-600 mt-2 text-right">
            Save ~${savings}/mo (utilities included)
          </p>
        )}
      </div>
    </div>
  );
}
