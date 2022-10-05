let sender;
const delayToSend = 2000;

let comunications = []
let configs = []

async function getComunications() {

    try {
        const res = await fetch("http://localhost:3100/comunications")
        comunications = await res.json()
        console.log(comunications)
        return comunications
    } catch (error) {
        console.log(error);
    }

}

async function getConfig() {

    try {
        const res = await fetch("http://localhost:3100/comunications/config")
        configs = await res.json();
        return configs
    } catch (error) {
        console.log(error);
    }

}


(async () => {

    const config = await getConfig()
    const comunications = await getComunications()
    printComunications(comunications)
    printConfig(config)
})()


/* CONFIG */

const configInputs = document.getElementsByClassName('configInputs')

function printConfig(configData) {


    const configTitle = document.getElementById('configTitle');
    const configFooter = document.getElementById('configFooter');
    const comunication_duration = document.getElementById('comunication_duration');
    const comunication_interval = document.getElementById('comunication_interval');
    const configId = document.getElementsByClassName('comunicationsConfig')[0]
    configId.setAttribute("id", configData.id);

    configTitle.value = configData.title
    configFooter.value = configData.footer
    comunication_duration.value = configData.comunication_duration
    comunication_interval.value = configData.comunication_interval

    for (let i = 0; i < configInputs.length; i++) {
        configInputs[i].addEventListener('change', waitToSendConfig)

    }

}

function waitToSendConfig() {


    if (sender) clearTimeout(sender);
    sender = setTimeout(sendConfig(this), delayToSend)

}

function sendConfig(selectedInput) {

    let inputsToSend = selectedInput.closest('.comunicationsConfig')


    let title = inputsToSend.querySelector('#configTitle').value
    let footer = inputsToSend.querySelector('#configFooter').value
    let comunication_duration = inputsToSend.querySelector('#comunication_duration').value
    let comunication_interval = inputsToSend.querySelector('#comunication_interval').value
    /*     let show_new_badge_until = inputsToSend.querySelector('#show_new_badge_until').value
        const today = new Date().toLocaleDateString('en-ca')
        const splitedDate = show_new_badge_until.split('-')
        const show_new_badge_untilParsed = splitedDate[2] + '/' + splitedDate[1] + '/' + splitedDate[0] */

    const id = inputsToSend.id

    const data = {
        title,
        footer,
        comunication_duration,
        comunication_interval
    }

    const options = {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    }

    fetch("http://localhost:3100/comunications/config", options)



}


/* PRINT DATA */

const comunicationsPanel = document.getElementsByClassName("comunicationsPanel")[0]

function printComunications(data) {
    console.log("Print this", data)

    comunicationsPanel.innerHTML = "";

    let cardCount = 0

    data.forEach(comunication => {

        let parsedDate = Date.parse(comunication.show_new_badge_until)
        const dateFormated = new Date(parsedDate).toLocaleDateString('es-EN')
        const dateForInput = new Date(parsedDate).toLocaleDateString('en-ca')
        const today = new Date().toLocaleDateString('en-ca')

        let comunicationBody = `
        <div class="comunicationCard" id="${comunication.id}">
        <div>${cardCount++}</div>
            <div class="comunicationMedia">

                    <img src="http://localhost:3000/media/comunications/${comunication.media.filename}" id="hola" alt="Select media"/>
                
                <input type="file" id="media" name="media" class="inputToSend">
            </div>

            <div class="comunicationInputs">
                <input type="text" id="title" name="title" class="inputToSend" value="${comunication.title}">
                <input type="textarea" id="paragraph" name="paragraph" class="inputToSend" value="${comunication.paragraph}">

                <div class="comunicationDate">
                    <input type="date" required pattern="\d{2}-\d{2}-\d{4}" id="show_new_badge_until" name="show_new_badge_until" class="inputToSend" min="${today}" value="${dateForInput}">
                    <button class="preview">Previsualizar</button>
                </div>
                
            </div>
            <button class="deleteButton problem" id="${comunication.id}"></button>
        </div>
        `
        comunicationsPanel.innerHTML += comunicationBody

    });

    for (let i = 0; i < comunicationInputs.length; i++) {
        comunicationInputs[i].addEventListener('change', waitToSend)
    }

    deleteComunication()
    openModal()
}





/* DATA SENDER */

const comunicationInputs = document.getElementsByClassName('inputToSend')

async function waitToSend() {

    if (sender) clearTimeout(sender);
    sender = setTimeout(await sendToServer(this), delayToSend)

}







