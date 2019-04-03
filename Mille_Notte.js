//GLOBAL VARIABLES
var table, tab2circles, tab3circles, tab5circles, tab7circles, tab17circles; 
var storiesParentChild = []; //Array of stories in the form [story_parent, story_child]

//Arrays for coordinates precomputed (Circle Packed Problem)
var pack2circles = [];
var pack3circles = [];
var pack5circles = [];
var pack7circles = [];
var pack17circles = [];  

var storiesTree; // Tree of stories 

//colors
var strokeColor = '#541D02';

var colors = [
                '#ffffd4', //background
                '#fed98e', //root node (level 1)
                '#fe9929', //nodes level 2
                '#d95f0e', //nodes level 3
                '#993404'  //nodes level 4
              ]; //'#0b00b2'; //dark blue

var colors2 = [
                '#ffffd4', 
                '#fee391',
                '#fec44f',
                '#fe9929',
                '#d95f0e'
            ]; //'#993404';

var colors1 = [
                '#feedde',
                '#fdd0a2',
                '#fdae6b',
                '#fd8d3c',
                '#e6550d',
            ];//'#a63603';

//radius, x and y positions of the entire drawing 
var centerPosX, centerPosY; 
var centerRadius;  
 
var moveX, moveY; //shift of x and y position of the circle hovered by the mouse
var moveXClicked, moveYClicked; //shift of x and y position of the circle clicked by the mouse

var isMouseClicked = false; //flag to check if the mouse is clicked 

//final value for radius, x and y positions that the current node will have when the zoomed
var finalRadius; 
var finalPosX, finalPosY; 


var ratioRadius = 1; //ratio of the radius to zoom the circles
var deltaLerp = 1;
var lerpValue = 0.05;

var nodeHovered = ""; //contains the value name of the node hovered 

//fonts
var fontNames; 


//------------------------------------------------
function preload() {
    table = loadTable('data/mille_notte4.csv', 'csv', 'header'); //load csv data in variable 'table'

    //load tables for circle packet problem
    tab2circles = loadTable('data/2circles.csv', 'csv', 'header'); 
    tab3circles = loadTable('data/3circles.csv', 'csv', 'header');
    tab5circles = loadTable('data/5circles.csv', 'csv', 'header');
    tab7circles = loadTable('data/7circles.csv', 'csv', 'header');
    tab17circles = loadTable('data/17circles.csv', 'csv', 'header');

    //load fonts
    fontNames = loadFont('data/GloriaHallelujah.ttf'); //https://fonts.google.com/specimen/Gloria+Hallelujah?selection.family=Gloria+Hallelujah
}

//------------------------------------------------
function setup() {
    pixelDensity(displayDensity());
    createCanvas(windowWidth, windowHeight); 

    getData(); //fill 'storiesTree' and 'storiesParentChild'
    getTableData(); //take data from tables for circle packet problem

    //assign values to radius, x and y positions of the entire drawing 
    centerPosX = windowWidth / 2; 
    centerPosY = windowHeight / 2; 
    centerRadius = windowHeight / 2; 

    //set properties 'x' 'y', 'radius' and 'level' to the tree root
    storiesTree._root.x = centerPosX; 
    storiesTree._root.y = centerPosY; 
    storiesTree._root.radius = centerRadius; 
    storiesTree._root.level = 1; 

    storiesTree.traverseDFPO(updateNode); //set properties to all tree nodes except the root 
}

//------------------------------------------------
function draw() { 
    ratioRadius = 1;  
    moveX = 0; 
    moveY = 0; 

    background(colors[0]);

    drawData();
}

//------------------------------------------------
function getData() {
    //nickname columns
    var colStory = 0; 
    var colStoryParent = 2; 

    //fill the array 'storiesParentChild'
    for(var i = 0; i < table.getRowCount(); i++) {
    var story = table.getString(i, colStory); 
    var storyParent = table.getString(i, colStoryParent);
    var isAlreadyInserted = false; 

        //check if the couple parent-child is already in the array 
        for(var j = 0; j < storiesParentChild.length; j++) {
            if(storiesParentChild[j][0] == storyParent && storiesParentChild[j][1] == story) {
                isAlreadyInserted = true;
                break;
            }
        }
        if(!isAlreadyInserted) { //if the couple parent-child is not yet in the array... 
            storiesParentChild.push([storyParent, story]);//... push the couple parent-child in the array
        }
    }

    //fill the tree 'storiesTree'
    storiesTree = new Tree(storiesParentChild[0][0]);

    for(var i = 0; i < storiesParentChild.length; i++) {
        storiesTree.add(storiesParentChild[i][1], storiesParentChild[i][0], storiesTree.traverseDF);
    }
}

