import express, { json, urlencoded } from "express";
import cors from "cors";
import { getAllParts, editPart, uploadFile, getFileDownloadURL} from "./apiController";
import multer from "multer";

const app = express();
const port = process.env.PORT || 5000;

app.use(
    cors({
        origin: "*",
    })
);

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { files: 1, fileSize: 10 * 1024 * 1024 } 
});


app.use(json());
app.use(urlencoded({ extended: false }));

app.get("/getAllParts", getAllParts);
app.post("/editPart", editPart);
app.post("/uploadPart", upload.single("partUpload"), uploadFile);
app.get("/downloadPart", getFileDownloadURL);

app.listen(port, () => console.log(`Server started on ${port}!`));
