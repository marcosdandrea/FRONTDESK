import makeFetch from './comunications.fetch.js'

configFooter.addEventListener("focus", (e)=>{switchInputEditMode(e, "html")})
configFooter.addEventListener("blur", (e)=>{switchInputEditMode(e, "text")})
configTitle.addEventListener("focus", (e)=>{switchInputEditMode(e, "html")})
configTitle.addEventListener("blur", (e)=>{switchInputEditMode(e, "text")})
comunication_duration.addEventListener("blur", sendConfig)
comunication_interval.addEventListener("blur", sendConfig)

function printConfig(configData) {

    configTitle.innerHTML = configData.title
    configFooter.innerHTML = configData.footer
    comunication_duration.value = configData.comunication_duration
    comunication_interval.value = configData.comunication_interval

}

let content
function switchInputEditMode(e, mode){

    //edit mode
    if (mode == "html"){
        content = e.target.innerHTML
        e.target.textContent = content
        e.target.classList.add("process")

    //view mode
    }else{
        e.target.innerHTML = e.target.textContent
        e.target.classList.remove("process")
        sendConfig()
    }
}

async function getConfig() {

    try {
        const configs = await makeFetch("/comunications/config", 3100)
        return configs
    } catch (error) {
        console.log(error);
    }

}

async function sendConfig() {
    const title = configTitle.innerHTML
    const footer = configFooter.innerHTML
    const comunication_duration_value = comunication_duration.value
    const comunication_interval_value = comunication_interval.value

    const data = {
        title,
        footer,
        comunication_duration: comunication_duration_value,
        comunication_interval: comunication_interval_value
    }

    const options = {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    }

    try{
        await fetch("http://localhost:3100/comunications/config", options)
    }catch(err){
        console.log ("Error saving configuration: ", err.message)
    }

}

export { getConfig, printConfig }