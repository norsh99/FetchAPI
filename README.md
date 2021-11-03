# FetchAPI
An api built to collect and post a collection of payers and their points. The account holder can spend points and have them subtracted from a list of payers in the order of the oldest date.


Links:
API URL:
https://rutch-site.uc.r.appspot.com
Front End - RutchJohnon.com:
https://rutchjohnson.com/fetch



General

To post/get data from the api, you can do so from the front end website or use an app such as Postman.


Rutch Johnson Website

When using the website, click through the tabs to submit specific requests.

All Payers - Click the “View All Payers” button to get a list of all the payers stored on the web app. If correctly submitted JSON data will populate. 

Add Payer - To add a new payer click here. Enter the name, points, and date. Click “Add Payer” to submit. If correctly submitted JSON data will populate. 

Submit Points - Click here to submit the points you want to spend. JSON data will populate if you have enough points or not. A list of used payers will show when points are successfully spent. 

Payers Balance - A list of all payers will populate with the total points available to spend from each. 

Reset - Click the reset button to reset the app of data. 




API Tutorial

Use an app, such as Postman, so submit Post, Get, or Delete calls. Use the API url followed by “/” then any of the end points below. Example: https://rutch-site.uc.r.appspot.com/payerlist to call a complete list of payers. 

payerlist - GET: Retrieves a list of all the payers stored on the web app.

addpayer - POST: Send a string of the payer name, an integer of the points, and a string of the timestamp in the body. Example: 
{ "payer": "DANNON", "points": 1000, "timestamp": "2020-11-02T14:00:00Z" }

spendpoints - POST:  Submit an integer of the points you want to spend in the body. Example: 
{ "points": 1000 }

payerpointbalance - GET:  A list of all payers with the total points available to spend. 

reset - DELETE:  Reset the app of data. 



Code Info

This app was built with Node.js and Express.js. The main file is server.js. To run the app locally run “node .” in the terminal of the project folder.
