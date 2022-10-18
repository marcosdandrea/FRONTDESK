
const WOL = require('./wakeOnLan.js')
const POLG = require('./powerOffLG.js')
let io;

function initSocket(server) {
    io = require('socket.io')(server);

    io.on("connect", (socket) => {
        console.log("Connected to Client")

        socket.on("WOL", () => {
            WOL.wakeDevices()
        })

        socket.on("powerOffMonitors", () => {
            POLG.powerOffLG()
        })

        socket.on("showComunication", (id) => {
            socket.emit("showComunication", id)
        })

    });
}

function refreshFrontend() {
    io.emit("refreshFrontend");
}

function showComunication(id) {
    io.emit("showComunication", id);
}

module.exports = { initSocket, refreshFrontend, showComunication }