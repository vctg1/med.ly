// POST
// /availability/
// Create Availability Slot


// Médico cria um slot de disponibilidade para um exame
// Body: {
//   "exam_id": 0,
//   "date": "2025-06-24",
//   "start_time": "04:48:38.843Z",
//   "end_time": "04:48:38.843Z"
// }
// Response: {
//   "id": 0,
//   "doctor_id": 0,
//   "exam_id": 0,
//   "date": "2025-06-24",
//   "start_time": "04:48:38.844Z",
//   "end_time": "04:48:38.844Z",
//   "is_available": true,
//   "created_at": "2025-06-24T04:48:38.844Z"
// }
// Error:{
//   "detail": [
//     {
//       "loc": [
//         "string",
//         0
//       ],
//       "msg": "string",
//       "type": "string"
//     }
//   ]
// }
// Bearer token: Authorization

export async function createAvailabilitySlot(examId, startTime, endTime, date) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/availability/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
            body: JSON.stringify({
                exam_id: examId,
                start_time: startTime,
                end_time: endTime,
                date: date,
            }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to create availability slot');
        }
        const data = await response.json();
        console.log('Availability slot created successfully:', data);
        return data;
    } catch (error) {
        console.error('Error creating availability slot:', error);
        throw error;
    }
}

// GET
// /availability/my-slots
// Get My Availability Slots


// Médico visualiza seus próprios slots de disponibilidade
// Response: [
//   {
//     "id": 0,
//     "doctor_id": 0,
//     "exam_id": 0,
//     "date": "2025-06-24",
//     "start_time": "04:51:12.140Z",
//     "end_time": "04:51:12.140Z",
//     "is_available": true,
//     "created_at": "2025-06-24T04:51:12.140Z"
//   }
// ]
export async function getMyAvailabilitySlots() {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/availability/my-slots`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to fetch availability slots');
        }
        const data = await response.json();
        console.log('My availability slots fetched successfully:', data);
        return data;
    } catch (error) {
        console.error('Error fetching availability slots:', error);
        throw error;
    }
}
// DELETE
// /availability/{slot_id}
// Delete Availability Slot


// Médico remove um slot de disponibilidade
// Path Parameters: slot_id (ID do slot de disponibilidade)
// 204 Successful Response
export async function deleteAvailabilitySlot(slotId) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/availability/${slotId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to delete availability slot');
        }
        console.log('Availability slot deleted successfully');
        return true; // Indicate successful deletion
    } catch (error) {
        console.error('Error deleting availability slot:', error);
        throw error; // Re-throw the error for further handling if needed
    }
}
