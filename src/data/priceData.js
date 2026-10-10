// Official UiTM Shah Alam Transporter Pricing Database (Effective 1st April 2026)

export const SURCHARGE_RULES = {
  peakHour: {
    name: 'Peak Hours',
    description: '7:30–9:30 AM & 5:00–8:00 PM',
    min: 2,
    max: 5,
    isPeakNow: (date = new Date()) => {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const timeInMinutes = hours * 60 + minutes;
      
      // 7:30 AM (450) to 9:30 AM (570)
      const morningPeak = timeInMinutes >= 450 && timeInMinutes <= 570;
      // 5:00 PM (1020) to 8:00 PM (1200)
      const eveningPeak = timeInMinutes >= 1020 && timeInMinutes <= 1200;
      
      return morningPeak || eveningPeak;
    }
  },
  rainyWeather: {
    name: 'Rainy Weather',
    description: 'Heavy rain, slippery roads, slow traffic',
    min: 2,
    max: 4,
  },
  midnight: {
    name: 'Midnight / Gate Closed',
    description: '12:00 AM – 6:00 AM (College gate checks / late night)',
    min: 2,
    max: 4,
    isMidnightNow: (date = new Date()) => {
      const hours = date.getHours();
      return hours >= 0 && hours < 6;
    }
  },
  mpvMultiplier: {
    name: 'MPV (5-6 Pax)',
    description: '1.5x Base Fare multiplier for larger groups',
    multiplier: 1.5,
  },
  heavyLuggage: {
    name: 'Heavy Luggage',
    description: 'Balik kampung boxes, oversized trolley bags',
    min: 2,
    max: 4,
  },
  lateFeePer10Min: {
    name: 'Late Fee (Waiting Time)',
    description: 'RM 1 per 10 minutes waiting time',
    ratePer10Min: 1,
  }
};

