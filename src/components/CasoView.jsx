// src/components/CasoView.jsx
export default function CasoView() {
  return (
    <div>
      <h1 className="text-[26px] font-serif mb-4 text-gray-900">
        Caso de la semana
      </h1>
      <div className="bg-white rounded-lg border border-gray-200 p-10 text-center text-gray-400 text-sm max-w-lg">
        Aún no hay un caso real asignado a estas tres semanas. Cuando tengas
        uno verificado, agrégalo como <code>caso</code> dentro del archivo de
        datos de la semana correspondiente, siguiendo el mismo esquema que las
        demás secciones.
      </div>
    </div>
  );
}
