let comPanel
let comunications
let configurations
let currIndexCom = 0
let showingComunication = false
const serverURL = "http://192.168.11.100"

document.addEventListener('DOMContentLoaded', async () => {
    refreshData()
})

async function refreshData() {
    setInterval(async () => {
        comPanel = document.querySelector(".comunications")
        configurations = await getData(`${serverURL}:3100/comunications/config`)

        configurations.comunication_interval *= 1000
        configurations.comunication_duration *= 1000

        const header = document.getElementsByClassName("header")[0]
        const footer = document.getElementsByClassName("footer")[0]

        header.innerHTML = configurations.title
        footer.innerHTML = configurations.footer

        const comunicationsRawData = await getData(`${serverURL}:3100/comunications`)

        comunications = comunicationsRawData.filter(entry => {
            const today = new Date()
            const expiration = new Date(entry.comunicationExpiration)
            if (today >= expiration) {
                console.log ("comunication id", entry.id, "expirated")
                return
            }
            return entry
        })

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
    return new Promise( async(resolve, reject) => {
        if (!data) reject()
        const title = document.getElementsByClassName("title")[0]
        const media = document.getElementsByClassName("media")[0]
        const paragraph = document.getElementsByClassName("paragraph")[0]
        title.innerHTML = data.title

        const mediaFilename = data.media.filename
        let mediaURL = undefined
        if (mediaFilename.includes("/")) {
            mediaURL = "url('" + mediaFilename + "')"
        } else {
            mediaURL = "url('../../media/comunications/" + mediaFilename + "')"
        }
        const mediaExtension = mediaFilename.split(".").pop()
        media.innerHTML = ""
        paragraph.innerHTML = data.paragraph
        const showNewBadgeUntil = new Date(data.showNewBadgeUntil)
        const today = new Date()

        if (today > showNewBadgeUntil) {
            newBadge.style.display = "none"
        } else {
            newBadge.style.display = "block"
        }

        if (mediaExtension == "mp4") {
                const videoPlayer = document.createElement("video")
                videoPlayer.src = "../../media/comunications/" + mediaFilename
                videoPlayer.muted = true
                videoPlayer.autoplay = true
                videoPlayer.loop = true
                await videoPlayer.play()
                media.appendChild(videoPlayer)
                resolve()
        } else {
            media.style.backgroundImage = mediaURL
            resolve()
        }


    })
}

let triggerComunication
function setupTimers() {
    if (comunications?.length > 0 && !triggerComunication)
        triggerComunication = setTimeout(showNextComunication, parseInt(configurations.comunication_interval))
}

function hideComunication() {
    showingComunication = 0
    comPanel.style.opacity = 0;
    currIndexCom++
    if (currIndexCom > comunications.length - 1) currIndexCom = 0;
    triggerComunication = undefined
    setupTimers()
}

let hideTimeout = undefined
async function showNextComunication() {
    console.log ("Showing comunication id", comunications[currIndexCom].id)
    await setupComunication(comunications[currIndexCom])
    comPanel.style.opacity = 1;
    showingComunication = 1
    hideTimeout = setTimeout(hideComunication, parseInt(configurations.comunication_duration))
}

async function showSpecificComunication(id) {
    const index = comunications.findIndex(entry => entry.id == id)
    if (index == -1) return
    console.log("Showing Comunication " + id)
    await setupComunication(comunications[index])
    comPanel.style.opacity = 1;
    clearTimeout(hideTimeout)
    hideTimeout = setTimeout(hideComunication, parseInt(configurations.comunication_duration))
}

