# Práctica judicial evaluada

Acceso: menú «Práctica de interpretación» → «Abrir práctica judicial».
24 turnos ficticios de una reunión con defensor público. Dirección completa, inglés-español o español-inglés. Práctica con feedback o simulación sin ayudas hasta el final.

La grabación usa MediaRecorder. La transcripción usa SpeechRecognition cuando el navegador la ofrece; puede enviar voz al proveedor del navegador. Sin soporte, se escribe la interpretación después de escuchar la grabación. El audio es temporal y se elimina al avanzar. El historial de texto y resultados se guarda solo en este dispositivo, en pj-judicial-attempts-v1.

La evaluación es por reglas curadas, no por IA semántica ni rúbrica oficial. Las equivalencias detectadas son preliminares y requieren contexto; las no reconocidas quedan pendientes, no se califican automáticamente como omisiones. El usuario puede confirmar correcto, omisión o cambio de sentido. Los cambios críticos se muestran por separado. Rúbrica propia: jurídico 60%, sentido 30%, fluidez 10% autocalificada; la nota automática normaliza los primeros dos criterios. No mide pronunciación ni fidelidad completa fuera de las unidades marcadas.

Contenido: src/content/consecutiva/consulta.js.
Unidades, equivalencias y puntuación: src/lib/consecutiva/judicial.js.
Interfaz: src/components/Consecutiva/JudicialTrainer.jsx.
Pruebas: node tests/judicial.test.mjs.
Compilación: npm run build.
