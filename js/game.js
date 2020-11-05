'use strict';

let currentFocus = undefined;
let selectingFuel = false;
let tickAmt = 0;

// let titles = {
//     y: {
//         pos: [{
//             name: 'Dictator',
//             axisYThreshold: 9
//         }, {
//             name: 'Tyrant',
//             axisYThreshold: 5
//         }, {
//             name: 'General',
//             axisYThreshold: 3
//         }], 
//         neg: [{
//             name: 'Free Person',
//             axisYThreshold: -9
//         }, {
//             name: 'Speaker',
//             axisYThreshold: -5
//         }, {
//             name: 'Advocate',
//             axisYThreshold: -3
//         }]
//     }, 

//     x: {
//         pos: [{
//             name: 'Extreme Right Wing',
//             axisXThreshold: 9
//         }, {
//             name: 'Radical Right Wing',
//             axisXThreshold: 5
//         }, {
//             name: 'Reactionary Right Wing',
//             axisXThreshold: 3
//         }],

//         neg: [{
//             name: 'Extreme Left Wing',
//             axisXThreshold: -9
//         }, {
//             name: 'Radical Left Wing',
//             axisXThreshold: -5
//         }, {
//             name: 'Reactionary Left Wing',
//             axisXThreshold: -3
//         }]
//     }
// };

// let playerAlignment = {
//     axisY: 0,
//     axisX: 0
// }

// function checkAlignmentAndTitles() {
//     let newTitle = {};
//     let findTitle = function(axisInfo) {
//         for(let axis in axisInfo) {
//             let axisName = axis.substring(axis.length - 1).toLowerCase();
//             let thresh = 'axis' + axis.substring(axis.length - 1) + 'Threshold';
//             let posOrNeg = axis.substring(0, 3);

//             console.log(axisInfo)
//             if(posOrNeg === titles[axisName][posOrNeg] && Math.abs(axisInfo[axis]) >= Math.abs(title[thresh]) && !newTitle[axisName]) {
//                 console.log('lol')
//             }
            
//             // for(let title of titles[axisName][posOrNeg]) {
//             //     if(posOrNeg === 'pos' && axisInfo[axis] >= title[thresh] && !newTitle[axisName]) {
//             //         newTitle[axisName] = title.name;
//             //     } else if (posOrNeg === 'neg' && Math.abs(axisInfo[axis]) >= Math.abs(title[thresh] && !newTitle[axisName])) {
//             //         console.log('here')
//             //         // console.log(Math.abs(axisInfo[axis]),  Math.abs(title[thresh])) ;
//             //         // console.log(axisInfo[axis], title[thresh]);
//             //         newTitle[axisName] = title.name
//             //     }
//             // }
            
//         }
        
//     }

//     //filter x axis
//     //filter y axis
//     let filterBasedOnAxis = function(playerAxis) {
//         let axisInfo = {}
//         if(Math.sign(playerAxis.axisX) === 1) {
//             axisInfo.positiveX = playerAxis.axisX;
//             // console.log('Positive X Axis');
//         } else {
//             axisInfo.negativeX = playerAxis.axisX;
//             // console.log('Negative X Axis');
//         }

//         if(Math.sign(playerAxis.axisY) === 1) {
//             axisInfo.positiveY = playerAxis.axisY;
//             // console.log('Positive Y Axis');
//         } else {
//             axisInfo.negativeY = playerAxis.axisY;
//             // console.log('Negative Y Axis');
//         }
//         findTitle(axisInfo)
//     }

//     let playerAxis = {};
//     for(let axis in playerAlignment) {
//         playerAxis[axis] = playerAlignment[axis];
//     }
//     filterBasedOnAxis(playerAxis);
//     if(Object.keys(newTitle).length !== 0) {
//         document.getElementById('playerTitle').innerHTML = Object.values(newTitle).join('-');
//     }
// }

// function randomizeAlignment() {
//     let randomAlignmentIncrease = Math.round(Math.random() * 1) + 0;
//     let pickedAlignment = Object.keys(playerAlignment)[randomAlignmentIncrease];
//     let ranNum = Math.ceil(Math.floor(Math.random() * 9) * (Math.round(Math.random()) ? 1: -1));
//     if((playerAlignment[pickedAlignment] + ranNum) < 9) {
//         playerAlignment[pickedAlignment] = playerAlignment[pickedAlignment] + ranNum;
//     }
    
//     checkAlignmentAndTitles();
// }


//flags
let flags = {};

//buildings
let buildings = [];

