const fetch = require('isomorphic-fetch');
const jsdom = require("jsdom");
const fs = require('fs');
const path = require('path');
const { JSDOM } = jsdom;

async function newsFeedDateHasChanged(){
  try{
    const response = await fetch('https://www.aonsrd.com/');
    const text = await response.text();
    const dom = await new JSDOM(text);
    const mainPage = dom.window.document.getElementById('ctl00_MainContent_MainNewsFeed');
    let newPageDate = mainPage.textContent.slice(0,19);
    oldPageDate = getRaceListFileDate();
	//console.log(oldPageDate+" vs\n"+newPageDate);
    if(newPageDate != oldPageDate){
		fs.writeFile('RaceList.txt', newPageDate+"\n", (err) => {
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

function getRaceListFileDate(){
  try {
    var data = fs.readFileSync("./RaceList.txt", { encoding: 'utf8', flag: 'r' });
    var ret = data.split('\n');
    return ret.slice(0,1);
  } catch (e) {
    console.log(e);
    return [];
  }
}

async function scrapeRaces(){  
  var listChanged = await newsFeedDateHasChanged();
  if(!listChanged){
	//console.log("no new races!");
    return;
  }else{
    try{
        const response = await fetch('https://www.aonsrd.com/Races.aspx?ItemName=All');
        const text = await response.text();
        const dom = await new JSDOM(text);
        const coreRaces   = dom.window.document.getElementById('ctl00_MainContent_GridViewRacesCore').getElementsByTagName("a");
		const legacyRaces = dom.window.document.getElementById('ctl00_MainContent_GridViewRacesCoreLegacy').getElementsByTagName("a");
        const otherRaces  = dom.window.document.getElementById('ctl00_MainContent_GridViewRacesOther').getElementsByTagName("a");
        
		addListToRaceListFile(coreRaces);
		addListToRaceListFile(legacyRaces);
		addListToRaceListFile(otherRaces);
		console.log("\n\nupdated race page!");
      }catch(err){
        console.log(err);
      }
    }
}

function addListToRaceListFile(raceList){
	for(let i = 0; i < raceList.length; i++){
		var str2add = raceList[i].text;
	  str2add = str2add.replace('*', '');
	  if(str2add[0] == ' ')
		  str2add = str2add.slice(1, str2add.length);
      fs.appendFile('RaceList.txt', str2add+'\n', (err) => {
        if (err) throw err;
      })
    }
}

function getRaceListFile() {
  try {
    var data = fs.readFileSync("./RaceList.txt", { encoding: 'utf8', flag: 'r' });
    var ret = data.split('\n');
    return ret.slice(1);
  } catch (e) {
    console.log(e);
    return [];
  }
}

module.exports = {
	getRandomRace: async function getRandomRace(){
	  let allRaces = await getRaceListFile();
	  if(allRaces.length == 0){
		allRaces = await scrapeRaces();
	  }
	  var index = Math.floor(Math.random()*allRaces.length);
	  return allRaces[index];
	  //document.getElementById("NPCInfo").innerHTML = allRaces[index]+"<br />";
	  scrapeRaces();
	}
}
scrapeRaces();