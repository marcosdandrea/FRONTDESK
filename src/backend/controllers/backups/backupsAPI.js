const services = require("./backupsServices.js")

function begin(backendApp) {

    backendApp.get("/backup",
        services.getBackups
    )

    backendApp.post("/backup",
        services.createBackup
    )

    backendApp.get("/backup:timestamp",
        services.restoreBackup
    )

    backendApp.delete("/backup:timestamp",
        services.deleteBackup
    )

}

module.exports = { begin }