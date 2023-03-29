var perlin = require('perlin-noise');
const random5RD = require('./5RoomDungeonGenerator.js');
const randomLoot = require('./EquipmentScraper.js');
const randomMonsters = require('./MonsterListGenerator.js');

var averageLevel = 1;
var levelDiff	 = 0;

function setAverageLevel(lvl){
	if(lvl < 20 && lvl > 0.3)
		averageLevel= lvl;
	else
		console.log("Averge level outside scope");
}

function setLevelDiff(diff){
	if(averageLevel - diff < 20 && averageLevel - diff > -1 )
		levelDiff = diff;
	else
		console.log("Level difference outside scope")
}

//TODO: refactor this to be starfinder's hexmap in the GEM
const hexMap = ["          _____         _____         _____         _____         _____         _____                 ",
                "         /-----\\       /-----\\       /-----\\       /-----\\       /-----\\       /-----\\          ",
                "   _____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____    ",
                "  /-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\  ",
                " /*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\ ",
                " \\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/ ",
                "  \\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/  ",
                "  /-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\  ",
                " /*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\ ",
                " \\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/ ",
                "  \\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/  ",
                "  /-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\  ",
                " /*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\ ",
                " \\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/ ",
                "  \\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/  ",
                "  /-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\  ",
                " /*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\ ",
                " \\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/ ",
                "  \\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/  ",
                "  /-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\  ",
                " /*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\ ",
                " \\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/ ",
                "  \\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/  ",
                "  /-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\  ",
                " /*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\ ",
                " \\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/ ",
                "  \\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/  ",
                "  /-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\  ",
                " /*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\ ",
                " \\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/ ",
                "  \\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/  ",
				"  /-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\  ",
                " /*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\ ",
                " \\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/ ",
                "  \\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/  ",
				"  /-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\#######/-----\\  ",
                " /*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\_____/*******\\ ",
                " \\#######/     \\#######/     \\#######/     \\#######/     \\#######/     \\#######/     \\#######/ ",
                "  \\_____/       \\_____/       \\_____/       \\_____/       \\_____/       \\_____/       \\_____/  "];

// a list of all of the landmark details
var landmarkKey = [];		   
// element 0 in the array is the required actions
// Airborne = '\u2601'
// Aquatic  = '\u26EC'
// Arctic	= '\u2744'
// Desert 	= '\u263C'
// Mountain = '\u26F0'
// Space 	= '\u2605'
// Urban 	= '\u220F'
var hexploration_stats = {
	Airborne:     [1, 17, 'A'],//Assumes a fly (airborne or space) or swim (aquatic) speed
    Aquatic:      [1, 14, '@'],//Assumes a fly (airborne or space) or swim (aquatic) speed
    Arctic:       [2, 17, '*'],
    Desert:       [2, 17, 'D'],
    Forest:       [3, 12, 'T'],
    Marsh:        [2, 12, '%'],
    Mountain:     [2, 16, 'M'],
    Plains:       [1, 16, 'P'],
    Space:        [1, 17, 'S'],//Assumes a fly (airborne or space) or swim (aquatic) speed
    Subterranean: [2, 16, 'C'],
    Urban:        [1, 10, 'U'],
    Weird:        [2, 14, '?'],
}

const ROW_LENGTH = 14
const COL_LENGTH = 10

async function generateHexMap(worldBiomes, averageLvl, lvlDiff){
	averageLevel = averageLvl;
	levelDiff = lvlDiff;
	var ret = await populateMap(worldBiomes);
	for(var i = 0; i < landmarkKey.length; i++)
		ret.push(landmarkKey[i]);
	// for(var i = 0; i < ret.length; i++)
		// console.log(ret[i]);
	return ret;
}

