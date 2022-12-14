const fs = require('fs').promises
const logger = require("../../../logger")
const path = require('path')
const filename = "comunications.json"
const dataPath = path.join(__dirname, "../../database", filename)
const crypto = require('crypto')

async function getComunication() {
    try {
        const file = await readFilesAndParse(dataPath)
        return file
    } catch (err) {
        logger.error("getComunication - " + err)
    }
}

async function editComunication(data) {
    try {
        await writeFile(dataPath, data)
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
        if (index == -1) throw new Error ("Can't find a comunication with that id number")
        console.log (id, index)
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

module.exports = { getComunication, editComunication, newComunication, deleteComunication }