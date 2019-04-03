//CLASS Node to create a Tree Structure of Data
//Source code: https://code.tutsplus.com/articles/data-structures-with-javascript-tree--cms-23393

function Node(name) {
    this.name = name; 
    this.parent = null; 
    this.children = [];
    this.radius = 0; //circle radius 
    this.x = 0; //circle x position 
    this.y = 0; //circle y position 
    this.level = 0; //level node in the tree 
    this.hovered = false; //flag to know if the mouse is hover the circle node  
    this.visibleText = false; //flat to know if the name property value is visible in the drawing 
}

function Tree(name) {
    var node = new Node(name);
    this._root = node; 
}

//DFS: Depth-First Search (Post-Order - LRN)
Tree.prototype.traverseDF = function(callback) {
    //this is recurse and immediately-invoking function 
    (function recurse(currentNode) {
        //step 2
        for(var i = 0, length = currentNode.children.length; i < length; i++) {
            //step 3
            recurse(currentNode.children[i]); 
        }
        //step 4
        callback(currentNode);

        //step1
    })(this._root);
}; 

//DFS in PRE-ORDER - NLR
Tree.prototype.traverseDFPO = function(callback) { //'prototype' needs to add a new method to object constructor 
// this is a recurse and immediately-invoking function 
    (function recurse(currentNode) {
        callback(currentNode);
        
        for (var i = 0, length = currentNode.children.length; i < length; i++) { 
            recurse(currentNode.children[i]);
        }
    })(this._root);  
};

//DFS in PRE-ORDER to print text (save position)
/*  Tree.prototype.traverseText = function(callback) { //'prototype' needs to add a new method to object constructor 
      // this is a recurse and immediately-invoking function 
      (function recurse(currentNode, posX = MARGIN_HOR, posY = MARGIN_VER) {
          callback(currentNode, posX, posY);
          for (var i = 0, length = currentNode.children.length; i < length; i++) { 
              recurse(currentNode.children[i], posX += 20, posY += 20);
              //posY += 20; 
          }
      })(this._root);   
  };*/

//Allow to search for a particular name in the tree
Tree.prototype.contains = function(callback, traversal) {
    traversal.call(this, callback);
};

//Enable to add a node to a specific node 
Tree.prototype.add = function(name, nameP, traversal){
    var child = new Node(name), 
    parent = null, 
    callback = function(node) {
        if(node.name === nameP) {
            parent = node;
        }
    };

    this.contains(callback, traversal); 

    if(parent){
        parent.children.push(child); 
        child.parent = parent; 
    } else {
        throw new Error('Cannot add a node to a non-existent parent');
    }
};