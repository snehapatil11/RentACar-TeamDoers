const uuidv4 = require('uuid/v4');

export const vehicleServices  = {
    getVehiclesData
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
