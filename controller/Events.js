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
        const { titolo, start, end, luogo, partecipanti } = request.body;

        if (!titolo || !start || !end || !luogo) {
            return response.status(400).json({ message: "I campi titolo, data inizio e fine e luogo sono obbligatori" })
        }
        // Controllo se esiste già un utente con la stessa email
        const existingEvent = await Event.findOne({ start, end });

        if (existingEvent) {
            return response.status(400).json({ message: "Evento già creato" });
        }
        console.log(titolo, start, end, luogo, partecipanti)
        const newEvent = new Event({ titolo, start, end, luogo, partecipanti })
        const eventSaved = await newEvent.save()

        const users = await User.find()

        for (const user of users) {
            const html = `
                <h1>Nuovo evento aggiunto al calendario</h1>
                <p>Ciao ${user.nome} ${user.cognome}, il presidente del Team New Racing ha aggiunto l'evento ${titolo} 
                che si terrà dal ${start} al ${end}, presso ${luogo}. Saremmo molto felici se riuscissi a venire e condividere questo
                momento insieme a tutto lo staff.</p>`;

            const Mail = await mailer.sendMail({
                to: user.email,
                subject: "Nuovo evento in programma",
                html,
                from: "amministrazione@teamnewracing.com",
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
        const { id } = request.params;
        const { titolo, start, end, luogo } = request.body;

        if (!titolo || !start || !end || !luogo) {
            return response.status(400).json({ message: "I campi titolo, data inizio e fine e luogo sono obbligatori" });
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            { titolo, start, end, luogo },
            { new: true }
        );

        if (!updatedEvent) {
            return response.status(404).json({ message: "Evento non trovato" });
        }

        const users = await User.find();

        for (const user of users) {
            const html = `
                <h1>Evento modificato</h1>
                <p>Ciao ${user.nome} ${user.cognome}, il presidente del Team New Racing ha modificato dei dati dell'evento 
                ${updatedEvent.titolo} che si terrà dal ${updatedEvent.start} al ${updatedEvent.end}, presso ${updatedEvent.luogo}. Saremmo molto felici se riuscissi a venire e condividere questo
                momento insieme a tutto lo staff.</p>`;

            await mailer.sendMail({
                to: user.email,
                subject: "Aggiornamento evento in programma",
                html,
                from: "amministrazione@teamnewracing.com",
            });
        }

        response.status(200).json(updatedEvent);

    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Errore nella modifica dell'evento", error });
    }
}

export async function joinEvent(req, res) {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "ID non valido" });
        }

        const event = await Event.findById(id);
        if (!event) return res.status(404).json({ message: "Evento non trovato" });

        // Aggiungo solo se non presente
        if (!event.partecipanti.includes(userId)) {
            event.partecipanti.push(userId);
            await event.save();
        }

        const user = await User.findById(userId);
        const html = `
                <h1>Conferma partecipazione</h1>
                <p>${user.nome} ${user.cognome} ha confermato la partecipazione all evento ${event.titolo}</p>`;

        await mailer.sendMail({
            to: "kartiva@icloud.com",
            subject: `Conferma partecipazione evento ${event.titolo} di ${user.nome} ${user.cognome}`,
            html,
            from: "amministrazione@teamnewracing.com",
        });

        res.status(200).json(event);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Errore nel join dell'evento", error: err });
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
        const users = await User.find()

        for (const user of users) {
            const html = `
                <h1>Evento eliminato</h1>
                <p>Ciao ${user.nome} ${user.cognome}, il presidente del Team New Racing ha cancellato
                ${deletedEvent.titolo} che si sarebbe tenuto dal ${deletedEvent.start} al ${deletedEvent.end}, presso ${deletedEvent.luogo}. Riceverai una mail nel caso in cui l'evento
                verrà aggiunto di nuovo al calendario, con tutte le informazioni utili per la partecipazione.</p>`;

            const Mail = await mailer.sendMail({
                to: user.email,
                subject: "Cancellazione evento in programma",
                html: html,
                from: "amministrazione@teamnewracing.com",
            });
        }
        response.status(200).json("Evento eliminato")
    } catch (error) {
        response.status(500).json({ message: "Errore nella cancellazione del singolo evento", error })
    }
}