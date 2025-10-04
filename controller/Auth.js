import User from "../models/User.js";
import { signJWT } from "../helpers/jwt.js";

export async function register(request, response) {
  const { nome, cognome, email, password, dataDiNascita } = request.body;

  const existing = await User.findOne({ email });
  if (existing) return response.status(400).json({ message: "Credenziali già utilizzate" });

  const newUser = new User({ nome, cognome, email, password, dataDiNascita });
  await newUser.save();

  const token = await signJWT({ id: newUser._id });
  try {
    const html = `
      <h1>Ciao, ${nome} ${cognome}</h1>
      <p>Siamo felicissimi di averti con noi nel Team New Racing! Da oggi fai parte della nostra squadra e non vediamo l’ora di condividere con te passione, adrenalina e tanti chilometri insieme.</p>
      <br>
      <p>Nei prossimi giorni riceverai tutte le info su allenamenti, gare e comunicazioni del gruppo. Intanto rilassati, preparati e… allaccia le cinture: stiamo per partire!<p>
      <br>
      <p>→<a href='${process.env.FRONTEND_HOST}/authors/${newUser._id}'>CLICK HERE</a>← to visit your profile</p>
    `;
    
    const infoMail = await mailer.sendMail({
      to: email, 
      subject: "Benvenuto nel Team",
      html: html,
      from: "amministrazione@teamnewracing.com", 
    });

    console.log("Mail sent. MessageId:", infoMail.messageId);
    console.log("SMTP response:", infoMail.response);
  } catch (mailErr) {
    console.error("Errore invio email commento:", mailErr);
  }

  return response.status(201).json({ jwt: token });
}

export async function login(request, response) {
  const { email, password } = request.body;

  const userMail = await Author.findOne({ email }).select("+password");  console.log('utente', userMail);

  if (userMail) {
    //non nello stesso if perché se usermail è undefined poi comparepassword non fa
    if (await userMail.comparePassword(password)) {
      const jwt = await signJWT({
        id: userMail._id,
      });
      return response.status(200).json({message: 'Token generato con successo', jwt}); 
    }
  }

  return response.status(400).json({ message: "Credenziali sbagliate" });
}


export async function redirectToMe(request, response, next) {
  response.redirect(`${process.env.FRONTEND_HOST}/auth/google-callback?jwt=${request.user.jwt}`); //messo da me in request.user.jwt
}

