export const returnCancel  = {
    getAllReservations,
}

export const apiConfig = {
    endpointURL: "http://localhost:4002/api"
}

function getAllReservations() 
{   
    // alert(userId);
    var url = new URL(`${apiConfig.endpointURL}/allReservations`),
    params = {userId: "5"}
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    return fetch(url)
    .then(response => {
        return response.json()
    })    

        // return fetch(`${apiConfig.endpointURL}/allReservations`, {userId: userId})

}