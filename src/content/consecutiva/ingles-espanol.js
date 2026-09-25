// EJERCICIOS INGLÉS → ESPAÑOL
// Marca de unidades: [[texto original|categoría|equivalencia 1; equivalencia 2]]
// hablante: "P" pregunta, "R" respuesta, "N" testimonio narrativo
// contexto (opcional): texto que se muestra pero no se interpreta.

export default [
  {
    id: "en-es-01",
    direccion: "en-es",
    tema: "Penal",
    formato: "Preguntas y respuestas",
    titulo: "Robo en una tienda de conveniencia",
    turnos: [
      {
        hablante: "P",
        texto:
          "Ms. Carter, I want to take you back to the night of [[March 3rd|num|3 de marzo; tres de marzo]]. You were working the [[graveyard shift|idiom|turno de noche; turno nocturno; turno de madrugada]] at the Quick Stop on Redwood Road, [[weren't you|pos|¿no es así?; ¿verdad?; ¿no?]]? Tell the jury, in your own words, what happened when the man [[walked in|gv|entró]] [[a little after two in the morning|num|poco después de las dos de la mañana; un poco después de las dos de la madrugada]] and approached the [[counter|gv|mostrador]].",
      },
      {
        hablante: "R",
        texto:
          "Well, he had his [[hood|gv|capucha]] up, so I couldn't really see his face. He [[pulled out|gv|sacó]] what looked like a gun and told me to [[empty the register|idiom|vaciar la caja registradora; vaciar la caja]]. I was [[scared to death|mod|muerta de miedo; aterrorizada]], so I just did what he said. Then he [[took off|slang|se fue corriendo; salió huyendo; se echó a correr; se largó]] toward the [[parking lot|gv|estacionamiento; parqueadero; aparcamiento]].",
      },
      {
        hablante: "P",
        texto:
          "Did you [[at any point|pos|en algún momento]] see the weapon clearly? And after he left, did you [[call 911|num|llamar al 911; marcar al 911]] right away, or did you wait? Please take your time. The defense has suggested that you [[picked out|idiom|identificó; escogió; señaló]] the wrong man in the [[photo lineup|leg|rueda de reconocimiento fotográfico; identificación por fotografías; rueda de fotos]], so I need you to be [[as precise as possible|mod|lo más precisa posible; lo más precisa que pueda]].",
      },
    ],
  },
  {
    id: "en-es-02",
    direccion: "en-es",
    tema: "Civil",
    formato: "Testimonio narrativo",
    titulo: "Demanda por accidente de tránsito",
    turnos: [
      {
        hablante: "N",
        texto:
          "I was driving home from work on [[Interstate 15|num|la Interestatal 15; la I-15; la carretera interestatal 15]], going about [[sixty-five miles per hour|num|sesenta y cinco millas por hora; 65 millas por hora]], when the truck in front of me [[slammed on the brakes|idiom|frenó de golpe; frenó en seco; pisó el freno de golpe]]. I tried to [[swerve|gv|dar un volantazo; virar bruscamente; esquivar]] into the left lane, but the [[defendant|leg|demandado]] was already in that lane, and he [[rear-ended|gv|chocó por detrás; me pegó por detrás; me chocó por atrás]] me.",
      },
      {
        hablante: "N",
        texto:
          "The [[impact|gv|impacto; golpe]] threw me forward and I [[hit my head|gv|me pegué en la cabeza; me golpeé la cabeza]] on the steering wheel. I was taken by ambulance to the [[emergency room|gv|sala de emergencias; sala de urgencias]], where they told me I had a [[concussion|gv|conmoción cerebral; contusión cerebral]] and two [[herniated discs|gv|hernias discales; discos herniados]] in my lower back. I [[was out of work|idiom|estuve sin trabajar; no pude trabajar; estuve incapacitado]] for almost three months.",
      },
      {
        hablante: "N",
        texto:
          "I'm asking for [[damages|leg|daños y perjuicios; indemnización por daños]] because my [[medical bills|gv|facturas médicas; cuentas médicas; gastos médicos]] came to more than [[forty-two thousand dollars|num|cuarenta y dos mil dólares; 42,000 dólares]]. His insurance company offered to [[settle|leg|llegar a un acuerdo; conciliar; transigir]] for a fraction of that, which, [[frankly|mod|francamente; sinceramente]], felt like [[a slap in the face|idiom|una bofetada; un insulto; una cachetada]].",
      },
    ],
  },
  {
    id: "en-es-03",
    direccion: "en-es",
    tema: "Familiar",
    formato: "Preguntas y respuestas",
    titulo: "Audiencia de custodia",
    turnos: [
      {
        hablante: "P",
        texto:
          "[[Mrs. Delgado|num|señora Delgado]], you're asking the court for [[sole physical custody|leg|custodia física exclusiva; custodia física única]] of your two children. Can you explain to the judge why you believe the current [[joint custody|leg|custodia compartida; custodia conjunta]] arrangement [[isn't working|gv|no está funcionando; no funciona]]? Please [[be specific|mod|sea específica; dé detalles concretos]] about the [[pick-ups and drop-offs|gv|recogidas y entregas; entregas y recogidas de los niños]].",
      },
      {
        hablante: "R",
        texto:
          "Honestly, it's been [[a nightmare|idiom|una pesadilla]]. Their father shows up [[an hour late|num|una hora tarde; con una hora de retraso]] half the time, and [[twice|num|dos veces]] last month he didn't show up at all. The kids sit by the window waiting for him. My daughter [[cries herself to sleep|idiom|llora hasta quedarse dormida; se duerme llorando]] and my son [[has been acting out|gv|se ha estado portando mal; ha tenido problemas de conducta]] at school.",
      },
      {
        hablante: "P",
        texto:
          "I understand. Now, the opposing party has filed a [[motion|leg|moción; petición]] claiming that you have [[interfered with|gv|interferido con; obstaculizado]] his [[parenting time|leg|tiempo de crianza; tiempo de convivencia; régimen de visitas]]. [[Is that true|pos|¿Es cierto?; ¿Es verdad?]]? Have you ever refused to let him see the children, [[even once|mod|aunque sea una vez; ni una sola vez; siquiera una vez]]?",
      },
    ],
  },
  {
    id: "en-es-04",
    direccion: "en-es",
    tema: "Juvenil",
    formato: "Testimonio narrativo",
    titulo: "Informe del oficial de libertad condicional",
    turnos: [
      {
        hablante: "N",
        texto:
          "Your Honor, Daniel has been on [[formal probation|leg|libertad condicional formal; libertad a prueba formal]] for six months following his [[adjudication|leg|adjudicación; declaración de responsabilidad]] for [[shoplifting|leg|hurto en tienda; robo en tienda]]. [[Overall|mod|En general]], he's made progress. He completed his [[community service hours|leg|horas de servicio comunitario]] ahead of schedule and has [[stayed out of trouble|idiom|no se ha metido en problemas; se ha mantenido alejado de problemas]].",
      },
      {
        hablante: "N",
        texto:
          "[[However|pos|Sin embargo; No obstante]], I do have some concerns. His school reports [[fourteen unexcused absences|num|catorce faltas injustificadas; catorce ausencias injustificadas; 14 faltas injustificadas]] this semester, and he tested positive for [[marijuana|gv|marihuana]] on [[September 9th|num|9 de septiembre; nueve de septiembre]]. When I asked him about it, he [[shrugged it off|idiom|le restó importancia; no le dio importancia]] and said everybody does it.",
      },
      {
        hablante: "N",
        texto:
          "My recommendation is that the court [[extend|leg|extienda; prorrogue]] probation for an additional ninety days, order a [[substance abuse assessment|leg|evaluación de abuso de sustancias; evaluación por consumo de sustancias]], and set a [[review hearing|leg|audiencia de revisión; audiencia de seguimiento]] in December. I believe Daniel can [[turn things around|idiom|cambiar su situación; enderezar su camino; salir adelante]], but he needs more structure at home.",
      },
    ],
  },
  {
    id: "en-es-05",
    direccion: "en-es",
    tema: "Penal",
    formato: "Mixto",
    titulo: "Contrainterrogatorio en un caso de DUI",
    turnos: [
      {
        hablante: "P",
        texto:
          "Officer Jensen, you testified that you [[pulled over|gv|detuvo; paró; le marcó el alto a]] my client for [[weaving|gv|zigzaguear; ir zigzagueando; cambiar de carril erráticamente]] between lanes. But [[isn't it true|pos|¿no es cierto que; ¿no es verdad que]] that it was raining heavily that night and visibility was poor? And you never actually [[clocked|gv|midió la velocidad de; registró la velocidad de]] his speed, [[did you|pos|¿verdad?; ¿no es así?]]?",
      },
      {
        hablante: "R",
        texto:
          "That's correct, I didn't [[run radar|leg|usar el radar; medir con radar]] on him. But when I [[approached the vehicle|gv|me acerqué al vehículo]], I noticed a [[strong odor|mod|fuerte olor; olor intenso]] of alcohol, his eyes were [[bloodshot|gv|enrojecidos; inyectados de sangre]], and his speech was [[slurred|gv|arrastrada; balbuceante]]. He also had an [[open container|leg|envase abierto; recipiente abierto]] on the passenger seat.",
      },
      {
        hablante: "R",
        texto:
          "I then administered the [[standardized field sobriety tests|leg|pruebas estandarizadas de sobriedad en campo; pruebas estandarizadas de sobriedad]]. He showed [[six out of six clues|num|seis de seis indicadores; seis de las seis pistas; seis de seis señales]] on the [[horizontal gaze nystagmus|leg|nistagmo horizontal; nistagmo de mirada horizontal]] test and [[lost his balance|gv|perdió el equilibrio]] twice on the walk-and-turn. His [[breath test|leg|prueba de aliento; prueba de alcohol en el aliento]] came back at [[point one four|num|0.14; punto catorce; cero punto catorce]].",
      },
    ],
  },
];
