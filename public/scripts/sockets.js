const socket = io();

socket.on("connect", () => {
    console.log ("connected to server")
})

socket.on("refreshFrontend", () => {
    location.reload();
})

const turnOnMonitors = (message) => {
    console.log ("Encendiendo monitores")
    socket.emit("WOL", message) //WakeOnLan
}

const turnOffMonitors = (message) => {
    socket.emit("powerOffMonitors", message)
}
