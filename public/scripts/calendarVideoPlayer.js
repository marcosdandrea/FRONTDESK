
let calendarSupervisorInterval;
let energyManagementInterval;
let currentMediaPlaying = [0, 0];
const mediaPath = "media"

const dateConverter = (date) => {
    const dateBegin = date.split("/");
    const dateFormatted = new Date(dateBegin[2], dateBegin[1] - 1, dateBegin[0])
    return dateFormatted;

}

const timeConverter = (time) => {
    const timeSplitted = time.split(":");
    const today = new Date();
    const timeParsed = new Date(today.getFullYear(), today.getMonth(), today.getDate(), timeSplitted[0], timeSplitted[1], 0);
    return timeParsed;
}

const parseDates = (calendar) => {
    return calendar.map((calendarEntry, index) => {
        return ([dateConverter(calendarEntry.dateStart), index]);
    })
}

const parseTimes = (todayObject) => {
    if (!todayObject) return null
    return todayObject.media.map((mediaEntry, index) => {
        return ([timeConverter(mediaEntry.timeStart), index]);
    })
}

const sortData = (dataToSort) => {
    if (!dataToSort) return null

    return (
        dataToSort.sort((a, b) => a[0] - b[0])
    );
}

const getCurrentIndexToPlay = (sortedData, referencia) => {
    if (sortedData == undefined || sortedData == null ) return null
    if (referencia == undefined || referencia == null ) return null

    if (sortedData.length == 0){
        globalErrors.push("Advertencia: No hay nada que reproducir actualmente. Todas las fechas u horas de inicio del calendario son posteriores a la actual y aún no se han alcanzado, o no hay ningún video registrado.")
        return null
    }

    //si el array tiene un solo elemento, devuelve ese unico elemento.
    if (sortedData.length == 1) return sortedData[0][1];

    //si el array tiene mas de un elemento analiza en orden cual debe reproducir
    for (let i = 0; i < sortedData.length; i++) {
        if (Date.parse(sortedData[i][0]) > Date.parse(referencia)) {
                //cuando el primer elemento ordenado supera la referencia,
                //toma el inmediato anterior y lo devuelve
                return sortedData[i-1][1];
        }
    }

    //si analizó todo y no retornó nada, debe retornar el último elemento
    return (sortedData.at(-1)[1]);

}

const calendarSupervisor = (enabled, interval, callback) => {


    if (enabled) {
        calendarSupervisorInterval = setInterval(() => {
            //determina cual es el todayObject (el día actual)
            const todayObject = calendar[getCurrentIndexToPlay(sortData(parseDates(calendar)), new Date())]
            if (!todayObject) return null

            const sortedMediaFromTodayObject = sortData(parseTimes(todayObject));

            //determina del todayObject, cual es la media actual a reproducir
            const currentMediaIndex = getCurrentIndexToPlay(sortedMediaFromTodayObject, new Date());

            if (currentMediaPlaying[0] == todayObject.dateStart &&
                currentMediaPlaying[1] == todayObject.media[currentMediaIndex]) return

            currentMediaPlaying = [todayObject.dateStart, todayObject.media[currentMediaIndex]]
            callback(currentMediaPlaying);

        }, interval)
    } else {
        clearInterval(calendarSupervisorInterval)
    }
}

const energyManagement = (enabled, interval) => {
    if (enabled) {
        energyManagementInterval = setInterval(() => {
            const todayObject = calendar[getCurrentIndexToPlay(sortData(parseDates(calendar)), new Date())]

            if (!todayObject) return;

            //chequea horarios de encendido y apagado de monitores
            const onTimer = timeConverter(todayObject.monitorControl[0]) //horario de encendido
            const offTimer = timeConverter(todayObject.monitorControl[1]) //horario de apagado
            if (onTimer < new Date() && offTimer > new Date()) turnOnMonitors()
            if (onTimer > new Date() || offTimer < new Date()) turnOffMonitors()
        }, interval)
    } else {
        clearInterval(energyManagementInterval)
    }
}

const validateFile = (currentMediaPlaying) => {
    //Que existan todos los videos a los que se hace referencia
    //Valida que exista el video
    (async () => {
        const response = await fetch("/media/" + currentMediaPlaying[1].fileName);
        //console.log(response.status);
        if (response.status == 404) {
            globalErrors.push("Advertencia: El video '" + currentMediaPlaying[1].fileName + "' no existe!")
            return
        }
    })();
}

calendarSupervisor(true, 1000, (currentMediaPlaying) => {
    console.log (currentMediaPlaying)
    console.log("reproduciendo", currentMediaPlaying[0], currentMediaPlaying[1].timeStart, currentMediaPlaying[1].fileName)
    validateFile(currentMediaPlaying);
    videoPlayer.src = mediaPath + "/" + currentMediaPlaying[1].fileName
    videoPlayer.play();
})
energyManagement(true, 60000)


function readTextFile(file, callback) {
    const rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

/*Entry point*/
let calendar = []
readTextFile("../data/calendar.json", function (text) {
    const data = JSON.parse(text);
    calendar = data
});
