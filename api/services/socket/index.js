const express = require('express')
const {get} = require('../../pkg/config')
const {Server} = require("socket.io");
const app = express() // Create an express app
const port = get("SOCKET_SERVICE_PORT")

const server = require("http").createServer(app); // Create a http server from the express server

const io = new Server(server,{ // Create a socket.io server from the http server
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }
})

io.on("connection", (socket) => { // Listen for connections
  console.log("connected")
  socket.on("upis",()=>{ // Listen for the upis event
    socket.broadcast.emit("refresh") // Broadcast the refresh event
  })
})


server.listen(port, () => console.log(`socket started ${port}`))