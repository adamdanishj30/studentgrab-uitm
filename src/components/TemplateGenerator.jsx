import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Share2, 
  Send, 
  MessageSquare, 
  Sparkles,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatStudentOrderTemplate, formatDriverQuoteReply } from '../utils/orderParser';

export default function TemplateGenerator({ tripData, estimate, appMode }) {
  const [activeTab, setActiveTab] = useState(appMode === 'driver' ? 'driver' : 'student');
  const [copied, setCopied] = useState(false);
  const [customNotes, setCustomNotes] = useState('');

  // Sync tab if user toggles appMode
  React.useEffect(() => {
    setActiveTab(appMode === 'driver' ? 'driver' : 'student');
  }, [appMode]);

  const passengerName = tripData.passengerName || 'UiTM Student';
  const pickup = tripData.pickupLocation ? tripData.pickupLocation.name : (tripData.pickupName || 'UiTM Shah Alam');
  const drop = tripData.dropLocation ? tripData.dropLocation.name : (tripData.dropName || 'Destination');
  const pax = tripData.pax || 1;
  const fareRange = estimate ? estimate.fareRangeString : 'RM 7 ~ 11';

  // Surcharge notes for driver quote
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
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
      });
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(currentTemplate);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-xl mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-3 mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            <span>Copy-Paste Template Generator</span>
          </h2>
          <p className="text-xs text-slate-400">
            Ready-formatted template for UiTM WhatsApp & Telegram booking groups.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-900 border border-slate-700 p-0.5 rounded-xl flex items-center self-start sm:self-auto text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('student')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'student'
                ? 'bg-purple-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Student Booking Post
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('driver')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'driver'
                ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Driver Quote Reply
          </button>
        </div>
      </div>

      {/* Optional Note for student post */}
      {activeTab === 'student' && (
        <div className="mb-3">
          <input
            type="text"
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            placeholder="Optional order note (e.g. ada barang banyak / nak cepat)"
            className="w-full bg-slate-900/70 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>
      )}

      {/* Code / Template Preview */}
      <div className="relative">
        <pre className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-emerald-300 leading-relaxed overflow-x-auto whitespace-pre-wrap select-all">
          {currentTemplate}
        </pre>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={handleCopy}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl shadow-md transition-all ${
            copied
              ? 'bg-emerald-600 text-white'
              : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/30'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-amber-300" />
              <span>Copy Template</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleShareWhatsApp}
          className="flex items-center justify-center gap-2 bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl transition-all shadow-md"
          title="Share directly via WhatsApp"
        >
          <Smartphone className="w-4 h-4" />
          <span>WhatsApp Direct</span>
        </button>
      </div>
    </div>
  );
}
