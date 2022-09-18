const calendarControls = document.getElementsByClassName("calendarControls")[0]
const btnAddNewDay = document.getElementById("btnAddNewDay")
const modals = document.getElementsByClassName("closeModal")
let videosAvailablesOnServer = []
let calendarData;
let addingNewVideo = false
let addingNewDay = false
let currentAcordeonIndexOpen = 1;
let updatingData = false;

for (let index = 0; index < modals.length; index++) {
    modals[index].addEventListener("click", closeModal)
}

btnAddNewDay.addEventListener("click", addNewDay)

const builCalendarDay = (data, index, length) => {

    const cardDay = document.createElement('div')
    cardDay.className = (index == length - 1 && addingNewDay) ? "day card processBorder" : "day card"
    cardDay.id = data["UUID"]
    cardDay.setAttribute("mediaChildrens", data.media.length)
    cardDay.setAttribute("max-Height", data.media.length * 170 + 48 + 48)
    cardDay.setAttribute("index", index)
    cardDay.addEventListener("click", (e) => changeAcordeonProxy(e, 0))
    calendarControls.appendChild(cardDay)

    if (index != 0) cardDay.style.height = "3rem"

    const cardHeader = document.createElement('div');
    cardHeader.classList.add('cardHeader', 'cardHeaderVideo')
    cardDay.appendChild(cardHeader)

    const cardTitle = document.createElement('div')
    cardTitle.className = "cardTitle"
    cardHeader.appendChild(cardTitle)

    const cardTitleIcon = document.createElement('div')
    cardTitleIcon.className = "cardTitleIcon"
    cardTitleIcon.addEventListener("click", (e) => changeAcordeonProxy(e, 2))
    cardTitle.appendChild(cardTitleIcon)

    const cardTitleText = document.createElement('div')
    cardTitleText.className = "cardTitleText"
    cardTitleText.addEventListener("click", (e) => { changeAcordeonProxy(e, 2) })
    cardTitleText.setAttribute("defaulValue", data["dateStart"])
    const dayDate = data["dateStart"].split('/')
    const formatDayDate = new Date(dayDate[2], dayDate[1] - 1, dayDate[0])
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    cardTitleText.innerText = formatDayDate.toLocaleDateString("es-AR", options).toUpperCase()
    cardTitle.appendChild(cardTitleText)

    const cardTitleEdit = document.createElement('div')
    cardTitleEdit.className = "cardTitleEdit"
    cardTitleEdit.addEventListener("click", modifyCardDate)
    cardTitle.appendChild(cardTitleEdit)

    const cardControls = document.createElement('div')
    cardControls.classList.add('cardControls', 'cardControlsVideo')
    cardHeader.appendChild(cardControls)

    const iconControl = document.createElement('div')
    iconControl.className = "iconControl"
    cardControls.appendChild(iconControl)

    const buttonPowerOn = document.createElement('button')
    buttonPowerOn.className = "roundButton powerOnMonitors powerON"
    buttonPowerOn.addEventListener("click", powerOnMonitors)
    cardControls.appendChild(buttonPowerOn)

    const inputPowerOn = document.createElement('input')
    inputPowerOn.className = "input"
    inputPowerOn.id = "inputTimePowerOn"
    inputPowerOn.className = "inputTime PowerON"
    inputPowerOn.addEventListener("focusout", changePowerTime)
    inputPowerOn.setAttribute("defaultValue", data.monitorControl[0])
    inputPowerOn.value = data.monitorControl[0]
    cardControls.appendChild(inputPowerOn)

    const buttonPowerOff = document.createElement('button')
    buttonPowerOff.className = "roundButton powerOffnMonitors powerOFF"
    buttonPowerOff.addEventListener("click", powerOffMonitors)
    cardControls.appendChild(buttonPowerOff)

    const inputPowerOff = document.createElement('input')
    inputPowerOff.className = "input"
    inputPowerOff.id = "inputTimePowerOff"
    inputPowerOff.className = "inputTime PowerOFF"
    inputPowerOff.addEventListener("focusout", changePowerTime)
    inputPowerOff.setAttribute("defaultValue", data.monitorControl[1])
    inputPowerOff.value = data.monitorControl[1]
    cardControls.appendChild(inputPowerOff)

    const acordeonCardControl = document.createElement('div')
    acordeonCardControl.className = "acordeonCardControl"
    acordeonCardControl.addEventListener("click", changeAcordeon)
    cardControls.appendChild(acordeonCardControl)

    if (index != 0) acordeonCardControl.style.transform = "rotate(180deg)"

    return cardDay
}

