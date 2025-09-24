import multer from 'multer';
import {fileTypeFromBuffer} from "file-type";

const storage = multer.memoryStorage();

const fileFilter = async (req, file, cb)=>{
    if(!file.mimetype.startsWith("image/")){
        return cb(new Error("Only image files are allowed. Caught from mimeType"))
    }

    if(file.buffer){
        const type = await fileTypeFromBuffer(file.buffer);
        if(!type){
            return cb(new Error("Only image files are allowed. Caught from fileTypeFromBuffer"))
        }
    }
    cb(null, true);
}
const upload = multer({
    storage:storage,
    fileFilter:fileFilter,
    limits:{ fileSize: 5* 1024 * 1024}
})

export default upload;