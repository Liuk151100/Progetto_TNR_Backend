import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v4 as uuidv4 } from "uuid"; // genera UUID univoci


// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage per avatar users
const avatarUsersStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "TeamNewRacing/users",
    format: "png",
    public_id: () => uuidv4(), 
  },
});

// Storage per loghi Sponsor 
const logoSponsorStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "TeamNewRacing/sponsors",
    format: "jpg",
    public_id: (req, file) => {
      const ext = file.originalname.split(".").pop();
      return `${uuidv4()}.${ext}`; // nome unico
    },
  },
});

// Middleware multer
export const uploadUserAvatar = multer({ storage: avatarUsersStorage });
export const uploadSponsorLogo = multer({ storage: logoSponsorStorage });