import * as url from 'url';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as https from 'https';


export function urlHost(urlWeb){

    let dominio = url.parse(urlWeb, true);
    let host = dominio.host;
    dominio = host.replace(/^www\.|\.com$/gi, '');
    return dominio;
}

export default function fetchData(urlWeb, user_frontID) {

    return new Promise((resolve, reject) => {

        let dominio = url.parse(urlWeb, true);
        let httpUrl, user_id, page;

        
        switch (urlHost(urlWeb)){
            case "filmaffinity":
                page = dominio.query.p;
                dominio.query.p++;
                user_id = dominio.query.user_id;
                httpUrl = 'https://www.filmaffinity.com/es/userratings.php?user_id='+ dominio.query.user_id+'&p='+ dominio.query.p;
                console.log(httpUrl);
                break;
            case "imdb":
                console.log("Es imdb");
                break;
             case "letterboxd":
                console.log("Es letterboxd");
                break;               
        }
        


        https.get(httpUrl, function(res) {
            console.log(res.statusCode);
            if (res.statusCode === 404) {
                console.log("Error 404: No se encontró la página");
                resolve(); // Resuelve la promesa para salir del bucle
                return;
            }
        
            res.setEncoding('utf8');
            let rawData = '';
            const file = fs.createWriteStream('./src/tmp/'+urlHost(urlWeb) + '_' + user_id + '_' + page + '.html'); // Crea un nuevo archivo

            res.on('data', function(chunk) {
                rawData += chunk;
                file.write(chunk); // Escribir los datos en el archivo
            });

            res.on('end', function() {
                file.end(); // Cerrar el archivo cuando se complete la respuesta
            });
            


        }).on('error', function(err) {
            reject(err); // Rechaza la promesa en caso de error
        });
    });
}