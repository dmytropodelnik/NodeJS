// Сервер на JS
const HTTP_PORT = 80;
const WWW_ROOT = "www";
const FILE_404 = WWW_ROOT + "/404.html";

// Подключение модуля
const http = require('http');
const fs = require('fs');  // file system
const { log } = require('console');

// Серверная функция
function serverFunction(request, response) {
    // логируем запрос - это must have для всех серверов
    console.log(request.method + " " + request.url);
    // TODO: проверить запрос на спецсимволы (../)
    // проверяем, является ли запрос файлом
    const path = WWW_ROOT + request.url;
    if (fs.existsSync(path) && fs.lstatSync(path).isFile()) {  // да, такой файл существует
        sendFile(path, response);
        return;
    }
    // нет, это не файл. Маршрутизируем
    const url = request.url.substring(1)
    if (url === '') {
        // запрос / - передаем индексный файл
        sendFile("www/index.html", response);
       // response.end("<meta charset='utf-8'/><h1>Home, sweet Home привет</h1>"); // ~getWriter().print
    }
    else if (url === 'hello') {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.end("<h1>Hello, world</h1>"); // ~getWriter().print
    } 
    else if (url === 'js') {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.end("<h1>Node is cool</h1>"); // ~getWriter().print
    }
    else {
        // необработанный запрос - "не найдено" (404.html)
        sendFile(FILE_404, response, 404);
    }

}

// Создание сервера (объект)
const server = http.createServer(serverFunction);

// Запуск сервера - начало прослушивания
server.listen(  // регистрируемся в ОС на получение пакетов, 
                // адресованных на наш порт
    HTTP_PORT,  // номер порта
    () => {  // callback, после-обработчик, вызывается после того, как 
             // будут выполнены действия ("включится слушание")
        console.log("Listen started, port " + HTTP_PORT); 
    }
);

/// задание
async function sendFile2(path, response, statusCode) {
    fs.readFile(
        path,  // путь к файлу
        // callback - выполнится после открытия файла
        // sendFile// открытие файла на чтение - асинхронно - отложенно
        (err, data) => {
            if (err) {
                console.error(err);
                return;
            } 
            if (typeof statusCode == 'undefined') {
                statusCode = 200;
            } else {
                response.statusCode = 404;
            }
            response.statusCode = statusCode;
            response.setHeader('Content-Type', 'text/html; charset=utf-8');
            response.end(data);
        }
    );
}

async function sendFile(path, response, statusCode = 200) {
        // Stream - piping: stream copy from readable stream to writable
    var readStream = false;
    if (fs.existsSync(path)) {
        readStream = fs.createReadStream(path);
    } else if (fs.existsSync(FILE_404)) {
        readStream = fs.createReadStream(FILE_404);
        statusCode = 404;
    }

    response.setHeader('Content-Type', 'text/html; charset=utf-8');

    if (readStream) {
        response.statusCode = statusCode;
        readStream.pipe(response);
    } else {
        response.statusCode = 418;
        response.end('I am a teapot');
    }

    response.statusCode = statusCode;
    if (typeof statusCode == 'undefined') {
        statusCode = 200;
    }


    // задание: проверить наличие файла перед отправкой:
    // 1. ищем файл, если есть - отправляем
    // 2. если нет - ищем 404, отправляем (если есть)
    // 3. если нет - отправляем строку 418 кодом
}
