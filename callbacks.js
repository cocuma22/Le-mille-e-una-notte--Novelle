//CALLBACKS

//------------------------------------------------
//callback to update node properties
function updateNode(currentNode) {
    var childNum = currentNode.children.length; //number of children of the current node
    var useTab;
 
    switch(childNum) {
        case 2:
            useTab = pack2circles; 
            break; 
        case 3: 
            useTab = pack3circles; 
            break; 
        case 5: 
            useTab = pack5circles; 
            break; 
        case 7: 
            useTab = pack7circles; 
            break; 
        case 17: 
            useTab = pack17circles; 
            break; 
        case 1:
            currentNode.children[0].x = 0;  
            currentNode.children[0].y = 0;  
            currentNode.children[0].radius = 0.5;  
            break;
        default: //childNum = 0
            break;
    }

    if(childNum > 1) {
        for(var i = 0; i < childNum; i++) {
            currentNode.children[i].x = useTab[i][1]; 
            currentNode.children[i].y = useTab[i][2]; 
            currentNode.children[i].radius = useTab[i][0];
        }
    }
  
    //update x, y, radius in base of x, y, radius values of parent node 
    if(currentNode.parent != null) { //the root has already the correct values 
        currentNode.x = currentNode.parent.x + currentNode.x * currentNode.parent.radius; 
        currentNode.y = currentNode.parent.y + currentNode.y * currentNode.parent.radius;
        currentNode.radius = currentNode.radius * currentNode.parent.radius;
        currentNode.level = currentNode.parent.level + 1;
    } 

    if(currentNode.hovered) {
        moveX = centerPosX - currentNode.x;
        moveY = centerPosY - currentNode.y;
    }
}

//------------------------------------------------
//callback for draw circle node
function drawCircle(currentNode) {
    if(currentNode.hovered) {
        strokeWeight(2);
        stroke(strokeColor); //dark blue
    } else {
        noStroke();
    }
    fill(colors[currentNode.level]);
    circle(currentNode.x, currentNode.y, currentNode.radius);
    //writeName (63 raggio max e senza figli) 
}

//------------------------------------------------
//callback for update hover property to circle nodes
function updateHover(currentNode) {
    var childSelected = false; 
    if(checkHover(currentNode)){ //if mouse is hover the current node...
        for(var i = 0; i < currentNode.children.length; i++) { //... check if the mouse is hover its children 
            childSelected = childSelected || checkHover(currentNode.children[i]);
        }
        if(!childSelected) { //if the mouse isn't hover its children...
            currentNode.hovered = true; //... the mouse is hover this current node 
            findUpdateRadius(currentNode); //compute updated circle radius
            nameNodeHovered = currentNode.name; //save name value of the node hovered in a global variable
        } else {
            currentNode.hovered = false; 
        }
    } else {
        currentNode.hovered = false; 
    }
}

