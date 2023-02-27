var perlin = require('perlin-noise');
const random5RD = require('./5RoomDungeonGenerator.js');
const randomLoot = require('./EquipmentScraper.js');

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
				
const hexMapAbstract = [['a02'],[],[],[]];
		   
// element 0 in the array is the required actions
var hexploration_stats = {
	Airborne:     [1, 17, '\u2601'],//Assumes a fly (airborne or space) or swim (aquatic) speed
    Aquatic:      [1, 14, '\u26EC'],//Assumes a fly (airborne or space) or swim (aquatic) speed
    Arctic:       [2, 17, '\u2744'],
    Desert:       [2, 17, '\u263C'],
    Forest:       [3, 12, 'T'],
    Marsh:        [2, 12, '%'],
    Mountain:     [2, 16, '\u26F0'],
    Plains:       [1, 16, 's'],
    Space:        [1, 17, '\u2605'],//Assumes a fly (airborne or space) or swim (aquatic) speed
    Subterranean: [2, 16, 'C'],
    Urban:        [1, 10, '\u220F'],
    Weird:        [2, 14, '?'],
}

const ROW_LENGTH = 14
const COL_LENGTH = 10

async function generateHexMap(worldBiomes){
	// determine the block size for the world biomes randomly within a range
	populateMap(worldBiomes);
}

async function populateMap(biomelist){
	var counter = 1;
	var letter   = 97;
	var newHexMap = hexMap;
	
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
	newHexMap.forEach(function(line, index) {
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
			line = line.replace("\#######/", "\   "+rollLandmark(getHexCoord(index, line.indexOf("\#######/")))+"   /");
			counter += 2;
		}
		console.log(line);
	});	
	return newHexMap;
}

// function letterIsUpRow(c){
	// inverting this because line parsers flip upRows to downRows and vice versa 
	// return (c == 'a' || c == 'c' || c == 'e' || c == 'g' || c == 'i' || c == 'k' || c == 'm' || c == 'o' ||c == 'q');
// }

async function printLandmarkData(coord, landmark){
	if(landmark == "r"){
		var RT = await randomLoot.rollLootPool(2,1,3,1,10,2,25);
		RT.unshift("\n"+coord);
		for(var i = 0; i < RT.length; i++)
			console.log(RT[i]);
	}
	if(landmark == "c"){
		var RD = await random5RD.generate5RD(5,3,5,2,10,4,50);
		RD.unshift("\n"+coord);
		for(var i = 0; i < RD.length; i++)
			console.log(RD[i]);
	}
	if(landmark == "%"){
		var RT = await randomLoot.rollLootPool(5,0,0,1,30,2,90);
		RT.unshift("\n"+coord);
		for(var i = 0; i < RT.length; i++)
			console.log(RT[i]);
	}
}

function rollLandmark(coord){
	if (coord.length == 0)
		return ' ';
	var landmark = rollRange(20);
	
	if(landmark >= 1 && landmark <= 3){
		printLandmarkData(coord, "r");
		return "r" //ruins
	}
	if(landmark >= 4 && landmark <= 6){
		printLandmarkData(coord, "c");
		return "c"//5RD, lair, etc
	}
	if(landmark >= 7 && landmark <= 9){
		//skill challenge
		return "^"//natural formation
	}
	if(landmark >= 10 && landmark <= 11){//should actually be based on biome's monster DC
		//TODO: rollMonster
		return "!"//monster
	}
	if(landmark >= 12 && landmark <= 14){
		return "X"//campsite
	}
	if(landmark >= 15 && landmark <= 16){
		return "$"//settlement
	}
	if(landmark == 17){
		printLandmarkData(coord, "%");
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

function getHexBiome(row, col){
		
	var mapRow;
	var ret = ""
	
	if(col % 2 == 0){
		if(row == 1)
			mapRow = 2;
		else
			mapRow = (row*4)-2
	}else{
		mapRow = row*4
	}
	
	switch (col){
		case 1:
			ret = hexMap[mapRow].substring(1,10);
			break;
		case 2:
			ret = hexMap[mapRow].substring(8,17);
			break;
		case 3:
			ret = hexMap[mapRow].substring(15,24);
			break;
		case 4:
			ret = hexMap[mapRow].substring(22,31);
			break;
		case 5:
			ret = hexMap[mapRow].substring(29,38);
			break;
		case 6:
			ret = hexMap[mapRow].substring(36,45);
			break;
		case 7:
			ret = hexMap[mapRow].substring(43,52);
			break;
		case 8:
			ret = hexMap[mapRow].substring(50,59);
			break;
		case 9:
			ret = hexMap[mapRow].substring(57,66);
			break;
		case 10:
			ret = hexMap[mapRow].substring(64,73);
			break;
		case 11:
			ret = hexMap[mapRow].substring(71,80);
			break;
		case 12:
			ret = hexMap[mapRow].substring(78,87);
			break;
		case 13:
			ret = hexMap[mapRow].substring(85,95);
			break;
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

module.exports = {
	populateMap: async function populateMap(biomelist){
		var counter = 1;
		var letter   = 97;
		var newHexMap = hexMap;
		
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
		newHexMap.forEach(function(line, index) {
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
				line = line.replace("\#######/", "\   "+rollLandmark(getHexCoord(index, line.indexOf("\#######/")))+"   /");
				counter += 2;
			}
			console.log(line);
		});	
		return newHexMap;
	}
}
//["Airborne","Aquatic","Arctic","Desert","Forest","Marsh","Mountain","Plains","Space","Subterranean","Urban","Weird"]
//generateHexMap(["Aquatic","Forest","Mountain","Plains"]);

