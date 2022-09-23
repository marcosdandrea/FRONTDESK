const fs = require('fs').promises
const Path = require('path')
const dir = Path.join(__dirname, '../../../../', "backend", "assets", "icons", "comunications")
const videoNotAvailable = path.join(__dirname, '../../../../', "backend", "assets", "icons", "comunications", "videoNotAvailable.png")

async function getAllIcons() {
    try {
        const icons = await fs.readdir(dir)
        const findInd = icons.findIndex(entry => entry == videoNotAvailable)
        if (findInd != -1) icons.splice(findInd, 1)
        return icons.map(icon => {
            return icon = Path.join("assets", "icons", "comunications", icon)
        })
    } catch (err) {
        throw new Error(err)
    }
}

module.exports = { getAllIcons }