const buildVideoCards = (cardDay, data) => {
      
        data.forEach((videoData, index, array) => {

            const videoCard = document.createElement('div')
            videoCard.setAttribute("UUID", videoData.UUID)
            videoCard.className = (videoData.fileName != "Agregue un video...") ? "videoCard" : "videoCard process"
            cardDay.appendChild(videoCard)

            const videoCardNumber = document.createElement('div')
            videoCardNumber.className = "videoCardNumber"
            videoCardNumber.innerText = (index + 1).toString().padStart(2, 0)
            videoCard.appendChild(videoCardNumber)

            const videoCardThumbnail = document.createElement('div')
            videoCardThumbnail.className = "videoCardThumbnail"
            videoCard.appendChild(videoCardThumbnail)

            const videoComponent = document.createElement('video')
            videoComponent.className = "videoComponent"
            videoComponent.addEventListener("loadedmetadata", checkVideoMetadata)
            let baseURL = window.location.href
            baseURL = baseURL.substring(0, baseURL.length - 1).split(":")
            baseURL = baseURL[0] + ":" + baseURL[1]
            const videoFileDir = baseURL + ":3000/media/" + videoData.fileName.toString()

            if (videoFileDir.includes(".mp4")) {
                videoComponent.src = videoFileDir
                videoCardThumbnail.appendChild(videoComponent)
            } else {
                const videoFileDir = ""
                videoComponent.src = videoFileDir
                videoCardThumbnail.appendChild(videoComponent)
                videoCardThumbnail.style.backgroundImage = "url('../assets/images/videoNotAvailable.png')"
            }

            const videoProgressBar = document.createElement('progress')
            videoProgressBar.min = 0;
            videoProgressBar.max = 100;
            videoProgressBar.id = "videoProgressBar"
            videoProgressBar.className = "videoProgressBar"
            videoCardThumbnail.appendChild(videoProgressBar)

            const videoCardInfoContainer = document.createElement('div')
            videoCardInfoContainer.className = "videoCardInfoContainer"
            videoCard.appendChild(videoCardInfoContainer)

            const videoNameContainer = document.createElement('div')
            videoNameContainer.className = "videoNameContainer"
            videoCardInfoContainer.appendChild(videoNameContainer)

            const videoNameDropdown = document.createElement('select')
            videoNameDropdown.className = "videoNameDropdown"
            videoNameDropdown.addEventListener("change", addOrChangeVideoFile)
            videoNameDropdown.style.background = "url(./assets/icons/expandMore.svg) 100% / 4% no-repeat #EEE";
            videoNameContainer.appendChild(videoNameDropdown)

            videosAvailablesOnServer.forEach(videofile => {
                const option = document.createElement("option")
                option.value = videofile
                option.innerText = videofile
                videoNameDropdown.appendChild(option)
            })

            try {
                videoNameDropdown.options[
                    videosAvailablesOnServer.findIndex(videofile => videofile == videoData.fileName)
                ].selected = true;
            } catch (e) { console.error(e) }

            const videoControlsContainer = document.createElement('div')
            videoControlsContainer.className = "videoControlContainer"
            videoCardInfoContainer.appendChild(videoControlsContainer)

            const btnChangeVideo = document.createElement('button')
            btnChangeVideo.className = "defaultButton warning"
            btnChangeVideo.innerText = "Agregar nuevo video"
            btnChangeVideo.style.display = (videoData.fileName != "Agregue un video...") ? "block" : "none"
            btnChangeVideo.addEventListener("click", addVideoFile)
            videoControlsContainer.appendChild(btnChangeVideo)

            const btnPlayVideo = document.createElement('button')
            btnPlayVideo.className = "defaultButton playVideo succeed"
            btnPlayVideo.innerText = "Reproducir"
            btnPlayVideo.style.display = (videoData.fileName != "Agregue un video...") ? "block" : "none"
            btnPlayVideo.addEventListener("click", openPreviewVideoModal)
            videoControlsContainer.appendChild(btnPlayVideo)

            const labelVideoInfo = document.createElement('div')
            labelVideoInfo.className = "labelVideoInfo"
            videoControlsContainer.appendChild(labelVideoInfo)

            const videoSetupTimerContainer = document.createElement('div')
            videoSetupTimerContainer.className = "videoControlsContainer"
            videoCardInfoContainer.appendChild(videoSetupTimerContainer)

            const setupTimerIcon = document.createElement('div')
            setupTimerIcon.className = "setupTimerIcon"
            videoSetupTimerContainer.appendChild(setupTimerIcon)

            const labelTimeStartVideo = document.createElement('div')
            labelTimeStartVideo.className = "labelTimeStartVideo"
            labelTimeStartVideo.innerText = "Inicia a las: "
            videoSetupTimerContainer.appendChild(labelTimeStartVideo)

            const inputTimeStartVideo = document.createElement('input')
            inputTimeStartVideo.className = "inputTime"
            inputTimeStartVideo.value = videoData.timeStart
            inputTimeStartVideo.addEventListener("focusout", changeStartVideoTime)
            inputTimeStartVideo.setAttribute('defaultValue', videoData.timeStart)
            videoSetupTimerContainer.appendChild(inputTimeStartVideo)

            const deleteVideoContainer = document.createElement('div')
            deleteVideoContainer.className = "deleteVideoContainer"
            videoCard.appendChild(deleteVideoContainer)

            const buttonDeleteVideo = document.createElement('button')
            buttonDeleteVideo.className = "roundButton problem"
            buttonDeleteVideo.addEventListener('click', deleteVideo)
            deleteVideoContainer.appendChild(buttonDeleteVideo)
        })

        const addNewVideoContainer = document.createElement("div");
        addNewVideoContainer.className = "addNewVideoContainer"
        cardDay.appendChild(addNewVideoContainer)

        if (addingNewVideo) {
            const addNewVideoMsg = document.createElement('div')
            addNewVideoMsg.className = "addNewVideoMsg"
            addNewVideoMsg.innerText = "Está en proceso de agregar un nuevo video. Completelo para poder seguir agregando más."
            addNewVideoContainer.appendChild(addNewVideoMsg)
        } else {
            const addNewVideoButton = document.createElement('button')
            addNewVideoButton.className = "defaultButton succeed"
            addNewVideoButton.innerText = "Agregar Video a este día";
            addNewVideoButton.addEventListener("click", addNewVideoCard)
            addNewVideoContainer.appendChild(addNewVideoButton)
        }

}

