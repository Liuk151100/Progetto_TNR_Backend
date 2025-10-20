import mailer from "../helpers/mailer.js";
import User from "../models/User.js";

export async function contactUs(request, response) {
  try {
    const { email, message } = request.body;
    console.log(email)
    const info = await mailer.sendMail({
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

export async function safeGuarding(request, response) {
  try {
    const { email, message } = request.body;
    console.log(email)
    const info = await mailer.sendMail({
      from: "amministrazione@teamnewracing.com", // mittente autenticato safeguarding.newracing@gmail.com
      to: "safeguarding.newracing@gmail.com",
      replyTo: email,  // email dell’utente che ha compilato il form
      subject: "Segnalazione per Safeguarding",
      text: message,
    });

    console.log(info)
    return response.status(200).json({ message: "Messaggio inviato con successo" });

  } catch (err) {
    console.error("Errore nell'invio della mail", err);
    return response.status(500).json({ message: "Errore nell'invio della mail" });
  }
}


