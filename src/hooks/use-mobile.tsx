
/**
 * Hook personnalisé pour détecter les appareils mobiles et tablettes
 * 
 * Fonctionnalités :
 * - Détection précise des types d'appareils (mobile, tablette, desktop)
 * - Breakpoints personnalisés pour une meilleure granularité
 * - Support des petits écrans mobiles pour adaptation fine de l'UI
 * - Écoute des changements de taille d'écran en temps réel
 * - Informations détaillées sur les dimensions d'écran
 * - Optimisation des performances avec gestion d'état efficace
 */

import * as React from "react"

// Configuration des breakpoints personnalisés pour une détection précise
const MOBILE_BREAKPOINT = 768      // Limite mobile/tablette
const TABLET_BREAKPOINT = 1024     // Limite tablette/desktop
const SMALL_MOBILE_BREAKPOINT = 480 // Limite pour petits mobiles

/**
 * Interface pour les informations complètes sur l'appareil
 * Fournit tous les détails nécessaires pour adapter l'interface
 */
interface DeviceInfo {
  isMobile: boolean;      // True si écran mobile (< 768px)
  isTablet: boolean;      // True si écran tablette (768px - 1024px)
  isDesktop: boolean;     // True si écran desktop (> 1024px)
  isSmallMobile: boolean; // True si petit écran mobile (< 480px)
  width: number;          // Largeur actuelle de l'écran
  height: number;         // Hauteur actuelle de l'écran
}

/**
 * Hook principal pour détecter si l'utilisateur est sur mobile
 * Version simplifiée pour les cas d'usage de base
 * 
 * @returns True si l'appareil est détecté comme mobile
 * 
 * Utilisation recommandée :
 * ```typescript
 * const isMobile = useIsMobile();
 * if (isMobile) {
 *   // Logique spécifique mobile
 * }
 * ```
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Création d'une media query pour détecter les écrans mobiles
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Fonction de mise à jour lors des changements de taille d'écran
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Écoute des changements de media query
    mql.addEventListener("change", onChange)
    
    // Initialisation de l'état avec la taille actuelle
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Nettoyage de l'événement lors du démontage
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

/**
 * Hook avancé pour obtenir des informations détaillées sur l'appareil
 * Fournit une détection complète avec toutes les catégories d'appareils
 * 
 * @returns Objet avec informations complètes sur l'appareil et l'écran
 * 
 * Utilisation recommandée :
 * ```typescript
 * const { isMobile, isTablet, isSmallMobile, width } = useDeviceInfo();
 * 
 * // Adaptation de l'interface selon le type d'appareil
 * if (isSmallMobile) {
 *   // Interface ultra-compacte
 * } else if (isMobile) {
 *   // Interface mobile standard
 * } else if (isTablet) {
 *   // Interface tablette
 * } else {
 *   // Interface desktop
 * }
 * ```
 */
export function useDeviceInfo(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = React.useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isSmallMobile: false,
    width: 0,
    height: 0
  })

  React.useEffect(() => {
    /**
     * Fonction de mise à jour des informations d'appareil
     * Calcule toutes les propriétés basées sur les dimensions actuelles
     */
    const updateDeviceInfo = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      // Détermination du type d'appareil selon les breakpoints
      const isMobile = width < MOBILE_BREAKPOINT
      const isTablet = width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT
      const isDesktop = width >= TABLET_BREAKPOINT
      const isSmallMobile = width < SMALL_MOBILE_BREAKPOINT

      // Mise à jour de l'état avec les nouvelles informations
      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        isSmallMobile,
        width,
        height
      })
    }

    // Initialisation immédiate avec les dimensions actuelles
    updateDeviceInfo()

    // Gestionnaire d'événement pour les changements de taille d'écran
    const handleResize = () => {
      updateDeviceInfo()
    }

    // Écoute des événements de redimensionnement
    window.addEventListener("resize", handleResize)
    
    // Nettoyage de l'événement lors du démontage du composant
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return deviceInfo
}

/**
 * Hook spécialisé pour détecter les tablettes
 * Version simplifiée pour les cas où seule la détection tablette est nécessaire
 * 
 * @returns True si l'appareil est détecté comme tablette
 * 
 * Utilisation recommandée :
 * ```typescript
 * const isTablet = useIsTablet();
 * // Logique spécifique aux tablettes
 * ```
 */
export function useIsTablet(): boolean {
  const { isTablet } = useDeviceInfo()
  return isTablet
}

/**
 * Hook spécialisé pour détecter les petits écrans mobiles
 * Utile pour adapter l'interface aux très petits appareils
 * 
 * @returns True si l'appareil est un petit mobile (< 480px)
 * 
 * Utilisation recommandée :
 * ```typescript
 * const isSmallMobile = useIsSmallMobile();
 * if (isSmallMobile) {
 *   // Interface ultra-compacte pour très petits écrans
 * }
 * ```
 */
export function useIsSmallMobile(): boolean {
  const { isSmallMobile } = useDeviceInfo()
  return isSmallMobile
}
