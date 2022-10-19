import makeFetch from './comunications.fetch.js'

async function openModal(e) {
    if (this.getAttribute('data-cardCreation') == 'true') {
        currentCardImageEdition = e.target
        printInModal()
        outerModal.style.display = 'flex'
    }

}

function printInModal(modalMedia) {
    modalContent.innerHTML = ""

    const iconContainer = document.createElement("div")
    iconContainer.className = "fileContainer"

    const textContainer = document.createElement("div")
    textContainer.className = "textContainer"
    const title = document.createElement("p")
    const modalText = document.createElement("p")
    title.innerText = "Subir una Imagen"
    modalText.innerText = "Los archivos de imagenes y videos deben tener un tamaño recomendado de 800px x 482px (aspecto 16:9)."

    const modalText2 = document.createElement("p")
    modalText2.innerText = 'Los videos deben tener un peso menor a 100MB.'

    textContainer.appendChild(title);
    textContainer.appendChild(modalText)
    textContainer.appendChild(modalText2)
    modalContent.appendChild(textContainer);
    modalContent.appendChild(iconContainer)

    const inputFile = document.createElement("input")
    inputFile.type = "file"
    inputFile.id = "media"
    inputFile.className = "inputToSend"
    inputFile.setAttribute("accept", ".png, .mp4")

    iconContainer.appendChild(inputFile)

    const acceptButton = document.createElement("button")
    acceptButton.className = "btnSubmit"
    acceptButton.textContent = "Subir Archivo"
    acceptButton.addEventListener("click", () => {
        outerModal.style.display = "none"
        fileToUpload = inputFile.files[0]
        if (fileToUpload.name.includes("png")) {
            currentCardImageEdition.poster = createObjectURL(fileToUpload)
            currentCardImageEdition.src = ""
        } else {
            currentCardImageEdition.poster = ""
            currentCardImageEdition.src = createObjectURL(fileToUpload)
        }
    })

    iconsNav.style.borderBottom = "none"
    multimediaNav.style.borderBottom = "1px solid #3C3C3B"
    iconContainer.appendChild(acceptButton)

}

/* TOGGLE SECTION IN MODAL NAV */

iconsNav.addEventListener('click', printIconsModal)

async function printIconsModal() {
    const url = "http://localhost:3100/assets/comunications/icons"
    const options = {
        method: "GET"
    }
    const mediaRepository = await makeFetch(url, options)
    modalContent.innerHTML = "";
    const iconContainer = document.createElement("div")
    iconContainer.className = "iconContainer"
    modalContent.style.backgroundImage = 'none'
    modalContent.appendChild(iconContainer)

    mediaRepository.forEach(mediaElement => {

        const formatedMedia = mediaElement.replace(/\\/g, "/")
        const iconButton = document.createElement("img")
        const mediaUrl = `http://localhost:3100/${formatedMedia}`
        iconButton.src = mediaUrl

        iconButton.addEventListener('click', () => {
            comunications.at(-1).media.filename = mediaUrl
            comunications.at(-1).media.originalName = mediaUrl.split("/").pop()
            let originalMedia = mediaUrl.split("/").pop()

            fileToUpload = JSON.stringify({
                filename: mediaUrl,
                originalName: originalMedia
            })
            outerModal.style.display = "none"
            currentCardImageEdition.src = comunications.at(-1).media.filename
        })

        iconContainer.appendChild(iconButton)
    });

    multimediaNav.style.borderBottom = "none"
    iconsNav.style.borderBottom = "1px solid #3C3C3B"
}



multimediaNav.addEventListener('click', function () {
    modalContent.innerHTML = ""
    modalContent.style.backgroundImage = 'url(../assets/icons/uploadIcon.png)'

    const iconContainer = document.createElement("div")
    iconContainer.className = "fileContainer"

    const textContainer = document.createElement("div")
    textContainer.className = "textContainer"
    const title = document.createElement("p")
    const modalText = document.createElement("p")
    title.innerText = "Subir una Imagen"
    modalText.innerText = "Los archivos de imagenes y videos deben tener un tamaño recomendado de 800px x 482px (aspecto 16:9)."
    const modalText2 = document.createElement("p")
    modalText2.innerText = 'Los videos deben tener un peso menor a 100MB.'


    textContainer.appendChild(title);
    textContainer.appendChild(modalText)
    textContainer.appendChild(modalText2)
    modalContent.appendChild(textContainer);
    modalContent.appendChild(iconContainer)

    const inputFile = document.createElement("input")
    inputFile.type = "file"
    inputFile.id = "media"
    inputFile.className = "inputToSend"
    inputFile.setAttribute("accept", ".png, .mp4")

    iconContainer.appendChild(inputFile)

    const acceptButton = document.createElement("button")
    acceptButton.className = "btnSubmit"
    acceptButton.textContent = "Subir Archivo"
    acceptButton.addEventListener("click", () => {
        outerModal.style.display = "none"
        fileToUpload = inputFile.files[0]
    })

    iconsNav.style.borderBottom = "none"
    multimediaNav.style.borderBottom = "1px solid #3C3C3B"
    iconContainer.appendChild(acceptButton)

})

function createObjectURL(object) {
    return (window.URL) ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object);
}

export default openModal