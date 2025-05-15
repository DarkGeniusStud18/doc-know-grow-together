
/**
 * music-data.ts
 * 
 * Données pour la bibliothèque musicale
 * Contient les catégories et pistes musicales disponibles dans l'application
 */

import { MusicCategory } from '@/types/music';

// Données des catégories musicales avec leurs pistes
export const musicCategories: MusicCategory[] = [
  {
    id: 'lofi',
    name: 'Lo-Fi Hip Hop',
    description: 'Beats relaxants et mélodies apaisantes parfaits pour étudier ou travailler dans une ambiance détendue.',
    tracks: [
      {
        id: 'lofi-1',
        title: 'Midnight Study Session',
        artist: 'ChillBeats',
        album: 'Study Sessions Vol. 1',
        coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000',
        url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3',
        duration: '3:42',
        bpm: 80,
        tags: ['lofi', 'relax', 'study']
      },
      {
        id: 'lofi-2',
        title: 'Rainy Day Notes',
        artist: 'MellowMind',
        album: 'Rainy Days',
        coverImage: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1000',
        url: 'https://cdn.pixabay.com/audio/2022/01/20/audio_d0fd068033.mp3',
        duration: '4:15',
        bpm: 75,
        tags: ['lofi', 'piano', 'rain']
      },
      {
        id: 'lofi-3',
        title: 'Coffee Shop Ambience',
        artist: 'Urban Acoustics',
        album: 'City Sounds',
        coverImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1000',
        url: 'https://cdn.pixabay.com/audio/2021/11/25/audio_cb4f1212a9.mp3',
        duration: '3:58',
        bpm: 85,
        tags: ['lofi', 'ambience', 'coffee']
      },
      {
        id: 'lofi-4',
        title: 'Late Night Focus',
        artist: 'Sleepy Sounds',
        album: 'Night Sessions',
        coverImage: 'https://images.unsplash.com/photo-1557682250-43c3bbe6e985?q=80&w=1000',
        url: 'https://cdn.pixabay.com/audio/2022/08/04/audio_2dde668d05.mp3',
        duration: '4:32',
        bpm: 72,
        tags: ['lofi', 'night', 'focus']
      }
    ]
  },
  {
    id: 'ambient',
    name: 'Ambient & Nature',
    description: 'Sons naturels et atmosphériques qui créent un environnement calme et immersif pour la concentration profonde.',
    tracks: [
      {
        id: 'ambient-1',
        title: 'Forest Morning',
        artist: 'Nature Sounds',
        album: 'Biophilia',
        coverImage: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=1000',
        url: 'https://cdn.pixabay.com/audio/2021/04/07/audio_615cf64e1a.mp3',
        duration: '5:24',
        tags: ['ambient', 'nature', 'forest']
      },
      {
        id: 'ambient-2',
        title: 'Ocean Waves',
        artist: 'Aqua Sounds',
        album: 'Water Elements',
        coverImage: 'https://images.unsplash.com/photo-1439405326854-014607f694d7?q=80&w=1000',
        url: 'https://cdn.pixabay.com/audio/2022/03/09/audio_30bf7a39ce.mp3',
        duration: '6:10',
        tags: ['ambient', 'ocean', 'waves']
      },
      {
        id: 'ambient-3',
        title: 'Gentle Rainfall',
        artist: 'Weather Ambience',
        album: 'Precipitation',
        coverImage: 'https://images.unsplash.com/photo-1523772721666-22ad3c3b6f90?q=80&w=1000',
        url: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d16737dc28.mp3',
        duration: '5:45',
        tags: ['ambient', 'rain', 'relaxation']
      }
    ]
  },
  {
    id: 'classical',
    name: 'Classique',
    description: 'Œuvres classiques reconnues pour stimuler la concentration et améliorer les performances cognitives.',
    tracks: [
      {
        id: 'classical-1',
        title: 'Bach: Air on the G String',
        artist: 'Johann Sebastian Bach',
        album: 'Classical Essentials',
        coverImage: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=1000',
        url: 'https://cdn.pixabay.com/audio/2022/01/26/audio_d6ecde8420.mp3',
        duration: '5:46',
        tags: ['classical', 'bach', 'strings']
      },
      {
        id: 'classical-2',
        title: 'Mozart: Piano Sonata No. 16',
        artist: 'Wolfgang Amadeus Mozart',
        album: 'Mozart Collection',
        coverImage: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=1000',
        url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_c877851825.mp3',
        duration: '4:40',
        tags: ['classical', 'mozart', 'piano']
      },
      {
        id: 'classical-3',
        title: 'Debussy: Clair de Lune',
        artist: 'Claude Debussy',
        album: 'Piano Dreams',
        coverImage: 'https://images.unsplash.com/photo-1513883049090-d0b7439799bf?q=80&w=1000',
        url: 'https://cdn.pixabay.com/audio/2022/05/13/audio_8fcf7a13aa.mp3',
        duration: '5:12',
        tags: ['classical', 'debussy', 'piano']
      }
    ]
  },
  {
    id: 'focus',
    name: 'Musique de Concentration',
    description: 'Compositions instrumentales spécialement conçues pour améliorer la concentration et la productivité.',
    tracks: [
      {
        id: 'focus-1',
        title: 'Deep Focus',
        artist: 'Mind Clarity',
        album: 'Concentration Zone',
        coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1000',
        url: 'https://cdn.pixabay.com/audio/2022/05/16/audio_1955326866.mp3',
        duration: '4:20',
        bpm: 60,
        tags: ['focus', 'productivity', 'instrumental']
      },
      {
        id: 'focus-2',
        title: 'Alpha Waves Study',
        artist: 'Brain Boost',
        album: 'Cognitive Enhancement',
        coverImage: 'https://images.unsplash.com/photo-1499377193864-82682aefed04?q=80&w=1000',
        url: 'https://cdn.pixabay.com/audio/2022/10/30/audio_946bc8e082.mp3',
        duration: '7:15',
        tags: ['focus', 'binaural', 'study']
      },
      {
        id: 'focus-3',
        title: 'Productivity Flow',
        artist: 'Deep Work',
        album: 'Flow State',
        coverImage: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1000',
        url: 'https://cdn.pixabay.com/audio/2022/10/03/audio_95db42a1d5.mp3',
        duration: '6:30',
        bpm: 65,
        tags: ['focus', 'flow', 'work']
      }
    ]
  },
  {
    id: 'jazz',
    name: 'Jazz & Bossa Nova',
    description: 'Rythmes de jazz et bossa nova élégants pour un environnement de travail sophistiqué et agréable.',
    tracks: [
      {
        id: 'jazz-1',
        title: 'Café Piano',
        artist: 'Jazz Essentials',
        album: 'Coffee Shop Jazz',
        coverImage: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1000',
        url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_c43e44c783.mp3',
        duration: '3:45',
        bpm: 95,
        tags: ['jazz', 'piano', 'cafe']
      },
      {
        id: 'jazz-2',
        title: 'Smooth Saxophone',
        artist: 'Midnight Blue',
        album: 'Late Night Jazz',
        coverImage: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?q=80&w=1000',
        url: 'https://cdn.pixabay.com/audio/2022/05/17/audio_89dade64aa.mp3',
        duration: '4:12',
        bpm: 88,
        tags: ['jazz', 'saxophone', 'smooth']
      },
      {
        id: 'jazz-3',
        title: 'Bossa Afternoon',
        artist: 'Brazilian Vibes',
        album: 'Ipanema Dreams',
        coverImage: 'https://images.unsplash.com/photo-1505159940484-eb2b9f2588e2?q=80&w=1000',
        url: 'https://cdn.pixabay.com/audio/2021/12/12/audio_454e93808e.mp3',
        duration: '3:50',
        bpm: 100,
        tags: ['bossa nova', 'guitar', 'relax']
      }
    ]
  }
];
