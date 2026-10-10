# UiTM RideWise 🚗
### UiTM Shah Alam Transporter Fare Estimator & Order Hub
**Based on Official Price List (Effective 1st April 2026)**

---

## 🌟 Key Features

1. **Smart Order Paste & Auto-Parser**
   - Directly paste WhatsApp / Telegram student booking messages (e.g. `durrz`, `amyra`).
   - Auto-extracts passenger name, pickup college, dropoff destination, pax count, and surcharges.
   - Computes official price range in real-time.

2. **Official Price List Engine**
   - **Campus Internal (UiTM Shah Alam)**: RM 5 ~ 8
   - **Seksyen 7 (General)**: RM 7 ~ 11
   - **i-City Area (+RM 1)**: RM 8 ~ 12
   - **Nearby Sections (Sek 6, 9, 14, 16, U12)**: RM 10 ~ 15
   - **Mid-Distance (Sek 13, 14, 17, U10/U11)**: RM 12 ~ 22
   - **Extended Area (Klang, Setia Alam, Subang, Sunway, 1 Utama, etc.)**: RM 18 ~ 35
   - **Long Distance**:
     - Subang Airport (LTSAAS): RM 25 ~ 35
     - TBS (Terminal Bersepadu): RM 35 ~ 50
     - UiTM Puncak Alam: RM 40 ~ 50
     - KLIA 1 / 2: RM 70 ~ 90

3. **Mandatory Surcharges**
   - **Peak Hours (+RM 2~5)**: 7:30–9:30 AM / 5:00–8:00 PM (Auto-detected from clock)
   - **Rainy Weather (+RM 2~4)**: Heavy rain / traffic
   - **Midnight / Gate Closed (+RM 2~4)**: 12:00 AM – 6:00 AM
   - **MPV Multiplier (1.5x Base)**: Applied when 5–6 passengers or MPV toggled
   - **Heavy Luggage (+RM 2~4)**: Balik kampung / oversized boxes
   - **Late Fee**: +RM 1 per 10 mins waiting time
   - **Highway Tolls**: Custom toll add-on

4. **Community Floor Price Protection**
   - Displays clear policy badges ensuring student drivers are not subjected to price cuts below the floor rates.

5. **WhatsApp & Telegram Generator**
   - 1-click formatted post generator for students.
   - 1-click quote reply generator for transporters.
   - Direct WhatsApp integration link (`api.whatsapp.com`).

---

## 🚀 Running the Project

```bash
# Start Development Server
npm run dev

# Build for Production
npm run build
```

Development server runs on: `http://localhost:5173/`
