import asyncHandler from "express-async-handler";
import { getAllPartsFB, setPartFB } from "./firebase";
import { uploadPartFirebase, getPartDownloadURLFirebase } from "./firebase";
import { Blob } from "buffer";
import expressAsyncHandler from "express-async-handler";

export const getAllParts = asyncHandler(async (req, res) => {
    res.send(await getAllPartsFB());
});

export const editPart = asyncHandler(async (req, res) => {
    res.send(await setPartFB(req.body.hotPart));
});

export const uploadFile = asyncHandler(async (req, res) => {
    console.log(req.file);
    if (!req.file) return;
    
    let partFile = req.file || null;
    let fileId = req.body.fileId;
    let fileType = req.body.fileType;
    console.log("ooga booga");

    await uploadPartFirebase(partFile, fileId, fileType);
    console.log("booga");
    res.send("Upload");
});

export const getFileDownloadURL = asyncHandler(async (req, res) => {
    let fileId: any;
    fileId = req.query.fileId;
    let data = await getPartDownloadURLFirebase(fileId);

    const buf = Buffer.alloc(data.byteLength);
    const view = new Uint8Array(data);
    for (let i = 0; i < buf.length; ++i) {
        buf[i] = view[i];
    }

    res.writeHead(200, {
        "Content-Type": "application/pdf",
        "content-disposition": `attachment`,
        "Content-Length": buf.byteLength,
    });

    res.end(buf);
});
