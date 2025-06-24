//get /patients/me
// response:{
//   "full_name": "string",
//   "date_of_birth": "2025-06-23",
//   "cpf": "string",
//   "rg": "string",
//   "sex": "string",
//   "email": "string",
//   "phone": "string",
//   "cep": "string",
//   "city": "string",
//   "state": "string",
//   "emergency_phone": "string",
//   "emergency_contact_name": "string",
//   "health_insurance_name": "string",
//   "health_insurance_number": "string",
//   "id": 0,
//   "current_score": 0
// }
export async function getMe() {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/patients/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
            }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to fetch patient data');
        }
        const data = await response.json();
        console.log('Patient data fetched successfully:', data);
        return data;
    } catch (error) {
        console.error('Error fetching patient data:', error);
        throw error;
    }
}
