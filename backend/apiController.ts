import asyncHandler from "express-async-handler";
import { getAllPartsFB, setPartFB } from "./firebase";

export const getAllParts = asyncHandler(async (req, res) => {
    res.send(await getAllPartsFB());
});

export const editPart = asyncHandler(async (req, res) => {
    res.send(await setPartFB(req.body.hotPart));
});

export const uploadFile = asyncHandler(async (req, res) => {
    res.send("upload file");
});
