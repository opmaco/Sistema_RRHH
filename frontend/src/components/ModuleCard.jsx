function ModuleCard({ title, description }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg">
      <h3 className="text-lg font-semibold text-slate-700">
        {title}
      </h3>

      <p className="mt-2 text-slate-500">
        {description}
      </p>
    </div>
  )
}

export default ModuleCard