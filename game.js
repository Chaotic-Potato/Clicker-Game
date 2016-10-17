get = function(id) {return document.getElementById(id)}

var Game = {
  TICK_RATE: 60,
  tick: function() {
   Game.goldTick()
   Render.tick()
  },
  goldTick: function() {
    gameState.changeGold(gameState.getGps() / Game.TICK_RATE)
  }
}

var Render = {
  tick: function() {
    Render.updateGold()
  },
  updateGold: function() {
    Render.changeText("gold", gameState.getGold())
    Render.changeText("gps", gameState.getGps())
  },
  changeText: function(id, txt) {
    get(id).textContent = txt
  }
}

gameState = function(){
  //Private
  var gold = 0	
  //Public
  changeGold = function(dGold){
    gold += dGold
  }
  getGps = function() {
    return 0
  }
  getGold = function(){
    return gold
  }
  return {changeGold,getGps,getGold}
}()
 
get("mainButton").onclick = function(){
  gameState.changeGold(1)
}

Game.loop = setInterval(Game.tick, 1000 / Game.TICK_RATE)
