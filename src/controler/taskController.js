const Task = require('../model/Task')
const User = require ('../model/User');


const getTask = async(req,res)=>{
    try{
        
        const task = await Task.find({user:req.user.id});

        res.status(200).json({
            success: true,
            count: task.length,
            data:task
        });
    }
    catch(error){
        console.error(`Error${error.message}`)
        res.status(500).json({
        success: false,
        error: error.message
        });
    }      
}

const getSingleTask = async(req,res)=>{
    try{

        const task = await Task.findOne({
            _id:req.params.id,
            user: req.user.id

        })

        if (!task) {
        return res.status(404).json({
            success: false,
            error: 'Task not found'
        });
        }

        res.status(200).json({
        success: true,
        data: task
            });
         
    }
    catch (error) {
        res.status(500).json({
        success: false,
        error: 'Server Error'
    });
 
}
}
 

const createTask = async(req,res)=>{
    try{
        
        req.body.user  = req.user.id;
        console.log(req.user.id)
        console.log(req.body.user)
        console.log(req.body)
        const task = await Task.create(req.body);
        console.log(task)

        res.status(201).json({
        success: true,
        data: task
        });
       
    }catch(error){
        if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }

        res.status(500).json({
        success: false,
        error: error.message
        });
    }
}

const updateTask = async(req,res)=>{
    

            try{
                let task = await Task.findOne({
                    _id:req.params.id,
                    user:req.user.id
                })


                console.log(`updateTask${task}`)
                if (!task) {
            return res.status(404).json({
                success: false,
                error: 'Task not found'
            });
            }

            task  = await Task.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new:true,
                    runValidators:true

                }
            );

            res.status(200).json({
                success:true,
                data:task
            })
            
            
            }
        catch (error) {
            if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map(val => val.message);
                return res.status(400).json({
                    success: false,
                    error: messages
                });
                }
                res.status(500).json({
                success: false,
                error: 'Server Error'
                });
            }
}

const deleteTask = async (req,res)=>{
    try{
        let task = await Task.findOne({
            _id:req.params.id,
            user:req.user.id
        })


        await task.deleteOne();
        res.status(200).json({
        success: true,
        data: {}
        });
    } catch (error) {
        res.status(500).json({
        success: false,
        error: error.message
        });

    }
    
}

module.exports = {getTask,getSingleTask,createTask,updateTask,deleteTask}
