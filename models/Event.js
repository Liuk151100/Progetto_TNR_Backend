import mongoose, { Schema } from "mongoose";

const EventSchema = new Schema({
    titolo:{ type: String, required: true, trim: true },
    data:{ type: String, required: true, trim: true },
    luogo:{ type: String, required: true, trim: true },
    //docEvento:[{ type: String, required: true }], // array di URL
    partecipanti: [{type: Schema.Types.ObjectId, ref: 'User' }] //referencing allo schema User
})

const Event = mongoose.model('Event', EventSchema);


export default Event; 