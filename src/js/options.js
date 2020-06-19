if(document.getElementById("application")){
    var application = document.getElementById('application')
}

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

var accessibility = document.getElementById('accessibility')
console.log(accessibility.colorblindness.value)

var fontcontrol = document.getElementById('graphs')
console.log(fontcontrol.fontsize.value)

fontcontrol.onchange = function(event){
    let fontSize = event.target.value
    if (fontSize == 12){
        console.log('smaller')
        application.style.fontSize = '14px'

    } else if (fontSize == 14){
        console.log('medium')
        application.style.fontSize ='16px'

    } else if (fontSize == 16){
        console.log('bigger')
        application.style.fontSize = '18px'

    }
}

accessibility.onchange = function(event){
    let targetValue = event.target.value
    if (targetValue == 1){
        console.log("Green")
        application.style.fill = 'purple'
        application.style.color = 'purple'
    } else if(targetValue == 2){
        console.log("Red")
        application.style.fill = 'red'
        application.style.color = 'red'
    } else if(targetValue == 3){
        console.log("blue")
        application.style.fill = 'purple'
        application.style.color = 'purple'
    } else if (targetValue == 0){
        console.log('no blind')
        application.style.fill = 'black'
        application.style.color = 'black'
    } else {
        console.log('no value read')
    }
}


// let tree = document.getElementsByClassName('tree').item(0)
// console.log(tree)
