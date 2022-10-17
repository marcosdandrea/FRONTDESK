import openModal from './comunications.modals.js'
import deleteComunication from './comunications.js'
import makeFetch from './comunications.fetch.js'
import {validateFields} from './comunications.validations.js'

function printComunicationsCards(data) {
    //console.log("Print this", data)

    comunicationsPanel.innerHTML = "";

    let cardCount = 1

    data.forEach(comunication => {

        let parsedDate = Date.parse(comunication.show_new_badge_until)
        const dateFormated = new Date(parsedDate).toLocaleDateString('es-EN')
        const dateForInput = new Date(parsedDate).toLocaleDateString('en-ca')
        const today = new Date().toLocaleDateString('en-ca')

        /*  */
        const comunicationCard = document.createElement('div')
        comunicationCard.className = 'comunicationCard'
        comunicationCard.id = comunication.id
        comunicationCard.setAttribute('data-CardCreation', "false")



        const cardNumber = document.createElement('div')
        cardNumber.className = 'cardNumber'
        cardNumber.innerText = cardCount++

        comunicationsPanel.appendChild(comunicationCard)
        comunicationCard.appendChild(cardNumber)

        const comunicationMediaContainer = document.createElement('div')
        comunicationMediaContainer.className = 'comunicationMedia'
        const cardImage = document.createElement('img')
        cardImage.src = 'http://localhost:3000/media/comunications/' + comunication.media.filename
        cardImage.className = 'cardMedia'
        cardImage.addEventListener('click', openModal)
        /* Checkear si agregar el input oculto */
        comunicationMediaContainer.appendChild(cardImage)
        comunicationCard.appendChild(comunicationMediaContainer)

        const comunicationInputsContainer = document.createElement('div')
        comunicationInputsContainer.className = 'comunicationInputs'
        /* Div titulo */
        const titleDiv = document.createElement('div')
        const cardTitle = document.createElement('p')
        cardTitle.innerText = 'Titulo';
        const inputTitle = document.createElement('input')
        inputTitle.setAttribute("type", "text")
        inputTitle.setAttribute("name", "title")
        inputTitle.setAttribute("value", comunication.title)
        inputTitle.className = 'inputToSend'
        inputTitle.id = 'title'

        comunicationInputsContainer.appendChild(titleDiv)
        titleDiv.appendChild(cardTitle)
        titleDiv.appendChild(inputTitle)
        comunicationCard.appendChild(comunicationInputsContainer)
        /*--------------*/

        /* Div Parrafo */
        const paragraphDiv = document.createElement('div')
        const paragraph = document.createElement('p')
        paragraph.innerText = 'Parrafo'
        const inputParagraph = document.createElement('input')
        inputParagraph.setAttribute("type", "textarea")
        inputParagraph.setAttribute("name", "paragraph")
        inputParagraph.setAttribute("value", comunication.paragraph)
        inputParagraph.className = 'inputToSend'
        inputParagraph.id = 'paragraph'

        comunicationInputsContainer.appendChild(paragraphDiv)
        paragraphDiv.appendChild(paragraph)
        paragraphDiv.appendChild(inputParagraph)
        /*--------------*/

        /* Div Fecha */
        const comunicationDateContainer = document.createElement('div')
        comunicationDateContainer.className = 'comunicationDate'

        const dateDiv = document.createElement('div');
        const dateTitle = document.createElement('p')
        dateTitle.innerText = 'Duracion de Novedad'
        const dateInput = document.createElement('input')
        dateInput.setAttribute("type", "date")
        dateInput.setAttribute("name", "show_new_badge_until")
        dateInput.setAttribute("pattern", "\d{2}-\d{2}-\d{4}")
        dateInput.setAttribute("min", today)
        dateInput.setAttribute("value", dateForInput)
        dateInput.className = 'inputToSend'
        dateInput.id = 'show_new_badge_until'

        comunicationInputsContainer.appendChild(comunicationDateContainer)
        comunicationDateContainer.appendChild(dateDiv)
        dateDiv.appendChild(dateTitle)
        dateDiv.appendChild(dateInput)
        /*---------------*/

        /* Card Options */
        const cardOptionsContainer = document.createElement('div')
        cardOptionsContainer.className = 'cardOptionsContainer'
        const buttonPreview = document.createElement('button')
        buttonPreview.className = 'preview'
        const deleteButton = document.createElement('button')
        deleteButton.className = 'deleteButton problem'
        deleteButton.id = comunication.id
        deleteButton.addEventListener('click', deleteComunication)

        comunicationCard.appendChild(cardOptionsContainer)
        cardOptionsContainer.appendChild(buttonPreview)
        cardOptionsContainer.appendChild(deleteButton)

        /* ------------ */

    });

    for (let i = 0; i < comunicationInputs.length; i++) {
        comunicationInputs[i].addEventListener('change', waitToSend)
    }
}

async function waitToSend() {

    if (sender) clearTimeout(sender);
    sender = setTimeout(await editCard(this), delayToSend)

}
async function editCard(selectedInput) {

    let inputsToSend = selectedInput.closest('.comunicationCard')
    console.log(inputsToSend.getAttribute("data-cardCreation"))

    let title = inputsToSend.querySelector('#title').value
    let paragraph = inputsToSend.querySelector('#paragraph').value
    let show_new_badge_until = inputsToSend.querySelector('#show_new_badge_until').value
    let mediaElement = inputsToSend.querySelector('#media')

    const splitedDate = show_new_badge_until.split('-')
    const show_new_badge_untilParsed = splitedDate[2] + '/' + splitedDate[1] + '/' + splitedDate[0]
    const comunicationID = inputsToSend.id


    /* VALIDACION */
    if (!validateFields(title, paragraph)) return

    console.log (fileToUpload)

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

   

    if (inputsToSend.getAttribute("data-cardCreation") == "false") {
        let url = "http://localhost:3100/comunications"
        console.log("Sending to server", options)
        const answ = await makeFetch(url, options)
        console.log(answ)
    }


}




export {
    printComunicationsCards
}



/* 
    let url = "http://localhost:3100/comunications"
    console.log("Sending to server", options)
    const answ = await makeFetch(url, options)
    console.log(answ) */