const btnLogin = document.getElementById("btnLogin");


btnLogin.onclick = function () {

    postData();
      
}

async function postData() {
    url = '/login'
    const username = document.getElementById("userInput").value;
    const password = document.getElementById("userPass").value;
    let baseURL = window.location.href
    baseURL = baseURL.substring(0, baseURL.length-1)
    fetch(baseURL  + '/login/?username=' + username + '&password=' + password)
        .catch(err => console.log(err))
        .then( response => response.json())
        .then( async (response) => {
            if (response.status.includes("[ERR]")){
                await Swal.fire({
                    title: 'Acceso no permitido',
                    text: response.status,
                    icon: 'warning',
                    confirmButtonText: 'Aceptar'
                })
                return;
            }

            location.href = response.currentUser.NewPanelCodedName
            console.log (response)
    } );
  }