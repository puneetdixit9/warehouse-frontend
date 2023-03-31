import { API_BASE_URL, WAREHOUSE, BENCHMARK_PRODUCTIVITY, UPLOAD_PRODUCTIVITY_FILE, EXPECTED_DEMANDS, UPLOAD_DEMAND_FORECAST_FILE, CALCULATE_MANPOWER} from '../constants.js';
import AuthService from "./auth.service";

function getHeaders() {
    const user = JSON.parse(localStorage.getItem("user"))
    return { 
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + user.access_token
    }
}

async function getWarehouses({ body={}, remainingPath="" }) {
    const user = JSON.parse(localStorage.getItem("user"))
    try {
      const response = await fetch(API_BASE_URL + WAREHOUSE + remainingPath, {
        method: "GET",
        headers: getHeaders(),
      });
      
      const status = response.status;
      const data = await response.json();
  
      return handleResponse(getWarehouses, status, data, body, remainingPath);
    } catch (error) {
      throw new Error(`Error fetching warehouses: ${error.message}`);
    }
}


async function getProductivityData({ body={}, remainingPath="" }) {
    try {
        const response = await fetch(API_BASE_URL + BENCHMARK_PRODUCTIVITY + "/" + remainingPath, {
          method: "GET",
          headers: getHeaders(),
        });
        
        const status = response.status;
        const data = await response.json();
    
        return handleResponse(getProductivityData, status, data, body, remainingPath);
      } catch (error) {
        throw new Error(`Error in fetching productivity data: ${error.message}`);
      }
}


async function updateProductivityData({ body={}, remainingPath="" }) {
    try {
        const response = await fetch(API_BASE_URL + BENCHMARK_PRODUCTIVITY, {
          method: "PUT",
          headers: getHeaders(),
          body: body
        });
        
        const status = response.status;
        const data = await response.json();
    
        return handleResponse(updateProductivityData, status, data, body, remainingPath);
      } catch (error) {
        throw new Error(`Error in updating productivity data: ${error.message}`);
      }
}

async function uploadProductivityFile({ body={}, remainingPath="" }) {
    let headers = getHeaders()
    delete headers["content-type"]
    try {
        const response = await fetch(API_BASE_URL + UPLOAD_PRODUCTIVITY_FILE + "/" + remainingPath, {
          method: "POST",
          headers: headers,
          body: body
        });
        
        const status = response.status;
        const data = await response.json();
    
        return handleResponse(uploadProductivityFile, status, data, body, remainingPath);
      } catch (error) {
        throw new Error(`Error in uploading productivity file: ${error.message}`);
      }
}


async function getExpectedDemandsData({ body={}, remainingPath="" }) {
    try {
        const response = await fetch(API_BASE_URL + EXPECTED_DEMANDS + "/" + remainingPath, {
          method: "GET",
          headers: getHeaders(),
        });
        
        const status = response.status;
        const data = await response.json();
    
        return handleResponse(getExpectedDemandsData, status, data, body, remainingPath);
      } catch (error) {
        throw new Error(`Error in fetching expected demands data: ${error.message}`);
      }
}

async function updateExpectedDemandsData({ body={}, remainingPath="" }) {
    try {
        const response = await fetch(API_BASE_URL + EXPECTED_DEMANDS, {
          method: "PUT",
          headers: getHeaders(),
          body: body
        });
        
        const status = response.status;
        const data = await response.json();
    
        return handleResponse(updateExpectedDemandsData, status, data, body, remainingPath);
      } catch (error) {
        throw new Error(`Error in updating expected demands data: ${error.message}`);
      }
}

async function uploadExpectedDemandsFile({ body={}, remainingPath="" }) {
    let headers = getHeaders()
    delete headers["content-type"]
    try {
        const response = await fetch(API_BASE_URL + UPLOAD_DEMAND_FORECAST_FILE + "/" + remainingPath, {
          method: "POST",
          headers: headers,
          body: body
        });
        
        const status = response.status;
        const data = await response.json();
    
        return handleResponse(uploadExpectedDemandsFile, status, data, body, remainingPath);
      } catch (error) {
        throw new Error(`Error in uploading expected demands file: ${error.message}`);
      }
}
  

async function catculateManpower({ body={}, remainingPath="" }) {
    try {
        const response = await fetch(API_BASE_URL + CALCULATE_MANPOWER, {
          method: "POST",
          headers: getHeaders(),
          body: body
        });
        
        const status = response.status;
        const data = await response.json();
    
        return handleResponse(catculateManpower, status, data, body, remainingPath);
      } catch (error) {
        throw new Error(`Error in calculating manpower data: ${error.message}`);
      }
}

function handleResponse(func, status, data, body, remainingPath) {
    if (status === 401 && data.msg === "Token has expired") {
      return AuthService.refreshAndRetry(func, body, remainingPath);
    } else {
      return {
        status: status,
        data: data
      }
    }
}

  
const WarehouseService = {
    getWarehouses,
    getProductivityData,
    updateProductivityData,
    uploadProductivityFile,
    getExpectedDemandsData,
    updateExpectedDemandsData,
    uploadExpectedDemandsFile,
    catculateManpower,
};
  
export default WarehouseService;
  
