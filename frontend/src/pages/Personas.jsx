import { useEffect, useState } from 'react'
import { apiGet, apiPost } from '../services/api'

function Personas() {
  const formularioInicial = {
    ci: '',
    appaterno: '',
    apmaterno: '',
    pnombre: '',
    snombre: '',
    fechanac: '',
    celular: '',
    correo: '',
    domicilio: '',
    sexo: '',
    lugarnac: '',
  }

  const [formulario, setFormulario] = useState(formularioInicial)
  const [personas, setPersonas] = useState([])
  const [mensaje, setMensaje] = useState('')

  const cargarPersonas = async () => {
    try {
      const datos = await apiGet('/personas')
      setPersonas(datos)
    } catch (error) {
      console.error('Error al cargar personas:', error)
      setMensaje('Error al consultar las personas.')
    }
  }

  useEffect(() => {
    cargarPersonas()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormulario({ ...formulario, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMensaje('Guardando...')

    try {
      await apiPost('/personas', {
        ...formulario,
        celular: formulario.celular ? Number(formulario.celular) : null,
      })

      setMensaje('¡Persona registrada correctamente!')
      setFormulario(formularioInicial)
      await cargarPersonas()
    } catch (error) {
      console.error('Error al registrar persona:', error)
      setMensaje('Error al registrar la persona.')
    }
  }

  const campos = [
    ['ci', 'Carnet de identidad'],
    ['appaterno', 'Apellido paterno'],
    ['apmaterno', 'Apellido materno'],
    ['pnombre', 'Primer nombre'],
    ['snombre', 'Segundo nombre'],
    ['fechanac', 'Fecha de nacimiento'],
    ['celular', 'Celular'],
    ['correo', 'Correo electrónico'],
    ['domicilio', 'Domicilio'],
    ['lugarnac', 'Lugar de nacimiento'],
  ]

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      <div className="rounded-xl bg-white p-8 shadow">
        <h2 className="mb-6 text-2xl font-bold text-slate-800">
          Registro de Personas
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">

          {campos.map(([nombre, etiqueta]) => (
            <div key={nombre}>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                {etiqueta}
              </label>

              <input
                name={nombre}
                type={
                  nombre === 'fechanac'
                    ? 'date'
                    : nombre === 'celular'
                      ? 'number'
                      : nombre === 'correo'
                        ? 'email'
                        : 'text'
                }
                value={formulario[nombre]}
                onChange={handleChange}
                required={['ci', 'appaterno', 'pnombre', 'fechanac'].includes(nombre)}
                className="w-full rounded-lg border border-slate-300 p-3"
              />
            </div>
          ))}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Sexo
            </label>

            <select
              name="sexo"
              value={formulario.sexo}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 p-3"
            >
              <option value="">Seleccionar</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-slate-900 p-3 font-semibold text-white hover:bg-slate-700 md:col-span-2"
          >
            Registrar persona
          </button>

          <p className="text-sm text-slate-600 md:col-span-2">
            {mensaje}
          </p>
        </form>
      </div>

      <div className="rounded-xl bg-white p-8 shadow">
        <h2 className="mb-6 text-2xl font-bold text-slate-800">
          Personas registradas
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-700">
                <th className="p-3">ID</th>
                <th className="p-3">C.I.</th>
                <th className="p-3">Nombre completo</th>
                <th className="p-3">Fecha nacimiento</th>
                <th className="p-3">Celular</th>
                <th className="p-3">Correo</th>
                <th className="p-3">Sexo</th>
              </tr>
            </thead>

            <tbody>
              {personas.map((p) => (
                <tr key={p.idpersona} className="border-b hover:bg-slate-50">
                  <td className="p-3">{p.idpersona}</td>
                  <td className="p-3">{p.ci}</td>
                  <td className="p-3">
                    {[p.pnombre, p.snombre, p.appaterno, p.apmaterno]
                      .filter(Boolean)
                      .join(' ')}
                  </td>
                  <td className="p-3">{p.fechanac}</td>
                  <td className="p-3">{p.celular || '-'}</td>
                  <td className="p-3">{p.correo || '-'}</td>
                  <td className="p-3">
                    {p.sexo === 'M' ? 'Masculino' : p.sexo === 'F' ? 'Femenino' : '-'}
                  </td>
                </tr>
              ))}

              {personas.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-5 text-center text-slate-500">
                    No existen personas registradas.
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

export default Personas