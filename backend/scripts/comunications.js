
async function getComunications() {

    try {
        const res = await fetch("http://localhost:3100/comunications")
        const parsedReq = await res.json();
        printComunications(parsedReq)
    } catch (error) {
        console.log(error);
    }

}

getComunications()

/* PRINT DATA */

const comunicationsPanel = document.getElementsByClassName("comunicationsPanel")[0]

function printComunications(data) {
    console.log("Print this", data)

    comunicationsPanel.innerHTML ="";
    

    data.forEach(comunication => {

        let cardDiv = document.createElement("div");
       

        let comunicationBody = `
        <div class="comunicationCard" id="${comunication.id}">
        <div>01</div>
            <div class="comunicationMedia">
                <label for="media">
                    <img src="./assets/images/selectMedia.png" alt="Select media"/>
                </label>
                <input type="file" id="media" name="media" class="inputToSend">
            </div>

            <div class="comunicationInputs">
                <input type="text" id="title" name="title" class="inputToSend" value="${comunication.title}">
                <input type="textarea" id="paragraph" name="paragraph" class="inputToSend" value="${comunication.paragraph}">

                <div class="comunicationDate">
                    <input type="text" id="show_new_badge_until" name="show_new_badge_until" class="inputToSend" value="${comunication.show_new_badge_until}">
                    <button class="preview">Previsualizar</button>
                </div>
                
            </div>
            <button class="deleteButton" id="${comunication.id}">X</button>
        </div>
        `
        cardDiv.innerHTML = comunicationBody;
        comunicationsPanel.appendChild(cardDiv)
     
    });

    /* Consultar con Marcos */
    for (let i = 0; i < comunicationInputs.length; i++) {
        comunicationInputs[i].addEventListener('change', waitToSend)
    }
    deleteComunication()
}


/* DATA SENDER */

const comunicationInputs = document.getElementsByClassName('inputToSend')

let sender;
const delayToSend = 2000;

function waitToSend() {
   

    if (sender) clearTimeout(sender);
    sender = setTimeout(sendToServer(this), delayToSend)

}


function sendToServer(selectedInput) {

    let inputsToSend = selectedInput.parentNode.parentNode

    let title = inputsToSend.querySelector('#title').value
    let paragraph = inputsToSend.querySelector('#paragraph').value
    let show_new_badge_until =inputsToSend.querySelector('#show_new_badge_until').value
    let id = inputsToSend.id

  const data = { title,paragraph, show_new_badge_until, id }
    
    const options = {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    }

    fetch("http://localhost:3100/comunications", options)
    
   

    console.log("I changed")



}

const addComunication = document.getElementById('addComunication')
const addComunicationModal = document.getElementsByClassName('addComunicationModal')[0]

addComunication.addEventListener('click',function(e) {
    console.log("Click")
    addComunicationModal.style.display = 'flex'
})


/* DELETE COMUNICATION */

function deleteComunication(){
    const deleteButton = document.getElementsByClassName('deleteButton')
    
    for (let i = 0; i < deleteButton.length; i++) {

        deleteButton[i].addEventListener('click', function(e){
         
            const id = e.target.id
            const data = { id }

            const options = {
                method: "DELETE",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            }

            fetch("http://localhost:3100/comunications",options)
            .then(getComunications()) 


        })
        
    }
}



/* EXTRAS */


/* fetch("http://localhost:3100/comunications")
.then(response => response.json())
.then(data => console.log("This is my data:",data)); */


/* const data = { username: 'example' };

fetch('https://example.com/profile', {
    method: 'POST', // or 'PUT'
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
})
    .then((response) => response.json())
    .then((data) => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
 */