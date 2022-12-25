const chatForm = document.getElementById('message_form');
const messages = document.getElementById('messages');
const roomNumber = document.getElementById('room-number');
const userList = document.getElementById('users-list');

const { username , room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
  }); 
  
  const socket = io();
  
  //Chat room
  socket.emit('joinRoom', { username, room });
  
  // get users
  socket.on('roomUsers', ({room , users}) => {  
      outputRoomNumber(room);
      outputUsers(users);
  })
  
  //message from server
  socket.on('message', message => {
      console.log(message);
      outPutMessages(message);
  
      //Scroll down 
    //   messages.scrollTop = messages.scrollHeight;
  });
  
  //message submit
  
  chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
  
      //Get message text
      const msg = e.target.elements.msg.value;
  
      if(!msg)
      {
        return false;
      }
      //Emit message to serve
      socket.emit('chatMessage', msg);
      
      //Clear input
      e.target.elements.msg.value = '';
      e.target.elements.msg.focus();
  })
  
  //output message to dom
  function outPutMessages(message) {
      const div = document.createElement('div');
      div.classList.add('message');
      div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
      <p class="text">
      ${message.text}
      </p>`;
      document.getElementById('messages').appendChild(div);
  }
  
  //Add room name to DOM
  function outputRoomNumber(room) {
      roomNumber.innerText = room;
  }
  
  //Add users to DOM
  function outputUsers(users) {
      userList.innerHTML = `
      ${users.map(user => `<li>${user.username}</li>`).join('')}
      `;
  }

document.querySelector('.btn-leave').addEventListener('click', () => {
    const leaveRoom = confirm('Are you want to leave the Chatroom?');
    if (leaveRoom) {
      window.location = '../index.html';
    } else {
    }
});

document.querySelector('.btn-sidebar').addEventListener('click' , () => {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active')
});

document.getElementById('btn-darkmode').addEventListener('click' , () => {
    const html = document.querySelector('html');
    html.classList.toggle('darkmode');
})