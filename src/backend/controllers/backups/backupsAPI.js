const services = require("./backupsServices.js")

function begin(backendApp) {

    backendApp.get("/backup",
        services.getBackups
    )

    backendApp.post("/backup",
        services.createBackup
    )

    backendApp.get("/backup:id",
        services.restoreBackup
    )

}

module.exports = { begin }