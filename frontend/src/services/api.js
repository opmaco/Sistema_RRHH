const API_URL = 'https://sistema-rrhh-roj8.onrender.com/api'

export async function apiGet(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}`)

  if (!response.ok) {
    throw new Error('Error al consultar el servidor')
  }

  return response.json()
}

export async function apiPost(endpoint, data) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Error al guardar los datos')
  }

  return response.json()
}