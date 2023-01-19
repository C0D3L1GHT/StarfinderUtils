
const Layout = {
	One:    "[][][][]\n         []",
	Two:    "[][][][]\n      []",
	Three:  "[][][][]\n   []",
	Four:   "[]\n[][][]\n   []",
	Five:   "    []\n[][][]\n   []",
	Six:    "       []\n[][][]\n   []",
	Seven:  "[][][]\n[]\n[]",
	Eight:  "       [][]\n[][][]",
	Nine:   "[][][]\n[][]",
	Ten:    "[][]\n   [][][]",
	Eleven: "[][][]\n   []\n   []",
	Twelve: "       []\n[][][]\n[]"
}

const listOne   = ["NPC", "Sentinel", "Atmosphere", "Explore", "Secret", "Separated"]
const listTwo   = ["Puzzle", "Obstacle", "Trick", "Setback", "Device", "Betrayal"]
const listThree = ["Trap", "Switch", "Environmental", "Timer", "Targets", "Gate"]
const listFour  = ["Treasure", "Weapons", "Narrative Beat", "Heal", "Lore", "Spells"]
const listFive  = ["Combat", "Boss", "Stealth", "Spawn", "Outmatched", "Injury"]
const listSix   = ["Roleplay", "Dispute", "Revelation", "Twist", "Escape", "Death"]

function generate5RD(){
console.log("\n\n");
var layout = rollLayout();
var rooms = roll5Rooms();
layout = addNumbersToLayout(layout, Object.values(rooms))

console.log(layout);
for(var room in rooms)
    console.log(room + " : " + rooms[room]);
console.log("\n\n");
}

function addNumbersToLayout(layout, roomNums){
	var squares = layout.split('');
	var curr_roomNum = 0;
	var roomNum  = roomNums[0];
	var ret = "";
	//iterate through layout
	for (let i = 1; i < squares.length; i++){
		if(squares[i] == "\n")
			ret+="\n";
		if(squares[i] == ' ')
			ret+= ' ';
	    if(squares[i-1] == "[" && squares[i] == "]"){
		   //issue is we are altering ret
		   var str = layout.slice(i-1,i+1);
		   str = str.split('');
		   str.splice(1,0,roomNums[curr_roomNum]);
		   ret += str.join('');
		   curr_roomNum++;
	    }
	}
	return ret;
}

function roll5Rooms(){
   var roomLists = [rollRoomList(),rollRoomList(),rollRoomList(),rollRoomList(),rollRoomList()]
   var rooms = {};
   for (let i = 0; i < roomLists.length; i++){
	 var roomText = rollRoomText(roomLists[i]);
	 while(roomText in rooms){
		 roomText = rollRoomText(roomLists[i]);
	 }
     rooms[roomText] = listToNum(roomLists[i]);
   }
   
   rooms = addEntrances(rooms);
   return rooms
}

function addEntrances(dict){
	//determine amount of minimum numbers
	var keys = Object.keys(dict);
	var min = Math.min.apply(null, keys.map(function(x) {return dict[x]}));
	
	//add the string ", entrance" to the text of the dictionary  if the key is the lowest value
	var ret = {}
	for(var d in dict) {
	  if(dict[d] == min)
		  ret[d+", door"] = dict[d];
	  else
		  ret[d] = dict[d];
    }
	return ret;
}

function listToNum(list){
  switch(list){
	case listOne:
	   return 1;
	case listTwo:
	   return 2;
	case listThree:
	   return 3;
	case listFour:
	   return 4;
	case listFive:
	   return 5;
	case listSix:
	   return 6;
  }
}

function rollRoomText(roomList){
	return roomList[rollRange(6)-1];
}

function rollRoomList(){
  switch (rollRange(6)){
    case 1:
	   return listOne;
	case 2:
	   return listTwo;
	case 3:
	   return listThree;
	case 4:
	   return listFour;
	case 5:
	   return listFive;
	case 6:
	   return listSix;
  }
}

function rollLayout(){
  switch (rollRange(12)){
    case 1:
	   return Layout.One;
	case 2:
	   return Layout.Two;
	case 3:
	   return Layout.Three;
	case 4:
	   return Layout.Four;
	case 5:
	   return Layout.Five;
	case 6:
	   return Layout.Six;
	case 7:
	   return Layout.Seven;
    case 8:
	   return Layout.Eight;
    case 9:
	   return Layout.Nine;
    case 10:
	   return Layout.Ten;
    case 11:
	   return Layout.Eleven;
    case 12:
       return Layout.Twelve;	
  }
}

function rollRange(r){
    return Math.floor(Math.random() * r) + 1;
}

generate5RD();
