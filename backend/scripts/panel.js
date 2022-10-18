//funcion autoejecutable para ocultar la dirección de la barra URL del navegador

(function hideMyURL() {
    let re = new RegExp(/^.*\//);
    window.history.pushState("object or string", "Title", re.exec(window.location.href));
})();

window.getCookie = function (name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2]
}

let calendarMode = false;
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("username").textContent = window.getCookie("username");
    const btnSwithMode = document.getElementById("btnSwithMode");
    const btnLogOut = document.getElementById("logOut");
   /*  btnSwithMode.addEventListener("click", changePanelMode) */
    btnLogOut.addEventListener("click", () => {
        socket.emit("logOut", window.getCookie("username"));
        let baseURL = window.location.href
        baseURL = baseURL.substring(0, baseURL.length - 1).split(":")
        baseURL = baseURL[0] + ":" + baseURL[1]
        window.location.href = baseURL + ":3100"
    });
     changePanelMode(); 
})

/* Log */
const userLogButton = document.getElementById("userLogButton");
const userLogOuterModal = document.getElementsByClassName("userLogOuterModal")[0]
const logList = document.getElementById('logList');

userLogButton.addEventListener("click", () => {
    socket.emit("getLogFiles")
})


function displayLogFiles(data) {
    userLogOuterModal.style.display = 'flex';
    let logItem = document.querySelectorAll('.userLog')

    logItem.forEach(li => {
        li.remove()
    });

    data.forEach(element => {
        log = document.createElement('li');
        log.className = "userLog"
        log.innerText = "- " + element;
        logList.appendChild(log);
    });
}

function changePanelMode() {
    const nomenclatorSectionControls = document.getElementsByClassName("nomenclatorSectionControls")[0]
    const nomenclatorControls = document.getElementsByClassName("nomenclatorControls")[0]
    const calendarControls = document.getElementsByClassName("calendarControls")[0]
    const addNewDayBtn = document.getElementById("btnAddNewDay")
    const calendarSectionControls = document.getElementsByClassName("calendarSectionControls")[0]
    const sectionTitle = document.getElementsByClassName("sectionTitle")[0]
    const comunicationSection = document.getElementsByClassName("comunicationSection")[0]
    const appDiv = document.getElementsByClassName("app")[0]

    const videoSectionButton = document.getElementById('videoSectionButton')
    const nominaSectionButton = document.getElementById('nominaSectionButton')
    const comunicationSectionButton = document.getElementById('comunicationSectionButton') 

    console.log("Calendar Mode")

    const log = { type: "ACT", content: `Ingresó al modo Programación de Videos` }
    socket.emit("setLog", JSON.stringify(log))

    nomenclatorSectionControls.style.display = "none"
    nomenclatorControls.style.display = "none"
    addNewDayBtn.style.display = "flex"
    calendarSectionControls.style.display = "block"
    calendarControls.style.display = "flex"
    sectionTitle.innerText = "PROGRAMACIÓN DE VIDEO"
    socket.emit("getCalendarData")

    videoSectionButton.addEventListener("click", ()=>{
        const log = { type: "ACT", content: `Ingresó al modo Programación de Videos` }
        socket.emit("setLog", JSON.stringify(log))

        comunicationSection.style.display = "none"
        appDiv.style.display = "flex";
        nomenclatorSectionControls.style.display = "none"
        nomenclatorControls.style.display = "none"
        addNewDayBtn.style.display = "flex"
        calendarSectionControls.style.display = "block"
        calendarControls.style.display = "flex"
        sectionTitle.innerText = "PROGRAMACIÓN DE VIDEO"
        socket.emit("getCalendarData")
    })

    nominaSectionButton.addEventListener("click", ()=>{
        console.log("Nomenclator Mode")
        
        const log = { type: "ACT", content: `Ingresó al modo Modificar Nomenclador` }
        socket.emit("setLog", JSON.stringify(log))

        comunicationSection.style.display = "none"
        appDiv.style.display = "flex";
        nomenclatorSectionControls.style.display = "flex"
        nomenclatorControls.style.display = "flex"
        addNewDayBtn.style.display = "none"
        calendarSectionControls.style.display = "none"
        calendarControls.style.display = "none"
        sectionTitle.innerText = "MODIFICAR NOMENCLADOR"
        socket.emit("getNomenclatorData")
    })

    comunicationSectionButton.addEventListener("click", ()=>{

        appDiv.style.display = "none";
        comunicationSection.style.display = "flex"
    })


}

