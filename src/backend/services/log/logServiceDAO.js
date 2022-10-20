const fs = require('fs').promises

const activityLogFile = __dirname + '../../../data/activityLog.json'

async function writeNewLog(data) {
    try {
        const file = await fs.readFile(activityLogFile, "utf-8")
        const parsedFile = JSON.parse(file)
        parsedFile.push(data)
        await fs.writeFile(activityLogFile, JSON.stringify(parsedFile))
    } catch (err) {
        console.log (err)
    }
}


module.exports = { writeNewLog }