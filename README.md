# MoneyGrab Portal

MoneyGrab Portal is a ReactJS web application for managing money changer operations, including commission schemes, compute rates, reservations, and transactions.
It integrates with backend APIs to provide real-time FX rate computations, commission management, and reservation handling.

## 🌟 Features

- ✅ Compute FX rates using raw feed + user adjustments
- ✅ Manage commission schemes and company-level commission links
- ✅ Reservation and transaction screens with live data
- ✅ Batch API integration for compute rates
- ✅ Modal-based CRUD forms for commission schemes and rates
- ✅ React Query integration for data fetching and caching
- ✅ Input validation with error feedback

## 📦 Tech Stack

- ReactJS + Vite (or CRA, depending on upgrade status)
- Tailwind CSS
- React Query (TanStack Query)
- Axios for API requests
- date-fns for date handling
- Jest + React Testing Library for unit tests

## 🚀 Getting Started

### Prerequisites

- Node.js (>= 18.x)
- npm (>= 9.x)

### Clone the repository

```bash
git clone https://github.com/NUS-ISS-SE-Group06/moneygrab-portal.git
cd moneygrab-portal
```

## 💻 Available Scripts

- `npm start` — Run the app in development mode
- `npm run build` — Build the app for production
- `npm test` — Run tests
- `npm run lint` — Check code style with ESLint
- `npm run format` — Format code with Prettier
