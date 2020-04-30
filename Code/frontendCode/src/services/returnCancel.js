import valuesExport from '../config/config';
export const returnCancel  = {
    getAllReservations,
}

export const apiConfig = {
    endpointURL: valuesExport.endpointURL
}

function getAllReservations(commentReturn) 
{   var userId = localStorage.getItem("user_id");
    // alert("The comment is" + commentReturn);
    // alert("From returnCancel DAO "+userId);
    var url = new URL(`${apiConfig.endpointURL}/allReservations/`+ userId),
    params = {userId: userId, commentReturn: commentReturn}
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    return fetch(url)
    .then(response => {
        // alert("Here in ReturnCancel" );
        return response.json()
    })    

        // return fetch(`${apiConfig.endpointURL}/allReservations`, {userId: userId})

        
}