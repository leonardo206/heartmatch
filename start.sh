#!/bin/bash

# Avvia MongoDB (se non è già in esecuzione)
echo "Avvio MongoDB..."
mongod --dbpath ./data/db &

# Avvia il backend
echo "Avvio backend..."
cd backend
npm install
npm run dev &

# Avvia il frontend
echo "Avvio frontend..."
cd ../frontend
npm install
npm start 