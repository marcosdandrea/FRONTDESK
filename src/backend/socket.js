const fileSystem = require('./fileSystem')
const frontendSocket = require('../socket')
const powerOffLG = require('../powerOffLG')
const WOL = require('../wakeOnLan')
const logger = require('../logger')
let globalSocket

module.exports = {

    initSocket: function (server) {
        const io = require('socket.io')(server);
        var ss = require('socket.io-stream');
        const path = require('path');

        io.on("connect", (socket) => {
            logger.info("Connected to Client Backend Panel")
            globalSocket = socket
            fileSystem.cleanPanelFiles()

            socket.on("disconnect", (user) => {
                logger.info (" El cliente se desconectó del Panel Backend")
                const backendManager = require('./backendManager')
                backendManager.closeUserSession(user)
            })

            socket.on("getCalendarData", () => {
                sendCalendarData(socket)
            })

            socket.on("getNomenclatorData", () => {
                const nomenclatorDB = '../../public/data/nomenclatorData.json'
                fileSystem.readFile(nomenclatorDB).then(data => {
                    socket.emit("nomenclatorData", data)
                })
            })

            socket.on("getUserData", () => {
                const backendManager = require('./backendManager')
                backendManager.sendUserData(socket)
            })

            socket.on("setNomenclatorData", (data) => {
                logger.info("received new nomenclator data")
                fileSystem.writeFile("../../public/data/nomenclatorData.json", data)
                    .then(() => frontendSocket.refreshFrontend())
            })

            socket.on("setCalendarData", (data) => {
                logger.info("received new calendar data")
                fileSystem.writeFile("../../public/data/calendar.json", data)
                    .then(() => {
                        frontendSocket.refreshFrontend()
                        sendCalendarData(socket)
                    })
            })

            socket.on("powerOnMonitors", () => {
                WOL.wakeDevices()
            })

            socket.on("powerOffMonitors", () => {
                powerOffLG.powerOffLG()
            })

            socket.on("setLog", (args) => {
                args = JSON.parse(args)
                const backendManager = require('./backendManager')
                backendManager.frontendSendLog(args.type, args.content)
            })


            socket.on("refreshFrontend", () => {
                frontendSocket.refreshFrontend()
            })

            socket.on("getLogFiles", () => {
                /*
                consolidateLogRecords()
                    .then(res => {
                        const dataToWrite = res.replace(/","/g, '\n');
      
                        fileSystem.writeFile("../../public/data/currentUserLog.txt", dataToWrite)
                        socket.emit("logFiles", res)
                    })
                */
            })

            ss(socket).on('fileTransfer', function (stream, data) {
                const fs = require('fs');
                const filename = path.join(__dirname, '../../public/media', data.name)
                stream.pipe(fs.createWriteStream(filename));
            });

        });
    }

}

function consolidateLogRecords(){
    return new Promise((resolve, reject) => {
        const userDataLog = './data/userDataLogin.json'
        const backendManager = require('./backendManager')
        const currentUser = backendManager.getCurrentUser()
        fileSystem.readFile(userDataLog)
            .then (data => { 
                let getCurrentUserLogs = data.log
                if (currentUser.username != "admin")
                getCurrentUserLogs = data.log.filter(log => log.username == currentUser.username)
                let _parsedDataToSend = []
                getCurrentUserLogs.forEach(log => {
                        let currentLOG = []
                        log.changes.map(change => {
                            const date = new Date(log.dateTime).toLocaleDateString()
                            if (currentUser.username != "admin"){
                                currentLOG.push (date + " | " + change.replace("\n", "<br>"))
                            }else{
                                currentLOG.push (date + " | " + log.username + " | " + change.replace("\n", "<br>"))
                            }
                        })
                        _parsedDataToSend.push ("-------------------------------------------------------------")
                        _parsedDataToSend.push (currentLOG.reverse())
                })
                const parsedDataToSend = _parsedDataToSend.flat(3)
                if (currentUser.username != "admin")
                parsedDataToSend.unshift("Mostrando registros de log para el usuario " + currentUser.username)
                resolve(JSON.stringify(parsedDataToSend))
            })
    })
}

function sendCalendarData(socket) {
    const calendarDB = '../../public/data/calendar.json'
    fileSystem.readFile(calendarDB).then(data => {
        socket.emit("calendarData", data)
        logger.info("Sending calendar video data")
    })
}