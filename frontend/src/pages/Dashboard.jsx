import { useEffect, useState } from 'react'
import Header from '../components/Header'
import ModuleCard from '../components/ModuleCard'
import Cargos from './Cargos'
import Personas from './Personas'
import { apiGet } from '../services/api'
import Contratos from './Contratos'
import Consultas from './Consultas'
import Grafico3D from '../components/Grafico3D'

function Dashboard() {
  const [cargos, setCargos] = useState([])
  const [personas, setPersonas] = useState([])
  const [contratos, setContratos] = useState([])
  const [regionales, setRegionales] = useState([])
  const [estado, setEstado] = useState('Conectando...')
  const [modulo, setModulo] = useState('')
  const personalPorRegional = regionales
  .filter((r) => r.regional !== 'EMPRESA EXTERNA')
  .map((r) => ({
    nombre: r.regional,
    cantidad: contratos.filter(
      (c) =>
        Number(c.estado) === 1 &&
        String(c.idregional) === String(r.idregional)
    ).length,
  }))

  useEffect(() => {
    Promise.all([
  apiGet('/cargos'),
  apiGet('/personas'),
  apiGet('/contratos'),
  apiGet('/regionales'),
])
      .then(([datosCargos, datosPersonas, datosContratos, datosRegionales]) => {
        setCargos(datosCargos)
        setPersonas(datosPersonas)
        setContratos(datosContratos)
        setRegionales(datosRegionales)
        setEstado('Conectado correctamente')
      })
      .catch(() => setEstado('Error de conexión'))
  }, [])

  if (modulo) {
    return (
      <div className="min-h-screen bg-slate-100 p-8">
        <button
          onClick={() => setModulo('')}
          className="mb-6 rounded-lg bg-slate-900 px-5 py-2 text-white"
        >
          Volver al panel
        </button>

        {modulo === 'cargos' && <Cargos />}
        {modulo === 'personas' && <Personas />}
        {modulo === 'contratos' && <Contratos />}
        {modulo === 'consultas' && <Consultas />}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <Header />

      <main className="mt-8">
        <h2 className="text-2xl font-semibold text-slate-800">
          Panel principal
        </h2>

        <p className="mt-4 text-sm text-slate-600">
          Estado del servidor: {estado}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <ModuleCard
              title="Personas"
              description={`Personas registradas: ${personas.length}`}
            />
            <button
              onClick={() => setModulo('personas')}
              className="mt-3 w-full rounded-lg bg-blue-700 p-3 text-white hover:bg-blue-800"
            >
              Abrir módulo de personas
            </button>
          </div>

          <div>
            <ModuleCard
              title="Cargos"
              description={`Cargos registrados: ${cargos.length}`}
            />
            <button
              onClick={() => setModulo('cargos')}
              className="mt-3 w-full rounded-lg bg-blue-700 p-3 text-white hover:bg-blue-800"
            >
              Abrir módulo de cargos
            </button>
          </div>

          <div>
  <ModuleCard
    title="Contratos"
    description={`Contratos registrados: ${contratos.length}`}
  />
  <button
    onClick={() => setModulo('contratos')}
    className="mt-3 w-full rounded-lg bg-blue-700 p-3 text-white hover:bg-blue-800"
  >
    Abrir módulo de contratos
  </button>
</div>
<div>
  <ModuleCard
    title="Consultas y Reportes"
    description="Consulta integrada del personal y contratos."
  />
  <button
    onClick={() => setModulo('consultas')}
    className="mt-3 w-full rounded-lg bg-blue-700 p-3 text-white hover:bg-blue-800"
  >
    Abrir módulo de consultas
  </button>
</div>
        </div>
        <div className="mt-8 rounded-xl bg-slate-900 p-6 shadow">
  <h2 className="mb-4 text-xl font-bold text-white">
    Estadísticas tridimensionales de Recursos Humanos
  </h2>

  <Grafico3D
    activos={contratos.filter(c => Number(c.estado) === 1).length}
    inactivos={contratos.filter(c => Number(c.estado) === 0).length}
    contratos={contratos.length}
  />
</div>
<div className="mt-8 rounded-xl bg-white p-6 shadow">
  <h2 className="mb-2 text-xl font-bold text-slate-800">
    Distribución de personal activo por regional
  </h2>

  <p className="mb-6 text-sm text-slate-500">
    Cantidad de funcionarios con contratos activos en cada regional.
  </p>

  <div className="space-y-4">
    {personalPorRegional.map((r) => (
      <div key={r.nombre}>
        <div className="mb-1 flex justify-between text-sm">
          <span className="font-medium text-slate-700">{r.nombre}</span>
          <span className="font-bold text-blue-700">{r.cantidad}</span>
        </div>

        <div className="h-4 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-600 transition-all"
            style={{
              width: `${
                Math.max(
                  ...personalPorRegional.map((item) => item.cantidad),
                  1
                ) === 0
                  ? 0
                  : (r.cantidad /
                      Math.max(
                        ...personalPorRegional.map((item) => item.cantidad),
                        1
                      )) * 100
              }%`,
            }}
          />
        </div>
      </div>
    ))}
  </div>
</div>
      </main>
    </div>
  )
}

export default Dashboard