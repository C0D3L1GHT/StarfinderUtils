const fetch = require('isomorphic-fetch')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');
const path = require('path');
const randomRace = require('./RaceScraper.js');

const XP_TABLE = new Map([
	[0.3, 135],
	[0.5, 200],
	[1, 400],
	[2, 600],
	[3, 800],
	[4, 1200],
	[5, 1600],
	[6, 2400],
	[7, 3200],
	[8, 4800],
	[9, 6400],
	[10, 9600],
	[11, 12800],
	[12, 19200],
	[13, 25600],
	[14, 38400],
	[15, 51200],
	[16, 76800],
	[17, 102400],
	[18, 153600],
	[19, 204800],
	[20, 307200],
	[21, 409600],
	[22, 614400],
	[23, 819200],
	[24, 1228800],
	[25, 1638400],
]);

const WEALTH_TABLE = new Map([
	[0.3, 150],
	[0.5, 230],
	[1, 460],
	[2, 775],
	[3, 1100],
	[4, 1400],
	[5, 3100],
	[6, 3900],
	[7, 4600],
	[8, 5400],
	[9, 10000],
	[10, 14700],
	[11, 25000],
	[12, 34000],
	[13, 50000],
	[14, 77000],
	[15, 113000],
	[16, 178000],
	[17, 260000],
	[18, 405000],
	[19, 555000],
	[20, 782000]]
);

// [CR, info]
const TRAP_TABLE = new Map([
	[0.5,"\nPerception DC: 17\nDisable DC: 12\nAttack: +9\nDamage: 2d6\nSave DC: 11"],
	[1,"\nPerception DC: 21\nDisable DC: 16\nAttack: +11\nDamage: 3d6\nSave DC: 12"],
	[2,"\nPerception DC: 23\nDisable DC: 18\nAttack: +12\nDamage: 4d6\nSave DC: 13"],
	[3,"\nPerception DC: 24\nDisable DC: 19\nAttack: +13\nDamage: 6d6\nSave DC: 14"],
	[4,"\nPerception DC: 26\nDisable DC: 21\nAttack: +14\nDamage: 4d10+2\nSave DC: 15"],
	[5,"\nPerception DC: 27\nDisable DC: 22\nAttack: +15\nDamage: 4d12+4\nSave DC: 15"],
	[6,"\nPerception DC: 29\nDisable DC: 24\nAttack: +17\nDamage: 6d12\nSave DC: 16"],
	[7,"\nPerception DC: 30\nDisable DC: 25\nAttack: +19\nDamage: 8d10\nSave DC: 17"],
	[8,"\nPerception DC: 32\nDisable DC: 27\nAttack: +20\nDamage: 8d12\nSave DC: 18"],
	[9,"\nPerception DC: 33\nDisable DC: 28\nAttack: +22\nDamage: 10d10+5\nSave DC: 18"],
	[10,"\nPerception DC: 35\nDisable DC: 30\nAttack: +23\nDamage: 10d12\nSave DC: 19"],
	[11,"\nPerception DC: 36\nDisable DC: 31\nAttack: +24\nDamage: 12d12\nSave DC: 20"],
	[12,"\nPerception DC: 38\nDisable DC: 33\nAttack: +27\nDamage: 12d12+5\nSave DC: 21"],
	[13,"\nPerception DC: 39\nDisable DC: 34\nAttack: +28\nDamage: 14d12\nSave DC: 21"],
	[14,"\nPerception DC: 41\nDisable DC: 36\nAttack: +29\nDamage: 14d12+7\nSave DC: 22"],
	[15,"\nPerception DC: 42\nDisable DC: 37\nAttack: +30\nDamage: 14d12+15\nSave DC: 23"],
	[16,"\nPerception DC: 44\nDisable DC: 39\nAttack: +31\nDamage: 16d12+15\nSave DC: 24"],
	[17,"\nPerception DC: 45\nDisable DC: 40\nAttack: +32\nDamage: 16d12+30\nSave DC: 24"],
	[18,"\nPerception DC: 47\nDisable DC: 42\nAttack: +33\nDamage: 16d12+45\nSave DC: 25"],
	[19,"\nPerception DC: 48\nDisable DC: 43\nAttack: +34\nDamage: 16d12+60\nSave DC: 26"],
	[20,"\nPerception DC: 50\nDisable DC: 45\nAttack: +35\nDamage: 16d12+75\nSave DC: 27"]
]);

