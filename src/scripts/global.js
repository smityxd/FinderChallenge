/*
  constants and global functions
*/

var JSON_FILE = '/books-schema.json';
//var JSON_FILE = '/facil.json';

/*
 @method loadJSON
 source: https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript

var loadJSON = function(url, callback){
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open("GET", url, true);
    xobj.onreadystatechange = function(responseText){
        if(xobj.readyState == 4 && xobj.status == "200"){
            var content = JSON.parse(xobj.responseText);
            callback.call(this, content);
        }
    };
    xobj.send(null);
};*/

 function loadJSON(callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', JSON_FILE, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }
 


function searchForm(name){
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}




var busqueda = searchForm("search");





var seccionBusquedas = "<p>Busquedas Guardadas</p>";
var seccionCategorias = "<p>Categorias</p>Todo<br>";
var seccionIdioma = "<p>Idiomas</p>Todo<br>";
var seccionPresentacion = "<p>Presentacion</p>";
var seccionLibros = "";
function init() {
    loadJSON(function(response) {
        // Parse JSON string into object
        var actual_JSON = JSON.parse(response);
        //document.getElementById("books").innerHTML = actual_JSON.employees[1].firstName;
        //console.log(actual_JSON);
        for(var k in actual_JSON) {
            if(k=="entities"){
                for(var l in actual_JSON[k]){
                    if(l=="saved"){ //busquedas guardadas
                        for(var m in actual_JSON[k][l]){
                                seccionBusquedas += "<a href='#" + actual_JSON[k][l][m].url + "'>" + actual_JSON[k][l][m].label + "</a><br>";
                        }
                    }
                    if(l=="categories"){ //categorias
                        for(var m in actual_JSON[k][l]){
                            for(var p in actual_JSON[k][l][m]){
                                seccionCategorias += "<a href='#" + actual_JSON[k][l][m][p].id + "'>" + actual_JSON[k][l][m][p].label + "</a><br>";
                            }
                        }
                    }
                    if(l=="lang"){ //idioma
                        for(var m in actual_JSON[k][l]){
                            for(var p in actual_JSON[k][l][m]){
                                seccionIdioma += "<a href='#" + actual_JSON[k][l][m][p].id + "'>" + actual_JSON[k][l][m][p].label + "</a><br>";
                            }
                        }
                    }
                    if(l=="edition"){ //presentacion
                        for(var m in actual_JSON[k][l]){
                            for(var p in actual_JSON[k][l][m]){
                                if(actual_JSON[k][l][m][p].label != "Impreso y Digital"){
                                    seccionPresentacion += "<a href='#" + actual_JSON[k][l][m][p].id + "'>" + actual_JSON[k][l][m][p].label + "</a><br>";
                                }else{
                                    seccionPresentacion += actual_JSON[k][l][m][p].label + "</a><br>";
                                }
                            }
                        }
                    }
                }
            }else{//explorando los datos
                var cantidad = 8; //cantidad de items por pagina
                var i = 0; //item actual
                for(var l in actual_JSON[k]){
                    if(i>=cantidad)break;//salimos si se pasa de la cuenta
                    var image = actual_JSON[k][l].image;
                    var title = actual_JSON[k][l].title;
                    var teaser = actual_JSON[k][l].teaser;
                    if((title.toLowerCase().indexOf(busqueda.toLowerCase())>0 || teaser.toLowerCase().indexOf(busqueda.toLowerCase())>0) || busqueda == ""){
                        //console.log(l,"------------------------------------------------",actual_JSON[k][l].id)
                        seccionLibros += "<div class='book-item'>"
                        seccionLibros += "<img src='"+image+"'>"+"<br>";
                        seccionLibros += "<p>"+title+"</p>"+"<br>";
                        seccionLibros += "<span>"+teaser+"</span>"+"<br>";
                        seccionLibros += "</div>";
                        i++;
                    }
                }
            }
        }
        //agregamos los datos a los respectivos contenedores
        document.getElementById("searches").innerHTML = seccionBusquedas;
        document.getElementById("categories").innerHTML = seccionCategorias;
        document.getElementById("language").innerHTML = seccionIdioma;
        document.getElementById("edition").innerHTML = seccionPresentacion;
        document.getElementById("books").innerHTML = seccionLibros;
    });
}

init();
