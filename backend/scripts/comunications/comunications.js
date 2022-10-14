import makeFetch from './comunications.fetch.js'
import {
    getConfig,
    printConfig
} from './comunications.configurations.js'
import {
    printComunicationsCards,
    cardCreationMode
} from './comunications.services.js'

(async () => {
    const config = await getConfig()
    const comunications = await getComunications()
    printComunicationsCards(comunications)
    printConfig(config)
})()


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

async function waitToSend() {

    if (sender) clearTimeout(sender);
    sender = setTimeout(await editCard(this), delayToSend)

}


async function editCard(selectedInput) {

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

    const options = {
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
/* 
    let lastCard = (foundedIndex == comunicationsPanel.childElementCount - 1)

    console.log("must POST?", creatingComunication && lastCard)

    let options = (creatingComunication && lastCard) ? optionsPost : optionsPatch */
    let url = "http://localhost:3100/comunications"

    console.log("Sending to server", options)
    const answ = await makeFetch(url, options)
    console.log(answ)
}

/* ADD COMUNICATION */

const addComunication = document.getElementById('addComunication')
const addComunicationModal = document.getElementsByClassName('addComunicationModal')[0]

addComunication.addEventListener('click', function () {

    const today = new Date().toLocaleDateString('en-ca')
    const splitedDate = today.split('-')
    const show_new_badge_untilParsed = splitedDate[2] + '/' + splitedDate[1] + '/' + splitedDate[0]



    creatingComunication = true;

    tempData = {
        title: "Escribe un titulo",
        paragraph: "Escribe un parrafo",
        show_new_badge_until: show_new_badge_untilParsed,
        media: {
            filename: "../../assets/videoNotAvailable.png",
            originalName: "videoNotAvailable.png"
        }
    }

    comunications.push(tempData)

    printComunicationsCards(comunications)
    cardCreationMode()
})


/* async function createCard(newCard) {
    console.log('Creando', newCard)
    let inputsToSend = newCard.closest('.comunicationCard')

    let title = inputsToSend.querySelector('#title').value
    let paragraph = inputsToSend.querySelector('#paragraph').value
    let show_new_badge_until = inputsToSend.querySelector('#show_new_badge_until').value

    const splitedDate = show_new_badge_until.split('-')
    const show_new_badge_untilParsed = splitedDate[2] + '/' + splitedDate[1] + '/' + splitedDate[0]
    const comunicationID = inputsToSend.id

    const formData = new FormData()
    formData.append("title", title)
    formData.append("paragraph", paragraph)
    formData.append("show_new_badge_until", show_new_badge_untilParsed)
    formData.append("media", fileToUpload.files[0])

    const options = {
        method: "POST",
        body: formData
    }

    console.log(title, paragraph, show_new_badge_until)
    let url = "http://localhost:3100/comunications"
    console.log("Sending to server", options)
    const answ = await makeFetch(url, options)
    console.log(answ)

   

}
 */

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
                        .then(getComunications()

                    )


                }

            })



        })

    }

}

export default deleteComunication