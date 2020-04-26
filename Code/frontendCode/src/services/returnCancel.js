export const returnCancel  = {
    getAllReservations,
}

export const apiConfig = {
    endpointURL: "http://localhost:4002/api"
}

function getAllReservations() 
{   var userId = localStorage.getItem("user_id");
    // alert("From returnCancel DAO "+userId);
    var url = new URL(`${apiConfig.endpointURL}/allReservations/`+ userId),
    params = {userId: userId}
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    return fetch(url)
    .then(response => {
        // alert("Here in ReturnCancel" );
        return response.json()
    })    

        // return fetch(`${apiConfig.endpointURL}/allReservations`, {userId: userId})

        
}