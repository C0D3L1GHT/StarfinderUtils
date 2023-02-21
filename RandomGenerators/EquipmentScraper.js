const fetch = require('isomorphic-fetch')
const jsdom = require("jsdom");
const fs = require('fs');
const path = require('path');
const { JSDOM } = jsdom;

const LIGHT_ARMOR_DATA_START   	= 10;
const HEAVY_ARMOR_DATA_START   	= 10;
const POWERED_ARMOR_DATA_START 	= 3;
const ARMOR_UPGRADE_DATA_START 	= 8;
const SHIELD_DATA_START        	= 8;
const ADV_MELEE_DATA_START 	   	= 7;
const AMMO_DATA_START		   	= 6;
const BASIC_MELEE_DATA_START	= 8;
const GRENADE_DATA_START		= 7;
const HEAVY_ARMS_DATA_START		= 11;
const LONG_ARMS_DATA_START		= 11;
const SMALL_ARMS_DATA_START		= 11;
const SNIPER_DATA_START			= 11;
const SOLARIAN_DATA_START		= 7;
const SPECIAL_DATA_START		= 11;
const ACCESSORIES_DATA_START	= 7;
const FUSIONS_DATA_START		= 3;

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

async function scrapeInfoAndAddToFile(textFile, pageLink, tableName, dataStart){
	var listChanged = await newsFeedDateHasChanged(textFile);
	if(!listChanged){
		//console.log("no new content!");
		return;
	}else{
		try{
			const response = await fetch(pageLink);
			const text = await response.text();
			const dom = await new JSDOM(text);
			const list = dom.window.document.getElementById(tableName).getElementsByTagName("a");
			const table = dom.window.document.getElementsByTagName("table")[0].children[0];
			for (var i = 1; i < table.rows.length; i++) {
				var level = table.children[i].children[1].textContent;
				list[i+dataStart-1].text = list[i+dataStart-1].text + " (" + level + ")"; 
				//console.log(list[i+dataStart-1].text);
			}
			addListToFile(list, textFile, dataStart);
		}catch(err){
			console.log(err);
		}
	}
}

async function scrapeArmors(){
	const lightArmor   = await scrapeInfoAndAddToFile("ArmorList.txt", 'https://aonsrd.com/Armor.aspx?Category=Light', 'ctl00_MainContent_GridViewArmor', LIGHT_ARMOR_DATA_START);
	const heavyArmor   = await scrapeInfoAndAddToFile("ArmorList.txt", 'https://aonsrd.com/Armor.aspx?Category=Heavy', 'ctl00_MainContent_GridViewArmor', HEAVY_ARMOR_DATA_START);
	const poweredArmor = await scrapeInfoAndAddToFile("ArmorList.txt", 'https://aonsrd.com/PoweredArmor.aspx?ItemName=All', 'ctl00_MainContent_GridViewPoweredArmor', POWERED_ARMOR_DATA_START);
	const armorUpgrade = await scrapeInfoAndAddToFile("ArmorList.txt", 'https://aonsrd.com/ArmorUpgrades.aspx?ItemName=All&Family=None', 'ctl00_MainContent_GridViewArmorUpgrades', ARMOR_UPGRADE_DATA_START);
	console.log("\n\nupdated armor page!");
}

function getArmorListFile(){
  try {
    var data = fs.readFileSync("./ArmorList.txt", { encoding: 'utf8', flag: 'r' });
    var ret = data.split('\n');
    return ret.slice(1);
  } catch (e) {
    console.log(e);
    return [];
  }
}

async function scrapeShields(){
    const shield = await scrapeInfoAndAddToFile("ShieldList.txt", 'https://aonsrd.com/Shields.aspx', 'ctl00_MainContent_DataElement', SHIELD_DATA_START)
	console.log("\n\nupdated shield page!");
}

function getShieldListFile(){
  try {
    var data = fs.readFileSync("./ShieldList.txt", { encoding: 'utf8', flag: 'r' });
    var ret = data.split('\n');
    return ret.slice(1);
  } catch (e) {
    console.log(e);
    return [];
  }
}