export const ZONES = {
  INTERNAL_UITM: {
    id: 'INTERNAL_UITM',
    title: 'UiTM Shah Alam (Internal)',
    subtitle: 'Kolej to Kolej, Faculties, Halls & Campus Gates',
    baseMin: 5,
    baseMax: 8,
    color: 'emerald',
    badge: '🏫 Campus Internal',
    locations: [
      { name: 'Kolej Mawar', category: 'Kolej Kediaman', keywords: ['mawar', 'kolej mawar'] },
      { name: 'Kolej Meranti', category: 'Kolej Kediaman', keywords: ['meranti', 'kolej meranti'] },
      { name: 'Kolej Melati', category: 'Kolej Kediaman', keywords: ['melati', 'kolej melati'] },
      { name: 'Kolej Delima', category: 'Kolej Kediaman', keywords: ['delima', 'kolej delima'] },
      { name: 'Kolej Perindu', category: 'Kolej Kediaman', keywords: ['perindu', 'kolej perindu'] },
      { name: 'Kolej Seroja', category: 'Kolej Kediaman', keywords: ['seroja', 'kolej seroja'] },
      { name: 'Kolej Teratai', category: 'Kolej Kediaman', keywords: ['teratai', 'kolej teratai'] },
      { name: 'Kolej Dahlia', category: 'Kolej Kediaman', keywords: ['dahlia', 'kolej dahlia'] },
      { name: 'Kolej Akasia', category: 'Kolej Kediaman', keywords: ['akasia', 'kolej akasia'] },
      { name: 'Kolej Kenanga', category: 'Kolej Kediaman', keywords: ['kenanga', 'kolej kenanga'] },
      { name: 'Kolej Kasturi', category: 'Kolej Kediaman', keywords: ['kasturi', 'kolej kasturi'] },
      { name: 'Dewan Seri Budiman (DSB)', category: 'Campus Landmark', keywords: ['dewan seri budiman', 'dsb', 'seri budiman'] },
      { name: 'Dewan Agong Tuanku Canselor (DATC)', category: 'Campus Landmark', keywords: ['datc', 'dewan agong'] },
      { name: 'Menara SAAS (Chancellery)', category: 'Administrative', keywords: ['menara saas', 'saas', 'canseleri'] },
      { name: 'Perpustakaan Tun Abdul Razak (PTAR)', category: 'Library', keywords: ['ptar', 'perpustakaan', 'ptar 1', 'ptar 2'] },
      { name: 'Fakulti Sains Komputer & Matematik (FSKM)', category: 'Faculty', keywords: ['fskm', 'komputer', 'matematik'] },
      { name: 'Fakulti Kejuruteraan (FKE / FKM / FKK / FKA)', category: 'Faculty', keywords: ['engineering', 'fke', 'fkm', 'kejuruteraan'] },
      { name: 'Fakulti Komunikasi & Pengajian Media (Masscomm)', category: 'Faculty', keywords: ['masscomm', 'mass comm', 'komunikasi'] },
      { name: 'Fakulti Seni Lukis & Seni Reka (FSSR)', category: 'Faculty', keywords: ['fssr', 'seni lukis'] },
      { name: 'Fakulti Sains Pentadbiran (FSPPP)', category: 'Faculty', keywords: ['fsppp'] },
      { name: 'Fakulti Seni Bina & Ukur (FSPU)', category: 'Faculty', keywords: ['fspu'] },
      { name: 'Fakulti Undang-Undang (Law)', category: 'Faculty', keywords: ['law', 'undang-undang', 'fakulti undang-undang'] },
      { name: 'Pusat Kesihatan UiTM (PKU)', category: 'Medical', keywords: ['pku', 'klinik uitm', 'pusat kesihatan'] },
      { name: 'Stadium UiTM / Kompleks Sukan', category: 'Sports', keywords: ['stadium uitm', 'kompleks sukan', 'padang ragbi'] },
      { name: 'Pintu Utama UiTM (Main Gate)', category: 'Gates', keywords: ['pintu utama', 'main gate'] },
      { name: 'Pintu 2 UiTM', category: 'Gates', keywords: ['pintu 2'] },
      { name: 'Pintu 3 UiTM (Gate Seksyen 7)', category: 'Gates', keywords: ['pintu 3', 'gate sek 7'] },
    ]
  },
  SEKSYEN_7: {
    id: 'SEKSYEN_7',
    title: 'Seksyen 7 (General)',
    subtitle: 'Apartments, Pusat Komersial, Hospital & Food Spots',
    baseMin: 7,
    baseMax: 11,
    color: 'blue',
    badge: '🏢 Seksyen 7',
    locations: [
      { name: 'Apartment Baiduri', category: 'Residential', keywords: ['baiduri', 'apt baiduri', 'apartment baiduri'] },
      { name: 'Kristal View', category: 'Residential', keywords: ['kristal view', 'condo kristal view'] },
      { name: 'Kristal Height', category: 'Residential', keywords: ['kristal height', 'kristal heights'] },
      { name: 'Opal Condominium', category: 'Residential', keywords: ['opal', 'kondominium opal'] },
      { name: 'Puncak 7', category: 'Residential', keywords: ['puncak 7', 'residences puncak 7'] },
      { name: 'Flat PKNS Seksyen 7', category: 'Residential', keywords: ['flat pkns', 'flat seksyen 7', 'pkns sek 7'] },
      { name: 'Nilam Sari', category: 'Residential', keywords: ['nilam sari'] },
      { name: 'Danaumas Apartment', category: 'Residential', keywords: ['danaumas', 'danau mas'] },
      { name: 'Pusat Komersial Seksyen 7', category: 'Commercial', keywords: ['pusat komersial', 'pk sek 7', 'pusat komersil'] },
      { name: 'Giant Seksyen 7', category: 'Commercial', keywords: ['giant', 'giant sek 7', 'giant seksyen 7'] },
      { name: 'Jakel Seksyen 7', category: 'Commercial', keywords: ['jakel', 'jakel sek 7'] },
      { name: 'Nasi Kandar Saddam', category: 'Food Spot', keywords: ['saddam', 'nasi kandar saddam'] },
      { name: 'Mamak Hakim Lama / Baru', category: 'Food Spot', keywords: ['hakim', 'restoran hakim', 'hakim lama', 'hakim baru'] },
      { name: 'Hospital Shah Alam', category: 'Medical', keywords: ['hospital shah alam', 'hsa', 'hosp shah alam'] },
      { name: 'Klinik Kesihatan Seksyen 7', category: 'Medical', keywords: ['klinik kesihatan', 'kk sek 7'] },
      { name: 'SMK Seksyen 7', category: 'Education', keywords: ['smk seksyen 7', 'smk sek 7'] },
      { name: 'UNISEL Shah Alam', category: 'Education', keywords: ['unisel', 'universiti selangor'] },
      { name: 'KFC / McDonald’s Seksyen 7', category: 'Food Spot', keywords: ['mcd sek 7', 'kfc sek 7'] },
    ]
  },
  I_CITY: {
    id: 'I_CITY',
    title: 'Seksyen 7 - i-City Area (+RM 1)',
    subtitle: 'Central i-City Mall, i-Soho & BRS Warehouse',
    baseMin: 8,
    baseMax: 12, // RM 7~11 + RM 1 surcharge per official list
    color: 'indigo',
    badge: '🎡 i-City (+RM 1)',
    extraNotice: '+RM 1 i-City Area Surcharge included in base',
    locations: [
      { name: 'Central i-City Mall', category: 'Shopping Mall', keywords: ['central i-city', 'central icity', 'i-city mall'] },
      { name: 'i-Soho', category: 'Residential/Soho', keywords: ['i-soho', 'isohu', 'i soho'] },
      { name: 'i-Suite / i-City Theme Park', category: 'Theme Park/Condo', keywords: ['i-suite', 'icity theme park', 'waterworld icity'] },
      { name: 'Shopee Express BRS Warehouse', category: 'Warehouse', keywords: ['shopee express brs', 'brs warehouse', 'brs shopee'] },
    ]
  },
  NEARBY_SECTIONS: {
    id: 'NEARBY_SECTIONS',
    title: 'Nearby Sections (Sek 6, 9, 14, 16, U12)',
    subtitle: 'Seksyen 6, 9, 14 (Tasik), 16 (Suria Jaya/KTM Padang Jawa), U12',
    baseMin: 10,
    baseMax: 15,
    color: 'amber',
    badge: '📍 Nearby Sections',
    locations: [
      { name: 'Seksyen 6 - Kopi Pokok / Pasar', category: 'Seksyen 6', keywords: ['kopi pokok', 'seksyen 6', 'pasar seksyen 6', 'sek 6'] },
      { name: 'Seksyen 9 - Rosyam Mart', category: 'Seksyen 9', keywords: ['rosyam mart', 'rosyam', 'sek 9'] },
      { name: 'Seksyen 9 - Plaza Masalam', category: 'Seksyen 9', keywords: ['plaza masalam', 'masalam'] },
      { name: 'Seksyen 9 - Concorde Hotel', category: 'Seksyen 9', keywords: ['concorde', 'hotel concorde'] },
      { name: 'Seksyen 14 - Tasik Shah Alam', category: 'Seksyen 14', keywords: ['tasik shah alam', 'tasik sek 14', 'taman tasik'] },
      { name: 'Seksyen 16 - Suria Jaya', category: 'Seksyen 16', keywords: ['suria jaya', 'suria jaya mall', 'sofo suria jaya'] },
      { name: 'Seksyen 16 - KTM Padang Jawa', category: 'Public Transport', keywords: ['ktm padang jawa', 'padang jawa', 'stesen ktm padang jawa'] },
      { name: 'Seksyen 16 - Alam Avenue', category: 'Commercial', keywords: ['alam avenue', 'alam avenue 1', 'alam avenue 2'] },
      { name: 'Seksyen 16 - Ken Rimba', category: 'Residential', keywords: ['ken rimba', 'kondominium ken rimba'] },
      { name: 'Seksyen U12 - Pangsapuri Serai Wangi', category: 'Seksyen U12', keywords: ['serai wangi', 'pangsapuri serai wangi', 'u12', 'cahaya alam'] },
    ]
  },
  MID_DISTANCE: {
    id: 'MID_DISTANCE',
    title: 'Mid-Distance (Sek 13, 14, 17, U10/U11)',
    subtitle: 'Stadium, Lotus’s, MSU, SACC Mall, Terminal 17, Taman Botani',
    baseMin: 12,
    baseMax: 22,
    color: 'orange',
    badge: '📍 Mid-Distance',
    locations: [
      { name: 'Seksyen 13 - AEON Mall Shah Alam', category: 'Shopping Mall', keywords: ['aeon shah alam', 'aeon sa', 'aeon sek 13'] },
      { name: 'Seksyen 13 - Lotus’s Shah Alam', category: 'Commercial', keywords: ['lotus shah alam', 'lotuss', 'lotus sek 13', 'tesco shah alam'] },
      { name: 'Seksyen 13 - Stadium Shah Alam', category: 'Sports/Landmark', keywords: ['stadium shah alam', 'stadium sek 13'] },
      { name: 'Seksyen 13 - MSU (Management & Science University)', category: 'University', keywords: ['msu', 'management & science university', 'msu medical centre'] },
      { name: 'Seksyen 13 - Extreme Park', category: 'Sports', keywords: ['extreme park', 'burger king extreme park'] },
      { name: 'Seksyen 14 - SACC Mall', category: 'Shopping Mall', keywords: ['sacc mall', 'sacc'] },
      { name: 'Seksyen 14 - Kompleks PKNS', category: 'Shopping/Hub', keywords: ['kompleks pkns', 'pkns shah alam'] },
      { name: 'Seksyen 14 - Vista Alam', category: 'Residential', keywords: ['vista alam', 'kondominium vista alam'] },
      { name: 'Seksyen 14 - UTC Selangor / Anggerik Mall', category: 'Government Hub', keywords: ['utc', 'utc selangor', 'anggerik mall'] },
      { name: 'Seksyen 17 - Terminal 17 (Bus Hub)', category: 'Public Transport', keywords: ['terminal 17', 'stesen bas sek 17', 'bus hub sek 17'] },
      { name: 'Seksyen 17 - INTEC Education College', category: 'College', keywords: ['intec', 'intec sek 17'] },
      { name: 'Seksyen 17 - Columbia Asia Hospital', category: 'Medical', keywords: ['columbia asia', 'hospital columbia'] },
      { name: 'U10 / U11 - Taman Botani Negara Shah Alam', category: 'Recreation', keywords: ['taman botani', 'bukit cerakah', 'botani negara'] },
    ]
  },
  EXTENDED_AREA: {
    id: 'EXTENDED_AREA',
    title: 'Extended Area (Klang, Setia Alam, Subang, Sunway)',
    subtitle: 'Klang, Setia City Mall, Sunway Pyramid, LRT Subang, Warehouses',
    baseMin: 18,
    baseMax: 35,
    color: 'purple',
    badge: '📍 Extended Area',
    locations: [
      { name: 'Klang - AEON Mall Bukit Raja', category: 'Shopping Mall', keywords: ['aeon bukit raja', 'bukit raja', 'aeon klang'] },
      { name: 'Klang - Palm Garden Apartment', category: 'Residential', keywords: ['palm garden', 'palm garden klang'] },
      { name: 'Klang Town / Bandar Baru Klang', category: 'Town Hub', keywords: ['klang', 'bandar baru klang', 'bbk'] },
      { name: 'Setia Alam - Setia City Mall', category: 'Shopping Mall', keywords: ['setia city mall', 'scm', 'setia alam'] },
      { name: 'Subang Jaya - LRT Subang Jaya / SS15', category: 'Public Transport', keywords: ['lrt subang jaya', 'ss15', 'subang jaya'] },
      { name: 'Subang Jaya - LRT Glenmarie / Temasya', category: 'Public Transport', keywords: ['glenmarie', 'lrt glenmarie', 'temasya'] },
      { name: 'Sunway - Sunway Pyramid / Sunway Lagoon', category: 'Shopping Mall', keywords: ['sunway pyramid', 'sunway', 'sunway lagoon'] },
      { name: 'Sunway - Sunway / Monash University', category: 'University', keywords: ['sunway university', 'monash'] },
      { name: 'Petaling Jaya - One Utama Mall (1U)', category: 'Shopping Mall', keywords: ['one utama', '1 utama', 'one utama mall', 'bandar utama'] },
      { name: 'Petaling Jaya - Mid Valley Megamall', category: 'Shopping Mall', keywords: ['mid valley', 'midvalley'] },
      { name: 'Kuala Lumpur - KL Sentral', category: 'Transit Hub', keywords: ['kl sentral', 'nu sentral'] },
      { name: 'Seksyen 22 - Watson Warehouse', category: 'Warehouse', keywords: ['watson whse', 'watson warehouse', 'sek 22 watson'] },
      { name: 'U10 - Shopee Warehouse (Bukit Jelutong/U10)', category: 'Warehouse', keywords: ['shopee whse', 'shopee warehouse u10', 'shopee bukit jelutong'] },
      { name: 'Seksyen 19 - KTM Shah Alam', category: 'Public Transport', keywords: ['ktm shah alam', 'stesen ktm sek 19', 'sek 19'] },
      { name: 'Seksyen 18 / 20 / 24 Shah Alam', category: 'Suburbs', keywords: ['seksyen 18', 'seksyen 20', 'kpj selangor', 'seksyen 24'] },
      { name: 'U3 / U5 - Subang Perdana / Bestari', category: 'Suburbs', keywords: ['u3', 'u5', 'subang perdana', 'subang bestari'] },
    ]
  },
  LONG_DISTANCE: {
    id: 'LONG_DISTANCE',
    title: 'Long Distance (Airports, TBS, Puncak Alam)',
    subtitle: 'Subang Airport, TBS, UiTM Puncak Alam, KLIA 1/2',
    baseMin: 25,
    baseMax: 90,
    color: 'rose',
    badge: '✈️ Long Distance',
    locations: [
      { 
        name: 'Subang Airport (LTSAAS)', 
        category: 'Airport', 
        keywords: ['subang airport', 'ltsaas', 'lapangan terbang sultan abdul aziz shah'],
        customBaseMin: 25, 
        customBaseMax: 35 
      },
      { 
        name: 'TBS (Terminal Bersepadu Selatan)', 
        category: 'Bus Terminal', 
        keywords: ['tbs', 'terminal bersepadu', 'terminal bersepadu selatan', 'bandar tasik selatan'],
        customBaseMin: 35, 
        customBaseMax: 50 
      },
      { 
        name: 'UiTM Puncak Alam (Puncak Alam Campus)', 
        category: 'UiTM Campus', 
        keywords: ['puncak alam', 'uitm puncak alam', 'palam', 'kolej rafflesia', 'kolej angsana'],
        customBaseMin: 40, 
        customBaseMax: 50 
      },
      { 
        name: 'KLIA 1 / KLIA 2 (Sepang)', 
        category: 'International Airport', 
        keywords: ['klia', 'klia 1', 'klia 2', 'klia1', 'klia2', 'sepang airport'],
        customBaseMin: 70, 
        customBaseMax: 90 
      },
    ]
  }
};

