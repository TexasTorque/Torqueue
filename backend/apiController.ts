import asyncHandler from "express-async-handler";
import {
    getAllPartsFB,
    setPartFB,
    uploadPartFirebase,
    getPartDownloadURLFirebase,
    deletePartFB,
} from "./firebase";
import { Request, Response } from "express";

interface MulterRequest extends Request {
    file: any;
}

export const getAllParts = asyncHandler(async (req, res) => {
    console.log("Get Requested Recieved");
    res.send(await getAllPartsFB());
});

export const editPart = asyncHandler(async (req, res) => {
    res.send(await setPartFB(req.body.hotPart));
});

export const uploadFile = asyncHandler(async (req: Request, res: Response) => {
    const file = (req as MulterRequest).file;

    let partFile = file || null;

    let fileId = req.body.fileId;
    let fileType = req.body.fileType;

    res.send(await uploadPartFirebase(partFile, fileId, fileType));
});

export const deleteFile = asyncHandler(async (req: Request, res: Response) => {
    let cadDelete = "success",
        camDelete = "success";

    if (req.body.hotPart.files.cadExt !== "")
        cadDelete = await deletePartFB(req.body.hotPart.id, "cad");

    if (req.body.hotPart.files.camExt !== "")
        camDelete = await deletePartFB(req.body.hotPart.id, "cam");

    res.send(
        cadDelete === "success" && camDelete === "success" ? "success" : "error"
    );
});

export const getFileDownloadURL = asyncHandler(async (req, res) => {
    let fileId = req.query.fileId;
    let fileExt = req.query.fileExt;

    let data = await getPartDownloadURLFirebase(fileId, fileExt);

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
