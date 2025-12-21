import multer from "multer";
import { allowedTypes, maxFileSizeInBytes } from "../../../shared/models/INewFileRequest";




const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: maxFileSizeInBytes,
  },

  fileFilter: (req, file, cb) => {

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type"));
      return;
    }



    cb(null, true);

  }




});

export default upload;
