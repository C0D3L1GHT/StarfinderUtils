const fetch = require('isomorphic-fetch')
const jsdom = require("jsdom");
const fs = require('fs');
const path = require('path');
const { JSDOM } = jsdom;

async function newsFeedDateHasChanged(fileName){
  try{
    const response = await fetch('https://www.aonsrd.com/');
    const text = await response.text();
    const dom = await new JSDOM(text);
    const mainPage = dom.window.document.getElementById('ctl00_MainContent_MainNewsFeed');
    let newPageDate = mainPage.textContent.slice(0,19);
    oldPageDate = getListFileDate(fileName);
	//console.log(oldPageDate+" vs\n"+newPageDate);
    if(newPageDate != oldPageDate){
		fs.writeFile(fileName, newPageDate+"\n", (err) => {
        if (err) throw err;
      })
      return true;
    }
    return false;
  }catch(err){
    console.log(err);
    return false;
  }
}

function getListFileDate(fileName){
  try {
    var data = fs.readFileSync(fileName, { encoding: 'utf8', flag: 'r' });
    var ret = data.split('\n');
    return ret.slice(0,1);
  } catch (e) {
    console.log(e);
    return [];
  }
}

function getListFile(fileName){
  try {
    var data = fs.readFileSync(fileName, { encoding: 'utf8', flag: 'r' });
    var ret = data.split('\n');
    return ret.slice(1);
  } catch (e) {
    console.log(e);
    return [];
  }
}

async function scrapeInfoAndAddToFile(textFile, pageLink, tableName, levelIndex){
	var listChanged = await newsFeedDateHasChanged(textFile);
	if(!listChanged){
		//console.log("no new content!");
		return;
	}else{
		try{
			const response = await fetch(pageLink);
			const text = await response.text();
			const dom = await new JSDOM(text);
			//const list = dom.window.document.getElementById(tableName).getElementsByTagName("a");
			const list = [];
			const table = dom.window.document.getElementsByTagName("table")[0].children[0];
			for (var i = 1; i < table.rows.length; i++) {
				var name  = table.children[i].children[0].textContent;//i+dataStart-1
				var level = table.children[i].children[levelIndex].textContent;
				//console.log(name + " (" + level + ")");
			list.push(name + " {" + level + "}");
			}
			addListToFile(list, textFile);
		}catch(err){
			console.log(err);
		}
	}
}

async function scrapeArmors(){
	const lightArmor   = await scrapeInfoAndAddToFile("ArmorList.txt", 'https://aonsrd.com/Armor.aspx?Category=Light', 'ctl00_MainContent_GridViewArmor', 1);
	const heavyArmor   = await scrapeInfoAndAddToFile("ArmorList.txt", 'https://aonsrd.com/Armor.aspx?Category=Heavy', 'ctl00_MainContent_GridViewArmor', 1);
	const poweredArmor = await scrapeInfoAndAddToFile("ArmorList.txt", 'https://aonsrd.com/PoweredArmor.aspx?ItemName=All', 'ctl00_MainContent_GridViewPoweredArmor', 1);
	const armorUpgrade = await scrapeInfoAndAddToFile("ArmorList.txt", 'https://aonsrd.com/ArmorUpgrades.aspx?ItemName=All&Family=None', 'ctl00_MainContent_GridViewArmorUpgrades', 1);
	console.log("\n\nupdated armor page!");
}

async function scrapeShields(){
    const shield = await scrapeInfoAndAddToFile("ShieldList.txt", 'https://aonsrd.com/Shields.aspx', 'ctl00_MainContent_DataElement', 1);
	console.log("\n\nupdated shield page!");
}

