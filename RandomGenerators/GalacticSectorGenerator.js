const fs = require('fs');
const path = require('path');
const table = require('table').table;
const randomSystem = require('./StellarSystemGenerator.js');

var sectors_list = ["Amaranth","Annatto","Atroviren","Aurecolin","Cattleya","Celadon","Coquelicot","Damask","Eburnean",
"Falu","Feldgrau","Fulvous","Gamboge","Lovat","Mazarine","Phlox","Sable","Sarcoline","Skobeloff","Smaragdine",
"Smault","Titian","Vanta","Wenge","Zaffre","Zima"];

async function generateGalaxy(){
	// await generateSector(1,2,"_test");
	for(var i = 0; i < sectors_list.length; i++){
		await generateSector(rollRange(5),rollRange(10),sectors_list[i]);
	}
}
// sectors should allocate locks and keys to systems
// sectors should have three types of systems, HQ, near, and vast
async function generateSector(nearSpaceMax, vastSpaceMax, sectorName){
	if (!fs.existsSync("./Sectors/"+sectorName))
		fs.mkdirSync("./Sectors/"+sectorName, { recursive: true });
	else{
		fs.rmSync("./Sectors/"+sectorName, { recursive: true, force: true });
		fs.mkdirSync("./Sectors/"+sectorName, { recursive: true });
	}
	//make 1 HQ system
	var hqSystem = await randomSystem.generateStellarSystem(sectorName); 
	//make near space systems
	var nearSpaceSystems = [];
	for(var i = 0; i < nearSpaceMax; i++)
		nearSpaceSystems.push(await randomSystem.generateStellarSystem(sectorName));
	//make vast systems
	var vastSpaceSystems = [];
	for(var i = 0; i < vastSpaceMax; i++)
		vastSpaceSystems.push(await randomSystem.generateStellarSystem(sectorName));
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