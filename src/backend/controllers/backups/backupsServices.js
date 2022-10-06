const fs = require('fs')
const path = require('path')
const backupFolder = path.join(__dirname, "../../backups/")

async function getBackups(req, res, next) {
    let dir
    let filename
    let response = {}

    try {
        //comunications
        filename = "comunications"
        dir = path.join(backupFolder, filename)
        const comunications = await fs.promises.readdir(dir)
        comunications.forEach(entry => {
            const timeStamp = entry.split(".")[1]
            const dateParsed = String(new Date(parseInt(timeStamp)).toLocaleDateString("es-AR"))
            const timeParsed = String(new Date(parseInt(timeStamp)).toLocaleTimeString("es-AR"))
            if (!response[dateParsed]) response[dateParsed] = {}
            if (!response[dateParsed][timeParsed]) response[dateParsed][timeParsed] = []
            response[dateParsed][timeParsed].push({ file: entry })

        })

        //nomenclatorData
        dir = path.join(backupFolder, "nomenclatorData")
        const nomenclatorData = await fs.promises.readdir(dir)
        nomenclatorData.forEach(entry => {
            const timeStamp = entry.split(".")[1]
            const dateParsed = String(new Date(parseInt(timeStamp)).toLocaleDateString("es-AR"))
            const timeParsed = String(new Date(parseInt(timeStamp)).toLocaleTimeString("es-AR"))
            if (!response[dateParsed]) response[dateParsed] = {}
            if (!response[dateParsed][timeParsed]) response[dateParsed][timeParsed] = []
            response[dateParsed][timeParsed].push({ file: entry })
        })


        //calendar
        dir = path.join(backupFolder, "calendar")
        const calendar = await fs.promises.readdir(dir)
        calendar.forEach(entry => {
            const timeStamp = entry.split(".")[1]
            const dateParsed = String(new Date(parseInt(timeStamp)).toLocaleDateString("es-AR"))
            const timeParsed = String(new Date(parseInt(timeStamp)).toLocaleTimeString("es-AR"))
            if (!response[dateParsed]) response[dateParsed] = {}
            if (!response[dateParsed][timeParsed]) response[dateParsed][timeParsed] = []
            response[dateParsed][timeParsed].push({ file: entry })
        })

        res.send(response)
    } catch (err) {
        console.log(err)
        res.status(500).send(err.message)
    }
}

async function createBackup(req, res, next) {
    let origin
    let destinWithFile
    let fileName
    const timestamp = new Date().getTime()
    try {
        //comunications
        fileName = "comunications"
        fileExtension = ".json"
        origin = path.join(__dirname, "../../database", fileName + fileExtension)
        destinPath = path.join(__dirname, "../../backups/", fileName + "/")
        destinWithFile = path.join(destinPath + fileName + "." + timestamp + fileExtension)
        if (!fs.existsSync(destinPath)) {
            fs.mkdirSync(destinPath, { recursive: true });
        }
        await fs.promises.copyFile(origin, destinWithFile)

        //nomenclatorData
        fileName = "nomenclatorData"
        fileExtension = ".json"
        origin = path.join(__dirname, "../../../../public/data", fileName + fileExtension)
        destinPath = path.join(__dirname, "../../backups/", fileName + "/")
        destinWithFile = path.join(destinPath + fileName + "." + timestamp + fileExtension)
        if (!fs.existsSync(destinPath)) {
            fs.mkdirSync(destinPath, { recursive: true });
        }
        await fs.promises.copyFile(origin, destinWithFile)

        //calendar
        fileName = "calendar"
        fileExtension = ".json"
        origin = path.join(__dirname, "../../../../public/data", fileName + fileExtension)
        destinPath = path.join(__dirname, "../../backups/", fileName + "/")
        destinWithFile = path.join(destinPath + fileName + "." + timestamp + fileExtension)
        if (!fs.existsSync(destinPath)) {
            fs.mkdirSync(destinPath, { recursive: true });
        }
        await fs.promises.copyFile(origin, destinWithFile)

        res.send({ status: "Backups created succesfully" })
    } catch (err) {
        console.error(err)
        res.status(500).send(err.message)

    }
}

async function restoreBackup(req, res, next) {
    const timestamp = req.params.timestamp
    if (!timestamp) res.status(401).send("You must provide a timestamp identifier")

    let origin
    let fileName
    try {
        //comunications
        fileName = "comunications"
        fileExtension = ".json"
        destinPath = path.join(__dirname, "../../database", fileName + fileExtension)
        origin = path.join(__dirname, "../../backups/", fileName + "/" + fileName + "." + timestamp + "." + fileExtension)
        await fs.promises.copyFile(origin, destinPath)

        //nomenclatorData
        fileName = "nomenclatorData"
        fileExtension = ".json"
        destinPath = path.join(__dirname, "../../database", fileName + fileExtension)
        origin = path.join(__dirname, "../../backups/", fileName + "/" + fileName + "." + timestamp + "." + fileExtension)
        await fs.promises.copyFile(origin, destinPath)

        //calendar
        fileName = "calendar"
        fileExtension = ".json"
        destinPath = path.join(__dirname, "../../database", fileName + fileExtension)
        origin = path.join(__dirname, "../../backups/", fileName + "/" + fileName + "." + timestamp + "." + fileExtension)
        await fs.promises.copyFile(origin, destinPath)

        res.send({ status: `Backup with timestamp ${timestamp} restored successfully` })
    } catch (err) {
        res.status(500).send(err.message)
    }
}

async function deleteBackup(req, res, next) {
    const timestamp = req.params.timestamp
    if (!timestamp) res.status(401).send("You must provide a timestamp identifier")

    try {
        await fs.promises.rm(path.join(backupFolder, "calendar", "calendar." + timestamp + ".json"))
        await fs.promises.rm(path.join(backupFolder, "comunications", "comunications." + timestamp + ".json"))
        await fs.promises.rm(path.join(backupFolder, "nomenclatorData", "nomenclatorData." + timestamp + ".json"))
        res.send(`Backup timestamp ${timestamp} deleted successfully`)
    } catch (err) {
        res.status(500).send(err.message)
    }
}


module.exports = { getBackups, createBackup, restoreBackup, deleteBackup }