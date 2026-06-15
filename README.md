# PrepIQ

PrepIQ is an AI-powered demand forecasting and prep planning platform for commercial kitchens and food service operations.

## Features

- **AI-Powered Forecasting**: Predict daily demand for menu items
- **Prep Recommendations**: Get exact prep quantities for each item
- **Multi-Location Support**: Manage multiple kitchen locations
- **Integration Ready**: Connect with your existing POS systems
- **Security-First Design**: SOC 2 Type II compliant infrastructure
- **Multi-Language Support**: English and French
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

- **Next.js 16** - React framework for full-stack development
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **i18next** - Internationalization
- **Lucide React** - Icon library
- **Radix UI** - Accessible UI components

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Project Structure

```
prep/
├── app/                      # Next.js App Router
│   ├── privacy-policy/       # Privacy policy page
│   ├── security/             # Security page
│   ├── terms-of-service/     # Terms of service page
│   ├── globals.css           # Global styles with Tailwind
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── src/
│   ├── components/           # React components
│   │   ├── landing/          # Landing page sections
│   │   └── ui/               # UI components
│   ├── hooks/                # Custom React hooks
│   ├── i18n/                 # Internationalization files
│   └── lib/                  # Utility functions
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## License

All rights reserved.
