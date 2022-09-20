const services = require("./comunicationsServices")
const uploader = require("./comunicationsFileUploader")
const { schema } = require("./comunicationsValidations")
const validator = require('express-joi-validation').createValidator({})

function begin(backendApp) {

    backendApp.post("/comunications",         
        uploader.single('media'),
        validator.body(schema),    
        services.newComunication
        )

    backendApp.get("/comunications",
        uploader.none(), 
        services.getComunication
        )

    backendApp.put("/comunications", 
        uploader.none(),
        services.editComunication
        )

    backendApp.delete("/comunications", 
        uploader.none(),
        services.deleteComunication
        )

}

module.exports = { begin }