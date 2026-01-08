import { redirectIfAuthenticated,requireAuth,login} from "./auth";
const loginForm = document.getElementById('loginForm');
const email = document.getElementById('email');
const password = document.getElementById('password');
const loginButton = document.getElementById('submit');


document.addEventListener('DOMContentLoaded',()=>{
    redirectIfAuthenticated();
    ///check if there is data in the localStorage para hinde na mag login si user
    
})


function validateForm (){
    let isValid = true
}