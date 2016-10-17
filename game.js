var Game = {
  const TICK_RATE = 60,
  tick: function() {
    this.goldTick()
  },
  goldTick = function() {
    gameState.changeGold(gameState.getGps() / this.tickRate)
  },
}

gameState = function(){
  //Private
  this.gold = 0
  //Public
  changeGold = function(dGold){
    this.gold += dGold
  },
  getGps = function() {
    return 0
  }
  getGold = function(){
    return this.gold
  }
  return {changeGold,getGold}
}()
 
document.getElementById("mainButton").onclick = function(){
  gameState.changeGold(1)
}


