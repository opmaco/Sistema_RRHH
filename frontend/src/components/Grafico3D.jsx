import { Canvas } from '@react-three/fiber'
import { OrbitControls, Float, Text } from '@react-three/drei'

function Barra3D({ posicion, altura, color, etiqueta }) {
  return (
    <group position={posicion}>
      <Float speed={1.5} floatIntensity={0.15}>
        <mesh position={[0, altura / 2, 0]}>
          <boxGeometry args={[0.8, altura, 0.8]} />
          <meshStandardMaterial color={color} metalness={0.4} roughness={0.3} />
        </mesh>
      </Float>

      <Text
        position={[0, altura + 0.35, 0]}
        fontSize={0.18}
        color="white"
        anchorX="center"
      >
        {etiqueta}
      </Text>
    </group>
  )
}

function Grafico3D({ activos = 0, inactivos = 0, contratos = 0 }) {
  const maximo = Math.max(activos, inactivos, contratos, 1)

  const escala = (valor) => Math.max((valor / maximo) * 2.5, 0.15)

  return (
    <div className="h-[350px] w-full overflow-hidden rounded-xl bg-slate-950">
      <Canvas camera={{ position: [5, 4, 7], fov: 45 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 8, 5]} intensity={2} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
          <planeGeometry args={[10, 6]} />
          <meshStandardMaterial color="#172554" />
        </mesh>

        <Barra3D
          posicion={[-2, 0, 0]}
          altura={escala(activos)}
          color="#22c55e"
          etiqueta={`Activos: ${activos}`}
        />

        <Barra3D
          posicion={[0, 0, 0]}
          altura={escala(inactivos)}
          color="#ef4444"
          etiqueta={`Inactivos: ${inactivos}`}
        />

        <Barra3D
          posicion={[2, 0, 0]}
          altura={escala(contratos)}
          color="#38bdf8"
          etiqueta={`Contratos: ${contratos}`}
        />

        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  )
}

export default Grafico3D