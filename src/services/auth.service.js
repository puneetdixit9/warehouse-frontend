import { AUTH_BASE_URL, PROFILE, CHANGE_PASSWORD, SIGNUP, LOGIN, REFRESH, LOGOUT} from '../constants.js';


function getHeaders() {
    const token = JSON.parse(localStorage.getItem("token"))
    return { 
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token.access_token
    }
}


async function signup(signupData){
    const response = await fetch(AUTH_BASE_URL + SIGNUP, {
        method: "POST",
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(signupData)
    });
    const data = await response.json()
    return [response.status, data];
};



async function login(email, password){
    let regobj = { password, email};
    const response = await fetch(AUTH_BASE_URL + LOGIN, {
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
    let token = JSON.parse(localStorage.getItem("token"))
    const response = await fetch(AUTH_BASE_URL + REFRESH, {
        method: "GET",
        headers: { 
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + token.refresh_token
        },
    });
    let data = await response.json();
    if (response.status === 200){
        token.access_token = data.access_token
        localStorage.setItem("token", JSON.stringify(token))
    } else {
        localStorage.removeItem("token")
    }
    return {
        status: response.status,
        data: data,
    };
};


async function checkAuthfailAndRetry(response, func, body={}){
    let data = await response.json()
    if (response.status === 401 && data.msg === "Token has expired"){
        refresh()
        return func(body)
    }
    return [response.status,  data]
}

function refreshAndRetry(func, body, remainingPath){
    refresh().then(({status, data}) => {
        if(status === 200) {
            return func({ body, remainingPath })
        } else {
            localStorage.setItem("lastPath", window.location.pathname)
            window.location.pathname = '/login';
            alert('session expired, login to continue');
        }
    })
    return
    
}


async function changePassword({ body={}, remainingPath="" }) {
    try {
      const response = await fetch(AUTH_BASE_URL + CHANGE_PASSWORD, {
        method: "PUT",
        headers: getHeaders(),
        body: body,
      });
      
      const status = response.status;
      const data = await response.json();
  
      return handleResponse(changePassword, status, data, body, remainingPath);
    } catch (error) {
      throw new Error(`Error changing password: ${error.message}`);
    }
}

function logoutAccessToken() {
    let token = localStorage.getItem("token")
    token = JSON.parse(token)
    const response = fetch(AUTH_BASE_URL + LOGOUT, {
        method: "GET",
        headers: { 
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + token.access_token
        },
    });
    return response
}

function logoutRefreshToken(){
    let token = localStorage.getItem("token")
    token = JSON.parse(token)
    const response = fetch(AUTH_BASE_URL + 'logout', {
        method: "GET",
        headers: { 
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + token.refresh_token
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


async function get_profile({ body={}, remainingPath="" }) {
    try {
      const response = await fetch(AUTH_BASE_URL + PROFILE, {
        method: "GET",
        headers: getHeaders(),
      });
      
      const status = response.status;
      const data = await response.json();
  
      return handleResponse(get_profile, status, data, body, remainingPath);
    } catch (error) {
      throw new Error(`Error fetching profile: ${error.message}`);
    }
}

async function update_profile({ body={}, remainingPath="" }) {
    try {
      const response = await fetch(AUTH_BASE_URL + PROFILE, {
        method: "PUT",
        headers: getHeaders(),
        body: body,
      });
      
      const status = response.status;
      const data = await response.json();
  
      return handleResponse(update_profile, status, data, body, remainingPath);
    } catch (error) {
      throw new Error(`Error updating profile: ${error.message}`);
    }
}

function handleResponse(func, status, data, body, remainingPath) {
    if (status === 401 && data.msg === "Token has expired") {
      return refreshAndRetry(func, body, remainingPath);
    } else {
      return {
        status: status,
        data: data
      }
    }
}


const AuthService = {
    signup,
    login,
    refresh,
    changePassword,
    logout,
    checkAuthfailAndRetry,
    logoutRefreshToken,
    logoutAccessToken,
    refreshAndRetry,
    get_profile,
    update_profile,
}

export default AuthService;