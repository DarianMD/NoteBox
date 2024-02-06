const https = require('https');
const fs = require('fs');
const cheerio = require('cheerio');
const file = fs.createWriteStream("filmaffinity_response.html");



https.get("https://www.filmaffinity.com/es/userratings.php?user_id=8536085", function(res) {
    console.log(res.statusCode);
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', function(chunk) {
        rawData += chunk;
        file.write(chunk); // Escribir los datos en el archivo
    });
    
    res.on('end', function() {
        file.end(); // Cerrar el archivo cuando se complete la respuesta
        console.log("Archivo guardado correctamente.");
        // Parsear el HTML con Cheerio
        const $ = cheerio.load(rawData);
        let moviesData = [];

        for (let i = 0; i < $('.user-ratings-movie').length; i++) {
            
            // Obtiene el título de la película en el índice actual
            const title = $('.movie-card').eq(i).find('.mc-title a').text().trim();

            // Obtiene la nota de la película en el índice actual
            const rating = $('.user-ratings-movie-rating').eq(i).find('.ur-mr-rat').text().trim();
    
            // Agrega el par nombre-nota al array moviesData
            moviesData.push([title, rating]);
        }
        

        // Imprimir los resultados
        console.log("Títulos y calificaciones de usuario:");
        console.log(moviesData);
    });
}).on('error', function(err) {
    console.log(err);
});
