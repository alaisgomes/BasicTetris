/***************************************
*
* Functions that describe the Tetriminos
* Each possible states when rotatins + position on the grid/matrix
*
***************************************/

function L_Tetrimino()
{
    this.state1 = [ [1, 0],
                    [1, 0],
                    [1, 1] ];
                    
    this.state2 = [ [0, 0, 1],
                    [1, 1, 1] ];
                    
    this.state3 = [ [1, 1],
                    [0, 1],
                    [0, 1] ];
    
    this.state4 = [ [1, 1, 1],
                    [1, 0, 0] ];
                    
    this.states = [ this.state1, this.state2, this.state3, this.state4 ];
    this.currentState = 0;
    
    this.color = 0;
    this.position_x = 4;
    this.position_y = -3;
}

function J_Tetrimino()
{
    this.state1 = [ [0, 1],
                    [0, 1],
                    [1, 1] ];
                    
    this.state2 = [ [1, 1, 1],
                    [0, 0, 1] ];
                    
    this.state3 = [ [1, 1],
                    [1, 0],
                    [1, 0] ];
    
    this.state4 = [ [1, 0, 0],
                    [1, 1, 1] ];
                    
    this.states = [ this.state1, this.state2, this.state3, this.state4 ];
    this.currentState = 0;
    
    this.color = 0;
    this.position_x = 4;
    this.position_y = -3;
}

function O_Tetrimino()
{
    this.state1 = [ [1, 1],
                    [1, 1] ];
                    
    this.states = [ this.state1 ];
    this.currentState = 0;
    
    this.color = 0;
    this.position_x = 4;
    this.position_y = -2;
}

function I_Tetrimino()
{
    this.state1 = [ [1],
                    [1],
                    [1],
                    [1] ];
                    
    this.state2 = [ [1,1,1,1] ];
                    
    this.states = [ this.state1, this.state2 ];
    this.currentState = 0;
    
    this.color = 0;
    this.position_x = 5;
    this.position_y = -4;
}

function T_Tetrimino()
{
    this.state1 = [ [1, 1, 1],
                    [0, 1, 0] ];
                    
    this.state2 = [ [1, 0],
                    [1, 1],
                    [1, 0] ];
    
    this.state3 = [ [0, 1, 0],
                    [1, 1, 1] ];
                    
    this.state4 = [ [0, 1],
                    [1, 1],
                    [0, 1] ];
                    
    this.states = [ this.state1, this.state2, this.state3, this.state4 ];
    this.currentState = 0;
    
    this.color = 0;
    this.position_x = 4;
    this.position_y = -2;
}

function Z_Tetrimino()
{
    this.state1 = [ [1, 1, 0],
                    [0, 1, 1] ];
                    
    this.state2 = [ [0, 1],
                    [1, 1],
                    [1, 0] ];
                    
    this.states = [ this.state1, this.state2 ];
    this.currentState = 0;
    
    this.color = 0;
    this.position_x = 4;
    this.position_y = -2;
}

function S_Tetrimino()
{
    this.state1 = [ [0, 1, 1],
                    [1, 1, 0] ];
                    
    this.state2 = [ [1, 0],
                    [1, 1],
                    [0, 1] ];
                    
    this.states = [ this.state1, this.state2 ];
    this.currentState = 0;
    
    this.color = 0;
    this.position_x = 4;
    this.position_y = -2;
}

/* Randomly generate a Tetrimino piece to fall
*/

function getRandomTetrimino()
{
    var result = Math.floor( Math.random() * 7 );
    var tetrimino;
    
    switch(result)
    {
        case 0: tetrimino = new L_Tetrimino();      break;
        case 1: tetrimino = new O_Tetrimino();      break;
        case 2: tetrimino = new Z_Tetrimino();      break;
        case 3: tetrimino = new T_Tetrimino();      break;
        case 4: tetrimino = new J_Tetrimino();      break;
        case 5: tetrimino = new S_Tetrimino();      break;
        case 6: tetrimino = new I_Tetrimino();      break;
    }   
    
    tetrimino.color = Math.floor(Math.random() * 8);
    return tetrimino;
}



/***************************************
*
* Global Variables
*
***************************************/


var ROWS = 17;
var COLS = 10;
var SIZE = 32;


/* Board things
*/ 
var canvas;
var context;
var gameMatrix;
var curTetrimino;


/* Image loading things
*/
var blockImg;
var bgImg;
var gameOverImg;
var imgLoader;


/* Time variables
*/
var prevTime;
var currentTime;


