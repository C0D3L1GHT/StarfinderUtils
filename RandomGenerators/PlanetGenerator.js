const fs = require('fs');
const path = require('path');
const randomMap = require('./HexCrawlGenerator.js');

const world_type_list = ["Terrestrial", "Gas giant", "Irregular", "Satellite", "Asteroid", "Colony ship", "Space station"];
const gravity_list = ["Standard", "Zero gravity", "Low", "High", "Extreme"]
const atmosphere_list = ["Normal", "None", "Thin", "Thick", "Corrosive or Toxic"]
const biome_list = ["Airborne", "Aquatic", "Arctic", "Desert", "Forest", "Marsh", "Mountain", "Plains", "Space", "Subterranean", "Urban", "Weird"]
const triad_list = ["Low", "Medium", "High"]
const align_cohesion_list = ["Chaotic", "Neutral", "Lawful"]
const align_morality_list = ["Evil", "Neutral", "Good"]
const settlement_gov_list = ["Anarchy", "Autocracy", "Council", "Magocracy", "Military", "Oligarchy", "Secret Syndicate", "Plutocracy", "Utopia"]
const settlement_qual_list = ["Academic", "Bureaucratic", "Cultured", "Devout", "Financial Center", "Insular", "Notorious", "Polluted"]


/*********************************************************/
const PLANET_LEVEL = 3;
const PLANET_DIFF  = 3;
/*********************************************************/

//TODO: add clues and mysteries that have answers on other planets in the list
//TODO: make sector generator
//TODO: add other planet types (moon, black hole, Fold Gate Station, Machine World)
// Galaxy Exploration is tracking down system clues. 3-5 clues to get to a system
// System Exploration is finding Gravity Wells which gives you the system locations of 1d3 worlds
// Analyzing System Data is analyzing what type of world it is
// Exploration From Orbit is determining one of the following biome, gravity, atmosphere, religion, magic, tech, accord, or anomaly_list
// World Mapping give you 1 Hex biome plus other features if high enough
// World Exploration is hex crawl/guided tour if world is advanced and accomodating   
async function GeneratePlanet(){
  var planetInfo = [];
  var biomeAnomalies = await GenBiomeAnomaly();
  var nextbiomeAnomaly = await GenBiomeAnomaly();
  while(biomeAnomalies == nextbiomeAnomaly)
	  nextbiomeAnomaly = await GenBiomeAnomaly();
  biomeAnomalies += ", " + nextbiomeAnomaly;
  planetInfo.push("World Type:      " + GenWorldType());
  planetInfo.push("   Anomalies: " + biomeAnomalies);
  planetInfo.push("Gravity:         " + GenGravity());
  planetInfo.push("Atmosphere:      " + GenAtmopshere());
  
  // console.log("World Type:      " + GenWorldType());
  // console.log("   Anomalies: " + biomeAnomalies);
  // console.log("Gravity:         " + GenGravity());
  // console.log("Atmosphere:      " + GenAtmopshere());
  var dThree = rollRange(3);
  var biomeList = [];
  for(let i = 1; i <= dThree; i++){
	  var biome = GenBiome();
	  biomeList.push(biome);
      //console.log("   Biome: " + biome);
	  planetInfo.push("   Biome: " + biome);
  }
  
  var accord     = await GenTriadAttributes("Accord");
  var magic      = await GenTriadAttributes("Magic");
  var religion   = await GenTriadAttributes("Religion");
  var technology = await GenTriadAttributes("Technology");
  
  planetInfo.push("Accord:          " + accord);
  planetInfo.push("Magic Level:     " + magic);
  planetInfo.push("Religion Level:  " + religion);
  planetInfo.push("Tech Level:      " + technology);
  planetInfo.push("Alignment:       " + GenAlignCohesion() + " " + GenAlignMorality());
  
  
  // console.log("Accord:          " + accord);
  // console.log("Magic Level:     " + magic);
  // console.log("Religion Level:  " + religion);
  // console.log("Tech Level:      " + technology);
  // console.log("Alignment:       " + GenAlignCohesion() + " " + GenAlignMorality());
  var dThree = rollRange(3);
  for(let i = 1; i <= dThree; i++){
    //console.log("   Settlement Info: " + GenSettlementQual() + " " + GenSettlementGov());
	planetInfo.push("   Settlement Info: " + GenSettlementQual() + " " + GenSettlementGov());
  }
  //console.log("\n\n")
  //randomMap.populateMap(biomeList,10,10);
  //TODO: Figure out how to push HexMap data into Planet info
  // for(var i = 0; i < planetInfo.length; i++)
	  // console.log(planetInfo[i]);
  return planetInfo;
}

