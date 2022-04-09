const socket = new WebSocket(`ws://${window.location.host}`)

socket.addEventListener('open', () => {
  console.log('Connected to Server!')
})

socket.addEventListener('message', message => {
  console.log(`just got this:: ${message.data} from the server`)
})

socket.addEventListener('close', () => {
  console.log('socket closed')
})

setTimeout(() => {
  socket.send('New Message For You')
}, 10000);