// const uuidv4 = require('uuid/v4');
import valuesExport from '../config/config';
export const modifyMembership  = {
    getAllMemberships,
    // postMembership
}

export const apiConfig = {
    endpointURL: valuesExport.endpointURL
}

function getAllMemberships() 
{    
    console.log(`${apiConfig.endpointURL}/allMemberships/`);
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