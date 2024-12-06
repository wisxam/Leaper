import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      maxWidth: {
        "8xl": "1408px",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(6deg)" },
          "75%": { transform: "rotate(-6deg)" },
        },
        shake_delete: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(20deg)" },
          "75%": { transform: "rotate(-20deg)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" },
        },
      },
      animation: {
        "accordion-up": "accordion-up 0.2s ease-out",
        "accordion-down": "accordion-down 0.2s ease-out",
        "fade-in": "fadeIn 1s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        shake: "shake 0.5s ease-in-out infinite",
        shake_delete: "shake_delete 0.5s ease-in-out infinite",
        "bounce-delay-1": "bounce 1s infinite 0s ease-out",
        "bounce-delay-2": "bounce 1s infinite 0.2s ease-out",
        "bounce-delay-3": "bounce 1s infinite 0.4s ease-out",
      },
      colors: {
        beige: {
          "50": "#FEFCF7",
          "100": "#FDF9F0",
          "200": "#FBF2E1",
          "300": "#F8EBD3",
          "400": "#F5E4C4",
          "500": "#FAF6E3",
          "600": "#DCCCB6",
          "700": "#BFB390",
          "800": "#A29A70",
          "900": "#847F55",
        },
        sage: {
          "50": "#F5F7EF",
          "100": "#EBF0E0",
          "200": "#D8DBBD",
          "300": "#B3B990",
          "400": "#8E9673",
          "500": "#6E7855",
          "600": "#56603F",
          "700": "#41492E",
          "800": "#2D3420",
          "900": "#1A1F15",
        },
        brown: {
          "50": "#F8F3ED",
          "100": "#EDE1D1",
          "200": "#DFCAA9",
          "300": "#D2B482",
          "400": "#C6A169",
          "500": "#B59F78",
          "600": "#947C56",
          "700": "#705A3B",
          "800": "#4D3B26",
          "900": "#2A2014",
        },
        navy: {
          "50": "#F0F2F8",
          "100": "#D9DDED",
          "200": "#B0B8D8",
          "300": "#8793C3",
          "400": "#5F6DAE",
          "500": "#2A3663",
          "600": "#222B4F",
          "700": "#1A213C",
          "800": "#11162A",
          "900": "#080B17",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [tailwindcssAnimate, typography],
} satisfies Config;