//this is all the resources available in the game
//the 'type' tag indicates what the resource can be used for
//resource types should first be described by what their primary function is,
//eg fuel vs basic materials vs metals
//the type is then display by the according div (basicResources, fuelResources, metalResources, etc)
let resources = [{
    name: 'wood',
    amount: 100,
    cap: 100,
    woodEquivalent: 1,
    type: ['basic', 'fuel']
}, {
    name: 'stone',
    amount: 100,
    cap: 100,
    type: ['basic']
}, {
    name: 'leaves',
    amount: 100,
    cap: 100,
    type: ['basic']
}, {
    name: 'pinecone',
    amount: 0,
    cap: 100,
    woodEquivalent: 2,
    type: ['fuel', 'basic']
}, {
    name: 'fire',
    amount: 100,
    cap: 100,
    decay: 1,
    type: ['fire']
}, {
    name: 'coal',
    amount: 5,
    woodEquivalent: 4,
    type: ['fuel']
}, {
    name: 'charcoal',
    amount: 2,
    woodEquivalent: 3,
    type: ['fuel']
}, {
    name: 'copper',
    amount: 0,
    type: ['metal']
}, {
    name: 'clay',
    amount: 0,
    type: ['moldable']
}];

let notifications = [{
    name: 'lightFireNotification',
    desc: 'It\'s cold and dark. I should light a fire.',
    flags: ['!createFire']
}, {
    name: 'findWaterNotification',
    desc: 'Maybe I can collect rain?',
    flags: ['!createRainwaterBarrel']
}, {
    name: 'makeCleanWaterNotification',
    desc: 'If I boil this water, maybe I can use it.',
    flags: ['createRainwaterBarrel', 'createFire']
}, {
    name: 'generalNotification',
    desc: 'Life is good.',
    flags: ['createFire']
}]

let events = [{
    name: 'createFire',
    desc: 'Create a fire',
    shorthand: 'Fire',
    cost: [{
        wood: 10
    }, {
        stone: 5
    }, {
        leaves: 10
    }],
    building: false
}, {
    name: 'createHouse',
    desc: 'Create a House',
    shorthand: 'House',
    cost: [{
        wood: 20
    }, {
        stone: 20
    }, {
        leaves: 20
    }],
    building: true
}, {
    name: 'createRainwaterBarrel',
    desc: 'Create a Rainwater Barrel',
    shorthand: 'Rainwater Barrel',
    cost: [{
        wood: 25
    }, {
        stone: 10
    }, {
        leaves: 5
    }],
    building: true
}];

function eventToBuilding(eventName) {
    let eventToBuilding = events.filter(function(event) {
        if(eventName === event.name)
            return event.cost
    });
    return eventToBuilding;
}

function init() {
    let focusableButtons = document.getElementsByClassName('focusable');
    for(let button of focusableButtons) {
        button.onclick = function() { currentFocus = button.id };
    }
    let setResources = resources.filter(function(resource) {
        let name = resource.name.charAt(0).toUpperCase() + resource.name.slice(1);
        for(let resourceType in resource.type) {
            if(!document.getElementById(resource.name)) {
                let type = resource.type[resourceType]
                let typeDiv = document.getElementById(type + 'Resources');
                
                let resourceElement = document.createElement('p');
                resourceElement.setAttribute('id', resource.name);
                resourceElement.innerHTML = name + ' : ' + resource.amount;
                typeDiv.appendChild(resourceElement);
            };            
        }
    });
    
    document.getElementById('stoke').onclick = function() { stoke() } ;
}


//if there is a focus, this is where the focus' function will be
let focus = {
    forage: function() {
        let basicResources = [];
        let findBasicResources = resources.filter(function(resource) {
            for(let type in resource.type) {
                if(resource.type[type] === 'basic') {
                    basicResources.push(resource);
                }
            }
            return basicResources;         
            
        });
        let randomBasicResource = basicResources[Math.floor(Math.random() * basicResources.length)];
        randomBasicResource.amount++;
        let resourceName = randomBasicResource.name.charAt(0).toUpperCase() + randomBasicResource.name.slice(1);
        document.getElementById(randomBasicResource.name).innerHTML = resourceName + ' : ' + randomBasicResource.amount;
    },
    createCleanWater: function() {
    }
}

function fire() {
    let fireDiv = document.getElementById('fire');
    let findFire = resources.find(function(resource) {
        return resource.name === 'fire';
    });

    if(findFire.amount <= findFire.cap && findFire.amount !== 0) {
        findFire.amount = findFire.amount - findFire.decay;
        fireDiv.innerHTML = findFire.amount;
    } 
}

