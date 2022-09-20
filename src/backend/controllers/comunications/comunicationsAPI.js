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
        services.getComunication
        )

    backendApp.put("/comunications", 
        services.editComunication
        )

    backendApp.delete("/comunications", 
        services.deleteComunication
        )

}

module.exports = { begin }