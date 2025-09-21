import mongoose from "mongoose";

type ConnectionType ={
    isConnected?:number
}

const connection:ConnectionType = {}

export default async function dbConnect():Promise<void>{

    if(connection.isConnected) console.log("Already Connected to Database");
    
    try {
        const db = await mongoose.connect(process.env.MONGODB_URL || '')
        connection.isConnected = db.connections[0].readyState
    } catch (error) {
        console.log("Connection Failed !!!");
        process.exit(1)
    }
}

