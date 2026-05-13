/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1400px',
    },
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        'v2': {
          bg: '#0A0B0D',
          surface: '#121316',
          surface2: '#1A1C20',
          surface3: '#22262C',
        },
        'azure-radiance': {
          '50': '#eff8ff',
          '100': '#dbeefe',
          '200': '#c0e2fd',
          '300': '#94d2fc',
          '400': '#61b7f9',
          '500': '#3d98f4',
          '600': '#257ae9',
          '700': '#1f65d6',
          '800': '#1f52ae',
          '900': '#1f4789',
          '950': '#182c53',
        },
        'ai-violet': {
          '50': '#f5f3ff',
          '100': '#ede9fe',
          '200': '#ddd6fe',
          '300': '#c4b5fd',
          '400': '#a78bfa',
          '500': '#8B5CF6',
          '600': '#7c3aed',
          '700': '#6d28d9',
          '800': '#5b21b6',
          '900': '#4c1d95',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundColor: {
        'site-background': '#000000',
      },
      fontFamily: {
        'heading': ['"Nova Square"', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['"JetBrains Mono"', 'monospace'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'geist': ['Geist', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function({ addBase, theme }) {
      addBase({
        ':root': {
          '--azure-radiance-800': '#000000',
          '--v2-bg': '#0A0B0D',
          '--v2-surface': '#121316',
          '--v2-surface2': '#1A1C20',
          '--v2-surface3': '#22262C',
          '--v2-white': '#FAFAFA',
          '--v2-text-soft': 'rgba(250,250,250,0.72)',
          '--v2-text-dim': 'rgba(250,250,250,0.46)',
          '--v2-text-faint': 'rgba(250,250,250,0.28)',
          '--v2-line': 'rgba(250,250,250,0.08)',
          '--v2-line-mid': 'rgba(250,250,250,0.12)',
          '--v2-line-str': 'rgba(250,250,250,0.18)',
          '--v2-accent': '#2BB673',
        },
        'body': {
          backgroundColor: '#0A0B0D',
          color: '#FAFAFA',
        },
      });
    },
  ],
}