async function sendToServer(selectedInput) {

    let inputsToSend = selectedInput.closest('.comunicationCard')

    let title = inputsToSend.querySelector('#title').value
    let paragraph = inputsToSend.querySelector('#paragraph').value
    let show_new_badge_until = inputsToSend.querySelector('#show_new_badge_until').value
    let mediaElement = inputsToSend.querySelector('#media')

    const splitedDate = show_new_badge_until.split('-')
    const show_new_badge_untilParsed = splitedDate[2] + '/' + splitedDate[1] + '/' + splitedDate[0]
    const comunicationID = inputsToSend.id


    /* VALIDACION */

    if (title.length > 20 || paragraph.length > 40) {
        Swal.fire({
            title: 'Formato de Texto invalido',
            text: "Titulo o parrafo demasiado largos",
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        })
        return
    }

    const formData = new FormData()
    formData.append("title", title)
    formData.append("paragraph", paragraph)
    formData.append("show_new_badge_until", show_new_badge_untilParsed)
    formData.append("media", mediaElement.files[0])

    const optionsPost = {
        method: "POST",
        body: formData
    }

    const optionsPatch = {
        method: "PATCH",
        body: JSON.stringify({
            title,
            paragraph,
            show_new_badge_until: show_new_badge_untilParsed,
            id: comunicationID
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }


    let foundedIndex = 0
    for (let index = 0; index < comunicationsPanel.childElementCount; index++) {
        if (comunicationsPanel.children[index].id == comunicationID) {
            foundedIndex = index
            break
        }
    }

    let lastCard = (foundedIndex == comunicationsPanel.childElementCount - 1)

    console.log("must POST?", creatingComunication && lastCard)

    let options = (creatingComunication && lastCard) ? optionsPost : optionsPatch
    let url = (creatingComunication && lastCard) ? "http://localhost:3100/comunications/withMedia" : "http://localhost:3100/comunications"

    console.log("Sending to server", options)
    const answ = await makeFetch(url, options)
    console.log (answ)
}





async function makeFetch(URL, options) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("options", options)
            const res = await fetch(URL, options)
            console.log ("res", res)
            let parsedRes
            parsedRes = res.json()
            resolve(parsedRes)
        } catch (err) {
            console.log(err.message, err)
            reject(err.message)
        }   
    })
}


/* ADD COMUNICATION */

const addComunication = document.getElementById('addComunication')
const addComunicationModal = document.getElementsByClassName('addComunicationModal')[0]
let creatingComunication = false;

addComunication.addEventListener('click', function () {

    const today = new Date().toLocaleDateString('en-ca')
    const splitedDate = today.split('-')
    const show_new_badge_untilParsed = splitedDate[2] + '/' + splitedDate[1] + '/' + splitedDate[0]

    creatingComunication = true;

    const data = {
        title: "Escribe un titulo",
        paragraph: "Escribe un parrafo",
        show_new_badge_until: show_new_badge_untilParsed,
        media: {
            filename: "videoNotAvailable.png",
            originalName: "videoNotAvailable.png"
        }
    }

    comunications.push(data)

    printComunications(comunications)

})

/* DELETE COMUNICATION */

function deleteComunication() {
    const deleteButton = document.getElementsByClassName('deleteButton')

    for (let i = 0; i < deleteButton.length; i++) {

        deleteButton[i].addEventListener('click', function (e) {

            Swal.fire({
                title: 'Estas seguro que quieres borrar',
                text: "Vas a borrar",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Borrar'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire(
                        'Borrado',
                        'Borrado con exitosamente',
                        'success'
                    )


                    const id = e.target.id
                    const data = {
                        id
                    }

                    const options = {
                        method: "DELETE",
                        body: JSON.stringify(data),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }

                    fetch("http://localhost:3100/comunications", options)
                        .then(getComunications())
                }
            })



        })

    }
}

/* MODAL */


function openModal() {

    const selectMedia = document.getElementById('hola')
    const outerModal = document.getElementsByClassName('outerModal')[0]
    

    console.log(outerModal)

    selectMedia.addEventListener('click', function (event) {
        console.log(outerModal)
        outerModal.style.display = 'flex'
        getModalMedia()
    })

}

function getModalMedia() {

    fetch("http://localhost:3100/assets/comunications/icons")
        .then(response => response.json())
        .then(data =>
            printInModal(data)
        )

}



const modalContent = document.getElementsByClassName("modalContent")[0]
const iconsNav = document.getElementById('iconsNav')
const multimediaNav = document.getElementById('multimediaNav')


function printInModal(modalMedia) {

    modalContent.innerHTML = "";

    modalMedia.forEach(mediaElement => {

        let formatedMedia = mediaElement.replace(/\\/g, "/")

        let modalIconsContent = `
            <div class="iconContainer">
                <img src="http://localhost:3100/${formatedMedia}" id="hola" alt="Select media"/>
            </div>
        `
        modalContent.innerHTML += modalIconsContent
        
    });

}

multimediaNav.addEventListener('click', function() {
    modalContent.innerHTML = ""

    let modalMediaContent = `
            <div class="iconContainer">
                <input type="file" id="media" name="media" class="inputToSend">
            </div>
        `
    modalContent.innerHTML += modalMediaContent
})

iconsNav.addEventListener('click', function () {
    getModalMedia()
})














/* EXTRAS */




/* fetch("http://localhost:3100/comunications")
.then(response => response.json())
.then(data => console.log("This is my data:",data)); */


/* const data = { username: 'example' };

fetch('https://example.com/profile', {
    method: 'POST', // or 'PUT'
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
})
    .then((response) => response.json())
    .then((data) => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
 */