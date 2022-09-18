const socket = io();
let userDataParsed;
socket.on("connect", () => {
    console.log("Connected to backend Server")
   /*  socket.emit("getCalendarData") */
})

socket.on("disconnect", async () => {
    console.log("Disconnected from backend Server")
    await Swal.fire({
        title: 'Sesión Cerrada',
        text: 'Se ha desconectado del servidor, vuelva a iniciar sesión...',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
    })
    let baseURL = window.location.href
    baseURL = baseURL.substring(0, baseURL.length-1).split(":")
    baseURL = baseURL[0] + ":" + baseURL[1]
    window.location.href = baseURL + ":3100"
})

socket.on("calendarData", (data) => {
    buildCalendarControls(data)
})


socket.on("userData", (data) => {
    const userName = document.getElementById("username")
    userDataParsed = JSON.parse(data)
    userName.innerText = userDataParsed.username
})

socket.on("nomenclatorData", (data) => {
    buildNomenclatorControl(data)
})

socket.on ("logFiles", data => {
    //console.log (JSON.parse(data))
    displayLogFiles(JSON.parse(data))
})

const turnOnMonitors = (message) => {
    socket.emit("WOL", message) //WakeOnLan
}

const turnOffMonitors = (message) => {
    socket.emit("powerOffMonitors", message)
}

const sendFile = (file, progressTarget) => {
    return new Promise((resolve, reject) => {
        const stream = ss.createStream();
        let size = 0;
        // upload a file to the server.
        ss(socket).emit('fileTransfer', stream, { size: file.size, name: file.name });
        const blobStream = ss.createBlobReadStream(file)

        blobStream.on('data', function (chunk) {
            size += chunk.length;
            let valueProgress = Math.floor(size / file.size * 100)
            //console.log(valueProgress + '%');
            progressTarget.value = valueProgress
            progressTarget.style = "display: block"
            // -> e.g. '42%'
                
        });

        blobStream.on('end', ()=>{
            progressTarget.style = "display: none"
            console.log ("Upload complete")
            resolve(true)
        })

        blobStream.pipe(stream);
    })
}