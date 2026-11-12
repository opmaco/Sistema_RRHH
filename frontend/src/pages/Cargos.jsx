import { useEffect, useState } from 'react'
import { apiGet, apiPost } from '../services/api'

function Cargos() {
  const formularioInicial = {
    cargo: '',
    codigo: '',
    descripcion: '',
    nivel: '',
    estado: true,
  }

  const [formulario, setFormulario] = useState(formularioInicial)
  const [cargos, setCargos] = useState([])
  const [mensaje, setMensaje] = useState('')

  const cargarCargos = async () => {
    try {
      const datos = await apiGet('/cargos')
      setCargos(datos)
    } catch (error) {
      console.error('Error al cargar cargos:', error)
      setMensaje('Error al consultar los cargos.')
    }
  }

  useEffect(() => {
    cargarCargos()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormulario({
      ...formulario,
      [name]: name === 'nivel' ? Number(value) : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMensaje('Guardando...')

    try {
      await apiPost('/cargos', formulario)
      setMensaje('¡Cargo registrado correctamente!')
      setFormulario(formularioInicial)
      await cargarCargos()
    } catch (error) {
      console.error('Error al registrar cargo:', error)
      setMensaje('Error al registrar el cargo.')
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow">
        <h2 className="mb-6 text-2xl font-bold text-slate-800">
          Registro de Cargos
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="cargo"
            value={formulario.cargo}
            onChange={handleChange}
            placeholder="Nombre del cargo"
            required
            className="w-full rounded-lg border p-3"
          />

          <input
            name="codigo"
            value={formulario.codigo}
            onChange={handleChange}
            placeholder="Código"
            required
            className="w-full rounded-lg border p-3"
          />

          <input
            name="descripcion"
            value={formulario.descripcion}
            onChange={handleChange}
            placeholder="Descripción"
            className="w-full rounded-lg border p-3"
          />

          <input
            name="nivel"
            type="number"
            value={formulario.nivel}
            onChange={handleChange}
            placeholder="Nivel salarial"
            required
            className="w-full rounded-lg border p-3"
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-slate-900 p-3 font-semibold text-white hover:bg-slate-700"
          >
            Registrar cargo
          </button>

          <p className="text-sm text-slate-600">{mensaje}</p>
        </form>
      </div>

      <div className="rounded-xl bg-white p-8 shadow">
        <h2 className="mb-6 text-2xl font-bold text-slate-800">
          Cargos registrados
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-700">
                <th className="p-3">ID</th>
                <th className="p-3">Código</th>
                <th className="p-3">Cargo</th>
                <th className="p-3">Descripción</th>
                <th className="p-3">Nivel</th>
                <th className="p-3">Estado</th>
              </tr>
            </thead>

            <tbody>
              {cargos.map((c) => (
                <tr key={c.idcargo} className="border-b hover:bg-slate-50">
                  <td className="p-3">{c.idcargo}</td>
                  <td className="p-3">{c.codigo}</td>
                  <td className="p-3">{c.cargo}</td>
                  <td className="p-3">{c.descripcion || '-'}</td>
                  <td className="p-3">{c.nivel}</td>
                  <td className="p-3">
                    {c.estado ? 'Activo' : 'Inactivo'}
                  </td>
                </tr>
              ))}

              {cargos.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-5 text-center text-slate-500">
                    No existen cargos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

export default Cargos