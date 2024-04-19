const express = require('express');

const taskController = require('../controller/TaskController');

const router = express.Router();

router.get("/", taskController.getAllTasks);
router.post("/add", taskController.addTask);
router.delete('/delete/:id', taskController.deleteTask);
router.put('/update/:id', taskController.updateTask);

module.exports = router;