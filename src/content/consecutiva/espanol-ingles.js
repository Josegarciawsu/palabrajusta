// EJERCICIOS ESPAÑOL → INGLÉS
// Marca de unidades: [[texto original|categoría|equivalencia 1; equivalencia 2]]
// En preguntas y respuestas, la pregunta del abogado va en "contexto":
// se muestra en pantalla, pero solo se interpreta la respuesta del testigo.

export default [
  {
    id: "es-en-01",
    direccion: "es-en",
    tema: "Penal",
    formato: "Testimonio narrativo",
    titulo: "Violencia doméstica: testimonio de la víctima",
    turnos: [
      {
        hablante: "N",
        texto:
          "Esa noche él llegó a la casa [[como a las once|num|around eleven; at about eleven o'clock; around eleven o'clock]], [[borracho|gv|drunk]] y de muy mal humor. Empezó a [[reclamarme|gv|complain to me; confront me; reproach me]] porque la cena estaba fría, y cuando le contesté, me [[aventó|slang|threw; shoved; pushed]] contra la pared. Yo nomás [[me quedé callada|idiom|kept quiet; stayed quiet; didn't say anything]] para no [[empeorar las cosas|idiom|make things worse]].",
      },
      {
        hablante: "N",
        texto:
          "Mi hijo de [[siete años|num|seven years old; seven-year-old]] estaba en la sala y lo vio todo. [[Pobrecito|reg|Poor thing; Poor kid; Poor little guy]], se puso a llorar y [[se escondió|gv|hid]] debajo de la mesa. Entonces agarré mi [[celular|gv|cell phone; phone]] y le marqué a mi hermana, porque [[la verdad|reg|honestly; to be honest; the truth is]] me daba miedo llamar a la policía.",
      },
      {
        hablante: "N",
        texto:
          "Mi hermana fue la que [[llamó al 911|num|called 911]]. Cuando llegaron los [[agentes|gv|officers; police officers]], él ya [[se había ido|gram|had left; had already left]]. Me tomaron fotos de los [[moretones|gv|bruises]] en los brazos y me explicaron cómo pedir una [[orden de protección|leg|protective order; protection order]]. Yo no quería que lo metieran a la cárcel, [[nada más quería|reg|I just wanted; all I wanted was]] que me dejara en paz.",
      },
    ],
  },
  {
    id: "es-en-02",
    direccion: "es-en",
    tema: "Civil",
    formato: "Preguntas y respuestas",
    titulo: "Demanda de desalojo",
    turnos: [
      {
        hablante: "R",
        contexto: "Attorney: When did you stop paying rent, and why?",
        texto:
          "Dejé de pagar la renta en [[junio|num|June]] porque el dueño [[nunca arregló|gram|never fixed; never repaired]] la calefacción. Le mandé [[tres mensajes|num|three messages; three texts]] y hasta le dejé una carta [[por escrito|gv|in writing]]. Durante todo el invierno mis hijos dormían con las [[chamarras|slang|jackets; coats]] puestas, y el más chico [[se enfermó de los pulmones|idiom|got a lung infection; got sick with a lung problem; developed a lung illness]].",
      },
      {
        hablante: "R",
        contexto: "Attorney: Did you put the rent money aside?",
        texto:
          "Sí, [[fíjese que|reg|actually; you see; as a matter of fact]] sí. Abrí una cuenta en el banco y ahí fui [[guardando|gv|saving; putting aside; setting aside]] el dinero cada mes. Ahorita tengo [[cuatro mil trescientos dólares|num|four thousand three hundred dollars; $4,300]]. Traigo los [[estados de cuenta|leg|bank statements; account statements]] en una [[carpeta|fc|folder]] para que el juez vea que no me estoy [[haciendo el tonto|idiom|playing dumb; trying to get away with anything]].",
      },
      {
        hablante: "R",
        contexto: "Attorney: Did the landlord ever respond?",
        texto:
          "Una sola vez. Me dijo que si no me gustaba, que [[me fuera|gram|I should leave; I could leave; I should move out]]. Luego, en [[octubre|num|October]], me llegó el [[aviso de desalojo|leg|eviction notice; notice to quit; notice to vacate]] pegado en la puerta. Yo no me niego a pagar, [[nomás|reg|I just; all I]] quiero que el departamento esté [[en condiciones para vivir|idiom|fit to live in; habitable; livable]].",
      },
    ],
  },
  {
    id: "es-en-03",
    direccion: "es-en",
    tema: "Familiar",
    formato: "Preguntas y respuestas",
    titulo: "Modificación de pensión alimenticia",
    turnos: [
      {
        hablante: "R",
        contexto: "Attorney: How much do you earn per month?",
        texto:
          "Trabajo en la construcción, pero no es un trabajo fijo. Hay meses que [[saco|slang|make; earn]] como [[tres mil dólares|num|three thousand dollars; $3,000]] y hay meses que casi no hay [[chamba|slang|work; jobs]]. En invierno [[se para todo|idiom|everything stops; work dries up; everything shuts down]] y a veces paso [[semanas enteras|mod|entire weeks; whole weeks]] sin trabajar.",
      },
      {
        hablante: "R",
        contexto: "Attorney: Have you been paying the child support ordered by the court?",
        texto:
          "He pagado [[lo que he podido|gram|what I could; whatever I could]]. No siempre la cantidad completa, eso sí lo [[reconozco|gv|admit; acknowledge]]. Pero nunca he dejado a mis hijos sin nada. Cuando no tengo para la [[pensión|fc|child support; support]], les compro zapatos, [[útiles escolares|gv|school supplies]] o lo que [[les haga falta|idiom|they need; they might need]].",
      },
      {
        hablante: "R",
        contexto: "Attorney: What are you asking the court to do today?",
        texto:
          "Le pido al juez que [[modifique|leg|modify]] la orden, porque la cantidad se calculó cuando yo tenía un trabajo [[de tiempo completo|gv|full-time]]. [[Ya no|gram|no longer; not anymore]] gano lo mismo. No quiero [[desentenderme|gv|walk away from; shirk my responsibilities to; wash my hands of]] de mis hijos, nada más quiero pagar algo que [[sí pueda cumplir|gram|I can actually afford; I can actually comply with; I can actually pay]].",
      },
    ],
  },
  {
    id: "es-en-04",
    direccion: "es-en",
    tema: "Juvenil",
    formato: "Testimonio narrativo",
    titulo: "Madre en audiencia por ausentismo escolar",
    turnos: [
      {
        hablante: "N",
        texto:
          "Señor juez, yo sé que mi hijo [[ha faltado mucho|mod|has missed a lot of school; has been absent a lot]] a la escuela, pero quiero que entienda nuestra situación. Yo trabajo [[dos turnos|num|two shifts]] en una fábrica y salgo de la casa a las [[cinco de la mañana|num|five in the morning; 5 a.m.; five a.m.]]. Él es el que [[se encarga de|gv|takes care of; is in charge of]] llevar a su hermanita a la guardería.",
      },
      {
        hablante: "N",
        texto:
          "Yo no sabía que se estaba [[juntando|gv|hanging out; associating]] con esos muchachos. Me enteré hasta que la escuela me mandó la [[citación|leg|summons; citation]]. [[Le juro|reg|I swear to you; I swear]] que desde entonces lo tengo [[cortito|slang|on a short leash; on a tight leash]], le quité el celular y ya no lo dejo salir [[entre semana|gv|on weekdays; during the week]].",
      },
      {
        hablante: "N",
        texto:
          "Lo que le pido es una [[oportunidad|gv|chance; opportunity]]. Si el tribunal nos puede ayudar con un programa de [[tutoría|gv|tutoring; mentoring]] o con un consejero, yo me comprometo a [[estar al pendiente|idiom|keep an eye on things; stay on top of it; keep a close eye on him]]. Mi hijo no es un mal muchacho, [[nomás anda perdido|idiom|he's just lost his way; he's just a bit lost; he's just going down the wrong path]].",
      },
    ],
  },
  {
    id: "es-en-05",
    direccion: "es-en",
    tema: "Penal",
    formato: "Mixto",
    titulo: "Testigo de un choque y fuga",
    turnos: [
      {
        hablante: "R",
        contexto: "Prosecutor: Where were you when the accident happened?",
        texto:
          "Yo estaba en la [[parada del camión|reg|bus stop]], esperando para irme al trabajo, [[como a las siete y media|num|around seven thirty; at about 7:30]]. De repente oí un [[rechinido de llantas|gv|screech of tires; squeal of tires]] y vi que una camioneta [[gris|gv|gray]] se pasó el [[alto|fc|stop sign]] y le pegó a un señor que iba en bicicleta.",
      },
      {
        hablante: "N",
        texto:
          "El señor [[salió volando|idiom|went flying; was thrown]] y cayó en la [[banqueta|slang|sidewalk]]. La camioneta [[ni siquiera frenó|mod|didn't even brake; didn't even slow down]], nomás siguió derecho. Yo corrí a ayudarle y le dije a una muchacha que llamara a una [[ambulancia|gv|ambulance]]. El señor estaba [[consciente|gv|conscious]], pero sangraba mucho de la cabeza.",
      },
      {
        hablante: "R",
        contexto: "Prosecutor: Did you see the license plate?",
        texto:
          "Nada más alcancé a ver [[los últimos tres números|num|the last three numbers; the last three digits]]: [[cuatro, ocho, dos|num|four, eight, two; 4-8-2; 482]]. Se los di a la policía [[en ese momento|gv|right then; at that moment; right away]]. Y luego, cuando me enseñaron las fotos, [[reconocí|gv|recognized]] la camioneta [[de inmediato|mod|immediately; right away]] porque tenía la [[defensa|fc|bumper]] de atrás amarrada con alambre.",
      },
    ],
  },
];
