import { Stomp } from "@stomp/stompjs";

let stompClient = null;

document.addEventListener("DOMContentLoaded", function () {
  const socket = connectToSocket();

  const sendMessageForm = document.getElementById("messageForm");

  sendMessageForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // const createChatDto = {
    //   senderId: 1,
    //   recipientId: 2,
    //   type: "ONE_TO_ONE",
    // };

    // createChat(createChatDto, socket); // Create chat

    const messageContent = document.getElementById("message").value;

    const createMessageDto = {
      chatId: 6,
      senderId: 1,
      content: messageContent,
    };

    sendMessage(createMessageDto, socket); // Send message
  });
});

export const sendMessage = (createMessageDto, socket) => {
  console.log("Trying to send a message");
  socket.send("/app/chat.send-message", {}, JSON.stringify(createMessageDto));
};

export const createChat = (createChatDto, socket) => {
  console.log("Trying to create a chat");
  socket.send("/app/chat.create-chat", {}, JSON.stringify(createChatDto));
};

export const connectToSocket = () => {
  stompClient = Stomp.over(function () {
    return new SockJS(`http://localhost:8080/api/v1/ws/chat`);
  });

  stompClient.connect({}, onConnected, onError);

  return stompClient;
};

const onConnected = () => {
  console.log("Connected to WebSocket");

  const chatRoomIds = getChatRoomIdsForUser();

  console.log("Los chat rooms ids son: ", chatRoomIds);

  chatRoomIds.forEach((chatRoomId) => {
    console.log("Vamos a suscribirnos al chat room con id: " + chatRoomId);
    stompClient.subscribe(
      `/topic/chat-message.${chatRoomId}`,
      onMessageReceived
    );
  });
};

export const onError = (error) => {
  console.error("Error connecting to the server", error);
};

export const onMessageReceived = (payload) => {
  console.log("Message received:");

  const messageBody = new TextDecoder().decode(payload.binaryBody);
  const message = JSON.parse(messageBody);

  console.log("Mensaje decodificado:");
  console.log(message);
};

export const getChatRoomIdsForUser = () => {
  return [6];
};
