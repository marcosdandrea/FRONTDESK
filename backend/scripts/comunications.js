
async function getComunications() {

    try {
        const res = await fetch("http://localhost:3100/comunications")
        console.log(res)
        const parsedReq = await res.json();
        printComunications(parsedReq)
    } catch (error) {
        console.log(error);
    }

}

getComunications()


/* PRINT DATA */

const comunicationsPanel = document.getElementsByClassName("comunicationsPanel")[0]

function printComunications(data) {
    console.log("Print this", data)
/*     let comunications = data.comunications
    let config = data.config */

    console.log("Config", config)

    comunications.forEach(comunication => {
        console.log(comunication)

        let comunicationBody = `
        <div class="comunicationCard" id="${comunication.id}">
        <div>01</div>
            <div class="comunicationMedia">
                <label for="media">
                    <img src="./assets/images/selectMedia.png" alt="Select media"/>
                </label>
                <input type="file" id="media" name="media" class="inputToSend">
            </div>

            <div class="comunicationInputs">
                <input type="text" id="title" name="title" class="inputToSend" value="${comunication.title}">
                <input type="textarea" id="paragraph" name="paragraph" class="inputToSend" value="${comunication.paragraph}">

                <div class="comunicationDate">
                    <input type="text" id="date" name="show_new_badge_until" class="inputToSend" value="${comunication.show_new_badge_until}">
                    <button class="preview">Previsualizar</button>
                </div>
            </div>
        </div>
        `
        comunicationsPanel.innerHTML = comunicationBody

    });

    /* Consultar con Marcos */
    for (let i = 0; i < comunicationInputs.length; i++) {
        comunicationInputs[i].addEventListener('change', waitToSend)
    }

}



/* DATA SENDER */

const comunicationInputs = document.getElementsByClassName('inputToSend')

let sender;
const delayToSend = 2000;

function waitToSend() {
    if (sender) clearTimeout(sender);
    sender = setTimeout(sendToServer, delayToSend)
}





function sendToServer() {

    console.log("Send to server")

    for (let i = 0; i < comunicationInputs.length; i++) {
        console.log(comunicationInputs[i].value)

    }


}

const addComunication = document.getElementById('addComunication')
const addComunicationModal = document.getElementsByClassName('addComunicationModal')[0]

addComunication.addEventListener('click',function(e) {
    console.log("Click")
    addComunicationModal.style.display = 'flex'
})







/* fetch("http://localhost:3100/comunications")
.then(response => response.json())
.then(data => console.log("This is my data:",data)); */