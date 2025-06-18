
/* eslint-disable @typescript-eslint/no-require-imports */

import type { Config } from "tailwindcss";

/**
 * 🎨 Configuration Tailwind CSS optimisée pour MedCollab
 * 
 * Architecture responsive intelligente :
 * - Mobile : < 640px (smartphones)
 * - Tablette : 640px - 1023px (tablettes, iPad)
 * - Desktop : ≥ 1024px (ordinateurs, écrans larges)
 * 
 * Optimisations spécifiques :
 * - Breakpoints personnalisés pour composants médicaux
 * - Couleurs thématiques médicales avec variables CSS
 * - Animations fluides 60fps pour interfaces tactiles
 * - Support des zones sécurisées pour appareils mobiles natifs
 * - Espacement adaptatif pour différentes densités d'écran
 */

export default {
	darkMode: ["class"], // Mode sombre basé sur les classes CSS pour contrôle précis
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "", // Pas de préfixe pour utilisation native des classes Tailwind
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',      // Espacement par défaut pour mobile
				sm: '1.5rem',         // Espacement optimisé pour petites tablettes
				md: '2rem',           // Espacement standard pour tablettes
				lg: '2.5rem',         // Espacement desktop standard
				xl: '3rem',           // Espacement pour grands écrans
				'2xl': '4rem'         // Espacement pour écrans très larges
			},
			screens: {
				'sm': '640px',        // Tablettes petites et smartphones larges
				'md': '768px',        // Tablettes standard (iPad)
				'lg': '1024px',       // Desktop standard et tablettes larges
				'xl': '1280px',       // Desktop large
				'2xl': '1400px'       // Écrans très larges et 4K
			}
		},
		
		/**
		 * 📐 BREAKPOINTS PERSONNALISÉS pour navigation adaptative
		 * Définit les seuils critiques pour changement d'interface
		 */
		screens: {
			// Breakpoints standards optimisés
			'xs': '480px',          // Smartphones larges et phablets
			'sm': '640px',          // Tablettes compactes
			'md': '768px',          // Tablettes standard (iPad Portrait)
			'lg': '1024px',         // Desktop et tablettes larges (iPad Landscape)
			'xl': '1280px',         // Desktop large et moniteurs standards
			'2xl': '1536px',        // Moniteurs larges et 4K
			
			// Breakpoints spécialisés pour composants médicaux
			'mobile': {'max': '639px'},              // Mobile pur (< sm)
			'tablet': {'min': '640px', 'max': '1023px'}, // Tablette pure (sm à lg-1)
			'desktop': {'min': '1024px'},            // Desktop pur (≥ lg)
			
			// Breakpoints contextuels pour interfaces spécialisées
			'touch': {'max': '1023px'},              // Interfaces tactiles (mobile + tablette)
			'pointer': {'min': '1024px'},            // Interfaces avec souris (desktop)
			'compact': {'max': '767px'},             // Interfaces compactes
			'spacious': {'min': '768px'},            // Interfaces spacieuses
		},
		
		extend: {
			/**
			 * 🎨 PALETTE DE COULEURS MÉDICALES avec variables CSS
			 * Thème professionnel adapté au domaine médical
			 */
			colors: {
				// Couleurs système Shadcn/UI avec support mode sombre
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				
				// Couleurs primaires avec variantes
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					50: '#eff6ff',
					100: '#dbeafe',
					500: '#3b82f6',
					600: '#2563eb',
					700: '#1d4ed8',
				},
				
				// Couleurs secondaires pour éléments d'interface
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				
				// Couleurs d'état avec signification médicale
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				
				// Couleurs utilitaires pour informations
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				
				// Couleurs d'accentuation pour interactions
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				
				// Couleurs pour popovers et modales
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				
				// Couleurs pour cartes et conteneurs
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				
				// Couleurs spécialisées pour sidebar
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
				
				/**
				 * 🏥 PALETTE MÉDICALE PROFESSIONNELLE
				 * Couleurs spécialement choisies pour applications médicales
				 */
				medical: {
					// Bleu médical principal - confiance et professionnalisme
					blue: {
						DEFAULT: '#0077B6',
						50: '#e6f4f9',
						100: '#cce9f3',
						200: '#99d3e7',
						300: '#66bddb',
						400: '#33a7cf',
						500: '#0077B6', // Couleur principale
						600: '#006ba3',
						700: '#005f90',
						800: '#00537d',
						900: '#00476a',
					},
					
					// Teal médical - innovation et technologie
					teal: {
						DEFAULT: '#00B4D8',
						50: '#e6f8fc',
						100: '#ccf1f9',
						200: '#99e3f3',
						300: '#66d5ed',
						400: '#33c7e7',
						500: '#00B4D8', // Couleur principale
						600: '#00a2c2',
						700: '#0090ac',
						800: '#007e96',
						900: '#006c80',
					},
					
					// Navy médical - autorité et expertise
					navy: {
						DEFAULT: '#03045E',
						50: '#e6e6f2',
						100: '#cccce5',
						200: '#9999cb',
						300: '#6666b1',
						400: '#333397',
						500: '#03045E', // Couleur principale
						600: '#030355',
						700: '#02024c',
						800: '#020243',
						900: '#02013a',
					},
					
					// Vert médical - santé et guérison
					green: {
						DEFAULT: '#90BE6D',
						50: '#f3f8ed',
						100: '#e7f1db',
						200: '#cfe3b7',
						300: '#b7d593',
						400: '#9fc76f',
						500: '#90BE6D', // Couleur principale
						600: '#81ab62',
						700: '#729857',
						800: '#63854c',
						900: '#547241',
					},
					
					// Couleur de fond claire - propreté et clarté
					light: {
						DEFAULT: '#F5F7FA',
						50: '#fefeff',
						100: '#fdfdfe',
						200: '#fbfcfd',
						300: '#f9fafc',
						400: '#f7f8fb',
						500: '#F5F7FA', // Couleur principale
						600: '#dde0e3',
						700: '#c5c9cc',
						800: '#adb2b5',
						900: '#959b9e',
					}
				}
			},
			
			/**
			 * 📐 RAYONS DE BORDURE adaptatifs
			 * Cohérence visuelle avec le système de design
			 */
			borderRadius: {
				lg: 'var(--radius)',                    // Rayon large pour cartes principales
				md: 'calc(var(--radius) - 2px)',       // Rayon moyen pour boutons
				sm: 'calc(var(--radius) - 4px)',       // Rayon petit pour éléments inline
				xs: 'calc(var(--radius) - 6px)',       // Rayon très petit pour badges
			},
			
			/**
			 * 📏 ESPACEMENT POUR ZONES SÉCURISÉES
			 * Support natif des appareils avec encoche (iPhone X+, etc.)
			 */
			spacing: {
				'safe-bottom': 'env(safe-area-inset-bottom)',  // Zone sécurisée bas
				'safe-top': 'env(safe-area-inset-top)',        // Zone sécurisée haut
				'safe-left': 'env(safe-area-inset-left)',      // Zone sécurisée gauche
				'safe-right': 'env(safe-area-inset-right)',    // Zone sécurisée droite
				
				// Espacements spécialisés pour navigation mobile
				'navbar-mobile': '5rem',                       // Hauteur navbar mobile
				'navbar-tablet': '4rem',                       // Hauteur navbar tablette
				'sidebar-width': '20rem',                      // Largeur sidebar desktop
				'sidebar-collapsed': '4rem',                   // Largeur sidebar réduite
			},
			
			/**
			 * ✨ ANIMATIONS KEYFRAMES haute performance
			 * Optimisées pour 60fps sur appareils mobiles et desktop
			 */
			keyframes: {
				// Animations d'accordéon pour contenus pliables
				'accordion-down': {
					from: { height: '0', opacity: '0' },
					to: { height: 'var(--radix-accordion-content-height)', opacity: '1' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
					to: { height: '0', opacity: '0' }
				},
				
				// Animations d'apparition fluides
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in-scale': {
					'0%': { opacity: '0', transform: 'scale(0.95) translateY(10px)' },
					'100%': { opacity: '1', transform: 'scale(1) translateY(0)' }
				},
				
				// Animations de glissement pour modales mobile
				'slide-up': {
					'0%': { transform: 'translateY(100%)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-down': {
					'0%': { transform: 'translateY(-100%)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				
				// Animation de rotation lente pour indicateurs de chargement
				'spin-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				
				// Animation de pulsation pour éléments d'attention
				'pulse-soft': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.7' }
				},
				
				// Animation Magic Navbar pour blob flottant
				'blob-bounce': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.05)' }
				}
			},
			
			/**
			 * 🎬 ANIMATIONS PREDEFINIES
			 * Classes d'animation prêtes à l'emploi avec timing optimisé
			 */
			animation: {
				// Animations de base avec timing médical (plus lent, plus professionnel)
				'accordion-down': 'accordion-down 0.3s ease-out',
				'accordion-up': 'accordion-up 0.3s ease-out',
				'fade-in': 'fade-in 0.4s ease-out',
				'fade-in-scale': 'fade-in-scale 0.3s ease-out',
				'slide-up': 'slide-up 0.4s ease-out',
				'slide-down': 'slide-down 0.3s ease-out',
				
				// Animations de chargement optimisées
				'spin-slow': 'spin-slow 2s linear infinite',
				'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
				
				// Animation spécialisée Magic Navbar
				'blob-bounce': 'blob-bounce 2s ease-in-out infinite',
				
				// Animations tactiles pour mobile
				'touch-feedback': 'fade-in-scale 0.1s ease-out',
				'button-press': 'scale 0.1s ease-in-out',
				
				// Animations de notification médicale
				'medical-alert': 'fade-in 0.5s ease-out, pulse-soft 1s ease-in-out 3',
				'success-bounce': 'fade-in-scale 0.3s ease-out, blob-bounce 0.6s ease-out 1'
			},
			
			/**
			 * 🖼️ EFFETS VISUELS AVANCÉS
			 * Ombres et effets pour profondeur et hiérarchie visuelle
			 */
			boxShadow: {
				'medical': '0 4px 6px -1px rgba(0, 119, 182, 0.1), 0 2px 4px -1px rgba(0, 119, 182, 0.06)',
				'medical-lg': '0 10px 15px -3px rgba(0, 119, 182, 0.1), 0 4px 6px -2px rgba(0, 119, 182, 0.05)',
				'glow': '0 0 20px rgba(0, 180, 216, 0.3)',
				'navbar': '0 -2px 10px rgba(0, 0, 0, 0.1)',
			},
			
			/**
			 * 📝 TYPOGRAPHIE MÉDICALE
			 * Familles de polices optimisées pour lisibilité médicale
			 */
			fontFamily: {
				'medical': ['Inter', 'system-ui', 'sans-serif'],
				'mono-medical': ['JetBrains Mono', 'Consolas', 'monospace'],
			},
			
			/**
			 * 🎯 Z-INDEX HIÉRARCHISÉ
			 * Gestion des couches d'affichage pour interfaces complexes
			 */
			zIndex: {
				'navbar': '40',        // Navigation principale
				'sidebar': '30',       // Sidebar desktop
				'modal': '50',         // Modales et overlays
				'tooltip': '60',       // Tooltips et hints
				'notification': '70',  // Notifications système
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"), // Plugin d'animations avancées
		
		// Plugin personnalisé pour utilitaires médicaux
		function({ addUtilities }: { addUtilities: any }) {
			addUtilities({
				// Classe pour zones tactiles optimisées mobile
				'.touch-target': {
					'min-height': '44px',    // Taille minimum recommandée iOS
					'min-width': '44px',     // Largeur minimum recommandée
					'display': 'flex',
					'align-items': 'center',
					'justify-content': 'center',
				},
				
				// Classe pour masquer les scrollbars tout en gardant la fonctionnalité
				'.scrollbar-hide': {
					'-ms-overflow-style': 'none',     // IE et Edge
					'scrollbar-width': 'none',        // Firefox
					'&::-webkit-scrollbar': {         // Chrome, Safari, Opera
						'display': 'none'
					}
				},
				
				// Classe pour glassmorphism médical
				'.glass-medical': {
					'backdrop-filter': 'blur(10px)',
					'background': 'rgba(255, 255, 255, 0.9)',
					'border': '1px solid rgba(255, 255, 255, 0.2)',
				}
			});
		}
	],
} satisfies Config;