//TODO: add traps that impose conditions?
const TRAP_TYPES      = ["Analog","Technological","Magical","Hybrid"];
const TRAP_TRIGGERS   = ["Location","Proximity","Touch"];
const TRAP_PROX_TYPES = ["Auditory","Visual","Thermal"];
const TRAP_SAVE 	  = ["Reflex","Fortitude","Will"];

function getListFile(fileName){
  try {
    var data = fs.readFileSync(fileName, { encoding: 'utf8', flag: 'r' });
    return data.split('\n');
  } catch (e) {
    console.log(e);
    return [];
  }
}

async function getAllMonstersByBiomeAndLevel(fileName, lvl){
	let allMonsters = await getListFile(fileName);
	let allMonstersbyLevel = []
	
	for(var i = 0; i < allMonsters.length; i++){
		if (allMonsters[i].includes("{"+lvl+"}"))
			allMonstersbyLevel.push(allMonsters[i]);
	}
	return allMonstersbyLevel;
}

async function getRandomTrap(lvl){
	if(lvl < 0.5) lvl = 0.5;
	if(lvl > 20) lvl = 20;
	var randType    = TRAP_TYPES[rollRange(TRAP_TYPES.length)-1];
	var randTrigger = TRAP_TRIGGERS[rollRange(TRAP_TRIGGERS.length)-1];
	
	if(randTrigger == "Proximity"){
		var randProx = TRAP_PROX_TYPES[rollRange(TRAP_PROX_TYPES.length)-1];
		randTrigger = randTrigger + " (" + randProx + ")";
	}
	var randSave 	= TRAP_SAVE[rollRange(TRAP_SAVE.length)-1];
	
	var effect = "";
	//analog traps deal kinetic damage
	if(randType == "Analog"){
		var bps = ["Bludgeoning damage","Piercing damage","Slashing damage"]
		effect = bps[rollRange(3)-1];
	}		
	//tech traps deal energy damage
	if(randType == "Technological"){
		var energy = ["Acid damage","Cold damage","Electricity damage","Fire damage","Sonic damage"];
		effect = energy[rollRange(5)-1];
	}		
	//magic traps cast a level appropriate Mystic spell
	//spellcaster level CR conversion:
	/*
	0.3-3 = 1st level spells
	4-6   = 2nd level spells
	7-9   = 3rd level spells
	10-12 = 4th level spells
	13-15 = 5th level spells
	16-20 = 6th level spells
	*/
	if(randType == "Magical"){
		//this function needs a rename as it works just fine for spells by level
		var spellLevel = 0;
		if(lvl > 0 && lvl < 4)
			spellLevel = 1;
		if(lvl > 3 && lvl < 7)
			spellLevel = 2;
		if(lvl > 6 && lvl < 10)
			spellLevel = 3;
		if(lvl > 9 && lvl < 8)
			spellLevel = 4;
		if(lvl > 12 && lvl < 16)
			spellLevel = 5;
		if(lvl > 15 && lvl < 21)
			spellLevel = 6;
		var spellList = await getAllMonstersByBiomeAndLevel("./ListFiles/MagicTrapSpellsList.txt",spellLevel);
		effect = spellList[rollRange(spellList.length)-1];
	}
	//hybrid traps cast Technomancy Spells
	if(randType == "Hybrid"){
		// var condition = await getRandomCondition();
		// effect = "The " + condition + " condition until a successful save";
		// effect = effect.replace(/\r?\n|\r/g, "");
		var spellLevel = 0;
		if(lvl > 0 && lvl < 4)
			spellLevel = 1;
		if(lvl > 3 && lvl < 7)
			spellLevel = 2;
		if(lvl > 6 && lvl < 10)
			spellLevel = 3;
		if(lvl > 9 && lvl < 8)
			spellLevel = 4;
		if(lvl > 12 && lvl < 16)
			spellLevel = 5;
		if(lvl > 15 && lvl < 21)
			spellLevel = 6;
		var spellList = await getAllMonstersByBiomeAndLevel("./ListFiles/HybridTrapSpellsList.txt",spellLevel);
		effect = spellList[rollRange(spellList.length)-1];
	}
	
	// console.log("Trap: \nCR: " + lvl + " " + randType + "\nTrigger: " + randTrigger + "\nEffect: " + effect + TRAP_TABLE.get(lvl));
	return "Trap: \nCR: " + lvl + " " + randType + "\nTrigger: " + randTrigger + "\nEffect: " + effect + TRAP_TABLE.get(lvl);
}

