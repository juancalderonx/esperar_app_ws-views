import { Stomp } from "@stomp/stompjs";

document.addEventListener("DOMContentLoaded", function () {
  const geolocationForm = document.getElementById("geolocationForm");

  geolocationForm.addEventListener("submit", function (event) {
    event.preventDefault();
    submitGeolocation();
  });
});

function submitGeolocation() {
  const vehicleId = document.getElementById("vehicleId").value;
  const latitude = document.getElementById("latitude").value;
  const longitude = document.getElementById("longitude").value;

  console.log({ vehicleId, latitude, longitude });

  let stompClient = Stomp.over(function () {
    return new SockJS(`http://localhost:8080/api/v1/ws/geolocation`);
  });

  stompClient.connect(
    {},
    () => {
      console.log("Conectado al servidor de WebSocket");

      sendGeolocationMessage(stompClient, vehicleId, latitude, longitude);

      stompClient.subscribe("/topic/geolocation", (geolocation) => {
        const message = JSON.parse(geolocation.body);
        console.log("Nueva geolocalización recibida:", message);
      });
    },
    () => {
      console.log(
        "Fallo al conectarse al servidor WebSocket. Por favor, inténtelo de nuevo más tarde."
      );
    }
  );
}

function sendGeolocationMessage(stompClient, vehicleId, latitude, longitude) {
  const geolocationDto = { vehicleId, latitude, longitude };

  try {
    stompClient.send("/app/addGeolocation", {}, JSON.stringify(geolocationDto));
  } catch (error) {
    console.log("Error al enviar la geolocalización", error);
  }
}
