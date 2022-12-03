import express, { json, urlencoded } from "express";
import cors from "cors";
import { getAllParts, editPart } from "./apiController";

const app = express();
const port = process.env.PORT || 5000;

app.use(
    cors({
        origin: "*",
    })
);

app.use(json());
app.use(urlencoded({ extended: false }));

app.get("/getAllParts", getAllParts);
app.put("/editPart", editPart);

app.listen(port, () => console.log(`Server started on ${port}!`));
