
import {apiRequest} from './api.js'

export const getTask =  async(filters={}) =>{

        console.log('📋 Fetching tasks with filters:', filters);


        try{
                const queryParam = new URLSearchParams();


               Object.keys(filters).forEach(key =>{
                if(filters[key] !== undefined && filters[key] !==''){
                queryParam.append(key, filters[key])

                }

               })

               const queryString  = queryParam.toString();

               const endpoint = `tasks/${queryString ? '?' + queryString : ''}`;
        

               //Make api;


               const response = await apiRequest(endpoint,{
               method:'GET'
               })
               

               if(!response.success){
                console.log('Success failed')
               }

               console.log('Task succefully retrived')
               return response
               
        }
        catch(error){
                console.log(error.message)
        }


}


const  getTaskByID = async(taskId) =>{
        console.log('Getting task by ID',taskId)
        try{    
        
               const response  = await apiRequest(`tasks/${taskId}`,{
                method:'GET'
               })


               if(!success){
                console.log("Task not found")
                
               }
               
               console.log('Task Found');
               return response
        }
        catch(error){
                console.log(error.message)
        }
        
}

export const createTask = async (taskData) =>{
        console.log('Task DatA')

        try{

        if(taskData.title && taskData.title.trim() ===''){
                throw new Error("Title Is Required");
        }


        const response = await apiRequest(`tasks/`,{
                method:'POST',
                data:taskData

        })

        if(!response.success){
                return response;
        }

         console.log("Data send to backend");
        return response; 
        }
          catch(error){
                console.log(console.error.message);
                throw error;        
        }

}

export const updateTask = async (taskId,Update) =>{
        console.log(`Updating Task for ${taskId} and the updates will be ${Update}`);

        console.log(taskId)


        try{
                
                const response = await apiRequest(`tasks/${taskId}`,{
                        method:'PUT',
                        data: Update
                })
                if(!response.success){
                        console.log('Task update unsuccesfull')
                        return
                }

                console.log('update task succesfull')
                return response;

        }
        catch(error){
                console.log(error.message)


        }
}

export const deleteTask = async(taskID)=>{
        try{
                console.log(`This tast id:${taskID} are being deleted`);


                const response = await apiRequest(`tasks/${taskID}`,{
                        method:'DELETE'
                })

                if(!response.success){
                        console.log('failed to delete the task')
                        
                }
                console.log("TASK DELETED");
                return response             
                
        }
        catch(error){
                console.log(error.message);
        }
}



export const getStatisctics = async () =>{
        console.log('Getting statistic from the database');


        try{
                
                const stats = await apiRequest('tasks/stats',{
                        method:'GET'
                })

                if(!stats.success){
                        console.log('failed to get data')
                        return
                }

                return stats



        }catch(error){
                console.log(`Error Message${error.message}`)
        }


}

export const validateTask = async(taskData)=>{
        
        const error = [];

        if(!taskData.title && taskData.title.trim()===''){
        error.push('Title is required');
        }else if(taskData.title.length > 200){
                error.push('Title must be less than 200 letters')
        }

        if (taskData.description && taskData.description.length > 1000) {
        error.push('Description must be less than 1000 characters');
    }



    if(taskData.dueDate){
        const dueDate =  new Date(task.dueDate);
        const today = new Date();
        today.setHours(0,0,0,0);


        if(dueDate < today){
                error.push('Due data cannot be in the past');
        }
    }
    
    return {
        valid: error.length === 0,
        errors: error
    };

};



