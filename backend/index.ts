import express, { json, urlencoded } from "express";
import {
    getAllParts,
    editPart,
    uploadFile,
    getFileDownloadURL,
} from "./apiController";
import multer from "multer";
import path from "path";
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
    storage: storage
});

//app.use("/", express.static(path.join(__dirname, "./build")));

app.use(json());
app.use(urlencoded({ extended: false }));

app.get("/getAllParts", getAllParts);
app.post("/editPart", editPart);
app.post("/uploadPart", upload.single("partUpload"), uploadFile);
app.get("/downloadPart", getFileDownloadURL);

app.listen(port, () => console.log(`Server started on ${port}!`));
