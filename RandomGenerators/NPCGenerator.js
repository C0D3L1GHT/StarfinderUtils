const fs = require('fs');
const path = require('path');
const randomRace = require('./RaceScraper.js');

const NAME_LENGTH  = 8
const NPC_RACE     = "Human"
const NPC_ATTITUDE = ["hostile", "unfriendly", "indifferent", "friendly", "helpful"];
const NPC_QUIRK    = "Ends Sentences with 'You know?' a lot"

function generateName(){
   let ret = '';
   let vowels = [97,101,105,111,117];
   for(let i = 0; i < NAME_LENGTH; i++){
      const random = Math.floor(Math.random() * 26);
	  if(i % 2 == 0)
		  ret += String.fromCharCode(vowels[rollRange(5)-1]);
	  else
          ret += String.fromCharCode(97 + random);
   };
   return ret;
}

function rollAttitude(){
	return NPC_ATTITUDE[rollRange(5)-1];
}

function getQuirksListFile(){
	try {
       var data = fs.readFileSync("./ListFiles/QuirkList.txt", { encoding: 'utf8', flag: 'r' });
       var ret = data.split('\n');
       return ret;
  } catch (e) {
       console.log(e);
       return [];
  }
}

function getEmotionsListFile(){
	try {
       var data = fs.readFileSync("./ListFiles/EmotionList.txt", { encoding: 'utf8', flag: 'r' });
       var ret = data.split('\n');
       return ret;
  } catch (e) {
       console.log(e);
       return [];
  }
}

async function generateNPC(){
	
   let allQuirks = await getQuirksListFile();
   var qIndex = Math.floor(Math.random()*allQuirks.length);
   var quirk = allQuirks[qIndex];
   
   let allFeelings = await getEmotionsListFile();
   var fIndex = Math.floor(Math.random()*allFeelings.length);
   var feeling = allFeelings[fIndex];
   
   var race = await randomRace.getRandomRace();
   var name = generateName();
   var attitude = rollAttitude();
   var ret = name+", a "+attitude+" "+race+" feeling "+feeling+" who "+quirk;
   ret = ret.replace(/\r?\n|\r/g, "");
   console.log(ret);
}

function rollRange(r){
  return Math.floor(Math.random() * r) + 1;
}

generateNPC();