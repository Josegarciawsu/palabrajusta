// semana2.js
// Estructura narrativa de la semana (títulos y explicaciones).
// Los términos viven en /content/glosario/semana2.json
// Las preguntas de autoevaluación viven en /content/preguntas/semana2.json

export default {
  "id": "semana2",
  "titulo": "Derecho Penal Sustantivo: Delitos contra las personas, la propiedad y el orden público",
  "fuente": "Notas de clase de José — Clase 2",
  "secciones": [
    {
      "id": "clasificacion-delitos",
      "titulo": "Clasificación general de los delitos",
      "contenido": "La idea general de crime es un daño a la sociedad. Se agrupan en cuatro categorías: delitos contra las personas (el daño no es necesariamente físico; incluye invasiones a la libertad personal como el secuestro), delitos contra la propiedad (trespassing, destruir o tomar un bien, vandalismo), delitos contra el orden público, y delitos de moralidad (categoría con debate social, como las drogas y la pornografía). En delitos como el homicidio o el robo hay una víctima específica; en el DUI se considera que toda la sociedad es \"víctima\" porque todos están en riesgo."
    },
    {
      "id": "homicidio-murder-manslaughter",
      "titulo": "Homicidio criminal: Murder y Manslaughter",
      "contenido": "Un intentional criminal homicide es la muerte ilegal de un ser humano con un estado mental purposely o knowingly. La legítima defensa y las ejecuciones ordenadas por el Estado no constituyen delito. Utah NO organiza el homicidio en \"primer/segundo grado\" como se enseña en el marco general: su estructura real es Aggravated murder (delito capital) > Murder (felonía de primer grado) > Manslaughter (felonía de segundo grado) > Negligent homicide (delito menor clase A). El razonamiento de premeditación del marco general sigue siendo válido: la pregunta clave para \"primer grado\" es si hubo oportunidad de reflexionar entre la intención y el acto."
    },
    {
      "id": "manslaughter-felony-murder",
      "titulo": "Voluntary/Involuntary Manslaughter y Felony Murder Rule",
      "contenido": "Voluntary manslaughter (heat of passion): homicidio intencional bajo provocación adecuada, sin tiempo para \"enfriarse\" (ej. road rage). Involuntary manslaughter: homicidio no intencional por recklessly (ignorar conscientemente un riesgo conocido) o negligence (fallar en percibir un riesgo que debió percibirse). El motivo generalmente no es relevante para la culpabilidad, solo para la sentencia. Felony murder rule: si alguien muere durante un delito inherentemente peligroso, el responsable puede cargarse automáticamente con murder, incluso sin intención directa de matar."
    },
    {
      "id": "rape-sexual-assault",
      "titulo": "Rape y Sexual Assault",
      "contenido": "Rape es una categoría dentro de sexual assault. Sexual assault tiene una definición más amplia: incluye penetración, contacto con los genitales, y sexo oral. Elementos: relación sexual lograda mediante fuerza, amenaza de fuerza, o fraude. Fraud in the factum (engaño sobre la naturaleza del acto) sí anula el consentimiento; fraud in the inducement (mentir para persuadir) generalmente no lo anula. El statute of limitations generalmente no aplica o se extiende en abuso sexual infantil. En Utah, la edad de consentimiento es 18 años, con una excepción de cercanía de edad: un menor de 16-17 años puede consentir con alguien hasta 7 años mayor (hasta 10 si no hubo forma razonable de conocer su edad) — un rango comparativamente amplio frente a otros estados (2-4 años). El consentimiento, y su retiro, no necesitan ser verbales."
    },
    {
      "id": "assault-battery",
      "titulo": "Assault y Battery",
      "contenido": "Battery requiere contacto físico dañino u ofensivo y no consentido. Assault es generar temor de ese contacto, sin que ocurra. En Utah, assault y battery se tratan como el mismo cargo (a diferencia de otros estados, como Arizona, que los gradúan en tres niveles). Ambos son también un tort civil. Tipos de contacto: directo, constructive touching (indirecto), y offensive contact (basta con ofender, como escupir). Aggravated battery: uso de arma mortal (incluso un auto) o lesión grave. Agredir a un oficial de policía es automáticamente agravado; en Arizona esto también aplica a fiscales actuando en su capacidad oficial. Dos tipos de assault: attempted battery (se intentó el contacto, no se logró) y threatened battery (poner en temor de lesión inminente). Algunos estados (California) usan \"mayhem\" para batteries agravados con lesión grave."
    },
    {
      "id": "kidnapping",
      "titulo": "Kidnapping y False Imprisonment",
      "contenido": "Kidnapping: elemento clave es si se movió a la persona a un lugar donde no quería ir; el movimiento debe ser significativo aunque la distancia no lo sea. False imprisonment: retener a alguien contra su voluntad, sin trasladarla — a diferencia del kidnapping, no hay movimiento."
    },
    {
      "id": "theft-larceny",
      "titulo": "Theft, Larceny, Embezzlement, Conversion y False Pretenses",
      "contenido": "Hurto (larceny): tomar y quedarse con algo en posesión de otro. Si el mecanismo usado fue malversación (embezzlement), no se puede acusar adicionalmente de hurto por los mismos hechos — se consolidan bajo la categoría general de theft (hurto en sentido general, sin uso de fuerza contra la víctima). No devolver una propiedad perdida cuyo dueño es identificable constituye apropiación indebida (wrongful taking) — ej. una cartera con identificación, o un objeto de valor perdido en una tienda con cámaras. Malversación (embezzlement): apropiarse indebidamente de bienes bajo custodia legítima. Apropiación ilícita (conversion): ejercer sobre un bien un derecho de control incompatible con los términos bajo los que se recibió — ej. rehusarse a devolver un auto rentado. False pretenses: mentir sobre un hecho material (no solo relevante) para que alguien ceda voluntariamente un bien. Estas categorías se consolidan bajo theft para no dejar que la calificación técnica del mecanismo sea un obstáculo procesal."
    },
    {
      "id": "robbery",
      "titulo": "Robbery (robo con violencia o intimidación)",
      "contenido": "Robo (robbery): toma de propiedad mediante fuerza o temor, en presencia de la víctima; siempre implica violencia o intimidación, a diferencia del hurto. En Utah, la terminología exacta es aggravated robbery (arma peligrosa o lesión grave — equivalente al \"primer grado\" enseñado en clase) y robbery (sin esas circunstancias — \"segundo grado\"). Lo que importa es lo que la víctima cree: un arma simulada (simulated weapon) puede ser suficiente para elevar el cargo, aunque el arma sea falsa."
    },
    {
      "id": "burglary",
      "titulo": "Burglary (allanamiento con intención delictiva)",
      "contenido": "Uno de los términos más malentendidos: coloquialmente se confunde con \"robo\". Elementos: entrar o permanecer sin autorización en una estructura, con la intención de cometer un delito (no necesariamente robo). El elemento central es la intención al momento de entrar — el burglary se configura desde ese momento, aunque el delito planeado no se consume. Entrar sin intención de cometer un delito adicional es solo trespassing (allanamiento simple), no burglary."
    },
    {
      "id": "forgery-uttering",
      "titulo": "Forgery y Uttering",
      "contenido": "Forgery (falsificación): alteración material no autorizada de un documento con relevancia legal. Uttering: el paso posterior — poseer o intentar hacer circular el documento falsificado como legítimo."
    },
    {
      "id": "arson",
      "titulo": "Arson (incendio provocado)",
      "contenido": "El único delito contra la propiedad que puede cometerse sobre la propia propiedad. Requiere el incendio ilegal de una estructura. Clasificación: primer grado (estructura habitada), segundo grado (no habitada). Bajo la ley de Utah, quemar prácticamente cualquier estructura puede configurar arson."
    },
    {
      "id": "disorderly-conduct",
      "titulo": "Disorderly Conduct y Fighting Words",
      "contenido": "Disorderly conduct: conducta que genera inconveniente, molestia o alarma pública — categoría muy amplia. Fighting words: palabras que por su sola expresión incitan una ruptura inmediata de la paz. El discurso de odio dirigido a una persona específica puede considerarse fighting words; el discurso general (no dirigido) tiende a protegerse como libertad de expresión. Se espera que la policía ejerza mayor autocontrol frente a estas provocaciones que un ciudadano común."
    },
    {
      "id": "dui",
      "titulo": "Driving Under the Influence (DUI)",
      "contenido": "En Utah, el límite legal de BAC es 0.05% — el más bajo de EE. UU. (desde el 30 de diciembre de 2018; la mayoría de estados usa 0.08%). Estar por encima constituye DUI independientemente de si se conduce bien (límite per se). Los medicamentos recetados también pueden dar lugar a DUI. La definición de \"motor vehicle\" puede ser amplia (scooters, incluso caballos en algunos estados). Pruebas: field sobriety test, portable breath test, y HGN (Horizontal Gaze Nystagmus) — el oficial observa el movimiento involuntario del ojo, incluyendo a 45 grados, como señal de intoxicación."
    },
    {
      "id": "drogas",
      "titulo": "Drogas y sustancias controladas",
      "contenido": "Una sustancia controlada es una droga con efecto físico o psicotrópico que cae bajo el ámbito de la ley penal. Existe alto grado de uniformidad entre leyes estatales, en parte por incentivos federales. Drug paraphernalia: categoría amplia que abarca objetos relacionados con el consumo, preparación o uso de una droga; la fiscalía debe sustentar caso por caso que el objeto se relaciona razonablemente con esa actividad ilegal."
    },
    {
      "id": "prostitution-pandering",
      "titulo": "Prostitution y Pandering",
      "contenido": "Prostitution: involucrarse en, u ofrecer realizar, un acto sexual a cambio de algo de valor. Pandering: organizar o facilitar que otra persona se involucre en un acto sexual a cambio de algo de valor; el tráfico sexual humano se considera una forma de pandering. Debate de clase: dónde radica el daño en la prostitución, dentro del marco de \"morality crime\" — un argumento mencionado es que la criminalización deja a quienes ejercen la prostitución sin las mismas protecciones legales frente a robo o agresión."
    }
  ],
  "apendiceTitulo": null
};
