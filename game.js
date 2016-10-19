get = function(id) {return document.getElementById(id)}

var Game = {
  TICK_RATE: 60,
  AUTO_SAVE: 60,
  PRICE_EXP: 1.1,
  buyAmount: 1,
  ticks: 0,
  tick: function() {
   Game.goldTick()
   Render.tick()
   Game.checkSave()
   Game.ticks++
  },
  goldTick: function() {
    gameState.changeGold(gameState.getGps() / Game.TICK_RATE)
  },
  getBuyAmount: function() {
    return Game.buyAmount
  },
  setBuyAmount: function(a) {
    Game.buyAmount = a
  },
  checkSave: function() {
    if (Game.ticks % (Game.TICK_RATE * Game.AUTO_SAVE) == 0) {
      Game.encode()
    }
  },
  restart: function() {
    Building.restart()
    gameState.restart()
    Game.encode()
  },
  encode: function() {
    var c = ""
    c += gameState.getGold() + "," + gameState.getTotalGold() + "," + gameState.getMagic() + "*"
    for (i in Building.buildings) {
      c += Building.buildings[i].amount + ","
    }
    document.cookie = "c=" + btoa(c) + "; expires=Tue, 1 Jan 2030 00:00:00 UTC"
  },
  decode: function() {
    if (document.cookie != "") {
      var c = atob(document.cookie.split("c=")[1])
      var g = c.split("*")[0].split(",")
      var b = c.split("*")[1].split(",")
      gameState.cookie(g)
      Building.cookie(b)
    }
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
  buy: function(a) {
    for (var i = 0; i < a; i++) {
      if (gameState.buy(this.getPrice())) {
        this.amount += 1
      }
      else {
        return
      }
    }
  }
}

var Building = {
  buildings: [
    new building("Gold Pan", 1, 5),
    new building("Gold Vein", 8, 70),
    new building("Mine", 60, 1000),
    new building("Quarry", 500, 12500),
    new building("Factory", 3500, 180000),
    new building("Tree Farm", 27000, 2500000),
    new building("Alchamy Lab", 210000, 33333333),
    new building("Fusion", 1600000, 450000000),
    new building("Electic Synthesizer", 12345678, 6400000000),
    new building("Gold-O-Verse", 100000000, 85000000000),
    new building("Black Hole Converter", 777777777, 1200000000000),
    new building("Quantum Nuggets", 5500000000, 16000000000000),
    new building("Universe Destroyer", 42000000000, 256000000000000),
    new building("Duplicator", 333333333333, 3333333333333333),
    new building("Hax", 2100000000000, 42000000000000000)
  ],
  getBaseGps: function() {
    var total = 0
    for (i in Building.buildings) {
      total += Building.buildings[i].getGps()
    }
    return total
  },
  restart: function() {
    for (i in Building.buildings) {
      Building.buildings[i].amount = 0
    }
  },
  cookie: function(a) {
    for (i in Building.buildings) {
      Building.buildings[i].amount = parseInt(a[i])
    }
  }
}

gameState = function(){
  //Private
  var gold = 0
  var totalGold = 0
  var magic = 0
  //Public
  changeGold = function(dGold){
    gold += dGold
    if (dGold > 0) {
      totalGold += dGold
    }
  }
  buy = function(amount) {
    if (amount <= gameState.getGold()) {
      gameState.changeGold(-1 * amount)
      return true
    }
    return false
  }
  getGps = function() {
    return Building.getBaseGps() * (1 + (magic / 100))
  }
  getGold = function() {
    return Math.floor(gold)
  }
  getMagic = function() {
    return magic
  }
  getTotalGold = function() {
    return totalGold
  }
  calcMagic = function() {
    return Math.floor(Math.pow(totalGold / 100000000, 1/3))
  }
  sellAll = function() {
    Building.restart()
    magic = gameState.calcMagic()
    gold = 0
  }
  cookie = function(a) {
    gold = parseFloat(a[0])
    totalGold = parseFloat(a[1])
    magic = parseFloat(a[2])
  }
  restart = function() {
    gold = 0
    totalGold = 0
    magic = 0
  }
  return {changeGold,buy,getGps,getGold,calcMagic,getMagic,getTotalGold,cookie,sellAll,restart}
}()
 
var Render = {
  init: function() {
    for (i in Building.buildings) {
      get("buyButtons").innerHTML +=
      "<tr><th><button onclick=Building.buildings[" + i + "].buy(Game.getBuyAmount())>Buy " + Building.buildings[i].name + "</button></th><th><span id=buildingAmount" + i +"></span></th><th><span id=buildingPrice" + i +"></span></th></tr>"
    }
  },
  tick: function() {
    Render.updateGold()
    Render.updateBuilding()
    Render.updateMagic()
    Render.updateBuyAmount()
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
  updateMagic: function() {
    Render.changeText("magic", Render.formatNum(gameState.getMagic()) + " magic nuggets")
    Render.changeText("sellAll", "Sell All For: " + Render.formatNum(gameState.calcMagic() - gameState.getMagic()) + " magic nuggets")
  },
  updateBuyAmount: function() {
    Render.changeText("buyAmount", "Buy Amount: " + Game.getBuyAmount())  
  },
  formatNum: function(num) {
    var exp = ["M","B","T","q","Q","s","S","O","N","d","U","D"]
    if (num < 1000) {
      return num
    }
    else if (num < 1000000) {
      var num = Math.round(num)
      return Math.floor(num / 1000)+ "," + Math.floor(num / 100) % 10 + Math.floor(num / 10) % 10 + num % 10
    }
    else {
      var num = Math.round(num)
      var pow = Math.pow(1000, Math.floor(Math.log10(num) / 3))
      return Math.floor(num / pow) + "." + Math.floor(num * 10 / pow) % 10 + Math.floor(num * 100 / pow) % 10 + Math.floor(num * 1000 / pow) % 10 + " " + exp[Math.floor(Math.log10(num) / 3) - 2]
    }
  },
  changeText: function(id, txt) {
    if (get(id) != undefined) {
      get(id).textContent = txt
    }
    else {
      console.error("Tried to change text of invalid element: " + id)
    }
  }
}

get("mainButton").onclick = function(){
  gameState.changeGold(1)
}

get("sellAll").onclick = function() {
  gameState.sellAll()
}

Game.loop = setInterval(Game.tick, 1000 / Game.TICK_RATE)
Game.decode()

Render.init()
