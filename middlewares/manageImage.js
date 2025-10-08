import { uploadUserAvatar } from "./uploadCloudinary.js";

export async function manageAvatar (request, response, next){
    const {avatar} = request.body;
    if (avatar === "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png" || !avatar){
        next()
    } else {
        uploadUserAvatar.single("avatar")
        next()
    }
}