function powerOnMonitors(){
    Swal.fire({
        title: 'Encendiendo monitores...',
        timer: 2000,
        icon: 'success',
        position: 'top-end',
        showConfirmButton: false,
        toast: true
    })
    socket.emit("powerOnMonitors",)
}

function powerOffMonitors(){
    Swal.fire({
        title: 'Apagando monitores...',
        timer: 2000,
        icon: 'success',
        position: 'top-end',
        showConfirmButton: false,
        toast: true
    })
    socket.emit("powerOffMonitors",)
}

const buildCalendarControls = (data) => {
    calendarControls.innerHTML = ""

    if (data) {
        addingNewDay = false;
        addingNewVideo = false;
        const sortedDates = sortObjectDates(data, "dateStart")
        //console.log (sortedDates)

        sortedDates.forEach(date => {
            sortObjectTimes(date.media, "timeStart")
        })
        videosAvailablesOnServer = data.map(day => {
            return (day.media.map(media => media.fileName))
        })
        videosAvailablesOnServer = videosAvailablesOnServer.flat(2)
        videosAvailablesOnServer = [...new Set(videosAvailablesOnServer)]
        videosAvailablesOnServer.push("Agregar nuevo video...")
        videosAvailablesOnServer.unshift("Seleccione un video...")
    }
    if (data) calendarData = data;

    if (calendarData.length > 0) {
        calendarData.forEach((day, index) => {
        buildVideoCards(builCalendarDay(day, index, calendarData.length), day.media)
        })
    } else {
        const noDataLabel = document.createElement('div')
        noDataLabel.className = "noDataLabel"
        noDataLabel.innerText = "No hay ninguna camapaña creada. Haga click en 'Agregar nueva fecha' para comenzar"
        calendarControls.appendChild(noDataLabel)
        
    }

    try{
    window.document.removeEventListener("onReady", changeAcordeon)
    }catch(e) {}

    window.document.addEventListener("onReady", changeAcordeon)

}

