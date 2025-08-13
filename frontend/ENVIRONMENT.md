# Environment Configuration

## Development vs Production

The app automatically detects the environment and uses the appropriate configuration:

### Development (Local)
- **API URL**: `http://localhost:3001/api`
- **Socket URL**: `http://localhost:3001`
- **Detection**: Uses `__DEV__` flag (automatically set by Expo in development)

### Production (Vercel)
- **API URL**: `https://heartmatch-a79y.onrender.com/api`
- **Socket URL**: `https://heartmatch-a79y.onrender.com`
- **Detection**: When `__DEV__` is false (production build)

## Environment Variables

For production deployments, you can override the default URLs using environment variables:

- `REACT_APP_API_URL`: Override the API URL
- `REACT_APP_SOCKET_URL`: Override the Socket URL

## Local Development Setup

1. Start the backend locally:
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend locally:
   ```bash
   cd frontend
   npm start
   ```

3. The app will automatically connect to `localhost:3001` for the backend

## Production Deployment

The app will automatically use the production URLs when deployed to Vercel.

## Configuration Files

- `src/config/config.js`: Main configuration file
- `src/services/api.js`: Uses configuration for API calls
- `src/services/authService.js`: Uses configuration for auth calls
- `src/hooks/useSocket.js`: Uses configuration for WebSocket connections
