import makeFetch from './comunications.fetch.js'

async function openModal() {
    if (this.getAttribute('data-cardCreation') == 'true') {
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
    modalText.innerText = "Los imagenes deben tener una resolucion de 400 x 400"

    textContainer.appendChild(title);
    textContainer.appendChild(modalText)
    modalContent.appendChild(textContainer);
    modalContent.appendChild(iconContainer)

    const inputFile = document.createElement("input")
    inputFile.type = "file"
    inputFile.id = "media"
    inputFile.className = "inputToSend"
    inputFile.setAttribute("accept", ".png")

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

            console.log(originalMedia, mediaUrl)
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
    modalText.innerText = "Los imagenes deben tener una resolucion de 400 x 400"

    textContainer.appendChild(title);
    textContainer.appendChild(modalText)
    modalContent.appendChild(textContainer);
    modalContent.appendChild(iconContainer)

    const inputFile = document.createElement("input")
    inputFile.type = "file"
    inputFile.id = "media"
    inputFile.className = "inputToSend"
    inputFile.setAttribute("accept", ".png")

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

export default openModal