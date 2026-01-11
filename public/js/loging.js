import { redirectIfAuthenticated,requireAuth,login,validateEmail, validatePassword} from "./auth.js";


const loginForm = document.getElementById('loginForm');
const email = document.getElementById('email');
const password = document.getElementById('password');
const loginButton = document.getElementById('submit');
const messageDiv = document.getElementById('message');



document.addEventListener('DOMContentLoaded',()=>{
    redirectIfAuthenticated();

    ///check if there is data in the localStorage para hinde na mag login si user
    
})


function validateFrom (){
    let isValid = true;



    if(!email.value.trim()){
        console.log("Please input value")
        isValid = false;
    }

   else if(!validateEmail(email.value)){
        console.log('Please enter valid email')
        isValid = false;
    }
    
    else if(!password.value.trim()){
        console.log('Please input value');
        isValid = false;
    }

    else if(!validatePassword(password.value)){
        console.log("Password must be greater than 6")
    }

    return isValid;
}

loginForm.addEventListener('submit',async(e)=>{
    
    e.preventDefault();

    if(!validateFrom){
        return

    }


    const formData = {
        email:email.value.trim(),
        password:password.value
    }

    try{    

        const response = await login(formData);

        if(response.success){
            window.location.href ='../public/dashboard.html'
        }
    


    }
    catch(error){
        console.log(`Login Error ${error.message}`)
    }

})