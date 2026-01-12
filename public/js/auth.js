import {getToken,setToken,removeToken,apiRequest,getUser,setUser} from './api.js'

 export const register = async(userData)=>{
        console.log(`Creating Account for ${userData}`);

        try{
            //request sa register endpoint
            const response = await apiRequest('http://localhost:3000/register',{
                method:'POST',
                data:userData

            });

            console.log('Registration Response',response);
            
            if(response.success && token){
                setToken(response.token)
                setUser(response.user)
                console.log('Registration Completed');
            }

            return response;
        }
        catch(error){
            console.log(error.message)
            throw error;
        }

 }


 export const login = async (userData)=>{
        console.log(`Logging in for${userData}`);

        try{
            const response  = await apiRequest('login',{
                method:'POST',
                data:userData

            });

            console.log(response)


            if(response.success && response.token){
                setToken(response.token)
                setUser(response.user.id)
                console.log("Log in success")
            }

            return response;


        }
        catch(error){
            console.log(`Login Error${error.message}`);
            throw error
        }
 }

 
 export const  logout = async()=>{
    removeToken();
    window.location.href='../../index.html'

 }

        const  isAuthenticated = ()=>{
    const token = getToken();
    const user = getUser();
    return !!(token&&user);
 }

export const requireAuth = () =>{

    if(!isAuthenticated()){
        console.log("not authenticated")
        window.location.href ='../public/login.html'
        return false
    }
    return true

}

export const redirectIfAuthenticated = ()=>{
    if(isAuthenticated()){
        
        window.location.href ='../public/dashboard.html'     
    }
    console.log(isAuthenticated())
}

export const validatePassword = (password) =>{
    return password.length > 6

}


export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};