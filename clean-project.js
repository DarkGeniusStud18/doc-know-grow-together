
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔄 Nettoyage complet du projet MedCollab...');

// Fonction pour supprimer un dossier de manière récursive
function deleteFolder(folderPath) {
  if (fs.existsSync(folderPath)) {
    console.log(`🧹 Suppression de ${folderPath}...`);
    fs.rmSync(folderPath, { recursive: true, force: true });
  }
}

// Fonction pour supprimer un fichier
function deleteFile(filePath) {
  if (fs.existsSync(filePath)) {
    console.log(`🧹 Suppression de ${filePath}...`);
    fs.unlinkSync(filePath);
  }
}

try {
  // 1. Supprimer node_modules
  deleteFolder('node_modules');
  
  // 2. Supprimer les fichiers de verrouillage
  deleteFile('package-lock.json');
  deleteFile('yarn.lock');
  deleteFile('pnpm-lock.yaml');
  deleteFile('bun.lockb');
  
  // 3. Supprimer les caches Vite
  deleteFolder('.vite');
  deleteFolder('dist');
  deleteFolder('dev-dist');
  
  // 4. Supprimer les dossiers de cache temporaires
  deleteFolder('.cache');
  deleteFolder('.temp');
  deleteFolder('.tmp');
  
  // 5. Nettoyer le cache npm global
  console.log('🧹 Nettoyage du cache npm global...');
  try {
    execSync('npm cache clean --force', { stdio: 'inherit' });
  } catch (error) {
    console.warn('⚠️ Impossible de nettoyer le cache npm:', error.message);
  }
  
  // 6. Réinstaller les dépendances
  console.log('📦 Réinstallation des dépendances...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('✅ Nettoyage terminé avec succès !');
  console.log('🚀 Vous pouvez maintenant lancer npm run dev');
  
} catch (error) {
  console.error('❌ Erreur lors du nettoyage:', error.message);
  process.exit(1);
}
