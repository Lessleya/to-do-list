const express = require("express");
const Todo = require("../models/todo");



const router = express.Router();



router.post("", (req, res, next) => {

  const todo = new Todo({

    title: req.body.title,

    content: req.body.content

  });

  todo.save().then(createdTodo => {

    res.status(201).json({

      message: "Todo added successfully",

      todoId: createdTodo._id

    });

  });

});



router.put("/:id", (req, res, next) => {

  const todo = new Todo({

    _id: req.body.id,

    title: req.body.title,

    content: req.body.content

  });

  Todo.updateOne({ _id: req.params.id }, todo).then(result => {

    res.status(200).json({ message: "Update successful!" });

  });

});

router.get("", (req, res, next) => {

    Todo.find().then(documents => {
  
      res.status(200).json({
  
        message: "Todos fetched successfully!",
  
        todos: documents
  
      });
  
    });
  
  });
  
  
  
  router.get("/:id", (req, res, next) => {
  
    Todo.findById(req.params.id).then(todo => {
  
      if (todo) {
  
        res.status(200).json(todo);
  
      } else {
  
        res.status(404).json({ message: "Todo not found!" });
  
      }
  
    });
  
  });
  
  
  
  router.delete("/:id", (req, res, next) => {
  
    Todo.deleteOne({ _id: req.params.id }).then(result => {
  
      console.log(result);
  
      res.status(200).json({ message: "Task deleted!" });
  
    });
  
  });
  
  
  
  module.exports = router;