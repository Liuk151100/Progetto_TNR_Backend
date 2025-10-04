import mongoose from "mongoose"
import 'dotenv/config'; // importa il contenuto del file .env

export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION_URI)
        console.log("Connessione con il DB effettuata")
    } catch (error) {
        console.log(error)
    }
}
