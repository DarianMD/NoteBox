const https = require('https');
const fs = require('fs');
const cheerio = require('cheerio');

let url = ''; // Inicializa el ID
let page = null; // Inicializa la página
let status = 200; // Inicializa el estado

function fetchData() {
    return new Promise((resolve, reject) => {
        https.get(url, function(res) {
            console.log(res.statusCode);
            status = res.statusCode;
            if (res.statusCode === 404) {
                console.log("Error 404: No se encontró la página");
                resolve(); // Resuelve la promesa para salir del bucle
                return;
            }
        
            res.setEncoding('utf8');
            let rawData = '';
            
            const file = fs.createWriteStream('./tmp/imdb_response.html'); // Crea un nuevo archivo
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

                for (let i = 0; i < $('.lister-item').length; i++) {
                    
                    // Obtiene el título de la película en el índice actual
                    const title = $('.lister-item-header').eq(i).find('a').text().trim();

                    // Obtiene la nota de la película en el índice actual
                    const rating = $('.lister-item-content div').eq(i).find('.ipl-rating-star__rating').text().trim();
            
                    // Agrega el par nombre-nota al array moviesData
                    moviesData.push([title, rating]);


                }
                

                // Imprimir los resultados
                console.log("Títulos y calificaciones de usuario:");
                console.log(moviesData);
                resolve(); // Resuelve la promesa para continuar con la siguiente página
    
                const jsonData = JSON.stringify(moviesData, null,2);
                fs.writeFile('data.json', jsonData, (err) => {
                    if (err) {
                        console.error('Error al escribir el archivo JSON:', err);
                        return;
                    }
                    console.log('Archivo JSON guardado correctamente.');
                });


                
                fs.unlink('./tmp/imdb_response.html', (error) => {
                    if (error) {
                        console.error('Error al eliminar el archivo:', error);
                        return;
                    }
                    console.log('El archivo ha sido eliminado exitosamente.');
                });

            });

        }).on('error', function(err) {
            reject(err); // Rechaza la promesa en caso de error
        });
    });
}

// Función recursiva para manejar múltiples solicitudes
function fetchPages() {
    if (page !== null) {
        fetchData()
            .then(() => {
                if (status === 200) {
                    fetchPages(); // Llama recursivamente solo si el estado es 200
                }
            })
            .catch(error => {
                console.log(error); // Maneja errores de solicitud
            });
    } else {
        fetchData() // Llama fetchData() una vez si page es null
            .catch(error => {
                console.log(error); // Maneja errores de solicitud
            });
    }
}

fetchPages(); // Inicia la obtención de páginas





   