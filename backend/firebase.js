import { initializeApp } from "firebase/app";
import {
    getBytes,
    getStorage,
    ref as sref,
    uploadBytes,
    deleteObject,
} from "firebase/storage";
import { getDatabase, ref as dref, get, set, child } from "firebase/database";
// import { Part } from "./Interfaces";
import dotenv from "dotenv";
dotenv.config();

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

const db = getDatabase();
const dbRef = dref(getDatabase());

export const getAllPartsFB = async () => {
    let parts = [""];
    let error = false,
        errorMessage = "";

    await get(child(dbRef, `/`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                parts.push(snapshot.val());
            }
        })
        .catch((error) => {
            error = true;
            errorMessage = error;
        });

    console.log(error ? errorMessage : parts);
    if (error) return errorMessage;
    else return parts;
};

export const setPartFB = async (part) => {
    let errorMessage = "";
    let data = part.dev.delete ? null : part;

    await set(dref(db, `/${part.id}`), data).catch((e) => {
        console.log(e);
        errorMessage = e;
    });

    if (errorMessage !== "") return errorMessage;
    else return "success";
};

export const uploadPartFirebase = async (
    partFile,
    fileId,
    fileType
) => {
    let targetRef;
    let errorMessage = "";

    if (fileType === "cam") targetRef = sref(storage, `cam_files/${fileId}`);
    else targetRef = sref(storage, `parts_files/${fileId}`);
    await uploadBytes(targetRef, partFile.buffer).catch((e) => {
        errorMessage = e;
    });
    if (errorMessage !== "") return errorMessage;
    return "success";
};

export const deletePartFB = async (fileId, fileType) => {
    let targetRef;
    let errorMessage = "";

    if (fileType === "cam") targetRef = sref(storage, `cam_files/${fileId}`);
    else targetRef = sref(storage, `parts_files/${fileId}`);
    await deleteObject(targetRef).catch((e) => (errorMessage = e));
    if (errorMessage !== "") return errorMessage;
    return "success";
};

export const getPartDownloadURLFirebase = async (fileId, fileExt) => {
    let targetRef;
    if (fileExt === "cam") targetRef = sref(storage, `cam_files/${fileId}`);
    else targetRef = sref(storage, `parts_files/${fileId}`);
    return await getBytes(targetRef);
};
