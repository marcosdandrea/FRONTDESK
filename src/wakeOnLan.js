const UDP = require('./udpSender.js');
const devices = ["201742d9ed61",
    "201742d9ed83",
    "201742d9ed68",
    "201742d9eda8",
    "201742d9ed6f",
    "201742d9ed79",
    "201742d9ed7f",
    "a823fef765c1"]

const buildMagicPacket = (macAddress) => {
    let magicPacket = "FFFFFFFFFFFF"
    for (let index = 0; index < 16; index++) {
        magicPacket += macAddress
    }
    return magicPacket
}

module.exports = {
    /** 
     * @param {array[string]} devices 
     */
    wakeDevices: function () {
        console.log("Power on devices")
        devices.forEach(function (device) {
            const magicPacket = buildMagicPacket(device);
            UDP.sendUDP(magicPacket, 7, "192.168.11.255")
        })
    }
}