/* Game State
*/
var isGameOver = false;
var isGameOn = false;
var isPaused = false;


/* Scores : looking into http://tetris.wikia.com/wiki/Scoring
*/
var lineSpan;
var currentLines;
var score;
var currentScore;


/***************************************
*
* Game Fucntions
*
***************************************/


function startGame()
{
    imgLoader = new BulkImageLoader();
    imgLoader.addImage("images/blocks.png", "blocks");
    imgLoader.addImage("images/bg.png", "bg");
    imgLoader.addImage("images/over.png", "gameover");

    imgLoader.startGameCallback = onImagesLoaded;
    imgLoader.loadImages();
    
    canvas = document.getElementById('gameCanvas');
    context = canvas.getContext('2d');
    lineSpan = document.getElementById('lines');
    score = document.getElementById('score');
    prevTime = currentTime = 0;
    
}


function onImagesLoaded(e)
{
    blockImg = imgLoader.getImageAtIndex(0);
    bgImg = imgLoader.getImageAtIndex(1);
    gameOverImg = imgLoader.getImageAtIndex(2);
}


function initGame()
{
    var r, c;
    currentLines = 0;
    currentScore = 0;
    isGameOver = false;
    
    if(gameMatrix == undefined)
    {
        gameMatrix = new Array();
        
        for(r = 0; r < ROWS; r++)
        {
            gameMatrix[r] = new Array();
            for(c = 0; c < COLS; c++)
            {
                gameMatrix[r].push(0);
            }
        }       
    }
    else
    {
        for(r = 0; r < ROWS; r++)
        {
            for(c = 0; c < COLS; c++)
            {
                gameMatrix[r][c] = 0;
            }
        }
    }
    
    curTetrimino = getRandomTetrimino();
    
    lineSpan.innerHTML = currentLines.toString();
    score.innerHTML = currentScore.toString();
    
    var requestAnimFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
                            
    window.requestAnimationFrame = requestAnimFrame;
    requestAnimationFrame(update);
}

function updateGameOver() 
{
    context.drawImage(gameOverImg, 0, 0, 320, 544, 0, 0, 320, 544);

    /* Update score on database later - no database version here */
    /*$.post("updateScores.php", "score=" + currentScore);*/
    
}

function pauseGame() {
    if (isPaused == false) {
        isPaused = true;
        $('#paused').show();
        $('#gameCanvas').hide();
        $
    } else {
        isPaused = false;
        requestAnimationFrame(update);
        $('#paused').hide();
        $('#gameCanvas').show();
    }
}

function update()
{
    currentTime = new Date().getTime();
    
    if(currentTime - prevTime > 500)
    {
        // update the tetrimino
        if( checkMove(curTetrimino.position_x, curTetrimino.position_y + 1, curTetrimino.currentState) )
        {
            curTetrimino.position_y += 1;
        }
        else
        {
            currentScore += 10;
            score.innerHTML = currentScore.toString();
            copyMatrix(curTetrimino);
            curTetrimino = getRandomTetrimino();
        }
        
        // update time
        prevTime = currentTime;
    }
    
    context.clearRect(0, 0, 320, 544);
    drawBoard();
    drawtetrimino(curTetrimino);
    
    if(isGameOver == false && isPaused == false)
    {
        requestAnimationFrame(update);
    }
    else if (isGameOver == true){
        updateGameOver ();

    }
}

function copyMatrix(p)
{
    var xpos = p.position_x;
    var ypos = p.position_y;
    var state = p.currentState;
    
    for(var r = 0, len = p.states[state].length; r < len; r++)
    {
        for(var c = 0, len2 = p.states[state][r].length; c < len2; c++)
        {
            if(p.states[state][r][c] == 1 && ypos >= 0)
            {
                gameMatrix[ypos][xpos] = (p.color + 1);
            }
            
            xpos += 1;
        }
        
        xpos = p.position_x;
        ypos += 1;
    }
    
    checkLines();
    
    if(p.position_y < 0)
    {
        isGameOver = true;
    }
}

function checkLines()
{
    var lineFound = false;
    var fullRow = true;
    var r = ROWS - 1;
    var c = COLS - 1;
    
    while(r >= 0)
    {
        while(c >= 0)
        {
            if(gameMatrix[r][c] == 0)
            {
                fullRow = false;
                c = -1;
            }
            c--;
        }
        
        if(fullRow == true)
        {
            clearNextRow(r);
            r++;
            lineFound = true;
            currentLines++;
            currentScore += 150;
        }
        
        fullRow = true;
        c = COLS - 1;
        r--;
    }
    
    if(lineFound)
    {
        lineSpan.innerHTML = currentLines.toString();
        score.innerHTML = currentScore.toString();
        /*Update score too*/
    }
}

