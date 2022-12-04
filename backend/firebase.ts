import { initializeApp } from "firebase/app";
import { getStorage, ref as storageRef, uploadBytes } from "firebase/storage";
import { getDatabase, ref, get, set, child } from "firebase/database";
import { Part, File } from "./Interfaces";
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
const partsStorageRef = storageRef(storage, "parts_files");

const db = getDatabase();
const dbRef = ref(getDatabase());

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

    if (error) return errorMessage;
    else return parts;
};

export const setPartFB = async (part: Part) => {
    let error = false,
        errorMessage = "";

    await set(ref(db, `/active/${part.id}`), part).catch((e) => {
        console.log(e);
        error = true;
        errorMessage = e;
    });

    if (error) return errorMessage;
    else return "success";
};

const uploadFileFB = async (file: File) => {
    uploadBytes(partsStorageRef, new Uint8Array([123])).then((snapshot) => {
        console.log("Uploaded!");
    });
};
