// post appointments
// body: {
//   "availability_slot_id": 0,
//   "notes": "string"
// }
// response:{
//   "id": 0,
//   "patient_id": 0,
//   "doctor_id": 0,
//   "exam_id": 0,
//   "availability_slot_id": 0,
//   "date_time": "2025-06-23T22:56:45.699Z",
//   "status": "string",
//   "notes": "string",
//   "created_at": "2025-06-23T22:56:45.699Z"
// }
// Bearer token: Authorization

export async function createAppointment(availabilitySlotId, notes) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/appointments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
            body: JSON.stringify({
                availability_slot_id: availabilitySlotId,
                notes: notes
            }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to create appointment');
        }
        const data = await response.json();
        console.log('Appointment created successfully:', data);
        return data;
    } catch (error) {
        console.error('Error creating appointment:', error);
        throw error;
    }
}
// get appointments
// response: [
//   {
//     "id": 0,
//     "patient_name": "string",
//     "doctor_name": "string",
//     "exam_name": "string",
//     "date": "2025-06-23",
//     "start_time": "22:57:35.970Z",
//     "end_time": "22:57:35.970Z",
//     "status": "string",
//     "notes": "string",
//     "created_at": "2025-06-23T22:57:35.970Z"
//   }
// ]
export async function getAppointments() {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/appointments/my-appointments`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to fetch appointments');
        }
        const data = await response.json();
        console.log('Appointments fetched successfully:', data);
        return data;
    } catch (error) {
        console.error('Error fetching appointments:', error);
        throw error;
    }
}

// get appointments by id
// response: {
//   "id": 0,
//   "patient_id": 0,
//   "doctor_id": 0,
//   "exam_id": 0,
//   "availability_slot_id": 0,
//   "date_time": "2025-06-23T22:58:25.982Z",
//   "status": "string",
//   "notes": "string",
//   "created_at": "2025-06-23T22:58:25.982Z"
// }
export async function getAppointmentById(appointmentId) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/appointments/${appointmentId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                //bearer token
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to fetch appointment');
        }
        const data = await response.json();
        console.log('Appointment fetched successfully:', data);
        return data;
    } catch (error) {
        console.error('Error fetching appointment:', error);
        throw error;
    }
}
