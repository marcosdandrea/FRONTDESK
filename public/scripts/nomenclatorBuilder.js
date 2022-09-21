let nomenclatorActualPositionSwitch = false;
let nomenclator = {};
let globalScale = 1;
const switchParadeTimer = 120000

const buildFloor = (floorData, floorIndex) => {

    const floor = document.createElement('div');
    floor.classList.add("floor");

    //crea el elemento floorNumber
    const floorNumber = document.createElement('div')
    floorNumber.classList.add("floorNumber")
    if (floorIndex != 0){
        floorNumber.innerText = floorIndex.toString().padStart(2, 0);
    }else{
        floorNumber.innerText = "PB";
    }
    floor.appendChild(floorNumber)

    //crea el elemento buildingSplit segun si hay Norte o Sur
    const buildingSplit = document.createElement('div')
    buildingSplit.classList.add("buildingSplit")

    if (floorData.length == 1) {
        //El floor no tiene divisiones. Es un único piso.
        floor.appendChild(buildingSplit)
        buildingSplit.innerHTML = "&nbsp &nbsp"

        const companyName = document.createElement('div');
        companyName.classList.add("name")
        companyName.innerHTML = floorData[0]
        buildingSplit.appendChild(companyName)
    } else {
        //Hay divisiones Norte y Sur
        const namesContainer = document.createElement('div');
        namesContainer.classList.add("namesContainer")
        floor.appendChild(namesContainer);

        //Norte           
        buildingSplit.innerText = "N"
        const companyName1 = document.createElement('div');
        companyName1.classList.add("name")
        companyName1.innerHTML = floorData[0]
        buildingSplit.appendChild(companyName1)
        namesContainer.appendChild(buildingSplit)

        //Sur
        const buildingSplitS = buildingSplit.cloneNode(true)
        buildingSplitS.innerText = "S"
        const companyName2 = document.createElement('div');
        companyName2.classList.add("name")
        companyName2.innerHTML = floorData[1]
        buildingSplitS.appendChild(companyName2)
        namesContainer.appendChild(buildingSplitS)

    }

    return floor
}

const buildFloorList = (buildingData, buildingList) => {
    const _building = nomenclator[buildingData]
    const sortedFloors = Object.keys(_building).sort();
    sortedFloors.forEach(floor => {
        buildingList.children[0].appendChild(buildFloor(_building[floor], floor));
    })
}

let switchTimeout
const nomenclatorSwitchPosition = (interval) => {

    switchTimeout = setTimeout(() => {
        if (showingComunication){
            clearTimeout(switchTimeout)
            nomenclatorSwitchPosition(5000)
            console.log ("A comunication is currently running. Waitin 5 sec to swap parade")
            return;
        }
        console.log ("Swapping parade and re timming switch interval to", switchParadeTimer)
        if (nomenclatorActualPositionSwitch) {
            parade.style.opacity = 0;
            setTimeout(() => {
                parade.style.flexDirection = "row-reverse"
                parade.style.opacity = 1;
            }, 2500)

        } else {
            parade.style.opacity = 0;
            setTimeout(() => {
                parade.style.flexDirection = "row"
                parade.style.opacity = 1;
            }, 2500)
        }
        clearTimeout(switchTimeout)
        nomenclatorSwitchPosition(switchParadeTimer)
        nomenclatorActualPositionSwitch = !nomenclatorActualPositionSwitch;
    }, interval)
}

/*Entry point*/
readTextFile("../data/nomenclatorData.json", function(text){
    nomenclator = JSON.parse(text);
    globalScale = nomenclator.globalScale
    document.documentElement.style.setProperty('--scale', globalScale + "rem");

    buildFloorList("building1", building1)
    buildFloorList("building2", building2)
});


nomenclatorSwitchPosition(switchParadeTimer)