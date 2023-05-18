const WAITING_FOR_START = 0;
const GAME_ENDED = 1;
const MAX_TIME = 1000 * 60 * 30;
class Game{
    constructor(hostPlayer,name){
        this.timeAwake = 0;
        this.phase = WAITING_FOR_START;
        this.players = [hostPlayer];
        this.hostPlayer = hostPlayer;
        this.name = name;
        this.chat = new Array();
        this.timerLoop = setInterval(()=>{
            this.timeAwake++;
            if(this.timeAwake>MAX_TIME){
                clearInterval(this.timerLoop);
            }
        },1000);
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
            var index = this.players.indexOf(player);
            this.players = this.players.slice(0,index).concat(this.players.slice(index+1));
        }
        this.addChatMessage(player.name + reason,"console");
    }
    addChatMessage(message,source){
        this.chat.push({"message":message,"source":source});
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