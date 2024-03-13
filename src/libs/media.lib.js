import * as url from 'url';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as https from 'https';
import * as axios from 'axios';

import mediaSchema from '../models/media.model.js'

export const HOST_ENUM = {
    filmaffinity:{hostname: 'filmaffinity', typeMedia: 'Movie', multiPage: 'yes', titleAtribute: 'Find',ratingAtribute: 'Find'},
    imdb:{host: 'imdb', typeMedia: 'Movie', multiPage: 'no', titleAtribute: 'Find',ratingAtribute: 'Find'},
    letterboxd:{host: 'letterboxd', typeMedia: 'Movie', multiPage: 'yes', titleAtribute: 'Atribute',ratingAtribute: 'Find'},
    rateyourmusic:{host: 'rateyourmusic', typeMedia: 'Music', multiPage: 'yes', titleAtribute: 'Find',ratingAtribute: 'Find'},
    goodreads:{host: 'goodreads', typeMedia: 'Book', multiPage: 'yes', titleAtribute: 'Find',ratingAtribute: 'Find'},
};




export function urlHost(urlWeb){

    let dominio = url.parse(urlWeb, true);
    let host = dominio.host;
    dominio = host.replace(/^www\.|\.com$/gi, '');
    return dominio;
}


function hostHtmlQuery(host){

    let queryCheerio = [];
    switch (host){
        case HOST_ENUM.filmaffinity.hostname:
            queryCheerio = ['.user-ratings-movie','.movie-card','.mc-title a', '.user-ratings-movie-rating', '.ur-mr-rat'];
        break;
        case HOST_ENUM.imdb.hostname:
            queryCheerio = ['.lister-item mode-detail', '.lister-item-header','a', '.ipl-rating-widget','.ipl-rating-star__rating'];
        break;
        case HOST_ENUM.letterboxd.hostname:
            queryCheerio = ['.poster-container', '.image','alt', '.poster-viewingdata','.rating'];
        break;
        case HOST_ENUM.rateyourmusic.hostname:
            queryCheerio = ['.page_catalog_item_', '.or_q_albumartist','album', '.poster-viewingdata','.rating'];
        break;
    }   

    return queryCheerio;
}


function baseRatingHost(host, rating){

    let retRating;
    switch (host){
        case HOST_ENUM.letterboxd.host:
            retRating = ((rating.match(/★/g) || []).length) * 2;
            retRating += ((rating.match(/½/g) || []).length);
            break;
        case HOST_ENUM.filmaffinity.hostname:
            retRating = rating;
            break;
    }
    

    return retRating;
}


export async function fetchData(domino, urlWeb, fileRoute, user_id, hostData, page, user_frontID) {

    return new Promise((resolve, reject) => {

        let host = urlHost(urlWeb);


        https.get(urlWeb, function(res) {

            console.log(res.statusCode);

            if (res.statusCode === 404) {
                console.log("Error 404: No se encontró la página");
                resolve(); // Resuelve la promesa para salir del bucle
                return res.statusCode;
            }
        
            res.setEncoding('utf8');
            let rawData = '';
            let file = fs.createWriteStream(fileRoute)// Crea un nuevo archivo


            res.on('data', function(chunk) {
                rawData += chunk;
                file.write(chunk); // Escribir los datos en el archivo
            });


            res.on('end', function() {
                file.end(); // Cerrar el archivo cuando se complete la respuesta
                const htmlData = cheerio.load(rawData);
                let mediaQuery = hostHtmlQuery(host);
                let title, rating;


                for (let i = 0; i < 6 /*htmlData(mediaQuery[0].length)*/; i++) {
                    
                    title = HOST_ENUM.filmaffinity.titleAtribute == 'Find' ? htmlData(mediaQuery[1]).eq(i).find(mediaQuery[2]).text().trim() : htmlData(mediaQuery[1]).eq(i).attr(mediaQuery[2]);

                    rating = HOST_ENUM.filmaffinity.ratingAtribute == 'Find' ? htmlData(mediaQuery[3]).eq(i).find(mediaQuery[4]).text().trim() : htmlData(mediaQuery[3]).eq(i).attr(mediaQuery[2]);


                    var media = new mediaSchema({
                        user_idM: user_id,
                        name: title,
                        rating: baseRatingHost(host, rating),
                        typeMul: hostData.typeMedia,
                    });

                
                    
                    console.log(title, baseRatingHost(host, rating));
                    //media.save();
                }

                
                fs.unlink('./src/tmp/'+urlHost(urlWeb) + '_' + user_id + '_' + page + '.html', (error) => {
                    if (error) {
                        console.error('Error al eliminar el archivo:', error);
                    }
                    console.log('El archivo ha sido eliminado exitosamente.');
                });

                page++;
                
            });

        
            resolve();
            return res.statusCode;
            
        }).on('error', function(err) {
            reject(err); // Rechaza la promesa en caso de error
        });
    });
    
    
}