async function getRandomCondition(){
	let allConditions = await getListFile("./ListFiles/ConditionsList.txt");
	return allConditions[rollRange(allConditions.length)-1];
}

async function scrapeMonsterEquipmentCredits(){
	const response = await fetch("https://aonsrd.com/Aliens.aspx?Letter=All");
	const text = await response.text();
	const dom = await new JSDOM(text);
	const table = dom.window.document.getElementById("ctl00_MainContent_GridViewAliens").getElementsByTagName("tr")
	
	var equipmentList = getListFile("./ListFiles/EquipmentWithPriceList.txt")
	
	var fusions = getListFile("./ListFiles/WeaponList.txt")
	var fusionsHasWeapons = true;
	while(fusionsHasWeapons){
		for(var i = 0; i < fusions.length; i++){
			// console.log(fusions[i] + " " +!fusions[i].includes("weapon fusion"))
			if(fusions[0].includes("weapon fusion"))
				fusionsHasWeapons = false;
			if(!fusions[i].includes("weapon fusion")){
				fusions.splice(i,1);
				fusionsHasWeapons = true;
			}
		}
	}
	
	var k = 4;//debug to set index to only one monster
	// for (var k = 1; k < table.length; k++){
		var monsterEquipmentCreds = 0;
		var monsterLink = table[k].innerHTML.substring(table[k].innerHTML.indexOf('<a href=')+9, table[k].innerHTML.length);
		monsterLink     = "https://aonsrd.com/"+monsterLink.substring(0,monsterLink.indexOf('">'));
		
		const monsterResponse = await fetch(monsterLink);
		const monsterText = await monsterResponse.text();
		const monsterDom = await new JSDOM(monsterText);
		const infoList = monsterDom.window.document.getElementById("ctl00_MainContent_DataListTalentsAll_ctl00_LabelName").getElementsByTagName("b");
		const pageInfo = monsterDom.window.document.getElementById("ctl00_MainContent_DataListTalentsAll_ctl00_LabelName").innerHTML;
		
		//debug, delete later
		const monsterName = monsterDom.window.document.getElementById("ctl00_MainContent_DataListTalentsAll_ctl00_LabelName").getElementsByTagName("a")[0].textContent;
		// console.log(monsterName);
		
		if(pageInfo.indexOf("Gear") > -1){
			var gearText = pageInfo.substring(pageInfo.indexOf("Gear")+9,pageInfo.length);
			gearText = gearText.substring(0,gearText.indexOf("<h3"));
			gearText = gearText.replace("<i>","");
			gearText = gearText.replace("</i>","");
			gearText = gearText.replace(", ",",");
			
			//console.log(gearText)
			var semiColonSplit = gearText.split(';');
			var gearList = [];
			//console.log(semiColonSplit[0]);
			for(var i = 0; i < semiColonSplit.length; i++){
				var gearItemList = semiColonSplit[i].split(',');
				for(var j = 0; j < gearItemList.length; j++){
					var gearItem = gearItemList[j].split(" with ");
					for(var k = 0; k < gearItem.length; k++){
						if(gearItem[k][0] == ' ') gearItem[k] = gearItem[k].slice(1);
						gearItem[k] = gearItem[k].replace("<b>Augmentations</b> ","");
						gearList.push(gearItem[k]);
					}
				}
			}
			// console.log(gearList);
			
			for(var i = 0; i < gearList.length; i++){
				var gearFirstWord = gearList[i].split(" ")[0];
				//capitalize first word to make searching in fusion list easier
				gearFirstWord = gearFirstWord.charAt(0).toUpperCase() + gearFirstWord.slice(1);
				for (var j = 0; j < fusions.length; j++){
					if(fusions[j].includes(gearFirstWord)){
						//remove fusions from equipment for now
						gearList[i] = gearList[i].replace(gearList[i].split(" ")[0] + " ","");
					}
				}
				for(var j = 0; j < equipmentList.length; j++){
					equipmentList[j] = equipmentList[j].toLowerCase(); 
					if(equipmentList[j].includes(gearList[i])){
						//add equipment price to tally
						monsterEquipmentCreds += parseInt(equipmentList[j].substring(equipmentList[j].indexOf("{")+1, equipmentList[j].indexOf("}")));
						//console.log(gearList[i] + " " +parseInt(equipmentList[j].substring(equipmentList[j].indexOf("{")+1, equipmentList[j].indexOf("}"))));
					}
				}
			}
			// console.log(gearList);
			// console.log(monsterEquipmentCreds);
			// console.log(Math.floor(monsterEquipmentCreds*0.1));
			// console.log("\n");
		}else{
			// console.log("Gear not found");
			// console.log(0);
			// console.log("\n");
		}
	// }
	// for (var k = 1; i < table.length; k++){	
	// }
	//all monsters table ctl00_MainContent_GridViewAliens
	//span id with Gear ctl00_MainContent_DataListTalentsAll_ctl00_LabelName 
	//determine if the word "Gear" is present, then parse gear
}

