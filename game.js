get = function(id) {return document.getElementById(id)}

var Game = {
  TICK_RATE: 60,
  PRICE_EXP: 1.1,
  tick: function() {
   Game.goldTick()
   Render.tick()
  },
  goldTick: function() {
    gameState.changeGold(gameState.getGps() / Game.TICK_RATE)
  }
}

var building = function(name, rate, basePrice) {
  this.name = name
  this.rate = rate
  this.basePrice = basePrice
  this.amount = 0
}

building.prototype = {
  getPrice: function() {
    return Math.floor(this.basePrice * Math.pow(Game.PRICE_EXP, this.amount))
  },
  getGps: function() {
    return this.rate * this.amount
  },
  buy: function() {
    if (gameState.buy(this.getPrice())) {
      this.amount += 1
    }
  }
}

var Building = {
  buildings: [
    new building("Gold Pan", 1, 10),
    new building("Gold Vien", 4, 100),
    new building("Mine", 15, 800),
    new building("Alchemy Lab", 80, 5000),
    new building("Nuclear Synthesisor", 500, 100000),
    new building("Muti-verse", 8000, 1200000),
    new building("Hacks", 133700, 42000000)
  ],
  getBaseGps: function() {
    var total = 0
    for (i in Building.buildings) {
      total += Building.buildings[i].getGps()
    }
    return total
  }
}

gameState = function(){
  //Private
  var gold = 0	
  //Public
  changeGold = function(dGold){
    gold += dGold
  }
  buy = function(amount) {
    if (amount <= gameState.getGold()) {
      gameState.changeGold(-1 * amount)
      return true
    }
    return false
  }
  getGps = function() {
    return Building.getBaseGps()
  }
  getGold = function(){
    return Math.floor(gold)
  }
  return {changeGold,buy,getGps,getGold}
}()
 
var Render = {
  init: function() {
    for (i in Building.buildings) {
      get("buyButtons").innerHTML +=
      "<tr><th><button onclick=Building.buildings[" + i + "].buy()>Buy " + Building.buildings[i].name + "</button></th><th><span id=buildingAmount" + i +"></span></th><th><span id=buildingPrice" + i +"></span></th></tr>"
    }
  },
  tick: function() {
    Render.updateGold()
    Render.updateBuilding()
  },
  updateGold: function() {
    Render.changeText("gold", Render.formatNum(gameState.getGold()) + " gold")
    Render.changeText("gps", Render.formatNum(gameState.getGps()) + " gps")
  },
  updateBuilding: function() {
    for (i in Building.buildings) {
      Render.changeText("buildingAmount" + i, Building.buildings[i].amount)
      Render.changeText("buildingPrice" + i, Render.formatNum(Building.buildings[i].getPrice()))
    }
  },
  formatNum: function(num) {
    var exp = ["M","B","T","q","Q","s","S","O","N","d","U","D"]
    if (num < 1000) {
      return num
    }
    else if (num < 1000000) {
      return Math.floor(num / 1000)+ "," + Math.floor(num / 100) % 10 + Math.floor(num / 10) % 10 + num % 10
    }
    else {
      var pow = Math.pow(1000, Math.floor(Math.log10(num) / 3))
      return Math.floor(num / pow) + "." + Math.floor(num * 10 / pow) % 10 + Math.floor(num * 100 / pow) % 10 + Math.floor(num * 1000 / pow) % 10 + " " + exp[Math.floor(Math.log10(num) / 3) - 2]
    }
  },
  changeText: function(id, txt) {
    get(id).textContent = txt
  }
}

get("mainButton").onclick = function(){
  gameState.changeGold(1)
}

Game.loop = setInterval(Game.tick, 1000 / Game.TICK_RATE)
Render.init()
