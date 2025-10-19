import mongoose, { Schema } from "mongoose";

const EventSchema = new Schema({
    titolo: { type: String, required: true, trim: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    luogo: { type: String, required: true, trim: true },
    //docEvento:[{ type: String, required: true }], // array di URL
    partecipanti: [{ type: Schema.Types.ObjectId, ref: 'User' }] //referencing allo schema User
})

const Event = mongoose.model('Event', EventSchema);


export default Event; 