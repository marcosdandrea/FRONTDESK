let comPanel
let comunicationsData
let currIndexCom = 0

document.addEventListener('DOMContentLoaded', async ()=>{
    comPanel = document.querySelector(".comunications")
    comunicationsData = await getComunications()
    comunicationsData.config.comunication_interval *= 1000
    comunicationsData.config.comunication_duration *= 1000

    const header = document.getElementsByClassName("header")[0]
    const footer = document.getElementsByClassName("footer")[0]

    header.textContent = comunicationsData.config.title
    footer.textContent = comunicationsData.config.footer

    setupTimers()
})

async function getComunications(){
    try{
        const res = await fetch("http://localhost:3100/comunications")
        return await res.json()
    }catch(err){
        console.log (err)
    }
}

function setupComunication(data){
    console.log ("setting up comunications")
    if (!data) return
    const title = document.getElementsByClassName("title")[0]
    const media = document.getElementsByClassName("media")[0]
    const paragraph = document.getElementsByClassName("paragraph")[0]
    title.innerHTML = data.title
    const mediaURL = "url('../../media/comunications/" + data.media.filename + "')"
    media.style.backgroundImage = mediaURL
    paragraph.innerHTML = data.paragraph
}

function setupTimers(){
    setTimeout(showNextComunication, parseInt(comunicationsData.config.comunication_interval))
}

function hideComunication(){
    console.log ("hidding comunications")
    comPanel.style.opacity = 0;
    currIndexCom++
    if (currIndexCom > comunicationsData.comunications.length) currIndexCom = 0;
    setupTimers()
}

function showNextComunication(){
    setupComunication(comunicationsData.comunications[currIndexCom])
    comPanel.style.opacity = 1;
    setTimeout(hideComunication, parseInt(comunicationsData.config.comunication_duration))
}

function showSpecificComunication(id){
    const index = comunicationsData.comunications.findIndex(entry => entry.id == id)
    if (index == -1) return
    setupComunication(comunicationsData.comunications[index])
    comPanel.style.opacity = 1;
    setTimeout(hideComunication, parseInt(comunicationsData.config.comunication_duration))
}