async function scrapeWeapons(){
	const advMelee1h   = await scrapeInfoAndAddToFile("WeaponList.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=AdvMelee', 'ctl00_MainContent_GridViewWeapons1Hand', 2);
	const advMelee2h   = await scrapeInfoAndAddToFile("WeaponList.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=AdvMelee', 'ctl00_MainContent_GridViewWeapons2Hands', 2);
	const basMelee1h   = await scrapeInfoAndAddToFile("WeaponList.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=BasicMelee', 'ctl00_MainContent_GridViewWeapons1Hand', 2);
	const basMelee2h   = await scrapeInfoAndAddToFile("WeaponList.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=BasicMelee', 'ctl00_MainContent_GridViewWeapons2Hands', 2);
	const heavyArms    = await scrapeInfoAndAddToFile("WeaponList.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=BasicMelee', 'ctl00_MainContent_GridViewWeapons2Hands', 2);
	const longArms     = await scrapeInfoAndAddToFile("WeaponList.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=Longarms', 'ctl00_MainContent_GridViewWeapons2Hands', 2);
	const smallArms	   = await scrapeInfoAndAddToFile("WeaponList.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=SmallArms', 'ctl00_MainContent_GridViewWeapons1Hand', 2);
	const sniper       = await scrapeInfoAndAddToFile("WeaponList.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=Sniper', 'ctl00_MainContent_GridViewWeapons2Hands', 2);
	const solarianCrys = await scrapeInfoAndAddToFile("WeaponList.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=Solarian', 'ctl00_MainContent_GridViewWeapons1Hand', 1);
    const special1h    = await scrapeInfoAndAddToFile("WeaponList.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=Special', 'ctl00_MainContent_GridViewWeapons1Hand', 2);
    const special2h	   = await scrapeInfoAndAddToFile("WeaponList.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=Special', 'ctl00_MainContent_GridViewWeapons2Hands', 2);
    const accessories  = await scrapeInfoAndAddToFile("WeaponList.txt", 'https://aonsrd.com/WeaponAccessories.aspx?ItemName=All&Family=None', 'ctl00_MainContent_GridViewWeaponAccessories', 1);
    const fusions      = await scrapeInfoAndAddToFile("WeaponList.txt", 'https://aonsrd.com/WeaponFusions.aspx?ItemName=All', 'ctl00_MainContent_GridViewWeaponFusions', 1);
	
	console.log("\n\nupdated weapons page!");
}

async function scrapeConsumables(){
	const ammo     = await scrapeInfoAndAddToFile("ConsumablesList.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=Ammo', 'ctl00_MainContent_GridViewWeapons1Hand', 2);
	const grenade  = await scrapeInfoAndAddToFile("ConsumablesList.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=Grenade', 'ctl00_MainContent_GridViewWeapons1Hand', 1);
	const drugs    = await scrapeInfoAndAddToFile("ConsumablesList.txt", 'https://aonsrd.com/OtherItems.aspx?Category=Medicinals', 'ctl00_MainContent_GridViewOtherItems', 1);
	const personal = await scrapeInfoAndAddToFile("ConsumablesList.txt", 'https://aonsrd.com/OtherItems.aspx?Category=Personal%20Items', 'ctl00_MainContent_GridViewOtherItems', 2);
}

async function scrapeAugments(){
	const cybernetics   = await scrapeInfoAndAddToFile("AugmentsList.txt", 'https://aonsrd.com/Cybernetics.aspx?ItemName=All&Family=None', 'ctl00_MainContent_GridViewCybernetics', 1);
	const biotech       = await scrapeInfoAndAddToFile("AugmentsList.txt", 'https://aonsrd.com/Biotech.aspx?ItemName=All&Family=None', 'ctl00_MainContent_GridViewBiotech', 1);
	const magitech      = await scrapeInfoAndAddToFile("AugmentsList.txt", 'https://aonsrd.com/Magitech.aspx?ItemName=All&Family=None', 'ctl00_MainContent_GridViewMagitech', 1);
	//TODO: implement
	//const necrografts   = await scrapeInfoAndAddToFile("AugmentsList.txt", 'https://aonsrd.com/PoweredArmor.aspx?ItemName=All', 'ctl00_MainContent_GridViewPoweredArmor', 1);
	const personalUps   = await scrapeInfoAndAddToFile("AugmentsList.txt", 'https://aonsrd.com/PersonalUpgrades.aspx?ItemName=All&Family=None', 'ctl00_MainContent_DataListPersonalUpgrades', 1);
	const speciesGrafts = await scrapeInfoAndAddToFile("AugmentsList.txt", 'https://aonsrd.com/SpeciesGrafts.aspx?ItemName=All&Family=None', 'ctl00_MainContent_GridViewSpeciesGrafts', 1);
	console.log("\n\nupdated augments page!");
}

async function scrapeTechItems(){
	const tech = await scrapeInfoAndAddToFile("TechItemList.txt", 'https://aonsrd.com/TechItems.aspx?ItemName=All&Family=None', 'ctl00_MainContent_GridViewTechItems', 2);
	console.log("\n\nupdated tech item page!");
}

async function scrapeMagicItems(){
	const magic = await scrapeInfoAndAddToFile("MagicItemList.txt", 'https://aonsrd.com/MagicItems.aspx?ItemName=All&Family=None', 'ctl00_MainContent_GridViewMagicItems', 2);
	console.log("\n\nupdated magic item page!");
}

async function scrapeHybridItems(){
	const shield = await scrapeInfoAndAddToFile("HybridItemList.txt", 'https://aonsrd.com/HybridItems.aspx?ItemName=All&Family=None', 'ctl00_MainContent_GridViewHybridItems', 1);
	console.log("\n\nupdated hybrid item page!");
}

async function getAllEquipmentByLevel(fileName, lvl){
	let allEquipment = await getListFile(fileName);
	let allEquipmentbyLevel = []
	if(allEquipment.length == 0 && fileName.includes("Armor")) scrapeArmors();
	if(allEquipment.length == 0 && fileName.includes("Weapon")) scrapeWeapons();
	if(allEquipment.length == 0 && fileName.includes("Shield")) scrapeShields();
	if(allEquipment.length == 0 && fileName.includes("Consumable")) scrapeConsumables();
	if(allEquipment.length == 0 && fileName.includes("Augment")) scrapeAugments();
	if(allEquipment.length == 0 && fileName.includes("Magic")) scrapeMagicItems();
	if(allEquipment.length == 0 && fileName.includes("Tech")) scrapeTechItems();
	if(allEquipment.length == 0 && fileName.includes("Hybrid")) scrapeHybridItems();
		
	allEquipment = await getListFile(fileName);
	
	for(var i = 0; i < allEquipment.length; i++){
		if (allEquipment[i].includes("{"+lvl+"}"))
			allEquipmentbyLevel.push(allEquipment[i]);
	}
	return allEquipmentbyLevel;
}

async function getRandomEquipmentByLevel(equipmentType, lvl){
	if (lvl < 1) lvl = 1;
	else if(lvl > 20) lvl = 20;
	
	var equipmentByLevel = [];
	while (equipmentByLevel.length == 0){
		if (equipmentType == "Armor") equipmentByLevel = await getAllEquipmentByLevel("./ArmorList.txt",lvl);
		if (equipmentType == "Weapon") equipmentByLevel = await getAllEquipmentByLevel("./WeaponList.txt",lvl);
		if (equipmentType == "Shield") equipmentByLevel = await getAllEquipmentByLevel("./ShieldList.txt",lvl);
		if (equipmentType == "Consumable") equipmentByLevel = await getAllEquipmentByLevel("./ConsumablesList.txt",lvl);
		if (equipmentType == "Augment") equipmentByLevel = await getAllEquipmentByLevel("./AugmentsList.txt",lvl);
		if (equipmentType == "MagicItem") equipmentByLevel = await getAllEquipmentByLevel("./MagicItemList.txt",lvl);
		if (equipmentType == "TechItem") equipmentByLevel = await getAllEquipmentByLevel("./TechItemList.txt",lvl);
		if (equipmentType == "HybridItem") equipmentByLevel = await getAllEquipmentByLevel("./HybridItemList.txt",lvl);
		lvl--;
	}
	
	var index = Math.floor(Math.random()*equipmentByLevel.length);
	//console.log(equipmentByLevel[index]);
	return equipmentByLevel[index];
}

async function rollLootPool(level, consumableAmount, tacAmount, tacChance, itemAmount, itemChance){
	var pool = [];
	
	if(level < 1) level == 1;
	
	pool.push("loot: (LEVEL" + level + ")");

	for(var i = 0; i < rollRange(consumableAmount); i++){
		//level = Math.floor(Math.random() * ((lvl + diff) - (lvl - diff)) + (lvl - diff));
		pool.push("consumable: "+await getRandomEquipmentByLevel("Consumable", level));
	}

	for(var i = 0; i < rollRange(tacAmount); i++){
		var tacIncluded = rollRange(100) <= tacChance;
		//level = Math.floor(Math.random() * ((lvl + diff) - (lvl - diff)) + (lvl - diff));
	
		if (tacIncluded){
			var tacType = rollRange(3);
			if(tacType == 1)
				pool.push("armor: " + await getRandomEquipmentByLevel("Armor", level));
			if(tacType == 2)
				pool.push("weapon: " + await getRandomEquipmentByLevel("Weapon", level));
			if(tacType == 3)
				pool.push("shield: " + await getRandomEquipmentByLevel("Shield", level));
		}
	}

	for(var i = 0; i < rollRange(itemAmount); i++){
		var itemIncluded = rollRange(100) <= tacChance;
		//level = Math.floor(Math.random() * ((lvl + diff) - (lvl - diff)) + (lvl - diff));
	
		if(itemIncluded){
			var itemType = rollRange(4);
			if(itemType == 1)
				pool.push("augment: " + await getRandomEquipmentByLevel("Augment", level));
			if(itemType == 2)
				pool.push("magicItem: " + await getRandomEquipmentByLevel("MagicItem", level));
			if(itemType == 3)
				pool.push("techItem: " + await getRandomEquipmentByLevel("TechItem", level));
			if(itemType == 4)
				pool.push("hybridItem: " + await getRandomEquipmentByLevel("HybridItem", level));
		}		
	}

	for(var i = 0; i < pool.length; i++)
		console.log(pool[i]);
	return pool
}

function rollRange(r){
    return Math.floor(Math.random() * r) + 1;
}

function addListToFile(list, fileName){
	for(let i = 0; i < list.length; i++){
		var str2add = list[i];
	  // str2add = str2add.replace('*', '');
	   if(str2add[0] == ' ')
		   str2add = str2add.slice(1, str2add.length);
      fs.appendFile(fileName, str2add+'\n', (err) => {
        if (err) throw err;
      })
    }
}

module.exports = {
	rollLootPool: async function rollLootPool(level, consumableAmount, tacAmount, tacChance, itemAmount, itemChance){
		var pool = [];
		
		if(level < 1) level == 1;
		
	    pool.push("loot: (LEVEL" + level + ")");
	
		for(var i = 0; i < rollRange(consumableAmount); i++){
			//level = Math.floor(Math.random() * ((lvl + diff) - (lvl - diff)) + (lvl - diff));
			pool.push("consumable: "+await getRandomEquipmentByLevel("Consumable", level));
		}
	
		for(var i = 0; i < rollRange(tacAmount); i++){
			var tacIncluded = rollRange(100) <= tacChance;
			//level = Math.floor(Math.random() * ((lvl + diff) - (lvl - diff)) + (lvl - diff));
		
			if (tacIncluded){
				var tacType = rollRange(3);
				if(tacType == 1)
					pool.push("armor: " + await getRandomEquipmentByLevel("Armor", level));
				if(tacType == 2)
					pool.push("weapon: " + await getRandomEquipmentByLevel("Weapon", level));
				if(tacType == 3)
					pool.push("shield: " + await getRandomEquipmentByLevel("Shield", level));
			}
		}
	
		for(var i = 0; i < rollRange(itemAmount); i++){
			var itemIncluded = rollRange(100) <= tacChance;
			//level = Math.floor(Math.random() * ((lvl + diff) - (lvl - diff)) + (lvl - diff));
		
			if(itemIncluded){
				var itemType = rollRange(4);
				if(itemType == 1)
					pool.push("augment: " + await getRandomEquipmentByLevel("Augment", level));
				if(itemType == 2)
					pool.push("magicItem: " + await getRandomEquipmentByLevel("MagicItem", level));
				if(itemType == 3)
					pool.push("techItem: " + await getRandomEquipmentByLevel("TechItem", level));
				if(itemType == 4)
					pool.push("hybridItem: " + await getRandomEquipmentByLevel("HybridItem", level));
			}		
		}
	
		//for(var i = 0; i < pool.length; i++)
		//	console.log(pool[i]);
		return pool
	}
	
}
 
//rollLootPool(8, 1, 0, 0, 0, 0);