async function populateMap(biomelist){
	var counter = 1;
	var letter   = 97;
	var newHexMap = hexMap;
	// newhexMap keeps the landmarkKey lines in memory when generating planets after 1st for some reason
	// resetting the length to 39 removes those lines and fixes the issue
	newHexMap.length = 39;
	var p = perlin.generatePerlinNoise(ROW_LENGTH, COL_LENGTH)
	
	for(var i = 0; i < p.length; i++){
		p[i] = Math.floor(p[i] * biomelist.length) + 1;
	}
	
	counter = 0;
	for(var i = 1; i < COL_LENGTH; i++){
		for(var j = 1; j < ROW_LENGTH; j++){
			setHexBiome(i,j,biomelist[p[counter]-1]);
			counter++;
		}
		counter++;
	}
	
	counter = 1;
	for(var i = 0; i < newHexMap.length; i++){
		var line = newHexMap[i];
		var index = i;
		
		if(line[4] == '-') counter = 1;
		if (index > 1 && line.includes('-')) letter++;
		if(line[10] == '-')	counter = 2;
		
		while(line.includes('-') || line.includes('#')){
			//extract coordinates for landmarks
			if (counter < 10){
				line = line.replace("\-----\\", "\ "+String.fromCharCode(letter)+"0"+counter.toString()+" \\");
			}
			else{
				line = line.replace("\-----\\", "\ "+String.fromCharCode(letter)+""+counter.toString()+" \\");
			}
			var landmark = await rollLandmark(getHexCoord(index, line.indexOf("\#######/")));
			line = line.replace("\#######/", "\   "+landmark+"   /");
			counter += 2;
		}
		newHexMap[index] = line;
		//console.log(line);
	}
	return newHexMap;
}

async function getLandmarkData(coord, landmark){
	//console.log(coord + " " + landmark)
	var levelCrit = rollRange(500);
	if(levelCrit == 1){
		averageLevel = 20;
		levelDiff = 0;
	}
	if(averageLevel == 1)
		levelDiff = 0;
	
	//Math.floor(Math.random() * ((averageLevel + levelDiff) - (averageLevel - levelDiff)) + (averageLevel - levelDiff));
	var level = gaussianRandom(averageLevel,2);
	
	if(landmark == "r"){
		var RT = await randomLoot.rollLootPool(level,3,1,10,2,25);
		RT.unshift("\n"+coord);
		for(var i = 0; i < RT.length; i++)
			landmarkKey.push(RT[i]);
	}
	if(landmark == "c"){
		var RD = await random5RD.generate5RD(getHexBiome(coord),level,5,2,10,4,50);
		RD.unshift("\n"+coord);
		for(var i = 0; i < RD.length; i++)
			landmarkKey.push(RD[i]);
	}
	if(landmark == "%"){
		var RT = await randomLoot.rollLootPool(level,0,1,30,2,90);
		RT.unshift("\n"+coord);
		for(var i = 0; i < RT.length; i++)
			landmarkKey.push(RT[i]);
	}
	if(landmark == "!"){
		var RM = await randomMonsters.generateMonsters(getHexBiome(coord), level);
		RM.unshift("\n"+coord);
		for(var i = 0; i < RM.length; i++)
			landmarkKey.push(RM[i]);
	}
	return;
}

async function rollLandmark(coord){
	if (coord.length == 0)
		return ' ';
	var landmark = rollRange(20);
	
	if(landmark >= 1 && landmark <= 3){
		getLandmarkData(coord, "r");
		return "r" //ruins
	}
	if(landmark >= 4 && landmark <= 6){
		getLandmarkData(coord, "c");
		return "c"//5RD, lair, etc
	}
	if(landmark >= 7 && landmark <= 9){
		//skill challenge
		return "^"//natural formation
	}
	if(landmark >= 10 && landmark <= 11){//should actually be based on biome's monster DC
		getLandmarkData(coord, "!");
		return "!"//monster
	}
	if(landmark >= 12 && landmark <= 14){
		return "X"//campsite
	}
	if(landmark >= 15 && landmark <= 16){
		return "$"//settlement
	}
	if(landmark == 17){
		getLandmarkData(coord, "%");
		return "%"//magic or tech
	}
	if(landmark >= 18 && landmark <= 20){
		//skill challenge
		return "&"//unusual
	}
	return ' ';
}

