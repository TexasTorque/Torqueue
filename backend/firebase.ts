import { initializeApp } from "firebase/app"
import { getStorage, ref , uploadBytes} from "firebase/storage"


const firebaseConfig = {
    storageBucket: "gs://torqueue-8e871.appspot.com"
}

// initialize Firebase
const app  = initializeApp(firebaseConfig)

const storage = getStorage(app)
const partsRef = ref(storage, 'parts_files')
// const folderRef = ref(storage, 'folder/folder')
// go up the tree:
// parentRef = storageRef.parent
// rootRef = storageRef.root
console.log("bruh!")
uploadBytes(partsRef, new Uint8Array([123])).then((snapshot) => {
    console.log("Uploaded!")
}).catch(e => console.log(e))




