let comPanel
let comunications
let configurations
let currIndexCom = 0
let showingComunication = false

document.addEventListener('DOMContentLoaded', async () => {
    refreshData()
})

async function refreshData() {
    setInterval(async () => {
        comPanel = document.querySelector(".comunications")
        configurations = await getData("http://localhost:3100/comunications/config")

        configurations.comunication_interval *= 1000
        configurations.comunication_duration *= 1000

        const header = document.getElementsByClassName("header")[0]
        const footer = document.getElementsByClassName("footer")[0]

        header.innerHTML = configurations.title
        footer.innerHTML = configurations.footer

        comunications = await getData("http://localhost:3100/comunications")

        setupTimers()
    }, 5000)
}

async function getData(URL) {
    try {
        const res = await fetch(URL)
        return await res.json()
    } catch (err) {
        console.log(err)
    }
}

function setupComunication(data) {
    if (!data) return
    const title = document.getElementsByClassName("title")[0]
    const media = document.getElementsByClassName("media")[0]
    const paragraph = document.getElementsByClassName("paragraph")[0]
    title.innerHTML = data.title

    const mediaFilename = data.media.filename
    const mediaURL = "url('../../media/comunications/" + mediaFilename + "')"
    const mediaExtension = mediaFilename.split(".").pop()
    media.innerHTML = ""
    if (mediaExtension == "mp4") {
        const videoPlayer = document.createElement("video")
        videoPlayer.src = "../../media/comunications/" + mediaFilename
        videoPlayer.muted = true
        videoPlayer.autoplay = true
        videoPlayer.loop = true
        videoPlayer.play()
        media.appendChild(videoPlayer)
    } else {
        media.style.backgroundImage = mediaURL
    }

    paragraph.innerHTML = data.paragraph
}

let triggerComunication
function setupTimers() {
    if (comunications.length > 0 && !triggerComunication)
        triggerComunication = setTimeout(showNextComunication, parseInt(configurations.comunication_interval))
}

function hideComunication() {
    showingComunication = 0
    comPanel.style.opacity = 0;
    currIndexCom++
    if (currIndexCom > comunications.length-1) currIndexCom = 0;
    triggerComunication = undefined
    setupTimers()
}

function showNextComunication() {
    setupComunication(comunications[currIndexCom])
    comPanel.style.opacity = 1;
    showingComunication = 1
    setTimeout(hideComunication, parseInt(configurations.comunication_duration))
}

function showSpecificComunication(id) {
    const index = comunications.findIndex(entry => entry.id == id)
    if (index == -1) return
    console.log ("Showing Comunication " + id)
    setupComunication(comunications[index])
    comPanel.style.opacity = 1;
    setTimeout(hideComunication, parseInt(configurations.comunication_duration))
}

