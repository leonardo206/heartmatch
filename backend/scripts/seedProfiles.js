const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Importa il modello User
const User = require('../models/User');

// Connessione al database
const connectDB = require('../config/database');

const fakeProfiles = [
  {
    email: 'sara.rossi@test.com',
    password: 'test123',
    name: 'Sara Rossi',
    age: 24,
    gender: 'female',
    interestedIn: ['male'],
    bio: 'Mi piace viaggiare, leggere e fare sport. Cerco qualcuno con cui condividere avventure!',
    interests: ['viaggi', 'libri', 'palestra', 'cucina'],
    photos: ['https://picsum.photos/300/400?random=1'],
    location: {
      coordinates: [12.4964, 41.9028] // Roma
    }
  },
  {
    email: 'marco.bianchi@test.com',
    password: 'test123',
    name: 'Marco Bianchi',
    age: 26,
    gender: 'male',
    interestedIn: ['female'],
    bio: 'Appassionato di musica e tecnologia. Amo i concerti e le serate con gli amici.',
    interests: ['musica', 'tecnologia', 'concerti', 'fotografia'],
    photos: ['https://picsum.photos/300/400?random=2'],
    location: {
      coordinates: [9.1859, 45.4642] // Milano
    }
  },
  {
    email: 'laura.verdi@test.com',
    password: 'test123',
    name: 'Laura Verdi',
    age: 23,
    gender: 'female',
    interestedIn: ['male'],
    bio: 'Studentessa di medicina, amo la natura e gli animali. Cerco qualcuno di genuino!',
    interests: ['medicina', 'natura', 'animali', 'yoga'],
    photos: ['https://picsum.photos/300/400?random=3'],
    location: {
      coordinates: [11.3426, 44.4949] // Bologna
    }
  },
  {
    email: 'andrea.neri@test.com',
    password: 'test123',
    name: 'Andrea Neri',
    age: 28,
    gender: 'male',
    interestedIn: ['female'],
    bio: 'Chef professionista, amo cucinare e scoprire nuovi sapori. La vita è troppo breve per mangiare male!',
    interests: ['cucina', 'vino', 'viaggi', 'arte'],
    photos: ['https://picsum.photos/300/400?random=4'],
    location: {
      coordinates: [14.2681, 40.8518] // Napoli
    }
  },
  {
    email: 'chiara.gialli@test.com',
    password: 'test123',
    name: 'Chiara Gialli',
    age: 25,
    gender: 'female',
    interestedIn: ['male'],
    bio: 'Designer creativa, amo l\'arte e la moda. Cerco qualcuno che sappia apprezzare la bellezza delle piccole cose.',
    interests: ['design', 'arte', 'moda', 'fotografia'],
    photos: ['https://picsum.photos/300/400?random=5'],
    location: {
      coordinates: [10.4017, 43.7228] // Pisa
    }
  },
  {
    email: 'luca.blu@test.com',
    password: 'test123',
    name: 'Luca Blu',
    age: 27,
    gender: 'male',
    interestedIn: ['female'],
    bio: 'Ingegnere informatico, appassionato di gaming e serie TV. Cerco qualcuno con cui condividere le mie passioni!',
    interests: ['programmazione', 'gaming', 'serie tv', 'cinema'],
    photos: ['https://picsum.photos/300/400?random=6'],
    location: {
      coordinates: [11.2558, 43.7696] // Firenze
    }
  },
  {
    email: 'elena.rosa@test.com',
    password: 'test123',
    name: 'Elena Rosa',
    age: 22,
    gender: 'female',
    interestedIn: ['male'],
    bio: 'Studentessa di psicologia, amo la danza e la musica. Cerco qualcuno che mi faccia sorridere!',
    interests: ['psicologia', 'danza', 'musica', 'meditazione'],
    photos: ['https://picsum.photos/300/400?random=7'],
    location: {
      coordinates: [8.9463, 44.4056] // Genova
    }
  },
  {
    email: 'davide.verde@test.com',
    password: 'test123',
    name: 'Davide Verde',
    age: 29,
    gender: 'male',
    interestedIn: ['female'],
    bio: 'Personal trainer, amo lo sport e uno stile di vita sano. Cerco qualcuno che condivida i miei valori!',
    interests: ['fitness', 'sport', 'salute', 'outdoor'],
    photos: ['https://picsum.photos/300/400?random=8'],
    location: {
      coordinates: [16.8661, 41.1171] // Bari
    }
  }
];

async function seedProfiles() {
  try {
    // Connessione al database
    await connectDB();
    console.log('✅ Connesso al database');

    // Elimina profili esistenti (opzionale)
    await User.deleteMany({ email: { $in: fakeProfiles.map(p => p.email) } });
    console.log('🗑️ Profili esistenti eliminati');

    // Inserisci i nuovi profili
    const createdUsers = [];
    for (const profile of fakeProfiles) {
      const user = new User(profile);
      await user.save();
      createdUsers.push(user);
      console.log(`✅ Creato profilo: ${profile.name} (${profile.email})`);
    }

    console.log(`\n🎉 Creati ${createdUsers.length} profili di test!`);
    console.log('\n📧 Credenziali per testare:');
    createdUsers.forEach(user => {
      console.log(`   ${user.email} / test123`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Errore durante il seeding:', error);
    process.exit(1);
  }
}

// Esegui lo script
seedProfiles();
