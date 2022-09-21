const fs = require('fs').promises
const logger = require("../../../logger")
const path = require('path')
const filename = "comunications.json"
const dataPath = path.join(__dirname, "../../database", filename)
const crypto = require('crypto')

async function getComunication() {
    try {
        const file = await readFilesAndParse(dataPath)
        return file.comunications
    } catch (err) {
        logger.error("getComunication - " + err)
    }
}

async function editComunication(data) {
    try {
        const file = await readFilesAndParse(dataPath)
        const index = file.comunications.findIndex( entry => entry.id === data.id)
        if (index == -1) return new Error ("Can't find a comunication with that id number")
        file.comunications[index] = {...data, media: file.comunications[index].media}
        await writeFile(dataPath, file)
        return ("Comunication " + data.id + " Updated")
    } catch (err) {
        logger.error("editComunication - " + err)
    }
}

async function newComunication(data) {
    try {
        data.id = crypto.randomUUID()
        const file = await readFilesAndParse(dataPath)
        file.comunications.push(data)
        await writeFile(dataPath, file)
        return data.id 
    } catch (err) {
        logger.error("newComunication - " + err)
    }
}

async function deleteComunication(id) {
    try {
        const file = await readFilesAndParse(dataPath)
        const index = file.comunications.findIndex( entry => entry.id === id)
        if (index == -1) return new Error ("Can't find a comunication with that id number")
        file.comunications.splice(index, 1)
        await writeFile(dataPath, file)
        return await readFilesAndParse(dataPath)
    } catch (err) {
        logger.error("deleteComunication - " + err)
    }
}

async function readFilesAndParse(dataPath) {
    try {
        const file = await fs.readFile(dataPath, "utf-8")
        const fileParsed = JSON.parse(file)
        return fileParsed
    } catch (err) {
        throw new Error(err)
    }
}

async function writeFile(dataPath, data) {
    try {
        await fs.writeFile(dataPath, JSON.stringify(data))
    } catch (err) {
        throw new Error(err)
    }
}

async function getConfigurations() {
    try {
        const file = await readFilesAndParse(dataPath)
        return file.config
    } catch (err) {
        logger.error("getConfigurations - " + err)
    }
}

async function editConfigurations(data) {
    try {
        const file = await readFilesAndParse(dataPath)
        const id = crypto.randomUUID()
        file.config = {...data, id}
        await writeFile(dataPath, file)
        return file.config
    } catch (err) {
        logger.error("editConfigurations - " + err)
    }
}

module.exports = { getComunication, editComunication, newComunication, deleteComunication, editConfigurations, getConfigurations }