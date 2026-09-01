import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blueprint: { 950: '#0F1E30', 900: '#1E3A5F', 700: '#2C567F', 400: '#7FA6C7', 100: '#DCE8F2' },
        signal: { orange: '#FF6B35', yellow: '#FFC93C', green: '#4ADE80' },
        paper: '#FDFBF7',
        ink: '#16232E'
      },
      fontFamily: {
        display: ['Fredoka', 'ui-rounded', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        code: ['"JetBrains Mono"', 'ui-monospace', 'monospace']
      }
    }
  },
  plugins: []
} satisfies Config;
