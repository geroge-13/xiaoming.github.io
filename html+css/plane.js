var contentDiv = document.getElementById('content');
var startDiv = document.getElementById('start');
var mainDiv = document.getElementById('main');
var scoreDiv = document.getElementById('score');
var suspendDiv = document.getElementById('suspend');
var continueDiv = document.getElementById('continue');
var settlementDIV = document.getElementById('settlement');

var score = 0;

var contentClass = contentDiv.currentStyle ? contentDiv.currentStyle : window.getComputedStyle(contentDiv, null);
var stagesizeX = parseInt(contentClass.width);
var stagesizeY = parseInt(contentClass.height);

var enemyPlaneS = {
    width: 34,
    height: 24,
    imgSrc: './images/enemy-plane-s.png',
    boomSrc: './images/enemy-plane-s-boom.gif',
    boomTime: 100,
    hp: 1
};

var enemyPlaneM = {
    width: 46,
    height: 60,
    imgSrc: './images/enemy-plane-m.png',
    boomSrc: './images/enemy-plane-m-boom.gif',
    hitSrc: './images/enemy-plane-m-hit.png',
    boomTime: 100,
    hp: 2
};

var enemyPlaneL = {
    width: 110,
    height: 164,
    imgSrc: './images/enemy-plane-l.png',
    boomSrc: './images/enemy-plane-l-boom.gif',
    hitSrc: './images/enemy-plane-l-hit.png',
    boomTime: 100,
    hp: 7
};

var ourPlaneX = {
    width: 60,
    height: 80,
    imgSrc: './images/our-plane.gif',
    boomSrc: './images/our-plane-boom.gif',
    boomTime: 100,
    hp: 1
};

var bulletX = {
    width: 6,
    height: 14,
    imgSrc: './images/our-bullet.png',
    speed: 20
};

var Plane = function (centerX, centerY, planeModel, speed, ) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.sizeX = planeModel.width;
    this.sizeY = planeModel.height;
    this.imgSrc = planeModel.imgSrc;
    this.boomSrc = planeModel.boomSrc;
    this.boomTime = planeModel.boomTime;
    this.hitSrc = planeModel.hitSrc;
    this.hp = planeModel.hp;
    this.speed = speed;
    this.currentX = this.centerX - this.sizeX / 2;
    this.currentY = this.centerY - this.sizeY / 2;
};

Plane.prototype.draw = function () {
    this.imgNode = new Image();
    this.imgNode.src = this.imgSrc;
    this.imgNode.style.top = this.centerY - this.sizeY / 2 + 'px';
    this.imgNode.style.left = this.centerX - this.sizeX / 2 + 'px';
    mainDiv.appendChild(this.imgNode);
};

Plane.prototype.move = function () {
    this.chckOverRange();
    this.currentY += this.speed;
    this.centerY = this.currentY + this.sizeY / 2;
    this.imgNode.style.top = this.currentY + 'px';
}

Plane.prototype.chckOverRange = function () {
    this.isBottomRange = this.currentY > (stagesizeY - this.sizeY);
    this.isTopRange = this.currentY < 0;
    // mainDiv.removeChild(this.imgNode) ;

};

var Enemy = function () {
    this.segments = [];
    this.generatedCount = 0;
}

var randomNumber = function (min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}


Enemy.prototype.createNewEnemy = function () {
    this.generatedCount++;
    if (this.generatedCount % 17 === 0) {
        this.newEnemy = new Plane(randomNumber(enemyPlaneL.width / 2, stagesizeX - enemyPlaneL.width / 2), 12, enemyPlaneL, 1)
    } else if (this.generatedCount % 5 === 0) {
        this.newEnemy = new Plane(randomNumber(enemyPlaneM.width / 2, stagesizeX - enemyPlaneM.width / 2), 12, enemyPlaneM, randomNumber(2, 3))
    } else {
        this.newEnemy = new Plane(randomNumber(enemyPlaneS.width / 2, stagesizeX - enemyPlaneS.width / 2), 12, enemyPlaneS, randomNumber(3, 5))
    }
    this.segments.push(this.newEnemy);
    this.newEnemy.draw();
}

