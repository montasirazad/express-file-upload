const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

const UPLOAD_FOLDER = './uploads/'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_FOLDER)
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        const fileName = file.originalname
            .replace(fileExt, '')
            .toLowerCase()
            .split(' ')
            .join('-') + '-' + Date.now();

        cb(null, fileName + fileExt);

    }
})


var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000 // 1mb
    },
    fileFilter: (req, file, cb) => {

        if (file.fieldname === 'avatar') {
            if (
                file.mimetype === 'image/png' ||
                file.mimetype === 'image/jpg' ||
                file.mimetype === 'image/jpeg'
            ) {
                cb(null, true)
            }
            else {
                cb(new Error('Only .jpg .png or .jpeg is allowed'))
            }
        } else if (file.fieldname === 'doc') {

            if (file.mimetype === 'application/pdf') {
                cb(null, true)
            } else {
                cb(new Error('only .pdf format is allowed'))
            }
        }
        else {
            cb(new Error('there is an unknown error'))
        }


    }
})


app.post('/', upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'doc', maxCount: 1 }
]), (req, res) => {
    res.send('file upload tutorial')
});


app.use((err, req, res, next) => {
    if (err) {
        if (err instanceof multer.MulterError) {
            res.status(500).send('there is an upload error')
        } else {
            res.status(500).send(err.message)
        }
    } else {
        res.send('success')
    }
})


app.listen(3000, () => {
    console.log('listening to port 3000');
})