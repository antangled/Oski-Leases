import { AlertTriangle, Info } from 'lucide-react';

interface Props {
  price: number;
  bedrooms: number;
}

const TYPICAL_RANGES: Record<number, [number, number]> = {
  0: [900, 1400],   // Studio
  1: [1000, 1800],  // 1BR
  2: [1500, 2500],  // 2BR
  3: [2000, 3200],  // 3BR
  4: [2500, 4000],  // 4+BR
};

function getRange(bedrooms: number): [number, number] {
  return TYPICAL_RANGES[bedrooms] ?? TYPICAL_RANGES[2];
}

export default function RentComplianceBanner({ price, bedrooms }: Props) {
  const [low, high] = getRange(bedrooms);
  const isCompliant = price <= high;
  const bedroomLabel = bedrooms === 0 ? 'Studio' : `${bedrooms}BR`;

  return (
    <div
      className={`rounded-2xl border p-4 shadow-md ${
        isCompliant
          ? 'bg-green-50 border-green-300'
          : 'bg-amber-50 border-amber-300'
      }`}
    >
      <div className="flex items-start gap-3">
        {isCompliant ? (
          <Info size={18} className="text-green-600 mt-0.5 shrink-0" />
        ) : (
          <AlertTriangle size={18} className="text-amber-600 mt-0.5 shrink-0" />
        )}
        <div className="space-y-2 text-sm">
          <p className={`font-semibold font-display ${isCompliant ? 'text-green-800' : 'text-amber-800'}`}>
            Berkeley Rent Ordinance
          </p>

          <ul className="space-y-1 text-dark/70">
            <li>
              <span className="font-medium">Proportional share:</span> You cannot charge a subtenant more than their proportional share of rent.
            </li>
            <li>
              <span className="font-medium">Landlord refusal:</span> Landlords can only refuse subletting with reasonable cause.
            </li>
            <li>
              <span className="font-medium">Security deposit (CA AB 12):</span> Deposits are capped at 1 month&apos;s rent.
            </li>
          </ul>

          <p className="text-dark/50">
            Typical proportional rent for a {bedroomLabel} in Berkeley: <span className="font-medium">${low.toLocaleString()} - ${high.toLocaleString()}/mo</span>
          </p>

          {!isCompliant && (
            <p className="text-amber-700 font-medium">
              Your price of ${price.toLocaleString()}/mo is above the typical range for a {bedroomLabel}. Make sure it reflects proportional rent.
            </p>
          )}

          <p className="text-dark/40 text-xs">
            Learn more at Berkeley Rent Board
          </p>
        </div>
      </div>
    </div>
  );
}