async function getRandomMonsterByBiomeAndLevel(biome, lvl){
	if(lvl < 0.3 || lvl > 20)
		console.log("invalid level: enter a number between 0.3 and 20")
	
	var monsterByLevel = "?"; 
	if (biome.includes("Airborne")) monsterByLevel = await getAllMonstersByBiomeAndLevel("./ListFiles/AirborneMonsterList.txt",lvl);
	if (biome.includes("Aquatic")) monsterByLevel = await getAllMonstersByBiomeAndLevel("./ListFiles/AquaticMonsterList.txt",lvl);
	if (biome.includes("Arctic")) monsterByLevel = await getAllMonstersByBiomeAndLevel("./ListFiles/ArcticMonsterList.txt",lvl);
	if (biome.includes("Desert")) monsterByLevel = await getAllMonstersByBiomeAndLevel("./ListFiles/DesertMonsterList.txt",lvl);
	if (biome.includes("Forest")) monsterByLevel = await getAllMonstersByBiomeAndLevel("./ListFiles/ForestMonsterList.txt",lvl);
	if (biome.includes("Marsh")) monsterByLevel = await getAllMonstersByBiomeAndLevel("./ListFiles/MarshMonsterList.txt",lvl);
	if (biome.includes("Mountain")) monsterByLevel = await getAllMonstersByBiomeAndLevel("./ListFiles/MountainMonsterList.txt",lvl);
	if (biome.includes("Plains")) monsterByLevel = await getAllMonstersByBiomeAndLevel("./ListFiles/PlainsMonsterList.txt",lvl);
	if (biome.includes("Space")) monsterByLevel = await getAllMonstersByBiomeAndLevel("./ListFiles/SpaceMonsterList.txt",lvl);
	if (biome.includes("Subterranean")) monsterByLevel = await getAllMonstersByBiomeAndLevel("./ListFiles/SubterraneanMonsterList.txt",lvl);
	if (biome.includes("Urban")) monsterByLevel = await getAllMonstersByBiomeAndLevel("./ListFiles/UrbanMonsterList.txt",lvl);
	if (biome.includes("Weird")) monsterByLevel = await getAllMonstersByBiomeAndLevel("./ListFiles/WeirdMonsterList.txt",lvl);
	
	var index = Math.floor(Math.random()*monsterByLevel.length);
	//console.log(monsterByLevel[index]);
	return monsterByLevel[index];
}

