import React, { useState } from 'react';
import { ClipboardPaste, Sparkles, Check, ArrowRight, CornerDownRight, RotateCcw } from 'lucide-react';
import { parseOrderText } from '../utils/orderParser';

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

const EXAMPLE_SEK7 = `🚗 Danish ⚡

pickup: Kolej Perindu
drop: Pusat Komersial Seksyen 7
pax: 3
ada beg berat & hujan lebat
pm rate`;

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
    <div className="bg-slate-800/80 backdrop-blur-sm border border-purple-800/40 rounded-2xl p-4 sm:p-5 shadow-lg shadow-purple-950/20 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <ClipboardPaste className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              Smart Order Paste & Auto-Parser
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-medium">
                Telegram / WhatsApp
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Paste standard student booking message to automatically extract route, pax, and surcharges.
            </p>
          </div>
        </div>

        {/* Quick Sample Loaders */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-400">Try samples:</span>
          <button
            type="button"
            onClick={() => handleLoadSample(EXAMPLE_DURRZ)}
            className="text-[11px] bg-slate-700/80 hover:bg-purple-700/60 text-slate-200 hover:text-white border border-slate-600 px-2.5 py-1 rounded-lg transition-colors font-mono"
          >
            Durrz (1 Utama)
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample(EXAMPLE_AMYRA)}
            className="text-[11px] bg-slate-700/80 hover:bg-purple-700/60 text-slate-200 hover:text-white border border-slate-600 px-2.5 py-1 rounded-lg transition-colors font-mono"
          >
            Amyra (Internal)
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample(EXAMPLE_SEK7)}
            className="text-[11px] bg-slate-700/80 hover:bg-purple-700/60 text-slate-200 hover:text-white border border-slate-600 px-2.5 py-1 rounded-lg transition-colors font-mono hidden sm:inline-block"
          >
            Danish (Sek 7)
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
          rows={4}
          className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all resize-y"
        />

        {inputText && (
          <button
            onClick={handleClear}
            className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-200 p-1 rounded-md bg-slate-800/80 hover:bg-slate-700 transition-colors"
            title="Clear text"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Parse Action Button & Parsed Summary */}
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => handleParse()}
          disabled={!inputText.trim()}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-purple-950/40 transition-all"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Auto-Detect & Calculate Rate</span>
        </button>

        {isParsed && parsedData && (
          <div className="flex items-center gap-2 text-xs bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 px-3 py-1.5 rounded-xl animate-fade-in">
            <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>
              Detected: <strong>{parsedData.passengerName}</strong> • {parsedData.pickupQuery} ➜ {parsedData.dropQuery} ({parsedData.pax} pax)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
