# KEYSTONE LIVING

A premium property discovery platform built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. Browse fictional apartments, houses, and condos for rent or purchase — with working filters, saved favorites, a real interactive map, and a mobile-first responsive design.

> **Demo Notice:** All listings, agents, and property data on this platform are **entirely fictional** and for demonstration purposes only. No real properties are shown, and no actual transactions can be made through this application.

---

## ✨ Features

### 🔍 Smart Property Search
- Filter by **location**, **property type** (apartment / house / condo / studio), **buy or rent**, and **price range**
- Sort by **recently added**, **price low-to-high**, or **price high-to-low**
- All filters are **fully functional** and affect displayed results in real time
- Price labels adapt to the selected intent (`$/mo` for rentals, `$` for purchases)

### 💾 Saved Favorites
- Heart icon on any property card to save or remove
- Favorites **persist across page refreshes** using `localStorage`
- Dedicated **Favorites page** with an empty state and quick navigation back to search

### 🗺️ Interactive Map View
- Real map tiles powered by **[CartoDB Light](https://carto.com/basemaps/)** (free, no API key required)
- Custom **price-label markers** for each property
- Click a marker to open a side panel with property details
- Map auto-fits bounds to show all filtered properties
- Proper OpenStreetMap / CARTO attribution included

### 🏠 Detailed Property View
- **Swipeable image gallery** with drag gestures (mobile-friendly) and arrow navigation (desktop)
- Thumbnail strip with active-state highlighting
- Full amenities list, agent contact info, and rich description
- **Viewing-request form** with field validation (name, email, phone, date, time)
- Animated confirmation screen with clear demo disclaimer

### 📱 Mobile-First Responsive Design
- Designed for **320px → wide desktop** viewports
- Collapsible filter panel on mobile (toggle button + bottom nav shortcut)
- **Bottom navigation bar** on mobile with animated active indicator
- Touch targets ≥ 44×44px, safe-area support, fluid typography
- Swipe gestures for gallery; keyboard and screen-reader accessible

### 🎞️ Motion & Interactivity
- Smooth page transitions, staggered card reveals, and spring animations via **Framer Motion**
- Button press feedback, hover states, and layout animations
- Respects **`prefers-reduced-motion`** — all non-essential motion is disabled when requested
- Visible focus indicators and semantic HTML throughout

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Icons | Lucide React |
| Maps | Leaflet + React-Leaflet v4 |
| Map tiles | CartoDB Light (OpenStreetMap data) |
| Persistence | `localStorage` (favorites) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ (LTS recommended)
- **npm** 9+

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd keystone-living

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **http://localhost:3000**.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Create an optimized production build in `dist/` |
| `npm run typecheck` | Run the TypeScript compiler without emitting files |
| `npm run preview` | Preview the production build locally |

---

## 📂 Project Structure

```
keystone-living/
├── public/                  # Static assets
├── src/
│   ├── components/
│   │   ├── BottomNav.tsx        # Mobile bottom navigation
│   │   ├── FavoritesPage.tsx    # Saved properties page
│   │   ├── Header.tsx           # Top navigation bar
│   │   ├── Hero.tsx             # Landing hero section
│   │   ├── MapView.tsx          # Leaflet map with markers
│   │   ├── PropertyCard.tsx     # Property list card
│   │   ├── PropertyDetail.tsx   # Full property view + form
│   │   └── SearchFilters.tsx    # Filter panel
│   ├── data/
│   │   └── listings.ts          # 12 fictional demo properties
│   ├── hooks/
│   │   ├── useFavorites.ts      # localStorage-backed favorites
│   │   └── useFilters.ts        # Filter state + derived listings
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   ├── App.tsx                  # Root component + routing
│   ├── main.tsx                 # Entry point
│   └── index.css                # Tailwind + Leaflet + custom styles
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.js
```

---

## 🎨 Design System

The visual identity follows a **trustworthy, calm, and premium** direction:

- **Navy typography** — `#1a2744` (primary text, CTAs)
- **Warm gray surfaces** — `#f8f7f5` (background), `#e8e4df` (borders, placeholders)
- **Restrained green accents** — `#2d6a4f` (success states, favorites, price)
- **Architectural photography** — sourced from Unsplash for demo imagery
- **Typography** — Inter (300–800 weights)

---

## ♿ Accessibility

- Semantic HTML (`<header>`, `<main>`, `<nav>`, `<article>`, `<footer>`)
- Visible focus rings on all interactive elements (`focus-visible`)
- ARIA labels on icon-only buttons (favorites, navigation, close actions)
- Form fields with associated `<label>` elements and `aria-invalid` states
- Keyboard-navigable gallery and property cards (`Enter` to open)
- Reduced-motion support via `@media (prefers-reduced-motion: reduce)`
- Color is never the sole indicator of state — text labels accompany all status changes

---

## 🧪 Tested Viewports

The layout has been composed for the following breakpoints:

| Width | Layout |
|---|---|
| 320px | Single column, bottom nav, collapsible filters |
| 375px / 390px | Modern phone — same as 320px with more breathing room |
| 768px | Tablet — 2-column property grid, side-by-side filter + results |
| 1024px | Desktop — sticky sidebar filters, 3-column grid |
| 1280px+ | Wide desktop — expanded hero, 3-column results |

---

## 🗺️ Map Setup (No API Key Required)

The map uses **CartoDB Light** tiles, which are free and do not require an API key:

```
https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png
```

Attribution to **OpenStreetMap contributors** and **CARTO** is displayed automatically on the map.

If you want to swap tile providers, edit the `<TileLayer url="..." />` in `src/components/MapView.tsx`.

---

## 📝 Demo Data

All 12 properties in `src/data/listings.ts` are **fictional**. They include:

- Downtown lofts, suburban homes, waterfront condos, studios, Victorian townhouses, artist lofts, micro-condos, and lakeside villas
- Prices ranging from **$1,450/mo** (rent) to **$1,850,000** (buy)
- Three demo agents: Sarah Mitchell, James Cooper, Victoria Chen
- Coordinates clustered around a fictional NYC metro area

The viewing-request form **does not send any data** — it only validates input locally and shows a confirmation screen with a demo disclaimer.

---

## 🐛 Known Limitations

- No backend — favorites are stored in browser `localStorage` only
- No real map geocoding — property coordinates are hardcoded demo values
- Image URLs point to Unsplash — an internet connection is required to load property photos
- Form submissions are simulated — no emails or requests are sent anywhere

---

## 📄 License

This project is provided as a demonstration. Feel free to use, modify, and extend it for your own learning or portfolio purposes.

---

**Built with care for KEYSTONE LIVING** — a demo real estate discovery experience.
