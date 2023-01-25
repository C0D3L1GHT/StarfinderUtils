const fs = require('fs');
const path = require('path');

const NPC_NAMES    = [""]
const NPC_RACE     = "Human"
const NPC_ATTITUDE = ["hostile", "unfriendly", "indifferent", "friendly", "helpful"];
const NPC_QUIRK    = "Ends Sentences with 'You know?' a lot"

function generateNPC(){
	//TODO: Generate a name somehow
    console.log(rollAttitude()+" "+NPC_RACE+" that "+quirk);
}

function generateName(){
    //TODO: implement this somehow
}

function rollAttitude(){
	return NPC_ATTITUDE[rollRange(5)-1];
}

function getQuirksListFile(){
	try {
       var data = fs.readFileSync("./QuirksList.txt", { encoding: 'utf8', flag: 'r' });
       var ret = data.split('\n');
       return ret;
  } catch (e) {
       console.log(e);
       return [];
  }
}

async function rollQuirk(){
   let allQuirks = await getQuirksListFile();
   var index = Math.floor(Math.random()*allQuirks.length);
   return allQuirks[index];
}

function rollRange(r){
  return Math.floor(Math.random() * r) + 1;
}

generateNPC();