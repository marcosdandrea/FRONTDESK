const services = require("./comunicationsServices")
const { uploadFile, progress_middleware } = require("./comunicationsFileUploader")
const { schemaPost, schemaPatch, schemaConfig } = require("./comunicationsModels")
const validator = require('express-joi-validation').createValidator({})
const multer = require('multer')
const {showComunication} = require("../../../clientSocket")
const uploader = multer()

function begin(backendApp) {

    //comunications

    backendApp.post("/comunications",
        progress_middleware,
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

    //configuration

    backendApp.put("/comunications/config",
        uploader.none(),
        validator.body(schemaConfig),
        services.editConfigurations
    )

    backendApp.get("/comunications/config",
        uploader.none(),
        services.getConfigurations
    )

    //display comunications configuration

    backendApp.get("/comunications/show/:id", 
        (req, res, next)=>{
            const id = req.params.id
            showComunication(id)
            res.sendStatus(200);
        }
    )

}

module.exports = { begin }