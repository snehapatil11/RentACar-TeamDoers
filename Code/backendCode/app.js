var AWS = require('aws-sdk')
var express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config();
var app = express();

let awsConfig = {
 "region": process.env.region,
 "endpoint": process.env.endpoint,
 "accessKeyId": process.env.accessKeyId, 
 "secretAccessKey": process.env.secretAccessKey
};

app.use(cors());
app.options('*', cors());


AWS.config.update(awsConfig);
const dynamoDb = new AWS.DynamoDB.DocumentClient();

app.use(bodyParser.json({ type: 'application/json' }));

app.listen(4002, () => {
    console.log("Server running on port 4002");
})

app.on('error', err => {
  console.log("Error :", err);
})

app.get('/', function (req, res) {
  res.send('Hello World from Team Doers!')
})

app.get('/api/allVehicles', function (req, res) {
    const params = { 
      TableName: "Vehicle"
    }    
    dynamoDb.scan(params, (error, result) => {
  
      if (error) {  
        console.log(error);  
        return res.status(400).json({ error: 'Could not get user' });  
      }
  
      if (result) { 
        return res.json(result.Items);
      } 
      else { return res.status(404).json({ error: "User not found" }); }  
    });
  
})

app.get('/allVehicles', function (req, res) {
  const params = { 
    TableName: "Vehicle"
  }    
  dynamoDb.scan(params, (error, result) => {

    if (error) {  
      console.log(error);  
      return res.status(400).json({ error: 'Could not get user' });  
    }

    if (result) { 
      return res.json(result.Items);
    } 
    else { return res.status(404).json({ error: "User not found" }); }  
  });

})
app.get('/api/vehicleTransactions/:vehicleId', function (req, res) {
  const id = req.params.vehicleId;
  console.log(id);
  const params = { 
    TableName: "VehicleTransaction",
    FilterExpression: '#vehicleId = :vehicleId',
    ExpressionAttributeNames: {
        '#vehicleId': 'vehicleId',
    },
    ExpressionAttributeValues: {
        ':vehicleId': id,
    },
  }    
  dynamoDb.scan(params, (error, result) => {

    if (error) {  
      console.log(error);  
      return res.status(400).json({ error: 'Could not get user' });  
    }

    if (result) { 
      return res.json(result.Items);
    } 
    else { return res.status(404).json({ error: "User not found" }); }  
  });

})

app.post('/api/postVehicleTransaction', function(req, res){
  const params = {  
    TableName: "VehicleTransaction",
    Item: req.body
  }
  console.log(params);
  dynamoDb.put(params, (error, result) =>{
    
    if(error){
      console.log(error);
      console.log(params);
      return res.status(400).json({ error: 'Could not insert vehicle transaction' });
    }
    if(result){
      console.log(result);
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.json({result});
    }
    else
    return res.status(400).json({ error: 'Could not insert vehicle transaction' });  
  })

})

app.get('/users/:email', function (req, res) {
  const useremail = req.params.email;
  console.log(useremail);
  const params = { 
    TableName: "storageFiles",
    FilterExpression: '#email = :email',
    ExpressionAttributeNames: {
        '#email': 'Email',
    },
    ExpressionAttributeValues: {
        ':email': useremail,
    },
  }    
  dynamoDb.scan(params, (error, result) => {

    if (error) {  
      console.log(error);  
      return res.status(400).json({ error: 'Could not get user' });  
    }

    if (result) { 
      return res.json(result.Items);
    } 
    else { return res.status(404).json({ error: "User not found" }); }  
  });

})

app.get('/file/:filename', function (req, res) {
  const file = req.params.filename;
  const params = { 
    TableName: "storageFiles",
    FilterExpression: '#filename = :filename',
    ExpressionAttributeNames: {
        '#filename': 'FileName',
    },
    ExpressionAttributeValues: {
        ':filename': file,
    },
  }    
  dynamoDb.scan(params, (error, result) => {

    if (error) {  
      console.log(error);  
      return res.status(400).json({ error: 'Could not get user' });  
    }

    if (result) { 
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.json(result.Items);
    } 
    else { return res.status(404).json({ error: "User not found" }); }  
  });

})

