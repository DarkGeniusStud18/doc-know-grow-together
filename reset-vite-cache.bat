@echo off
echo ==============================
echo 🔄 Nettoyage du projet...
echo ==============================

:: Supprimer node_modules
echo 🧹 Suppression de node_modules...
rd /s /q node_modules

:: Supprimer package-lock.json
echo 🧹 Suppression de package-lock.json...
del package-lock.json

:: Supprimer le cache .vite (dans node_modules/.vite)
echo 🧹 Suppression du cache Vite...
rd /s /q node_modules\.vite

:: Nettoyer le cache npm global
echo 🧹 Nettoyage du cache npm global...
npm cache clean --force

:: Réinstallation des dépendances
echo 📦 Réinstallation des dépendances...
npm install

:: Lancer le serveur
echo 🚀 Lancement du serveur...
npm run dev

echo ==============================
echo ✅ Nettoyage terminé.
echo ==============================
pause
