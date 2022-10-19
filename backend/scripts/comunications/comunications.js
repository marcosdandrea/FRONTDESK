import makeFetch from './comunications.fetch.js'
import {
    getConfig,
    printConfig
} from './comunications.configurations.js'
import {
    printComunicationsCards
} from './comunications.services.js'
import {
    validateFields, validateFile
} from './comunications.validations.js'


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




/* ADD COMUNICATION */

const addComunication = document.getElementById('addComunication')
const addComunicationModal = document.getElementsByClassName('addComunicationModal')[0]

addComunication.addEventListener('click', function () {

    const today = new Date();
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 2)
    const tomorrowFormat = tomorrow.toLocaleDateString('en-ca')
    const splitedDate = tomorrowFormat.split('-')
    const show_new_badge_untilParsed = splitedDate[0] + '-' + splitedDate[1] + '-' + splitedDate[2]

    creatingComunication = true;

    tempData = {
        title: "",
        paragraph: "",
        show_new_badge_until: show_new_badge_untilParsed,
        media: {
            filename: "http://localhost:3100/assets/icons/comunications/videoNotAvailable.png",
            originalName: "videoNotAvailable.png"
        }
    }

    comunications.push(tempData)

    printComunicationsCards(comunications)
    cardCreationMode()
})

function cardCreationMode() {


    const newComunicationCard = document.querySelectorAll('.comunicationCard:last-of-type')[0]
    const newCardOptions = newComunicationCard.querySelector('.cardOptionsContainer')
    const newCardImage = newComunicationCard.querySelector('.cardMedia')
    const newCardPreview = newCardOptions.querySelector('.preview')
    const newComunicationMedia = newComunicationCard.querySelector('.comunicationMedia')
    newComunicationMedia.style.cursor = 'pointer'
  

    const oldCards = document.querySelectorAll('.comunicationCard:not(:last-child)')



    newComunicationCard.classList = 'comunicationCard process'
    newComunicationCard.setAttribute('data-CardCreation', "true")
    newCardImage.setAttribute('data-CardCreation', "true")
    addComunication.style.display = 'none'
    newCardPreview.style.display = 'none'
    const createNewCardButton = document.createElement('button');
    createNewCardButton.className = 'createCardButton'
    newCardOptions.prepend(createNewCardButton)

    createNewCardButton.addEventListener('click', () => {
        createCard(newComunicationCard)

    })

    /* SI CLICKEA EN OTRA CARD, CANCELA EL MODO CREACION */
    for (let i = 0; i < oldCards.length; i++) {

        oldCards[i].addEventListener('click', async() => {
            const comunicationData = await getComunications()
            printComunicationsCards(comunicationData)
            addComunication.style.display = 'flex'
            return
        })

    }

}

async function createCard(newCard) {
    console.log('Creando', newCard)
    //--> iniciar ruedita

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
    formData.append("media", fileToUpload)

    //console.log("File:",fileToUpload)

    const check = validateFile(fileToUpload)
    if (!check[1]){
        //sweet Alert
        console.log(check[0])
        return
    }

    const options = {
        method: "POST",
        body: formData
    }

    console.log(title, paragraph, show_new_badge_until)
    let url = "http://localhost:3100/comunications"
    if (newCard.getAttribute("data-cardCreation") == "true") {

        const answ = await makeFetch(url, options)
        const comunicationData = await getComunications()
        printComunicationsCards(comunicationData)
        addComunication.style.display = 'flex'

    }


}


/* DELETE COMUNICATION */

async function deleteComunication(e) {
    console.log(e.target.id)

    const result = await Swal.fire({
        title: 'Estas seguro que quieres borrar',
        text: "Vas a borrar",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Borrar'
    })

    if (result.isConfirmed == false) return

    try {
        const id = e.target.id

        const options = {
            method: "DELETE",
            body: JSON.stringify({
                id
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }

        const url = "http://localhost:3100/comunications"
        await makeFetch(url, options)
        const comunicationData = await getComunications()
        printComunicationsCards(comunicationData)

        Swal.fire(
            'Borrado',
            'Borrado con exitosamente',
            'success'
        )

    } catch (err) {
        console.log(err)
        Swal.fire(
            'Error',
            'Se produjo un error',
            'error'
        )
    }
    addComunication.style.display = 'flex'

}



export default deleteComunication