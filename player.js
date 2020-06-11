const { Cards, ranks, suits } = require("cards")
/**
 * @class Player
 * @param {String} name
 * @description Created a new player to store player specific information at tablePosition
 */
class Player {
    constructor(name, id, table) {
        this.name = name
        this.id = id
        this.points = 0;
        this.hand = [] // An array of Cards
        this.table = table;
        this._totalScore = 0;
        this._scoreByRound = [];
        this._scoreLastGame = 0;
        
    }

    reset(){
        this._scoreLastGame = this.points;
        this.points = 0;
        this._totalScore = 0;
        this._scoreByRound = [];
    }
    
}

module.exports = Player
