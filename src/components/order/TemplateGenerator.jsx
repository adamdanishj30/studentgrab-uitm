import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Smartphone, 
  MessageSquare 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatStudentOrderTemplate, formatDriverQuoteReply } from '../../utils/orderParser';

export default function TemplateGenerator({ tripData, estimate, appMode }) {
  const [activeTab, setActiveTab] = useState(appMode === 'driver' ? 'driver' : 'student');
  const [copied, setCopied] = useState(false);
  const [customNotes, setCustomNotes] = useState('');

  React.useEffect(() => {
    setActiveTab(appMode === 'driver' ? 'driver' : 'student');
  }, [appMode]);

  const passengerName = tripData.passengerName || 'UiTM Student';
  const pickup = tripData.pickupLocation ? tripData.pickupLocation.name : (tripData.pickupName || 'UiTM Shah Alam');
  const drop = tripData.dropLocation ? tripData.dropLocation.name : (tripData.dropName || 'Destination');
  const pax = tripData.pax || 1;
  const fareRange = estimate ? estimate.fareRangeString : 'RM 7 ~ 11';

  const surchargeNotesList = [];
  if (tripData.isPeakHour) surchargeNotesList.push('Peak Hour');
  if (tripData.isRainy) surchargeNotesList.push('Hujan');
  if (tripData.isMidnight) surchargeNotesList.push('Midnight');
  if (tripData.hasHeavyLuggage) surchargeNotesList.push('Luggage');
  if (tripData.tollAmount > 0) surchargeNotesList.push(`Toll RM${tripData.tollAmount}`);
  const surchargeNotesStr = surchargeNotesList.join(', ');

  const studentTemplate = formatStudentOrderTemplate({
    name: passengerName,
    pickup,
    drop,
    pax,
    fareRange,
    notes: customNotes,
  });

  const driverTemplate = formatDriverQuoteReply({
    driverName: 'UiTM Transporter',
    pickup,
    drop,
    fareRange,
    surchargeNotes: surchargeNotesStr,
  });

  const currentTemplate = activeTab === 'student' ? studentTemplate : driverTemplate;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentTemplate).then(() => {
      setCopied(true);
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.8 },
      });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(currentTemplate);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="bg-white rounded-[32px] p-5 sm:p-6 border border-stone-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] mb-5">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-[#1E2E1E]">
            Template Generator
          </h2>
          <p className="text-[11px] text-[#6B756B]">
            Formatted for WhatsApp & Telegram student groups
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-[#F0EFEA] p-0.5 rounded-full flex items-center text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('student')}
            className={`px-3 py-1 rounded-full transition-all ${
              activeTab === 'student'
                ? 'bg-[#1E2E1E] text-white shadow-xs font-bold'
                : 'text-[#6B756B] hover:text-[#1E2E1E]'
            }`}
          >
            Student Post
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('driver')}
            className={`px-3 py-1 rounded-full transition-all ${
              activeTab === 'driver'
                ? 'bg-[#1E2E1E] text-white shadow-xs font-bold'
                : 'text-[#6B756B] hover:text-[#1E2E1E]'
            }`}
          >
            Driver Reply
          </button>
        </div>
      </div>

      {/* Notes Field */}
      {activeTab === 'student' && (
        <div className="mb-2.5">
          <input
            type="text"
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            placeholder="Add note (e.g. ada barang banyak / urgent)"
            className="w-full bg-[#F7F6F1] border border-stone-200/80 rounded-xl px-3 py-1.5 text-xs text-[#1E2E1E] placeholder-stone-400 focus:outline-none"
          />
        </div>
      )}

      {/* Code Preview */}
      <pre className="w-full bg-[#F7F6F1] border border-stone-200/80 rounded-2xl p-3.5 text-xs font-mono text-[#1E2E1E] leading-relaxed overflow-x-auto whitespace-pre-wrap select-all">
        {currentTemplate}
      </pre>

      {/* Action Buttons */}
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-xs ${
            copied
              ? 'bg-emerald-700 text-white'
              : 'bg-[#1E2E1E] hover:bg-[#2A3E2A] text-white'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Template</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleShareWhatsApp}
          className="flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all"
        >
          <Smartphone className="w-4 h-4" />
          <span>WhatsApp</span>
        </button>
      </div>
    </div>
  );
}
