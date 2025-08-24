import mongoose from 'mongoose';

type ConncectionObject = {
    isConnected?: number;
}

const connection: ConncectionObject = {};

async function dbConnect() {
    if (connection.isConnected) {
        console.log("Database is already connected");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI as string || '');
        connection.isConnected = db.connections[0].readyState;
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Dataabase connection failed", error);
        connection.isConnected = 0;
    }
}

export default dbConnect
