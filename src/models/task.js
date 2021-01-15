// load mongoose
const mongoose = require("mongoose");
const validator = require("validator");

//  data model for tasks
const Task = mongoose.model("Task", {
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

// export user model
module.exports = Task;
