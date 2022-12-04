import asyncHandler from "express-async-handler";
import { getAllPartsFB, setPartFB } from "./firebase";
import { uploadFileFirebase, getFileDownloadURLFirebase } from "./firebase";

export const getAllParts = asyncHandler(async (req, res) => {
    res.send(await getAllPartsFB());
});

export const editPart = asyncHandler(async (req, res) => {
    res.send(await setPartFB(req.body.hotPart));
});

export const uploadFile = asyncHandler(async (req, res) => {
    if (!req.file) return;
    let partFile = req.file || null;
    let fileId = req.body.fileId;
    uploadFileFirebase(partFile, fileId)
    res.send("Upload")
});

export const getFileDownloadURL = asyncHandler(async (req, res) => {
    getFileDownloadURLFirebase(req.body.fileId).then((url) => {
        res.send(url);
    });
});
