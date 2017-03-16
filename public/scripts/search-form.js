function searchForm(name){
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


function setup(){
	loadJSON(JSON_FILE,gotData);
}
function gotData(data){
	alert(data);
	alert("lol");
}



var valor = searchForm("search");

if(valor==""){
	//document.getElementById("books").innerHTML = JSON_FILE;
}else{
	//document.getElementById("books").innerHTML = valor;
}