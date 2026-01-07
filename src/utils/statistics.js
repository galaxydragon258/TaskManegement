const Task = require('../model/Task');
const mongoose = require('mongoose');


const getStatisctics = async(req,res)=>{
        try{
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

        ])


     
            Data:priority   const totalTask = await Task.countDocuments({user:userId})

        res.status(200).json({
            status:true,
        })


        const overdue = await Task.countDocuments({
            user:userId,
            dueDate:{$lt: new Date},
            status:{$ne: Completed}

        })


        const format = {
            Status:{
                pending:0,
                In_Progress:0,
                Completed   :0
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
    }
    catch(error){
        res.status(400).json({
            succeess:false,
            Message:error.message

        })
    }
          
}

module.exports = {getStatisctics}
