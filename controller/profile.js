

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