//SERVICEE LAYER DEDICATE TO HANDLE COMMUNICATION SA BACKEND

const API_BASE_URL = 'https://task-manegement-seven.vercel.app/';

//Token Management/
const getToken = ()=>{
    return localStorage.getItem('taskflow_token')
};

const setToken = (token) =>{
    localStorage.setItem('taskflow_token',token)

};

const setUser = (user) =>{
    localStorage.setItem('taskflow_user',user)
}


const getUser = () => {
    return localStorage.getItem('taskflow_user')
}

const removeToken = () => {
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
};

///APII REQUEST


const apiRequest = async(endpoint,options={})=>{

    const {method = 'GET', data = 'nul'} = options;

    const url = `${API_BASE_URL}${endpoint}`;


    const token = getToken();

    const header = {
        'Content-type':'application/json'
    }

    

    if(token){
        header['Authorization'] = `Bearer ${token}`;
    }
    //contnue

    const config = {
            method:method.toUpperCase(),
            headers:header,
            
    }


    if(data && ['POST','PUT','PATCH'].includes(config.method)){
        config.body = JSON.stringify(data)
    }   
 
    try{

    console.log(`Creating ${config.method} request to: ${url}`);

    console.log(url,config);

    const response = await fetch(url,config);
    
    if(response.status === 204){
        return null
    }

    const result = await response.json();

    console.log(result)

    if(!result.success){

        if(response.status === 401 ){
            removeToken();
            window.location.href='../public/login.html'
            throw new Error('Session expired. Please login again.');
            }   


            throw new Error(result.error || result.message || `HTTP ${response.status}`);    
        }



        console.log(` Request successful:`, result);
        return result;
    }
    catch(error){
        console.error(`API Request Failed:${error}`)  
        console.log(error.message)
        throw error
    }
   
}

export {
    getToken,
    setToken,
    removeToken,
    apiRequest,
    getUser,
    setUser
}


