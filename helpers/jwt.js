import jwt from "jsonwebtoken";
import "dotenv/config";

export async function generateJWT(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });
}

//da mettere in tutte le rotte che non siano la login
export function verifyJWT(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

