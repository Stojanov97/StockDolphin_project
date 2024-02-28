const express = require('express')
const {get} = require('../../pkg/config')
const {Server} = require("socket.io");
const app = express()
const port = get("SOCKET_SERVICE_PORT")

const server = require("http").createServer(app);

const io = new Server(server,{
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }
})

io.on("connection", (socket) => {
  console.log("connected")
  socket.on("upis",()=>{
    socket.broadcast.emit("refresh")
  })
})


server.listen(port, () => console.log(`socket started ${port}`))