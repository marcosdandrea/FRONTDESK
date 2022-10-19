//BINDS
const configInputs = document.getElementsByClassName('configInputs')
const configTitle = document.getElementById('configTitle');
const configFooter = document.getElementById('configFooter');
const comunication_duration = document.getElementById('comunication_duration');
const comunication_interval = document.getElementById('comunication_interval');
const configId = document.getElementsByClassName('comunicationsConfig')[0]
const comunicationsPanel = document.getElementsByClassName("comunicationsPanel")[0]
const comunicationInputs = document.getElementsByClassName('inputToSend')
const outerModal = document.getElementById('comunicationsModal')
const modalContent = document.getElementsByClassName("modalContent")[0]
const iconsNav = document.getElementById('iconsNav')
const multimediaNav = document.getElementById('multimediaNav')
const navCloseModal = document.getElementsByClassName('navCloseModal')[0]

//GLOBAL VARIABLES
let sender;
const delayToSend = 2000;
let comunications = []
let configs = []
let fileToUpload = undefined
let creatingComunication = false;
let tempData = undefined;
let currentCardImageEdition = undefined


//EVENT LISTENERS

navCloseModal.addEventListener('click', () => {
    outerModal.style.display = 'none'
})
