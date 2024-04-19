const Task = require('../models/task');
const validator = require('validator');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60 * 60 });


exports.getAllTasks = async (req, res) => {
  try {
    let tasks = [];
    if (cache.has("tasks")) {
      console.log("Tasks from Cache!")
      tasks = cache.get("tasks");
    } else {
      console.log("Tasks from DB!")
      tasks = await Task.find();
      cache.set('tasks', tasks);
    }
    res.render('home', { tasks });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.addTask = async (req, res) => {
  const { title } = req.body;
  if (validator.isEmpty(title)) {
    res.status(400).send(`Title cannot be null!`);
  }
  try {
    const task = new Task({ title });
    await task.save();
    cache.del('tasks');
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  console.log("deleteTask", { id });
  try {
    await Task.findByIdAndDelete(id);
    cache.del('tasks');
    res.send({ "message": "Successfully deleted!" })
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  try {
    const task = await Task.findById(id);
    task.completed = completed ? completed : false;
    await task.save();
    cache.del('tasks');
    res.send({ "message": "Successfully updated!" })
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
