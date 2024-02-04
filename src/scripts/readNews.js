// readNews.js
import { Stomp } from "@stomp/stompjs";

document.addEventListener("DOMContentLoaded", function () {
    connectToWebSocket();
});

function connectToWebSocket() {
    let stompClient = Stomp.over(function () {
        return new SockJS(`http://localhost:8080/api/v1/ws`);
    });

    stompClient.connect({}, () => {
        console.log('Conectado al servidor de WebSocket');

        stompClient.subscribe('/topic/news', (news) => {
            const message = JSON.parse(news.body);

            if (message.hasOwnProperty('deletedNewsId')) {
                deleteRowFromTable(message.deletedNewsId);
            } else {
                const notice = message;
                console.log("Nueva noticia recibida:", notice);
                updateTableWithNewNotice(notice);
            }
        });

    }, () => {
        console.log("Fallo al conectarse al servidor WebSocket. Por favor, inténtelo de nuevo más tarde.");
    });
}

function updateTableWithNewNotice(notice) {
    const tableBody = document.getElementById("newsTableBody");
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>${notice.id}</td>
        <td>${notice.title}</td>
        <td>${notice.content}</td>
    `;
    tableBody.appendChild(newRow);
}

function deleteRowFromTable(newsId) {
    const tableBody = document.getElementById("newsTableBody");
    const rows = tableBody.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName("td");
        const idCell = cells[0];
        if (idCell.textContent == newsId) {
            tableBody.removeChild(rows[i]);
            break;
        }
    }
}
