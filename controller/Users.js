import mongoose from "mongoose";
import User from "../models/User.js"




export async function getAll(request, response) {
    try {
        const users = await User.find()
        response.status(200).json(users)
    } catch (error) {
        response.status(500).json({ message: "Errore nel recupero degli autori", error })
    }
}

export async function getSingleUser(request, response) {
    try {
        //Aggiungere nella parte del frontend, sulla pagina di profilo dell'utente, un avviso di assenza dei documenti 
        //nel caso in cui nella risposta del server, non ci fossero ancora documenti caricati (promemoria solo per i piloti,
        //andare a guardare il ruolo dell'utente)
        const { id } = request.params;
        const user = await User.findById(id);
        if (!user)
            return response.status(404).json({ message: "user non trovato" });
        response.status(200).json(user);
    } catch (error) {
        response
            .status(500)
            .json({ message: "errore nel recupero del singolo utente", error });
    }
}

export async function createUser(request, response) {
    try {
        const { nome, cognome, email, dataDiNascita, docPersonali } = request.body;
        let {avatar} = request.body;
        if (!nome || !cognome || !email || !dataDiNascita) {
            return response.status(400).json({ message: "I campi nome, cognome, email e data DiNascita sono obbligatori" })
        }
        // Controllo se esiste già un utente con la stessa email
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return response.status(400).json({ message: "Utente già registrato" });
        }

        const newUser = new User({ nome, cognome, email, dataDiNascita, avatar, docPersonali })
        const userSaved = await newUser.save()
        response.status(201).json(userSaved)

    } catch (error) {
        response
            .status(500)
            .json({ message: "errore nella creazione del singolo utente", error });
    }

}


export async function deleteUser(request, response) {
    try {
        const { id } = request.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({ message: "Id non valido" })
        }
        const deletedUser = await User.findByIdAndDelete(id)
        if (!deletedUser) {
            response.status(404).json({ message: "Utente non trovato" })

        }
        response.status(200).json("Utente eliminato")
    } catch (error) {
        response.status(500).json({ message: "Errore nella cancellazione del singolo utente", error })
    }
}