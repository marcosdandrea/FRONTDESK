const path = require('path');
const express = require('express')
const filesystem = require('./filesystem')
const backendApp = express();
const backendServer = require('http').createServer(backendApp);
const socket = require('./socket.js');
const logger = require('../logger')
const userServices = require("./services/userServices")
const comunicationsAPI = require("./controllers/comunications/comunicationsAPI")
const cors = require("cors")

let currentLog = {};

function init() {

    const port = 3100
    socket.initSocket(backendServer);

    backendApp.use(cors())
    backendApp.use(express.urlencoded({extended: true}))
    backendApp.use(express.json())
    backendApp.use('/', express.static(path.join(__dirname, '../../backend')));
    backendApp.use(timeout)

    backendApp.get('/login', userServices.login)
    comunicationsAPI.begin(backendApp)

    backendApp.use(errorHandler)

    backendServer.listen(port, "0.0.0.0", () => {
        logger.info('Backend server listening at port '+ port);
        return (backendApp)
    }).on('error', (err) => logger.error(err))


}

function timeout (req, res, next){
    res.setTimeout(3000, function(){
        logger.error('Request has timed out.');
            res.status(408).send("Request has timed out due to error");
        });

    next();
};


const errorHandler = (error, request, response, next) => {
    console.log (error)
  }

function sendUserData(socket) {
    socket.emit("userData", JSON.stringify(currentLog))
}

function closeUserSession() {
    currentLog = {};
    currentUser = { username: undefined, sesionExpires: undefined, endpointName: "" };
    logger.info("Se cerró la sesión de usuario")
}

function frontendSendLog(type, data) {
    logger.info(type + " " + data)
}

function getCurrentUser() {
    return currentUser
}

function flushHorphanUploadedVideos() {
    const mediaDir = "./public/media"
    const videoCalendar = "../../public/data/calendar.json"
    filesystem.listDir(mediaDir)
        .catch(err => logger.info(err))
        .then(videoFiles => {
            filesystem.readFile(videoCalendar)
                .catch(err => { logger.info(err); return })
                .then(videoCalendar => {
                    let videoCalendarFiles = videoCalendar.map(day => {
                        return (day.media.map(media => media.fileName))
                    })
                    videoCalendarFiles = videoCalendarFiles.flat()
                    const uniqueVideoCalendarFiles = [...new Set(videoCalendarFiles)]
                    if (!videoFiles) return
                    const videosToRemove = videoFiles.filter(video => !uniqueVideoCalendarFiles.includes(video))
                    videosToRemove.forEach(videoFile => {
                        const path = require('path');
                        filesystem.deleteFile(path.join(__dirname, '../../public/media', videoFile))
                            .catch((err) => logger.info(err))
                            .then((res) => { logger.info(`Videofile ${videoFile} has been deleted automatically because it's not been used`) })
                    })
                })
        })
}

module.exports = { init, sendUserData, closeUserSession, flushHorphanUploadedVideos, getCurrentUser, frontendSendLog }