function GenWorldType(){
  var dCent   = rollRange(100);
  if(dCent >= 1 && dCent <= 50)
    return world_type_list[0];
  if(dCent >= 51 && dCent <= 70)
    return world_type_list[1];
  if(dCent >= 71 && dCent <= 85)
    return world_type_list[2];
  if(dCent >= 86 && dCent <= 90)
    return world_type_list[3];
  if(dCent >= 91 && dCent <= 95)
    return world_type_list[4];
  if(dCent >= 96 && dCent <= 97)
    return world_type_list[5];
  if(dCent >= 98 && dCent <= 100)
    return world_type_list[6];
}

function GenGravity(){
  var dCent = rollRange(100);
  if(dCent >= 1 && dCent <= 50)
    return gravity_list[0];
  if(dCent >= 51 && dCent <= 60)
    return gravity_list[1];
  if(dCent >= 61 && dCent <= 75)
    return gravity_list[2];
  if(dCent >= 76 && dCent <= 90)
    return gravity_list[3];
  if(dCent >= 91 && dCent <= 100)
    return gravity_list[4];
}

function GenAtmopshere(){
  var dCent = rollRange(100);
  if(dCent >= 1 && dCent <= 50)
    return atmosphere_list[0];
  if(dCent >= 51 && dCent <= 60)
    return atmosphere_list[1];
  if(dCent >= 61 && dCent <= 75)
    return atmosphere_list[2];
  if(dCent >= 76 && dCent <= 90)
    return atmosphere_list[3];
  if(dCent >= 91 && dCent <= 100)
    return atmosphere_list[4];
}

function GenBiome(){
  var dTwelve = rollRange(12);
  return biome_list[dTwelve-1];
}

async function GenTriadAttributes(level){
  var dThree = rollRange(3);
  var ret = triad_list[dThree-1] + ", " + await genTriadTag(triad_list[dThree-1], level);
  return ret;
}

function GenAlignCohesion(){
  var dThree = rollRange(3);
  return align_cohesion_list[dThree-1];
}

function GenAlignMorality(){
  var dThree = rollRange(3);
  return align_morality_list[dThree-1];
}

function GenSettlementGov(){
  var dNine = rollRange(9);
  return settlement_gov_list[dNine-1];
}

function GenSettlementQual(){
  var dSeven = rollRange(8);
  return settlement_qual_list[dSeven-1];
}

async function GenBiomeAnomaly(){
	anomaly_list = await scrapeList("Biome");
	return anomaly_list[rollRange(anomaly_list.length-1)]; 
}

async function genTriadTag(level, list){
	var triadList = await scrapeList(list);
	var ret = [];
	var addToRet = false;
	for(var i = 0; i < triadList.length; i++){		
		if (level == "Low" && triadList[i].includes("Low_")){
			addToRet = true;
			i++;
		}
		if (level == "Medium" && triadList[i].includes("Medium_")){
			addToRet = true;
			i++;
		}
		if (level == "High" && triadList[i].includes("High_")){
			addToRet = true;
			i++;
		}
		if (triadList[i].length < 2){
			addToRet = false;
		}
		
		if(addToRet)
			ret.push(triadList[i]);
	}
	// for(var i = 0; i < ret.length; i++)
		// console.log(ret[i]);
	return ret[rollRange(ret.length-1)];
}

