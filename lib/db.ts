import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI){
    throw new Error (
        "please dfine the db uri name clearly in .env file"
    ); 
}

let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = { conn : null, promise: null}
}

export async function connectionToDB(){
    if(cached.conn){
        return cached.conn
    }

    if(!cached.promise){
        const opts = {
            bufferCommands : true,
            maxpoolsize : 10
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts)
        .then(
            () => mongoose.connection
        );
    }
    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw (error)
    }
    return cached.conn;
}