const sortObjectDates = (object, property) => {
    return object.sort(function (a, b) {
        if (dateParse(a[property]) > dateParse(b[property])) {
            return -1;
        }
        if (dateParse(a[property]) < dateParse(b[property])) {
            return 1;
        }
        // a must be equal to b
        return 0;
    });
}

const sortObjectTimes = (object, property) => {
    return object.sort(function (a, b) {
        if (timeParse(a[property]) > timeParse(b[property])) {
            return 1;
        }
        if (timeParse(a[property]) < timeParse(b[property])) {
            return -1;
        }
        // a must be equal to b
        return 0;
    });
}

function dateParse(date) {
    let parts = date.split("/");
    return new Date(parseInt(parts[2], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[0], 10));
}

function timeParse(time) {
    let parts = time.split(":");
    return new Date(2022, 01, 01, parseInt(parts[0], 10),
        parseInt(parts[1], 10) - 1,
        0);
}

async function addNewDay() {
    addingNewDay = true;
    addingNewVideo = true;
    const today = new Date()
    const placeholder = `${today.getDate().toString().padStart(2, 0)}/${(today.getMonth() + 1).toString().padStart(2, 0)}/${today.getFullYear()}`;

    const newDay = await Swal.fire({
        title: 'Agregar nueva fecha',
        input: 'text',
        inputLabel: "Por favor, ingrese una fecha en la cual desea que inicie la campaña en formato dd/mm/aaaa",
        inputValue: placeholder,
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return null
            }
        }
    })


    if (newDay.isConfirmed == false) return;

    let result = /^0?([1-9]|[12][0-9]|3[01])\/(0?[1-9]|[1][0-2])\/((20)[0-9]{2})$/i.test(newDay.value)

    if (result) {
        const newDaySplitted = newDay.value.split("/")
        const newDayFormatted = new Date(newDaySplitted[2], newDaySplitted[1] - 1, newDaySplitted[0])
        const UUID1 = new Date().getTime()
        const UUID2 = new Date().getTime() * Math.random(5)

        const structuredDate = `${newDayFormatted.getDate().toString().padStart(2, 0)}/${(newDayFormatted.getMonth() + 1).toString().padStart(2, 0)}/${newDayFormatted.getFullYear()}`

        if (calendarData.find(date => date.dateStart == structuredDate)) {
            await Swal.fire({
                title: 'Fecha no disponible',
                text: "El día que está tratando de crear ya existe en la base de datos",
                icon: 'info',
                confirmButtonText: 'Aceptar'
            })
            return;
        }

        const newCalendarDay =
        {
            "dateStart": structuredDate,
            "monitorControl": ["06:00", "22:00"],
            "UUID": UUID1,
            "media": [
                {
                    "fileName": "Agregue un video...",
                    "timeStart": "06:00",
                    "UUID": UUID2
                }
            ]
        }
        calendarData.push(newCalendarDay)
        buildCalendarControls()
        changeAcordeon(null, calendarData.length)
        const log = { type: "ACT", content: `Agregó un nuevo día: ${newCalendarDay.dateStart}` }
        socket.emit("setLog", JSON.stringify(log))

    } else {
        await Swal.fire({
            title: 'Error!',
            text: 'Formato de fecha incorrecto',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        })
        //alert("Formato de fecha no válido")
    }

}

function changeAcordeonProxy(event, depth) {
    event.stopPropagation()
    event.preventDefault()
    let thisElement = event.target

    for (let index = 0; index < depth; index++) {
        thisElement = thisElement.parentNode;
    }


    const btnAcordeon = thisElement.querySelector(".acordeonCardControl")
    if (btnAcordeon) btnAcordeon.click()
}

function changeAcordeon(event, _index) {
    let index
    if (event != undefined) {
        index = parseInt(event.target.parentNode.parentNode.parentNode.getAttribute("index")) + 1
        event.preventDefault()
        event.stopPropagation()
    } else if (_index != undefined) {
        index = _index
    } else {
        index = parseInt(currentAcordeonIndexOpen)
    }

    if (calendarControls.childNodes.length == 0) return

    calendarControls.childNodes.forEach(day => {
        day.style.height = "3rem"
        day.childNodes[0].childNodes[1].lastChild.style.transform = "rotate(180deg)"
    })

    const selectedDay = calendarControls.childNodes[index - 1]
    const currentDayHeader = selectedDay.childNodes[0]
    selectedDay.childNodes[0].childNodes[1].lastChild.style.transform = "rotate(0deg)"
    const mediaChildrenNumber = selectedDay.getAttribute("mediaChildrens")

    const firstMediaChildren = selectedDay.childNodes[1]
    const firstMediaChildrenHeight = firstMediaChildren.offsetHeight //videoCard Size

    const headerSize = currentDayHeader.offsetHeight //headerSize

    const maxHeight = headerSize + ((firstMediaChildrenHeight+20) * mediaChildrenNumber) + 50

    selectedDay.style.height = maxHeight + "px"
    currentAcordeonIndexOpen = index;
}

