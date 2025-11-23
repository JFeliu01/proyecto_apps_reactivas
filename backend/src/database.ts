import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase';
const MONGODB_DBNAME = process.env.MONGODB_DBNAME;

// Si se especifica un nombre de base de datos separado, usarlo
const connectionOptions: any = {};
if (MONGODB_DBNAME) {
  connectionOptions.dbName = MONGODB_DBNAME;
}

mongoose.connect(MONGODB_URI, connectionOptions)
  .then(() => console.log(`MongoDB connected to database: ${MONGODB_DBNAME || 'default'}`))
  .catch(err => console.error('MongoDB connection error:', err));
