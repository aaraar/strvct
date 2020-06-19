export function menuOptions(){
    const application = document.getElementById("application") ? document.getElementById("application") : false


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

    const accessibility = document.getElementById('accessibility')
    console.log(accessibility.colorblindness.value)

    const fontcontrol = document.getElementById('graphs')
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

            application.style.fill = 'purple'
            application.style.color = 'purple'
        } else if(targetValue == 2){

            application.style.fill = 'red'
            application.style.color = 'red'
        } else if(targetValue == 3){

            application.style.fill = 'purple'
            application.style.color = 'purple'
        } else if (targetValue == 0){

            application.style.fill = 'black'
            application.style.color = 'black'
        }
    }
}
