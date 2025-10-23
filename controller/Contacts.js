import mailer from "../helpers/mailer.js";
import User from "../models/User.js";

export async function contactUs(request, response) {
  try {
    const { email, message } = request.body;
    console.log(email)
    const info = mailer.sendMail({
      from: "amministrazione@teamnewracing.com", // mittente autenticato
      to: "amministrazione@teamnewracing.com",
      replyTo: email,  // email dell’utente che ha compilato il form
      subject: "Richiesta informazioni",
      text: message,
    });

    console.log(info)
    return response.status(200).json({ message: "Messaggio inviato con successo" });

  } catch (err) {
    console.error("Errore nell'invio della mail", err);
    return response.status(500).json({ message: "Errore nell'invio della mail" });
  }
}


