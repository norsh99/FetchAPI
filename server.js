const express = require('express');
var cors = require('cors');
const { check, validationResult } = require('express-validator');
const app = express();
const PORT = 8080;

app.use( express.json(), cors() )


var payerList = [];
var totalpoints = 0;



app.listen(
    PORT,
    () => console.log(`Live on http://localhost:${PORT}`)
)

app.get('/payerlist', (req, res) => {
    res.status(200).send(payerList);
});

app.get('/payerpointbalance', (req, res) => {
    let formatPlayers = combinePayers(payerList, false);

    res.status(200).send(formatPlayers);
});


app.post('/addpayer', (req, res) =>  {
    const { payer } = req.body;
    const { points } = req.body;
    const { timestamp } = req.body;

    if (!payer) {
        res.status(418).send({message: 'Need a payer!' })
    }
    else if (!points) {
        res.status(418).send({message: 'Need points!' })
    }
    else if (!timestamp) {
        res.status(418).send({message: 'Need a timestamp!' })
    }
    else {
        let newPayer = {
            "payer": payer,
            "points": points,
            "timestamp": new Date(timestamp)
        }
        payerList.push(newPayer);
        totalpoints += points;
        let sortList = payerList.sort((c2, c1) => (c1.timestamp < c2.timestamp) ? 1 : (c1.timestamp > c2.timestamp) ? -1 : 0);
        payerList = sortList;
    
        res.status(200).send({
            newPayerAdded: `Payer: ${payer}, Points: ${points}, Timestamp: ${timestamp}`,
        });
    }
});



app.post('/spendpoints',[check('points').isNumeric()], (req, res) =>  {
    const { points } = req.body;
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() })
    }
    else if(payerList == null) {
        res.status(418).send({message: "No, payers found. Please add payers to account."});
    }
    else if(points < 1) {
        
        res.status(418).send({message: 'Points must be more than 0'});
    }
    else if(points > totalpoints) {
        
        res.status(418).send({message: `Not enough points earned. Total: ${totalpoints}`});
    }
    else {
        totalpoints -= points;

        let usedPayers = [];
        var usedPoints = 0;

        

        for (let i = 0; i < payerList.length; i++) {
            if(payerList == null || usedPoints >= points) {
                break;
            }
            if(payerList[i].points == 0) {
                continue;
            }


            var pointsLeft = points - usedPoints;
            if(payerList[i].points <= pointsLeft) {
                usedPoints += payerList[i].points;
    
                let payer = {
                    "payer": payerList[i].payer,
                    "points": payerList[i].points
                }
                payerList[i].points =  0;
                usedPayers.push(payer);
            }
            else {
                usedPoints += pointsLeft;
    
                let payer = {
                    "payer": payerList[i].payer,
                    "points": pointsLeft
                }
    
                payerList[i].points -=  pointsLeft;
                usedPayers.push(payer);
                break;
            }
        }
    
        let formatPlayers = combinePayers(usedPayers, true);
    
        res.status(200).send(formatPlayers);
    }
});

app.delete('/reset', (req, res) =>  {
    payerList = [];
    totalpoints = 0;
    res.status(200).send({message: 'Payer list has been reset.'});
});


function combinePayers(array, reversePoints) {
    let newArray = [];
    let reverseNum = 1;
    if(reversePoints == true) {
        reverseNum = -1;
    }
    array.forEach(payer => {
        if(newArray != null) {
            var hasFoundPayer = false;
            for (i = 0; i < newArray.length; i++) {
                if(newArray[i].payer == payer.payer) {
                    newArray[i].points += payer.points * reverseNum;
                    hasFoundPayer = true;
                }
            }
            if(!hasFoundPayer) {
                payer.points = payer.points * reverseNum;
                newArray.push(createNewObject(payer));
            }
        }
        else {
            payer.points = payer.points * reverseNum;
            newArray.push(createNewObject(payer));
        }
    });
    return newArray;
}

function createNewObject(object) {
    let newObject = {
        "payer": object.payer,
        "points": object.points
    }

    return newObject;
}

