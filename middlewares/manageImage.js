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

import { uploadSponsorLogo, uploadUserAvatar } from "./uploadCloudinary.js";

export async function manageAvatar(req, res, next) {
  // multer gestirà lui stesso l'assenza del file
  const uploadAvatar = uploadUserAvatar.single("avatar");

  uploadAvatar(req, res, function (err) {
    if (err) {
      console.error("Errore upload avatar:", err);
      return res.status(500).json({ error: "Errore durante l'upload dell'immagine" });
    }
    next();
  });
}


export async function manageLogo(req, res, next) {
  // multer gestirà lui stesso l'assenza del file
  const uploadLogo = uploadSponsorLogo.single("logo");

  uploadLogo(req, res, function (err) {
    if (err) {
      console.error("Errore upload logo:", err);
      return res.status(500).json({ error: "Errore durante l'upload dell'immagine" });
    }
    next();
  });
}
