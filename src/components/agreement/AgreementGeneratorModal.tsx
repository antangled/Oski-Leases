import { useState, useRef } from 'react';
import type { Listing } from '../../types/listing';
import { X, Printer, FileText, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  listing: Listing;
  onClose: () => void;
}

const UTILITIES = ['Water', 'Gas', 'Electricity', 'Internet', 'Trash', 'Laundry'];

export default function AgreementGeneratorModal({ listing, onClose }: Props) {
  const [sublesseeName, setSublesseeName] = useState('');
  const [deposit, setDeposit] = useState(String(listing.price));
  const [utilities, setUtilities] = useState<string[]>(listing.utilitiesIncluded ? [...UTILITIES] : []);
  const [houseRules, setHouseRules] = useState('');
  const [specialTerms, setSpecialTerms] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const toggleUtility = (u: string) =>
    setUtilities((prev) => (prev.includes(u) ? prev.filter((x) => x !== u) : [...prev, u]));

  const startDate = new Date(listing.availability.start + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
  const endDate = new Date(listing.availability.end + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`
      <html><head><title>Sublease Agreement</title>
      <style>
        body { font-family: Georgia, serif; max-width: 700px; margin: 40px auto; padding: 20px; color: #1a1a1a; line-height: 1.6; font-size: 13px; }
        h1 { text-align: center; font-size: 20px; margin-bottom: 4px; }
        h2 { font-size: 15px; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-top: 24px; }
        .sig { margin-top: 48px; display: flex; justify-content: space-between; }
        .sig-line { width: 45%; border-top: 1px solid #333; padding-top: 4px; }
      </style></head><body>${content.innerHTML}</body></html>
    `);
    w.document.close();
    w.print();
  };

  const inputCls = 'w-full px-3 py-2.5 text-sm border border-dark/12 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 bg-white text-dark';

  const agreementText = () => (
    <div ref={printRef}>
      <h1>RESIDENTIAL SUBLEASE AGREEMENT</h1>
      <p style={{ textAlign: 'center', color: '#666', fontSize: '12px' }}>City of Berkeley, Alameda County, California</p>

      <h2>1. Parties</h2>
      <p>
        This Sublease Agreement is entered into between <strong>{listing.listerName}</strong> (&quot;Sublessor&quot;)
        and <strong>{sublesseeName || '________________________'}</strong> (&quot;Sublessee&quot;).
      </p>

      <h2>2. Premises</h2>
      <p>
        The Sublessor agrees to sublease the premises located at <strong>{listing.location.address}</strong>,
        consisting of {listing.bedrooms === 0 ? 'a studio' : `${listing.bedrooms} bedroom(s)`} and {listing.bathrooms} bathroom(s).
      </p>

      <h2>3. Term</h2>
      <p>
        The sublease shall commence on <strong>{startDate}</strong> and terminate on <strong>{endDate}</strong>.
      </p>

      <h2>4. Financial Terms</h2>
      <p>
        Monthly rent: <strong>${listing.price.toLocaleString()}</strong>, due on the 1st of each month.<br />
        Security deposit: <strong>${Number(deposit).toLocaleString()}</strong> (not to exceed one month&apos;s rent per California Civil Code Section 1950.5 and AB 12).
      </p>
      <p>
        Included utilities: {utilities.length > 0 ? utilities.join(', ') : 'None'}.
      </p>

      <h2>5. House Rules</h2>
      <p>{houseRules || 'No additional house rules specified.'}</p>

      <h2>6. Special Terms</h2>
      <p>{specialTerms || 'No special terms.'}</p>

      <h2>7. Legal Provisions</h2>
      <p>
        This sublease is subject to California Civil Code Sections 1950.5-1954 and the Berkeley Rent Stabilization and Eviction for Good Cause Ordinance (BMC Chapter 13.76).
        The Sublessor represents that they have obtained written consent from the landlord or that consent is not required under the terms of the master lease.
        The Sublessee shall not be charged more than the Sublessor&apos;s proportional share of rent as required by Berkeley Rent Board regulations.
      </p>

      <h2>8. Condition of Premises</h2>
      <p>
        Both parties shall complete a move-in/move-out condition checklist. The premises shall be returned in substantially the same condition, reasonable wear and tear excepted.
      </p>

      <div className="sig" style={{ marginTop: '48px', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '45%', borderTop: '1px solid #333', paddingTop: '4px' }}>
          <p>{listing.listerName} (Sublessor)<br />Date: _______________</p>
        </div>
        <div style={{ width: '45%', borderTop: '1px solid #333', paddingTop: '4px' }}>
          <p>{sublesseeName || '________________________'} (Sublessee)<br />Date: _______________</p>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-dark/60 backdrop-blur-sm flex items-start justify-center p-4 pt-8 pb-8"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-cream rounded-2xl shadow-md border border-dark/8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-cream border-b border-dark/8 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-gold" />
            <h2 className="text-lg font-semibold font-display text-dark">Generate Sublease Agreement</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-dark/5 transition-colors cursor-pointer bg-transparent border-none">
            <X size={20} className="text-dark/50" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Parties */}
          <section>
            <h3 className="text-sm font-semibold font-display text-dark mb-3">Parties</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-dark/60 mb-1">Sublessor</label>
                <input type="text" value={listing.listerName} disabled className={`${inputCls} bg-dark/5 text-dark/60`} />
              </div>
              <div>
                <label className="block text-xs text-dark/60 mb-1">Sublessee Name</label>
                <input
                  type="text"
                  placeholder="Enter sublessee name"
                  value={sublesseeName}
                  onChange={(e) => setSublesseeName(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
          </section>

          {/* Premises */}
          <section>
            <h3 className="text-sm font-semibold font-display text-dark mb-3">Premises</h3>
            <input type="text" value={listing.location.address} disabled className={`${inputCls} bg-dark/5 text-dark/60`} />
            <div className="grid grid-cols-3 gap-3 mt-2">
              <div className="text-xs text-dark/50">
                {listing.bedrooms === 0 ? 'Studio' : `${listing.bedrooms} BR`} / {listing.bathrooms} BA
              </div>
              <div className="text-xs text-dark/50">{startDate}</div>
              <div className="text-xs text-dark/50">to {endDate}</div>
            </div>
          </section>

          {/* Financial Terms */}
          <section>
            <h3 className="text-sm font-semibold font-display text-dark mb-3">Financial Terms</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-dark/60 mb-1">Monthly Rent</label>
                <input type="text" value={`$${listing.price.toLocaleString()}`} disabled className={`${inputCls} bg-dark/5 text-dark/60`} />
              </div>
              <div>
                <label className="block text-xs text-dark/60 mb-1">Security Deposit</label>
                <input
                  type="number"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                  className={inputCls}
                />
                {Number(deposit) > listing.price && (
                  <p className="text-red-500 text-xs mt-1">Deposit cannot exceed 1 month&apos;s rent (CA AB 12)</p>
                )}
              </div>
            </div>
          </section>

          {/* Utilities */}
          <section>
            <h3 className="text-sm font-semibold font-display text-dark mb-3">Included Utilities</h3>
            <div className="grid grid-cols-3 gap-2">
              {UTILITIES.map((u) => (
                <label key={u} className="flex items-center gap-2 cursor-pointer text-sm text-dark">
                  <input
                    type="checkbox"
                    checked={utilities.includes(u)}
                    onChange={() => toggleUtility(u)}
                    className="w-4 h-4 rounded border-dark/20 text-gold focus:ring-gold/30 accent-gold"
                  />
                  {u}
                </label>
              ))}
            </div>
          </section>

          {/* Rules */}
          <section>
            <h3 className="text-sm font-semibold font-display text-dark mb-3">House Rules</h3>
            <textarea
              placeholder="e.g. Quiet hours after 10pm, no smoking, guest policies..."
              value={houseRules}
              onChange={(e) => setHouseRules(e.target.value)}
              rows={3}
              className={`${inputCls} resize-y`}
            />
          </section>

          {/* Special Terms */}
          <section>
            <h3 className="text-sm font-semibold font-display text-dark mb-3">Special Terms</h3>
            <textarea
              placeholder="Any additional terms or conditions..."
              value={specialTerms}
              onChange={(e) => setSpecialTerms(e.target.value)}
              rows={2}
              className={`${inputCls} resize-y`}
            />
          </section>

          {/* Preview Toggle */}
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 text-sm font-medium text-gold hover:text-gold-dark transition-colors cursor-pointer bg-transparent border-none"
          >
            {showPreview ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showPreview ? 'Hide Preview' : 'Show Agreement Preview'}
          </button>

          {showPreview && (
            <div className="bg-white rounded-xl border border-dark/10 p-6 text-sm text-dark/80 leading-relaxed">
              {agreementText()}
            </div>
          )}

          {/* Hidden print div (always rendered for ref) */}
          {!showPreview && <div className="hidden">{agreementText()}</div>}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-dark bg-gold rounded-xl hover:bg-gold-dark transition-colors cursor-pointer border-none"
            >
              <Printer size={16} />
              Print Agreement
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-medium text-dark/60 bg-white rounded-xl border border-dark/12 hover:bg-dark/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
