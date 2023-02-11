var perlin = require('perlin-noise');
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

function generateHexMap(worldBiomes){
	// determine the block size for the world biomes randomly within a range
	populateMap(worldBiomes);
}

function populateMap(biomelist){
	var counter = 1;
	var letter   = 97;
	var newHexMap = hexMap;
	
	var p = perlin.generatePerlinNoise(ROW_LENGTH, COL_LENGTH)
	
	for(var i = 0; i < p.length; i++){
		p[i] = Math.floor(p[i] * biomelist.length) + 1;
	}
	
	var counter = 0;
	for(var i = 1; i < COL_LENGTH; i++){
		for(var j = 1; j < ROW_LENGTH; j++){
			setHexBiome(i,j,biomelist[p[counter]-1]);
			counter++;
		}
		counter++;
	}
	
	newHexMap.forEach(function(line) {
		if(line[4] == '-' || line[10] == '-' && counter > 1){// if we are in a line that needs coords and we have already made 1st pass
			counter = 1;
			letter++;
		}
		while(line.includes('-') || line.includes('#')){
			//add coordinates to map
			//TODO: refactor the coordinate system to make sense
			line = line.replace("\-----\\", "\ "+String.fromCharCode(letter)+"."+counter.toString()+" \\");
			line = line.replace("\#######/", "\  "+rollLandmark()+"    /");
			counter++;
		}
		console.log(line);
	});	
	
	return newHexMap;
}

function rollLandmark(){
	var landmark = rollRange(20);
	
	if(landmark >= 1 && landmark <= 3)
		return "r" //ruins
	if(landmark >= 4 && landmark <= 6)
		return "c"//5RD, lair, etc
	if(landmark >= 7 && landmark <= 9)
		return "^"//natural formation
	if(landmark >= 10 && landmark <= 11)//should actually be based on biome's monster DC
		return "!"//monster
	if(landmark >= 12 && landmark <= 14)
		return "X"
	if(landmark >= 15 && landmark <= 16)
		return "$"//settlement
	if(landmark == 17)
		return "%"//magic or tech
	if(landmark >= 18 && landmark <= 20)
		return "&"	
	return ' '
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

function propagateBiome(row,col,seed, bias){
	// create array of adjacent strings
	// if bias is not zero
	// iterate through array and set their biome to seed value
	// when each is set to biome, call tihs method again on
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
//["Airborne","Aquatic","Arctic","Desert","Forest","Marsh","Mountain","Plains","Space","Subterranean","Urban","Weird"]
generateHexMap(["Aquatic","Forest","Mountain","Plains"]);

