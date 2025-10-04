import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { generateJWT} from "../helpers/jwt.js";
import User from "../models/User.js";

const googleStrategy = new GoogleStrategy(
  //per tirare fuori il popUp di google
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_HOST}${process.env.GOOGLE_CALLBACK_PATH}`,
  },
  //callback che si attiva quando google ci passa i dati
  async function (accessToken, refreshToken, profile, cb) {
    console.log("callback google, profile", profile);
    //profile.id identificativo importante da salvare nel DB
    //profile._json altri dati del profilo pubblico
    try {
      //findOne e non findById perché non è l'id di mongo
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = await User.create({
          nome: profile._json.given_name,
          cognome: profile._json.family_name,
          email: profile._json.email,
          avatar: profile._json.picture
                        ? { path: profile._json.picture }
                        : null,
          googleId: profile.id,
        });
      }
      const jwt = await generateJWT({userId: user.id}); //.id e non ._id perchè google lo manda così mentre mongo nell'altro modo

      cb(null, {jwt}) //tipo next, mi manda avanti; mi troverò la chiave jwt in reqest.user
    } catch (err) {
      cb(err, null) //tipo next, mi manda avanti; mi troverò la chiave jwt in reqest.user
    }
  }
);

export default googleStrategy; 
