const services = require("./comunicationsServices")
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

const upload = multer({ storage: storage })

function begin(backendApp) {

    backendApp.post("/comunications", upload.single('media'), services.newComunication)
    backendApp.get("/comunications", services.getComunication)
    backendApp.put("/comunications", services.editComunication)
    backendApp.delete("/comunications", services.deleteComunication)

}


module.exports = { begin }