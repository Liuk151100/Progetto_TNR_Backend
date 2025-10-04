import { verifyJWT } from "../helpers/jwt.js";
import User from "../models/User.js";


export async function authMW(request, response, next) {
  const headerAuth = request.headers.authorization || "";
  console.log("auth header:", headerAuth);

  const token = headerAuth.replace("Bearer ", "");
  if (!token) return response.status(401).json({ message: "token mancante" });

  try {
    const payload = verifyJWT(token);

    // accetta sia 'id'(registrazione normale) che 'userId' (da google)
    const userId = payload.id || payload.userId;

    if (!userId) {
      return response.status(401).json({ message: "token senza id valido" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return response.status(401).json({ message: "Utente non trovato" });
    }

    request.user = user;
    console.log("sto per chiamare next");
    next();
  } catch (err) {
    console.error("authMW error:", err);
    return response.status(401).json({ message: "token scaduto o non valido" });
  }
}
