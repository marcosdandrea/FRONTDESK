const DAO = require("./comunicationsDAO")
const fs = require("fs").promises
const path = require("path")

async function getComunication(req, res, next) {
    try {
        const comunications = await DAO.getComunication()
        const checkedComunications = []
        for (const entry in comunications) {
            const file = path.join(__dirname, "../../../../public/media/comunications", comunications[entry].media.filename)
            const answ = await checkIfFileExists(file)
            if (answ) checkedComunications.push(comunications[entry])
        }

        res.status(200).send(await JSON.stringify(checkedComunications))
    } catch (err) {
        res.status(500)
    }
}

async function editComunication(req, res, next) {
    try {
        const data = req.body
        res.status(200).send(await DAO.editComunication(data))
    } catch (err) {
        res.status(304)
    }
}

async function newComunication(req, res, next) {
    try {
        const title = req.body.title
        const paragraph = req.body.paragraph
        const media = { filename: req.file.filename, originalName: req.file.originalname }
        const show_new_badge_until = req.body.show_new_badge_until
        const data = { title, paragraph, media, show_new_badge_until }
        if (!title || !paragraph || !media || !show_new_badge_until) {
            res.status(400).send("You must send full information in body")
            return
        }
       // await deleteHorphanMedia(comunications)
        res.status(200).send(await DAO.newComunication(data))
    } catch (err) {
        res.status(304)
    }
}

async function deleteComunication(req, res, next) {
    try {
        const id = req.body.id
        res.status(200).send(await DAO.deleteComunication(id))
    } catch (err) {
        res.status(304)
    }
}

async function editConfigurations(req, res, next) {
    try {
        const data = req.body
        res.status(200).send(await DAO.editConfigurations(data))
    } catch (err) {
        res.status(304)
    }
}


async function getConfigurations(req, res, next) {
    try {
        res.status(200).send(await DAO.getConfigurations())
    } catch (err) {
        res.status(304)
    }
}

async function checkIfFileExists(file) {
    try {
        await fs.stat(file)
        return true
    } catch (err) {
        return false
    }
}

async function deleteHorphanMedia(comunications) {
    try {
        const files = await fs.readdir(path.join(__dirname, "../../../../public/media/comunications"))

        for (const file in files) {
            const fileDir = path.join(__dirname, "../../../../public/media/comunications", files[file])
            const founded = comunications.find(entry => entry.media.filename == files[file])
            if (founded) return
            await fs.rm(fileDir)
            console.log("File " + files[file] + " deleted because was unused")
        }
    } catch (err) {
        throw new Error(err)
    }
}

module.exports = { getComunication, editComunication, newComunication, deleteComunication, editConfigurations, getConfigurations }