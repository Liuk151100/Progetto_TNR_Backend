import mongoose from "mongoose";
import mailer from "../helpers/mailer.js";
import Event from "../models/Event.js";
import User from "../models/User.js";

function formatDateForEmail(date) {
    return new Date(date).toLocaleString("it-IT", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

// 🔹 Helper: converte stringa "2025-10-19T22:00" in Date locale
function toLocalDate(datetimeString) {
    if (!datetimeString) return null;
    return new Date(datetimeString + ":00"); // aggiunge i secondi
}

// -------------------------------
// 📅 GET tutti gli eventi
// -------------------------------
export async function getAllEvents(request, response) {
    try {
        const events = await Event.find();
        response.status(200).json(events);
    } catch (error) {
        response.status(500).json({ message: "Errore nel recupero degli eventi", error });
    }
}

// -------------------------------
// 📅 GET singolo evento
// -------------------------------
export async function getSingleEvent(request, response) {
    try {
        const { id } = request.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({ message: "ID evento non valido" });
        }

        const event = await Event.findById(id);
        if (!event) return response.status(404).json({ message: "Evento non trovato" });

        response.status(200).json(event);
    } catch (error) {
        response.status(500).json({ message: "Errore nel recupero del singolo evento", error });
    }
}

// -------------------------------
// 🆕 CREA evento
// -------------------------------
export async function createEvent(request, response) {
    try {
        const { titolo, start, end, luogo, partecipanti } = request.body;

        if (!titolo || !start || !end || !luogo) {
            return response
                .status(400)
                .json({ message: "I campi titolo, data inizio e fine e luogo sono obbligatori" });
        }


        // Controllo duplicati (opzionale)
        const existingEvent = await Event.findOne({ start, end });
        if (existingEvent) {
            return response.status(400).json({ message: "Evento già esistente in queste date" });
        }

        const newEvent = new Event({
            titolo,
            start,
            end,
            luogo,
            partecipanti: partecipanti || [],
        });

        // 🔸 Formatto le date per la mail
        const startFormatted = formatDateForEmail(newEvent.start);
        const endFormatted = formatDateForEmail(newEvent.end);

        const eventSaved = await newEvent.save();

        // 🔔 Invio email a tutti gli utenti
        const users = await User.find();
        for (const user of users) {
            const html = `
        <h1>Nuovo evento aggiunto al calendario</h1>
        <p>Ciao ${user.nome} ${user.cognome}, il presidente del Team New Racing ha aggiunto l'evento <b>${titolo}</b> 
        che si terrà dal <b>${startFormatted}</b> al <b>${endFormatted}</b>, presso <b>${luogo}</b>. Saremmo molto felici se riuscissi a venire e condividere questo
        momento insieme a tutto lo staff.</p>
      `;
            mailer.sendMail({
                to: user.email,
                subject: "Nuovo evento in programma",
                html,
                from: "amministrazione@teamnewracing.com",
            });
        }

        response.status(201).json(eventSaved);
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Errore nella creazione dell'evento", error });
    }
}

// -------------------------------
// ✏️ MODIFICA evento
// -------------------------------
export async function modifyEvent(request, response) {
    try {
        const { id } = request.params;
        const { titolo, start, end, luogo } = request.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({ message: "ID evento non valido" });
        }

        if (!titolo || !start || !end || !luogo) {
            return response
                .status(400)
                .json({ message: "I campi titolo, data inizio e fine e luogo sono obbligatori" });
        }


        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            { titolo, start, end, luogo },
            { new: true }
        );

        if (!updatedEvent) {
            return response.status(404).json({ message: "Evento non trovato" });
        }

        // 🔸 Formatto le date per la mail
        const startFormatted = formatDateForEmail(updatedEvent.start);
        const endFormatted = formatDateForEmail(updatedEvent.end);

        // 🔔 Email agli utenti
        const users = await User.find();
        for (const user of users) {
            const html = `
        <h1>Evento modificato</h1>
        <p>Ciao ${user.nome} ${user.cognome}, il presidente del Team New Racing ha modificato i dettagli dell'evento 
        <b>${updatedEvent.titolo}</b>, che si terrà dal <b>${startFormatted}</b> al <b>${endFormatted}</b>, presso <b>${updatedEvent.luogo}</b>.
        Ti aspettiamo per condividere questo momento insieme a tutto lo staff!</p>
      `;
            mailer.sendMail({
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

// -------------------------------
// 🙋‍♂️ JOIN evento (partecipa)
// -------------------------------
export async function joinEvent(request, response) {
    try {
        const { id } = request.params;
        const { userId } = request.body;

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
            return response.status(400).json({ message: "ID non valido" });
        }

        const event = await Event.findById(id);
        if (!event) return response.status(404).json({ message: "Evento non trovato" });

        // Aggiungo solo se non già presente
        if (!event.partecipanti.includes(userId)) {
            event.partecipanti.push(userId);
            await event.save();
            var userExist = false
        } else {
            userExist = true
        }

        const user = await User.findById(userId);
            const html = `
          <h1>Conferma partecipazione</h1>
          <p>${user.nome} ${user.cognome} ha confermato la partecipazione all'evento <b>${event.titolo}</b>.</p>
        `;

            mailer.sendMail({
                to: "kartiva@icloud.com",
                subject: `Conferma partecipazione evento ${event.titolo} di ${user.nome} ${user.cognome}`,
                html,
                from: "amministrazione@teamnewracing.com",
            });

        if (userExist) {
            response.status(200).json({ message: "Hai già inviato la partecipazione" });
        } else {
            response.status(200).json({ message: "Hai confermato la tua partecipazione" });

        }
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Errore nel join dell'evento", error });
    }
}

// -------------------------------
// ❌ ELIMINA evento
// -------------------------------
export async function deleteEvent(request, response) {
    try {
        const { id } = request.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({ message: "ID non valido" });
        }

        const deletedEvent = await Event.findByIdAndDelete(id);

        if (!deletedEvent) {
            return response.status(404).json({ message: "Evento non trovato" });
        }

        // 🔸 Formatto le date per la mail
        const startFormatted = formatDateForEmail(deletedEvent.start);
        const endFormatted = formatDateForEmail(deletedEvent.end);

        // 🔔 Email agli utenti
        const users = await User.find();
        for (const user of users) {
            const html = `
        <h1>Evento eliminato</h1>
        <p>Ciao ${user.nome} ${user.cognome}, il presidente del Team New Racing ha cancellato
        l'evento <b>${deletedEvent.titolo}</b> che si sarebbe tenuto dal <b>${startFormatted}</b> al <b>${endFormatted}</b>, presso <b>${deletedEvent.luogo}</b>.
        Riceverai una mail nel caso in cui l'evento verrà aggiunto di nuovo al calendario.</p>
      `;
            mailer.sendMail({
                to: user.email,
                subject: "Cancellazione evento in programma",
                html,
                from: "amministrazione@teamnewracing.com",
            });
        }

        response.status(200).json({ message: "Evento eliminato con successo" });
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Errore nella cancellazione dell'evento", error });
    }
}