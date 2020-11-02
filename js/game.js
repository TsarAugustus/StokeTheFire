'use strict';

let currentFocus = undefined;
let fireIsLit = false;
let createHouse = false;

let resources = [{
    name: 'wood',
    amount: 30
}, {
    name: 'stone',
    amount: 20
}, {
    name: 'leaves',
    amount: 20
}];

let events = [{
    name: 'createFire',
    desc: 'Create a fire',
    cost: [{
        wood: 10
    }, {
        stone: 5
    }, {
        leaves: 10
    }],
    activateFlags: ['fireIsLit']
}, {
    name: 'createHouse',
    desc: 'Create a House',
    cost: [{
        wood: 20
    }, {
        stone: 20
    }, {
        leaves: 20
    }],
    activateFlags: ['createHouse']
}];

function init() {
    let focusableButtons = document.getElementsByClassName('focusable');
    for(let button of focusableButtons) {
        button.onclick = function() { currentFocus = button.id };
    }
    for(let resource of resources) {
        let resourceName = resource.name.charAt(0).toUpperCase() + resource.name.slice(1);
        document.getElementById(resource.name).innerHTML = resourceName + ' : ' + resource.amount;
    }
}

//if there is a focus, this is where the focus' function will be
let focus = {
    forage: function() {
        let randomBasicResource = resources[Math.floor(Math.random() * resources.length)];
        randomBasicResource.amount++;
        let resourceName = randomBasicResource.name.charAt(0).toUpperCase() + randomBasicResource.name.slice(1);
        document.getElementById(randomBasicResource.name).innerHTML = resourceName + ' : ' + randomBasicResource.amount;
    },
    createCleanWater: function() {
        console.log('here')
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
                    playerResource.amount = resourceCost;
                }
            }
        }
        document.getElementById(eventName).style.display = 'none';
    }
    update();
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
    let basicResourceSpans = document.getElementsByClassName('basicResource');
    let findBasicResourceAmt = resources.filter(function(resource) {
        for(let span of basicResourceSpans) {
            if(span.id === resource.name) {
                let name = resource.name.charAt(0).toUpperCase() + resource.name.slice(1)
                span.innerHTML = name + ' : ' + resource.amount;
            }
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
    update();
}

setInterval(tick, 1000)

init();