function addOrChangeVideoFile(event) {
    const selectedValue = event.target.value
    if (selectedValue == "Seleccione un video...") return
    if (selectedValue == "Agregar nuevo video...") {
        //changing current video file with another existent one
        event.target.parentNode.parentNode.childNodes[1].childNodes[0].click()
    } else {
        //Adding new video video
        //addingNewVideo = true;
        const currentVideoUUID = event.target.parentNode.parentNode.parentNode.getAttribute("uuid");
        const currentDateUUID = event.target.parentNode.parentNode.parentNode.parentNode.id
        const currentDayIndex = parseInt(event.target.parentNode.parentNode.parentNode.parentNode.getAttribute("index")) + 1

        const selectedDate = calendarData.find(date => date.UUID == currentDateUUID)
        const selectedVideo = selectedDate.media.find(media => media.UUID == currentVideoUUID)

        const log = { type: "ACT", content: `Cambió el video del día de ${selectedVideo.fileName} a ${selectedValue}` }
        socket.emit("setLog", JSON.stringify(log))

        selectedVideo.fileName = selectedValue

        socket.emit("setCalendarData", JSON.stringify(calendarData))

        updatingData = true
        currentAcordeonIndexOpen = currentDayIndex
        buildCalendarControls(calendarData)
    }
}

async function addNewVideoCard(event) {

    const inputValue = await Swal.fire({
        title: 'Agregar nuevo video',
        input: 'text',
        inputLabel: "Ingrese el horario en el que se iniciará el nuevo video en formato hh:mm",
        inputValue: "15:30",
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return null
            }
        }
    })
    if (inputValue.isConfirmed == false) return;


    let result = /^([0-1][0-9]|[2][0-3]):([0-5][0-9])$/i.test(inputValue.value)

    if (!result) {
        await Swal.fire({
            title: 'Error!',
            text: 'El valor ingresado no coincide con un formato de hora válido. Recuerde que debe ingresar una hora en formato hh:mm en base a 24hs, por ejemplo: "22:30"',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        })
        inputValue = "06:00"
        event.target.classList.add("borderError")
        return;
    }

    const selectedDateCardId = event.target.parentNode.parentNode.id
    const selectedDate = calendarData.find(date => date.UUID == selectedDateCardId)

    //const selectedMedia = selectedDate.media.find(media => media.UUID == videoCardUUID)
    const checkIfTimeExist = selectedDate.media.find(media => media.timeStart == inputValue.value)

    if (checkIfTimeExist) {
        await Swal.fire({
            title: 'Horario no disponible',
            text: 'El horario ingresado coinicide con otro video ya programado en el mismo grupo. Debe ingresar un valor diferente.',
            icon: 'info',
            confirmButtonText: 'Aceptar'
        })
        event.target.classList.add("borderError")
        return;
    }

    const uuid = new Date().getTime()
    const newVideoObject =
    {
        "fileName": "Agregue un video...",
        "timeStart": inputValue.value,
        "UUID": uuid
    }
    selectedDate.media.push(newVideoObject)
    buildCalendarControls()
}

