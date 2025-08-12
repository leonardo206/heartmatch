#!/bin/bash

echo "🚀 HeartMatch Deploy Script"
echo "=========================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository non trovato. Inizializza git prima del deploy."
    exit 1
fi

# Check if changes are committed
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Ci sono modifiche non committate. Committa prima del deploy."
    git status
    exit 1
fi

echo "✅ Repository pulito, procedendo con il deploy..."

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

echo "🎉 Deploy avviato!"
echo ""
echo "📋 Prossimi passi:"
echo "1. Vai su Render.com e crea un nuovo Web Service"
echo "2. Connetti il repository GitHub"
echo "3. Configura le variabili d'ambiente:"
echo "   - JWT_SECRET=your-secret-key"
echo "   - MONGODB_URI=your-mongodb-uri"
echo "   - NODE_ENV=production"
echo "   - FRONTEND_URL=https://your-app.vercel.app"
echo ""
echo "4. Vai su Vercel.com e importa il repository"
echo "5. Configura REACT_APP_API_URL=https://your-backend.onrender.com/api"
echo ""
echo "🔗 Link utili:"
echo "- Render.com: https://render.com"
echo "- Vercel.com: https://vercel.com"
echo "- MongoDB Atlas: https://cloud.mongodb.com"
