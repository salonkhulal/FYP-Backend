import multer from "multer";
import path from "path";
import fs from "fs";

const filterImage = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;

  const extName = fileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = fileTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only PNG, JPG, and JPEG images are allowed"), false);
  }
};


const getFormattedDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const user = req.user;

    const filePathFolder = `./app/uploads/${user?.id}/userImage`;

    if (!fs.existsSync(filePathFolder)) {
      fs.mkdirSync(filePathFolder, { recursive: true });
    }
    const dest = path.resolve(filePathFolder);
    cb(null, dest);
  },

  filename: (req, file, cb) => {
    const date = getFormattedDate();
    const safeFileName = file.originalname.replace(/\s+/g, "-");

    cb(null, `${date}-${safeFileName}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, 
  },
  fileFilter: filterImage,
});

export default upload;
