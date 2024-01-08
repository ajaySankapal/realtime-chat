const express = require("express");
const http = require("http");
const cors = require('cors')
const socketio = require("socket.io");
const { generateMessage } = require("./utils/messages");
const {
    addUser, removeUser, getUser
} = require("./utils/users");

const app = express();
app.use(cors())
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: '*' } });

const PORT = process.env.PORT || 5000;

io.on("connection", (socket) => {
    console.log("new websocket connection");
    socket.on("join", ({ customerName, deliveryDate, items, contactNumber }) => {
        const { error, user } = addUser({ id: socket.id, customerName, deliveryDate, items, contactNumber });
        if (error) {
            console.log('ERROR JOINING THE USER::', error)
        }

        // Makes one room for the users who has selected the same expected delivery date
        socket.join(user.deliveryDate);
        socket.emit("message", { username: 'Admin', items, message: `Welcome ${customerName} !. Your order has been placed successfully. Your Ordered Items are : `, createdAt: new Date().getTime() });

        socket.broadcast
            .to(user.deliveryDate)
            .emit(
                "message",
                { username: 'Admin', items, message: `${customerName} has joined. Order Placed Successfully!.Ordered Items are : `, createdAt: new Date().getTime() }
            );

    });
    socket.on("sendMessage", (message) => {
        const user = getUser(socket.id);
        console.log(user, 'USER IN THE SEND MESSAGE FUNCTION')
        io.to(user.deliveryDate).emit("message", generateMessage(user.customerName, message, user.deliveryDate));
    });

    //tell about if the user leaves the chat
    socket.on("disconnect", () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.deliveryDate).emit(
                "message",
                generateMessage("Admin", `${user.customerName} has left!`)
            );
        }
    });

});

server.listen(PORT, () => {
    console.log(`Server is up on port: ${PORT}`);
});