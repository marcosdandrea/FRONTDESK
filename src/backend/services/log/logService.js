require("dotenv").config
const logServiceDAO = require("./logServiceDAO")

async function newSession(username) {
    try {
        const expiring = new Date().getTime() + parseInt(process.env.SESSION_DURATION);
        currentUser = { username: username, sesionExpires: expiring };
        const timecode = new Date().getHours().toString().padStart(2, 0) + ":" + new Date().getMinutes().toString().padStart(2, 0)
        const LOG = timecode + " - [LOG] El usuario ha iniciado sesión"
        const newLog = {
            "username": username,
            "dateTime": new Date(),
            "changes": [
                LOG
            ]
        }

        await logServiceDAO.writeNewLog(newLog)

    } catch (err) {
        console.error(err)
    }
}

async function newEntry(newLog) {
    try{
        await logServiceDAO.writeNewLog(newLog)
    }catch(err){
        console.error (err)
    }
}

module.exports = { newEntry, newSession };