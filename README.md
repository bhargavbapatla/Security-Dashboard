# B2B SaaS Security Platform UI

🚀 **Live Deployment:** [View the Live App Here](https://security-dashboard-pi.vercel.app/login)

## Overview
This project is a production-grade React application built to translate a UI/UX design reference into a fully functional, cohesive B2B SaaS security platform. The application focuses on accurate layout, precise spacing, typography, dynamic theming, and logical navigation between connected screens.

## Tech Stack & Architecture
* **Frontend Framework:** React + TypeScript + Vite
* **Routing:** Fully dynamic routing connects all parts of the application. The Login, Dashboard, and Scan Detail screens are linked through logical navigation to create a fluid Single Page Application (SPA) experience. 
* **Animations:** **Framer Motion** is utilized throughout the application to deliver smooth page transitions, polished interactive states, and an engaging, premium feel.

## Features & Screens Implemented

* **Screen 1: Login (Sign-up page)**
    * A premium, modern split-layout design.
    * Dark gradient background on the left with product info, and a white sign-up card on the right containing form fields and social login options.
* **Screen 2: Dashboard (Scan list overview)**
    * Full application layout featuring a left sidebar with navigation links and user profile.
    * Top organizational-level stats bar displaying severity counters (Critical, High, Medium, Low) and percentage changes.
    * Detailed scan table including interactive status chips (green, gray, red) and colored vulnerability number badges.
* **Screen 3: Active Scan Detail (Live console)**
    * Horizontal step tracker highlighting the active phase in teal.
    * A split lower section featuring a Live Scan Console with timestamped terminal-style output and a Finding Log displaying vertically stacked vulnerability cards.

## Design & Aesthetics

The application adheres strictly to professional SaaS design principles:
* **Theming:** Full native support for both Dark Mode and Light Mode, togglable from within the app. Dark mode uses near-black backgrounds, while light mode uses white to light gray.
* **Typography:** Clean sans-serif font (Inter) with a clear hierarchy.
* **Color Palette:** Teal (`#0CC8A8`) is utilized as the primary accent for active states, CTAs, and links. Fixed severity colors are applied consistently (Red for Critical, Orange for High, Yellow/Amber for Medium, Green for Low).
* **Components:** Polished custom components with rounded corners, subtle borders, and intentional hover states, avoiding default browser styling.

---

## Technical Details & Local Development

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules. 

Currently, two official plugins are available:
* [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh.
* [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh.
