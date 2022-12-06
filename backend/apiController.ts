import asyncHandler from "express-async-handler";
import { getAllPartsFB, setPartFB } from "./firebase";
import { uploadPartFirebase, getPartDownloadURLFirebase } from "./firebase";
import { Request, Response } from "express";

interface MulterRequest extends Request {
    file: any;
}

export const getAllParts = asyncHandler(async (req, res) => {
    res.send(await getAllPartsFB());
});

export const editPart = asyncHandler(async (req, res) => {
    res.send(await setPartFB(req.body.hotPart));
});

export const uploadFile = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
        const file = (req as MulterRequest).file;

        let partFile = file || null;

        let fileId = req.body.fileId;
        let fileType = req.body.fileType;

        res.send(await uploadPartFirebase(partFile, fileId, fileType));
    }
);

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
