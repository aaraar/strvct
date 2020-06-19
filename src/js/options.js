if (document.getElementById("options")){
    let optionsButton = document.getElementById("options")
    optionsButton.onclick = function(){
        let optionsMenu = document.getElementById("optionsMenu")
        optionsMenu.classList.toggle("options")
    };
};

if (document.getElementById('confirmation')){
    let confirmationButton = document.getElementById('confirmation')
    confirmationButton.addEventListener("click", function(event){
        event.preventDefault()
        optionsMenu.classList.toggle("options")
    })
}


// var accessibility = document.getElementById('accessibility')
// console.log(accessibility.colorblindness.value)

// accessibility.onchange = function(event){
//     console.log(event)
// }


