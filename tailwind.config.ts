
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				sm: '640px',
				md: '720px',
				lg: '1024px',
				xl: '1280px',
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Roboto', 'system-ui', 'sans-serif'],
			},
			spacing: {
				'1': '8px',
				'2': '16px',
				'3': '24px',
				'4': '32px',
				'5': '40px',
				'6': '48px',
				'7': '56px',
				'8': '64px',
				'9': '72px',
				'10': '80px',
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				// Material 3 Primary - Turquoise (Brand)
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					container: 'hsl(var(--primary-container))',
					'on-container': 'hsl(var(--primary-on-container))',
				},
				// Material 3 Secondary - Pink (Brand)
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
					container: 'hsl(var(--secondary-container))',
					'on-container': 'hsl(var(--secondary-on-container))',
				},
				// Material 3 Tertiary - Navy (Brand)
				tertiary: {
					DEFAULT: 'hsl(var(--tertiary))',
					foreground: 'hsl(var(--tertiary-foreground))',
					container: 'hsl(var(--tertiary-container))',
					'on-container': 'hsl(var(--tertiary-on-container))',
				},
				// Material 3 Surface
				surface: {
					DEFAULT: 'hsl(var(--surface))',
					variant: 'hsl(var(--surface-variant))',
					tint: 'hsl(var(--surface-tint))',
				},
				// Material 3 Error
				error: {
					DEFAULT: 'hsl(var(--error))',
					foreground: 'hsl(var(--error-foreground))',
					container: 'hsl(var(--error-container))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
			},
			borderRadius: {
				none: '0',
				sm: '4px',
				DEFAULT: '8px',
				md: '8px',
				lg: '12px',
				xl: '16px',
				'2xl': '20px',
				'3xl': '24px',
				full: '9999px',
			},
			boxShadow: {
				'elevation-0': 'var(--elevation-0)',
				'elevation-1': 'var(--elevation-1)',
				'elevation-2': 'var(--elevation-2)',
				'elevation-3': 'var(--elevation-3)',
				'elevation-4': 'var(--elevation-4)',
				'elevation-5': 'var(--elevation-5)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				pulse: {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' }
				},
				fadeIn: {
					from: { opacity: '0' },
					to: { opacity: '1' }
				},
				slideUp: {
					from: { transform: 'translateY(10px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' }
				},
				marquee: {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(-50%)' }
				},
				ripple: {
					'0%': { transform: 'scale(0)', opacity: '0.3' },
					'100%': { transform: 'scale(2.5)', opacity: '0' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				fadeIn: 'fadeIn 0.5s ease-in-out',
				slideUp: 'slideUp 0.5s ease-in-out',
				marquee: 'marquee 8s linear infinite',
				ripple: 'ripple 600ms cubic-bezier(0.4, 0, 0.2, 1)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
