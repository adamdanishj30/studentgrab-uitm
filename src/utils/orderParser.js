import { matchLocation } from './fareCalculator';
import { ALL_LOCATIONS } from '../data/priceData';

/**
 * Parses raw WhatsApp / Telegram copy-paste order message
 */
export function parseOrderText(text) {
  if (!text || typeof text !== 'string') {
    return null;
  }

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return null;

  let passengerName = '';
  let pickupStr = '';
  let dropStr = '';
  let pax = 1;
  let notes = '';
  let detectedSurcharges = {
    rain: false,
    heavyLuggage: false,
    peakHour: false,
    midnight: false,
  };

  // 1. Detect passenger name
  // Often in format: "🚗 durrz 🍀 🌻" or "Name: durrz"
  for (let i = 0; i < Math.min(3, lines.length); i++) {
    const line = lines[i];
    if (line.includes('🚗')) {
      passengerName = line.replace('🚗', '').trim();
      break;
    } else if (/^(name|nama)\s*[:=-]\s*(.+)$/i.test(line)) {
      const match = line.match(/^(name|nama)\s*[:=-]\s*(.+)$/i);
      passengerName = match[2].trim();
      break;
    }
  }

  // If still empty and line 0 doesn't look like a field header, use line 0
  if (!passengerName && lines[0] && !lines[0].toLowerCase().includes('pickup') && !lines[0].toLowerCase().includes('drop')) {
    passengerName = lines[0].replace(/^[^\w\s]+/, '').trim();
  }

  // 2. Loop through all lines for pickup, drop, pax, notes
  for (const line of lines) {
    const lower = line.toLowerCase();

    // Pickup
    if (lower.startsWith('pickup:') || lower.startsWith('pick up:') || lower.startsWith('dari:') || lower.startsWith('from:') || lower.startsWith('ambik:')) {
      pickupStr = line.replace(/^(pickup|pick up|dari|from|ambik)\s*[:=-]\s*/i, '').trim();
    }

    // Drop
    else if (lower.startsWith('drop:') || lower.startsWith('dropoff:') || lower.startsWith('drop off:') || lower.startsWith('ke:') || lower.startsWith('to:') || lower.startsWith('hantar:')) {
      dropStr = line.replace(/^(drop|dropoff|drop off|ke|to|hantar)\s*[:=-]\s*/i, '').trim();
    }

    // Pax
    else if (lower.startsWith('pax:') || lower.startsWith('orang:') || lower.startsWith('org:') || lower.startsWith('passengers:')) {
      const paxMatch = line.match(/\d+/);
      if (paxMatch) {
        pax = parseInt(paxMatch[0], 10) || 1;
      }
    }

    // Keyword detection in text
    if (lower.includes('hujan') || lower.includes('rain')) {
      detectedSurcharges.rain = true;
    }
    if (lower.includes('luggage') || lower.includes('beg besar') || lower.includes('kotak') || lower.includes('balik kampung')) {
      detectedSurcharges.heavyLuggage = true;
    }
    if (lower.includes('peak') || lower.includes('jem') || lower.includes('sesak')) {
      detectedSurcharges.peakHour = true;
    }
    if (lower.includes('tengah malam') || lower.includes('midnight') || lower.includes('pagar tutup') || lower.includes('gate closed')) {
      detectedSurcharges.midnight = true;
    }
  }

  // Clean values
  pickupStr = pickupStr || 'UiTM Shah Alam';
  dropStr = dropStr || '';

  // Match locations in database
  const matchedPickup = matchLocation(pickupStr);
  const matchedDrop = matchLocation(dropStr);

  return {
    rawText: text,
    passengerName: passengerName || 'UiTM Student',
    pickupQuery: pickupStr,
    dropQuery: dropStr,
    matchedPickup,
    matchedDrop,
    pax: Math.min(Math.max(pax, 1), 6),
    detectedSurcharges,
  };
}

/**
 * Generates ready-to-copy WhatsApp/Telegram order message for students
 */
export function formatStudentOrderTemplate({
  name = 'UiTM Student',
  pickup = 'Kolej Mawar',
  drop = 'Pusat Komersial Seksyen 7',
  pax = 1,
  fareRange = 'RM 7 ~ 11',
  notes = '',
}) {
  return `🚗 ${name}

pickup: ${pickup}
drop: ${drop}
pax: ${pax}
budget / rate: ${fareRange} (Official Floor Rate)
${notes ? `notes: ${notes}\n` : ''}pm rate

🤠 Verified drivers will contact you
✅ Press 'Taken' if you found a driver`;
}

/**
 * Generates quote response for drivers to send to students
 */
export function formatDriverQuoteReply({
  driverName = 'Driver',
  pickup = 'Kolej Mawar',
  drop = 'Pusat Komersial Seksyen 7',
  fareRange = 'RM 7 ~ 11',
  surchargeNotes = '',
}) {
  return `🚗 UiTM TRANSPORTER QUOTE 🚗
Hi! Saya available untuk pickup.

📍 Dari: ${pickup}
🎯 Ke: ${drop}
💰 Rate: ${fareRange} (Official Floor Rate)
${surchargeNotes ? `📌 Termasuk: ${surchargeNotes}\n` : ''}
⚡ Siap sedia untuk pickup. Sila PM untuk confirm & set masa!`;
}
