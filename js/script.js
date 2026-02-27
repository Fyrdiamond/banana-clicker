import Badge from "./badge.js";
import BadgeRequirement from "./badgeRequirement.js";
import Boost from "./boost.js";
import Building from "./building.js";
import Upgrade from "./upgrade.js";

window.addEventListener("load", function (event) {
    //still have to implement badges for upgrades and making the store upgrades be gone permanently after being bought
    //also is having this many global variables okay? I swear the prof said to use let and const and to almost never have truly global vars.
    this.totalBananas = 0;
    this.previousBananas = [];
    this.bps = 0;
    this.t1 = Date.now();
    this.t2 = t1;
    const banana = document.getElementById("banana");
    const upgradesDisplay = this.document.getElementById("upgradesInPlay")
    const clickPowerDisplay = this.document.getElementById("clickPower")
    const helpButton = document.getElementById("helpButton");
    let helpOpen = false;
    this.clickPower = 1;

    this.buildings = new Map();
    new Building("clicker", 5, 0.2);
    new Building("employee", 15, 1);
    new Building("tree", 100, 8);
    new Building("farm", 1100, 15);
    new Building("mine", 12000, 50);
    new Building("factory", 130000, 250);

    this.upgrades = new Map();
    new Upgrade("clickerUpgrade1", 500, [new Boost("mouse", 2), new Boost("clicker", 2)]);
    new Upgrade("clickerUpgrade2", 5000, [new Boost("mouse", 3), new Boost("clicker", 3)]);
    new Upgrade("clickerUpgrade3", 50000, [new Boost("mouse", 5), new Boost("clicker", 5)]);
    new Upgrade("employeeUpgrade", 1000, [new Boost("employee", 3)]);
    new Upgrade("treeUpgrade", 10000, [new Boost("tree", 3)]);
    new Upgrade("mineUpgrade", 20000, [new Boost("mine", 3)]);
    new Upgrade("factoryUpgrade", 500000, [new Boost("factory", 100)]);

    this.badges = new Map();
    new Badge("hundredb", new BadgeRequirement("bananas", 100));
    new Badge("thousandb", new BadgeRequirement("bananas", 1000));
    new Badge("tenthousandb", new BadgeRequirement("bananas", 10000));
    new Badge("hundredthousandb", new BadgeRequirement("bananas", 100000));
    new Badge("employeeb", new BadgeRequirement("employee", 1));
    new Badge("treeb", new BadgeRequirement("tree", 1));
    new Badge("farmb", new BadgeRequirement("farm", 1));
    new Badge("mineb", new BadgeRequirement("mine", 1));
    new Badge("factoryb", new BadgeRequirement("factory", 1));

    this.congratsMessageFlag = false

    // employeeMultiplier = 1;
    // treeMultiplier = 8;
    // farmMultiplier = 15;
    // mineMultiplier = 50;
    // factoryMultiplier = 250;

    banana.addEventListener("click", clickBanana);

    helpButton.addEventListener("click", function (event) {
        if (helpOpen) {
            document.getElementById("help").style.display = "none";
            helpOpen = false;
        } else {
            document.getElementById("help").style.display = "block";
            helpOpen = true;
        }
    });

    hideCongrats();
    loop();
});

function clickBanana() {
    totalBananas += clickPower;
}

function loop() {
    t1 = t2;
    t2 = Date.now();
    const timeDif = t2 - t1;

    updateBananaCount(timeDif);

    let bps = updateBPS();

    updateDisplay(bps);

    checkCount();

    setTimeout(loop, 0);
}

function updateBananaCount(timeDif) {
    previousBananas.push([totalBananas, t2]);
    previousBananas = previousBananas.slice(-1000);

    let per_second = 0;

    for (const building of buildings.values()) {
        per_second += building.count * building.gain;
    }

    totalBananas += per_second * timeDif / 1000;
}

function updateBPS() {
    let b1 = previousBananas[0];
    let b2 = previousBananas[previousBananas.length - 1];
    return round(1000 * (b1[0] - b2[0]) / (b1[1] - b2[1]), 1);
}

function updateDisplay(bps) {
    document.getElementById("score").innerText = round(totalBananas) + " bananas";
    document.getElementById("bps").innerText = bps + " bananas per second";
    document.getElementById("clickPower").innerText = clickPower + " per click";

    let totalUpgrades = 0;

    for (const building of buildings.values()) {
        totalUpgrades += building.count;
        building.element.children[1].children[1].innerText = "Cost: " + round(building.cost) + " bananas";
        building.element.children[1].children[2].innerText = "Produces: " + round(building.gain, 1) + " bananas per second.";
    }

    document.getElementById("upgradesInPlay").innerText = totalUpgrades + " upgrades so far";
}

function checkCount() {
    for (const building of buildings.values()) {
        if (totalBananas >= building.cost) {
            document.getElementById(building.name).style.display = "flex"
        }
    }

    for (const upgrade of upgrades.values()) {
        if (totalBananas >= upgrade.cost) {
            document.getElementById(upgrade.name).style.display = "flex"
        }
    }

    for (const badge of badges.values()) {
        if (!badge.unlocked && badge.completed()) {
            badge.element.style.display = "flex";
            badge.unlocked = true;
            document.getElementById("congratsMessage").style.display = "block";
            setTimeout(function () {
                document.getElementById("congratsMessage").style.display = "none";
            }, 4000);
        }
    }
};

// function workClicker() {
//     setInterval(function () {
//         totalBananas += clickPower;
//     }, 5000);
// };

// function workEmployee() {
//     setInterval(function () {
//         totalBananas += employeeMultiplier;
//     }, 1000);
// };

// function workTree() {
//     setInterval(function () {
//         totalBananas += treeMultiplier;
//     }, 1000);
// };

// function workFarm() {
//     setInterval(function () {
//         totalBananas += farmMultiplier;
//     }, 1000);
// };

// function workMine() {
//     setInterval(function () {
//         totalBananas += mineMultiplier;
//     }, 1000);
// };

// function workFactory() {
//     setInterval(function () {
//         totalBananas += factoryMultiplier;
//     }, 1000);
// };

function hideCongrats() {
    if (congratsMessageFlag === true) {
        document.getElementById("congratsMessage").style.display = "none";
        congratsMessageFlag = false;
    }
}

function round(val, places=0) {
    let mul = Math.pow(10, places);
    return Math.round(val * mul) / mul;
}
