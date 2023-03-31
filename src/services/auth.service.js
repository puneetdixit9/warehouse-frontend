const API_URL = "http://127.0.0.1:5000/";


async function signup(signupData){
    const response = await fetch(API_URL + 'signup', {
        method: "POST",
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(signupData)
    });
    const data = await response.json()
    return [response.status, data];
};



async function login(email, password){
    let regobj = { password, email};
    const response = await fetch(API_URL + 'login', {
        method: "POST",
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(regobj)
    });
    if (response.status === 200){
        return await response.json();
    } else {
        let error = await response.text()
        throw new Error(error);
    }
};


async function refresh(){
    let user = localStorage.getItem("user")
    user = JSON.parse(user)
    const response = await fetch(API_URL + 'refresh', {
        method: "GET",
        headers: { 
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + user.refresh_token
        },
    });
    let data = await response.json();
    if (response.status === 200){
        user.access_token = data.access_token
        localStorage.setItem("user", JSON.stringify(user))
    } else {
        localStorage.removeItem("user")
    }
    return data;
};


async function checkAuthfailAndRetry(response, func, body={}){
    let data = await response.json()
    if (response.status === 401 && data.msg === "Token has expired"){
        refresh()
        return func(body)
    }
    return [response.status,  data]
}

async function refreshAndRetry(func, body, remainingPath){
    refresh()
    return func({ body, remainingPath })
}

async function change_password(old_password, new_password){
    let user = localStorage.getItem("user")
    user = JSON.parse(user)
    let regobj = { old_password, new_password};
    const response = await fetch(API_URL + 'change_password', {
        method: "PUT",
        headers: { 
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + user.access_token
        },
        body: JSON.stringify(regobj)
    });

   if (response.status !== 200 && response.status !== 401){
        let error = await response.text()
        throw new Error(error);
    } else {
        return response.status
    }
};


function logoutAccessToken() {
    let user = localStorage.getItem("user")
    user = JSON.parse(user)
    const response = fetch(API_URL + 'logout', {
        method: "DELETE",
        headers: { 
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + user.access_token
        },
    });
    return response
}

function logoutRefreshToken(){
    let user = localStorage.getItem("user")
    user = JSON.parse(user)
    const response = fetch(API_URL + 'logout', {
        method: "DELETE",
        headers: { 
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + user.refresh_token
        },
    });
    return response
}

async function logout(){
    let response = logoutAccessToken()
    let response2 = logoutRefreshToken()
    let data = await response.json()
    let data2 = await response2.json()
    return [data, data2]
}

const AuthService = {
    signup,
    login,
    refresh,
    change_password,
    logout,
    checkAuthfailAndRetry,
    logoutRefreshToken,
    logoutAccessToken,
    refreshAndRetry
}

export default AuthService;