function getHexCoord(row, col){
	var ret = "";
	if(row < 2 || col < 0)
		return ret;
	
	switch (row){
		case 3:
			ret += "a";
			break;
		case 5:
			ret += "b";
			break;
		case 7:
			ret += "c";
			break;
		case 9:
			ret += "d";
			break;
		case 11:
			ret += "e";
			break;
		case 13:
			ret += "f";
			break;
		case 15:
			ret += "g";
			break;
		case 17:
			ret += "h";
			break;
		case 19:
			ret += "i";
			break;
		case 21:
			ret += "j";
			break;
		case 23:
			ret += "k";
			break;
		case 25:
			ret += "l";
			break;
		case 27:
			ret += "m";
			break;
		case 29:
			ret += "n";
			break;
		case 31:
			ret += "o";
			break;
		case 33:
			ret += "p";
			break;
		case 35:
			ret += "q";
			break;
		case 37:
			ret += "r";
			break;
		default:
			ret += "";
	}
	
	switch (col){
		case 2:
			ret += "01"
			break;
		case 9:
			ret += "02"
			break;
		case 16:
			ret += "03"
			break;
		case 23:
			ret += "04"
			break;
		case 30:
			ret += "05"
			break;
		case 37:
			ret += "06"
			break;
		case 44:
			ret += "07"
			break;
		case 51:
			ret += "08"
			break;
		case 58:
			ret += "09"
			break;
		case 65:
			ret += "10"
			break;
		case 72:
			ret += "11"
			break;
		case 79:
			ret += "12"
			break;
		case 86:
			ret += "13"
			break;
	}
	return ret;
}

function getHexBiome(coord){		
	var ret = "";
	var row = coord.substring(0,1);
	var col = coord.substring(1);
	var biomeRow = 0;
	var biomeCol = 0;
	
	//console.log(row + " " + col);
	
	switch(row){
		case 'a':
			biomeRow = 2;
			break;
		case 'b':
			biomeRow = 4;
			break;
		case 'c':
			biomeRow = 6;
			break;
		case 'd':
			biomeRow = 8;
			break;
		case 'e':
			biomeRow = 10;
			break;
		case 'f':
			biomeRow = 12;
			break;
		case 'g':
			biomeRow = 14;
			break;
		case 'h':
			biomeRow = 16;
			break;
		case 'i':
			biomeRow = 18;
			break;
		case 'j':
			biomeRow = 20;
			break;
		case 'k':
			biomeRow = 22;
			break;
		case 'l':
			biomeRow = 24;
			break;
		case 'm':
			biomeRow = 26;
			break;
		case 'n':
			biomeRow = 28;
			break;
		case 'o':
			biomeRow = 30;
			break;
		case 'p':
			biomeRow = 32;
			break;
		case 'q':
			biomeRow = 34;
			break;
		case 'r':
			biomeRow = 36;
			break;
	}
	
	switch (col){
		case '01':
			biomeCol = 5;
			break;
		case '02':
			biomeCol = 12;
			break;
		case '03':
			biomeCol = 19;
			break;
		case '04':
			biomeCol = 26;
			break;
		case '05':
			biomeCol = 33;
			break;
		case '06':
			biomeCol = 40;
			break;
		case '07':
			biomeCol = 47;
			break;
		case '08':
			biomeCol = 54;
			break;
		case '09':
			biomeCol = 61;
			break;
		case '10':
			biomeCol = 68;
			break;
		case '11':
			biomeCol = 75;
			break;
		case '12':
			biomeCol = 82;
			break;
		case '13':
			biomeCol = 89;
			break;
	}
	
	var coordSymbol = hexMap[biomeRow].substring(biomeCol, biomeCol + 1);
	
	for (let item in hexploration_stats) {
		if (isNaN(Number(item)) && coordSymbol == hexploration_stats[item][2]) {
			ret = item;
		}
	}
	
	return ret;
}

