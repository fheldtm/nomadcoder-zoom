import http from 'http'
import SocketIO from 'socket.io'
import express from 'express'

const app = express()

app.set("view engine", "pug")
app.set("views", __dirname + "/views")

app.use("/public", express.static(__dirname + '/public'))

app.get("/", (req, res) => {
  res.render("home")
})

const httpServer = http.createServer(app)
const wsServer = SocketIO(httpServer)

wsServer.on("connection", (socket) => {
  socket["nickname"] = "Anon"
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`)
  })
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName)
    done()
    socket.to(roomName).emit("welcome", socket.nickname)
  })
  socket.on("disconnecting", () => {
    socket.rooms.forEach(room => socket.to(room).emit("bye", socket.nickname))
  })
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`)
    done()
  })
  socket.on("nickname", nickname => {
    socket["nickname"] = nickname
  })
})

// const sockets = [];
// const wss = new WebSocket.Server({ server })
// wss.on("connection", (socket) => {
//   sockets.push(socket)
//   socket["nickname"] = "Anon"
//   console.log('Connected to Browser!')
//   socket.on('close', () => { console.log('Disconnected from the Browser') })
//   socket.on('message', msg => {
//     const message = JSON.parse(msg.toString('utf-8'))
//     switch (message.type) {
//       case 'new_message':
//         sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`))
//         break;
//       case 'nickname':
//         socket["nickname"] = message.payload
//         break;
//     }
//   })
// })

httpServer.listen(3000)