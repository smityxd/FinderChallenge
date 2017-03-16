/*
  constants and global functions
*/

//variable de JSON file
var JSON_FILE = '/books-schema.json';

//variable que guarda la busqueda
var busqueda = obtenerParametro("search");



//var para manejar el Aoutocomplete
var input = document.getElementById("myinput");
var awesomplete = new Awesomplete(input);
var listaTitulos = []; //para agregar los nombres de titulos



//var para llenar las secciones
var seccionBusquedas = "<p>Busquedas Guardadas</p>";
var seccionCategorias = "<p>Categorias</p>Todo<br>";
var seccionIdioma = "<p>Idiomas</p>Todo<br>";
var seccionPresentacion = "<p>Presentacion</p>";
var seccionLibros = "";




//funcion para obtener JSON
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


//funcion para obtener valor de Busqueda
function obtenerParametro(name){
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    results = results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    return results.toLowerCase();
}

//funcion para 'eliminar' busqueda grabada
function itemEsconder(i){
    document.getElementById("busqueda"+i).style.display = 'none';
}

//funcion que muestra u oculta las opciones de las busquedas grabadas
function toggleOption(i){
    var estado = document.getElementById("opciones"+i).style.display;
    if(estado=="block"){
        estado = "none";
    }else{
        estado = "block"
    }
    document.getElementById("opciones"+i).style.display = estado;
}


//funcion para mostrar los datos JSON
function searchForm() {
    loadJSON(function(response) {
        // Parse JSON string into object
        var actual_JSON = JSON.parse(response);
        //document.getElementById("books").innerHTML = actual_JSON.employees[1].firstName;
        //console.log(actual_JSON);
        for(var k in actual_JSON) {
            if(k=="entities"){
                for(var l in actual_JSON[k]){
                    if(l=="saved"){ //busquedas guardadas
                        var i = 1;
                        for(var m in actual_JSON[k][l]){
                                seccionBusquedas += "<div style='height:50px' id='busqueda"+i+"' onmouseover='javascript:toggleOption("+i+")' onmouseout='javascript:toggleOption("+i+")'>";
                                seccionBusquedas += "<a href='#" + actual_JSON[k][l][m].url + "'>" + actual_JSON[k][l][m].label + "</a><br>";
                                seccionBusquedas += "<div style='display:none' id='opciones"+i+"'><a href='#' id='opc'>Editar</a> <a href='#' onclick='javascript:itemEsconder("+i+")'>Eliminar</a></div><br>";
                                seccionBusquedas += "</div>";
                                i++;
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
                    var image = actual_JSON[k][l].image;
                    var title = actual_JSON[k][l].title;
                    var teaser = actual_JSON[k][l].teaser;
                    //grabamos titulos para mostrar en el autocomplete
                    listaTitulos.push(title);

                    if(i<cantidad){//salimos si se pasa de la cuenta
                        if((title.toLowerCase().indexOf(busqueda.toLowerCase())>=0 || teaser.toLowerCase().indexOf(busqueda.toLowerCase())>=0) || busqueda == ""){
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
        }
        //agregamos los datos a los respectivos contenedores
        document.getElementById("searches").innerHTML = seccionBusquedas;
        document.getElementById("categories").innerHTML = seccionCategorias;
        document.getElementById("language").innerHTML = seccionIdioma;
        document.getElementById("edition").innerHTML = seccionPresentacion;
        document.getElementById("books").innerHTML = seccionLibros;

        awesomplete.list = listaTitulos; //agregar titulos para la busqueda
    });
}




