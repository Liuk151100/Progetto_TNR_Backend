import Event from "../models/Event.js";

export async function validateEvent(request, response, next) {
  const { id } = request.params;
  const {titolo, data, luogo} = request.body; 
  if(!titolo || !data || !luogo) {
    return response
        .status(400)
        .json({ message: "Manca un campo obbligatorio (*)" });
  }
  
  next(); 
}