async function scrapeList(list){
	try {
		if(list == "Accord"){
			var data = fs.readFileSync("./ListFiles/AccordList.txt", { encoding: 'utf8', flag: 'r' });
			var ret = data.split('\n');
			return ret;
		}
		if(list == "Magic"){
			var data = fs.readFileSync("./ListFiles/MagicList.txt", { encoding: 'utf8', flag: 'r' });
			var ret = data.split('\n');
			return ret;
		}
		if(list == "Religion"){
			var data = fs.readFileSync("./ListFiles/ReligionList.txt", { encoding: 'utf8', flag: 'r' });
			var ret = data.split('\n');
			return ret;
		}
		if(list == "Technology"){
			var data = fs.readFileSync("./ListFiles/TechList.txt", { encoding: 'utf8', flag: 'r' });
			var ret = data.split('\n');
			return ret;
		}
		if(list == "Biome"){
			var data = fs.readFileSync("./ListFiles/BiomeList.txt", { encoding: 'utf8', flag: 'r' });
			var ret = data.split('\n');
			return ret;
		}else{
			return [];
		}
  } catch (e) {
       console.log(e);
       return [];
  }
}

module.exports = {
  generatePlanet: async function GeneratePlanet(){
  var planetInfo = [];
  var biomeAnomalies = await GenBiomeAnomaly();
  var nextbiomeAnomaly = await GenBiomeAnomaly();
  while(biomeAnomalies == nextbiomeAnomaly)
	  nextbiomeAnomaly = await GenBiomeAnomaly();
  biomeAnomalies += ", " + nextbiomeAnomaly;
  planetInfo.push("World Type:      " + GenWorldType());
  planetInfo.push("   Anomalies: " + biomeAnomalies);
  planetInfo.push("Gravity:         " + GenGravity());
  planetInfo.push("Atmosphere:      " + GenAtmopshere());
  
  // console.log("World Type:      " + GenWorldType());
  // console.log("   Anomalies: " + biomeAnomalies);
  // console.log("Gravity:         " + GenGravity());
  // console.log("Atmosphere:      " + GenAtmopshere());
  var dThree = rollRange(3);
  var biomeList = [];
  for(let i = 1; i <= dThree; i++){
	  var biome = GenBiome();
	  biomeList.push(biome);
      //console.log("   Biome: " + biome);
	  planetInfo.push("   Biome: " + biome);
  }
  
  var accord     = await GenTriadAttributes("Accord");
  var magic      = await GenTriadAttributes("Magic");
  var religion   = await GenTriadAttributes("Religion");
  var technology = await GenTriadAttributes("Technology");
  
  planetInfo.push("Accord:          " + accord);
  planetInfo.push("Magic Level:     " + magic);
  planetInfo.push("Religion Level:  " + religion);
  planetInfo.push("Tech Level:      " + technology);
  planetInfo.push("Alignment:       " + GenAlignCohesion() + " " + GenAlignMorality());
  
  
  // console.log("Accord:          " + accord);
  // console.log("Magic Level:     " + magic);
  // console.log("Religion Level:  " + religion);
  // console.log("Tech Level:      " + technology);
  // console.log("Alignment:       " + GenAlignCohesion() + " " + GenAlignMorality());
  var dThree = rollRange(3);
  for(let i = 1; i <= dThree; i++){
    //console.log("   Settlement Info: " + GenSettlementQual() + " " + GenSettlementGov());
	planetInfo.push("   Settlement Info: " + GenSettlementQual() + " " + GenSettlementGov());
  }
  //console.log("\n\n")
  //randomMap.populateMap(biomeList,10,10);
  //TODO: Figure out how to push HexMap data into Planet info
  // for(var i = 0; i < planetInfo.length; i++)
	  // console.log(planetInfo[i]);
  return planetInfo;
}
	
}

function rollRange(r){
  return Math.floor(Math.random() * r) + 1;
}

GeneratePlanet()