function setHexBiome(row, col, str){
	
	var mapRow;
	var biomeStr;
	
	if(col % 2 == 0){
		if(row == 1)
			mapRow = 2;
		else
			mapRow = (row*4)-2
	}else{
		mapRow = row*4
	}       
	
	biomeStr = "/   "+stringToBiome(str,2)+"   \\"
	switch (col){
		case 1:
			hexMap[mapRow] = hexMap[mapRow].substring(0,1)+biomeStr+hexMap[mapRow].substring(10);
			break;
		case 2:
			hexMap[mapRow] = hexMap[mapRow].substring(0,8)+biomeStr+hexMap[mapRow].substring(17);
			break;
		case 3:
			hexMap[mapRow] = hexMap[mapRow].substring(0,15)+biomeStr+hexMap[mapRow].substring(24);
			break;
		case 4:
			hexMap[mapRow] = hexMap[mapRow].substring(0,22)+biomeStr+hexMap[mapRow].substring(31);
			break;
		case 5:
			hexMap[mapRow] = hexMap[mapRow].substring(0,29)+biomeStr+hexMap[mapRow].substring(38);
			break;
		case 6:
			hexMap[mapRow] = hexMap[mapRow].substring(0,36)+biomeStr+hexMap[mapRow].substring(45);
			break;
		case 7:
			hexMap[mapRow] = hexMap[mapRow].substring(0,43)+biomeStr+hexMap[mapRow].substring(52);
			break;
		case 8:
			hexMap[mapRow] = hexMap[mapRow].substring(0,50)+biomeStr+hexMap[mapRow].substring(59);
			break;
		case 9:
			hexMap[mapRow] = hexMap[mapRow].substring(0,57)+biomeStr+hexMap[mapRow].substring(66);
			break;
		case 10:
			hexMap[mapRow] = hexMap[mapRow].substring(0,64)+biomeStr+hexMap[mapRow].substring(73);
			break;
		case 11:
			hexMap[mapRow] = hexMap[mapRow].substring(0,71)+biomeStr+hexMap[mapRow].substring(80);
			break;
		case 12:
			hexMap[mapRow] = hexMap[mapRow].substring(0,78)+biomeStr+hexMap[mapRow].substring(87);
			break;
		case 13:
			hexMap[mapRow] = hexMap[mapRow].substring(0,85)+biomeStr+hexMap[mapRow].substring(94);
			break;	
	}
}

function stringToBiome(str, num){
	switch(str){
		case "Airborne":
			return hexploration_stats.Airborne[num]; 
			break;
		case "Aquatic":
			return hexploration_stats.Aquatic[num];
			break;
		case "Arctic":
			return hexploration_stats.Arctic[num];
			break;
		case "Desert":
			return hexploration_stats.Desert[num];
			break;
		case "Forest":
			return hexploration_stats.Forest[num];
			break;
		case "Marsh":
			return hexploration_stats.Marsh[num];
			break;
		case "Mountain":
			return hexploration_stats.Mountain[num];
			break;
		case "Plains":
			return hexploration_stats.Plains[num];
			break;
		case "Space":
			return hexploration_stats.Space[num];
			break;
		case "Subterranean":
			return hexploration_stats.Subterranean[num];
			break;
		case "Urban":
			return hexploration_stats.Urban[num];
			break;
		case "Weird":
			return hexploration_stats.Weird[num];
			break;
	}
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

module.exports = {
	generateHexMap: async function generateHexMap(worldBiomes, averageLvl, lvlDiff){
		averageLevel = averageLvl;
		levelDiff = lvlDiff;
		var ret = await populateMap(worldBiomes);
		for(var i = 0; i < landmarkKey.length; i++)
			ret.push(landmarkKey[i]);
		// for(var i = 0; i < ret.length; i++)
			// console.log(ret[i]);
		return ret;
	}
}
//["Airborne","Aquatic","Arctic","Desert","Forest","Marsh","Mountain","Plains","Space","Subterranean","Urban","Weird"]
//generateHexMap(["Aquatic","Forest","Mountain","Plains"],8,0);

