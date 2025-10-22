import mailer from "../helpers/mailer.js";
import multer from "multer";

export async function createsegn(request, response) {
    try {
        console.log(request.body)
        const { nome, email, messaggio } = request.body;
        const allegati = request.files.map((f) => ({
            filename: f.originalname,
            path: f.path,
        }));


        await mailer.sendMail({
            from: "amministrazione@teamnewracing.com",
            to: "safeguarding.newracing@gmail.com",
            replyTo: email,
            subject: `Nuova segnalazione da ${nome}`,
            text: messaggio,
            attachments: allegati,
        });
        return response.status(200).json({ message: "Segnalazione inviata con successo" });

    } catch (error) {
        console.error("Errore invio segnalazione safeguarding:", error);
        return response
            .status(500)
            .json({ message: "Errore invio segnalazione safeguarding", error: error.message });
    }
}


