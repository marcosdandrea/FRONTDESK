
const Net = require('net');


module.exports = {
    sendTCP: function (message, port, address) {
        const client = new Net.Socket();
        const socket = client.connect(port, address)
        socket.on ("connect", () =>{
            client.write(message);
        })
        socket.on ("error", () => {
            console.error("Can't reach TCP client on", address, port);
        })
    }
}