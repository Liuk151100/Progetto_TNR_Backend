import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"

const UserSchema = new Schema({
    nome: { type: String, required: true, trim: true },
    cognome: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    dataDiNascita: { type: String, required: false },//aggiungere codice nello scope di google in modo che ci risponda anche
    //con questa informazione così che posso lasciare required:true dull data di nascita.
    avatar: { type: String, default: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png" },
    password: { type: String, minlength: 6, select: false },//la chiave selsct mi serve per escludere la password 
    // nelle risposte del server in modo che nessuno potrà in quache modo avere quell'informazione provando a fare una chimata al server
    isAdmin: { type: String, required: false },
    ruolo: { type: String, required: false, default: "Visitor" },
    categoria: { type: String, required: false},
    docPersonali: [{ type: Object, required: false }], // array di URL 
    ranking: { type: Number, required: false },//Da vedere come popolarlo e calcolarlo in base ai risultati ottenuti (opzionale)
    googleId: String
})

UserSchema.pre("save", async function (next) {
  // Se la password non è stata modificata, non la ricalcolare
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});


UserSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) throw new Error("Password non salvata per questo utente");
  console.log(candidatePassword)
  console.log(this.password)
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema);

export default User; 