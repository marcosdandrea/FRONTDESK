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

async function deleteHorphanMedia(comunications) {
    let deleteCount = 0
    return new Promise(async (resolve, reject) => {
        try {
            const files = await fs.readdir(path.join(__dirname, "../../../../public/media/comunications"))
            const videoNotAvailable = path.join(__dirname, "../../../../public/media/comunications", "videoNotAvailable.png")

            for (const file in files) {
                const fileDir = path.join(__dirname, "../../../../public/media/comunications", files[file])
                const founded = comunications.find(entry => {
                    return (entry.media.filename == files[file] || files[file] == videoNotAvailable)
                })
                if (founded) continue;
                await fs.rm(fileDir)
                deleteCount++
                console.log("File " + files[file] + " deleted because was unused")
            }
            console.info(deleteCount, "hast been deleted due horphanity")
            resolve()
        } catch (err) {
            console.log(err)
            reject(err.message)
        }
    })
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

        const answ = await DAO.newComunication(data)
        await deleteHorphanMedia(await DAO.getComunication())

        res.status(200).send(answ)
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


module.exports = { getComunication, editComunication, newComunication, deleteComunication, editConfigurations, getConfigurations }