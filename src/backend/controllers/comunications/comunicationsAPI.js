const services = require("./comunicationsServices")
const { uploadFile } = require("./comunicationsFileUploader")
const { schemaPostMedia, schemaPost, schemaPostIcon, schemaPatch, schemaConfig } = require("./comunicationsModels")
const validator = require('express-joi-validation').createValidator({})
const multer = require('multer')
const uploader = multer()

function begin(backendApp) {

    backendApp.post("/comunications/withMedia",
        uploadFile,
        validator.body(schemaPostMedia),
        services.newComunication
    )

    backendApp.post("/comunications/withIcon",
        uploader.none(),
        validator.body(schemaPostIcon),
        services.newComunication
    )

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

    backendApp.put("/comunications/config",
        uploader.none(),
        validator.body(schemaConfig),
        services.editConfigurations
    )

    backendApp.get("/comunications/config",
        uploader.none(),
        services.getConfigurations
    )

}

module.exports = { begin }