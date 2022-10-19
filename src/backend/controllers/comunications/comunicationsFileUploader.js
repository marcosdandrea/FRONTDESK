
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
        const filename = cleanFileName(file.originalname).split('.')
        const extension = filename.pop()
        filename.join(".")
        cb(null, uniqueSuffix + "." + extension)
    }
})

function cleanFileName(s) {
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, "")

}

function checkFormat(req, file, cb) {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString(
        'utf8',
    );
    if (file.mimetype == "image/png" || file.mimetype == "video/mp4") {
        cb(null, true);
    } else {
        cb(null, false);
        return cb(new Error('Only .png, .mp4 format allowed!'));
    }
}

const upload = multer({
    storage,
    fileFilter:
        checkFormat,
}).single('media');

function uploadFile(req, res, next) {

    upload(req, res, function (err) {
        //if req.file is undefined there's no file to upload
        let media = {}
        if (req.file != undefined) {
            res.multerUploadCompleted = true
            console.log ("Media mode: File upload")
            media = { media: { filename: req.file.filename, originalName: req.file.originalname } }
        } else {
            if (req.body.media) {
                res.multerUploadCompleted = false
                console.log ("Media mode: Icon")
                const mediaParsed = JSON.parse(req.body.media)
                console.log(mediaParsed)

                media = { media: { filename: mediaParsed.filename, originalName: mediaParsed.originalName } }
            }else{
                res.status(400).send("You must send full information in body")
                return
            }
        }
        delete req.body.icon
        Object.assign(req.body, media)
        next()
    })
}

function progress_middleware(req, res, next){
    let progress = 0;
    const file_size = req.headers["content-length"];
    req.uploadCompleted = false;
    // set event listener
    req.on("data", (chunk) => {
        progress += chunk.length;
        const percentage = (progress / file_size) * 100;
        //console.log("upload progress: " + percentage)
        if (percentage == 100){
            req.uploadCompleted = true;
            console.log("Upload Completed")
        }
        // other code ...
    });

    // invoke next middleware
    next();
}

module.exports = { uploadFile, progress_middleware}