function stokeFuel(fuelType) {
    let fuelName = fuelType.slice(0, -4);
    let findFuel = resources.find(function(resource) {
        if(resource.name === fuelName) { return resource }
    });
    let findFire = resources.find(function(resource) {
        if(resource.name === 'fire') { return resource }
    });

    if((findFire.amount + (1 * findFuel.woodEquivalent)) >= findFire.cap) {
        findFire.amount = findFire.cap;
    } else {
        findFire.amount = findFire.amount + (1 * findFuel.woodEquivalent);
    }

    findFuel.amount -= 1;
    let choiceFuelDivs = document.getElementsByClassName('choiceResources');
    while(choiceFuelDivs[0]) {
        choiceFuelDivs[0].parentNode.removeChild(choiceFuelDivs[0])
    }
    selectingFuel = false;
    update();
}

function stoke() {
    let stokeDiv = document.getElementById('stoke');
    stokeDiv.style.display = 'none';
    selectingFuel = true;
    let fuelChoicesDiv = document.getElementById('fuelChoices');
    let findFuelResources = resources.filter(function(resource) {
        for(let type of resource.type) {
            if(type === 'fuel' && resource.amount > 0) { return resource }
        }
    });

    for(let fuel of findFuelResources) {
        let choices = document.createElement('button');
        let fuelNameId = fuel.name + 'Fuel'
        choices.setAttribute('id', fuelNameId);
        choices.setAttribute('onclick', 'stokeFuel(\'' + fuelNameId + '\')');
        choices.setAttribute('class', 'choiceResources')
        choices.innerHTML = fuel.name + '<br>' + '#: ' + fuel.amount;
        fuelChoicesDiv.appendChild(choices);
    }
    
}

function getEvent(eventName) {
    let checkContainer = [];
    let eventLength;
    let newResourceCount = [];
    let findEvent = events.filter(function(event) {
        if(eventName == event.name) {
            eventLength = event.cost.length;
            return event;
        }
    });

    let findResources = resources.filter(function(resource) {
        for(let eventCost of findEvent[0].cost) {
            if(resource.name === Object.keys(eventCost)[0] &&
            Object.values(eventCost)[0] <= resource.amount) {
                let subResourceNum = resource.amount - Object.values(eventCost)[0];
                newResourceCount.push(resource.name + ': ' + subResourceNum)
                checkContainer.push(true);
            }
            
        }
    });

    if(checkContainer.length === eventLength) {
        for(let resource of newResourceCount) {
            let resourceName = resource.substring(0, resource.indexOf(':'));
            let resourceCost = resource.substring(resource.indexOf(':') + 1);
            for(let playerResource of resources) {
                if(playerResource.name === resourceName) {
                    flags[eventName] = true;
                    playerResource.amount = resourceCost;
                }
            }
        }
        document.getElementById(eventName).style.display = 'none';
        if(findEvent[0].building) {
            let buildingHtml = [];
            //creates a building object dynamically
            let newBuilding = {};
            newBuilding.name = findEvent[0].name;
            newBuilding.cost = [];
            newBuilding.desc = findEvent[0].desc;
            newBuilding.shorthand = findEvent[0].shorthand;
            newBuilding.amount = 1;
            for(let resource of eventToBuilding(findEvent[0].name)[0].cost) {
                newBuilding.cost.push(resource);
                let name = Object.keys(resource)[0];
                let cost = Object.values(resource)[0];
                let nameCost = (name.charAt(0).toUpperCase() + name.slice(1)) + ' : ' + cost;
                buildingHtml.push(nameCost);
            }
            buildings.push(newBuilding)
            let amt = '<br> # of ' + newBuilding.shorthand + 's ' + newBuilding.amount

            let buildingDiv = document.getElementById('buildingDiv');
            let buildingElement = document.createElement('button');
            buildingElement.setAttribute('id', 'upgrade-' + findEvent[0].name);
            buildingElement.setAttribute('onclick', 'upgradeBuilding(\'' + findEvent[0].name + '\')');
            buildingElement.innerHTML = newBuilding.desc + '<br>' + buildingHtml.join('<br>') + amt;
            buildingDiv.appendChild(buildingElement);
        }
    }
    update();
}

function upgradeBuilding(x) {
    console.log(x)
}

