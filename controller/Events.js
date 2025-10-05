import mongoose from "mongoose";
import mailer from "../helpers/mailer.js";
import Event from "../models/Event.js";
import User from "../models/User.js";




export async function getAllEvents(request, response) {
    try {
        const events = await Event.find()
        response.status(200).json(events)
    } catch (error) {
        response.status(500).json({ message: "Errore nel recupero degli eventi", error })
    }
}

export async function getSingleEvent(request, response) {
    try {
        //Aggiungere nella parte del frontend, sulla pagina di profilo dell'utente, un avviso di assenza dei documenti 
        //nel caso in cui nella risposta del server, non ci fossero ancora documenti caricati (promemoria solo per i piloti,
        //andare a guardare il ruolo dell'utente)
        const { id } = request.params;
        const event = await Event.findById(id);
        if (!event)
            return response.status(404).json({ message: "Evento non trovato" });
        response.status(200).json(event);
    } catch (error) {
        response
            .status(500)
            .json({ message: "errore nel recupero del singolo evento", error });
    }
}

export async function createEvent(request, response) {
    try {
        const { titolo, data, luogo, partecipanti } = request.body;

        if (!titolo || !data || !luogo) {
            return response.status(400).json({ message: "I campi titolo, data e luogo sono obbligatori" })
        }
        // Controllo se esiste già un utente con la stessa email
        const existingEvent = await Event.findOne({ data });

        if (existingEvent) {
            return response.status(400).json({ message: "Evento già creato" });
        }

        const newEvent = new Event({ titolo, data, luogo, partecipanti })
        const eventSaved = await newEvent.save()

        const users = await User.find()

        for (const user of users) {
            const html = `
                <h1>Nuovo evento aggiunto al calendario</h1>
                <p>Ciao ${user.nome} ${user.cognome}, il presidente del Team New Racing ha aggiunto l'evento ${titolo} 
                che si terrà il ${data} presso ${luogo}. Saremmo molto felici se riuscissi a venire e condividere questo
                momento insieme a tutto lo staff.</p>`;

            const Mail = await mailer.sendMail({
                to: user.email,
                subject: "Nuovo evento in programma",
                html,
                from: "lucafaini21@gmail.com",//"amministrazione@teamnewracing.com"
            });
        }

        response.status(201).json(eventSaved);

    } catch (error) {
        response
            .status(500)
            .json({ message: "errore nella creazione del singolo evento", error });
    }

}

export async function modifyEvent(request, response) {
    try {
        const { id } = request.params
        const { titolo, data, luogo, partecipanti } = request.body;

        if (!titolo || !data || !luogo) {
            return response.status(400).json({ message: "I campi titolo, data e luogo sono obbligatori" })
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            { titolo, data, luogo, partecipanti },
            { new: true }
        );
        if (!updatedEvent) {
            return response.status(400).json({ message: "Evento non trovato", error });
        }

        const users = await User.find()

        for (const user of users) {
            const html = `
                <h1>Evento modificato</h1>
                <p>Ciao ${user.data.nome} ${user.data.cognome}, il presidente del Team New Racing ha modificato dei dati dell'evento 
                ${titolo} che si terrà il ${data} presso ${luogo}. Saremmo molto felici se riuscissi a venire e condividere questo
                momento insieme a tutto lo staff.</p>`;

            const Mail = await mailer.sendMail({
                to: user.data.email,
                subject: "Aggiornamento evento in programma",
                html: html,
                from: "lucafaini21@gmail.com",//"amministrazione@teamnewracing.com"
            });
        }

        response.status(200).json(updatedEvent);


    } catch (error) {
        response
            .status(500)
            .json({ message: "errore nella modifica dell'evento", error });
    }

}


export async function deleteEvent(request, response) {
    try {
        const { id } = request.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({ message: "Id non valido" })
        }
        const deletedEvent = await Event.findByIdAndDelete(id)
        if (!deletedEvent) {
            response.status(404).json({ message: "Evento non trovato" })

        }
        response.status(200).json("Evento eliminato")
    } catch (error) {
        response.status(500).json({ message: "Errore nella cancellazione del singolo evento", error })
    }
}