import * as url from 'url';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as https from 'https';
import mediaSchema from '../models/media.model.js'

export const HOST = {
    filmaffinity: 'filmaffinity',
    imdb: 'imdb',
    letterboxd: 'letterboxd',
    rateyourmusic: 'rateyourmusic',
    goodreads: 'goodreads'

}



function urlHost(urlWeb){

    let dominio = url.parse(urlWeb, true);
    let host = dominio.host;
    dominio = host.replace(/^www\.|\.com$/gi, '');
    return dominio;
}


function hostHtmlQuery(host){

    let queryCheerio = [];
    switch (host){
        case HOST.filmaffinity:
            queryCheerio = ['.user-ratings-movie','.movie-card','.mc-title a', '.user-ratings-movie-rating', '.ur-mr-rat'];
        break;
        case HOST.imdb:
            queryCheerio = ['.lister-item mode-detail', '.lister-item-header','a', '.ipl-rating-star .ipl-rating-interactive__star','.ipl-rating-star__rating span'];
        break;
    }   

    return queryCheerio;
}


function baseRatingHost(host, rating){

    let retRating;
    switch (host){
        case HOST.letterboxd:
            retRating = ((rating.match(/★/g) || []).length) * 2;
            retRating += ((rating.match(/½/g) || []).length);
            break;
        case HOST.filmaffinity:
            retRating = rating;
            break;
    }
    

    return retRating;
}

function baseTypeHost(host){
    let type;

    switch (host){
        case HOST.filmaffinity:
        type = "Movie"
        break;
        case HOST.rateyourmusic:
        type = "Music"
    }

    return type;
}



export default function fetchData(urlWeb, user_frontID) {

    return new Promise((resolve, reject) => {

        let dominio = url.parse(urlWeb, true);
        let httpUrl, user_id, page;
        let host = urlHost(urlWeb)
    
        
        switch (host){
            case HOST.filmaffinity:
                if(dominio.query.p == null && page == null){
                    page = 1;
                }
                else{
                page = dominio.query.p;
                }
                dominio.query.p++;
                user_id = dominio.query.user_id;
                httpUrl = 'https://www.filmaffinity.com/es/userratings.php?user_id='+ dominio.query.user_id+'&p='+ page
                break;
            case HOST.imdb:
                dominio.pathname = dominio.pathname.replace('ratings','');
                httpUrl = 'https://www.imdb.com/'+ dominio.pathname +'/ratings';
                break;
             case HOST.letterboxd:
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
                let mediaQuery = hostHtmlQuery(host);


                for (let i = 0; i < /*htmlData(mediaQuery[0].length*/ 3; i++) {                    
                    let title = htmlData(mediaQuery[1]).eq(i).find(mediaQuery[2]).text().trim();
                    let rating = htmlData(mediaQuery[3]).eq(i).find(mediaQuery[4]).text().trim();

                    var media = new mediaSchema({
                        user_idM: user_id,
                        name: title,
                        rating: baseRatingHost(host, rating),
                        typeMul: baseTypeHost(host),
                    });
                    
                    console.log(title, rating);
                    //media.save();
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


