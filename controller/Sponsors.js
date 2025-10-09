import mongoose from "mongoose";
import User from "../models/User.js"
import Sponsor from "../models/Sponsor.js";




export async function getAll(request, response) {
    try {
        const sponsors = await Sponsor.find()
        response.status(200).json(sponsors)
    } catch (error) {
        response.status(500).json({ message: "Errore nel recupero degli sponsor", error })
    }
}

export async function getSingleSponsor(request, response) {
    try {
        const { id } = request.params;
        const sponsor = await Sponsor.findById(id);
        if (!sponsor)
            return response.status(404).json({ message: "Sponsor non trovato" });
        response.status(200).json(sponsor);
    } catch (error) {
        response
            .status(500)
            .json({ message: "errore nel recupero del singolo sponsor", error });
    }
}

export async function createSponsor(request, response) {
    try {
        const { nomeSocieta, prioVis, logo} = request.body;

        if (!nomeSocieta || !logo) {
            return response.status(400).json({ message: "I campi nome società e il logo sono obbligatori" })
        }
        // Controllo se esiste già uno sponsor con lo stesso nome società
        const existingSponsor = await Sponsor.findOne({ nomeSocieta });

        if (existingSponsor) {
            return response.status(400).json({ message: "Sponsor già registrato" });
        }

        const newSponsor = new Sponsor({nomeSocieta, prioVis, logo})
        const sponsorSaved = await newSponsor.save()
        response.status(201).json(sponsorSaved)

    } catch (error) {
        response
            .status(500)
            .json({ message: "errore nella creazione del singolo sponsor", error });
    }

}

export async function modifySponsor(request, response) {
    try {
        const { id } = request.params
        const { nomeSocieta, prioVis, logo} = request.body;

        if (!nomeSocieta || !logo) {
            return response.status(400).json({ message: "I campi nome società e il logo sono obbligatori" })
        }

        const updatedSponsor = await Sponsor.findByIdAndUpdate(
            id,
            { nomeSocieta, prioVis, logo},
            { new: true }
        );
        if (!updatedSponsor) {
            return response.status(400).json({ message: "Sponsor non trovato", error });
        }

        response.status(200).json(updatedSponsor);
    } catch (error) {
        response
            .status(500)
            .json({ message: "errore nella modifica dello sponsor", error });
    }

}


export async function deleteSponsor(request, response) {
    try {
        const { id } = request.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({ message: "Id non valido" })
        }
        const deletedSponsor = await Sponsor.findByIdAndDelete(id)
        if (!deletedSponsor) {
            response.status(404).json({ message: "Sponsor non trovato" })

        }
        response.status(200).json("Sponsor eliminato")
    } catch (error) {
        response.status(500).json({ message: "Errore nella cancellazione del singolo sponsor", error })
    }
}