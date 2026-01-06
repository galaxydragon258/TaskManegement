const mongoose = require('mongoose');


const taskSchema = new mongoose.Schema({
    title: {
    type: String,
    required: [true, 'Please add a task title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  status:{
    type:String,
    enum:['pending','In-Progress','Completed'],
    default:'pending'

  },
  priority:{
    type:String,
    enum:['low','medium','high'],
    default:'low'
  },
  dueDate:{
    type:Date
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true

  },
   createdAt: {
    type: Date,
    default: Date.now
  }

})

module.exports = mongoose.model('Task', taskSchema);