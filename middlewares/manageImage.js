// import { uploadUserAvatar } from "./uploadCloudinary.js";

// export async function manageAvatar (request, response, next){
//     const {avatar} = request.body;
//     if (!avatar){
//         next()
//     } else {
//         uploadUserAvatar.single("avatar")
//         next()
//     }
// }

import { uploadUserAvatar } from "./uploadCloudinary.js";

export async function manageAvatar(req, res, next) {
  // multer gestirà lui stesso l'assenza del file
  const upload = uploadUserAvatar.single("avatar");

  upload(req, res, function (err) {
    if (err) {
      console.error("Errore upload avatar:", err);
      return res.status(500).json({ error: "Errore durante l'upload dell'immagine" });
    }
    next();
  });
}
