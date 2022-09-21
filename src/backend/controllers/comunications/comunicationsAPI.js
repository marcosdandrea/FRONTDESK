const services = require("./comunicationsServices")
const { uploadFile } = require("./comunicationsFileUploader")
const { schemaPost, schemaPatch, fileFieldExist } = require("./comunicationsModels")
const validator = require('express-joi-validation').createValidator({})
const multer = require('multer')
const uploader = multer()

function begin(backendApp) {

    backendApp.post("/comunications",
        uploadFile,
        validator.body(schemaPost),
        services.newComunication
    )

    backendApp.get("/comunications",
        uploader.none(),
        services.getComunication
    )

    backendApp.patch("/comunications",
        uploader.none(),
        validator.body(schemaPatch),
        services.editComunication
    )

    backendApp.delete("/comunications",
        uploader.none(),
        services.deleteComunication
    )

}

module.exports = { begin }