async function rollMonsterPool(biome, lvl){
	var pool = [];	
	var xp_budget = XP_TABLE.get(lvl);
	var wealth = WEALTH_TABLE.get(lvl);
	var xp_total  = 0;
	
	pool.push("Monsters:" + " (CR" + lvl + ")");
	
	while(xp_total < xp_budget){
		//pick random monster at level, 1 below level, or 2 below level
		var variance = rollRange(3)-1;
		var nextMonsterLevel = lvl - variance;
		if(lvl == 2 && variance == 2)
			nextMonsterLevel = 0.5
		if(lvl == 1 && variance == 1){
			nextMonsterLevel = 0.5;
		}else if(lvl == 1 && variance == 2){
			nextMonsterLevel = 0.3;
		}
		if(lvl == 0.5 && variance == 1){
			nextMonsterLevel = 0.5;
		}else if(lvl == 0.5 && variance == 2){
			nextMonsterLevel = 0.3;
		}
		if(lvl == 0.3 && variance == 0){
			nextMonsterLevel = 0.3;
		}else if(lvl == 0.3 && variance == 1){
			nextMonsterLevel = 0.3;
		}else if(lvl == 0.3 && variance == 2){
			nextMonsterLevel = 1;
		}
		var nextMonster = await getRandomMonsterByBiomeAndLevel(biome, nextMonsterLevel);
		
		while(nextMonster == undefined){
			nextMonsterLevel--;
			nextMonster = await getRandomMonsterByBiomeAndLevel(biome, nextMonsterLevel);
		}
		
		//get the xp amount for the new monster
		var nextMonsterXP = XP_TABLE.get(parseFloat(nextMonster.substring(nextMonster.indexOf("{")+1,nextMonster.lastIndexOf("}"))));
		//if xp total + new monster level <= xp budget for encounter
		//console.log(nextMonster)
		//console.log(nextMonsterLevel + " " + nextMonsterXP + " "+xp_total + " " + xp_budget);
		if(xp_total + nextMonsterXP <= xp_budget){
			//add monster to pool and update total
			pool.push(nextMonster);
			xp_total += nextMonsterXP;
		}else{
			//decrement xp level to fill in the budget as much as possible
			if(lvl > 1)
				lvl--;
			else if(lvl == 1)
				lvl = 0.5;
			else if(lvl == 0.5)
				lvl = 0.3;
			else
				break;
		}
	}
	
	pool.push("XP total: " + xp_total + "/" + xp_budget);
	pool.push("Wealth total: " + wealth + " Credits/UPBs");
	
	for(var i = 0; i < pool.length; i++)
		console.log(pool[i]);
	return pool;
}

