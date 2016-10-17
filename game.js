var Game = {
  const TICK_RATE = 60,
  tick: function() {
    gameState.goldTick()
  }
}

gameState = function(){
  this.gold = 0
  changeGold = function(dGold){
    this.gold += dGold
  },
  goldTick = function() {
    this.changeGold(this.getGps() / game.tickRate)
  },
  getGps = function() {
    return 0
  }
  return {changeGold}
}()
 
mainButtonClick = function(){
  gameState.gold++
}