async function scrapeWeapons(){
	// TODO: some weapon tables have level after "category". Update the scrapeInfo to take this into account
	const advMelee1h   = await scrapeInfoAndAddToFile("WeaponList.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=AdvMelee', 'ctl00_MainContent_GridViewWeapons1Hand', ADV_MELEE_START_DATA_START);
	const advMelee2h   = await scrapeInfoAndAddToFile("WeaponList.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=AdvMelee', 'ctl00_MainContent_GridViewWeapons2Hands', ADV_MELEE_START_DATA_START);
	const ammo         = await scrapeInfoAndAddToFile("ConsumablesList.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=Ammo', 'ctl00_MainContent_GridViewWeapons1Hand', AMMO_DATA_START);
	const basMelee1h   = await scrapeInfoAndAddToFile("WeaponList.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=BasicMelee', 'ctl00_MainContent_GridViewWeapons1Hand', BASIC_MELEE_DATA_START);
	const basMelee2h   = await scrapeInfoAndAddToFile("WeaponList.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=BasicMelee', 'ctl00_MainContent_GridViewWeapons2Hands', BASIC_MELEE_DATA_START);
	const grenade      = await scrapeInfoAndAddToFile("ConsumablesList.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=Grenade', 'ctl00_MainContent_GridViewWeapons1Hand', GRENADE_DATA_START);
	const heavyArms    = await scrapeInfoAndAddToFile("WeaponList.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=BasicMelee', 'ctl00_MainContent_GridViewWeapons2Hands', BASIC_MELEE_DATA_START);
	const longArms     = await scrapeInfoAndAddToFile("WeaponList.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=Longarms', 'ctl00_MainContent_GridViewWeapons2Hands', LONG_ARMS_DATA_START);
	const smallArms	   = await scrapeInfoAndAddToFile("WeaponList.txt",  'https://aonsrd.com/Weapons.aspx?Proficiency=SmallArms', 'ctl00_MainContent_GridViewWeapons1Hand', SMALL_ARMS_DATA_START);
	const sniper       = await scrapeInfoAndAddToFile("WeaponList.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=Sniper', 'ctl00_MainContent_GridViewWeapons2Hands', SNIPER_DATA_START);
	const solarianCrys = await scrapeInfoAndAddToFile("WeaponList.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=Solarian', 'ctl00_MainContent_GridViewWeapons1Hand', SOLARIAN_DATA_START);
    const special1h    = await scrapeInfoAndAddToFile("WeaponList.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=Special', 'ctl00_MainContent_GridViewWeapons1Hand', SPECIAL_DATA_START);
	const special2h	   = await scrapeInfoAndAddToFile("WeaponList.txt", 'https://aonsrd.com/Weapons.aspx?Proficiency=Special', 'ctl00_MainContent_GridViewWeapons2Hands', SPECIAL_DATA_START);
    const accessories  = await scrapeInfoAndAddToFile("WeaponList.txt", 'https://aonsrd.com/WeaponAccessories.aspx?ItemName=All&Family=None', 'ctl00_MainContent_GridViewWeaponAccessories', ACCESSORIES_DATA_START);
    const fusions      = await scrapeInfoAndAddToFile("WeaponList.txt", 'https://aonsrd.com/WeaponFusions.aspx?ItemName=All', 'ctl00_MainContent_GridViewWeaponFusions', FUSIONS_DATA_START);
	
	console.log("\n\nupdated weapons page!");
}

async function scrapeAmmo(){
	
}

async function scrapeWeaponAccessories(){
	
}

function scrapeAugments(){
	
}

function scrapeDrugs(){
	
}

function scrapeTechItems(){
	
}

function scrapeMagicItems(){
	
}

function scrapeHybridItems(){
	
}

async function getAllArmorByLevel(lvl){
	let allArmors = await getArmorListFile();
	let allArmorsbyLevel = []
	if(allArmors.length == 0){
		scrapeArmors();
		allArmors = await getArmorListFile();
	}
	
	for(var i = 0; i < allArmors.length; i++){
		if (allArmors[i].includes("("+lvl+")"))
			allArmorsbyLevel.push(allArmors[i]);
	}
	return allArmorsbyLevel;
}

async function getRandomArmorByLevel(lvl){
	if(lvl < 1 || lvl > 20)
		console.log("invalid level: enter a number between 1 and 20")
	var armorByLevel = await getAllArmorByLevel(lvl);
  
	var index = Math.floor(Math.random()*armorByLevel.length);
	console.log(armorByLevel[index]);
	return armorByLevel[index];
}

async function getAllShieldsByLevel(lvl){
	let allShields = await getShieldListFile();
	let allShieldsbyLevel = []
	if(allShields.length == 0){
		scrapeShields();
		allShields = await getShieldListFile();
	}
	
	for(var i = 0; i < allShields.length; i++){
		if (allShields[i].includes("("+lvl+")"))
			allShieldsbyLevel.push(allShields[i]);
	}
	return allShieldsbyLevel;
}

async function getRandomShieldByLevel(lvl){
	if(lvl < 1 || lvl > 20)
		console.log("invalid level: enter a number between 1 and 20")
	var shieldByLevel = await getAllShieldsByLevel(lvl);
  
	var index = Math.floor(Math.random()*shieldByLevel.length);
	console.log(shieldByLevel[index]);
	return shieldByLevel[index];
}

function addListToFile(list, fileName, startIndex){
	for(let i = startIndex; i < list.length; i++){
		var str2add = list[i].text;
	  // str2add = str2add.replace('*', '');
	   if(str2add[0] == ' ')
		   str2add = str2add.slice(1, str2add.length);
      fs.appendFile(fileName, str2add+'\n', (err) => {
        if (err) throw err;
      })
    }
}

module.exports = {
	getRandomArmorbyLevel: async function getRandomArmorByLevel(lvl){
		if(lvl < 1 || lvl > 20)
			console.log("invalid level: enter a number between 1 and 20")
		var armorByLevel = await getAllArmorByLevel(lvl);
  
		var index = Math.floor(Math.random()*armorByLevel.length);
		console.log(armorByLevel[index]);
		return armorByLevel[index];
	}
}
getRandomShieldByLevel(1);
getRandomArmorByLevel(1);