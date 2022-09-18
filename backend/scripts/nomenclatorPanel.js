const app = document.getElementsByClassName("app")[0];
const nomenclatorControls = document.getElementsByClassName("nomenclatorControls")[0];
const nomenclatorScaleLabel = document.getElementById("nomenclatorScaleLabel");
const nomenclatorScale = document.getElementById("nomenclatorScale");
const btnSaveChanges = document.getElementById("saveChanges");
const btnReloadData = document.getElementById("reloadData");

nomenclatorScale.addEventListener("change", changeNomenclatorScale);
btnSaveChanges.addEventListener("click", saveChanges)
btnReloadData.addEventListener("click", reloadData)

let nomenclatorData
let autoRefreshPanel = true;

const floorNamePlaceholder = "RAGHSA"

const buildFloorControl = (floorData, floorIndex, buildingName, buildingDataKey) => {

    const card = document.createElement('div');
    card.className = 'card'
    nomenclatorControls.appendChild(card);

    const cardHeader = document.createElement('div');
    cardHeader.className = 'cardHeader'
    card.appendChild(cardHeader);

    const floorNumber = document.createElement('div')
    floorNumber.className = 'floorNumber';
    floorNumber.innerText = floorIndex == "00" ? "PB" : floorIndex;
    cardHeader.appendChild(floorNumber);

    const buildingLabel = document.createElement('div')
    buildingLabel.className = 'buildingName'
    buildingLabel.innerText = buildingName;
    cardHeader.appendChild(buildingLabel);

    const floorDataContainer = document.createElement('div')
    floorDataContainer.setAttribute("dataReference", [buildingDataKey, floorIndex])
    floorDataContainer.className = 'floorDataContainer'
    card.appendChild(floorDataContainer)

    manageFloorDivision(null, floorDataContainer, (floorData.length > 1), floorData)

    const floorSplitController = document.createElement('div')
    floorSplitController.className = "floorSplitController"
    card.appendChild(floorSplitController)

    const splitControllerContainer = document.createElement('div')
    splitControllerContainer.className = "switch_box box_1"
    floorSplitController.appendChild(splitControllerContainer)

    const splitControllerLabel = document.createElement('label')
    splitControllerLabel.className = "splitControllerLabel"
    splitControllerLabel.innerText = "Dividir piso"
    splitControllerContainer.appendChild(splitControllerLabel)

    const splitController = document.createElement('input')
    splitController.type = "checkbox"
    splitController.className = "switch_1"
    splitController.checked = (floorData.length > 1)
    splitController.addEventListener("change", manageFloorDivision)
    splitController.addEventListener("click", logSplitCommand)
    splitControllerLabel.appendChild(splitController)

}

const manageFloorDivision = (event, _floorDataContainer, splitted, data) => {
    if (event)
        event.target.parentNode.parentNode.parentNode.parentNode.classList.add("updatePending")

    let split = false;
    let floorDataContainer;

    if (event) {
        floorDataContainer = event.target.parentNode.parentNode.parentNode.parentNode.children[1];
        split = event.target.checked;
    } else {
        floorDataContainer = _floorDataContainer;
        split = splitted;
    }
    const dataReference = floorDataContainer.getAttribute("datareference").split(",");

    /* To preserve textbox values */
    let currentValues = floorNamePlaceholder;
    if (floorDataContainer.childNodes.length == 2) {
        const valN = floorDataContainer.childNodes[0].childNodes[1].value;
        const valS = floorDataContainer.childNodes[1].childNodes[1].value;
        currentValues = (valN == valS) ? valN : valN + " " + valS;
    } else if (floorDataContainer.childNodes.length == 1) {
        currentValues = floorDataContainer.childNodes[0].childNodes[0].value
    }

    floorDataContainer.innerHTML = "";

    if (split) {
        //split floor
        /*Split N*/

        const floorSplitN = document.createElement('div')
        floorSplitN.className = 'floorSplit'
        floorDataContainer.appendChild(floorSplitN);

        const floorTagN = document.createElement('div')
        floorTagN.innerText = "N"
        floorTagN.className = 'floorTag'
        floorSplitN.appendChild(floorTagN)

        const floorTextN = document.createElement('input')
        floorTextN.type = "input"
        floorTextN.setAttribute("dataReference", [dataReference[0], dataReference[1], 0])
        floorTextN.className = "floorInput"
        floorTextN.addEventListener("change", updatePending)
        floorTextN.addEventListener("focusout", logContentChanges)

        floorTextN.value = (data) ? data[0] : currentValues
        floorSplitN.appendChild(floorTextN)

        /*Split S*/

        const floorSplitS = document.createElement('div')
        floorSplitS.className = 'floorSplit'
        floorDataContainer.appendChild(floorSplitS);

        const floorTagS = document.createElement('div')
        floorTagS.innerText = "S"
        floorTagS.className = 'floorTag'
        floorSplitS.appendChild(floorTagS)

        const floorTextS = document.createElement('input')
        floorTextS.type = "input"
        floorTextS.setAttribute("dataReference", [dataReference[0], dataReference[1], 1])
        floorTextS.addEventListener("change", updatePending)
        floorTextS.addEventListener("change", logContentChanges)
        floorTextS.className = "floorInput"
        floorTextS.value = (data) ? data[1] : currentValues
        floorSplitS.appendChild(floorTextS)
    } else {
        //join floor
        const floorSplit = document.createElement('div')
        floorSplit.className = 'floorSplit'
        floorDataContainer.appendChild(floorSplit);

        const floorText = document.createElement('textarea')
        floorText.rows = "3"
        floorText.className = "floorInputArea"

        floorText.setAttribute("dataReference", [dataReference[0], dataReference[1], -1])
        floorText.addEventListener("change", updatePending)
        floorText.addEventListener("change", logContentChanges)

        floorText.value = (data) ? data[0].replace("<br>", "\n") : currentValues



        floorSplit.appendChild(floorText)
    }
}

