const express = require('express');
const app = express();
const router = express.Router();
const{
    getTask,getSingleTask,createTask,updateTask,deleteTask
} = require('../controler/taskController');
const {protect} = require('../utils/jwt')
const {getStatisctics} = require('../utils/statistics')


//lahat route for updatinTak,

router.use(protect);


router.route('/')
.get(getTask)
.post(createTask)

router.route('/test')
.get(getStatisctics);



router.route('/:id')
.get(getSingleTask)
.put(updateTask)
.delete(deleteTask);


module.exports = {router};

