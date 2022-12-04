import asyncHandler from "express-async-handler";
import { getAllPartsFB, setPartFB } from "./firebase";
import { uploadPartFirebase, getPartDownloadURLFirebase } from "./firebase";
import { Blob } from 'buffer';
import expressAsyncHandler from "express-async-handler";

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
    let fileType = req.body.fileType;
    uploadPartFirebase(partFile, fileId, fileType)
    res.send("Upload")
});

export const getFileDownloadURL = asyncHandler(async (req, res) => {
    // supply req.body.fileId, req.body.fileExt, req.body.name

    let data = await getPartDownloadURLFirebase(req.body.fileId)
    // let data = await getPartDownloadURLFirebase("bvbsadfgsdfg")

    const buf = Buffer.alloc(data.byteLength);
    const view = new Uint8Array(data);
    for (let i = 0; i < buf.length; ++i) {
        buf[i] = view[i];
    }

    res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-disposition': `attachment;filename=${req.body.name}.${req.body.fileExt}`,
        'Content-Length': buf.byteLength
    });
    res.end(buf);    

});
