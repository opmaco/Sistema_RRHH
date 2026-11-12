import { useEffect, useState } from 'react'
import { apiGet, apiPost } from '../services/api'

function Contratos() {
  const [formulario, setFormulario] = useState({
    idpersona: '',
    idcargo: '',
    idnivel_salarial: '',
    idregional: '',
    iddireccion: '',
    idunidad_ejecutora: '',
    idproceso: '',
    idfuente: '',
    fecha_ini: '',
    fecha_fin: '',
    condicion: '',
    estado: 1,
    fecha_baja: '',
    motivo_baja: '',
    numcontrato: '',
    observaciones: '',
  })

  const [personas, setPersonas] = useState([])
  const [cargos, setCargos] = useState([])
  const [niveles, setNiveles] = useState([])
  const [regionales, setRegionales] = useState([])
  const [direcciones, setDirecciones] = useState([])
  const [unidades, setUnidades] = useState([])
  const [procesos, setProcesos] = useState([])
  const [fuentes, setFuentes] = useState([])
  const [contratos, setContratos] = useState([])
  const [mensaje, setMensaje] = useState('')

  const cargarDatos = async () => {
    try {
      const [
        datosPersonas,
        datosCargos,
        datosNiveles,
        datosRegionales,
        datosDirecciones,
        datosUnidades,
        datosProcesos,
        datosFuentes,
        datosContratos,
      ] = await Promise.all([
        apiGet('/personas'),
        apiGet('/cargos'),
        apiGet('/niveles-salariales'),
        apiGet('/regionales'),
        apiGet('/direcciones'),
        apiGet('/unidades-ejecutoras'),
        apiGet('/procesos'),
        apiGet('/fuentes'),
        apiGet('/contratos'),
      ])

      setPersonas(datosPersonas)
      setCargos(datosCargos)
      setNiveles(datosNiveles)
      setRegionales(datosRegionales)
      setDirecciones(datosDirecciones)
      setUnidades(datosUnidades)
      setProcesos(datosProcesos)
      setFuentes(datosFuentes)
      setContratos(datosContratos)
    } catch (error) {
      console.error('Error al cargar datos:', error)
      setMensaje('Error al cargar la información.')
    }
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormulario((anterior) => {
      const actualizado = { ...anterior, [name]: value }

      if (name === 'idregional') {
        actualizado.iddireccion = ''
        actualizado.idunidad_ejecutora = ''
      }

      if (name === 'iddireccion') {
        actualizado.idunidad_ejecutora = ''
      }

      return actualizado
    })
  }

  const direccionesFiltradas = direcciones.filter(
    (d) => String(d.idregional) === String(formulario.idregional)
  )

  const unidadesFiltradas = unidades.filter(
    (u) => String(u.iddireccion) === String(formulario.iddireccion)
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMensaje('Guardando...')

    try {
      const datos = {
        ...formulario,
        idpersona: Number(formulario.idpersona),
        idcargo: Number(formulario.idcargo),
        idnivel_salarial: Number(formulario.idnivel_salarial),
        idregional: Number(formulario.idregional),
        iddireccion: Number(formulario.iddireccion),
        idunidad_ejecutora: Number(formulario.idunidad_ejecutora),
        idproceso: Number(formulario.idproceso),
        idfuente: Number(formulario.idfuente),
        estado: Number(formulario.estado),
        fecha_baja: formulario.fecha_baja || null,
      }

      await apiPost('/contratos', datos)

      setMensaje('¡Contrato registrado correctamente!')
      setFormulario({
        idpersona: '',
        idcargo: '',
        idnivel_salarial: '',
        idregional: '',
        iddireccion: '',
        idunidad_ejecutora: '',
        idproceso: '',
        idfuente: '',
        fecha_ini: '',
        fecha_fin: '',
        condicion: '',
        estado: 1,
        fecha_baja: '',
        motivo_baja: '',
        numcontrato: '',
        observaciones: '',
      })

      await cargarDatos()
    } catch (error) {
      console.error('Error al registrar contrato:', error)
      setMensaje('Error al registrar el contrato.')
    }
  }

  const nombrePersona = (id) => {
    const p = personas.find((item) => item.idpersona === id)
    return p
      ? `${p.pnombre || ''} ${p.snombre || ''} ${p.appaterno || ''} ${p.apmaterno || ''}`.trim()
      : `ID ${id}`
  }

  const nombreCargo = (id) =>
    cargos.find((item) => item.idcargo === id)?.cargo || `ID ${id}`

  const nombreRegional = (id) =>
    regionales.find((item) => item.idregional === id)?.regional || `ID ${id}`

  const claseSelect = 'w-full rounded-lg border border-slate-300 p-3'
  const claseInput = 'w-full rounded-lg border border-slate-300 p-3'

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      <div className="rounded-xl bg-white p-8 shadow">
        <h2 className="mb-6 text-2xl font-bold text-slate-800">
          Registro de Contratos
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">

          <div>
            <label className="mb-1 block text-sm font-medium">Persona</label>
            <select name="idpersona" value={formulario.idpersona} onChange={handleChange} required className={claseSelect}>
              <option value="">Seleccionar persona</option>
              {personas.map((p) => (
                <option key={p.idpersona} value={p.idpersona}>
                  {p.pnombre} {p.snombre} {p.appaterno} {p.apmaterno}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Cargo</label>
            <select name="idcargo" value={formulario.idcargo} onChange={handleChange} required className={claseSelect}>
              <option value="">Seleccionar cargo</option>
              {cargos.map((c) => <option key={c.idcargo} value={c.idcargo}>{c.cargo}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Nivel salarial</label>
            <select name="idnivel_salarial" value={formulario.idnivel_salarial} onChange={handleChange} required className={claseSelect}>
              <option value="">Seleccionar nivel salarial</option>
              {niveles.map((n) => (
                <option key={n.idnivel_salarial} value={n.idnivel_salarial}>
                  {n.categoria} - Clase {n.clase} - Nivel {n.nivel} - Bs. {n.sueldo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Regional</label>
            <select name="idregional" value={formulario.idregional} onChange={handleChange} required className={claseSelect}>
              <option value="">Seleccionar regional</option>
              {regionales.map((r) => <option key={r.idregional} value={r.idregional}>{r.regional}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Dirección</label>
            <select name="iddireccion" value={formulario.iddireccion} onChange={handleChange} required disabled={!formulario.idregional} className={claseSelect}>
              <option value="">Seleccionar dirección</option>
              {direccionesFiltradas.map((d) => <option key={d.iddireccion} value={d.iddireccion}>{d.direccion}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Unidad ejecutora</label>
            <select name="idunidad_ejecutora" value={formulario.idunidad_ejecutora} onChange={handleChange} required disabled={!formulario.iddireccion} className={claseSelect}>
              <option value="">Seleccionar unidad ejecutora</option>
              {unidadesFiltradas.map((u) => <option key={u.idunidadejecutora} value={u.idunidadejecutora}>{u.unidadejecutora}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Proceso</label>
            <select name="idproceso" value={formulario.idproceso} onChange={handleChange} required className={claseSelect}>
              <option value="">Seleccionar proceso</option>
              {procesos.map((p) => <option key={p.idproceso} value={p.idproceso}>{p.proceso}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Fuente de financiamiento</label>
            <select name="idfuente" value={formulario.idfuente} onChange={handleChange} required className={claseSelect}>
              <option value="">Seleccionar fuente</option>
              {fuentes.map((f) => <option key={f.idfuente} value={f.idfuente}>{f.fuente}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Fecha de inicio</label>
            <input name="fecha_ini" type="date" value={formulario.fecha_ini} onChange={handleChange} required className={claseInput} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Fecha de finalización</label>
            <input name="fecha_fin" type="date" value={formulario.fecha_fin} onChange={handleChange} required className={claseInput} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Condición</label>
            <input name="condicion" value={formulario.condicion} onChange={handleChange} required className={claseInput} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Estado</label>
            <select name="estado" value={formulario.estado} onChange={handleChange} required className={claseSelect}>
              <option value="1">Activo</option>
              <option value="0">Inactivo</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Fecha de baja</label>
            <input name="fecha_baja" type="date" value={formulario.fecha_baja} onChange={handleChange} className={claseInput} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Motivo de baja</label>
            <input name="motivo_baja" value={formulario.motivo_baja} onChange={handleChange} className={claseInput} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Número de contrato</label>
            <input name="numcontrato" value={formulario.numcontrato} onChange={handleChange} className={claseInput} />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Observaciones</label>
            <textarea name="observaciones" value={formulario.observaciones} onChange={handleChange} rows="3" className={claseInput} />
          </div>

          <button type="submit" className="rounded-lg bg-slate-900 p-3 font-semibold text-white hover:bg-slate-700 md:col-span-2">
            Registrar contrato
          </button>

          <p className="text-sm text-slate-600 md:col-span-2">{mensaje}</p>
        </form>
      </div>

      <div className="rounded-xl bg-white p-8 shadow">
        <h2 className="mb-6 text-2xl font-bold text-slate-800">
          Contratos registrados
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-700">
                <th className="p-3">N.º</th>
                <th className="p-3">Contrato</th>
                <th className="p-3">Persona</th>
                <th className="p-3">Cargo</th>
                <th className="p-3">Regional</th>
                <th className="p-3">Inicio</th>
                <th className="p-3">Fin</th>
                <th className="p-3">Condición</th>
                <th className="p-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {contratos.map((c) => (
                <tr key={c.idcontrato} className="border-b hover:bg-slate-50">
                  <td className="p-3">{c.idcontrato}</td>
                  <td className="p-3">{c.numcontrato || '-'}</td>
                  <td className="p-3">{nombrePersona(c.idpersona)}</td>
                  <td className="p-3">{nombreCargo(c.idcargo)}</td>
                  <td className="p-3">{nombreRegional(c.idregional)}</td>
                  <td className="p-3">{c.fecha_ini}</td>
                  <td className="p-3">{c.fecha_fin}</td>
                  <td className="p-3">{c.condicion}</td>
                  <td className="p-3">
                    {c.estado === 1 ? 'Activo' : 'Inactivo'}
                  </td>
                </tr>
              ))}

              {contratos.length === 0 && (
                <tr>
                  <td colSpan="9" className="p-5 text-center text-slate-500">
                    No existen contratos registrados.
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

export default Contratos