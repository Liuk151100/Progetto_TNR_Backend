import mongoose from "mongoose";

export function validateId(request, response, next) {
  const { id, cId } = request.params;
  if (!mongoose.Types.ObjectId.isValid(id)) { 
    return response.status(404).json({ message: "ID non valido" });
  }
  if (cId && !mongoose.Types.ObjectId.isValid(cId)) {
    return response.status(404).json({ message: "ID commento non valido" });
  }
  next(); 
}