// Task 3

// 1. Реализовать чат на основе эхо-сервера wss://echo-ws-service.herokuapp.com.
// Интерфейс состоит из input, куда вводится текст сообщения, и кнопки «Отправить».
// При клике на кнопку «Отправить» сообщение должно появляться в окне переписки.
// Эхо-сервер будет отвечать вам тем же сообщением, его также необходимо выводить в чат
// 2. Добавить в чат механизм отправки гео-локации

// При клике на кнопку «Гео-локация» необходимо отправить данные серверу 
// и в чат вывести ссылку на https://www.openstreetmap.org/ с вашей гео-локацией. 
// Сообщение, которое отправит обратно эхо-сервер, не выводить.

let input = document.querySelector('.j-input');
let btnSend = document.querySelector('.j-btn-send');
let btnLocation = document.querySelector('.j-btn-location');
let chat = document.querySelector('.chat');

const wsUrl = "wss://echo-ws-service.herokuapp.com";

let websocket;

function writeToScreen(message, sender) {
  let pre = document.createElement("p");
  pre.className = `${sender}-message`;
  pre.innerHTML = message;
  pre.style.border = '1px solid blue';
  pre.style.backgroundColor = 'lightblue';
  pre.style.width = '100px';
  pre.style.borderRadius = '5px';
  if (sender == 'server') {
       pre.style.backgroundColor = 'grey';
       pre.style.alignSelf = 'flex-end';
       pre.style.textAlign = 'right';
       pre.style.margin = '5px';
  }
  chat.appendChild(pre);
}

if (!websocket) {
  websocket = new WebSocket(wsUrl);
}

btnSend.addEventListener("click", () => {

  websocket.onmessage = function (event) {
    writeToScreen(event.data, "server");
  };

  websocket.onerror = function (event) {
    writeToScreen(event.data, "server");
  };

  let input = document.querySelector('.j-input').value;
    writeToScreen(input, "client");

  websocket.send(input); 
});

btnLocation.addEventListener("click", () => {
  if (!navigator.geolocation) {
      chat.textContent = "Geolocation не поддерживается вашим браузером";
  } else {
      chat.textContent = "Определение местоположения…";
      navigator.geolocation.getCurrentPosition(success, error);
      
  }
});

const success = (position) => {
  console.log("position", position);
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  const message = `<a href="https://www.openstreetmap.org/#map=18/${latitude}/${longitude}" target="_blank">Ссылка на карту</a>`;
  writeToScreen(message, 'client')
};

const error = () => {
  chat.textContent = "Невозможно получить ваше местоположение";
};