function clearNextRow(row)
{
    var r = row;
    var c = 0;
    
    while(r >= 0)
    {
        while(c < COLS)
        {
            if(r > 0)
                gameMatrix[r][c] = gameMatrix[r-1][c];
            else
                gameMatrix[r][c] = 0;
                
            c++;
        }
        
        c = 0;
        r--;
    }
}

function drawBoard()
{
    context.drawImage(bgImg, 0, 0, 320, 544, 0, 0, 320, 544);
    
    for(var r = 0; r < ROWS; r++)
    {
        for(var c = 0; c < COLS; c++)
        {
            if(gameMatrix[r][c] != 0)
            {
                context.drawImage(blockImg, (gameMatrix[r][c] - 1) * SIZE, 0, SIZE, SIZE, c * SIZE, r * SIZE, SIZE, SIZE);
            }
        }
    }
}

function drawtetrimino(p)
{
    var drawX = p.position_x;
    var drawY = p.position_y;
    var state = p.currentState;
    
    for(var r = 0, len = p.states[state].length; r < len; r++)
    {
        for(var c = 0, len2 = p.states[state][r].length; c < len2; c++)
        {
            if(p.states[state][r][c] == 1 && drawY >= 0)
            {
                context.drawImage(blockImg, p.color * SIZE, 0, SIZE, SIZE, drawX * SIZE, drawY * SIZE, SIZE, SIZE);
            }
            
            drawX += 1;
        }
        
        drawX = p.position_x;
        drawY += 1;
    }
}

function checkMove(xpos, ypos, newState)
{
    var result = true;
    var newx = xpos;
    var newy = ypos;
    
    for(var r = 0, len = curTetrimino.states[newState].length; r < len; r++)
    {
        for(var c = 0, len2 = curTetrimino.states[newState][r].length; c < len2; c++)
        {
            if(newx < 0 || newx >= COLS)
            {
                result = false;
                c = len2;
                r = len;
            }
            
            if(gameMatrix[newy] != undefined && gameMatrix[newy][newx] != 0
                && curTetrimino.states[newState][r] != undefined && curTetrimino.states[newState][r][c] != 0)
            {
                result = false;
                c = len2;
                r = len;
            }
            
            newx += 1;
        }
        
        newx = xpos;
        newy += 1;
        
        if(newy > ROWS)
        {
            r = len;
            result = false;
        }
    }
    
    return result;
}

function handleKey(key) {
    switch (key) {
    case 'left':
        if( checkMove(curTetrimino.position_x - 1, curTetrimino.position_y, curTetrimino.currentState) && isGameOver != true )
            curTetrimino.position_x--;
    break;
            
    case 'right':       
        if( checkMove(curTetrimino.position_x + 1, curTetrimino.position_y, curTetrimino.currentState) && isGameOver != true )
            curTetrimino.position_x++;  
    break;
            
    case 'rotate':
        var newState = curTetrimino.currentState - 1;
        if(newState < 0 && isGameOver != true)
            newState = curTetrimino.states.length - 1;
                    
        if( checkMove(curTetrimino.position_x, curTetrimino.position_y, newState) && isGameOver != true)
            curTetrimino.currentState = newState;
    break;
            
    case 'down':
        if( checkMove(curTetrimino.position_x, curTetrimino.position_y + 1, curTetrimino.currentState) && isGameOver != true )
            curTetrimino.position_y++;
    break;

    case 'end':
        if (isPaused == false && isGameOn == true) {
            isGameOver = true;
            isGameOn = false;
        }
        break;
    case 'new':
        if (isPaused == false) {
            isGameOn = true;
            $('#newgame').hide();
            $('#gameCanvas').show();
            initGame();
        }
    break;

    case 'pause':
        if (!isGameOver && isGameOn == true) {
            pauseGame();
        }
    break;
    }
}


$(document).keydown(function (event) {
    var pressedKey = event.keyCode;
    var controlKeys = {
        37: 'left',
        39: 'right',
        40: 'down',
        32: 'fall',
        38: 'rotate',
        80: 'pause',
        78: 'new',
        69: 'end'
    };
    if (pressedKey in controlKeys) {
        handleKey(controlKeys[pressedKey]);
    }
});

$(document).ready(function () {
    startGame();
    $('#gameCanvas').hide();
    $('#paused').hide();

    window.addEventListener("keydown", function(e) {
        if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false);
});
