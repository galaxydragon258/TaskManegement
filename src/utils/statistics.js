const Task = require('../model/Task');
const mongoose = require('mongoose');


const getStatisctics = async(req,res)=>{
        try{

        console.log(req.params)
        const userId = req.user._id;


        const status = await Task.aggregate([
            {$match:{
                user:userId
            }},
            {$group:{
                _id:'$status',
                count:{$sum: 1}
            }}
            
        ])  


        const  priority = await Task.aggregate([
        {$match:{
            user:userId
        }},

        {$group:{
            _id:'$priority',
            count:{$sum:1}
        }}

        ]);


     
        const totalTask = await Task.countDocuments({user:userId})

        console.log("totalTask")

        


        const overdue = await Task.countDocuments({
            user:userId,
            dueDate:{$lt: new Date},
            status:{$ne: "completed"}

        })
            console.log("overdue")

        


        const format = {
            Status:{
                pending:0,
                in_progress:0,
                completed :0
            },


            Priority:{
                low:0,
                medium:0,
                high:0
            },

            overview:{
                tasks:totalTask,
                overDue:overdue
            }

        }

    
        
        status.forEach(stats=>{
            if(format.Status.hasOwnProperty(stats._id)){
                format.Status[stats._id] = stats.count
            }
        })///emd
    

        priority.forEach(prio=>{

            if(format.Priority.hasOwnProperty(prio._id)){
                format.Priority[prio._id] = prio.count
            }
        })
        
            console.log(format)


         res.status(200).json({
                success:true,
                data:format

        })


    }
    catch(error){
        res.status(400).json({
            succeess:false,
            Message:error.message

        })
    }
          
}

module.exports = {getStatisctics}
