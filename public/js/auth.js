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
            const response  = await apiRequest('http://localhost:3000/login',{
                method:'POST',
                data:userData

            });

            console.log(response)


            if(response.success && response.token){
                setToken(response.token)
                setUser(response.user)
                console.log("Log in success")
            }

            return reponse;


        }
        catch(error){
            console.log(`Login Error${error.message}`);
            throw error
        }
 }

 
 export const  logout = async()=>{
    removeToken();
    window.location.href='../public/index.html'

 }

 export const isAuthenticated = async()=>{
    const token = getToken();
    const user = getUser();


    const authenticated  = !!(token&&user);

    const result = authenticated ? "User Authenticated":"User not authenticated"
    console.log(result)

    return authenticated;

 }

export const requireAuth = () =>{

    if(!isAuthenticated){
        console.log("not authenticated")
        window.location.href ='../public/login.html'
        return false
    }
    return true

}

export const redirectIfAuthenticated = ()=>{
    if(isAuthenticated){
        window.location.href ='../public/dashboard.html'
    }
}

export const validatePassword = (password) =>{
    return password.length > 6

}


