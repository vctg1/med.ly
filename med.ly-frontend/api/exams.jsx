// GET
// /exams/
// Get Exams

// Retorna todos os exames existentes no sistema. Se o parâmetro q for fornecido, filtra os exames por tipo, nome ou descrição. Esta rota é pública (não requer autenticação).

export async function getExams(searchQuery = '') {
    const url = `${import.meta.env.VITE_API_URL}/exams/${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`;
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .catch(error => {
        console.error('Error fetching exams:', error);
        throw error; // Re-throw the error for further handling if needed
    });
}
    // response:
    // [
    // {
    //     "id": 0,
    //     "name": "string",
    //     "exam_type": "string",
    //     "duration_minutes": 0,
    //     "description": "string",
    //     "specialty": "string",
    //     "image_url": "string"
    //  }
    // ]
    // error:{
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


export async function getExamsAvailable() {
    const url = `${import.meta.env.VITE_API_URL}/exams/available`;
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .catch(error => {
        console.error('Error fetching exams:', error);
        throw error; // Re-throw the error for further handling if needed
    });
}

    // response:
    // [
    // {
    //     "id": 0,
    //     "name": "string",
    //     "exam_type": "string",
    //     "duration_minutes": 0,
    //     "description": "string",
    //     "specialty": "string",
    //     "image_url": "string",
    //     "doctors_available": [
    //     {
    //         "doctor_id": 0,
    //         "doctor_name": "string",
    //         "specialty": "string",
    //         "available_slots": [
    //         {
    //             "id": 0,
    //             "doctor_id": 0,
    //             "exam_id": 0,
    //             "date": "2025-06-23",
    //             "start_time": "00:00:00.000Z",
    //             "end_time": "00:00:00.000Z",
    //             "is_available": true,
    //             "created_at": "2025-06-23T21:50:02.805Z"
    //         }
    //         ]
    //     }
    //     ]
    // }
    // ]
    // error:{
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