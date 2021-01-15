const express = require("express");
// connect to db
require("./db/mongoose");
// load the user model
const User = require("./models/user");
const Task = require("./models/task");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
const app = express();
const port = process.env.PORT || 3000;

// middleware function
// app.use((req, res, next) => {
//   if (req.method === "GET") {
//     res.send("get requst are disaled");
//   } else {
//     next();
//   }
// });

// app.use((req, res, next) => {
//   res.status(503).send("under maintainence, please try later");
// });

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("server is running...in the " + port);
});