app.get('/updatefiledata/:fileId',function(req, res){
  console.log("on server for update");
  var time = new Date().toDateString() + " " + new Date().toLocaleTimeString();
  var params = {
    TableName: "storageFiles",
    Key: 
    {
      "Id": req.params.fileId      
    },
    UpdateExpression: "SET UpdatedAt = :time",
    ExpressionAttributeValues:{
        ":time": time
    },
    ReturnValues:"UPDATED_NEW"
  };
  console.log(params);
  dynamoDb.update(params, function(err, data) {
    if (err) {
        console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
        res.json(data);
    }
  });
})
app.delete('/deletefiledata/:fileId',function(req, res){
  const params = {  
    TableName: "storageFiles",
    Key: 
    {
      "Id": req.params.fileId      
    }
  }
  console.log(params);
  dynamoDb.delete(params, function(err, data) {
    if (err) {
        console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(data);
    }
  });
})



app.post('/user/add/', function(req, res){
    const params = {  
      TableName: "RentalUser",
      Item: req.body
    }
    console.log(params);
    dynamoDb.put(params, (error, result) =>{
      
      if(error){
        console.log(error);
        console.log(params);
        return res.status(400).json({ error: 'Could not insert user' });
      }
      if(result){
        console.log(result);
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.json({result});
      }
      else
      return res.status(400).json({ error: 'Could not insert user' });  
    })

})

app.get('/user/info/:userId', function(req, res){
    const userId = Number(req.params.userId);
  console.log(userId);
  const params = { 
    TableName: "RentalUser",
    FilterExpression: '#userId = :userId',
    ExpressionAttributeNames: {
        '#userId': 'userId',
    },
    ExpressionAttributeValues: {
        ':userId': userId,
    },
  }    

  console.log(params)
  dynamoDb.scan(params, (error, result) => {

    if (error) {  
      console.log(error);  
      return res.status(400).json({ error: 'Could not get user' });  
    }

    if (result) { 
        console.log(result.Items)
      return res.json(result.Items);
    } 
    else { return res.status(404).json({ error: "User not found" }); }  
  });
})



/** Below added by Manasa on 04/15/2020 for Admin to modify memberships - Start */


app.get('/api/allMemberships', function (req, res) {
  const params = { 
    TableName: "Membership"
  }    
  dynamoDb.scan(params, (error, result) => {

    if (error) {  
      console.log(error);  
      return res.status(400).json({ error: 'Could not get user' });  
    }

    if (result) { 
      return res.json(result.Items);
    } 
    else { return res.status(404).json({ error: "User not found" }); }  
  });

})

app.post('/api/modifyMembership', function(req, res){
  // console.log("Debug ==> Hit this modifyMembership. ");
  console.log("\n \n " + JSON.stringify(req.body))
  // console.log(params.stringify());
  var time = new Date().toDateString() + " " + new Date().toLocaleTimeString();
  var params = {
    TableName: "Membership",
    Key: 
    {
      "membershipId": req.body.membershipId      
    },
    UpdateExpression: "SET endDate = :time",
    ExpressionAttributeValues:{
        ":time": time
    },
    ReturnValues:"UPDATED_NEW"
  };
  console.log(params);
  dynamoDb.update(params, function(err, data) {
    if (err) {
        console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
        res.json(data);
    }
  });
})

/** Below added by Manasa on 04/15/2020 for Admin to modify memberships - End */

/** Below added by Manasa on 04/15/2020 for Admin to modify memberships - Start */

app.get('/api/allReservations', function (req, res) {
  const userId = req.params.userId;
  console.log(" \n userId is:  " + userId);
  const params = { 
    TableName: "VehicleTransaction",
    Key: 
    {
      "userId": "5",      
    },
  }    
  dynamoDb.scan(params, (error, result) => {

    if (error) {  
      console.log(error);  
      return res.status(400).json({ error: 'Could not get reservation' });  
    }

    if (result) { 
      return res.json(result.Items);
    } 
    else { return res.status(404).json({ error: "Reservation not found" }); }  
  });

})

app.post('/api/returnCancel', function(req, res){
  console.log("Debug ==> Hit this returnCancel. ");
  console.log("\n \n " + JSON.stringify(req.body))
  var time = new Date().toDateString() + " " + new Date().toLocaleTimeString();
  var params = {
    TableName: "VehicleTransaction",
    Key: 
    {
      "vehicleTransactionId": req.body.vehicleTransactionId      
    },
    UpdateExpression: "SET rentEndDateTime = :time",
    ExpressionAttributeValues:{
        ":time": time
    },
    ReturnValues:"UPDATED_NEW"
  };
  console.log(params);
  dynamoDb.update(params, function(err, data) {
    if (err) {
        console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
        res.json(data);
    }
  });
})

/** Below added by Manasa on 04/15/2020 for Admin to modify memberships - End */
