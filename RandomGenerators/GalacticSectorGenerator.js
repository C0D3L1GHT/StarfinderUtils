const fs = require('fs');
const path = require('path');
const table = require('table').table;
const randomSystem = require('./StellarSystemGenerator.js');

var sectors_list = ["Amaranth","Annatto","Atroviren","Aurecolin","Cattleya","Celadon","Coquelicot","Damask","Eburnean",
"Falu","Feldgrau","Fulvous","Gamboge","Lovat","Mazarine","Phlox","Sable","Sarcoline","Skobeloff",
"Smault","Titian","Vanta","Wenge","Zaffre","Zima"];

const sleep = (ms) =>
  new Promise(resolve => setTimeout(resolve, ms));

// when generating a galaxy, 
// sector 0 should have hq and 1d4 near. 
// all other sectors should not have an hq
// sectors 1-5   should have 1d6 near,  no vast
// sectors 6-10  should have 1d4 near, 1d4 vast
// sectors 11-25 should have 1d8 vast 
async function generateGalaxy(){
	await generateSector(0,0,"_testSector",5,1,true);
	// sleep(1000);
	//await generateSector(1,2,"_testSector2",20,1,true);
	
	// for(var i = 0; i < sectors_list.length; i++){
		// if(i == 0){
			// await generateSector(rollRange(4),0,sectors_list[i], 1, 1, true);
			// sleep(500);
		// }
		// if(i > 0 && i < 5){
			// await generateSector(rollRange(8),0,sectors_list[i], i, 1, false);
			// sleep(500);
		// }
		// if(i > 5 && i < 10){
			// await generateSector(rollRange(6),rollRange(4),sectors_list[i], i, 1, false);
			// sleep(500);
		// }
		// if(i > 10 && i < 15){
			// await generateSector(rollRange(4),rollRange(6),sectors_list[i], i, 1, false);
			// sleep(500);
		// }
		// if(i > 15 && i < 20){
			// await generateSector(0,rollRange(8),sectors_list[i], i, 1, false);
			// sleep(500);
		// }
		// if(i > 20 && i < 25){
			// await generateSector(0,rollRange(4),sectors_list[i], 20, 0, false);
			// sleep(500);
		// }
	// }
} 

// sectors should allocate locks and keys to systems
// sectors should have three types of systems, HQ, near, and vast
// should levels 1-20 be in one sector? should levels be spread across the sector somehow???
async function generateSector(nearSpaceMax, vastSpaceMax, sectorName, level, diff, hasHQ){
	if (!fs.existsSync("./Sectors/"+sectorName))
		fs.mkdirSync("./Sectors/"+sectorName, { recursive: true });
	else{
		fs.rmSync("./Sectors/"+sectorName, { recursive: true, force: true });
		fs.mkdirSync("./Sectors/"+sectorName, { recursive: true });
	}
	//make 1 HQ system
	if(hasHQ)
		var hqSystem = await randomSystem.generateStellarSystem(sectorName,level,diff); 
	//make near space systems
	var nearSpaceSystems = [];
	for(var i = 0; i < nearSpaceMax; i++)
		nearSpaceSystems.push(await randomSystem.generateStellarSystem(sectorName,level,diff));
	//make vast systems
	var vastSpaceSystems = [];
	for(var i = 0; i < vastSpaceMax; i++)
		vastSpaceSystems.push(await randomSystem.generateStellarSystem(sectorName,level,diff));
	//add locks and keys
	
	var max = vastSpaceMax;
	if(nearSpaceMax > vastSpaceMax)
		max = nearSpaceMax;
	var systemList = [];
	
	var hqKeyString = "HQ System: ";
	var nsKeyString = "Near Space Systems: ";
	var vsKeyString = "Vast Space Systems: ";
	
	for(var i = 0; i < max; i++){
		var hqName = "";
		var nsName = getSystemName(nearSpaceSystems[i]);
		var vsName = getSystemName(vastSpaceSystems[i]);
		if(i == 0)
			hqName = getSystemName(hqSystem);
		if(hqName != "") hqKeyString += " "+hqName;
		if(nsName != "") nsKeyString += nsName+", ";
		if(vsName != "") vsKeyString += vsName+", ";
		systemList.push({HQ_System:hqName,Near_space_system:nsName,Vast_space_system:vsName});
	}
	var keysFile = fs.writeFile("./Sectors/"+sectorName+"/Sector_key.txt",hqKeyString+"\n"+nsKeyString+"\n"+vsKeyString, "utf8", function(err) {
		if(err) {
			console.log("sector key generation error");
			return console.log(err);
		}
	});
	console.log(sectorName+" Sector");
	console.table(systemList);
}

function getSystemName(system){
	if(system == undefined)
		return "";
	var ret = system[0][0];
	ret = ret.replace("Name:            ", '');
	if(ret.includes(' ')) ret = ret.split(' ')[0];
	else if(ret.includes('-')) ret = ret.split('-')[0];
	return ret;
}

function rollRange(r){
  return Math.floor(Math.random() * r) + 1;
}

generateGalaxy();