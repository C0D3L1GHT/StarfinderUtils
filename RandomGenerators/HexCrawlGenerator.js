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
		   
// element 0 in the array is the required 
var hexploration_stats = {
	Airborne:     [1, 17, '\u2601'],//works //Assumes a fly (airborne or space) or swim (aquatic) speed
    Aquatic:      [1, 14, '\u26EC'],//works //Assumes a fly (airborne or space) or swim (aquatic) speed
    Arctic:       [2, 17, '\u2744'], //works
    Desert:       [2, 17, '\u263C'], //works
    Forest:       [3, 12, 'T'],
    Marsh:        [2, 12, '%'],
    Mountain:     [2, 16, '\u26F0'], //works
    Plains:       [1, 16, 's'],
    Space:        [1, 17, '\u2605'], //works //Assumes a fly (airborne or space) or swim (aquatic) speed
    Subterranean: [2, 16, 'C'],
    Urban:        [1, 10, '\u220F'], //works
    Weird:        [2, 14, '?'],
}

const BLOCK_SIZE = 6

function generateHexMap(worldBiomes){
	// determine the block size for the world biomes randomly within a range
	populateMap(worldBiomes,BLOCK_SIZE);
}

function populateMap(biomelist, blockSize){
	var counter = 1;
	var letter   = 97;
	var newHexMap = hexMap;
	
	for(var i = 0; i < biomelist.length; i++){
		var row = rollRange(8);
		var col = rollRange(12);
	
		if(getHexBiome(row,col) == "/*******\\")
			setHexBiome(row,col,biomelist[i])
		else
			i--;
		
	}
	
	newHexMap.forEach(function(line) {
		while(line.includes('-') || line.includes('#')){
			//add coordinates to map
			//TODO: refactor the coordinate system to make sense
			line = line.replace("\-----\\", "\ "+counter.toString()+"."+String.fromCharCode(letter)+" \\");
			line = line.replace("\#######/", "\  "+rollLandmark()+"    /");
			if(counter >= 9){
				counter = 1;
				letter++;
			}else
				counter++;
		
		    // when adding a block, roll to determine if an encounter is there
		
		    // if no encounter, add nothing, add small settlement, add dungeon
		}
		console.log(line);
	});	
	
	return newHexMap;
}

function rollLandmark(){
	var landmark = rollRange(20);
	
	if(landmark > 9 && landmark < 12)//should actually be based on biome's monster DC
		return "!"
	
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
	
	switch(str){
		case "Airborne":
			biomeStr = hexploration_stats.Airborne[2]; 
			break;
		case "Aquatic":
			biomeStr = hexploration_stats.Aquatic[2];
			break;
		case "Arctic":
			biomeStr = hexploration_stats.Arctic[2];
			break;
		case "Desert":
			biomeStr = hexploration_stats.Desert[2];
			break;
		case "Forest":
			biomeStr = hexploration_stats.Forest[2];
			break;
		case "Marsh":
			biomeStr = hexploration_stats.Marsh[2];
			break;
		case "Mountain":
			biomeStr = hexploration_stats.Mountain[2];
			break;
		case "Plains":
			biomeStr = hexploration_stats.Plains[2];
			break;
		case "Space":
			biomeStr = hexploration_stats.Space[2];
			break;
		case "Subterranean":
			biomeStr = hexploration_stats.Subterranean[2];
			break;
		case "Urban":
			biomeStr = hexploration_stats.Urban[2];
			break;
		case "Weird":
			biomeStr = hexploration_stats.Weird[2];
			break;
	}
	
	biomeStr = "/   "+biomeStr+"   \\"
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



function rollRange(r){
    return Math.floor(Math.random() * r) + 1;
}
//["Airborne","Aquatic","Arctic","Desert","Forest","Marsh","Mountain","Plains","Space","Subterranean","Urban","Weird"]
generateHexMap(["Airborne","Aquatic"]);
