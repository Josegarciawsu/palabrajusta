// semana3.js
// Estructura narrativa de la semana (títulos y explicaciones).
// Los términos viven en /content/glosario/semana3.json
// Las preguntas de autoevaluación viven en /content/preguntas/semana3.json

export default {
  "id": "semana3",
  "titulo": "Investigación, subpoenas, search warrants, juicio, plea agreements y jurisdicción estatal/federal",
  "fuente": "Notas de clase de José — Tercera Clase",
  "secciones": [
    {
      "id": "investigation-reports",
      "titulo": "Investigation Reports",
      "contenido": "Documentos que forman parte de una investigación y eventualmente pueden presentarse en corte, en materia civil o penal. \"Investigation\" es un umbrella term que incluye autopsias, informes de laboratorio, etc. Contenido típico: identidad y datos demográficos del sospechoso (DOB, seguro social, direcciones, altura, género, idiomas). Muchos reportes policiales están escritos en primera persona, como narración cronológica. Cada oficial redacta su propio reporte; en Utah se remiten a la fiscalía correspondiente (county o city attorney) para la decisión de presentar cargos."
    },
    {
      "id": "subpoenas",
      "titulo": "Subpoenas (Citaciones judiciales)",
      "contenido": "En Utah, las subpoenas civiles se rigen por la Utah Rule of Civil Procedure 45; las penales, por la Utah Rule of Criminal Procedure 14. Ordenan formalmente que una persona comparezca como testigo, bajo pena por incumplimiento. Subpoena ad testificandum exige testimonio oral; subpoena duces tecum exige documentos u otra evidencia tangible. Caso de referencia: United States v. Nixon (1974) — el privilegio ejecutivo no es absoluto frente a una subpoena penal legítima. El intérprete normalmente no está involucrado mientras el asunto es solo investigativo; una vez hay cargos formales, puede solicitarse una subpoena para documentos, incluso después de presentados los cargos o —de forma poco común— después de la sentencia (ej. buscando algún tipo de alivio/relief)."
    },
    {
      "id": "autenticacion",
      "titulo": "Autenticación y certificación de documentos",
      "contenido": "Autenticar es demostrar que un documento es lo que dice ser; certificar es la constancia formal emitida por el custodio de los registros. \"Lay the foundation\": establecer las bases necesarias para que una prueba sea admisible. Bajo la excepción de normal course of business, documentos generados en el curso normal de operaciones (ej. expedientes médicos) pueden presentarse sin que ello implique buscar procesar a alguien."
    },
    {
      "id": "mociones-evidencia",
      "titulo": "Mociones relacionadas con la evidencia",
      "contenido": "Motion in limine: solicitud previa al juicio para que el juez determine si cierta evidencia es admisible antes de que el jurado la escuche. Motion to admit evidence: solicitud para admitir formalmente una evidencia específica."
    },
    {
      "id": "search-warrants",
      "titulo": "Search Warrants (Órdenes de cateo / registro)",
      "contenido": "Directiva legal respaldada por causa probable, emitida por un juez, que autoriza arrestos, incautaciones o registros. Federal: Cuarta Enmienda. Utah: Utah Rule of Criminal Procedure 40 — requiere un affidavit con causa probable, describiendo con particularidad el lugar y los bienes a incautar. En público generalmente no se requiere warrant; en propiedad privada, sí. Partes esenciales: ubicación a registrar, lista de objetos, y el affidavit. Indicia of occupancy vincula a una persona con un lugar. Expectation of privacy determina si se requiere warrant o basta una subpoena (excepciones: revisiones migratorias/TSA, casilleros escolares). El affidavit puede ser oral (registrado) o escrito (sworn written statement); si la causa probable no consta en el affidavit, no cuenta — no puede completarse después. Concepto general de affidavit: declaración de hechos por escrito bajo juramento, firmada por el affiant, unilateral (a diferencia de la deposición, que permite cross-examination). No es exclusivo del ámbito policial. Vocabulario: affiant (declarante), jurat (bloque de certificación notarial), notarize (dar fe notarial). Affidavit vs. Declaration (28 U.S.C. § 1746): el affidavit requiere notario; la declaration no, basta la frase \"I declare under penalty of perjury...\" — más común en corte federal. Existe también el anticipatory search warrant, condicionado a un evento futuro."
    },
    {
      "id": "excepciones-warrant",
      "titulo": "Excepciones al requisito de search warrant",
      "contenido": "Consent: la persona autoriza voluntariamente el registro. Plain view: evidencia visible sin necesidad de ampliar el warrant. Olfato/K-9: un perro entrenado que alerta droga puede constituir causa probable, vinculado a la automobile exception (dada la movilidad del vehículo, no se requiere warrant previo si hay causa probable). Exigent circumstances: emergencia (riesgo de destrucción de evidencia, peligro para personas) exime del warrant previo. On the lam: estar huyendo de la justicia."
    },
    {
      "id": "exclusionary-rule",
      "titulo": "La regla de exclusión (Exclusionary Rule)",
      "contenido": "Construcción jurisprudencial, no un texto expreso de la Constitución, que protege: la Cuarta Enmienda (registros e incautaciones irrazonables), la Quinta Enmienda (autoincriminación), y la Sexta Enmienda (derecho a abogado y a confrontar al acusador). Si las autoridades violan estos derechos, la evidencia obtenida —y la derivada de ella— puede resultar inadmisible."
    },
    {
      "id": "standing",
      "titulo": "Standing to challenge",
      "contenido": "Para impugnar la validez de un registro o incautación, la persona debe tener standing: demostrar que sus propios derechos se vieron afectados directamente por la actuación cuestionada."
    },
    {
      "id": "transcripts-depositions",
      "titulo": "Court and Deposition Transcripts",
      "contenido": "Transcript: transcripción escrita palabra por palabra de un procedimiento judicial; en Utah se produce exclusivamente en inglés, y si se requiere por escrito debe solicitarse (generalmente con costo). Deposition: declaración bajo juramento fuera del tribunal, dentro de discovery, común en materia civil; el deponent presta juramento y ambas partes participan, incluyendo cross-examination. Cambiar una declaración posterior no constituye automáticamente perjurio — debe probarse intención. Preservation of testimony: usar la deposición para conservar un testimonio ante riesgo de que el testigo no pueda comparecer en juicio."
    },
    {
      "id": "impeachment-objections",
      "titulo": "Impeachment y objeciones durante una deposición",
      "contenido": "Impeach a witness significa cuestionar su credibilidad, no invalidar el testimonio automáticamente — mediante declaraciones previas inconsistentes, sesgo, contradicciones, o falta de verosimilitud. Fundamentos de objeción en deposición: relevance, privilege, form of the question, asked and answered, calls for speculation. El testigo usualmente sí contesta después de la objeción, salvo que la respuesta revele información privilegiada."
    },
    {
      "id": "sidebar",
      "titulo": "Sidebar (conferencia en el estrado)",
      "contenido": "Conversación breve entre juez y abogados, fuera del alcance del jurado, para tratar admisibilidad de prueba, objeciones complejas, o información perjudicial. Frase típica: \"May we approach the bench?\". No se usa específicamente por haber menores, aunque sí puede surgir si se discute si información sobre un menor es relevante al caso; la conversación normalmente sí queda registrada en el transcript aunque el jurado no la escuche."
    },
    {
      "id": "testigos-cooperantes",
      "titulo": "Testigos que cooperan con la fiscalía",
      "contenido": "Cooperating witness: aporta información para ayudar en una investigación o proceso penal; si está acusado, puede negociar reducción de cargos, recomendación de pena menor, o protección. La cooperación puede revelarse a la defensa porque afecta la credibilidad. El tribunal puede autorizar sealing, redaction, protective order, o witness protection. Turn state's evidence: cooperar declarando contra coacusados, documentado mediante cooperation agreement, plea agreement, o proffer agreement."
    },
    {
      "id": "documentos-acusacion",
      "titulo": "Documentos de acusación y procedimientos iniciales",
      "contenido": "Criminal complaint: documento que acusa a una persona de uno o más delitos (nombre, fecha, lugar, conducta, cargos, estatutos infringidos, causa probable); también puede presentarse como information o indictment. Initial appearance (Utah Rule of Criminal Procedure 7): se informan cargos y derechos, se considera libertad provisional. Arraignment (Rule 7A/10): audiencia distinta donde se presenta la declaración (guilty/not guilty/no contest) — no debe confundirse con la initial appearance. En casos menores ambas etapas pueden ocurrir en una sesión; en delitos graves, en sesiones separadas, con pasos adicionales como la preliminary hearing."
    },
    {
      "id": "plea-agreements",
      "titulo": "Plea Agreements (acuerdos de culpabilidad)",
      "contenido": "Plea bargaining: proceso de negociación entre fiscalía y defensa. Plea agreement: el acuerdo resultante. Change of plea hearing: audiencia donde se presenta el acuerdo al tribunal. El juez no participa en la negociación, pero debe decidir si acepta la declaración y el acuerdo, verificando que sea informada y voluntaria."
    },
    {
      "id": "civil-settlements",
      "titulo": "Civil Settlements y Waiver of Rights",
      "contenido": "Settlement: acuerdo para resolver una disputa civil sin llegar a juicio; no todo acuerdo debe presentarse al tribunal. Stipulation: constancia de que ambas partes están de acuerdo. Waiver: renuncia voluntaria a un derecho conocido; al declararse culpable, el acusado renuncia a juicio, a que se pruebe su culpabilidad, a confrontar testigos, a guardar silencio en juicio, y a presentar una defensa. El juez debe verificar que la declaración sea knowing, intelligent, voluntary, y sin coacción."
    },
    {
      "id": "derechos-victimas",
      "titulo": "Víctimas: declaraciones de impacto y derechos legales",
      "contenido": "Victim impact statement: declaración sobre cómo el delito afectó a la víctima (daño físico, emocional, económico); se presenta en sentencing, oral o por escrito. El juez no puede inventar cargos ni exceder límites legales basándose en ella. Victims' Rights Legislation (Utah Code § 77-38-4): derecho a notificación, a consultar con el fiscal, a expresar opinión sobre un plea agreement, y a presentar un impact statement — sin poder de veto sobre la decisión final. Procedural justice: la percepción de trato justo durante el proceso, más allá del resultado. Right of allocution: derecho del acusado a dirigirse al juez antes de la sentencia."
    },
    {
      "id": "factores-agravantes",
      "titulo": "Aggravating and Mitigating Factors",
      "contenido": "Aggravating factors: circunstancias que justifican una pena más severa (premeditación, vulnerabilidad de la víctima, uso de arma, liderazgo, antecedentes). Mitigating factors: circunstancias que respaldan una pena menos severa (participación limitada, ausencia de antecedentes, cooperación, potencial de rehabilitación). La juventud o poca experiencia no elimina automáticamente la responsabilidad."
    },
    {
      "id": "jurisdiccion-estatal-federal",
      "titulo": "Diferencia entre delito estatal y delito federal",
      "contenido": "Un mismo hecho puede violar simultáneamente ley estatal y federal, porque cada nivel de gobierno define sus delitos desde fuentes de poder distintas. La idea de que \"el federal siempre tiene precedencia\" debe matizarse: la Cláusula de Supremacía solo resuelve conflictos directos entre leyes, no decide quién procesa primero. La doctrina de la doble soberanía (Heath v. Alabama, 1985; Gamble v. United States, 2019) permite procesar el mismo hecho en ambos sistemas sin violar double jeopardy. En la práctica no hay regla de que el federal actúe primero — existe la \"Petite Policy\" del DOJ que desalienta la sucesión de procesos, y los fiscales suelen coordinar (jurisdicción concurrente). Ejemplo de clase: una persona en probation es hallada con una onza de anfetamina y una bala suelta; en Arizona la bala sola no es \"arma\" para efectos estatales, pero bajo 18 U.S.C. § 922(g) sí constituye munición suficiente para un cargo federal de felon in possession — permitiendo perseguir ambos cargos en jurisdicciones distintas para maximizar el tiempo de reclusión."
    }
  ],
  "apendiceTitulo": "Jerga callejera de cantidades (referencia para el intérprete)"
};
