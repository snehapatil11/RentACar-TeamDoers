const uuidv4 = require('uuid/v4');

export const vehicleServices  = {
    getVehiclesData,
    getVehicleTransactions,
    storeVehicleTransaction
}

export const apiConfig = {
    endpointURL: "http://localhost:8081/api"
}

function getVehiclesData(email) 
{    
    return fetch(`${apiConfig.endpointURL}/allVehicles/`)
    .then(response => {
        return response.json()
    })    
}

function getVehicleTransactions(vehicleId, rentedDate) 
{
    return fetch(`${apiConfig.endpointURL}/vehicleTransactions/`+ vehicleId)
    .then(response => {
        return response.json()
    })    
}

function storeVehicleTransaction(vehicleId, userId, isReserved, isReturned,rentedDateTime,rentedLength, rentEndDateTime, returnDateTime){

    const url=`${apiConfig.endpointURL}/postVehicleTransaction`;
    return fetch(url, {
            method: 'Post',
            body: JSON.stringify({
                "vehicleTransactionId": uuidv4(),
                "vehicleId": vehicleId,
                "userId":userId,
                "isReserved":isReserved,
                "isReturned":isReturned,
                "rentedDateTime": rentedDateTime,
                "rentedLength":rentedLength,
                "rentEndDateTime":rentEndDateTime,
                "returnDateTime":returnDateTime
            }),
            headers: {
                'Content-Type': 'application/json'
              }
        }).then(res => {return res})
}