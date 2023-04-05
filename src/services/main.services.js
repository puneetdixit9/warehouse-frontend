import AuthService from "./auth.service";

const API_URL = "http://127.0.0.1:5000/";


// async function checkAuthfailAndRetry(response, func, body={}){
//     let data = await response.json()
//     if (response.status === 401 && data.msg === "Token has expired"){
//         AuthService.refresh()
//         return func(body)
//     }
//     return [response.status,  data]
// }


async function getAddress(){
    let token = localStorage.getItem("token")
    token = JSON.parse(token)
    const response = await fetch(API_URL + 'addresses', {
        method: "GET",
        headers: { 
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + token.access_token
        },
    });
    return AuthService.checkAuthfailAndRetry(response, getAddress);
};

async function addAddress(address){
    let token = localStorage.getItem("token")
    token = JSON.parse(token)
    const response = await fetch(API_URL + 'address', {
        method: "POST",
        headers: { 
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + token.access_token
        },
        body: JSON.stringify(address)
    });
    return AuthService.checkAuthfailAndRetry(response, addAddress, address);
};


const MainService = {
    getAddress,
    addAddress,
}


export default MainService;