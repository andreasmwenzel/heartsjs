const HeartsGame= require("../../index")
//game.addplayer("joe", positions.north);

var game = new HeartsGame()

game.on("hello", (arg1)=>{
    console.log("hello event with args: ", arg1)
})

game.on("player:seated", (player, pos)=>{
    console.log(`seated ${player.name} in position ${pos}`)
})


let p1 = {name: "joe", id:"1"}
let p2 = {name: "jack", id:"2"}
let p3 = {name: "june", id:"3"}
let p4 = {name: "jerry", id:"4"}

try{
    p1 = game.addPlayer(p1.name, p1.id, 0)
    p2 = game.addPlayer(p2.name, p2.id, 3)
    p3 = game.addPlayer(p3.name, p3.id)
    p4 = game.addPlayer(p4.name, p4.id,3)
    game.startGame();
    null;
} catch(err){
    console.log(game.allGameEvents);
    throw(err)
}

for(let event of game.allGameEvents){
    console.log(event)
}