'use strict';

let currentFocus = undefined;

//flags
let flags = {};

//buildings
let buildings = [];

let resources = [{
    name: 'wood',
    amount: 100,
    type: ['basic', 'fuel']
}, {
    name: 'stone',
    amount: 100,
    type: ['basic']
}, {
    name: 'leaves',
    amount: 100,
    type: ['basic']
}, {
    name: 'pinecone',
    amount: 100,
    type: ['fuel', 'basic']
}, {
    name: 'fire',
    amount: 0
}, {
    name: 'coal',
    amount: 0,
    type: ['fuel']
}, {
    name: 'charcoal',
    amount: 0,
    type: ['fuel']
}];

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
                console.log()
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

}

function stoke() {
    let find
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
}

//tick is a function that calls the update() function to screenuipdate
function tick() {
    if(currentFocus !== undefined) {
        //very neat
        focus[currentFocus]()
    }
    
    for(let event of events) {
        checkIfEventIsAvailable(event);
    }

    if(flags.createFire) {
        fire();
    }
    update();
    // evaluateFlags();
}

setInterval(tick, 1000)

init();