
const WOL = require('./wakeOnLan.js')
const POLG = require('./powerOffLG.js')
let io; 

module.exports = {
    
    initSocket: function (server) {
        io = require('socket.io')(server);

        io.on("connect", (socket) => {
            console.log ("Connected to Client")

            socket.on ("WOL", ()=>{
                WOL.wakeDevices ()
            })

            socket.on ("powerOffMonitors", ()=>{
                POLG.powerOffLG ()
            })

        });
    },

    refreshFrontend: function () {
        io.emit("refreshFrontend");
    }
}       