function checkIfEventIsAvailable(eventName) {
    let eventCost = eventName.cost;
    let newEventElement = document.createElement('button');

    let getEventResource = eventCost.filter(function(resource) {
        for(let playerResource of resources) {
            if(Object.keys(resource)[0] === playerResource.name &&
            (playerResource.amount / Object.values(resource)[0]) >= 0.5 &&
            !document.getElementById(eventName.name)) {
                let text = [];
                text.push(eventName.desc)
                for(let i=0; i<eventName.cost.length; i++) {
                    text.push(Object.keys(eventName.cost[i]) + ' : ' + Object.values(eventName.cost[i]));
                }
                newEventElement.setAttribute('id', eventName.name);
                newEventElement.setAttribute('onclick', 'getEvent(\'' + eventName.name + '\')');
                newEventElement.innerHTML = text.join('<br>');
                document.getElementById('eventsDiv').appendChild(newEventElement);
            }
        }
    });
}

function update() {
    let updateResources = resources.filter(function(resource) {
        if(resource.amount <= 0) {
            document.getElementById(resource.name).style.visibility = 'hidden'
        } else {
            let name = resource.name.charAt(0).toUpperCase() + resource.name.slice(1);
            document.getElementById(resource.name).style.visibility = 'visible'
            document.getElementById(resource.name).innerHTML = name + ' : ' + resource.amount;
        }
        
    });

    // These are in update instead of tick, so the elements display once these are researched
    if(flags.createFire && selectingFuel === false) {
        document.getElementById('stoke').style.display = 'block';
        document.getElementById('fire').style.display = 'block';
    } else if(flags.createFire && selectingFuel === true) {
        document.getElementById('stoke').style.display = 'none';
    } else if(!flags.createFire) {
        document.getElementById('fire').style.display = 'none';
        document.getElementById('stoke').style.display = 'none';
    }

    if(flags.createRainwaterBarrel) {
        document.getElementById('createCleanWater').style.display = 'block';
    } else {
        document.getElementById('createCleanWater').style.display = 'none';
    }
}

function checkIfNewNotificationIsAvailable() {
    //scoped variable
    let flagKeys = Object.keys(flags);
    let doesFlagExist = function(flagName) {
        //finding if flags exist is easy
        //return the flag name(including the !), and its status based on the name
        //eg, if the flag !createFire is needed, but this returns true, then its false
        //big brain time
        let flagContainer = [];
        for(let thisFlagName of flagName) {
            let flagInfo = {
                flagName: undefined,
                eval: undefined
            };
            if(thisFlagName.charAt(0) === '!') {
                let newFlagName = thisFlagName.substring(1);
                if(flags[newFlagName] === undefined) { //flag needs to be  false, and flag doesn't exist  
                    flagInfo.flagName = thisFlagName;
                    flagInfo.eval = true;
                    // flagContainer.push(thisFlagName, true);
                } else if(flags[newFlagName] === true) { //flag needs to be false, but flag exists
                    flagInfo.flagName = thisFlagName;
                    flagInfo.eval = false;
                    // flagContainer.push(thisFlagName, false)
                }
            } else if(flags[thisFlagName] === true) { //flag needs to be true, and exists
                flagInfo.flagName = thisFlagName;
                flagInfo.eval = true;
                // flagContainer.push(thisFlagName, true)
            } else if(flags[thisFlagName] === undefined) { //flag needs to be true, but doesnt exist
                flagInfo.flagName = thisFlagName;
                flagInfo.eval = false;
                // flagContainer.push(thisFlagName, false)
            }
            flagContainer.push(flagInfo);
        }
        return flagContainer;
    }

    //finally, iterate through the notifications and find available ones according to their corresponding location    
    let filterNotificationsByFlag = notifications.filter(function(thisNotification) {
        let notificationContainer = [];
        let notificationFlagKeys = thisNotification.flags;
        let flagStatus = doesFlagExist(notificationFlagKeys);
        for(let amt of flagStatus) {
            if(amt.eval === true) {
                notificationContainer.push(true)
            }
        }
        if(notificationContainer.length === thisNotification.flags.length) {
            document.getElementById('notification').innerHTML = thisNotification.desc;
        }
    });
}

//tick is a function that calls the update() function to screenuipdate
function tick() {
    if((tickAmt % 10) === 0) {
        checkIfNewNotificationIsAvailable();
    }
    if(currentFocus !== undefined) {
        //very neat
        focus[currentFocus]()
    }
    
    for(let event of events) {
        checkIfEventIsAvailable(event);
    }

    //not in update, as it this is the fire game logic
    if(flags.createFire) {
        fire();
    }

    update();
    tickAmt++;
}

setInterval(tick, 1000)

init();