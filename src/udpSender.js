var BROADCAST_ADDR = "192.168.11.255";

module.exports = {
    /**
     * @param {String} message 
     * @param {number} port 
     * @param {string} address 
     */
    sendUDP: function (message, port, address) {
        var dgram = require('dgram');
        var message = Buffer.from(message, 'hex');
        var client = dgram.createSocket("udp4");
        client.send(message, 0, message.length, port, BROADCAST_ADDR, function (err, bytes) {
            if (err) console.error(err);
            client.close();
        });

    }
}