async function deleteVideo(event) {
    const currentVideo =
        [event.target.parentNode.parentNode.parentNode.id,
        parseInt(event.target.parentNode.parentNode.childNodes[0].innerText) - 1,
        parseInt(event.target.parentNode.parentNode.parentNode.getAttribute("index")) + 1
        ];
    const selectedDay = calendarData.find(day => day.UUID == currentVideo[0])
    const selectedDayIndex = calendarData.findIndex(day => day.UUID == currentVideo[0])

    let filename = selectedDay.media[currentVideo[1]].fileName;

    let ans
    if (selectedDay.media.length != 1) {
        ans = await Swal.fire({
            title: 'Atención!',
            text: '¿Esta seguro que desea borrar este video?',
            icon: 'warning',
            confirmButtonText: 'Si',
            showDenyButton: true,
            denyButtonText: "No"
        })
    } else {
        ans = await Swal.fire({
            title: 'Atención!',
            text: '¿Esta seguro que desea borrar este video? ATENCIÓN: Al no quedar mas videos en este día, también se eliminará el día.',
            icon: 'warning',
            confirmButtonText: 'Si',
            showDenyButton: true,
            denyButtonText: "No"
        })
    }

    if (ans.value == false) return
    addingNewVideo = false;
    if (filename == "Agregue un video...") filename = "(no seleccionó un archivo)"

    const log = { type: "ACT", content: `Borró el video ${filename} del día ${selectedDay.dateStart}` }
    socket.emit("setLog", JSON.stringify(log))

    selectedDay.media.splice(currentVideo[1], 1)

    if (selectedDay.media.length == 0) calendarData.splice(selectedDayIndex, 1)

    socket.emit("setCalendarData", JSON.stringify(calendarData))

    buildCalendarControls(calendarData)
    changeAcordeon(null, currentVideo[2])


}

async function addVideoFile(event) {
    const videoCard = event.target.parentNode.parentNode.parentNode
    const dayCard = videoCard.parentNode
    const dayCardUUID = dayCard.getAttribute("id")
    const mediaUUID = videoCard.getAttribute("uuid")

    const selectedDay = calendarData.find(day => day.UUID == dayCardUUID)
    const selectedMedia = selectedDay.media.find(media => media.UUID == mediaUUID)

    const text1 = "Los archivos de video deben tener una resolución de 3840 x 2160 px con una velocidad de 30 fps, codificados en mp4 H264, si agrega videos que no respondan a estas características pueden producirse errores de reprodución o la falla total de la apliacación. Ante cualquier duda, contáctese con Proyecciones Digitales";

    const ans = await Swal.fire({
        title: 'Agregar nuevo video',
        text: text1,
        icon: 'info',
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return null
            }
        }
    })

    if (!ans.value) return

    openFileDialog()
        .then(async (filename) => {

            const text2 = `Ha seleccionado el archivo "${filename.name}". ¿Desea enviarlo al servidor ahora? <br><strong style="color:red">No cierre esta ventana hasta que la subida se complete</strong>.`;
            const ans = await Swal.fire({
                title: 'Agregar nuevo video',
                html: text2,
                icon: 'question',
                showCancelButton: true,
                inputValidator: (value) => {
                    if (!value) {
                        return null
                    }
                }
            })

            if (!ans.value) return
            //parseDatabase
            selectedMedia.fileName = filename.name;

            //start uploading
            const videoUploadProgress = videoCard.childNodes[1].childNodes[1]

            sendFile(filename, videoUploadProgress)
                .then(async () => {

                    await Swal.fire({
                        title: 'Video Subido',
                        text: "Su video ha subido exitosamente al sevidor",
                        timer: 8000,
                        icon: 'success',
                        toast: true
                    })

                    //push client to update DB
                    socket.emit("setCalendarData", JSON.stringify(calendarData))

                    const log = { type: "ACT", content: `A seleccionado el video ${filename.name} para el día ${selectedDay.dateStart}, a la hora ${selectedMedia.dateStart}` }
                    socket.emit("setLog", JSON.stringify(log))
                })
        })


}

function openFileDialog() {
    return new Promise((resolve, reject) => {
        let input = document.createElement('input');
        input.type = 'file';
        input.accept = ".mp4";
        input.onchange = _ => {
            let files = Array.from(input.files);
            resolve(files[0])
        };
        input.click();
    })
}

function openPreviewVideoModal(event) {
    const modal = document.getElementsByClassName("outerModal")[0]
    const videoFileName = event.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0].getAttribute("src")
    const video = modal.querySelector(".videoModal")
    video.src = videoFileName
    modal.style = "display:flex"
}

function closeModal(event) {
    const thisModal = event.target.parentNode
    thisModal.style = "display:none"

}

