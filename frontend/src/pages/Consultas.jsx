import { useEffect, useMemo, useState } from 'react'
import { apiGet } from '../services/api'

function Consultas() {
  const [contratos, setContratos] = useState([])
  const [personas, setPersonas] = useState([])
  const [cargos, setCargos] = useState([])
  const [niveles, setNiveles] = useState([])
  const [regionales, setRegionales] = useState([])
  const [direcciones, setDirecciones] = useState([])
  const [unidades, setUnidades] = useState([])
  const [procesos, setProcesos] = useState([])
  const [fuentes, setFuentes] = useState([])

  const [busqueda, setBusqueda] = useState('')
  const [regionalFiltro, setRegionalFiltro] = useState('')
  const [cargoFiltro, setCargoFiltro] = useState('')
  const [tipoReporte, setTipoReporte] = useState('activos')
  const [mensaje, setMensaje] = useState('Cargando información...')

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resultados = await Promise.all([
          apiGet('/contratos'),
          apiGet('/personas'),
          apiGet('/cargos'),
          apiGet('/niveles-salariales'),
          apiGet('/regionales'),
          apiGet('/direcciones'),
          apiGet('/unidades-ejecutoras'),
          apiGet('/procesos'),
          apiGet('/fuentes'),
        ])

        setContratos(resultados[0])
        setPersonas(resultados[1])
        setCargos(resultados[2])
        setNiveles(resultados[3])
        setRegionales(resultados[4])
        setDirecciones(resultados[5])
        setUnidades(resultados[6])
        setProcesos(resultados[7])
        setFuentes(resultados[8])
        setMensaje('')
      } catch (error) {
        console.error('Error al consultar información:', error)
        setMensaje('No fue posible cargar la información.')
      }
    }

    cargarDatos()
  }, [])

  const buscarPorId = (lista, campo, id) =>
    lista.find((item) => String(item[campo]) === String(id))

  const nombrePersona = (id) => {
    const p = buscarPorId(personas, 'idpersona', id)
    return p
      ? `${p.pnombre || ''} ${p.snombre || ''} ${p.appaterno || ''} ${p.apmaterno || ''}`.trim()
      : '-'
  }

  const filas = useMemo(() => {
    return contratos.map((c) => {
      const persona = buscarPorId(personas, 'idpersona', c.idpersona)
      const cargo = buscarPorId(cargos, 'idcargo', c.idcargo)
      const nivel = buscarPorId(niveles, 'idnivel_salarial', c.idnivel_salarial)
      const regional = buscarPorId(regionales, 'idregional', c.idregional)
      const direccion = buscarPorId(direcciones, 'iddireccion', c.iddireccion)
      const unidad = buscarPorId(unidades, 'idunidadejecutora', c.idunidad_ejecutora)
      const proceso = buscarPorId(procesos, 'idproceso', c.idproceso)
      const fuente = buscarPorId(fuentes, 'idfuente', c.idfuente)

      return {
        ...c,
        persona,
        nombre: nombrePersona(c.idpersona),
        ci: persona?.ci || '-',
        celular: persona?.celular || '-',
        cargo: cargo?.cargo || '-',
        nivel: nivel
          ? `${nivel.categoria || ''} / Clase ${nivel.clase || ''} / Nivel ${nivel.nivel || ''}`
          : '-',
        sueldo: nivel?.sueldo ?? '-',
        regional: regional?.regional || '-',
        direccion: direccion?.direccion || '-',
        unidad: unidad?.unidadejecutora || '-',
        proceso: proceso?.proceso || '-',
        fuente: fuente?.fuente || '-',
        activo: Number(c.estado) === 1,
      }
    })
  }, [
    contratos, personas, cargos, niveles, regionales,
    direcciones, unidades, procesos, fuentes
  ])

  const resultados = filas.filter((f) => {
    const coincideEstado =
      tipoReporte === 'todos' ||
      (tipoReporte === 'activos' && f.activo) ||
      (tipoReporte === 'inactivos' && !f.activo)

    const coincideRegional =
      !regionalFiltro ||
      String(f.idregional) === String(regionalFiltro)

    const coincideCargo =
      !cargoFiltro ||
      String(f.idcargo) === String(cargoFiltro)

    const texto = [
      f.nombre, f.ci, f.numcontrato, f.cargo,
      f.regional, f.direccion, f.unidad
    ].join(' ').toLowerCase()

    const coincideBusqueda = texto.includes(busqueda.toLowerCase())

    return coincideEstado && coincideRegional &&
      coincideCargo && coincideBusqueda
  })

  const claseSelect = 'rounded-lg border border-slate-300 bg-white p-3'
  const claseInput = 'w-full rounded-lg border border-slate-300 p-3'

  return (
    <div className="mx-auto max-w-full space-y-6">

      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="text-2xl font-bold text-slate-800">
          Consultas y Reportes de Recursos Humanos
        </h2>
        <p className="mt-2 text-slate-500">
          Información integrada de contratos, personas y estructura institucional.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-slate-500">Personal activo</p>
          <p className="mt-2 text-3xl font-bold text-green-700">
            {filas.filter((f) => f.activo).length}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-slate-500">Personal inactivo</p>
          <p className="mt-2 text-3xl font-bold text-red-700">
            {filas.filter((f) => !f.activo).length}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-slate-500">Contratos registrados</p>
          <p className="mt-2 text-3xl font-bold text-blue-700">
            {contratos.length}
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold text-slate-800">
          Parámetros de consulta
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Tipo de reporte</label>
            <select
              value={tipoReporte}
              onChange={(e) => setTipoReporte(e.target.value)}
              className={claseInput}
            >
              <option value="activos">Personal activo</option>
              <option value="inactivos">Personal inactivo</option>
              <option value="todos">Todos los contratos</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Regional</label>
            <select
              value={regionalFiltro}
              onChange={(e) => setRegionalFiltro(e.target.value)}
              className={claseInput}
            >
              <option value="">Todas las regionales</option>
              {regionales.map((r) => (
                <option key={r.idregional} value={r.idregional}>
                  {r.regional}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Cargo</label>
            <select
              value={cargoFiltro}
              onChange={(e) => setCargoFiltro(e.target.value)}
              className={claseInput}
            >
              <option value="">Todos los cargos</option>
              {cargos.map((c) => (
                <option key={c.idcargo} value={c.idcargo}>
                  {c.cargo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Buscar</label>
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="CI, nombre o contrato..."
              className={claseInput}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600">
            Registros encontrados: <strong>{resultados.length}</strong>
          </p>

          <button
            onClick={() => {
              setBusqueda('')
              setRegionalFiltro('')
              setCargoFiltro('')
              setTipoReporte('activos')
            }}
            className="rounded-lg bg-slate-700 px-5 py-3 text-white hover:bg-slate-800"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold text-slate-800">
          Resultado de la consulta
        </h3>

        {mensaje && (
          <p className="mb-4 text-sm text-amber-700">{mensaje}</p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-700">
                {[
                  'CI', 'Funcionario', 'Celular', 'N.º contrato',
                  'Cargo', 'Nivel salarial', 'Sueldo',
                  'Regional', 'Dirección', 'Unidad ejecutora',
                  'Proceso', 'Fuente', 'Inicio', 'Fin', 'Estado'
                ].map((titulo) => (
                  <th key={titulo} className="whitespace-nowrap p-3">
                    {titulo}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {resultados.map((f) => (
                <tr key={f.idcontrato} className="border-b hover:bg-slate-50">
                  <td className="whitespace-nowrap p-3">{f.ci}</td>
                  <td className="whitespace-nowrap p-3">{f.nombre}</td>
                  <td className="whitespace-nowrap p-3">{f.celular}</td>
                  <td className="whitespace-nowrap p-3">{f.numcontrato || '-'}</td>
                  <td className="whitespace-nowrap p-3">{f.cargo}</td>
                  <td className="whitespace-nowrap p-3">{f.nivel}</td>
                  <td className="whitespace-nowrap p-3">
                    {f.sueldo === '-' ? '-' : `Bs. ${f.sueldo}`}
                  </td>
                  <td className="whitespace-nowrap p-3">{f.regional}</td>
                  <td className="whitespace-nowrap p-3">{f.direccion}</td>
                  <td className="whitespace-nowrap p-3">{f.unidad}</td>
                  <td className="whitespace-nowrap p-3">{f.proceso}</td>
                  <td className="whitespace-nowrap p-3">{f.fuente}</td>
                  <td className="whitespace-nowrap p-3">{f.fecha_ini}</td>
                  <td className="whitespace-nowrap p-3">{f.fecha_fin}</td>
                  <td className="whitespace-nowrap p-3">
                    <span className={f.activo
                      ? 'rounded-full bg-green-100 px-3 py-1 text-green-700'
                      : 'rounded-full bg-red-100 px-3 py-1 text-red-700'
                    }>
                      {f.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                </tr>
              ))}

              {resultados.length === 0 && (
                <tr>
                  <td colSpan="15" className="p-6 text-center text-slate-500">
                    No se encontraron registros para esta consulta.
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

export default Consultas