const services = require("./comunicationsServices")

function begin (backendApp){

    backendApp.post("/comunications", services.newComunication)
    backendApp.get("/comunications", services.getComunication)
    backendApp.put("/comunications", services.editComunication)
    backendApp.delete("/comunications", services.deleteComunication)

}


module.exports = {begin}