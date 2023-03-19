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
	const response = await fetch(pageLink);
	const text = await response.text();
	const dom = await new JSDOM(text);
	const list = [];
	const table = dom.window.document.getElementById(tableName).getElementsByTagName("tr")
	
	for (var i = 1; i < table.length; i++) {
		if(table[i]){
			if(table[i].cells[1] && table[i].cells[0]){
				var name  = table[i].cells[0].textContent;
				if(name[0] == ' ') name = name.slice(1);
				var level = table[i].cells[1].textContent;
				//console.log(name + " (" + level + ")");
				list.push(name + " {" + level + "}");
			}
		}
	}
	if(!list.isEmpty)
		addListToFile(list, textFile);
}

async function scrapeNecroGrafts(textFile, pageLink, tableName){
	const response = await fetch(pageLink);
	const text = await response.text();
	const dom = await new JSDOM(text);
	const list = [];
	const necrograftNamesList = dom.window.document.getElementsByClassName("inner");
	const graftsList = necrograftNamesList[0].textContent.split(" ");
	const table = dom.window.document.getElementById(tableName).getElementsByTagName("tr");
	
	for (var i = 1; i < table.length; i++){
		if(table[i].cells[0]){
			// extract necrograft name
			var graftName = table[i].cells[0].textContent;
			if(graftName[0] == ' ') graftName = graftName.slice(1); 
			if(graftName[0] != 'Name'){
				for(var j = 1; j < graftsList.length; j++){
					var mark = "Mk" + graftsList[j][0];
					var level = graftsList[j][1];
					if(graftsList[j][0] > 2){
						level = graftsList[j][1] + graftsList[j][2];
					}
					var entry = mark + " " + graftName + " {" + level + "}";
					// console.log(entry);
					list.push(entry);
				}
			}
		}
	}
	addListToFile(list, textFile);
}

async function scrapeArmors(){
	var listChanged = await newsFeedDateHasChanged("./ListFiles/ArmorList.txt");
	if(!listChanged){
		//console.log("no new content!");
		return;
	}else{
		try{
			const lightArmor   = await scrapeInfoAndAddToFile("./ListFiles/ArmorList.txt", 'https://aonsrd.com/Armor.aspx?Category=Light', 'ctl00_MainContent_GridViewArmor', 1);
			const heavyArmor   = await scrapeInfoAndAddToFile("./ListFiles/ArmorList.txt", 'https://aonsrd.com/Armor.aspx?Category=Heavy', 'ctl00_MainContent_GridViewArmor', 1);
			const poweredArmor = await scrapeInfoAndAddToFile("./ListFiles/ArmorList.txt", 'https://aonsrd.com/PoweredArmor.aspx?ItemName=All', 'ctl00_MainContent_GridViewPoweredArmor', 1);
			const armorUpgrade = await scrapeInfoAndAddToFile("./ListFiles/ArmorList.txt", 'https://aonsrd.com/ArmorUpgrades.aspx?ItemName=All&Family=None', 'ctl00_MainContent_GridViewArmorUpgrades', 1);
			console.log("\n\nupdated armor page!");
	}catch(err){
			console.log(err);
		}
	}
}

async function scrapeShields(){
	var listChanged = await newsFeedDateHasChanged("./ListFiles/ShieldList.txt");
	if(!listChanged){
		//console.log("no new content!");
		return;
	}else{
		try{
			const shield = await scrapeInfoAndAddToFile("./ListFiles/ShieldList.txt", 'https://aonsrd.com/Shields.aspx', 'ctl00_MainContent_DataElement', 1);
			console.log("\n\nupdated shield page!");
	}catch(err){
			console.log(err);
		}
	}
}

