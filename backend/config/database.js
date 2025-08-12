const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use MongoDB Atlas free tier
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://lproiettibusiness:lzq9ZqbLbE2JcDah@cluster0.wvuahqh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB Atlas connection error:', error.message);
    console.log('💡 Please set up MongoDB Atlas or use a local MongoDB instance');
    console.log('📝 To set up Atlas:');
    console.log('   1. Go to https://cloud.mongodb.com');
    console.log('   2. Create a free cluster');
    console.log('   3. Get your connection string');
    console.log('   4. Set MONGODB_URI environment variable');
    process.exit(1);
  }
};

module.exports = connectDB;