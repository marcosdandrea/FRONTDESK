const globalErrors = []
let errorIndex = 0;

setInterval(() => {
    if (globalErrors.length>0){
        errorDebugger.style.display = "flex"
        if (errorIndex > globalErrors.length) errorIndex = 0;
        errorDebugger.innerText = globalErrors[errorIndex]
        errorIndex += 1;
    }else{
        errorDebugger.style.display = "none"
    }
}, 15000);