const fs = require('fs');
const path = require('path');
const randomPlanet = require('./PlanetGenerator.js');

var phoneme1=["a","ab","ag","al","am","ap","ar","ark","arl","as","ash","ast","au","auct","az","ba","bir","bre",
"cas","cen","ch","cho","cor","dae","dai","di","e","ech","el","em","en","er","es","fal","gad","glu","gras","ha",
"chuu","hei","i","il","ist","jed","kal","li","lo","ma","mid","na","nej","ner","nod","or","ori","pre",
"pri","qa","quan","rak","ram","rath","ri","rta","sep","shad","shim","sil","sus","ta","tar","thes","thi","toph",
"tri","tril","tud","u","ur","ut","vah","vath","ver","vhar","voh","wey","yr","ze","zer","zo"];
var phoneme2=["all","am","ao","ar","ari","ax","ba","bal","bar","bor","br","ces","cha","chuu","cor","ct","da","dan","dar",
"del","dra","e","e","e","ek","em","esh","eth","ev","fa","gesh","go","gox","gy","i","i","ine","ios","ium","ke","ki","kil",
"kit","ko","kon","lan","lid","lur","m","mal","mor","na","nam","nax","or","os","ox","per","phe","qu","qua","r","ra","rak",
"ral","ran","rin","rok","rr","sa","sal","sar","sel","sha","shal","tev","tha","the","thun","tran","tro","tu","tus","un",
"ur","uu","uv","va","ven","wa","xa","y","yeth","yp","zer","zo"];
var phoneme3=["on","lon","lom","om","ton","ion","i","an","tae","nd","and","lin","in","so","int","urn","ti","tis",
"ow","da","vel","va","zar","ko","dea","rys","trio","oi","dia","ar","ban","vel","na","on","i","ak","at","sa","ra",
"ne","nak","dis","or","en","lai","phys","ry","ia","rat","li","os","ya","ren","ven","ira","res","sara","rik",
"th","a","hia","us","iem","ine","eus","iva","ces","ium","rine","xa","th","zo"];

const ordinal_suffix = [" Prime", " Secundus", " Tertius", " Quartus", " Quintus", " Sextus", " Septimus", " Octavus", " Nonus", " Decimus"];
const numeral_suffix = [" I", " II", " III", " IV", " V", " VI", " VII", " VII", " IX", " X"];
const symbol_suffix  = ["-A","-B","-C","-D","-E","-F","-G","-H","-I","-J"];
const suffixes_list  = [ordinal_suffix, numeral_suffix, symbol_suffix]; 
//TODO: add clues and mysteries that have answers on other planets in the list
//TODO: make sector generator

async function generateSystem(){
	//Systems should have a group of planets (1-10)
	var planets = [];
	var systemName = nameGen();
	var list = suffixes_list[rollRange(suffixes_list.length)-1];
	for (var i = 0; i < rollRange(10); i++){
		var planetInfo = await randomPlanet.generatePlanet();
		var suffix = list[i];
		planetInfo.unshift("Name:            " + systemName + suffix);
		planets.push(planetInfo);
		planets.push("\n\n");
	}
	
	for(var i = 0; i < planets.length; i++)
		for(var j = 0; j < planets[i].length; j++)
		console.log(planets[i][j]);
	//TODO: Look into outputting a picture somehow
}

function nameGen(){
	name = "";
	name=phoneme1[Math.floor(Math.random()*phoneme1.length)] + phoneme2[Math.floor(Math.random()*phoneme2.length)];
	if(isVowel(name[name.length-1]) && rollRange(3) < 3)
		name += phoneme3[Math.floor(Math.random()*phoneme3.length)]
	name = name.charAt(0).toUpperCase() + name.slice(1);//Capitalize
	return name;
}

function rollRange(r){
  return Math.floor(Math.random() * r) + 1;
}

function isVowel(c){
	return c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u';
}

generateSystem();