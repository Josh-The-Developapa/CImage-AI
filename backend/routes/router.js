import express from 'express';
import multer from 'multer';
import { uploadFile } from '../controllers/controller.js';
const router = express.Router();
// const model =

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        // Specify the file name for the uploaded files
        cb(null, `${ file.originalname }`);
    },
    destination: function (req, file, cb) {
        // Specify the destination for the uploaded files
        cb(null, './public/uploads');
    },
})

const upload = multer({
    storage
})

router.post('/upload', upload.single('my-file'), uploadFile)

export default router;