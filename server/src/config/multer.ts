import multer from "multer";
import path from "path";
import crypto from "crypto";

export default {
  fileFilter: (
    req: any,
    file: { mimetype: any },
    callback: (arg0: null, arg1: boolean) => void
  ) => {
    var type = file.mimetype;
    var typeArray = type.split("/");
    if (typeArray[0] == "image") {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, "..", "uploads"),
    filename: (req, file, callback) => {
      const hash = crypto.randomBytes(6).toString("hex");

      const fileName = `${hash}-${file.originalname}`;

      callback(null, fileName);
    },
  }),
};
