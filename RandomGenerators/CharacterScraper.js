const fetch = require('isomorphic-fetch')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function scrapeClasses(){
  (async () => {
    try{
      const response = await fetch('https://www.aonsrd.com/Classes.aspx');
      const text = await response.text();
      const dom = await new JSDOM(text);
      const classElements = dom.window.document.getElementById('ctl00_MainContent_FullClassList');
      const classList = classElements.getElementsByTagName('a');
      //TODO: add all of these strings to an array later
      for(let i = 0; i < classList.length; i++){
        console.log(classList[i].textContent);
      }
    }catch(err){
      console.log(err);
    }
  })();
}

async function scrapeRaces(){
  try{
      const response = await fetch('https://www.aonsrd.com/Races.aspx?ItemName=All');
      const text = await response.text();
      const dom = await new JSDOM(text);
      const raceElements = dom.window.document.getElementById('ctl00_MainContent_AllRacesList');
      let raceList = raceElements.getElementsByTagName("a");
      for(let i = 0; i < raceList.length; i++){
        //console.log(raceList[i].textContent);
      }
      return raceList;
    }catch(err){
      console.log(err);
    }
}

async function getRandomRace(){
  let allRaces = await scrapeRaces();
  //console.log(allRaces);
  console.log("\n\nrandom Race:");
  console.log(allRaces[Math.floor(Math.random()*allRaces.length)].textContent);
}

function scrapeThemes(){
  (async () => {
    try{
      const response = await fetch('https://www.aonsrd.com/Themes.aspx?ItemName=All');
      const text = await response.text();
      const dom = await new JSDOM(text);
      const themeElements = dom.window.document.getElementById('ctl00_MainContent_DataListTalentsAll');
      const themeList = themeElements.getElementsByTagName('a');
      //TODO: add all of these strings to an array later
      //TODO: find a way to print the stat ups at level 1 alongside the theme names
      for(let i = 0; i < themeList.length; i++){
        console.log(themeList[i].textContent);
      }
    }catch(err){
      console.log(err);
    }
  })();
}

function scrapeFeats(){
  (async () => {
    try{
      const response = await fetch('https://www.aonsrd.com/Feats.aspx');
      const text = await response.text();
      const dom = await new JSDOM(text);
      const featElements = dom.window.document.getElementById('ctl00_MainContent_GridView6');
      const featNameList = featElements.getElementsByTagName('a');
      const featReqList = featElements.getElementsByTagName('td');
      //TODO: add all of these strings to an array later
      for(let i = 0; i < featNameList.length; i++){
        console.log(featNameList[i].textContent+" "+featReqList[i].textContent);
      }
    }catch(err){
      console.log(err);
    }
  })();
}


//scrapeClasses();
//scrapeRaces();
getRandomRace();
getRandomRace();
getRandomRace();
getRandomRace();
getRandomRace();
//scrapeFeats();
//scrapeThemes();
