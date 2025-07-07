const io = require('socket.io')(8080, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	},
})

let users = []

const addOnlineUser = (user, socketId) => {
	const checkUser = users.find(u => u.user._id === user._id)

	if (!checkUser) {
		users.push({ user, socketId })
	}
}

io.on('connection', socket => {
	console.log('User connected', socket.id)

	socket.on('addOnlineUser', user => {
		addOnlineUser(user, socket._id)
		io.emit('getOnlineUsers', users)
	})

	socket.on('disconnect', () => {
		console.log('User disconnected', socket._id)
		users = users.filter(u => u.socketId !== socket._id)
		io.emit('getOnlineUsers', users)
	})
})
