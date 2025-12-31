
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
    	screens: {
    		'xs': '375px',
    		'sm': '640px',
    		'md': '768px',
    		'lg': '1024px',
    		'xl': '1280px',
    		'2xl': '1536px'
    	},
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
    			sans: [
    				'Montserrat',
    				'ui-sans-serif',
    				'system-ui',
    				'sans-serif',
    				'Apple Color Emoji',
    				'Segoe UI Emoji',
    				'Segoe UI Symbol',
    				'Noto Color Emoji'
    			],
    			heading: [
    				'Montserrat',
    				'system-ui',
    				'sans-serif'
    			],
    			elegant: [
    				'EB Garamond',
    				'Georgia',
    				'serif'
    			],
    			serif: [
    				'Lora',
    				'ui-serif',
    				'Georgia',
    				'Cambria',
    				'Times New Roman',
    				'Times',
    				'serif'
    			],
    			mono: [
    				'JetBrains Mono',
    				'ui-monospace',
    				'SFMono-Regular',
    				'Menlo',
    				'Monaco',
    				'Consolas',
    				'Liberation Mono',
    				'Courier New',
    				'monospace'
    			]
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
    			'10': '80px'
    		},
    		colors: {
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))',
    				container: 'hsl(var(--primary-container))',
    				'on-container': 'hsl(var(--primary-on-container))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))',
    				container: 'hsl(var(--secondary-container))',
    				'on-container': 'hsl(var(--secondary-on-container))'
    			},
    			tertiary: {
    				DEFAULT: 'hsl(var(--tertiary))',
    				foreground: 'hsl(var(--tertiary-foreground))',
    				container: 'hsl(var(--tertiary-container))',
    				'on-container': 'hsl(var(--tertiary-on-container))'
    			},
    			surface: {
    				DEFAULT: 'hsl(var(--surface))',
    				variant: 'hsl(var(--surface-variant))',
    				tint: 'hsl(var(--surface-tint))'
    			},
    			error: {
    				DEFAULT: 'hsl(var(--error))',
    				foreground: 'hsl(var(--error-foreground))',
    				container: 'hsl(var(--error-container))'
    			},
    			'health-primary': 'hsl(var(--primary))',
    			'health-secondary': 'hsl(var(--secondary))',
    			'health-accent': 'hsl(var(--primary))',
    			'health-heading': 'hsl(var(--tertiary))',
    			'health-success': 'hsl(var(--primary))',
    			'health-warning': 'hsl(38 92% 50%)',
    			'health-highlight': 'hsl(var(--secondary))',
    			'health-icon': 'hsl(var(--primary))',
    			'brand-turquoise': 'hsl(187 72% 48%)',
    			'brand-pink': 'hsl(335 89% 48%)',
    			'brand-navy': 'hsl(224 67% 10%)',
    			health: {
    				'50': 'hsl(186 75% 97%)',
    				'100': 'hsl(186 75% 94%)',
    				'200': 'hsl(186 75% 88%)',
    				'300': 'hsl(186 75% 76%)',
    				'400': 'hsl(186 75% 64%)',
    				'500': 'hsl(186 82% 48%)',
    				'600': 'hsl(186 82% 38%)',
    				'700': 'hsl(186 82% 28%)',
    				'800': 'hsl(186 82% 18%)',
    				'900': 'hsl(186 82% 12%)'
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
    			}
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
    			full: '9999px'
    		},
    		transitionDuration: {
    			'280': '280ms'
    		},
    		transitionTimingFunction: {
    			material: 'cubic-bezier(0.4, 0, 0.2, 1)'
    		},
    		boxShadow: {
    			'elevation-0': 'var(--elevation-0)',
    			'elevation-1': 'var(--elevation-1)',
    			'elevation-2': 'var(--elevation-2)',
    			'elevation-3': 'var(--elevation-3)',
    			'elevation-4': 'var(--elevation-4)',
    			'elevation-5': 'var(--elevation-5)'
    		},
    		backgroundImage: {
    			'gradient-brand': 'linear-gradient(135deg, hsl(187 72% 48%), hsl(335 89% 48%))',
    			'gradient-brand-reverse': 'linear-gradient(135deg, hsl(335 89% 48%), hsl(187 72% 48%))',
    			'gradient-brand-soft': 'linear-gradient(135deg, hsla(187, 72%, 48%, 0.1), hsla(335, 89%, 48%, 0.1))'
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
    				'0%, 100%': {
    					opacity: '1'
    				},
    				'50%': {
    					opacity: '0.5'
    				}
    			},
    			fadeIn: {
    				from: {
    					opacity: '0'
    				},
    				to: {
    					opacity: '1'
    				}
    			},
    			slideUp: {
    				from: {
    					transform: 'translateY(10px)',
    					opacity: '0'
    				},
    				to: {
    					transform: 'translateY(0)',
    					opacity: '1'
    				}
    			},
    			'slide-in-left': {
    				from: {
    					transform: 'translateX(-100%)',
    					opacity: '0'
    				},
    				to: {
    					transform: 'translateX(0)',
    					opacity: '1'
    				}
    			},
    			'slide-in-right': {
    				from: {
    					transform: 'translateX(100%)',
    					opacity: '0'
    				},
    				to: {
    					transform: 'translateX(0)',
    					opacity: '1'
    				}
    			},
    			'fade-in': {
    				from: {
    					opacity: '0',
    					transform: 'translateY(8px)'
    				},
    				to: {
    					opacity: '1',
    					transform: 'translateY(0)'
    				}
    			},
    			marquee: {
    				'0%': {
    					transform: 'translateX(0)'
    				},
    				'100%': {
    					transform: 'translateX(-50%)'
    				}
    			},
    			ripple: {
    				'0%': {
    					transform: 'scale(0)',
    					opacity: '0.3'
    				},
    				'100%': {
    					transform: 'scale(2.5)',
    					opacity: '0'
    				}
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out',
    			pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    			fadeIn: 'fadeIn 0.5s ease-in-out',
    			slideUp: 'slideUp 0.5s ease-in-out',
    			'slide-in-left': 'slide-in-left 0.3s ease-out',
    			'slide-in-right': 'slide-in-right 0.3s ease-out',
    			'fade-in': 'fade-in 0.3s ease-out',
    			marquee: 'marquee 8s linear infinite',
    			ripple: 'ripple 600ms cubic-bezier(0.4, 0, 0.2, 1)'
    		}
    	}
    },
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
