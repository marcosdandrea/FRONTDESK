const multer = require('multer')
const crypto = require('crypto')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const path = `public/media/comunications`
        fs.mkdirSync(path, { recursive: true })
        return cb(null, path)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = crypto.randomUUID()
        const filename = file.originalname.split('.')
        const extension = filename.pop()
        filename.join(".")
        cb(null, filename + '.' + uniqueSuffix + "." + extension)
    }
})


function checkFormat(req, file, cb) {
    if (file.mimetype == "image/png" || file.mimetype == "video/mp4") {
        cb(null, true);
    } else {
        cb(null, false);
        return cb(new Error('Only .png, .mp4 format allowed!'));
    }
}

function uploadFile(req, res, next) {

    const upload = multer({
        storage: storage,
        fileFilter:
            checkFormat,

    }).single('media');

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            res.status(403).send(err.message)
        } else if (err) {
            // An unknown error occurred when uploading.
            res.status(403).send(err.message)
        }
        // Everything went fine. 
        next()
    })
}

module.exports = { uploadFile }
