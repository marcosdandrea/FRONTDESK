const TCP = require("./tcpSender")
const devices = ["192.168.11.12",
    "192.168.11.13",
    "192.168.11.14",
    "192.168.11.15",
    "192.168.11.16",
    "192.168.11.17",
    "192.168.11.18",
    "192.168.11.19"]

const command = "ka 00 00";

module.exports = {
    powerOffLG: function () {
        console.log("Turning off devices")
        devices.forEach(device => {
            TCP.sendTCP(command, 9761, device)
        })
    }
}