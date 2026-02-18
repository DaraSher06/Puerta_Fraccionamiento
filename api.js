export const API_URL = "https://698a17c7c04d974bc6a15590.mockapi.io/api/v1/puerta";

export async function getPuertas() {
    const res = await fetch(API_URL);
    return await res.json();
}

export async function createPuerta(data) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return await res.json();
}

export async function updatePuerta(id, data) {
    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
}

export async function deletePuerta(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
}