async function changeStartVideoTime(event) {

    let inputValue = event.target.value

    let result = /^([0-1][0-9]|[2][0-3]):([0-5][0-9])$/i.test(inputValue)

    if (!result) {
        await Swal.fire({
            title: 'Horario no disponible',
            text: "El valor ingresado no coincide con un formato de hora válido. Recuerde que debe ingresar una hora en formato hh:mm en base a 24hs, por ejemplo: '22:30'",
            icon: 'info',
            confirmButtonText: 'Aceptar'
        })
        inputValue = "06:00"
        event.target.classList.add("borderError")
        return;
    }

    const videoCard = event.target.parentNode.parentNode.parentNode
    const dateCard = videoCard.parentNode
    const dayIndex = parseInt(dateCard.getAttribute("index")) + 1

    videoCardUUID = videoCard.getAttribute("UUID");
    dateCardUUID = dateCard.getAttribute("id")

    const selectedDay = calendarData.find(date => date.UUID == dateCardUUID)
    const selectedMedia = selectedDay.media.find(media => media.UUID == videoCardUUID)
    const checkIfTimeExist = selectedDay.media.find(media => media.timeStart == inputValue)

    console.log(checkIfTimeExist)
    if (checkIfTimeExist && selectedMedia.timeStart != inputValue) {
        await Swal.fire({
            title: 'Horario no disponible',
            text: "El horario ingresado coinicide con otro video ya programado en el mismo grupo. Debe ingresar un valor diferente.",
            icon: 'info',
            confirmButtonText: 'Aceptar'
        })
        event.target.classList.add("borderError")
        return;
    }

    selectedMedia.timeStart = inputValue
    updatingData = true;
    socket.emit("setCalendarData", JSON.stringify(calendarData))

    const log = { type: "ACT", content: `Configuró el inicio del video ${selectedMedia.fileName} a las ${selectedMedia.dateStart}hs del día ${selectedDay.dateStart}` }
    socket.emit("setLog", JSON.stringify(log))
    event.target.classList.remove("borderError")

}

async function changePowerTime(event) {
    event.stopPropagation()
    let inputValue = event.target.value

    let result = /^([0-1][0-9]|[2][0-3]):([0-5][0-9])$/i.test(inputValue)

    if (!result) {
        await Swal.fire({
            title: 'Horario no disponible',
            text: "El valor ingresado no coincide con un formato de hora válido. Recuerde que debe ingresar una hora en formato hh:mm en base a 24hs, por ejemplo: '22:30'",
            icon: 'info',
            confirmButtonText: 'Aceptar'
        })
        inputValue = "06:00"
    }

    const dayIndex = event.target.parentNode.parentNode.parentNode.getAttribute("index")
    const OnORoff = event.target.className.includes("PowerON") ? 0 : 1;

    //if Off < ON
    const currentOnTime = new Date("January 01, 2022 " +
        calendarData[dayIndex].monitorControl[0].split(":")[0] + ":" +
        calendarData[dayIndex].monitorControl[0].split(":")[1] + ":00")

    const currentOffTime = new Date("January 01, 2022 " +
        calendarData[dayIndex].monitorControl[1].split(":")[0] + ":" +
        calendarData[dayIndex].monitorControl[1].split(":")[1] + ":00")

    const currentInputValue = new Date("January 01, 2022 " +
        inputValue.split(":")[0] + ":" +
        inputValue.split(":")[1] + ":00")

    let allowChange = true
    let message

    if (currentOnTime == "Invalid Date" || currentOffTime == "Invalid Date" || currentInputValue == "Invalid Date") {
        message = `Se ha producido un error parseando los horarios. Contáctese con Proyecciones Digitales. ERR: 'Invalid Date'`
        allowChange = false;
    }


    if (OnORoff == 0) { //changing powerOn Values
        if (currentInputValue >= currentOffTime) {
            message = `Usted está configurando un horario de encendido cuyo valor (${inputValue}) es igual o posterior al horario configurado para el apagado (${calendarData[dayIndex].monitorControl[1]}) y eso no está permitido. No se guardarán los cambios.`
            allowChange = false;
        }
    } else { //changing powerOFF values
        if (currentInputValue <= currentOnTime) {
            message = `Usted está configurando un horario de apagado cuyo valor (${inputValue}) es igual o anterior al horario configurado para el encendido (${calendarData[dayIndex].monitorControl[0]}) y eso no está permitido. No se guardarán los cambios.`
            allowChange = false;
        }
    }

    if (!allowChange) {
        await Swal.fire({
            title: 'Horario incorrecto',
            text: message,
            icon: 'info',
            confirmButtonText: 'Aceptar'
        })
        reloadDataCalendar()
        return;
    }

    calendarData[dayIndex].monitorControl[OnORoff] = event.target.value;

    updatingData = true;
    socket.emit("setCalendarData", JSON.stringify(calendarData))

    const log = { type: "ACT", content: `Configuró el encendido en ${calendarData[dayIndex].monitorControl[0]} y apagado de monitores en ${calendarData[dayIndex].monitorControl[1]} para el día ${calendarData[dayIndex].dateStart}` }
    socket.emit("setLog", JSON.stringify(log))
}

