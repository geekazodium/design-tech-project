const WAITING_FOR_START = 0;
const GAME_ENDED = 0;
class Game{
    constructor(hostPlayer){
        this.phase = WAITING_FOR_START;
        this.players = [hostPlayer];
        this.hostPlayer = hostPlayer;
        this.chat = new Array();
    }
    remove(player,reason){
        if(player == this.hostPlayer){
            if(this.players.length<=1){
                this.end();
            }else{
                this.changeHostPlayer(this.players[1]);
                this.players = this.players.slice(1);
            }
        }else{
            this.players = this.players.slice(1);
        }
    }
    end(){
        this.phase = GAME_ENDED;
        this.players = undefined;
    }
    changeHostPlayer(newPlayer){
        this.hostPlayer = newPlayer;
    }
}

exports.Game = Game;