// Flattened location list for quick search & autocomplete
export const ALL_LOCATIONS = Object.values(ZONES).flatMap(zone => 
  zone.locations.map(loc => ({
    ...loc,
    zoneId: zone.id,
    zoneTitle: zone.title,
    zoneBadge: zone.badge,
    baseMin: loc.customBaseMin || zone.baseMin,
    baseMax: loc.customBaseMax || zone.baseMax,
  }))
);

// Preset UiTM Pickup Spots for quick 1-click selection
export const QUICK_PICKUP_SPOTS = [
  'Kolej Mawar',
  'Kolej Meranti',
  'Kolej Melati',
  'Kolej Delima',
  'Kolej Perindu',
  'Kolej Seroja',
  'Dewan Seri Budiman',
  'Menara SAAS',
  'Pintu Utama UiTM',
  'Pusat Komersial Seksyen 7',
];

// Preset Popular Destinations
export const QUICK_DROP_SPOTS = [
  'Pusat Komersial Seksyen 7',
  'Apartment Baiduri',
  'Hospital Shah Alam',
  'Central i-City Mall',
  'KTM Padang Jawa',
  'AEON Mall Shah Alam',
  'Terminal 17 (Bus Hub)',
  'Sunway Pyramid',
  'LRT Subang Jaya',
  'UiTM Puncak Alam',
  'TBS (Terminal Bersepadu)',
  'KLIA 1 / 2',
];