async function modifyCardDate(event) {
    event.stopPropagation()
    const today = new Date()
    const placeholder = `${today.getDate().toString().padStart(2, 0)}/${(today.getMonth() + 1).toString().padStart(2, 0)}/${today.getFullYear()}`;

    const newValue = await Swal.fire({
        title: 'Agregar nueva fecha',
        input: 'text',
        inputLabel: "Por favor, ingrese una fecha en la cual desea que inicie la campaña en formato dd/mm/aaaa",
        inputValue: placeholder,
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return null
            }
        }
    })

    if (newValue.value == null) return;
    let result = /^0?([1-9]|[12][0-9]|3[01])\/(0?[1-9]|[1][0-2])\/((20)[0-9]{2})$/i.test(newValue.value)

    if (!result) {
        const msg = "La fecha ingresada no es válida"
        await Swal.fire({
            title: 'Fecha inválida',
            text: msg,
            icon: 'info',
            confirmButtonText: 'Aceptar'
        })
        return
    }

    const currentCard = event.target.parentNode.parentNode.parentNode
    const currentCardIndex = parseInt(currentCard.getAttribute("Index")) + 1
    const currentCardData = calendarData[currentCardIndex - 1]
    const currentCardDate = currentCardData.dateStart
    const checkDateIfRepeated = calendarData.find(date => date.dateStart == newValue.value)

    if (checkDateIfRepeated) {
        const msg = "La fecha ingresada ya existe dentro la programación, debe elegir una fecha distinta"
        await Swal.fire({
            title: 'Fecha no disponible',
            text: msg,
            icon: 'info',
            confirmButtonText: 'Aceptar'
        })
        return
    }

    const log = { type: "ACT", content: `Reprogramó la fecha de inicio de campaña del ${currentCardDate} al ${newValue.value}` }
    socket.emit("setLog", JSON.stringify(log))

    currentCardData.dateStart = newValue.value;
    socket.emit("setCalendarData", JSON.stringify(calendarData))

}

function reloadDataCalendar() {
    const log = { type: "ACT", content: `Reestableció los parámtros` }
    socket.emit("setLog", JSON.stringify(log))
    nomenclatorControls.innerHTML = ""
    socket.emit("getCalendarData")
}

function checkVideoMetadata(event) {
    const parentNode = event.target.parentNode.parentNode
    const videoCard = parentNode.querySelector(".labelVideoInfo")

    let date = new Date(null);
    date.setSeconds(this.duration); // specify value for SECONDS here
    let result = date.toISOString().substr(14, 5);

    const aspectRatio = this.videoWidth / this.videoHeight
    let msg = `Ancho: <b>${this.videoWidth}px</b> | Alto: <b>${this.videoHeight}px</b> | Duración: <b>${result} min</b>`

    if (aspectRatio.toFixed(2) != 1.78 ||
        this.videoWidth < 3840 || this.videoHeight < 2160) {
        msg = "<strong class='videoWrongFormat'>¡Este video no tiene el formato adecuado!</strong> <u>clic aquí para mas información</u>"
        const videoResolution = `${this.videoWidth}px por ${this.videoHeight}px`
        videoCard.addEventListener("click", () => videoInfoWarning(videoResolution), false);
        parentNode.classList.add("borderError")
        parentNode.classList.add("solidError")
    }


    videoCard.innerHTML = msg;
}

function videoInfoWarning(videoResolution) {
    Swal.fire({
        title: 'Este video no es apropiado',
        html: `Se detectó que este video no cumple con las especificaciones de resolución para este dispositivo lo que podría llevar a distorsiones en la imágen, aparición de bandas negras y baja calidad de reproducción. <br>Su tamaño es de ${videoResolution}.<br>
        Se sugiere utilizar un video que cumpla con las especificaciones mínimas de tamaño sugeridas: <br>
        <Strong>Ancho: 3840px Alto: 2160px</strong>
       `,
        icon: 'warning',
        confirmButtonText: 'Aceptar'
    })
}