const socket = io();

const urlSearch = new URLSearchParams(window.location.search);
const username = urlSearch.get('username');
const room = urlSearch.get('select_room');

const usernameDiv = document.getElementById("username");
usernameDiv.innerHTML = `Hello ${username} - You are in the room ${room}`;

socket.emit('selected_room', {
  username,
  room
}, (messages) => {
  messages.forEach((message) =>
    uploadMessages(message));
});

document.getElementById("message_input").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    const message = event.target.value;
    const data = {
      username,
      room,
      message,
    }

    socket.emit("message_room", data);
    event.target.value = "";
  }
});

socket.on("message_room", (data) => {
  uploadMessages(data);
});


function uploadMessages(data) {
  const messageDiv = document.getElementById("messages");

  messageDiv.innerHTML += `
    <div class ="new_message" id = "new_message">
      <label class="form-label">
        <strong>${data.username}</strong> <span>${data.message} - ${dayjs(data.createdAt).format("DD/MM HH:mm")}</span>
      </label>
    </div>
  `;
};

document.getElementById("logout").addEventListener("click", () => {
  const message = `saiu da sala`;
  const data = {
    username,
    room,
    message,
  };

  socket.emit("message_room", data);
  window.location.href = "index.html";
});