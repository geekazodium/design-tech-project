import { client } from "../ClientMain.mjs";
import { RenderDispatcher } from "../RenderDispatcher.mjs";
import { AbstractScreen } from "./AbstractScreen.mjs";
import { IngameScreen } from "./IngameScreen.mjs";

class MenuScreen extends AbstractScreen{
    onSet(){
        this.renderDispatcher.initRenderers([]);
        client.mouseInputHandler.canLock = false;
        this.createMenuItems();
    }
    onExit(){
    }
    createMenuItems(){
    }
    createField(x,maxY,width,text){
        var fieldDiv = document.createElement("div");
        this.div.append(fieldDiv);
        this.styleAsButton(fieldDiv,x,maxY,width);

        var field = document.createElement("input");
        fieldDiv.append(field);
        this.styleAsField(field);
        field.onfocus = (event)=>{
            textOverlay.hidden = true;
        }
        field.onblur = (event)=>{
            textOverlay.hidden = field.value.length>0;
        }

        var textOverlay = document.createElement("p1");
        fieldDiv.append(textOverlay);
        this.styleAsField(textOverlay);
        textOverlay.innerText = text;
        textOverlay.style.position = "fixed";
        textOverlay.style.marginLeft = "-"+(width-4)+"px";
        textOverlay.style.marginTop = "6px";
        textOverlay.style.zIndex = 1;
        textOverlay.style.pointerEvents = "none";
        return field;
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
    styleAsTitle(element,maxY){ 
        element.style.fontFamily = "math";
        element.style.fontSize = "40px"
        element.style.top = "calc(50vh + "+maxY+"px)";
        element.style.left = "calc(50vw - 300px)";
        element.style.width = "600px";
        element.style.textAlign = "center";
        element.style.zIndex = 1;
        element.style.position = "absolute";
    }
    /**
     * @description styles an html element in *button* form. This exists because I 
     * was too lasy to use a css file. also creates some flexibility in being 
     * able to create elements with slightly different css while avoiding the 
     * suffering that is the actual stylesheet
     * @param {HTMLElement} element the html element to style
     * @param {Number} x x position of the center of the element, relative to the center of the screen
     * @param {Number} maxY y position of the top of the element, relative to the center of the screen
     * @param {Number} width the width of the button
     */
    styleAsButton(element,x,maxY,width){
        element.style.fontFamily = "math";
        element.style.fontSize = "30px"
        element.style.top = "calc(50vh + "+maxY+"px)";
        element.style.left = "calc(50vw + "+(x-width/2)+"px)";
        element.style.width = width+"px";
        element.style.textAlign = "center";
        element.style.zIndex = 1;
        element.style.position = "absolute";
    }
    /**
     * @description styles an html element in *field* form. This exists because I 
     * was too lasy to use a css file. also creates some flexibility in being 
     * able to create elements with slightly different css while avoiding the 
     * suffering that is the actual stylesheet
     * @param {HTMLElement} element the html element to style
     */
    styleAsField(element){
        element.style.fontSize = "20px"
        element.style.textAlign = "left";
        element.style.width = "calc(100% - 8px)";
    }
    usernameInvalid(usernameInput){
        return (
            usernameInput.length<3||
            usernameInput.length>16
        );
    }
}

export {MenuScreen};