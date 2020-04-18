// const uuidv4 = require('uuid/v4');

export const modifyMembership  = {
    getAllMemberships,
    // postMembership
}

export const apiConfig = {
    endpointURL: "http://localhost:4002/api"
}

function getAllMemberships() 
{    
    // alert(`${apiConfig.endpointURL}/allMemberships/`);
    return fetch(`${apiConfig.endpointURL}/allMemberships/`)
    .then(response => {
        return response.json()
    })    
}
// valuesExport.url + 'user/cancelMem/', JSON.stringify({ userID: this.state.userID })
// function postMembership(membershipId){
//     // alert(" Web service " + membershipId);
//     const url=`${apiConfig.endpointURL}/modifyMembership`;
//     const res = fetch(url, {
//         method: 'Post',
//         params: JSON.stringify({
//             "membershipId": membershipId
//         }),
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     });
//     return res;
// }