import mongoose from "mongoose";
import User from "../models/User.js"
import mailer from "../helpers/mailer.js";
import { uploadDocumenti } from "../middlewares/uploadCloudinary.js";




export async function getAll(request, response) {
    try {
        const users = await User.find()
        response.status(200).json(users)
    } catch (error) {
        response.status(500).json({ message: "Errore nel recupero degli utenti", error })
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
            return response.status(404).json({ message: "Utente non trovato" });
        response.status(200).json(user);
    } catch (error) {
        response
            .status(500)
            .json({ message: "errore nel recupero del singolo utente", error });
    }
}

export async function createUser(request, response) {
    try {
        const { nome, cognome, email, dataDiNascita, password} = request.body;

        if (!nome || !cognome || !email || !dataDiNascita) {
            return response.status(400).json({ message: "I campi nome, cognome, email e data di nascita sono obbligatori" })
        }
        // Controllo se esiste già un utente con la stessa email
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return response.status(400).json({ message: "Utente già registrato" });
        }

        const avatarPath = request.file ? request.file.path : undefined;

        console.log(avatarPath)

        const newUser = new User({ nome, cognome, email, password, dataDiNascita, avatar: avatarPath })
        const userSaved = await newUser.save()
        return response.status(201).json({message: "Utente registrato con successo"});

    } catch (error) {
        response
            .status(500)
            .json({ message: "errore nella creazione del singolo utente", error });
    }

}

export async function modifyUserAndAvatar(request, response) {
    try {
        const { id } = request.params;
        const { nome, cognome, email, dataDiNascita } = request.body;

        if (!nome || !cognome || !email || !dataDiNascita) {
            return response.status(400).json({
                message: "I campi nome, cognome, email e dataDiNascita sono obbligatori",
            });
        }

        // Controllo ID valido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({ message: "ID utente non valido" });
        }

        const avatarPath = request.file ? request.file.path : undefined;

        console.log(avatarPath)



        const updatedUser = await User.findByIdAndUpdate(
            id,
            { nome, cognome, email, dataDiNascita, avatar: avatarPath, ruolo, categoria }, // aggiorna solo se arrivano nuovi file },
            { new: true }
        );

        if (!updatedUser) {
            return response.status(404).json({ message: "Utente non trovato" });
        }

        if (request.file && updatedUser?.avatar !== avatarPath) {
            return response.status(415).json({ message: "Formato immagine non supportato" });
        }

        //     const html = `
        //   <h1>Dati utente modificati</h1>
        //   <p>Ciao ${updatedUser.nome} ${updatedUser.cognome}, i tuoi dati utente sono stati modificati correttamente.</p>
        // `;

        //     console.log("Invio mail a:", updatedUser.email);

        //     await mailer.sendMail({
        //         to: updatedUser.email,
        //         subject: "Dati aggiornati correttamente",
        //         html,
        //         from: "amministrazione@teamnewracing.com",
        //     });

        return response.status(200).json(updatedUser);

    } catch (error) {
        console.error("Errore in modifyUser:", error);
        return response
            .status(500)
            .json({ message: "Errore nella modifica dell'utente", error: error.message });
    }
}


export async function modifyUserAndDoc(request, response) {
  try {
    const { id } = request.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(400).json({ message: "ID utente non valido" });
    }

    const userDB = await User.findById(id);
    if (!userDB) return response.status(404).json({ message: "Utente non trovato" });

    // Se arrivano file nuovi, li aggiungiamo
    const uploadedDocs = request.files?.map(file => ({
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
    })) || [];

    // Se arriva un array `docPersonali` (JSON), lo usiamo per aggiornare il DB
    let updatedDocs = userDB.docPersonali;
    if (request.body.docPersonali) {
      updatedDocs = JSON.parse(request.body.docPersonali);
    }

    // Aggiungi eventuali file caricati
    const allDocs = [...updatedDocs, ...uploadedDocs];

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { docPersonali: allDocs },
      { new: true }
    );

    return response.status(200).json(updatedUser);
  } catch (error) {
    console.error("Errore in modifyUserDocs:", error);
    return response.status(500).json({
      message: "Errore nella modifica dei documenti utente",
      error: error.message,
    });
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