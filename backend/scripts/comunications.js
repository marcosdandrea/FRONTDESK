
async function getComunications() {
   
    try{
        const res = await fetch("http://localhost:3100/comunications")
        const parsedReq = await res.json();
        printComunications(parsedReq)
    }catch(error){
        console.log(error);
    }
    
}

getComunications()

const comunicationsPanel = document.getElementsByClassName("comunicationsPanel")[0]

function printComunications(data){
    console.log("Print this",data)
    let comunications = data.comunications

    comunications.forEach(comunication => {
        console.log(comunication)

        let comunicationBody = `
        <div>
            <p>${comunication.title}</p>
            <p>${comunication.paragraph}</p>
            <img src="${comunication.media}" alt="Test">
        </div>
        `
        comunicationsPanel.innerHTML = comunicationBody

    });



}

/* fetch("http://localhost:3100/comunications")
.then(response => response.json())
.then(data => console.log("This is my data:",data)); */