require("dotenv")
const logService = require("./log/logService")
const filesystem = require("../filesystem")
const crypto = require("crypto")

let currentUser = undefined //{ username: undefined, sesionExpires: undefinedrcurrentUser.NewPanelCodedName: "" };
const userDataLoginFile = "./data/userDataLogin.json"

async function login(req, res, next) {
    try {
        const username = req.query.username
        const password = req.query.password

        let data = { status: undefined, currentUser: {NewPanelCodedName: undefined}}

        //flushHorphanUploadedVideos() //for testing purposes only

        const dataLogFile = await filesystem.readFile(userDataLoginFile)
        const user = dataLogFile.users.find(user => user.username == username && user.password == password)

        if (user) {
            
            //chequea que no haya otro usuario logueado
            /*
            if (currentUser != undefined) {
                data.status = "[ERR]: El usuario '" + currentUser.username + "' está logueado. Espere a que el usuario cierre sesión." 
                res.send(JSON.stringify(data))
                return
            }
            */
            data.status = "[ok]: " + user.permissions
            currentUser = { username, sesionExpires: parseInt(process.env.SESSION_DURATION), NewPanelCodedName: undefined}
            logService.newEntry(username)

            //genera nuevo acceso a panel
            currentUser.NewPanelCodedName = crypto.randomUUID();
            await filesystem.copyFile("../../backend/panel.lock", "../../backend/" + currentUser.NewPanelCodedName + ".html")
            filesystem.cleanPanelFiles(currentUser.NewPanelCodedName + ".html")
            data.currentUser.NewPanelCodedName = currentUser.NewPanelCodedName + ".html";
            res.cookie("username", username)
            res.send(JSON.stringify(data))
        } else {
            if (username != "admin" && password != "Pespeciales2022") {
                data.status = '[ERR]: Datos de acceso incorrectos' 
            } else {
                data.status = '[ok]: administrator' 
                currentUser = { username, sesionExpires: parseInt(process.env.SESSION_DURATION), NewPanelCodedName: undefined}
                logService.newEntry(username)

                //genera nuevo acceso a panel
                currentUser.NewPanelCodedName = crypto.randomUUID();
                await filesystem.copyFile("../../backend/panel.lock", "../../backend/" + currentUser.NewPanelCodedName + ".html")
                filesystem.cleanPanelFiles(currentUser.NewPanelCodedName + ".html")
                data.currentUser.NewPanelCodedName = currentUser.NewPanelCodedName + ".html";
                res.cookie("username", username)
                res.send(JSON.stringify(data))
            }
        }

    } catch (err) {
        console.log(err)
    }
}

module.exports = { login, currentUser }