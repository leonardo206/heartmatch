# Deploy Instructions

## Backend Deploy (Render.com)

1. **Crea account su Render.com**
2. **Crea nuovo Web Service**
3. **Connetti il repository GitHub**
4. **Configura le variabili d'ambiente:**

```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/your-database
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
BACKEND_URL=https://your-backend.onrender.com
```

5. **Build Command:** `cd backend && npm install`
6. **Start Command:** `cd backend && npm start`
7. **Port:** `3001`
8. **Root Directory:** `backend` (opzionale, se non usi il package.json nella root)

## Frontend Deploy (Vercel)

1. **Crea account su Vercel.com**
2. **Importa il repository GitHub**
3. **Configura le variabili d'ambiente:**

```
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

4. **Build Command:** `npm run build`
5. **Output Directory:** `build`

## Database (MongoDB Atlas)

1. **Usa il cluster esistente**
2. **Aggiorna MONGODB_URI nel backend**
3. **Assicurati che l'IP di Render sia whitelistato**
