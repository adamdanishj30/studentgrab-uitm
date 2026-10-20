import React, { useState } from 'react';
import { ClipboardPaste, Sparkles, Check, RotateCcw } from 'lucide-react';
import { parseOrderText } from '../../utils/orderParser';

const EXAMPLE_DURRZ = `🚗 durrz 🍀 🌻

pickup: kolej mawar
drop: one utama mall
pax: 1
pm rate

🤠 Verified drivers will contact you
✅ Press 'Taken' if you found a driver`;

const EXAMPLE_AMYRA = `🚗 amyra 🍳

pickup: dewan seri budiman
drop: kolej meranti
pax: 2
pm rate

🤠 Verified drivers will contact you
✅ Press 'Taken' if you found a driver`;

export default function OrderParserBox({ onApplyParsedOrder }) {
  const [inputText, setInputText] = useState('');
  const [isParsed, setIsParsed] = useState(false);
  const [parsedData, setParsedData] = useState(null);

  const handleParse = (textToParse = inputText) => {
    if (!textToParse.trim()) return;
    const result = parseOrderText(textToParse);
    setParsedData(result);
    setIsParsed(true);
    if (onApplyParsedOrder) {
      onApplyParsedOrder(result);
    }
  };

  const handleLoadSample = (sample) => {
    setInputText(sample);
    handleParse(sample);
  };

  const handleClear = () => {
    setInputText('');
    setIsParsed(false);
    setParsedData(null);
  };

  return (
    <div className="bg-white rounded-[32px] p-5 sm:p-6 border border-stone-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] mb-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-[#1E2E1E] flex items-center gap-1.5">
            <ClipboardPaste className="w-4 h-4 text-[#3B4D3B]" />
            Smart Order Paste
          </h2>
          <p className="text-[11px] text-[#6B756B]">
            Paste Telegram / WhatsApp booking templates to auto-extract routes & rates
          </p>
        </div>

        {/* Quick Sample Pills */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-stone-400">Samples:</span>
          <button
            type="button"
            onClick={() => handleLoadSample(EXAMPLE_DURRZ)}
            className="text-[11px] bg-[#F0EFEA] hover:bg-[#E4EAE4] text-[#1E2E1E] px-2.5 py-1 rounded-full font-semibold transition-colors"
          >
            Durrz (1 Utama)
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample(EXAMPLE_AMYRA)}
            className="text-[11px] bg-[#F0EFEA] hover:bg-[#E4EAE4] text-[#1E2E1E] px-2.5 py-1 rounded-full font-semibold transition-colors"
          >
            Amyra (Internal)
          </button>
        </div>
      </div>

      {/* Text Area */}
      <div className="relative">
        <textarea
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            setIsParsed(false);
          }}
          placeholder="Paste order here, e.g.&#10;🚗 durrz 🍀 🌻&#10;pickup: kolej mawar&#10;drop: one utama mall&#10;pax: 1&#10;pm rate"
          rows={3}
          className="w-full bg-[#F7F6F1] border border-stone-200/80 rounded-2xl p-3 text-xs sm:text-sm font-mono text-[#1E2E1E] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1E2E1E]/20 resize-y"
        />

        {inputText && (
          <button
            onClick={handleClear}
            className="absolute top-2.5 right-2.5 text-stone-400 hover:text-stone-700 p-1 rounded-md bg-white/80"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Button & Summary */}
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => handleParse()}
          disabled={!inputText.trim()}
          className="flex items-center justify-center gap-2 bg-[#1E2E1E] hover:bg-[#2A3E2A] disabled:opacity-40 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-2xl shadow-xs transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Auto-Detect & Calculate Rate</span>
        </button>

        {isParsed && parsedData && (
          <div className="flex items-center gap-2 text-xs bg-[#E7ECE7] text-[#1E2E1E] px-3 py-1.5 rounded-xl font-medium">
            <Check className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
            <span>
              Detected: <strong>{parsedData.passengerName}</strong> • {parsedData.pax} pax
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
