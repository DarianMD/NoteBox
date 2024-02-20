import * as url from 'url';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as https from 'https';
import movieSchema from '../models/movie.model.js'
import { error } from 'console';


export function urlHost(urlWeb){

    let dominio = url.parse(urlWeb, true);
    let host = dominio.host;
    dominio = host.replace(/^www\.|\.com$/gi, '');
    return dominio;
}


export function hostHtmlQuery(host){

    let queryCheerio = [];
    switch (host){
        case "filmaffinity":
            queryCheerio = ['.user-ratings-movie','.movie-card','.mc-title a', '.user-ratings-movie-rating', '.ur-mr-rat'];
        break;
    }   

    return queryCheerio;
}


export function baseRatingHost(host, rating){

    let retRating;
    switch (host){
        case "letterboxd":
            retRating = ((string.match(/★/g) || []).length) * 2;
            retRating += ((string.match(/½/g) || []).length);
            break;
    }
    
}


export default function fetchData(urlWeb, user_frontID) {

    return new Promise((resolve, reject) => {

        let dominio = url.parse(urlWeb, true);
        let httpUrl, user_id, page;
        let host = urlHost(urlWeb)
        

        
        switch (host){
            case "filmaffinity":
                page = dominio.query.p;
                dominio.query.p++;
                user_id = dominio.query.user_id;
                httpUrl = 'https://www.filmaffinity.com/es/userratings.php?user_id='+ dominio.query.user_id+'&p='+ page
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
                const htmlData = cheerio.load(rawData);
                let movieQuery = hostHtmlQuery(host);


                for (let i = 0; i < /*htmlData(movieQuery[0].length*/ 1; i++) {                    
                    let title = htmlData(movieQuery[1]).eq(i).find(movieQuery[2]).text().trim();
                    let rating = htmlData(movieQuery[3]).eq(i).find(movieQuery[4]).text().trim();

                    var movie = new movieSchema({
                        user_idM: user_id,
                        name: title,
                        rating: baseRatingHost(host, rating),
                        typeMul: 1,
                    });
                    
                    console.log(title);
                    //movie.save();
                }

                
                fs.unlink('./src/tmp/'+urlHost(urlWeb) + '_' + user_id + '_' + page + '.html', (error) => {
                    if (error) {
                        console.error('Error al eliminar el archivo:', error);
                        return;
                    }
                    console.log('El archivo ha sido eliminado exitosamente.');
                });
                
                return;

            });

        
            resolve();
            return;
            


        }).on('error', function(err) {
            reject(err); // Rechaza la promesa en caso de error
        });
    });
}


