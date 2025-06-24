export async function getDoctors() {
    const url = `${import.meta.env.VITE_API_URL}/doctors`;
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .catch(error => console.error('Error fetching doctors:', error));
}
// get doctor data
// /doctors/me
// response: {
//   "full_name": "string",
//   "email": "string",
//   "crm_number": "string",
//   "specialty": "string",
//   "state": "string",
//   "city": "string",
//   "cep": "string",
//   "number": "string",
//   "complement": "string",
//   "neighborhood": "string",
//   "id": 0,
//   "is_currently_active": true,
//   "current_score": 0
// }
// bearer token
export async function getMeDoctor() {
    const url = `${import.meta.env.VITE_API_URL}/doctors/me`;
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
        },
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.detail || 'Failed to fetch doctor data');
            });
        }
        return response.json();
    })
    .catch(error => {
        console.error('Error fetching doctor data:', error);
        throw error;
    });
}
