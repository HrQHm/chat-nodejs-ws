import { io } from "./http";

interface RoomUser {
  socket_id: string;
  username: string;
  room: string;
}

interface MessagesRoom {
  username: string;
  room: string;
  createdAt: Date;
  message: string;
}

const users: RoomUser[] = [];
const messages: MessagesRoom[] = [];

io.on('connection', socket => {
  socket.on("selected_room", (data, callback) => {
    socket.join(data.room);

    const userInRoom = users.find(
      (user) => user.username === data.username && user.room === data.room
    );

    if (userInRoom) {
      userInRoom.socket_id = socket.id;
    } else {
      users.push({
        socket_id: socket.id,
        username: data.username,
        room: data.room
      })
    }

    const messageNewUserInRoom: MessagesRoom = {
      username: data.username,
      room: data.room,
      createdAt: new Date(),
      message: `entrou na sala`
    };


    io.to(data.room).emit("message_room", messageNewUserInRoom);
    const messagesRoom = getMessagesRoom(data.room);
    callback(messagesRoom);
  });


  socket.on("message_room", (data) => {
    const message: MessagesRoom = {
      username: data.username,
      room: data.room,
      createdAt: new Date(),
      message: data.message
    };

    messages.push(message);

    io.to(data.room).emit("message_room", message);
  })
});

function getMessagesRoom(room: string) {
  return messages.filter(message => message.room === room);
}