const buildBuildingGroup = (_buildingData, buildingName, buildingDataKey) => {
    buildingData = _buildingData[buildingDataKey]

    const sortedFloors = Object.keys(buildingData).sort()

    sortedFloors.forEach(floor => {
        buildFloorControl(buildingData[floor], floor, buildingName, buildingDataKey)
    })
}

const buildNomenclatorControl = (data) => {
    const nomenclatorControls = document.getElementsByClassName("nomenclatorControls")[0]
    nomenclatorControls.innerHTML = ""
    nomenclatorData = data;
    nomenclatorScale.value = data.globalScale
    nomenclatorScaleLabel.innerText = "Escala: " + data.globalScale
    buildBuildingGroup(data, "Torre 1", "building1")
    buildBuildingGroup(data, "Torre 2", "building2")
}

function changeNomenclatorScale(e) {
    nomenclatorScaleLabel.textContent = "Escala: " + parseFloat(e.target.value).toFixed(2)
    nomenclatorData["globalScale"] = parseFloat(e.target.value).toFixed(2);
    nomenclatorScaleLabel.classList.add("updatePending")

    const log = { type: "ACT", content: `Cambio la escala a ${nomenclatorData["globalScale"]}` }
    socket.emit("setLog", JSON.stringify(log))

}

const updatePending = (event) => {
    const card = event.target.parentNode.parentNode.parentNode
    card.classList.add("updatePending")
}

let changeBuffer
const logContentChanges = (event) => {
    clearTimeout(changeBuffer)

    changeBuffer = setTimeout(() => {
        const dataReference = event.target.getAttribute("datareference").split(",")
        const dataValue = event.target.value;

        let log;
        if (dataReference[2] == "-1") {
            log = { type: "ACT", content: `Escribió ${dataValue} en el piso ${dataReference[1]} del ${dataReference[0]}` }
        } else {
            const section = dataReference[2] == "0" ? "norte" : "sur"
            log = { type: "ACT", content: `Escribió ${dataValue} en la división ${section} del piso ${dataReference[1]} del ${dataReference[0]}` }
        }
        socket.emit("setLog", JSON.stringify(log))
    }, 1000)
}

const logSplitCommand = (event) => {
    const dataReference = event.target.parentNode.parentNode.parentNode.parentNode.childNodes[1].getAttribute("datareference").split(",")

    let log;
    const status = event.target.checked == true ? "Activó" : "Desactivó"
    log = { type: "ACT", content: `${status} la división del piso ${dataReference[1]} del ${dataReference[0]}` }

    socket.emit("setLog", JSON.stringify(log))
}

function saveChanges() {
    const nomenclatorControls = document.getElementsByClassName("nomenclatorControls")[0]
    const nomenclatorScaleLabel = document.getElementById("nomenclatorScaleLabel")
    const nomenclatorScale = document.getElementById("nomenclatorScale")

    if (nomenclatorScaleLabel.className.includes("updatePending")) {
        nomenclatorData.globalScale = nomenclatorScale.value;
        nomenclatorScaleLabel.classList.remove("updatePending")
    }

    nomenclatorControls.querySelectorAll('.updatePending').forEach(function (card) {
        let dataLocationN = undefined;
        let dataValueN = undefined;
        let dataValueS = undefined;

        if (card.childNodes[1].childNodes[0].childNodes[1]) {
            dataLocationN = card.childNodes[1].childNodes[0].childNodes[1].getAttribute("datareference").split(",")
            dataValueN = card.childNodes[1].childNodes[0].childNodes[1].value;
            dataLocationS = card.childNodes[1].childNodes[1].childNodes[1].getAttribute("datareference").split(",")
            dataValueS = card.childNodes[1].childNodes[1].childNodes[1].value;

            const buildingData = nomenclatorData[dataLocationN[0]] //wich building
            let floorData = buildingData[dataLocationN[1]] //wich floor

            floorData[0] = dataValueN
            floorData[1] = dataValueS

        } else {
            dataLocationN = card.childNodes[1].childNodes[0].childNodes[0].getAttribute("datareference").split(",")
            dataValueN = card.childNodes[1].childNodes[0].childNodes[0].value.replace("\n", "<br>");

            const buildingData = nomenclatorData[dataLocationN[0]] //wich building
            let floorData = buildingData[dataLocationN[1]] //wich floor

            floorData[0] = dataValueN
            if (floorData.length > 1) floorData.pop()
        }
        card.classList.remove("updatePending")
    });

    const log = { type: "ACT", content: `Publicó los cambios` }
    socket.emit("setLog", JSON.stringify(log))

    socket.emit("setNomenclatorData", JSON.stringify(nomenclatorData))
}

function reloadData() {
    const log = { type: "ACT", content: `Reestableció los parámtros` }
    socket.emit("setLog", JSON.stringify(log))
    nomenclatorControls.innerHTML = ""
    socket.emit("getNomenclatorData")
}