Enemy.prototype.moveAllEnemy = function () {
    for (var i = 0; i < this.segments.length; i++) {
        this.segments[i].move();
        if (this.segments[i].isBottomRange) {
            mainDiv.removeChild(this.segments[i].imgNode);
            this.segments.splice(i, 1);
        }
        for (var j = 0; j < ourPlane.segement.length; j++) {


            if (this.segments[i].hp > 0) {
                var horizontalCollision = Math.abs(this.segments[i].centerX - ourPlane.segement[j].centerX) < (this.segments[i].sizeX / 2 + ourPlane.segement[j].sizeX / 2)
                var verticalCollision = Math.abs(this.segments[i].centerY - ourPlane.segement[j].centerY) < (this.segments[i].sizeY / 2 + ourPlane.segement[j].sizeY / 2)
                var checkBulletCollision = horizontalCollision && verticalCollision;


                if (checkBulletCollision) {

                    score++;
                    scoreDiv.innerHTML = score;
                    this.segments[i].imgNode.src = this.segments[i].hitSrc ? this.segments[i].hitSrc : this.segments[i].boomSrc;
                    this.segments[i].hp--;


                    mainDiv.removeChild(ourPlane.segement[j].imgNode);
                    ourPlane.segement.splice(j, 1);
                }
            }
        }
        var ourHorizontalCollision = Math.abs(this.segments[i].centerX - ourPlane.centerX) < (this.segments[i].sizeX / 2 + ourPlane.sizeX / 2);
        var ourVerticalCollision = Math.abs(this.segments[i].centerY - ourPlane.centerY) < (this.segments[i].sizeY / 2 + ourPlane.sizeY / 2);
        var checkOurCollision = ourHorizontalCollision && ourVerticalCollision;

        if (checkOurCollision) {
            this.segments[i].hp = 0;
            ourPlane.hp--;
        }

        if (this.segments[i].hp <= 0) {
            this.segments[i].imgNode.src = this.segments[i].boomSrc;
            this.segments[i].boomTime -= 10;

            if (this.segments[i].boomTime <= 0) {
                mainDiv.removeChild(this.segments[i].imgNode);
                this.segments.splice(i, 1);
            }
        }
    }
}
var enemies = new Enemy();

var ourPlane = new Plane(stagesizeX / 2, stagesizeY - ourPlaneX.height / 2, ourPlaneX, 0)
ourPlane.draw();
mainDiv.onmousemove = function (ev) {
    ourPlane.centerX = ev.clientX - contentDiv.offsetLeft;
    if (ourPlane.centerX < 0) {
        ourPlane.centerX = 0;
    };
    if (ourPlane.centerX > stagesizeX) {
        ourPlane.centerX = stagesizeX;
    };
    ourPlane.centerY = ev.clientY - contentDiv.offsetTop;
    if (ourPlane.centerY < 0) {
        ourPlane.centerY = 0;
    };
    if (ourPlane.centerY > stagesizeY - ourPlane.sizeY / 2) {
        ourPlane.centerY = stagesizeY - ourPlane.sizeY / 2
    };
    ourPlane.currentX = ourPlane.centerX - ourPlane.sizeX / 2;
    ourPlane.currentY = ourPlane.centerY - ourPlane.sizeY / 2;

    ourPlane.imgNode.style.left = ourPlane.currentX + 'px';
    ourPlane.imgNode.style.top = ourPlane.currentY + 'px';
}
ourPlane.segement = []

var Bullet = Plane;
// var Bullet = function (centerX, centerY, bulletModel,speed ) {
//     this.centerX = centerX ;
//     this.centerY = centerY ;
//     this.imgSrc= bulletModel.imgSrc;
//     this.speed = speed;
//     this.sizeX = bulletModel.width;
//     this.sizeY = bulletModel.height;

//     this.currentX = this.centerX -this.sizeX/2 ;
//     this.currentY = this.centerY -this.sizeY/2;
// }
//  Bullet.prototype.draw = function () {
//      this.imgNode = new Image ();
//      this.imgNode.src = this.imgSrc;
//      this.imgNode.style.left =this.centerX - this.sizeX/2 + 'px' ;
//      this.imgNode.style.top =this.centerY - this.sizeY/2 + 'px' ;
//      mainDiv.appendChild(this.imgNode) ;
//  };

//  Bullet.prototype.move = function () {
//      this.currentY -=this.speed;
//      this.imgNode.style.top =this.currentY+'px'; 
//  };

function createNewBullet() {
    ourPlane.newBullet = new Bullet(ourPlane.centerX, ourPlane.centerY - ourPlane.sizeY / 2, bulletX, -10);
    ourPlane.segement.push(ourPlane.newBullet);
    ourPlane.newBullet.draw();
};

function moveNewBullet() {
    for (var i = 0; i < ourPlane.segement.length; i++) {
        ourPlane.segement[i].move();
        if (ourPlane.segement[i].isTopRange) {
            mainDiv.removeChild(ourPlane.segement[i].imgNode);
            ourPlane.segement.splice(i, 1);
        }
    }
}

var gameOver = function () {
    ourPlane.imgNode.src = ourPlane.boomSrc;
    clearInterval(timeID);
    settlementDIV.style.display = 'block';
    document.querySelector('p#final-score').innerText = score;
}

var time = 0;


var timeID;
var start = function () {
    startDiv.style.display = 'none';
    mainDiv.style.display = 'block';
    suspendDiv.style.display = 'none';
    settlementDIV.style.display = 'none';
    timeID = setInterval(function () {
        time++;
        if (time % 50 === 0) {
            enemies.createNewEnemy();
        }
        enemies.moveAllEnemy();

        if (time % 5 === 0) {
            createNewBullet();
        }
        moveNewBullet();

        if (ourPlane.hp <= 0) {
            gameOver();
        }

    }, 20)
}

var restart = function () {
    window.location.reload();
}

continueDiv.onclick = function (ev) {
	ev.stopPropagation();
	start();
};

mainDiv.onclick = function () {
    clearTimeout(timeID);
    suspendDiv.style.display =  'block';
}

