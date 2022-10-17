import makeFetch from './comunications.fetch.js'

function openModal() {

    console.log('Opening modal')
    const selectMedia = document.querySelectorAll('.cardMedia')

    for (let i = 0; i < selectMedia.length; i++) {

        selectMedia[i].addEventListener('click', async (event) => {
            //console.log(outerModal)
            const url = "http://localhost:3100/assets/comunications/icons"
            const options = {
                method: "GET"
            }
            const mediaRepository = await makeFetch(url, options)
            printInModal(mediaRepository)
            outerModal.style.display = 'flex'
        })

        navCloseModal.addEventListener('click', () => {
            outerModal.style.display = 'none'
        })

    }
}

function printInModal(modalMedia) {

    modalContent.innerHTML = "";

    const iconContainer = document.createElement("div")
    iconContainer.className = "iconContainer"
    modalContent.appendChild(iconContainer)

    modalMedia.forEach(mediaElement => {

        const formatedMedia = mediaElement.replace(/\\/g, "/")
        const iconButton = document.createElement("img")
        const mediaUrl = `http://localhost:3100/${formatedMedia}`
        iconButton.src = mediaUrl

        iconButton.addEventListener('click', () => {
            comunications.at(-1).media.filename = mediaUrl
            comunications.at(-1).media.originalName = mediaUrl.split("/").pop()
            outerModal.style.display = "none"
            console.log(mediaUrl)
        })

        iconContainer.appendChild(iconButton)
    });

}

/* TOGGLE SECTION IN MODAL NAV */
iconsNav.addEventListener('click', async (event) => {
    const url = "http://localhost:3100/assets/comunications/icons"
    const options = {
        method: "GET"
    }
    const mediaRepository = await makeFetch(url, options)
    printInModal(mediaRepository)
    multimediaNav.style.borderBottom = "none"
    iconsNav.style.borderBottom = "1px solid #3C3C3B"
})



multimediaNav.addEventListener('click', function () {
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