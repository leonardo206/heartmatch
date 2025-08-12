# Frontend Deploy Instructions

## Vercel Deploy

1. **Crea account su Vercel.com**
2. **Importa il repository GitHub**
3. **Configura le variabili d'ambiente:**

```
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

4. **Build Command:** `npm run build`
5. **Output Directory:** `build`
6. **Install Command:** `npm install`

## Environment Variables

- `REACT_APP_API_URL`: URL del backend (es. https://your-backend.onrender.com/api)

## Build Configuration

- **Framework Preset:** Create React App
- **Node.js Version:** 18.x
- **Build Output:** Static files in `build/` directory
