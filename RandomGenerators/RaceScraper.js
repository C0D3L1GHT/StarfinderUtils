const fetch = require('isomorphic-fetch');
const jsdom = require("jsdom");
const fs = require('fs');
const path = require('path');
const { JSDOM } = jsdom;

// This returns Promise { Pending }, not true or false
async function newsFeedDateHasChanged(){
  try{
    const response = await fetch('https://www.aonsrd.com/');
    const text = await response.text();
    const dom = await new JSDOM(text);
    const mainPage = dom.window.document.getElementById('ctl00_MainContent_MainNewsFeed');
    let newPageDate = mainPage.textContent.slice(0,19);
    oldPageDate = getRaceListFileDate();
	//console.log(oldPageDate+"\n"+newPageDate);
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
  if(!newsFeedDateHasChanged()){
	console.log("no new races!");
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
      }catch(err){
        console.log(err);
      }
    }
}

function addListToRaceListFile(raceList){
	for(let i = 0; i < raceList.length; i++){
      fs.appendFile('RaceList.txt', raceList[i].text+'\n', (err) => {
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

async function getRandomRace(){
  let allRaces = await getRaceListFile();
  if(allRaces.length == 0){
    allRaces = await scrapeRaces();
  }
  var index = Math.floor(Math.random()*allRaces.length);
  //console.log(index);
  document.getElementById("NPCInfo").innerHTML = allRaces[index]+"<br />";
  scrapeRaces();
}
getRandomRace();