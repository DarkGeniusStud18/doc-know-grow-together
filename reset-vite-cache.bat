
@echo off
echo ==============================
echo 🔄 Nettoyage approfondi du projet...
echo ==============================

:: Arrêter tous les processus Node.js en cours
echo 🛑 Arrêt des processus Node.js...
taskkill /f /im node.exe >nul 2>&1

:: Supprimer node_modules
echo 🧹 Suppression de node_modules...
if exist node_modules rd /s /q node_modules

:: Supprimer les fichiers de verrouillage
echo 🧹 Suppression des fichiers de verrouillage...
if exist package-lock.json del package-lock.json
if exist yarn.lock del yarn.lock
if exist pnpm-lock.yaml del pnpm-lock.yaml
if exist bun.lockb del bun.lockb

:: Supprimer les caches Vite
echo 🧹 Suppression des caches Vite...
if exist .vite rd /s /q .vite
if exist dist rd /s /q dist
if exist dev-dist rd /s /q dev-dist

:: Supprimer les dossiers temporaires
echo 🧹 Suppression des dossiers temporaires...
if exist .cache rd /s /q .cache
if exist .temp rd /s /q .temp
if exist .tmp rd /s /q .tmp

:: Nettoyer le cache npm global
echo 🧹 Nettoyage du cache npm global...
npm cache clean --force

:: Nettoyer le cache npm local
echo 🧹 Nettoyage du cache npm local...
npm cache verify

:: Réinstallation des dépendances
echo 📦 Réinstallation des dépendances...
npm install

:: Attendre un peu avant de lancer le serveur
echo ⏳ Attente de 3 secondes...
timeout /t 3 /nobreak >nul

:: Lancer le serveur
echo 🚀 Lancement du serveur...
npm run dev

echo ==============================
echo ✅ Nettoyage terminé.
echo ==============================
pause
