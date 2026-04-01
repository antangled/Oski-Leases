import { useState } from 'react';
import { Camera, Download, ChevronDown, ChevronUp, ClipboardCheck } from 'lucide-react';

interface Props {
  mode: 'move-in' | 'move-out';
}

interface ItemState {
  condition: string;
  notes: string;
}

const SECTIONS = [
  { name: 'Kitchen', items: ['Walls', 'Floors', 'Fixtures', 'Appliances', 'Windows'] },
  { name: 'Bathroom', items: ['Walls', 'Floors', 'Fixtures', 'Appliances', 'Windows'] },
  { name: 'Bedroom', items: ['Walls', 'Floors', 'Fixtures', 'Appliances', 'Windows'] },
  { name: 'Living Room', items: ['Walls', 'Floors', 'Fixtures', 'Appliances', 'Windows'] },
  { name: 'General', items: ['Walls', 'Floors', 'Fixtures', 'Appliances', 'Windows'] },
];

const CONDITIONS = ['Excellent', 'Good', 'Fair', 'Damaged'] as const;

const CONDITION_COLORS: Record<string, string> = {
  Excellent: 'bg-green-100 text-green-700 border-green-300',
  Good: 'bg-blue-50 text-blue-700 border-blue-300',
  Fair: 'bg-amber-50 text-amber-700 border-amber-300',
  Damaged: 'bg-red-50 text-red-700 border-red-300',
};

type ChecklistData = Record<string, Record<string, ItemState>>;

function initData(): ChecklistData {
  const data: ChecklistData = {};
  for (const section of SECTIONS) {
    data[section.name] = {};
    for (const item of section.items) {
      data[section.name][item] = { condition: '', notes: '' };
    }
  }
  return data;
}

export default function MoveChecklist({ mode }: Props) {
  const [data, setData] = useState<ChecklistData>(initData);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const e: Record<string, boolean> = {};
    SECTIONS.forEach((s) => (e[s.name] = true));
    return e;
  });

  const toggleSection = (name: string) =>
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));

  const setCondition = (section: string, item: string, condition: string) =>
    setData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [item]: { ...prev[section][item], condition } },
    }));

  const setNotes = (section: string, item: string, notes: string) =>
    setData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [item]: { ...prev[section][item], notes } },
    }));

  // Summary stats
  const allItems = SECTIONS.flatMap((s) => s.items.map((i) => data[s.name][i]));
  const filled = allItems.filter((i) => i.condition).length;
  const total = allItems.length;
  const conditionCounts = CONDITIONS.reduce(
    (acc, c) => ({ ...acc, [c]: allItems.filter((i) => i.condition === c).length }),
    {} as Record<string, number>,
  );

  const handleDownload = () => {
    let text = `${mode === 'move-in' ? 'MOVE-IN' : 'MOVE-OUT'} CONDITION CHECKLIST\n`;
    text += `Date: ${new Date().toLocaleDateString()}\n\n`;

    for (const section of SECTIONS) {
      text += `--- ${section.name.toUpperCase()} ---\n`;
      for (const item of section.items) {
        const state = data[section.name][item];
        text += `  ${item}: ${state.condition || 'Not assessed'}`;
        if (state.notes) text += ` | Notes: ${state.notes}`;
        text += '\n';
      }
      text += '\n';
    }

    text += '\nSublessor Signature: ________________________  Date: ___________\n';
    text += 'Sublessee Signature: ________________________  Date: ___________\n';

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${mode}-checklist.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardCheck size={20} className="text-gold" />
          <h3 className="text-lg font-semibold font-display text-dark">
            {mode === 'move-in' ? 'Move-In' : 'Move-Out'} Checklist
          </h3>
        </div>
        <span className="text-xs text-dark/50">{filled}/{total} assessed</span>
      </div>

      {/* Sections */}
      {SECTIONS.map((section) => (
        <div key={section.name} className="bg-cream rounded-2xl border border-dark/8 shadow-md overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection(section.name)}
            className="w-full flex items-center justify-between px-4 py-3 bg-transparent border-none cursor-pointer text-left"
          >
            <span className="text-sm font-semibold font-display text-dark">{section.name}</span>
            {expanded[section.name] ? (
              <ChevronUp size={16} className="text-dark/40" />
            ) : (
              <ChevronDown size={16} className="text-dark/40" />
            )}
          </button>

          {expanded[section.name] && (
            <div className="px-4 pb-4 space-y-3">
              {section.items.map((item) => {
                const state = data[section.name][item];
                return (
                  <div key={item} className="bg-white rounded-xl p-3 border border-dark/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-dark">{item}</span>
                      <button
                        type="button"
                        className="flex items-center gap-1 text-xs text-dark/40 hover:text-dark/60 transition-colors cursor-pointer bg-transparent border-none"
                      >
                        <Camera size={12} />
                        Add Photo
                      </button>
                    </div>

                    {/* Condition radio buttons */}
                    <div className="flex gap-1.5 mb-2">
                      {CONDITIONS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setCondition(section.name, item, c)}
                          className={`px-2.5 py-1 text-xs rounded-lg border transition-all cursor-pointer ${
                            state.condition === c
                              ? CONDITION_COLORS[c]
                              : 'bg-white text-dark/40 border-dark/10 hover:border-dark/20'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>

                    {/* Notes */}
                    <textarea
                      placeholder="Notes (optional)"
                      value={state.notes}
                      onChange={(e) => setNotes(section.name, item, e.target.value)}
                      rows={1}
                      className="w-full px-2.5 py-1.5 text-xs border border-dark/8 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 bg-white text-dark resize-y"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}

      {/* Summary */}
      <div className="bg-cream rounded-2xl border border-dark/8 shadow-md p-4">
        <h4 className="text-sm font-semibold font-display text-dark mb-2">Summary</h4>
        <div className="flex gap-3 flex-wrap">
          {CONDITIONS.map((c) => (
            <div key={c} className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${CONDITION_COLORS[c]}`}>
              {c}: {conditionCounts[c]}
            </div>
          ))}
        </div>
        {total - filled > 0 && (
          <p className="text-xs text-dark/40 mt-2">{total - filled} items not yet assessed</p>
        )}
      </div>

      {/* Download */}
      <button
        type="button"
        onClick={handleDownload}
        className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-dark bg-gold rounded-xl hover:bg-gold-dark transition-colors cursor-pointer border-none"
      >
        <Download size={16} />
        Download Checklist
      </button>
    </div>
  );
}
