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
    const showNewBadgeUntilParsed = splitedDate[0] + '-' + splitedDate[1] + '-' + splitedDate[2]

    creatingComunication = true;

    tempData = {
        title: "",
        paragraph: "",
        showNewBadgeUntil: showNewBadgeUntilParsed,
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
    let inputsToSend = newCard.closest('.comunicationCard')

    let thisLoader = inputsToSend.querySelector('.loader')
    thisLoader.style.setProperty("display", "block", "important")

    let title = inputsToSend.querySelector('#title').value
    let paragraph = inputsToSend.querySelector('#paragraph').value

    let comunicationExpiration = inputsToSend.querySelector('#comunicationExpiration').value
    let splitedDate = comunicationExpiration.split('-')
    const comunicationExpirationParsed = splitedDate[2] + '/' + splitedDate[1] + '/' + splitedDate[0]

    let today = new Date()
    let showNewBadgeUntil = new Date(today)
    showNewBadgeUntil.setDate(showNewBadgeUntil.getDate() + newBadgeDuration)
    const showNewBadgeUntilFormated = new Date(showNewBadgeUntil).toLocaleDateString('en-ca')
    splitedDate = showNewBadgeUntilFormated.split('-')
    const showNewBadgeUntilParsed = splitedDate[2] + '/' + splitedDate[1] + '/' + splitedDate[0]

    const formData = new FormData()
    formData.append("title", title)
    formData.append("paragraph", paragraph)
    formData.append("showNewBadgeUntil", showNewBadgeUntilParsed)
    formData.append("comunicationExpiration", comunicationExpirationParsed)
    formData.append("media", fileToUpload)

    const check = validateFile(fileToUpload)
    if (!check[1]){
        Swal.fire(
            'Error',
            'No se pueden subir comunicados con archivos de video mayores a 100MB',
            'error'
        )

        return
    }

    const options = {
        method: "POST",
        body: formData
    }

    let url = "http://localhost:3100/comunications"
    if (newCard.getAttribute("data-cardCreation") == "true") {

        const answ = await makeFetch(url, options)
        const comunicationData = await getComunications()
        printComunicationsCards(comunicationData)
        Swal.fire(
            'Creado Exitosamente',
            'Se ha creado el comunicado exitosamente',
            'success'
        )
        addComunication.style.display = 'flex'

    }


}


/* DELETE COMUNICATION */

async function deleteComunication(e) {

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
            'Borrado exitosamente',
            'success'
        )

    } catch (err) {
        Swal.fire(
            'Error',
            'Se produjo un error',
            'error'
        )
    }
    addComunication.style.display = 'flex'

}



export default deleteComunication