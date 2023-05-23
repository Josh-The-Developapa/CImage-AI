import { readdirSync, unlinkSync, readFileSync, renameSync } from 'fs';
import ErrorResponse from "../Utils/errorResponse.js";
import mobileNet from "@tensorflow-models/mobilenet";
import tf from '@tensorflow/tfjs-node';
import path from 'path';
const model = await mobileNet.load();

async function imageClassification(img) {
    const image = tf.node.decodeImage(readFileSync(`./public/uploads/${ img }`, data => data));

    //classify image and store predictions values
    const predictions = model.classify(image);
    return predictions;
}


export async function uploadFile(req, res, next) {
    let predictions;
    const file = req.file;
    //If file is not present in request, prompt user to upload the file
    if (!file) {
        return next(new ErrorResponse('Please upload a file', 400));
    }
    //If file is not an image, prompt user to upload an image (jpeg, jpg, png or gif)
    if (!file.mimetype.startsWith('image/')) {
        return next(new ErrorResponse('Please upload an image', 400));
    }

    //Read directory 'uploads'. 
    //When user tries to upload a file, delete the current Input Image file and replace with image submitted in the request
    const files = readdirSync('./public/uploads', (err, fileArr) => fileArr);

    //If directory is empty, then multer will just upload file.

    //If it contains a file:
    //1. Multer first uploads image in request to 'uploads' directory
    //2. Check the files in 'uploads' directory:
    if (files.length > 1) {
        // If file at index 0 is not the one sent in request, delete it from 'uploads' directory
        if (files[0] !== file.filename) {
            unlinkSync(`./public/uploads/${ files[0] }`, (err, data) => {
                if (err) {
                    console.log(err);
                }
            });
        }
        // If file at index 1 is not the one sent in request, delete it from 'uploads' directory
        if (files[1] !== file.filename) {
            unlinkSync(`./public/uploads/${ files[1] }`, (err, data) => {
                if (err) {
                    console.log(err);
                }
            });
        }
    }

    //Rename stored image to 'InputFile' while maintaining file extension for easy access for ML model
    const filesUpdated1 = readdirSync('./public/uploads', (err, files) => files);

    renameSync(`./public/uploads/${ filesUpdated1[0] }`, `./public/uploads/InputFile${ path.extname(filesUpdated1[0]) }`, (err) => console.log(err));

    const filesUpdated2 = readdirSync('./public/uploads', (err, files) => files);
    // console.log(filesUpdated2);
    predictions = await imageClassification(filesUpdated2[0]);

    res.status(200).json({
        success: true,
        prediction: predictions,
        message: 'Image received'
    });
}