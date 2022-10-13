import openModal from './comunications.modals.js'

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



        const cardNumber = document.createElement('div')
        cardNumber.className = 'cardNumber'
        cardNumber.innerText = cardCount++

        comunicationsPanel.appendChild(comunicationCard)
        comunicationCard.appendChild(cardNumber)

        const comunicationMediaContainer = document.createElement('div')
        comunicationMediaContainer.className = 'comunicationMedia'
        const cardImage = document.createElement('img')
        cardImage.src = comunication.media.filename
        cardImage.className = 'cardMedia'
        /* Checkear si agregar el input oculto */

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
        /*---------------*/

        /* Card Options */
        const cardOptionsContainer = document.createElement('div')
        cardOptionsContainer.className = 'cardOptionsContainer'
        const buttonPreview = document.createElement('button')
        buttonPreview.className = 'preview'
        const deleteButton = document.createElement('button')
        deleteButton.className = 'deleteButton problem'
        deleteButton.id = comunication.id

        comunicationCard.appendChild(cardOptionsContainer)
        
        /* ------------ */

 /*        let comunicationBody = `
        <div class="comunicationCard" id="${comunication.id}">
        <div class="cardNumber">${cardCount++}</div>

            <div class="comunicationMedia">

                    <img src="http://localhost:3000/media/comunications/${comunication.media.filename}" class="cardMedia" alt="Select media"/>
                
                <input type="file" id="media" name="media" class="inputToSend">
            </div>

            <div class="comunicationInputs">
                <div>
                    <p>Titulo</p>
                    <input type="text" id="title" name="title" class="inputToSend" value="${comunication.title}">
                </div>
                <div>
                    <p>Parrafo</p>
                    <input type="textarea" id="paragraph" name="paragraph" class="inputToSend" value="${comunication.paragraph}">
                </div>
                <div class="comunicationDate">
                    <div>
                        <p>Duracion de Novedad</p>
                        <input type="date" required pattern="\d{2}-\d{2}-\d{4}" id="show_new_badge_until" name="show_new_badge_until" class="inputToSend" min="${today}" value="${dateForInput}">
                    </div>
           
                </div>
        
            </div>
                 <div class="cardOptionsContainer">
                        <button class="preview"></button>
                        <button class="deleteButton problem" id="${comunication.id}"></button>
                    </div>
        </div>
        ` */
       /*  comunicationsPanel.innerHTML += comunicationBody */

    });

    for (let i = 0; i < comunicationInputs.length; i++) {
        comunicationInputs[i].addEventListener('change', waitToSend)
    }
}

function cardCreationMode() {
    const newComunicationCard = document.querySelectorAll('.comunicationCard:last-of-type')[0]
    newComunicationCard.style.border = '2px solid #F39200'
    addComunication.style.display = 'none'

    //console.log(comunications)
    window.addEventListener('click', function (e) {

        if (e.target != newComunicationCard && e.target != addComunication) {
            /*
            newComunicationCard.remove()
            comunications.splice(-1)
            addComunication.style.display = 'block'
            console.log(comunications)
            */
        }

    })
}

export {printComunicationsCards, cardCreationMode}
