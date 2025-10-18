import User from "../models/User.js";

export async function getMe(request, response) {
  try {
    console.log("REQUEST.AUTHOR", request.user);
    const user = request.user; //da mw

    return response.status(200).json(user);
  } catch (err) {
    console.error("Errore nel recupero dell'utente loggato", err);
    return response.status(500).json({ message: "Errore nel recupero utente loggato" });
  }
}


export async function edit(request, response) {
  try {
    const id = request.user.id;
    console.log("id utente da modificare", id);
     const { nome, cognome, email, dataDiNascita, avatar, docPersonali } = request.body;
    console.log(nome, cognome, email, dataDiNascita, avatar, docPersonali);
    if (!nome || !cognome || !email) {
      return response
        .status(400)
        .json({ message: "manca un campo obbligatorio" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { nome, cognome, email, dataDiNascita, avatar, docPersonali },
      { new: true } //legge, aggiorna e da i dati nuovi, altrimenti ti da i dati vecchi
    );
    if (!updatedUser) {
      console.log("[edit]User non trovato");
      return response
        .status(400)
        .json({ message: "User non trovato", error });
    }
    console.log("User trovato");
    response.status(200).json(updatedUser);
  } catch (error) {
    response
      .status(500)
      .json({ message: "errore nella modifica dello user", error });
  }
}

export async function deleteMe(req, res) {
    const id = req.user._id;

    try{
      await User.findByIdAndDelete(id);
    } catch(error){
      res.status(500).json({ message: "Errore durante la cancellazione dello User", error });
    }

}
