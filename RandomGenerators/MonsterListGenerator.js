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

var maxLevel = 0;

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

async function getRandomMonsterByBiomeAndLevel(biome, lvl){
	if(lvl < 0.3 || lvl > 20)
		console.log("invalid level: enter a number between 0.3 and 20")
	
	var monsterByLevel = "?"; 
	if (biome.includes("Airborne")) monsterByLevel = await getAllMonstersByBiomeAndLevel("./AirborneMonsterList.txt",lvl);
	if (biome.includes("Aquatic")) monsterByLevel = await getAllMonstersByBiomeAndLevel("./AquaticMonsterList.txt",lvl);
	if (biome.includes("Arctic")) monsterByLevel = await getAllMonstersByBiomeAndLevel("./ArcticMonsterList.txt",lvl);
	if (biome.includes("Desert")) monsterByLevel = await getAllMonstersByBiomeAndLevel("./DesertMonsterList.txt",lvl);
	if (biome.includes("Forest")) monsterByLevel = await getAllMonstersByBiomeAndLevel("./ForestMonsterList.txt",lvl);
	if (biome.includes("Marsh")) monsterByLevel = await getAllMonstersByBiomeAndLevel("./MarshMonsterList.txt",lvl);
	if (biome.includes("Mountain")) monsterByLevel = await getAllMonstersByBiomeAndLevel("./MountainMonsterList.txt",lvl);
	if (biome.includes("Plains")) monsterByLevel = await getAllMonstersByBiomeAndLevel("./PlainsMonsterList.txt",lvl);
	if (biome.includes("Space")) monsterByLevel = await getAllMonstersByBiomeAndLevel("./SpaceMonsterList.txt",lvl);
	if (biome.includes("Subterranean")) monsterByLevel = await getAllMonstersByBiomeAndLevel("./SubterraneanMonsterList.txt",lvl);
	if (biome.includes("Urban")) monsterByLevel = await getAllMonstersByBiomeAndLevel("./UrbanMonsterList.txt",lvl);
	if (biome.includes("Weird")) monsterByLevel = await getAllMonstersByBiomeAndLevel("./WeirdMonsterList.txt",lvl);
	
	var index = Math.floor(Math.random()*monsterByLevel.length);
	//console.log(monsterByLevel[index]);
	return monsterByLevel[index];
}

async function rollMonsterPool(biome, lvl, diff){
	if(lvl > maxLevel)
		maxLevel = lvl;
	var pool = [];	
	var xp_budget = XP_TABLE.get(lvl);
	var xp_total  = 0;
	
	pool.push("Monsters:");
	
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
	
	pool.push("XP total: " + xp_total);
	pool.push("Wealth total: " + WEALTH_TABLE.get(maxLevel))
	
	for(var i = 0; i < pool.length; i++)
		console.log(pool[i]);
	return pool;
}

module.exports = {
	generateMonsters: async function rollMonsterPool(biome, lvl, diff){
		if(lvl > maxLevel)
			maxLevel = lvl;
		var pool = [];	
		var xp_budget = XP_TABLE.get(lvl);
		var xp_total  = 0;
		
		pool.push("Monsters:");
		
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
		
		pool.push("XP total: " + xp_total);
		pool.push("Wealth total: " + WEALTH_TABLE.get(maxLevel) + " Credits/UPBs")
		
		// for(var i = 0; i < pool.length; i++)
			// console.log(pool[i]);
		return pool;
	}
	
}

function rollRange(r){
  return Math.floor(Math.random() * r) + 1;
}

//rollMonsterPool("Airborne", 1, 2);