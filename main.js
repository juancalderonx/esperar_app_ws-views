import { Stomp } from "@stomp/stompjs";

document.addEventListener("DOMContentLoaded", function () {
    const createNewsForm = document.getElementById("createNewsForm");

    createNewsForm.addEventListener("submit", function (event) {
        event.preventDefault(); 
        createNews();
    });
});

export function createNews() {
    const newsTitle = document.getElementById("title").value;
    const newsContent = document.getElementById("content").value;

    console.log({ title: newsTitle, content: newsContent });

    let stompClient = Stomp.over(function () {
        return new SockJS(`http://localhost:8080/api/v1/ws`);
    });

    stompClient.connect({}, () => {
        console.log('Conectado al servidor de WebSocket');

        sendCreateNewsMessage(stompClient, newsTitle, newsContent);

        stompClient.subscribe('/topic/news', (news) => {
            const notice = JSON.parse(news.body);
            console.log("Nueva noticia creada:", notice);
        });

    }, () => {
        console.log("Fallo al conectarse al servidor WebSocket. Por favor, inténtelo de nuevo más tarde.");
    });
}

function sendCreateNewsMessage(stompClient, title, content) {
    const createNoticeDto = {
        title: title,
        content: content
    };

    stompClient.send("/app/createNews", {}, JSON.stringify(createNoticeDto));
}