async function scrapeWeapons(){
	var listChanged = await newsFeedDateHasChanged("./ListFiles/WeaponList.txt");
	if(!listChanged){
		//console.log("no new content!");
		return;
	}else{
		try{
			const advMelee1h   = await scrapeInfoAndAddToFile("./ListFiles/WeaponList.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=AdvMelee', 'ctl00_MainContent_GridViewWeapons1Hand', 2);
			const advMelee2h   = await scrapeInfoAndAddToFile("./ListFiles/WeaponList.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=AdvMelee', 'ctl00_MainContent_GridViewWeapons2Hands', 2);
			const basMelee1h   = await scrapeInfoAndAddToFile("./ListFiles/WeaponList.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=BasicMelee', 'ctl00_MainContent_GridViewWeapons1Hand', 2);
			const basMelee2h   = await scrapeInfoAndAddToFile("./ListFiles/WeaponList.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=BasicMelee', 'ctl00_MainContent_GridViewWeapons2Hands', 2);
			const heavyArms    = await scrapeInfoAndAddToFile("./ListFiles/WeaponList.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=BasicMelee', 'ctl00_MainContent_GridViewWeapons2Hands', 2);
			const longArms     = await scrapeInfoAndAddToFile("./ListFiles/WeaponList.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=Longarms', 'ctl00_MainContent_GridViewWeapons2Hands', 2);
			const smallArms	   = await scrapeInfoAndAddToFile("./ListFiles/WeaponList.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=SmallArms', 'ctl00_MainContent_GridViewWeapons1Hand', 2);
			const sniper       = await scrapeInfoAndAddToFile("./ListFiles/WeaponList.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=Sniper', 'ctl00_MainContent_GridViewWeapons2Hands', 2);
			const solarianCrys = await scrapeInfoAndAddToFile("./ListFiles/WeaponList.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=Solarian', 'ctl00_MainContent_GridViewWeapons1Hand', 1);
			const special1h    = await scrapeInfoAndAddToFile("./ListFiles/WeaponList.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=Special', 'ctl00_MainContent_GridViewWeapons1Hand', 2);
			const special2h	   = await scrapeInfoAndAddToFile("./ListFiles/WeaponList.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=Special', 'ctl00_MainContent_GridViewWeapons2Hands', 2);
			const accessories  = await scrapeInfoAndAddToFile("./ListFiles/WeaponList.txt", 'https://aonsrd.com/WeaponAccessories.aspx?ItemName=All&Family=None', 'ctl00_MainContent_GridViewWeaponAccessories', 1);
			const fusions      = await scrapeInfoAndAddToFile("./ListFiles/WeaponList.txt", 'https://aonsrd.com/WeaponFusions.aspx?ItemName=All', 'ctl00_MainContent_GridViewWeaponFusions', 1);
			console.log("\n\nupdated weapons page!");
	}catch(err){
			console.log(err);
		}
	}
}

async function scrapeConsumables(){
	var listChanged = await newsFeedDateHasChanged("./ListFiles/ConsumablesList.txt.txt");
	if(!listChanged){
		//console.log("no new content!");
		return;
	}else{
		try{
			const ammo     = await scrapeInfoAndAddToFile("./ListFiles/ConsumablesList.txt.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=Ammo', 'ctl00_MainContent_GridViewWeapons1Hand', 2);
			const grenade  = await scrapeInfoAndAddToFile("./ListFiles/ConsumablesList.txt.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=Grenade', 'ctl00_MainContent_GridViewWeapons1Hand', 1);
			const drugs    = await scrapeInfoAndAddToFile("./ListFiles/ConsumablesList.txt.txt", 'https://aonsrd.com/OtherItems.aspx?Category=Medicinals', 'ctl00_MainContent_GridViewOtherItems', 1);
			const personal = await scrapeInfoAndAddToFile("./ListFiles/ConsumablesList.txt.txt", 'https://aonsrd.com/OtherItems.aspx?Category=Personal%20Items', 'ctl00_MainContent_GridViewOtherItems', 2);
	}catch(err){
			console.log(err);
		}
	}
}

async function scrapeAugments(){
	var listChanged = await newsFeedDateHasChanged("./ListFiles/AugmentsList.txt");
	if(!listChanged){
		//console.log("no new content!");
		return;
	}else{
		try{
			scrapeInfoAndAddToFile("./ListFiles/AugmentsList.txt", 'https://aonsrd.com/Cybernetics.aspx?ItemName=All&Family=None', 'ctl00_MainContent_GridViewCybernetics', 1);
			scrapeInfoAndAddToFile("./ListFiles/AugmentsList.txt", 'https://aonsrd.com/Biotech.aspx?ItemName=All&Family=None', 'ctl00_MainContent_GridViewBiotech', 1);
			scrapeInfoAndAddToFile("./ListFiles/AugmentsList.txt", 'https://aonsrd.com/Magitech.aspx?ItemName=All&Family=None', 'ctl00_MainContent_GridViewMagitech', 1);
			scrapeNecroGrafts("./ListFiles/AugmentsList.txt", 'https://aonsrd.com/Necrografts.aspx?ItemName=All&Family=None', 'ctl00_MainContent_GridViewNecrografts');
			scrapeInfoAndAddToFile("./ListFiles/AugmentsList.txt", 'https://aonsrd.com/PersonalUpgrades.aspx?ItemName=All&Family=None', 'ctl00_MainContent_GridViewPersonalUpgrades', 1);
			scrapeInfoAndAddToFile("./ListFiles/AugmentsList.txt", 'https://aonsrd.com/SpeciesGrafts.aspx?ItemName=All&Family=None', 'ctl00_MainContent_GridViewSpeciesGrafts', 1);
			console.log("\n\nupdated augments page!");
	}catch(err){
			console.log(err);
		}
	}
}

async function scrapeTechItems(){
	var listChanged = await newsFeedDateHasChanged("./ListFiles/TechItemList.txt");
	if(!listChanged){
		//console.log("no new content!");
		return;
	}else{
		try{
			const tech = await scrapeInfoAndAddToFile("./ListFiles/TechItemList.txt", 'https://aonsrd.com/TechItems.aspx?ItemName=All&Family=None', 'ctl00_MainContent_GridViewTechItems', 2);
			console.log("\n\nupdated tech item page!");
	}catch(err){
			console.log(err);
		}
	}
}

async function scrapeMagicItems(){
	var listChanged = await newsFeedDateHasChanged("./ListFiles/MagicItemList.txt");
	if(!listChanged){
		//console.log("no new content!");
		return;
	}else{
		try{
			const magic = await scrapeInfoAndAddToFile("./ListFiles/MagicItemList.txt", 'https://aonsrd.com/MagicItems.aspx?ItemName=All&Family=None', 'ctl00_MainContent_GridViewMagicItems', 2);
			console.log("\n\nupdated magic item page!");
	}catch(err){
			console.log(err);
		}
	}
}

async function scrapeHybridItems(){
	var listChanged = await newsFeedDateHasChanged("./ListFiles/HybridItemList.txt");
	if(!listChanged){
		//console.log("no new content!");
		return;
	}else{
		try{
			const hybrid = await scrapeInfoAndAddToFile("./ListFiles/HybridItemList.txt", 'https://aonsrd.com/HybridItems.aspx?ItemName=All&Family=None', 'ctl00_MainContent_GridViewHybridItems', 1);
			console.log("\n\nupdated hybrid item page!");
	}catch(err){
			console.log(err);
		}
	}
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
		if (equipmentType == "Armor") equipmentByLevel = await getAllEquipmentByLevel("./ListFiles/ArmorList.txt",lvl);
		if (equipmentType == "Weapon") equipmentByLevel = await getAllEquipmentByLevel("./ListFiles/WeaponList.txt",lvl);
		if (equipmentType == "Shield") equipmentByLevel = await getAllEquipmentByLevel("./ListFiles/ShieldList.txt",lvl);
		if (equipmentType == "Consumable") equipmentByLevel = await getAllEquipmentByLevel("./ListFiles/ConsumablesList.txt",lvl);
		if (equipmentType == "Augment") equipmentByLevel = await getAllEquipmentByLevel("./ListFiles/AugmentsList.txt",lvl);
		if (equipmentType == "MagicItem") equipmentByLevel = await getAllEquipmentByLevel("./ListFiles/MagicItemList.txt",lvl);
		if (equipmentType == "TechItem") equipmentByLevel = await getAllEquipmentByLevel("./ListFiles/TechItemList.txt",lvl);
		if (equipmentType == "HybridItem") equipmentByLevel = await getAllEquipmentByLevel("./ListFiles/HybridItemList.txt",lvl);
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

// scrapeArmors();
// scrapeAugments();
// scrapeConsumables();
// scrapeHybridItems();
// scrapeMagicItems();
// scrapeShields();
// scrapeTechItems();
// scrapeWeapons();
//rollLootPool(8, 1, 1, 80, 1, 80);


