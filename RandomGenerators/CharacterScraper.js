const fetch = require('isomorphic-fetch');
const jsdom = require("jsdom");
const fs = require('fs');
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

async function newsFeedDateHasChanged(){
  try{
    const response = await fetch('https://www.aonsrd.com/');
    const text = await response.text();
    const dom = await new JSDOM(text);
    const mainPage = dom.window.document.getElementById('ctl00_MainContent_MainNewsFeed');
    //NOTE: might need to look into a better way of selecting the date of the main page
    let newPageDate = mainPage.textContent.slice(0,19);
    oldPageDate = fetchRaceListDate();
    if(newPageDate != oldPageDate){
      fs.writeFile('RaceList.txt', newPageDate, (err) => {
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

function fetchRaceListDate(){
  try{
    fs.readFile("./RaceList.txt", 'utf8', function(err, data){
      var ret = data.split('\n');
      return ret[0];
  });
  }catch (e){
    console.log("reason for failure");
    console.log(e);
    return [""];
  }
}

async function scrapeRaces(){
  if(!newsFeedDateHasChanged()){
    return;
  }else{
    try{
        const response = await fetch('https://www.aonsrd.com/Races.aspx?ItemName=All');
        const text = await response.text();
        const dom = await new JSDOM(text);
        const raceElements = dom.window.document.getElementById('ctl00_MainContent_AllRacesList');
        let raceList = raceElements.getElementsByTagName("a");

        for(let i = 0; i < raceList.length; i++){
          //console.log(raceList[i].textContent);
          fs.appendFile('RaceList.txt', raceList[i].textContent+'\n', (err) => {
            if (err) throw err;
          })
        }
        return raceList;
      }catch(err){
        console.log(err);
      }
    }
}

async function getRandomRace(){
  let allRaces = await getRaceListFile();
  //TODO: type of allRaces is undefined?!
  if(allRaces.length == 0){
    console.log("read file failed, reading from scraped list")
    allRaces = await scrapeRaces();
  }else{
    console.log("read file succeded, reading from file")
  }
  //console.log("\nrandom Race:");
  //console.log(allRaces[Math.floor(Math.random()*allRaces.length)].textContent);
}

function getRaceListFile(){
  try{
    fs.readFile("./RaceList.txt", 'utf8', function(err, data){
      var ret = data.split('\n');
      console.log(ret);
      return ret;
  });
  }catch (e){
    console.log("reason for failure");
    console.log(e);
    return [""];
  }
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
//methods for use case
getRandomRace();
//scrapeFeats();
//scrapeThemes();
