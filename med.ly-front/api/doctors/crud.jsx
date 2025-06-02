export async function getDoctors() {
    const url = `${'http://localhost:8000'}/doctors`;
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .catch(error => console.error('Error fetching doctors:', error));
}

export async function getDoctor(id) {
    const url = `${'http://localhost:8000'}/doctors/${id}`;
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .catch(error => console.error('Error fetching doctor:', error));
}
export async function createDoctor(doctor) {
    const url = `${'http://localhost:8000'}/doctors`;
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify(doctor),
    })
    .then(response => response.json())
    .catch(error => error);
}