module.exports = {
	generateMonsters: async function rollMonsterPool(biome, lvl){
		var pool = [];	
		var xp_budget = XP_TABLE.get(lvl);
		var wealth = WEALTH_TABLE.get(lvl);
		var xp_total  = 0;
		
		pool.push("Monsters:" + " (CR" + lvl + ")");
		
		while(xp_total < xp_budget){
			//pick random monster at level, 1 below level, or 2 below level
			var variance = rollRange(3)-1;
			var nextMonsterLevel = lvl - variance;
			if(lvl == 2 && variance == 2)
				nextMonsterLevel = 0.5
			if(lvl == 1 && variance == 1){
				nextMonsterLevel = 0.5;
			}else if(lvl == 1 && variance == 2){
				nextMonsterLevel = 0.3;
			}
			if(lvl == 0.5 && variance == 1){
				nextMonsterLevel = 0.5;
			}else if(lvl == 0.5 && variance == 2){
				nextMonsterLevel = 0.3;
			}
			if(lvl == 0.3 && variance == 0){
				nextMonsterLevel = 0.3;
			}else if(lvl == 0.3 && variance == 1){
				nextMonsterLevel = 0.3;
			}else if(lvl == 0.3 && variance == 2){
				nextMonsterLevel = 1;
			}
			var nextMonster = await getRandomMonsterByBiomeAndLevel(biome, nextMonsterLevel);
			
			while(nextMonster == undefined){
				nextMonsterLevel--;
				nextMonster = await getRandomMonsterByBiomeAndLevel(biome, nextMonsterLevel);
			}
			
			//get the xp amount for the new monster
			var nextMonsterXP = XP_TABLE.get(parseFloat(nextMonster.substring(nextMonster.indexOf("{")+1,nextMonster.lastIndexOf("}"))));
			//if xp total + new monster level <= xp budget for encounter
			//console.log(nextMonster)
			//console.log(nextMonsterLevel + " " + nextMonsterXP + " "+xp_total + " " + xp_budget);
			if(xp_total + nextMonsterXP <= xp_budget){
				//add monster to pool and update total
				pool.push(nextMonster);
				xp_total += nextMonsterXP;
			}else{
				//decrement xp level to fill in the budget as much as possible
				if(lvl > 1)
					lvl--;
				else if(lvl == 1)
					lvl = 0.5;
				else if(lvl == 0.5)
					lvl = 0.3;
				else
					break;
			}
		}
		
		pool.push("XP total: " + xp_total + "/" + xp_budget);
		pool.push("Wealth total: " + wealth + " Credits/UPBs");
		
		// for(var i = 0; i < pool.length; i++)
			// console.log(pool[i]);
		return pool;
	},
	getRandomTrap: async function getRandomTrap(lvl){
		if(lvl < 0.5) lvl = 0.5;
		if(lvl > 20) lvl = 20;
		var randType    = TRAP_TYPES[rollRange(TRAP_TYPES.length)-1];
		var randTrigger = TRAP_TRIGGERS[rollRange(TRAP_TRIGGERS.length)-1];
		
		if(randTrigger == "Proximity"){
			var randProx = TRAP_PROX_TYPES[rollRange(TRAP_PROX_TYPES.length)-1];
			randTrigger = randTrigger + " (" + randProx + ")";
		}
		var randSave 	= TRAP_SAVE[rollRange(TRAP_SAVE.length)-1];
		
		var effect = "";
		//analog traps deal kinetic damage
		if(randType == "Analog"){
			var bps = ["Bludgeoning damage","Piercing damage","Slashing damage"]
			effect = bps[rollRange(3)-1];
		}		
		//tech traps deal energy damage
		if(randType == "Technological"){
			var energy = ["Acid damage","Cold damage","Electricity damage","Fire damage","Sonic damage"];
			effect = energy[rollRange(5)-1];
		}		
		//magic traps cast a level appropriate Mystic spell
		//spellcaster level CR conversion:
		/*
		0.3-3 = 1st level spells
		4-6   = 2nd level spells
		7-9   = 3rd level spells
		10-12 = 4th level spells
		13-15 = 5th level spells
		16-20 = 6th level spells
		*/
		if(randType == "Magical"){
			//this function needs a rename as it works just fine for spells by level
			var spellLevel = 0;
			if(lvl > 0 && lvl < 4)
				spellLevel = 1;
			if(lvl > 3 && lvl < 7)
				spellLevel = 2;
			if(lvl > 6 && lvl < 10)
				spellLevel = 3;
			if(lvl > 9 && lvl < 8)
				spellLevel = 4;
			if(lvl > 12 && lvl < 16)
				spellLevel = 5;
			if(lvl > 15 && lvl < 21)
				spellLevel = 6;
			var spellList = await getAllMonstersByBiomeAndLevel("./ListFiles/MagicTrapSpellsList.txt",spellLevel);
			effect = spellList[rollRange(spellList.length)-1];
		}
		//hybrid traps cast Technomancy Spells
		if(randType == "Hybrid"){
			// var condition = await getRandomCondition();
			// effect = "The " + condition + " condition until a successful save";
			// effect = effect.replace(/\r?\n|\r/g, "");
			var spellLevel = 0;
			if(lvl > 0 && lvl < 4)
				spellLevel = 1;
			if(lvl > 3 && lvl < 7)
				spellLevel = 2;
			if(lvl > 6 && lvl < 10)
				spellLevel = 3;
			if(lvl > 9 && lvl < 8)
				spellLevel = 4;
			if(lvl > 12 && lvl < 16)
				spellLevel = 5;
			if(lvl > 15 && lvl < 21)
				spellLevel = 6;
			var spellList = await getAllMonstersByBiomeAndLevel("./ListFiles/HybridTrapSpellsList.txt",spellLevel);
			effect = spellList[rollRange(spellList.length)-1];
		}
		
		//console.log("Trap: \nCR: " + lvl + " " + randType + "\nTrigger: " + randTrigger + "\nEffect: " + effect + TRAP_TABLE.get(lvl));
		return "Trap: \nCR: " + lvl + " " + randType + "\nTrigger: " + randTrigger + "\nEffect: " + effect + TRAP_TABLE.get(lvl);
	}
}

function rollRange(r){
  return Math.floor(Math.random() * r) + 1;
}

// rollMonsterPool("Airborne", 3);
// rollMonsterPool("Aquatic", 3);
// rollMonsterPool("Desert", 3);
// rollMonsterPool("Forest", 3);
// rollMonsterPool("Marsh", 3);
// rollMonsterPool("Mountain", 3);
// rollMonsterPool("Plains", 3);
// rollMonsterPool("Space", 3);
// rollMonsterPool("Subterranean", 3);
// rollMonsterPool("Urban", 3);
// rollMonsterPool("Weird", 3);
// getRandomTrap(5);
//scrapeMonsterEquipmentCredits();
