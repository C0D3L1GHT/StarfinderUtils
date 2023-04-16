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

var phoneme3=["a","ak","an","and","ar","at","ban","ces","da","dea","dia","dis","en","eus","hia","i","ia","iem","in","ine",
"int","ion","ira","ium","iva","ko","lai","li","lin","lom","lon","na","nak","nd","ne","oi","om","on","on","or","os","ow",
"phys","ra","rat","ren","res","rik","rine","ry","rys","sa","sara","so","tae","th","th","ti","tis","ton","trio","urn",
"us","va","vel","vel","ven","xa","ya","zar","zo"];

const ordinal_suffix = [" Prime", " Secundus", " Tertius", " Quartus", " Quintus", " Sextus", " Septimus", " Octavus", " Nonus", " Decimus"];
const numeral_suffix = [" I", " II", " III", " IV", " V", " VI", " VII", " VII", " IX", " X"];
const symbol_suffix  = ["-A","-B","-C","-D","-E","-F","-G","-H","-I","-J"];
const suffixes_list  = [ordinal_suffix, numeral_suffix, symbol_suffix]; 

//TODO: add clues and mysteries that have answers on other planets in the system
//                        high level have answers in other sectors 
//                         low level have answers on same planet
//TODO: make sector generator
//TODO: systems have average level, planets have average level that is gradient to system level

async function generateSystem(sector, level, diff){
	//Systems should have a group of planets (1-10)
	var planets = [];
	var systemName = nameGen();
	if (!fs.existsSync("./Sectors/"+sector+"/"+systemName))
		fs.mkdirSync("./Sectors/"+sector+"/"+systemName, { recursive: true });
	var list = suffixes_list[rollRange(suffixes_list.length)-1];
	for (var i = 0; i < 1; i++){//for (var i = 0; i < rollRange(10); i++){
		var planetInfo = await randomPlanet.generatePlanet(level, diff);
		var suffix = list[i];
		planetInfo.unshift("Level:           " + gaussianRandom(level, 1));
		planetInfo.unshift("Name:            " + systemName + suffix);
		planets.push(planetInfo);
		addListToFile(planetInfo,"./Sectors/"+sector+"/"+systemName+"/"+systemName+suffix);
		planets.push("\n\n");
	}
	// for(var i = 0; i < planets.length; i++)
		// console.log(planets[i]);
	return planets;
	//TODO: Look into outputting a picture somehow
}

function nameGen(){
	name = "";
	name=phoneme1[Math.floor(Math.random()*phoneme1.length)] + phoneme2[Math.floor(Math.random()*phoneme2.length)];
	if(rollRange(3) < 3)//names should be 2 phonemes a third of the time
		name += phoneme3[Math.floor(Math.random()*phoneme3.length)]
	name = name.charAt(0).toUpperCase() + name.slice(1);//Capitalize
	return name;
}

function rollRange(r){
  return Math.floor(Math.random() * r) + 1;
}

function gaussianRandom(mean=0, stdev=1) {
    let u = 1 - Math.random(); // Converting [0,1) to (0,1]
    let v = Math.random();
    let z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    // Transform to the desired mean and standard deviation:
	let ret = Math.floor(z * stdev + mean);
	if (ret < 1) ret = 1; // floor level at 1
	if(ret > 20) ret = 20; //cap ret at 20;
    return ret;
}

function addListToFile(list, fileName){
	for(let i = 0; i < list.length; i++){
		var str2add = list[i];
		fs.appendFileSync(fileName+".txt", str2add+'\n', (err) => {
			if (err) throw err;
		})
    }
}

module.exports = {
	generateStellarSystem: async function generateSystem(sector, level, diff){
		//Systems should have a group of planets (1-10)
		var planets = [];
		var systemName = nameGen();
		if (!fs.existsSync("./Sectors/"+sector+"/"+systemName))
			fs.mkdirSync("./Sectors/"+sector+"/"+systemName, { recursive: true });
		var list = suffixes_list[rollRange(suffixes_list.length)-1];
		for (var i = 0; i < rollRange(10); i++){//for (var i = 0; i < rollRange(10); i++){
			var planetInfo = await randomPlanet.generatePlanet(level, diff);
			var suffix = list[i];
			planetInfo.unshift("Level:           " + gaussianRandom(level, 1));
			planetInfo.unshift("Name:            " + systemName + suffix);
			planets.push(planetInfo);
			addListToFile(planetInfo,"./Sectors/"+sector+"/"+systemName+"/"+systemName+suffix);
			planets.push("\n\n");
		}
		// for(var i = 0; i < planets.length; i++)
			// console.log(planets[i]);
		return planets;
	}
}

//generateSystem("_testSystem",1, 0);