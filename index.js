const { decks } = require("cards")
const Player = require("./player")
const _ = require("lodash")
const EventEmitter = require('events');

const numPlayers = 4,
    passingPhases = ["left", "right", "across", "keep"],
    GameStates = {
        creating: 'creating', joinable: 'joinable', full: 'full', started: 'started',
        finished: 'finished'
    }
GamePhases = { passong: 'passing', playing: 'playing', waiting: 'waiting' }

class HeartsGame extends EventEmitter {
    constructor(id) {
        super();
        this.id = id;
        this.players = []
        this.positions = [{}, {}, {}, {}]
        this.gameState = GameStates.creating;
        this.gamePhase = GamePhases.waiting;
        this.allGameEvents = [];
        this.deck = new decks.StandardDeck;
        this.dealerPosition = -1;
        this.playingTo = 100;
    };
    ping() {
        this.emit('hello', "arg1", { arg: "2" })
    }

    /**
     * 
     * @param {num} playerID
     * @param {position} preferredPos 
     * @description Add player p to position pos if position is available
     */
    addPlayer(playerName, playerID, preferredPos = 0) {
        this.allGameEvents.push(`Player ${playerName} with id ${playerID} attempted to join the table. Preferred Pos ${preferredPos}`);
        let seat = preferredPos;
        //don't allow gibberish in preferredSeat. Default to 0 if we got something out of range
        if (!_.inRange(_.toNumber(preferredPos), 0, 4)) {
            seat = 0;
        }

        if (this.players.length >= 4) {
            this.allGameEvents.push(`Player ${playerName} was unable to join the table`)
            throw new Error(`addPlayer: could not add player with id: ${player.ID} because the table is full`)
        }

        //if seat is unavailable        
        if (!(_.isEmpty(this.positions[preferredPos]))) {
            console.log(`The prefered seat of ${seat} was taken`);
            for (const pos in this.positions) {
                if (_.isEmpty(this.positions[pos])) {
                    seat = pos;
                    break;
                }
            }
        }
        let p = new Player(playerName, playerID, this);
        this.players.push(p);
        if (this.players.length == 4) {
            this.gameState = GameStates.full;
        }

        this.positions[seat] = { player: p }
        this.allGameEvents.push(`Player ${playerName} successfully joined the table at position ${seat}`)
        this.emit("player:seated", this.positions[seat].player, seat)
        return this.positions[seat].player
    }

    startGame() {
        if (this.gameState != GameStates.full) {
            throw (new Error(`startGame: expected gamestate: ${GameStates.full}. Function was called when gamestate was: ${this.gameState}`))
        }
        this.gameState = GameStates.started;
        for (let player of this.players) {
            player.reset();
        }
        this.startRound();
    }

    startRound() {
        this.deck.shuffleAll();
        this.allGameEvents.push("Shuffled Deck");
        this.emit("shuffle")
        this.dealerPosition = (this.dealerPosition + 1) % this.players.length
        this.allGameEvents.push(`Dealer Assigned to ${this.positions[this.dealerPosition].name} in position ${this.dealerPosition}`)
        this.emit("dealer", this.positions[this.dealerPosition])
        this.dealCards()
    }

    dealCards() {
        this.emit("deal")
        while (this.deck.remainingLength > 0) {
            for (let i in this.positions) {
                let position = (_.toNumber(i) + this.dealerPosition + 1) % this.players.length;
                let player = this.positions[position].player
                let card = this.deck.draw()[0]
                this.givePlayerCard(player, card)
            }
        }
    }

    givePlayerCard(player, card) {
        player.hand.push(card);
        this.allGameEvents.push(`Player ${player.name} received the ${card.rank.longName} of ${card.suit.name}`)
        this.emit("player:recieved-card", card.rank.longName, card.suit.name)
    }
}

module.exports = HeartsGame