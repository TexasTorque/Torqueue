import express, { json, urlencoded } from "express";
import {
  getAllParts,
  editPart,
  uploadFile,
  getFileDownloadURL,
  deleteFile,
} from "./apiController";
import multer from "multer";
import cors from "cors";

const app = express();
const port = process.env.PORT || 5738;

app.use(
  cors({
    origin: "*",
  })
);


const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 50 * 1024 * 1024,
    fileSize: 50 * 1024 * 1024,
  },
});

app.use(json());
app.use(urlencoded({ extended: false }));

app.get("/getAllParts", getAllParts);
app.post("/editPart", editPart);
app.post("/uploadPart", upload.single("partUpload"), uploadFile);
app.get("/downloadPart", getFileDownloadURL);
app.post("/deletePart", deleteFile);

// app.listen((process.env.PORT || 5738, '0.0.0.0');
app.listen(5738, '0.0.0.0');

