const multer = require('multer')
const crypto = require('crypto')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/media/comunications')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = crypto.randomUUID()
        const filename = file.originalname.split('.')
        const extension = filename.pop()
        filename.join(".")
        cb(null, filename + '.' + uniqueSuffix + "." + extension)
    }
})

module.exports = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "video/mp4") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .mp4 format allowed!'));
        }
    }
})