import { client } from "../ClientMain.mjs";
import { RenderDispatcher } from "../RenderDispatcher.mjs";
import { AbstractScreen } from "./AbstractScreen.mjs";

class LoginScreen extends AbstractScreen{
    /**
     * @method constructor
     * @description creates a new LoginScreen and sets screen to it
     * @param {RenderDispatcher} renderDispatcher the render dispatcher instance
     */
    constructor(renderDispatcher){
        super(renderDispatcher);
        this.renderDispatcher.initRenderers([]);
        client.mouseInputHandler.canLock = false;
        this.createMenuItems();
    }
    createMenuItems(){
        this.div = document.createElement("div");
        document.body.appendChild(this.div);

        this.title = document.createElement("h1");
        this.div.append(this.title);
        this.title.innerText = "ThisThingy";
        this.styleAsTitle(this.title);

        this.joinButton = this.createButton(0,-100,100,"log in");
    }
    createButton(x,maxY,width,text){
        var button = document.createElement("button");
        this.div.append(button);
        button.innerText = text;
        this.styleAsButton(button,x,maxY,width);
        return button;
    }
    /**
     * @description styles an html element in *title* form. This exists because I 
     * was too lasy to use a css file. also creates some flexibility in being 
     * able to create elements with slightly different css while avoiding the 
     * suffering that is the actual stylesheet
     * @param {HTMLElement} element the html element to style
     */
    styleAsTitle(element){ 
        element.style.fontFamily = "math";
        element.style.top = "calc(50vh - 300px)";
        element.style.left = "calc(50vw - 100px)";
        element.style.width = "200px";
        element.style.textAlign = "center";
        element.style.zIndex = 1;
        element.style.position = "absolute";
    }
    /**
     * @description styles an html element in *button* form. This exists because I 
     * was too lasy to use a css file. also creates some flexibility in being 
     * able to create elements with slightly different css while avoiding the 
     * suffering that is the actual stylesheet
     * @param {HTMLButtonElement} element the html element to style
     * @param {Number} x x position of the center of the element, relative to the center of the screen
     * @param {Number} maxY y position of the top of the element, relative to the center of the screen
     * @param {Number} width the width of the button
     */
    styleAsButton(element,x,maxY,width){
        element.style.fontFamily = "math";
        element.style.top = "calc(50vh + "+maxY+"px)";
        element.style.left = "calc(50vw + "+(x-width/2)+"px)";
        element.style.width = width+"px";
        element.style.textAlign = "center";
        element.style.zIndex = 1;
        element.style.position = "absolute";
    }
}

export {LoginScreen};