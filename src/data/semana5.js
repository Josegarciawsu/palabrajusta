// Contenido adaptado de NotasClase5.pdf, facilitado por José.
const term=(term,es,definition)=>({term,es,definition});
export const sections=[
  {title:'Ética y límites · Ethics and the interpreter’s role',terms:[
    term('Court interpreter','intérprete judicial','Facilita la comunicación entre la corte y quien no domina el idioma. Aconsejar, opinar o conciliar fuera de ese rol pone en riesgo la imparcialidad.'),
    term('Attorney / Witness / Mediator','abogado / testigo / mediador','El intérprete no da asesoría legal ni explica estrategias; no aporta hechos ni declara como testigo; tampoco negocia ni intenta resolver el conflicto entre las partes.'),
    term('Threat against the judge','amenaza contra el juez','Escenario A: durante la asignación se conoce una amenaza contra el juez. Respuesta indicada en clase: informarla de inmediato.'),
    term('Confidentiality','confidencialidad','Escenario B: se conoce el diagnóstico de una persona por una asignación anterior. Se mantiene confidencial; la interpretación actual debe ser precisa e imparcial.'),
    term('Utah Code of Professional Responsibility for Court Interpreters','Código de Responsabilidad Profesional para Intérpretes Judiciales de Utah','Las decisiones éticas se apoyan en el código, no en la intuición personal.'),
  ]},
  {title:'Traducción a la vista · Sight translation',terms:[
    term('Sight translation','traducción a la vista','Expresar oralmente, en otro idioma, el contenido de un documento escrito. Combina lectura, comprensión y producción oral casi al mismo tiempo.'),
    term('Preparation','preparación','Antes: leer el documento completo, identificar su propósito y buscar los términos desconocidos.'),
    term('Oral delivery','producción oral','Durante: mantener claridad, precisión, ritmo constante y tono natural.'),
    term('Request time to clarify terminology','solicitar tiempo para aclarar terminología','Si hace falta, pedir tiempo a la corte. No es una falla: protege la precisión de lo que quedará en el expediente.'),
  ]},
  {title:'Interpretación consecutiva · Consecutive interpreting',terms:[
    term('Consecutive interpreting','interpretación consecutiva','Escuchar, tomar notas si es necesario y después reproducir el mensaje en el otro idioma. El orador y el intérprete se turnan.'),
    term('Uses','usos','Testimonios, interrogatorios, respuestas del acusado y conversaciones entre abogado y cliente.'),
    term('Segments and pauses','segmentos y pausas','Pueden ser cortos o más largos. Si el segmento supera la capacidad de retención, solicitar una pausa para conservar la fidelidad.'),
    term('Simultaneous interpreting / Arguments','interpretación simultánea / alegatos','Los alegatos suelen ser discursos continuos sin pausas para dar turnos; por eso suelen interpretarse en simultánea.'),
  ]},
  {title:'Memoria, comprensión y notas · Memory, comprehension and note-taking',terms:[
    term('Interpreting process','proceso de interpretación','Escuchar → comprender → analizar → retener → reformular.'),
    term('Deverbalization','desverbalización','Conservar las ideas y sus relaciones en lugar de depender únicamente de las palabras exactas. Retener el sentido, no solo la forma.'),
    term('Notes','notas','Apoyan la memoria; no la sustituyen. Son especialmente útiles para nombres, fechas, cifras y secuencias.'),
    term('Gile’s Effort Model · Stage 1','modelo de esfuerzos de Gile · etapa 1','Esquema presentado en clase: escuchar y tomar notas.'),
    term('Gile’s Effort Model · Stage 2','modelo de esfuerzos de Gile · etapa 2','Leer las notas, recuperar la información y producir el mensaje.'),
  ]},
  {title:'Calidad y práctica · Delivery, accuracy and practice',terms:[
    term('Professional presence','presencia profesional','Transmitir seguridad sin distraer: postura profesional, voz clara, contacto visual adecuado y gestos moderados.'),
    term('Omissions / Meaning changes / False starts','omisiones / cambios de sentido / falsos comienzos','Evitar estos errores y las pausas excesivas.'),
    term('Record','acta / registro','La interpretación puede constar en acta; un error puede tener consecuencias importantes para el caso.'),
    term('Accuracy','precisión','Grabarse y revisar: ¿se transmitió todo el mensaje sin añadir ni quitar?'),
    term('Coherence','coherencia','¿Las ideas mantienen su relación lógica?'),
    term('Fluency','fluidez','¿El ritmo es natural, sin pausas ni arranques falsos?'),
  ]},
  {title:'Vocabulario para repasar · Glossary review',terms:[
    term('For the record','Para que conste en acta','Practica en voz alta en ambas direcciones.'),
    term('Strike that','Táchelo del acta','Expresión de repaso de clase.'),
    term('Earlier testimony','Declaración previa','Expresión de repaso de clase.'),
    term('Police report','Informe policial','Expresión de repaso de clase.'),
    term('Alleged assault','Presunta agresión','Expresión de repaso de clase.'),
    term('Preliminary hearing','Audiencia preliminar','Expresión de repaso de clase.'),
    term('In my own handwriting','De mi puño y letra','Expresión de repaso de clase.'),
    term('Emotionally unavailable','Emocionalmente ausente','Vocabulario general de repaso.'),
    term('Foreman','Capataz','Equivalencia incluida en los apuntes de clase.'),
    term('Drizzling','Lloviznando','Vocabulario general de repaso.'),
  ]},
];
export const selftest=[
  {question:'El acusado pregunta qué le conviene declarar. ¿Qué límite del rol está en juego?',answer:'El intérprete no es abogado: no da asesoría legal. Solo interpreta lo que se dice.'},
  {question:'¿Qué tres pasos conviene hacer antes de una traducción a la vista?',answer:'Leer el documento completo, identificar su propósito y buscar los términos desconocidos.'},
  {question:'El testigo habla demasiado tiempo y ya no puedes retenerlo todo. ¿Qué haces?',answer:'Solicitar una pausa para conservar la fidelidad del mensaje.'},
  {question:'¿Por qué los alegatos suelen interpretarse en simultánea?',answer:'Son discursos continuos que no se detienen para dar turnos.'},
  {question:'¿Qué significa desverbalizar?',answer:'Conservar las ideas y sus relaciones en lugar de depender de las palabras exactas.'},
  {question:'¿Qué información conviene anotar?',answer:'Nombres, fechas, cifras y secuencias.'},
  {question:'¿Por qué un falso comienzo o una omisión puede tener consecuencias importantes?',answer:'La interpretación puede constar en acta.'},
  {question:'Interpreta: “Strike that.” / “For the record.” / “In my own handwriting.”',answer:'Táchelo del acta. / Para que conste en acta. / De mi puño y letra.'},
];
