import { API_BASE_URL } from "../utils/constants.js";

// Get authentication token from localStorage
function getToken() {
return localStorage.getItem("token");
}

// Generic API request helper
async function apiRequest(endpoint, options = {}) {
if (!API_BASE_URL) {
throw new Error("Backend API URL is not configured.");
}

const token = getToken();

const headers = {
...(options.body instanceof FormData
? {}
: { "Content-Type": "application/json" }),

...(token
? {
Authorization: `Bearer ${token}`,
}
: {}),

...(options.headers || {}),
};


const response = await fetch(`${API_BASE_URL}${endpoint}`, {
...options,
headers,
});

let data;

try {
data = await response.json();
} catch {
data = null;
}

if (!response.ok) {
const error = new Error(
data?.message ||
data?.error ||
`API request failed with status ${response.status}`
);


error.status = response.status;
error.data = data;

throw error;


}

return data;
}

// GET request
export async function apiGet(endpoint, options = {}) {
return apiRequest(endpoint, {
...options,
method: "GET",
});
}

// POST request
export async function apiPost(endpoint, body = {}, options = {}) {
return apiRequest(endpoint, {
...options,
method: "POST",
body:
body instanceof FormData
? body
: JSON.stringify(body),
});
}

// PUT request
export async function apiPut(endpoint, body = {}, options = {}) {
return apiRequest(endpoint, {
...options,
method: "PUT",
body:
body instanceof FormData
? body
: JSON.stringify(body),
});
}

// PATCH request
export async function apiPatch(endpoint, body = {}, options = {}) {
return apiRequest(endpoint, {
...options,
method: "PATCH",
body:
body instanceof FormData
? body
: JSON.stringify(body),
});
}

// DELETE request
export async function apiDelete(endpoint, options = {}) {
return apiRequest(endpoint, {
...options,
method: "DELETE",
});
}

// Export API base URL
export { API_BASE_URL };

// Default API helper
export default {
get: apiGet,
post: apiPost,
put: apiPut,
patch: apiPatch,
delete: apiDelete,
};
