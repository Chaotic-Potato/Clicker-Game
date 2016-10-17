gameState = function(){
  this.gold = 0
  changeGold = function(dGold){
    this.gold += dGold
  }
  return {changeGold}
}()
 
mainButtonClick = function(){
  gameState.gold++
}
