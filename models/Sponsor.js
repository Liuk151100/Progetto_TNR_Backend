import mongoose, { Schema } from "mongoose";

//Gli sponsor li potrà inserire solo l'admin e deciderà lui la prorità da dargli tramite un semplice form 

const SponsorSchema = new Schema({
    nomeSocieta: { type: String, required: true, trim: true },
    prioVis: { type: Number, required: false, unique: true, min: 1 }, //questo dato mi serve per paginare gli sponsor
    // e dare visibilità a quelli con il numero più basso (1=più prioritario di tutti)
    logo: { type: String, required: true }
})

const Sponsor = mongoose.model('Sponsor', SponsorSchema);

export default Sponsor;