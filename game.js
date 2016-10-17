gameState = function(){
  //Private
  this.gold = 0
  //Public
  changeGold = function(dGold){
    this.gold += dGold
  }
  getGold = function(){
    return this.gold
  }
  return {changeGold,getGold}
}()
 
document.getElementById("mainButton").onclick = function(){
  gameState.changeGold(1)
}