//------------------------------------------------
function getTableData() {
    var radius, posX, posY; 

    //nickname columns
    var colRadius = 0; 
    var colX = 1; 
    var colY = 2; 

    //fill the array 'pack2circles'
    for(var i = 0; i < tab2circles.getRowCount(); i++) {
        radius = tab2circles.getString(i, colRadius); 
        posX = tab2circles.getString(i, colX); 
        posY = tab2circles.getString(i, colY); 

        pack2circles.push([radius, posX, posY]); 
    }

    //fill the array 'pack3circles'
    for(var i = 0; i < tab3circles.getRowCount(); i++) {
        radius = tab3circles.getString(i, colRadius); 
        posX = tab3circles.getString(i, colX); 
        posY = tab3circles.getString(i, colY); 

        pack3circles.push([radius, posX, posY]); 
    }

    //fill the array 'pack5circles'
    for(var i = 0; i < tab5circles.getRowCount(); i++) {
        radius = tab5circles.getString(i, colRadius); 
        posX = tab5circles.getString(i, colX); 
        posY = tab5circles.getString(i, colY); 

        pack5circles.push([radius, posX, posY]); 
    }

    //fill the array 'pack7circles'
    for(var i = 0; i < tab7circles.getRowCount(); i++) {
        radius = tab7circles.getString(i, colRadius); 
        posX = tab7circles.getString(i, colX); 
        posY = tab7circles.getString(i, colY); 

        pack7circles.push([radius, posX, posY]); 
    }

    //fill the array 'pack17circles'
    for(var i = 0; i < tab17circles.getRowCount(); i++) {
        radius = tab17circles.getString(i, colRadius); 
        posX = tab17circles.getString(i, colX); 
        posY = tab17circles.getString(i, colY); 

        pack17circles.push([radius, posX, posY]); 
    }
}

//------------------------------------------------
function drawData() {
    storiesTree.traverseDF(updateHover); //draw the edge circle if the mouse is hover it 

    if(isMouseClicked){
        zoomNode();
    }

    storiesTree.traverseDFPO(drawCircle); //draw a circle for each node

    writeLabel(nodeHovered);
}

//------------------------------------------------
function zoomNode() {

    if(abs(storiesTree._root.radius - finalRadius) < deltaLerp &&
        abs(storiesTree._root.x - finalPosX) < deltaLerp  &&
        abs(storiesTree._root.y - finalPosY) < deltaLerp) {

            storiesTree._root.radius = finalRadius; 
            storiesTree._root.x = finalPosX; 
            storiesTree._root.y = finalPosY; 

            isMouseClicked = false; 
    } else {
        storiesTree._root.radius = lerp(storiesTree._root.radius, finalRadius, lerpValue); 
        storiesTree._root.x = lerp(storiesTree._root.x, finalPosX, lerpValue); 
        storiesTree._root.y = lerp(storiesTree._root.y, finalPosY, lerpValue); 

        storiesTree.traverseDFPO(updateNode);
    }
}

//------------------------------------------------
function checkHover(node) { //check if the mouse is hover the circle 
    var distance = dist(node.x, node.y, mouseX, mouseY);

    if(distance < node.radius) {
        return true;  
    } else {
        return false; 
    }
}

//------------------------------------------------
//find the updated circle radius to use if it is clicked by the mouse 
function findUpdateRadius(currentNode) {
    ratioRadius = centerRadius / currentNode.radius;
}

//------------------------------------------------
function mouseClicked() {
    isMouseClicked = true; 
    storiesTree.traverseDF(updateHover);

    //store actual root parameters x, y, radius
    var actualRootRadius = storiesTree._root.radius;
    var actualRootX = storiesTree._root.x; 
    var actualRootY = storiesTree._root.y;
    
    //simulation of zoom (without drawing and translating). 
    //Needed to compute the translation ('moveXClicked' and 'moveYClicked')
    storiesTree._root.radius *= ratioRadius; 
    storiesTree.traverseDFPO(updateNode);
    moveXClicked = moveX; 
    moveYClicked = moveY; 

    //restore real situation from simulation of zoom
    storiesTree._root.radius = actualRootRadius;
    storiesTree._root.x = actualRootX; 
    storiesTree._root.y = actualRootY; 
    storiesTree.traverseDFPO(updateNode);

    //compute final root values 
    finalRadius = storiesTree._root.radius * ratioRadius;
    finalPosX = storiesTree._root.x + moveXClicked;
    finalPosY = storiesTree._root.y + moveYClicked;  
}

//------------------------------------------------
//write near mouse position a label of the name property of the node hovered by the mouse 
function writeLabel(nodeHovered) {
    var d = dist(mouseX, mouseY, storiesTree._root.x, storiesTree._root.y); 
    if(d < storiesTree._root.radius && !nodeHovered.visibleText) { //if the mouse is hover the drawing... 

        //rectangle settings
        noStroke();
        fill(strokeColor);
        rectMode(CENTER);
        textSize(11); //needed here to compute correctly text lenght
        rect(mouseX, mouseY - 15, textWidth(nodeHovered.name) + 10, 20, 5);

        //text settings 
        textAlign(CENTER, CENTER);
        strokeWeight(1);
        fill('#fff');
        
        text(nodeHovered.name, mouseX, mouseY - 20); 
    }
}

//------------------------------------------------
//write name property of the node inside itself is it's enough big and without children
function writeName(currentNode) {
    if(currentNode.children.length == 0 && currentNode.radius > 62) { //if the node has no children and its radius is big enough...

        //text box dimensions
        rectMode(CENTER);
        var textBoxWidth = currentNode.radius * 2 - 20; 
        var textBoxHeight = 70;

        //text settings
        textAlign(CENTER, CENTER);
        textFont(fontNames);

        //text size is bigger if the radius node is big
        if(currentNode.radius > 140 && currentNode.radius <= 280) {
            textSize(15);
        } else if(currentNode.radius > 280) {
            textSize(20);
        }else {
            textSize(11);
        }

        //stroke settings
        fill('#fff'); //strokeColor
        noStroke(); //needed to garantee the reset of the stroke previously set 
        strokeWeight(1);

        text(currentNode.name, currentNode.x, currentNode.y, textBoxWidth, textBoxHeight); 
        
        currentNode.visibleText = true; //set property node to know the name property is now visible in the drawing
    } else {
        currentNode.visibleText = false; 
    }
    
}

