import { useState, useMemo } from "react";

// ---- Design tokens: clean, accessible learning interface ----
const C = {
  bg: "#f3f6fb",
  card: "#ffffff",
  border: "#dfe5ef",
  text: "#132238",
  muted: "#5d6b7e",
  label: "#8b98aa",
  accent: "#2563eb",
  navy: "#0b1730",
  sky: "#eaf1ff",
};

const serif = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const sans = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const brand = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

const LOGO_URI = "data:image/png;base64,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";


const WEEKS = Array.from({ length: 8 }, (_, i) => i + 1);

// Contenido real de la Clase 1 (Utah Court Interpreting - Class 1 Study Guide)
const WEEK1_SECTIONS = [
  {
    title: "Judicial purpose and interpretation theory",
    terms: [
      {
        term: "Procedural fairness / procedural justice",
        es: "justicia o equidad procesal",
        definition:
          "The perception and reality that legal procedures are neutral, respectful, transparent, and consistently applied. It concerns the fairness of the process, not merely who wins.",
      },
      {
        term: "Accountability",
        es: "rendición de cuentas / responsabilidad",
        definition:
          "The obligation of courts and public officials to explain decisions, follow rules, and answer for their conduct.",
      },
      {
        term: "Judicial Council",
        es: "Consejo Judicial",
        definition:
          "A policymaking and administrative body responsible for specified governance and administrative functions within a judicial system. In Utah, exercises authority assigned by the Utah Constitution, statutes, and the Code of Judicial Administration.",
      },
      {
        term: "Translation theory",
        es: "teoría de la traducción e interpretación",
        definition:
          "The study of how meaning, intent, register, culture, and function are transferred from a source language to a target language. Court interpreting prioritizes complete, accurate, impartial transfer of meaning.",
      },
    ],
  },
  {
    title: "Core modes / Modalidades principales",
    terms: [
      {
        term: "Simultaneous interpreting",
        es: "interpretación simultánea",
        definition:
          "The interpreter renders the message while the speaker continues speaking, usually with a short delay. Common for proceedings addressed to an LEP defendant.",
      },
      {
        term: "Consecutive interpreting",
        es: "interpretación consecutiva",
        definition:
          "The speaker pauses after segments so the interpreter can reproduce the complete message. Common for witness testimony and attorney-client exchanges.",
      },
      {
        term: "Sight translation",
        es: "traducción a la vista",
        definition:
          "The oral rendering of a written document from one language into another. It is interpretation of written text, not a written translation.",
      },
    ],
  },
  {
    title: "Foundations: law, crimes, custody, and consequences",
    terms: [
      {
        term: "Crime",
        es: "delito",
        definition:
          "An act or omission prohibited by criminal law and punishable by the government. A prosecutor files the case on behalf of the state or United States.",
      },
      {
        term: "Criminal law",
        es: "derecho penal",
        definition:
          "Law governing offenses against the public. The government prosecutes and must prove guilt beyond a reasonable doubt at trial.",
      },
      {
        term: "Civil law",
        es: "derecho civil",
        definition:
          "Law governing private disputes, such as contracts, injuries, divorce, or debt. A plaintiff initiates the action and ordinarily seeks money or another civil remedy.",
      },
      {
        term: "Incarceration",
        es: "encarcelamiento / reclusión",
        definition:
          "The general state of confinement in jail or prison. Jail commonly holds people pretrial or serving shorter sentences; prison commonly holds people serving longer sentences after conviction.",
      },
      {
        term: "Flight risk",
        es: "riesgo de fuga",
        definition:
          "The risk that a defendant will fail to appear for required court proceedings or otherwise evade the court's jurisdiction.",
      },
      {
        term: "Probation",
        es: "libertad condicional bajo supervisión",
        definition:
          "A sentence or disposition allowing a person to remain in the community subject to court-ordered conditions and supervision. Violations may lead to sanctions or revocation.",
      },
      {
        term: "Garnishment",
        es: "embargo de salario o fondos",
        definition:
          "A civil enforcement process ordering an employer or financial institution to withhold money to satisfy a judgment.",
      },
    ],
  },
  {
    title: "Standards and burdens of proof",
    terms: [
      {
        term: "Burden of proof",
        es: "carga de la prueba",
        definition:
          "The responsibility to prove disputed facts. In a criminal trial, the prosecution bears the burden; the defendant does not have to prove innocence.",
      },
      {
        term: "Beyond a reasonable doubt",
        es: "más allá de toda duda razonable",
        definition:
          "The highest ordinary standard of proof, required for a criminal conviction. It is not proof beyond every imaginable doubt.",
      },
      {
        term: "Preponderance of the evidence",
        es: "preponderancia de la prueba",
        definition:
          "The usual civil standard: a fact is more likely true than not true. \u201c51%\u201d is a teaching shortcut, not a literal calculation required of jurors.",
      },
      {
        term: "Probable cause",
        es: "causa probable",
        definition:
          "A relatively low threshold requiring facts that support a reasonable belief that a crime was committed and that the accused committed it. It is not the trial standard.",
      },
      {
        term: "Proximate cause",
        es: "causa próxima",
        definition:
          "A civil causation concept connecting conduct to a legally attributable harm. Asks whether the conduct was sufficiently connected to the injury, including foreseeability.",
      },
      {
        term: "Acquittal",
        es: "absolución",
        definition:
          "A judgment or verdict of not guilty. It establishes that criminal liability was not proven beyond a reasonable doubt; it does not necessarily constitute an affirmative finding of factual innocence.",
      },
    ],
  },
  {
    title: "Resolving cases without trial",
    terms: [
      {
        term: "Plea bargaining",
        es: "negociación de culpabilidad / negociación de una declaración",
        definition:
          "Negotiations in a criminal case that may produce a plea agreement, such as a plea to reduced charges or a sentencing recommendation.",
      },
      {
        term: "Plea agreement",
        es: "acuerdo de culpabilidad / acuerdo de declaración",
        definition:
          "The resulting criminal agreement. The judge must determine whether to accept a plea and ensure it is knowing and voluntary.",
      },
      {
        term: "Settlement",
        es: "acuerdo extrajudicial / convenio",
        definition:
          "A negotiated resolution of a civil dispute, often involving payment, release of claims, or other terms.",
      },
    ],
  },
  {
    title: "State court, federal court, and jurisdiction",
    terms: [
      {
        term: "Jurisdiction",
        es: "jurisdicción / competencia",
        definition:
          "A court's legal authority over the subject matter, the parties, and the geographic location connected to a case.",
      },
      {
        term: "Federal jurisdiction",
        es: "jurisdicción federal",
        definition:
          "Authority based on the U.S. Constitution and federal statutes. Federal courts are courts of limited subject-matter jurisdiction.",
      },
      {
        term: "State jurisdiction",
        es: "jurisdicción estatal",
        definition:
          "Authority of state courts over matters governed primarily by state law. State trial courts may be courts of general or limited jurisdiction.",
      },
      {
        term: "Court of limited jurisdiction",
        es: "tribunal de jurisdicción limitada",
        definition:
          "A court authorized to hear only specified categories or lower-level cases, such as many justice or municipal courts.",
      },
    ],
  },
  {
    title: "Courtroom actors",
    terms: [
      {
        term: "Judge",
        es: "juez/jueza",
        definition:
          "Neutral judicial officer who rules on law and admissibility, manages proceedings, instructs the jury, and adjudicates a bench trial.",
      },
      {
        term: "Jury",
        es: "jurado",
        definition:
          "Fact finder that evaluates admitted evidence and returns a verdict when the right to jury trial applies and is not waived.",
      },
      {
        term: "Prosecutor",
        es: "fiscal",
        definition:
          "Government attorney representing the state or United States \u2014 not the victim's personal attorney.",
      },
      {
        term: "Defense attorney",
        es: "abogado defensor",
        definition:
          "Represents the accused, protects constitutional rights, tests the prosecution's evidence, and advocates within ethical rules.",
      },
      {
        term: "Public defender",
        es: "defensor público",
        definition:
          "Government-funded or contracted defense lawyer appointed for an indigent defendant who qualifies.",
      },
      {
        term: "Indigent",
        es: "indigente / sin recursos",
        definition:
          "Unable to afford legal representation under the applicable eligibility standard.",
      },
      {
        term: "Pro se",
        es: "por derecho propio / sin abogado",
        definition: "Representing oneself in court.",
      },
      {
        term: "Court clerk",
        es: "secretario judicial",
        definition:
          "Maintains the record, receives filings, manages exhibits and case information, and may administer oaths depending on practice.",
      },
      {
        term: "Bailiff",
        es: "alguacil / oficial de sala",
        definition:
          "Maintains security and order, announces the judge, escorts in-custody defendants, and may communicate between court and jury.",
      },
      {
        term: "Court reporter",
        es: "taquígrafo judicial",
        definition:
          "Creates the verbatim record of proceedings. The interpreter's English rendering becomes part of that record when testimony is interpreted.",
      },
      {
        term: "Pretrial services",
        es: "servicios previos al juicio",
        definition:
          "Assesses relevant risk and provides release-related information or recommendations under governing law and policy.",
      },
      {
        term: "Probation officer",
        es: "oficial de libertad condicional",
        definition:
          "Supervises people sentenced to probation and reports alleged violations; does not independently impose the sentence.",
      },
      {
        term: "Guardian ad litem",
        es: "tutor ad litem / abogado del menor",
        definition:
          "Court-appointed advocate for the best interests of a child or other protected person, as defined by the appointment and governing law.",
      },
    ],
  },
  {
    title: "Evidence, record, and courtroom language",
    terms: [
      {
        term: "Admissibility of evidence",
        es: "admisibilidad de la prueba",
        definition:
          "Whether evidence may legally be considered under the rules of evidence. The judge decides admissibility; the fact finder decides appropriate weight.",
      },
      {
        term: "Exhibit",
        es: "prueba material / objeto o documento marcado como prueba",
        definition:
          "An item marked for identification or admitted into evidence, such as a photograph, document, firearm, or drug paraphernalia.",
      },
      {
        term: "Chain of custody",
        es: "cadena de custodia",
        definition:
          "Documentation and testimony showing how physical evidence was collected, preserved, transferred, stored, and protected from alteration.",
      },
      {
        term: "Codified law",
        es: "ley codificada",
        definition: "Law organized and enacted in a written code or statute.",
      },
      {
        term: "Common law",
        es: "derecho consuetudinario / jurisprudencial",
        definition:
          "Law developed through judicial decisions rather than solely through enacted statutes.",
      },
      {
        term: "Statute",
        es: "ley / estatuto",
        definition: "A law formally enacted by a legislative body.",
      },
      {
        term: "Ballot initiative",
        es: "iniciativa popular",
        definition:
          "A process through which voters propose or enact a measure, subject to state constitutional and statutory procedures.",
      },
      {
        term: "Jury instructions",
        es: "instrucciones al jurado",
        definition:
          "The judge's authoritative explanation of the law the jury must apply. Interpreters should render them precisely and consistently.",
      },
    ],
  },
  {
    title: "Beginning a criminal case",
    terms: [
      {
        term: "Complaint",
        es: "denuncia / querella formal",
        definition:
          "A written charging document or pleading. Exact meaning varies by jurisdiction; in Utah felonies are commonly prosecuted by information or indictment.",
      },
      {
        term: "Information",
        es: "acusación formal presentada por el fiscal",
        definition:
          "A charging document filed by a prosecutor without a grand-jury indictment.",
      },
      {
        term: "Indictment",
        es: "acusación formal emitida por un gran jurado",
        definition:
          "A formal charge returned by a grand jury after it finds probable cause.",
      },
      {
        term: "Preliminary hearing",
        es: "audiencia preliminar",
        definition:
          "A public adversarial hearing in which a judge determines whether probable cause supports continuing felony charges. It is not a miniature trial on guilt.",
      },
      {
        term: "Grand jury",
        es: "gran jurado",
        definition:
          "A body that hears evidence presented by the prosecutor and decides whether probable cause supports an indictment. Proceedings are generally secret.",
      },
      {
        term: "True bill / no bill",
        es: "acusación aprobada / acusación rechazada",
        definition:
          "A true bill means the grand jury approved an indictment; a no bill means it did not.",
      },
      {
        term: "Trial in absentia",
        es: "juicio en ausencia",
        definition:
          "A trial conducted without the defendant. Permitted only under limited constitutional and procedural circumstances.",
      },
      {
        term: "Initial appearance",
        es: "comparecencia inicial",
        definition:
          "The defendant first appears before a judicial officer, is informed of charges and rights, and release and counsel issues may be addressed.",
      },
      {
        term: "Release on recognizance (OR)",
        es: "libertad bajo palabra",
        definition:
          "Pretrial release based on the promise to appear, without posting monetary bail, often subject to conditions.",
      },
      {
        term: "Arraignment",
        es: "lectura de cargos y presentación de declaración",
        definition:
          "The proceeding at which the defendant is formally informed of the charge and enters a plea.",
      },
      {
        term: "Nolo contendere / no contest",
        es: "no impugno / no contest",
        definition:
          "A plea accepting conviction without admitting the factual allegations. In Utah, guilty and no-contest pleas have the same effect as convictions.",
      },
    ],
  },
  {
    title: "Pretrial motions and constitutional issues",
    terms: [
      {
        term: "Motion",
        es: "moción / solicitud formal",
        definition: "A formal request asking the court to issue an order.",
      },
      {
        term: "Motion to continue",
        es: "moción para aplazar / continuar",
        definition:
          "A request to move a hearing or deadline to a later date. Usually requires a legally sufficient reason or good cause.",
      },
      {
        term: "Discovery",
        es: "descubrimiento / intercambio de pruebas",
        definition:
          "The process for disclosing evidence and information under procedural rules.",
      },
      {
        term: "Motion to suppress",
        es: "moción para excluir o suprimir prueba",
        definition:
          "A request to exclude evidence obtained in violation of constitutional or statutory protections.",
      },
      {
        term: "Exclusionary rule",
        es: "regla de exclusión",
        definition:
          "A doctrine that can prevent illegally obtained evidence from being used in the prosecution's case, subject to exceptions.",
      },
      {
        term: "Ineffective assistance of counsel",
        es: "asistencia ineficaz de abogado",
        definition:
          "A constitutional claim generally requiring proof that counsel's performance was deficient and that the deficiency prejudiced the defense.",
      },
    ],
  },
  {
    title: "Trial sequence",
    terms: [
      {
        term: "Voir dire",
        es: "selección e interrogatorio del jurado",
        definition:
          "Questioning prospective jurors to identify bias and select a fair and impartial jury.",
      },
      {
        term: "Sequestered jury",
        es: "jurado aislado",
        definition:
          "A jury kept apart from outside information or contact under a court order.",
      },
      {
        term: "Opening statement",
        es: "declaración inicial",
        definition:
          "Each side's preview of what it expects the evidence to show; it is not evidence.",
      },
      {
        term: "Presentation of evidence",
        es: "presentación de pruebas",
        definition:
          "Witnesses and exhibits are offered; the prosecution or plaintiff ordinarily presents first.",
      },
      {
        term: "Rebuttal evidence",
        es: "prueba de refutación",
        definition: "Evidence responding to matters raised by the opposing side.",
      },
      {
        term: "Closing argument",
        es: "alegato final",
        definition:
          "Arguments about how the admitted evidence and law should lead to a result.",
      },
      {
        term: "Deliberations",
        es: "deliberaciones",
        definition: "Private discussion by jurors before reaching a verdict.",
      },
      {
        term: "Verdict",
        es: "veredicto",
        definition: "The formal decision of the jury or fact finder.",
      },
      {
        term: "Hung jury",
        es: "jurado sin veredicto / jurado estancado",
        definition:
          "A jury unable to reach the degree of agreement required to return a verdict.",
      },
      {
        term: "Mistrial",
        es: "juicio nulo",
        definition:
          "Termination of a trial without a valid final verdict because of a fundamental problem, including some hung juries.",
      },
    ],
  },
  {
    title: "Sentencing and probation violations",
    terms: [
      {
        term: "Sentencing",
        es: "imposición de sentencia",
        definition:
          "The proceeding at which the court imposes the lawful criminal punishment after conviction.",
      },
      {
        term: "Mitigating circumstance",
        es: "circunstancia atenuante",
        definition:
          "A fact supporting a less severe sentence, without necessarily excusing the offense.",
      },
      {
        term: "Aggravating circumstance",
        es: "circunstancia agravante",
        definition: "A fact supporting a more severe sentence.",
      },
      {
        term: "Probation violation hearing",
        es: "audiencia por violación de libertad condicional",
        definition:
          "A hearing to determine whether probation conditions were violated and what consequence, if any, should follow. Not a new criminal trial.",
      },
    ],
  },
  {
    title: "Adult and juvenile terminology",
    terms: [
      {
        term: "Conviction (adult) / Adjudication (juvenile)",
        es: "condena / adjudicación",
        definition:
          "The adult and juvenile-court equivalents for a finding that the allegations were proven.",
      },
      {
        term: "Guilty (adult) / Delinquent (juvenile)",
        es: "culpable / responsable de acto delictivo",
        definition:
          "The adult and juvenile-court equivalents for the finding itself.",
      },
      {
        term: "Sentence (adult) / Disposition (juvenile)",
        es: "sentencia / medida o resolución",
        definition:
          "The adult and juvenile-court equivalents for the court's resulting order.",
      },
      {
        term: "Defendant (adult) / Minor or juvenile (juvenile)",
        es: "acusado / menor",
        definition: "The adult and juvenile-court equivalents for the accused person.",
      },
      {
        term: "Status offense",
        es: "infracción por condición de menor",
        definition:
          "Conduct prohibited because of the person's age, such as truancy or some curfew violations; not an offense if committed by an adult.",
      },
    ],
  },
  {
    title: "Interpreter conduct and accurate delivery",
    terms: [
      {
        term: "Convey the message",
        es: "transmitir fielmente el mensaje",
        definition:
          "Render the complete meaning, tone, register, and intent from the source language into the target language without additions, omissions, or explanations.",
      },
      {
        term: "Register",
        es: "registro lingüístico",
        definition:
          "The level and style of language \u2014 formal, informal, technical, vulgar, hesitant, or incoherent. Preserve it as closely as the target language allows.",
      },
      {
        term: "Colorful language",
        es: "lenguaje fuerte, vulgar o expresivo",
        definition:
          "A polite label for profanity, insults, or vivid language. The interpreter must interpret it accurately rather than soften or censor it.",
      },
      {
        term: "Courtroom decorum",
        es: "decoro de la sala",
        definition:
          "Standards of respectful and orderly conduct in court. The judge controls decorum; the interpreter does not independently edit a speaker's words.",
      },
      {
        term: "Conflict of interest",
        es: "conflicto de intereses",
        definition:
          "A conflict that may impair loyalty, independence, or representation.",
      },
      {
        term: "Irreconcilable conflict",
        es: "conflicto irreconciliable",
        definition:
          "A serious breakdown that may support a request to withdraw or substitute counsel; disagreement alone does not always require withdrawal.",
      },
      {
        term: "Perjury",
        es: "perjurio",
        definition:
          "Knowingly making a materially false statement under oath. A lawyer may not knowingly present perjured testimony.",
      },
    ],
  },
];

const WEEK1_SELFTEST = [
  "Name and define the principal modes of court interpreting.",
  "Explain the difference between burden of proof and standard of proof.",
  "Interpret: probable cause, arraignment, indictment, preponderance, acquittal.",
  "Why is an acquittal not identical to a declaration of innocence?",
  "What does the prosecutor represent? What does the defense attorney protect?",
  "Distinguish initial appearance, preliminary hearing, and arraignment.",
  "What should an interpreter do when a witness uses profanity, speaks incoherently, or makes an apparent mistake?",
  "Explain adult sentence versus juvenile disposition.",
];

const WEEK2_SECTIONS = [
  {
    title: "General Framework of Crime",
    terms: [
      {
        term: "Crime",
        es: "delito",
        definition:
          "An act causing harm to society, not necessarily physical; falls into four categories: persons, property, public order, and morality crimes.",
      },
      {
        term: "Harm",
        es: "daño",
        definition:
          "The injury a crime causes to society; not necessarily physical — can include an invasion of rights, as in kidnapping.",
      },
    ],
  },
  {
    title: "Homicide: murder and manslaughter",
    terms: [
      {
        term: "Homicide",
        es: "homicidio",
        definition:
          "The general term for the killing of a human being, which may or may not be criminal.",
      },
      {
        term: "Murder",
        es: "asesinato",
        definition:
          "An unlawful killing of a human being committed with a purposeful or knowing mental state.",
      },
      {
        term: "Manslaughter",
        es: "homicidio no premeditado",
        definition:
          "An unlawful killing without the mental state required for murder; can be voluntary or involuntary.",
      },
      {
        term: "Purposely (mental state)",
        es: "con propósito",
        definition:
          "Acting with the conscious intent to cause the result.",
      },
      {
        term: "Knowingly (mental state)",
        es: "a sabiendas",
        definition:
          "Acting with awareness that the result is practically certain to occur, even without directly seeking it.",
      },
      {
        term: "Recklessly (mental state)",
        es: "con imprudencia temeraria",
        definition:
          "Consciously disregarding a substantial and unjustifiable risk.",
      },
      {
        term: "Negligently (mental state)",
        es: "con negligencia",
        definition:
          "Failing to perceive a substantial and unjustifiable risk that a reasonable person would have perceived.",
      },
      {
        term: "Murder",
        es: "asesinato",
        definition:
          "In Utah, killing another person purposely or knowingly (Utah Code 76-5-203); a single first-degree felony tier — Utah does not divide murder into first and second degree as some other states do.",
      },
      {
        term: "Aggravated murder",
        es: "asesinato agravado",
        definition:
          "Murder committed under a specific statutory aggravating circumstance, such as multiple victims, a victim who is a peace officer, or a killing during a kidnapping, rape, or robbery (Utah Code 76-5-202); Utah's only capital offense.",
      },
      {
        term: "Manslaughter (voluntary)",
        es: "homicidio voluntario atenuado",
        definition:
          "In Utah, a murder that is reduced to manslaughter through the affirmative defense of extreme emotional distress for which there is a reasonable explanation (Utah Code 76-5-205) — the equivalent of 'heat of passion.'",
      },
      {
        term: "Manslaughter (reckless / involuntary)",
        es: "homicidio involuntario",
        definition:
          "Killing another person while acting recklessly, consciously disregarding a known risk, without intent to kill (Utah Code 76-5-205).",
      },
      {
        term: "Negligent homicide",
        es: "homicidio por negligencia",
        definition:
          "Killing another person through criminal negligence — failing to perceive a substantial risk a reasonable person would have perceived (Utah Code 76-5-205.5); a lower-level misdemeanor, not a felony.",
      },
      {
        term: "Felony murder rule",
        es: "regla del homicidio en delito grave",
        definition:
          "A death occurring during the commission of an inherently dangerous felony is automatically charged as murder.",
      },
      {
        term: "Lesser included offense",
        es: "delito menor incluido",
        definition:
          "A less serious offense whose elements are entirely contained within a greater charged offense.",
      },
      {
        term: "Proximate cause",
        es: "causa próxima",
        definition:
          "A causation concept connecting a defendant's conduct to the resulting death or harm.",
      },
      {
        term: "Motive",
        es: "motivo",
        definition:
          "The reason behind a criminal act; generally irrelevant to criminal liability.",
      },
    ],
  },
  {
    title: "Rape and Sexual Assault",
    terms: [
      {
        term: "Sexual assault",
        es: "agresión sexual",
        definition:
          "A broad category of non-consensual sexual contact, including but not limited to rape.",
      },
      {
        term: "Rape",
        es: "violación",
        definition:
          "A category of sexual assault involving non-consensual sexual intercourse.",
      },
      {
        term: "Fraud in the factum",
        es: "fraude en el hecho mismo",
        definition:
          "Deceiving the victim about the nature of the act itself; negates consent.",
      },
      {
        term: "Fraud in the inducement",
        es: "fraude para inducir el consentimiento",
        definition:
          "Deceiving the victim to obtain consent to an act they understood; generally does not negate consent.",
      },
      {
        term: "Statutory rape",
        es: "violación estatutaria",
        definition:
          "Sexual intercourse with a minor who cannot legally consent, regardless of apparent willingness.",
      },
      {
        term: "Consent",
        es: "consentimiento",
        definition:
          "Voluntary agreement to a sexual act; can be withdrawn at any time, and withdrawal is clearest when verbal.",
      },
    ],
  },
  {
    title: "Assault and Battery",
    terms: [
      {
        term: "Battery",
        es: "agresión física con contacto",
        definition:
          "Harmful or offensive, non-consensual physical contact with another person.",
      },
      {
        term: "Assault",
        es: "amenaza de agresión",
        definition:
          "Intentionally placing another person in fear of imminent harmful contact, without necessarily touching them.",
      },
      {
        term: "Constructive touching",
        es: "contacto constructivo",
        definition:
          "Indirect contact caused by setting an object or force in motion.",
      },
      {
        term: "Aggravated battery",
        es: "agresión agravada",
        definition:
          "Battery committed with a deadly weapon or resulting in serious injury.",
      },
      {
        term: "Attempted battery",
        es: "intento de agresión física",
        definition:
          "Acting with purpose to cause harmful contact that ultimately fails.",
      },
      {
        term: "Threatened battery",
        es: "amenaza de agresión física",
        definition:
          "Placing the victim in fear of imminent physical injury.",
      },
    ],
  },
  {
    title: "Kidnapping",
    terms: [
      {
        term: "Kidnapping",
        es: "secuestro",
        definition:
          "Unlawfully moving another person a significant distance against their will.",
      },
      {
        term: "False imprisonment",
        es: "privación ilegal de la libertad",
        definition:
          "Unlawfully confining another person without significant movement.",
      },
    ],
  },
  {
    title: "Property Crimes: Theft family",
    terms: [
      {
        term: "Larceny",
        es: "hurto",
        definition:
          "Taking property from another person's possession with intent to keep it.",
      },
      {
        term: "Theft",
        es: "hurto / robo (categoría general)",
        definition:
          "The modern, consolidated term covering larceny, embezzlement, and false pretenses in most states.",
      },
      {
        term: "Embezzlement",
        es: "malversación",
        definition:
          "Wrongfully assuming ownership of property one lawfully controls.",
      },
      {
        term: "Conversion",
        es: "apropiación indebida",
        definition:
          "Assuming ownership of property one has a right to control only temporarily.",
      },
      {
        term: "False pretenses",
        es: "falsas representaciones",
        definition:
          "Lying about a material fact to induce someone to voluntarily give up property.",
      },
      {
        term: "Material fact",
        es: "hecho material",
        definition:
          "A fact with real probative weight in the victim's decision, as opposed to merely relevant.",
      },
    ],
  },
  {
    title: "Robbery",
    terms: [
      {
        term: "Robbery",
        es: "robo con violencia",
        definition:
          "Taking personal property from a victim's immediate presence by force or by putting the victim in fear.",
      },
      {
        term: "First degree robbery",
        es: "robo en primer grado",
        definition:
          "Robbery committed with a dangerous or deadly weapon, or resulting in serious injury to the victim.",
      },
      {
        term: "Second degree robbery",
        es: "robo en segundo grado",
        definition:
          "Robbery committed without a weapon and without serious injury to the victim.",
      },
    ],
  },
  {
    title: "Burglary",
    terms: [
      {
        term: "Burglary",
        es: "allanamiento con intento delictivo",
        definition:
          "Entering or remaining in a structure with the intent to commit a felony inside; the felony need not be completed.",
      },
      {
        term: "Trespassing",
        es: "allanamiento simple",
        definition:
          "Entering or remaining on property without permission, without intent to commit another crime.",
      },
    ],
  },
  {
    title: "Forgery",
    terms: [
      {
        term: "Forgery",
        es: "falsificación",
        definition:
          "A material, unauthorized alteration of a document having legal significance.",
      },
      {
        term: "Uttering",
        es: "dar curso a un documento falso",
        definition:
          "Passing, or attempting to pass, a forged document as genuine.",
      },
    ],
  },
  {
    title: "Arson",
    terms: [
      {
        term: "Arson",
        es: "incendio provocado",
        definition:
          "The unlawful burning of a structure; the only property crime a person can commit against their own property.",
      },
      {
        term: "First degree arson",
        es: "incendio en primer grado",
        definition:
          "Arson of an inhabited structure.",
      },
      {
        term: "Second degree arson",
        es: "incendio en segundo grado",
        definition:
          "Arson of an uninhabited structure.",
      },
    ],
  },
  {
    title: "Public Order Crimes",
    terms: [
      {
        term: "Disorderly conduct",
        es: "alteración del orden público",
        definition:
          "Behavior causing public inconvenience, annoyance, or alarm.",
      },
      {
        term: "Fighting words",
        es: "palabras de provocación",
        definition:
          "Words that, by their very utterance, inflict injury or tend to incite an immediate breach of the peace.",
      },
      {
        term: "Affray",
        es: "riña mutua",
        definition:
          "A mutual fight in which it is unclear who started the altercation.",
      },
    ],
  },
  {
    title: "Driving Under the Influence (DUI)",
    terms: [
      {
        term: "Driving under the influence (DUI)",
        es: "conducir bajo la influencia",
        definition:
          "Operating a vehicle with a blood alcohol concentration over the legal limit, or while impaired.",
      },
      {
        term: "Blood alcohol concentration (BAC)",
        es: "concentración de alcohol en la sangre",
        definition:
          "The measured percentage of alcohol in a person's blood.",
      },
      {
        term: "Field sobriety test",
        es: "prueba de sobriedad en campo",
        definition:
          "Roadside physical tests used by officers to assess impairment.",
      },
      {
        term: "Horizontal Gaze Nystagmus (HGN)",
        es: "nistagmo horizontal del globo ocular",
        definition:
          "A field sobriety test observing involuntary eye movement as a sign of intoxication.",
      },
    ],
  },
  {
    title: "Drugs and Paraphernalia",
    terms: [
      {
        term: "Controlled substance",
        es: "sustancia controlada",
        definition:
          "A drug with a physical or psychotropic effect, regulated under criminal law.",
      },
      {
        term: "Drug paraphernalia",
        es: "parafernalia de drogas",
        definition:
          "Any item used to ingest, prepare, or otherwise use a controlled substance.",
      },
    ],
  },
  {
    title: "Prostitution and Pandering",
    terms: [
      {
        term: "Prostitution",
        es: "prostitución",
        definition:
          "Offering or performing a sexual act in exchange for something of value.",
      },
      {
        term: "Pandering",
        es: "proxenetismo",
        definition:
          "Arranging for another person to engage in a sexual act in exchange for something of value.",
      },
      {
        term: "Human trafficking",
        es: "trata de personas",
        definition:
          "The exploitation of a person for a sexual or other purpose against their will; considered a form of pandering.",
      },
    ],
  },
  {
    title: "Conceptos transversales",
    terms: [
      {
        term: "Double jeopardy",
        es: "doble incriminación",
        definition:
          "The constitutional protection against being tried twice for the same offense.",
      },
      {
        term: "Mistrial",
        es: "juicio nulo",
        definition:
          "A trial terminated without a valid verdict, requiring the case to start over.",
      },
      {
        term: "Tort",
        es: "agravio civil",
        definition:
          "A civil wrong causing harm that gives rise to a civil cause of action for damages.",
      },
    ],
  },
];

const WEEK_CONTENT = {
  1: { sections: WEEK1_SECTIONS, selftest: WEEK1_SELFTEST },
  2: { sections: WEEK2_SECTIONS },
};

// Caso de la semana — José reemplaza este objeto cada semana con un caso nuevo
const CASE_OF_THE_WEEK = {
  title: "Homicidio de Gaby Ramos (Taylorsville, Utah)",
  dateLabel: "Actualizado noviembre 2025 — sentencia programada para el 10 de diciembre",
  summary:
    "Gabriela Sifuentes Castilla, conocida como Gaby Ramos, era locutora de radio en español en Utah (La Más Picosita, KMRI 1550 AM). El 17 de octubre de 2021, su expareja Manuel Omar Burciaga Perea la mató a tiros en Taylorsville, tras un altercado que ella reportó dos veces al 911. Burciaga huyó a Chihuahua, México, y fue extraditado a Utah en 2023. Tras ser ordenado a juicio en 2024, esta semana se declaró culpable mediante un acuerdo de culpabilidad que redujo los cargos originales.",
  chargeChanges: [
    { original: "Aggravated murder", result: "Murder" },
    { original: "Aggravated burglary", result: "Desestimado (dismissed)" },
    { original: "Aggravated assault", result: "Reckless endangerment" },
    {
      original: "Domestic violence in the presence of a child",
      result: "Se mantiene",
    },
  ],
  connections: [
    "La distinción entre Murder y Aggravated murder (Semana 2) determinó directamente el resultado de la condena en este caso.",
    "Plea agreement / plea bargaining (Semana 1): ejemplo real de negociación de cargos entre fiscalía y defensa.",
    "Reckless endangerment refleja el estado mental \"recklessly\" (Semana 2) — el cargo pasó de uno intencional a uno de imprudencia temeraria.",
    "Preliminary hearing (Semana 1): el caso tuvo una en 2024, con testimonio de un testigo presencial.",
    "La audiencia de sentencia del 10 de diciembre contará con familiares hispanohablantes presentes — un contexto habitual en las cortes de Utah.",
  ],
  sources: [
    {
      title: "Man admits to killing estranged girlfriend... | KSL.com",
      url: "https://www.ksl.com/article/51622551/man-admits-to-killing-estranged-girlfriend-a-local-spanish-radio-host-almost-five-years-ago",
    },
    {
      title: "Ex-boyfriend ordered to stand trial... | KSL.com",
      url: "https://www.ksl.com/article/51133786/ex-boyfriend-ordered-to-stand-trial-in-killing-of-utah-spanish-radio-host",
    },
    {
      title: "Suspect ... extradited to U.S. from Mexico | CBS News",
      url: "https://www.cbsnews.com/news/suspect-manuel-omar-burciaga-perea-murder-gabriela-sifuentes-castilla-gaby-ramos-extradited-utah-mexico/",
    },
  ],
};

const RESOURCES = {
  books: [
    {
      title: "The Bilingual Courtroom: Court Interpreters in the Judicial Process",
      author: "Susan Berk-Seligson (2nd ed., University of Chicago Press)",
      note:
        "Obra de referencia en el campo — un estudio basado en más de cien horas de grabaciones de procedimientos judiciales en español e inglés, que muestra cómo las decisiones del intérprete pueden influir en el resultado de un caso. Ganadora del premio al Mejor Libro de la Asociación Británica de Lingüística Aplicada.",
      url: "https://books.google.com/books/about/The_Bilingual_Courtroom.html?id=R2z2D8h4clcC",
    },
  ],
  videos: [],
  officialSources: [
    {
      title: "Utah Courts — Glossary of Legal Terms",
      url: "https://www.utcourts.gov/en/self-help/case-categories/resources/glossary.html",
    },
    {
      title: "Utah Courts — Criminal Processes",
      url: "https://www.utcourts.gov/en/self-help/legal-help/procedures/court-process/criminal.html",
    },
    {
      title: "Utah Code of Judicial Administration, Appendix H — Code of Professional Responsibility for Court Interpreters",
      url: "https://legacy.utcourts.gov/rules/view.php?rule=10H&type=ucja",
    },
    {
      title: "Utah Rules of Criminal Procedure",
      url: "https://legacy.utcourts.gov/rules/urcrp.php",
    },
    {
      title: "Utah Legislature — Utah Code, Title 76 (Utah Criminal Code)",
      url: "https://le.utah.gov/xcode/Title76/76.html",
    },
    {
      title: "U.S. Courts — Glossary of Legal Terms",
      url: "https://www.uscourts.gov/glossary",
    },
    {
      title: "Utah Rules of Evidence",
      url: "https://legacy.utcourts.gov/rules/viewall.php?type=URE",
    },
    {
      title: "Utah Rules of Juvenile Procedure",
      url: "https://legacy.utcourts.gov/rules/urjp.php",
    },
  ],
};

const REFERENCE_GLOSSARY = [
  {
    term: "Acquittal",
    definition:
      "A jury verdict that a criminal defendant is not guilty, or the finding of a judge that the evidence is insufficient to support a conviction.",
    domain: "General",
  },
  {
    term: "Administrative law judge",
    definition:
      "An officer in a regulatory or social service agency, such as the Department of Labor or the Social Security Administration, who decides disputes under the laws and regulations administered by the agency, subject to appeals to the Article III courts.",
    domain: "General",
  },
  {
    term: "Administrative Office of the United States Courts (AO)",
    definition:
      "The federal agency responsible for collecting court statistics, administering the federal courts' budget, and performing many other administrative and programmatic functions, under the direction and supervision of the Judicial Conference of the United States.",
    domain: "General",
  },
  {
    term: "Admissible",
    definition:
      "A term used to describe evidence that may be considered by a jury or judge in civil and criminal cases.",
    domain: "General",
  },
  {
    term: "Adversary proceeding",
    definition:
      "A lawsuit arising in or related to a bankruptcy case (listed in Federal Rule of Bankruptcy Procedure 7001) that begins by filing a complaint with the court.",
    domain: "General",
  },
  {
    term: "Affidavit",
    definition:
      "A written or printed statement made under oath.",
    domain: "General",
  },
  {
    term: "Affirmed",
    definition:
      "A finding by an appellate court that the lower court decision is correct and will stand.",
    domain: "General",
  },
  {
    term: "Alternate juror",
    definition:
      "A juror selected in the same manner as a regular juror who hears all the evidence but does not help decide the case unless called on to replace a regular juror.",
    domain: "General",
  },
  {
    term: "Alternative dispute resolution (ADR)",
    definition:
      "Methods of resolving a legal dispute without conducting a trial, including mediation and arbitration.",
    domain: "General",
  },
  {
    term: "Amicus curiae",
    definition:
      "Latin for \"friend of the court.\" It is advice formally offered to the court in a brief filed by an entity interested in, but not a party to, the case.",
    domain: "General",
  },
  {
    term: "Answer",
    definition:
      "The formal written statement by a defendant in a civil case that responds to a complaint, articulating the grounds for defense.",
    domain: "General",
  },
  {
    term: "Appeal",
    definition:
      "A request challenging the decision of a court by a party that has lost on one or more issues and seeks a higher court review of the decision to determine if it was correct.",
    domain: "General",
  },
  {
    term: "Appellant",
    definition:
      "The party who appeals a lower court's decision, usually seeking reversal of that decision.",
    domain: "General",
  },
  {
    term: "Appellate",
    definition:
      "About appeals; an appellate court has the power to review the judgment of a lower court or tribunal.",
    domain: "General",
  },
  {
    term: "Appellee",
    definition:
      "The party who opposes an appellant's appeal, and who seeks to persuade the appeals court to affirm the lower court's decision.",
    domain: "General",
  },
  {
    term: "Arbitration",
    definition:
      "A form of alternative dispute resolution in which an arbitrator issues a judgment on the legal issues involved in a case after listening to presentations by each party.",
    domain: "General",
  },
  {
    term: "Arraignment",
    definition:
      "A proceeding in which a criminal defendant is brought into court, told of the charges in an indictment or information, and asked to plead guilty or not guilty.",
    domain: "General",
  },
  {
    term: "Article III judge",
    definition:
      "A federal judge who is appointed for life, during \"good behavior,\" under Article III of the U.S. Constitution.",
    domain: "General",
  },
  {
    term: "Assets",
    definition:
      "Property of all kinds, including real and personal, tangible and intangible.",
    domain: "General",
  },
  {
    term: "Assume",
    definition:
      "To take on liability or responsibility under a contract; in bankruptcy, an agreement by a debtor to continue performing obligations under certain contracts.",
    domain: "General",
  },
  {
    term: "Automatic stay",
    definition:
      "An injunction that usually comes into force automatically when a bankruptcy case is filed, stopping lawsuits, foreclosures, garnishments, and most collection activities against the debtor.",
    domain: "General",
  },
  {
    term: "Bail",
    definition:
      "Security given for the release of a criminal defendant or witness from legal custody to secure their appearance in court.",
    domain: "General",
  },
  {
    term: "Bankruptcy",
    definition:
      "A legal case governed by the Bankruptcy Code by which persons or businesses unable to pay their debts can liquidate or reorganize their assets and liabilities.",
    domain: "General",
  },
  {
    term: "Bankruptcy administrator",
    definition:
      "An officer of the federal judiciary who, like the U.S. Trustee, supervises the administration of bankruptcy cases, estates, and trustees.",
    domain: "General",
  },
  {
    term: "Bankruptcy code",
    definition:
      "The informal name for title 11 of the United States Code, the federal bankruptcy law.",
    domain: "General",
  },
  {
    term: "Bankruptcy court",
    definition:
      "The bankruptcy judge(s) in regular active service in each district; a unit of the district court.",
    domain: "General",
  },
  {
    term: "Bankruptcy estate",
    definition:
      "All legal or equitable interests of the debtor at the time of the bankruptcy filing.",
    domain: "General",
  },
  {
    term: "Bankruptcy judge",
    definition:
      "A judicial officer of the U.S. district court who presides over bankruptcy cases and proceedings.",
    domain: "General",
  },
  {
    term: "Bankruptcy petition",
    definition:
      "The document filed by the debtor or by creditors that commences a bankruptcy case.",
    domain: "General",
  },
  {
    term: "Bench trial",
    definition:
      "Trial by a judge without a jury.",
    domain: "General",
  },
  {
    term: "Brief",
    definition:
      "A written statement submitted in a trial or appellate proceeding that explains one side's legal and factual arguments.",
    domain: "General",
  },
  {
    term: "Burden of proof",
    definition:
      "The duty to prove disputed facts; the plaintiff generally bears it in civil cases, the government in criminal cases.",
    domain: "General",
  },
  {
    term: "Business bankruptcy",
    definition:
      "A bankruptcy case in which the debtor is a business and the debts are primarily for business purposes.",
    domain: "General",
  },
  {
    term: "Capital offense",
    definition:
      "A crime punishable by death.",
    domain: "General",
  },
  {
    term: "Case ancillary to a foreign proceeding",
    definition:
      "A case commenced under Chapter 15 of the Bankruptcy Code to protect the U.S. property of a debtor subject to an insolvency proceeding in another country.",
    domain: "General",
  },
  {
    term: "Case file",
    definition:
      "A complete collection of every document filed in court in a case.",
    domain: "General",
  },
  {
    term: "Case law",
    definition:
      "The law as established in previous court decisions; a synonym for legal precedent.",
    domain: "General",
  },
  {
    term: "Caseload",
    definition:
      "The number of cases handled by a judge or a court.",
    domain: "General",
  },
  {
    term: "Cause of action",
    definition:
      "The legal basis that allows for a party to seek judicial relief.",
    domain: "General",
  },
  {
    term: "Chambers",
    definition:
      "A judge's office, typically including a conference room and workspace for the judge's staff.",
    domain: "General",
  },
  {
    term: "Chapter 7",
    definition:
      "The chapter of the Bankruptcy Code providing for liquidation of a debtor's nonexempt property and distribution to creditors.",
    domain: "General",
  },
  {
    term: "Chapter 9",
    definition:
      "The chapter of the Bankruptcy Code providing for the adjustment of debts of eligible municipalities.",
    domain: "General",
  },
  {
    term: "Chapter 11",
    definition:
      "The chapter of the Bankruptcy Code under which a debtor may reorganize, or less often liquidate, under a plan that governs repayment of its debts.",
    domain: "General",
  },
  {
    term: "Chapter 12",
    definition:
      "The chapter of the Bankruptcy Code providing for adjustment of debts of a family farmer or family fisherman.",
    domain: "General",
  },
  {
    term: "Chapter 13",
    definition:
      "The chapter of the Bankruptcy Code providing for the adjustment of debts of an individual with regular income based on a court-approved plan.",
    domain: "General",
  },
  {
    term: "Chapter 13 trustee",
    definition:
      "A person appointed to administer a Chapter 13 case, overseeing the debtor's plan and disbursing payments to creditors.",
    domain: "General",
  },
  {
    term: "Chapter 15",
    definition:
      "The chapter of the Bankruptcy Code dealing with international insolvency cases.",
    domain: "General",
  },
  {
    term: "Chapter 7 trustee",
    definition:
      "A person appointed in a Chapter 7 case to represent the interests of the bankruptcy estate, liquidate property, and make distributions to creditors.",
    domain: "General",
  },
  {
    term: "Chief judge",
    definition:
      "The judge who has primary responsibility for the administration of a court.",
    domain: "General",
  },
  {
    term: "Circuit Executive",
    definition:
      "A federal court employee who assists the chief judge of a circuit and provides administrative support to the courts of the circuit.",
    domain: "General",
  },
  {
    term: "Claim",
    definition:
      "A creditor's right to payment from a debtor or the debtor's property.",
    domain: "General",
  },
  {
    term: "Class action",
    definition:
      "A lawsuit in which members of a large group sue on behalf of the entire class.",
    domain: "General",
  },
  {
    term: "Clerk of court",
    definition:
      "An administrative officer who manages the flow of cases, maintains court records, and provides other administrative support.",
    domain: "General",
  },
  {
    term: "Collateral",
    definition:
      "Property that serves as security for the satisfaction of a debt.",
    domain: "General",
  },
  {
    term: "Common law",
    definition:
      "The legal system originating in England and used in the U.S., relying on the articulation of legal principles in a historical succession of judicial decisions.",
    domain: "General",
  },
  {
    term: "Community service",
    definition:
      "A special condition the court imposes that requires an individual to work, without pay, for a civic or nonprofit organization.",
    domain: "General",
  },
  {
    term: "Complaint",
    definition:
      "A civil complaint is a written statement filed by a plaintiff initiating a case; a criminal complaint is a sworn document filed by the government alleging a crime and probable cause to arrest.",
    domain: "General",
  },
  {
    term: "Concurrent sentence",
    definition:
      "Prison terms for two or more offenses served at the same time.",
    domain: "General",
  },
  {
    term: "Confirmation",
    definition:
      "In bankruptcy, approval of a plan of reorganization, liquidation, or adjustment of debts by a bankruptcy judge; in judicial nominations, Senate approval of a candidate to serve as a federal judge.",
    domain: "General",
  },
  {
    term: "Consecutive sentence",
    definition:
      "Prison terms for two or more offenses served one after the other.",
    domain: "General",
  },
  {
    term: "Consumer bankruptcy",
    definition:
      "A bankruptcy case filed to reduce or eliminate debts that are primarily consumer debts.",
    domain: "General",
  },
  {
    term: "Consumer debtor",
    definition:
      "A debtor whose debts are primarily consumer debts.",
    domain: "General",
  },
  {
    term: "Consumer debts",
    definition:
      "Debts incurred for a personal, family, or household purpose, as opposed to business needs.",
    domain: "General",
  },
  {
    term: "Contested matter",
    definition:
      "Litigation to resolve any actual dispute, other than an adversary proceeding, before the bankruptcy court.",
    domain: "General",
  },
  {
    term: "Contingent claim",
    definition:
      "A claim for which the right to payment depends on the occurrence of a future event.",
    domain: "General",
  },
  {
    term: "Contract",
    definition:
      "An agreement between parties that imposes legally binding obligations.",
    domain: "General",
  },
  {
    term: "Conviction",
    definition:
      "A judgment of guilt against a criminal defendant.",
    domain: "General",
  },
  {
    term: "Counsel",
    definition:
      "Legal advice; a term also used to refer to the lawyers in a case.",
    domain: "General",
  },
  {
    term: "Count",
    definition:
      "An allegation in an indictment or information, charging a defendant with a crime.",
    domain: "General",
  },
  {
    term: "Court",
    definition:
      "Government entity presided over by judges and authorized by statute to resolve legal disputes.",
    domain: "General",
  },
  {
    term: "Court of International Trade",
    definition:
      "A court hearing cases involving U.S. international trade law, including tariffs and countervailing duties.",
    domain: "General",
  },
  {
    term: "Court reporter",
    definition:
      "A person who makes a word-for-word record of what is said in court and produces a transcript upon request.",
    domain: "General",
  },
  {
    term: "Credit counseling",
    definition:
      "Required budget and credit counseling that individual debtors must attend prior to filing bankruptcy.",
    domain: "General",
  },
  {
    term: "Creditor",
    definition:
      "A person or business to whom or which the debtor owes money.",
    domain: "General",
  },
  {
    term: "Damages",
    definition:
      "Money that a defendant pays a plaintiff in a civil case if the plaintiff has won.",
    domain: "General",
  },
  {
    term: "De facto",
    definition:
      "Latin for \"in fact\" or \"actually\"; something that exists in fact but not as a matter of law.",
    domain: "General",
  },
  {
    term: "De jure",
    definition:
      "Latin for \"in law\"; something that exists by operation of law.",
    domain: "General",
  },
  {
    term: "De novo",
    definition:
      "Latin for \"anew\"; a trial de novo is a completely new trial.",
    domain: "General",
  },
  {
    term: "Debtor",
    definition:
      "A person, business, or government entity concerning which a bankruptcy case has been filed.",
    domain: "General",
  },
  {
    term: "Declaratory judgment",
    definition:
      "A legal determination of a court defining the rights and obligations of litigants to resolve legal uncertainty.",
    domain: "General",
  },
  {
    term: "Default judgment",
    definition:
      "A judgment for the plaintiff because the defendant failed to answer or appear to contest the claim.",
    domain: "General",
  },
  {
    term: "Defendant",
    definition:
      "In a civil case, the person or entity being sued; in a criminal case, the person accused of the crime.",
    domain: "General",
  },
  {
    term: "Deposition",
    definition:
      "An oral statement made under oath before an officer authorized by law, often taken for discovery or later trial use.",
    domain: "General",
  },
  {
    term: "Discharge",
    definition:
      "A release of a debtor from personal liability for certain dischargeable debts.",
    domain: "General",
  },
  {
    term: "Dischargeable debt",
    definition:
      "A debt for which the Bankruptcy Code allows the debtor's personal liability to be eliminated.",
    domain: "General",
  },
  {
    term: "Disclosure statement",
    definition:
      "A written document that provides adequate information to creditors to enable them to evaluate a Chapter 11 plan.",
    domain: "General",
  },
  {
    term: "Discovery",
    definition:
      "The process by which lawyers learn about their opponent's case in preparation for trial.",
    domain: "General",
  },
  {
    term: "Dismissal with prejudice",
    definition:
      "Court action that prevents an identical lawsuit or criminal charges from being filed later.",
    domain: "General",
  },
  {
    term: "Dismissal without prejudice",
    definition:
      "Court action that allows a later filing.",
    domain: "General",
  },
  {
    term: "Disposable income",
    definition:
      "Income not reasonably necessary for the maintenance or support of the debtor or dependents.",
    domain: "General",
  },
  {
    term: "Docket",
    definition:
      "A log containing the complete history of each case in brief chronological entries.",
    domain: "General",
  },
  {
    term: "Due process",
    definition:
      "The constitutional guarantee of a fair and impartial trial, and of legal rights against adverse actions threatening liberty or property.",
    domain: "General",
  },
  {
    term: "En banc",
    definition:
      "Court sessions with the entire membership of a court participating, rather than a smaller panel.",
    domain: "General",
  },
  {
    term: "Equitable",
    definition:
      "Pertaining to civil suits in \"equity\" rather than in \"law,\" where a court can order someone to do or cease doing something.",
    domain: "General",
  },
  {
    term: "Equity",
    definition:
      "The value of a debtor's interest in property that remains after liens and other creditors' interests are considered.",
    domain: "General",
  },
  {
    term: "Evidence",
    definition:
      "Any material, object, or information used to persuade the fact finder to decide the case in favor of one side.",
    domain: "General",
  },
  {
    term: "Ex parte",
    definition:
      "A proceeding brought before a court by one party only, without notice to the other side.",
    domain: "General",
  },
  {
    term: "Exclusionary rule",
    definition:
      "Doctrine that evidence obtained in violation of a defendant's constitutional or statutory rights is not admissible at trial.",
    domain: "General",
  },
  {
    term: "Exculpatory evidence",
    definition:
      "Evidence indicating that a defendant did not commit the crime.",
    domain: "General",
  },
  {
    term: "Executory contracts",
    definition:
      "A contract under which both parties have material duties remaining to be performed; a debtor may assume or reject it, subject to court approval.",
    domain: "General",
  },
  {
    term: "Exempt assets",
    definition:
      "Property that a debtor is allowed to retain, free from the claims of creditors who do not have liens on the property.",
    domain: "General",
  },
  {
    term: "Exemptions, exempt property",
    definition:
      "Property that the Bankruptcy Code or state law permits a debtor to keep from unsecured creditors.",
    domain: "General",
  },
  {
    term: "Family farmer",
    definition:
      "An individual, corporation, or partnership engaged in a farming operation that meets certain debt limits for filing under Chapter 12.",
    domain: "General",
  },
  {
    term: "Federal public defender",
    definition:
      "An attorney employed by the federal courts to provide legal defense to defendants unable to afford counsel.",
    domain: "General",
  },
  {
    term: "Federal public defender organization",
    definition:
      "An organization established within a federal judicial circuit to represent criminal defendants who cannot afford an adequate defense.",
    domain: "General",
  },
  {
    term: "Federal question jurisdiction",
    definition:
      "Jurisdiction given to federal courts in cases involving interpretation of the Constitution, federal statutes, and treaties.",
    domain: "General",
  },
  {
    term: "Felony",
    definition:
      "A serious crime carrying a penalty of more than one year in prison.",
    domain: "General",
  },
  {
    term: "File",
    definition:
      "To transmit or place a document in the official custody of the clerk of court; also, the official record of a case.",
    domain: "General",
  },
  {
    term: "Financial management",
    definition:
      "Required budget and credit counseling that individual debtors must attend after filing, before obtaining a discharge.",
    domain: "General",
  },
  {
    term: "Fraudulent transfer",
    definition:
      "A transfer of a debtor's property made with intent to defraud or for less than reasonably equivalent value.",
    domain: "General",
  },
  {
    term: "Grand jury",
    definition:
      "A body of citizens who listen to evidence of criminal allegations and determine whether there is probable cause to believe an individual committed an offense.",
    domain: "General",
  },
  {
    term: "Habeas corpus",
    definition:
      "Latin for \"you have the body\"; a judicial order forcing law enforcement to produce a prisoner and justify continued confinement.",
    domain: "General",
  },
  {
    term: "Hearsay",
    definition:
      "Statements by a witness who heard about an incident second-hand rather than seeing or hearing it directly.",
    domain: "General",
  },
  {
    term: "Home confinement",
    definition:
      "A condition requiring an individual to remain at home except for approved activities, sometimes with electronic monitoring.",
    domain: "General",
  },
  {
    term: "Impeachment",
    definition:
      "The process of calling a witness's testimony into doubt; also, the constitutional process for removing federal officials from office.",
    domain: "General",
  },
  {
    term: "In camera",
    definition:
      "Latin for \"in chambers\"; in private, outside the presence of a jury and the public.",
    domain: "General",
  },
  {
    term: "In forma pauperis",
    definition:
      "Latin for \"in the manner of a pauper\"; permission to file a case without paying court fees because the person cannot afford them.",
    domain: "General",
  },
  {
    term: "Inculpatory evidence",
    definition:
      "Evidence indicating that a defendant did commit the crime.",
    domain: "General",
  },
  {
    term: "Indictment",
    definition:
      "The formal charge issued by a grand jury that there is enough evidence to justify a defendant standing trial; used primarily for felonies.",
    domain: "General",
  },
  {
    term: "Information",
    definition:
      "A formal accusation by a government attorney that the defendant committed a misdemeanor, or in a felony case if the defendant waives a grand jury indictment.",
    domain: "General",
  },
  {
    term: "Injunction",
    definition:
      "A court order preventing one or more named parties from taking some action.",
    domain: "General",
  },
  {
    term: "Insider (bankruptcy)",
    definition:
      "Certain parties with a close relationship to the debtor, such as relatives, officers, directors, and affiliates.",
    domain: "General",
  },
  {
    term: "Interrogatories",
    definition:
      "Written questions sent by one party in a lawsuit to an opposing party as part of pretrial discovery.",
    domain: "General",
  },
  {
    term: "Issue",
    definition:
      "The disputed point between parties in a lawsuit; also, to send out officially, as in a court issuing an order.",
    domain: "General",
  },
  {
    term: "Joint administration",
    definition:
      "A court-approved mechanism under which two or more related cases can be administered together for procedural purposes.",
    domain: "General",
  },
  {
    term: "Joint petition",
    definition:
      "One bankruptcy petition filed together by spouses.",
    domain: "General",
  },
  {
    term: "Judge",
    definition:
      "An official with statutory authority to decide legal disputes according to the law.",
    domain: "General",
  },
  {
    term: "Judgeship",
    definition:
      "The position of judge; Congress authorizes the number of judgeships for each court.",
    domain: "General",
  },
  {
    term: "Judgment",
    definition:
      "The official decision of a court finally resolving the dispute between the parties.",
    domain: "General",
  },
  {
    term: "Judicial Conference of the United States",
    definition:
      "The policymaking body for the federal courts, convening twice a year to consider administrative and policy issues.",
    domain: "General",
  },
  {
    term: "Jurisdiction",
    definition:
      "The legal authority of a court to hear and decide a certain type of case.",
    domain: "General",
  },
  {
    term: "Jurisprudence",
    definition:
      "The study of law and the structure of the legal system.",
    domain: "General",
  },
  {
    term: "Jury",
    definition:
      "The group of citizens selected to hear the evidence in a trial and render a verdict on matters of fact.",
    domain: "General",
  },
  {
    term: "Jury instructions",
    definition:
      "A judge's directions to the jury regarding the factual questions and legal rules it must apply.",
    domain: "General",
  },
  {
    term: "Lawsuit",
    definition:
      "A legal action filed in a court alleging that a defendant's unlawful actions have harmed the plaintiff.",
    domain: "General",
  },
  {
    term: "Lien",
    definition:
      "A claim or charge on property to secure payment of a debt or performance of an obligation.",
    domain: "General",
  },
  {
    term: "Liquidated claim",
    definition:
      "A creditor's claim for a fixed amount of money.",
    domain: "General",
  },
  {
    term: "Liquidation",
    definition:
      "The sale of a debtor's property with the proceeds generally used for the benefit of creditors.",
    domain: "General",
  },
  {
    term: "Litigation",
    definition:
      "A case, controversy, or lawsuit; participants are called litigants.",
    domain: "General",
  },
  {
    term: "Magistrate judge",
    definition:
      "A judicial officer of a district court who conducts initial proceedings, decides misdemeanor cases, and handles pretrial matters.",
    domain: "General",
  },
  {
    term: "Means test",
    definition:
      "A calculation used to determine whether an individual debtor's Chapter 7 filing is presumed to be an abuse of the Bankruptcy Code.",
    domain: "General",
  },
  {
    term: "Mediation",
    definition:
      "An informal alternative dispute resolution process in which a mediator facilitates negotiations between the parties.",
    domain: "General",
  },
  {
    term: "Misdemeanor",
    definition:
      "An offense punishable by one year of imprisonment or less.",
    domain: "General",
  },
  {
    term: "Mistrial",
    definition:
      "An invalid trial caused by fundamental error, requiring the trial to start again.",
    domain: "General",
  },
  {
    term: "Moot",
    definition:
      "Not subject to a court ruling because the controversy has not actually arisen or has ended.",
    domain: "General",
  },
  {
    term: "Motion",
    definition:
      "A request by a litigant to a judge for a decision on an issue relating to the case.",
    domain: "General",
  },
  {
    term: "Motion in Limine",
    definition:
      "A pretrial motion requesting the court to prohibit the other side from presenting highly prejudicial evidence.",
    domain: "General",
  },
  {
    term: "Motion to lift the automatic stay",
    definition:
      "A request by a creditor to take action against the debtor or the debtor's property that would otherwise be prohibited by the automatic stay.",
    domain: "General",
  },
  {
    term: "No-asset case",
    definition:
      "A Chapter 7 case in which there are no non-exempt assets available to satisfy unsecured claims.",
    domain: "General",
  },
  {
    term: "Nolo contendere",
    definition:
      "Also called no contest; a plea with the same effect as guilty for sentencing but not necessarily an admission of guilt.",
    domain: "General",
  },
  {
    term: "Nondischargeable debt",
    definition:
      "A debt for which the debtor's personal liability is not allowed to be discharged in bankruptcy.",
    domain: "General",
  },
  {
    term: "Nonexempt assets",
    definition:
      "Property of a debtor that can be liquidated to satisfy claims of creditors.",
    domain: "General",
  },
  {
    term: "Objection to discharge",
    definition:
      "An objection to the debtor receiving a discharge, for reasons such as concealing property or making a false oath.",
    domain: "General",
  },
  {
    term: "Objection to dischargeability",
    definition:
      "An objection to the debtor being released from personal liability for certain debts.",
    domain: "General",
  },
  {
    term: "Objection to exemptions",
    definition:
      "An objection to the debtor's attempt to claim certain property as exempt.",
    domain: "General",
  },
  {
    term: "Opinion",
    definition:
      "A judge's written explanation of the decision of the court.",
    domain: "General",
  },
  {
    term: "Oral argument",
    definition:
      "An opportunity for lawyers and pro se parties to summarize their position before the court and answer judges' questions.",
    domain: "General",
  },
  {
    term: "Panel",
    definition:
      "A group of judges assigned to decide a case; also, the group of potential jurors or available court-appointed counsel.",
    domain: "General",
  },
  {
    term: "Parole",
    definition:
      "The release of a prison inmate after completing part of their sentence, placed under supervision of a probation officer.",
    domain: "General",
  },
  {
    term: "Party",
    definition:
      "An individual or entity involved in a legal action.",
    domain: "General",
  },
  {
    term: "Party in interest",
    definition:
      "A party who has standing to be heard by the court in a bankruptcy matter.",
    domain: "General",
  },
  {
    term: "Per curiam",
    definition:
      "Latin for \"for the court\"; often refers to an unsigned appellate opinion.",
    domain: "General",
  },
  {
    term: "Peremptory challenge",
    definition:
      "The right to exclude a certain number of prospective jurors without cause.",
    domain: "General",
  },
  {
    term: "Petit jury (or trial jury)",
    definition:
      "A group of citizens who hear the evidence at trial and determine the facts in dispute.",
    domain: "General",
  },
  {
    term: "Petition",
    definition:
      "A formal application in writing requesting judicial action.",
    domain: "General",
  },
  {
    term: "Petition preparer",
    definition:
      "A person or business not authorized to practice law that prepares bankruptcy petitions.",
    domain: "General",
  },
  {
    term: "Petty offense",
    definition:
      "A federal misdemeanor punishable by six months or less in prison.",
    domain: "General",
  },
  {
    term: "Plaintiff",
    definition:
      "A person or entity that files a civil lawsuit.",
    domain: "General",
  },
  {
    term: "Plan",
    definition:
      "A detailed proposal for how claims or interests of the debtor will be paid or treated if confirmed.",
    domain: "General",
  },
  {
    term: "Plea",
    definition:
      "The defendant's statement pleading \"guilty\" or \"not guilty\" in answer to the charges.",
    domain: "General",
  },
  {
    term: "Pleadings",
    definition:
      "Written statements filed with the court describing a party's legal or factual assertions.",
    domain: "General",
  },
  {
    term: "Postpetition transfer",
    definition:
      "A transfer of property of the bankruptcy estate made after the commencement of the case.",
    domain: "General",
  },
  {
    term: "Prebankruptcy planning",
    definition:
      "Arranging a debtor's property before bankruptcy to take maximum advantage of Bankruptcy Code provisions.",
    domain: "General",
  },
  {
    term: "Precedent",
    definition:
      "A court decision in an earlier case with similar facts and legal issues that judges will generally follow.",
    domain: "General",
  },
  {
    term: "Preference (bankruptcy)",
    definition:
      "A debt payment made to a creditor shortly before bankruptcy that may be avoided and recovered by the trustee.",
    domain: "General",
  },
  {
    term: "Presentence report",
    definition:
      "A report summarizing background information needed to determine an appropriate sentence.",
    domain: "General",
  },
  {
    term: "Pretrial conference",
    definition:
      "A meeting of the judge and lawyers prior to trial to discuss matters and set a schedule.",
    domain: "General",
  },
  {
    term: "Priority",
    definition:
      "The statutory ranking of unsecured claims determining the order in which they will be paid.",
    domain: "General",
  },
  {
    term: "Priority claim",
    definition:
      "An unsecured claim entitled to be paid ahead of other unsecured claims.",
    domain: "General",
  },
  {
    term: "Pro se",
    definition:
      "Representing oneself in court, without a lawyer.",
    domain: "General",
  },
  {
    term: "Pro tem",
    definition:
      "A temporary assignment of a judge to manage court proceedings when the regular judge is unavailable.",
    domain: "General",
  },
  {
    term: "Probation",
    definition:
      "A sentencing alternative to imprisonment under supervision of a probation officer.",
    domain: "General",
  },
  {
    term: "Probation officer",
    definition:
      "An officer who conducts presentence investigations and supervises released or probationary defendants.",
    domain: "General",
  },
  {
    term: "Procedure",
    definition:
      "The rules for conducting a case before the court.",
    domain: "General",
  },
  {
    term: "Proof of claim",
    definition:
      "A written statement describing the reason a debtor owes a creditor money and the amount owed.",
    domain: "General",
  },
  {
    term: "Property of the estate",
    definition:
      "All legal or equitable interests of the debtor in property as of the commencement of the case.",
    domain: "General",
  },
  {
    term: "Prosecute",
    definition:
      "To charge someone with a crime; a prosecutor tries a criminal case on behalf of the government.",
    domain: "General",
  },
  {
    term: "Reaffirmation agreement",
    definition:
      "An agreement under which a debtor continues paying a dischargeable debt after bankruptcy in exchange for keeping collateral.",
    domain: "General",
  },
  {
    term: "Recalled judge",
    definition:
      "A retired judge who returns to duty for a limited term.",
    domain: "General",
  },
  {
    term: "Record",
    definition:
      "The official documented account of the proceedings in a case.",
    domain: "General",
  },
  {
    term: "Redemption",
    definition:
      "A procedure whereby a debtor removes a secured creditor's lien on collateral by paying its value.",
    domain: "General",
  },
  {
    term: "Remand",
    definition:
      "The act of an appellate court sending a case to a lower court for further proceedings.",
    domain: "General",
  },
  {
    term: "Reverse",
    definition:
      "The act of a court setting aside the decision of a lower court.",
    domain: "General",
  },
  {
    term: "Sanction",
    definition:
      "A penalty or enforcement used to bring about compliance with the law or rules.",
    domain: "General",
  },
  {
    term: "Schedules",
    definition:
      "Detailed lists filed by the debtor showing assets, liabilities, and other financial information.",
    domain: "General",
  },
  {
    term: "Section 341 meeting",
    definition:
      "The meeting of creditors at which the debtor is questioned under oath about financial affairs.",
    domain: "General",
  },
  {
    term: "Secured creditor",
    definition:
      "A creditor with a lien securing some or all of its claim against the debtor.",
    domain: "General",
  },
  {
    term: "Secured debt",
    definition:
      "Debt backed by a mortgage, pledge of collateral, or other lien.",
    domain: "General",
  },
  {
    term: "Senior judge",
    definition:
      "A federal judge who, after meeting age and service requirements, takes senior status while continuing to perform judicial duties.",
    domain: "General",
  },
  {
    term: "Sentence",
    definition:
      "The punishment ordered by a court for a defendant convicted of a crime.",
    domain: "General",
  },
  {
    term: "Sentencing guidelines",
    definition:
      "Rules and principles trial judges use as a factor in determining a sentence.",
    domain: "General",
  },
  {
    term: "Sequester",
    definition:
      "To separate; juries are sometimes sequestered from outside influences during a trial.",
    domain: "General",
  },
  {
    term: "Service of process",
    definition:
      "The delivery of writs or summonses to the appropriate party.",
    domain: "General",
  },
  {
    term: "Settlement",
    definition:
      "Parties resolving their dispute without a trial, often involving payment but usually no admission of fault.",
    domain: "General",
  },
  {
    term: "Small business or Subchapter V case",
    definition:
      "Special categories of Chapter 11 for small business debtors, with accelerated deadlines.",
    domain: "General",
  },
  {
    term: "Standard of proof",
    definition:
      "The degree of proof required; \"beyond a reasonable doubt\" in criminal cases, \"preponderance of the evidence\" in most civil cases.",
    domain: "General",
  },
  {
    term: "Statement of financial affairs",
    definition:
      "A form the debtor completes concerning sources of income, transfers of property, and lawsuits by creditors.",
    domain: "General",
  },
  {
    term: "Statement of intention",
    definition:
      "A declaration by an individual Chapter 7 debtor of plans for dealing with property subject to security interests.",
    domain: "General",
  },
  {
    term: "Statute",
    definition:
      "A law passed by a legislature.",
    domain: "General",
  },
  {
    term: "Statute of limitations",
    definition:
      "The time within which a lawsuit must be filed or a criminal prosecution must begin.",
    domain: "General",
  },
  {
    term: "Sua sponte",
    definition:
      "Latin for \"of its own will\"; a court taking action without being asked to by any party.",
    domain: "General",
  },
  {
    term: "Subordination",
    definition:
      "The process by which a person's rights or claims are ranked below those of others.",
    domain: "General",
  },
  {
    term: "Subpoena",
    definition:
      "A command to a witness to appear and give testimony.",
    domain: "General",
  },
  {
    term: "Subpoena duces tecum",
    definition:
      "A command to a witness to appear and produce documents.",
    domain: "General",
  },
  {
    term: "Substantive consolidation",
    definition:
      "Pooling the assets and liabilities of two or more related debtors to pay creditors under a plan.",
    domain: "General",
  },
  {
    term: "Summary judgment",
    definition:
      "A decision made on statements and evidence without a trial, granted when one party is entitled to judgment as a matter of law.",
    domain: "General",
  },
  {
    term: "Temporary restraining order",
    definition:
      "A judge's short-term order forbidding certain actions until a full hearing can be conducted; often called a TRO.",
    domain: "General",
  },
  {
    term: "Testimony",
    definition:
      "Evidence presented by witnesses during trials or other legal proceedings.",
    domain: "General",
  },
  {
    term: "Toll",
    definition:
      "To stop the running of a time period, such as one set by a statute of limitations.",
    domain: "General",
  },
  {
    term: "Tort",
    definition:
      "A civil wrong or breach of a duty to another person, for which the victim may be entitled to sue.",
    domain: "General",
  },
  {
    term: "Transcript",
    definition:
      "A written, word-for-word record of what was said in a proceeding.",
    domain: "General",
  },
  {
    term: "Transfer",
    definition:
      "Any mode or means by which a debtor disposes of or parts with property.",
    domain: "General",
  },
  {
    term: "Trustee",
    definition:
      "A person appointed to represent the interests of the bankruptcy estate.",
    domain: "General",
  },
  {
    term: "U.S. attorney",
    definition:
      "A lawyer appointed by the President to prosecute and defend cases for the federal government in a judicial district.",
    domain: "General",
  },
  {
    term: "U.S. trustee",
    definition:
      "An officer of the Department of Justice responsible for supervising the administration of bankruptcy cases and trustees.",
    domain: "General",
  },
  {
    term: "Undersecured claim",
    definition:
      "A right to payment based on a debt secured by property worth less than the amount of the debt.",
    domain: "General",
  },
  {
    term: "Undue hardship (bankruptcy)",
    definition:
      "The legal standard for discharging most student debts in bankruptcy.",
    domain: "General",
  },
  {
    term: "Unlawful detainer action",
    definition:
      "A lawsuit by a landlord against a tenant to evict them, usually for nonpayment of rent.",
    domain: "General",
  },
  {
    term: "Unliquidated claim",
    definition:
      "A claim for which a specific value has not yet been determined.",
    domain: "General",
  },
  {
    term: "Unscheduled debt",
    definition:
      "A debt that should have been listed by the debtor but was not.",
    domain: "General",
  },
  {
    term: "Unsecured claim",
    definition:
      "A claim for which a creditor holds no security.",
    domain: "General",
  },
  {
    term: "Uphold",
    definition:
      "The appellate court agrees with the lower court decision and allows it to stand.",
    domain: "General",
  },
  {
    term: "Venue",
    definition:
      "The geographic area in which a case is filed and heard.",
    domain: "General",
  },
  {
    term: "Verdict",
    definition:
      "The decision of a trial jury or judge that determines guilt, innocence, or the final outcome of a civil case.",
    domain: "General",
  },
  {
    term: "Voir dire",
    definition:
      "A French phrase meaning \"to speak the truth\"; the process of selecting a trial jury by questioning prospective jurors.",
    domain: "General",
  },
  {
    term: "Wage garnishment",
    definition:
      "A non-bankruptcy proceeding whereby a creditor seeks to subject a debtor's future wages to their claim.",
    domain: "General",
  },
  {
    term: "Warrant",
    definition:
      "Court authorization, most often for law enforcement, to conduct a search or make an arrest.",
    domain: "General",
  },
  {
    term: "Witness",
    definition:
      "A person called upon in a case to give testimony before the court or jury.",
    domain: "General",
  },
  {
    term: "Writ",
    definition:
      "A written command or order, issued by the court, requiring the performance of a specific act.",
    domain: "General",
  },
  {
    term: "Writ of certiorari",
    definition:
      "An order issued by the U.S. Supreme Court directing the lower court to transmit records for a case it will hear on appeal.",
    domain: "General",
  },
];

const JUVENILE_GLOSSARY = [
  {
    term: "Action Step",
    definition:
      "A short term, small step the youth will take to achieve their overall case plan goal.",
    domain: "Corte Juvenil",
  },
  {
    term: "Adjudication",
    definition:
      "The finding in juvenile court that a youth committed a delinquent act (similar to a guilty finding in adult court), or that allegations of abuse, neglect, or dependency are true.",
    domain: "Corte Juvenil",
  },
  {
    term: "Affidavit",
    definition:
      "A written declaration or statement of facts, sworn to by oath or affirmation.",
    domain: "Corte Juvenil",
  },
  {
    term: "Apology Letter",
    definition:
      "A letter an individual writes to the victim of their offense expressing regret and a plan for positive change.",
    domain: "Corte Juvenil",
  },
  {
    term: "Appeal",
    definition:
      "A review by a higher court of a lower juvenile court's final judgment or decree.",
    domain: "Corte Juvenil",
  },
  {
    term: "Arraignment",
    definition:
      "The initial hearing after a petition is filed where the alleged offenses are read and the youth is asked to admit or deny them.",
    domain: "Corte Juvenil",
  },
  {
    term: "Assessment",
    definition:
      "When the probation officer gathers information from the youth and family to complete required risk assessments.",
    domain: "Corte Juvenil",
  },
  {
    term: "Behavior Change",
    definition:
      "The work a youth does to incorporate newly learned skills into daily life to avoid problematic situations in the future.",
    domain: "Corte Juvenil",
  },
  {
    term: "Case Plan",
    definition:
      "A plan created with the youth's input to address dynamic risk factors while under court jurisdiction, in order to change targeted behavior.",
    domain: "Corte Juvenil",
  },
  {
    term: "Chief Probation Officer",
    definition:
      "The probation executive who oversees the juvenile probation department of a district.",
    domain: "Corte Juvenil",
  },
  {
    term: "Child Welfare (CW)",
    definition:
      "Juvenile court cases not related to a delinquency offense, but to allegations of abuse, neglect, abandonment, or dependency.",
    domain: "Corte Juvenil",
  },
  {
    term: "Clerk of Court (COC)",
    definition:
      "The clerical executive who oversees the clerical department of a district.",
    domain: "Corte Juvenil",
  },
  {
    term: "Community-Based",
    definition:
      "A non-secure local placement option allowing a youth to receive treatment or intervention while still living at home.",
    domain: "Corte Juvenil",
  },
  {
    term: "Community Service",
    definition:
      "A consequence requiring a youth to work in the community to repay society for the harm caused by their actions.",
    domain: "Corte Juvenil",
  },
  {
    term: "Contempt of Court",
    definition:
      "Disrespect to the court or failure to obey its rules or orders.",
    domain: "Corte Juvenil",
  },
  {
    term: "Court Appointed Special Advocate (CASA)",
    definition:
      "A sworn volunteer appointed by a judge to advocate for a child's best interests in foster care cases.",
    domain: "Corte Juvenil",
  },
  {
    term: "Custodian",
    definition:
      "The person with physical and/or legal control of a youth, temporarily or permanently.",
    domain: "Corte Juvenil",
  },
  {
    term: "Custody",
    definition:
      "The physical and legal responsibility for a youth, usually from parenthood, adoption, or court assignment.",
    domain: "Corte Juvenil",
  },
  {
    term: "Defense Attorney",
    definition:
      "An attorney who represents a youth in the formal court process, protecting their rights and interests.",
    domain: "Corte Juvenil",
  },
  {
    term: "Delinquency",
    definition:
      "Conduct out of accord with accepted behavior or the law; the general category of matters before the court involving youth offenses.",
    domain: "Corte Juvenil",
  },
  {
    term: "Delinquent Youth",
    definition:
      "Youth under age 18 who have committed an act that is a crime.",
    domain: "Corte Juvenil",
  },
  {
    term: "Detention",
    definition:
      "Short-term locked confinement for delinquent youth awaiting adjudication, placement, or disposition.",
    domain: "Corte Juvenil",
  },
  {
    term: "Detention Hearing",
    definition:
      "A hearing held within 48 hours of a youth's admission to detention to decide whether the youth continues in detention, is returned home, or is placed elsewhere.",
    domain: "Corte Juvenil",
  },
  {
    term: "Disposition",
    definition:
      "A court order after adjudication, similar to the sentencing of an adult.",
    domain: "Corte Juvenil",
  },
  {
    term: "Expungement",
    definition:
      "A court order allowing the destruction or sealing of juvenile records after a specified period without another offense.",
    domain: "Corte Juvenil",
  },
  {
    term: "Felony",
    definition:
      "In juvenile court, an offense that would be a felony if committed by an adult, classified into capital, 1st, 2nd, and 3rd degree in Utah.",
    domain: "Corte Juvenil",
  },
  {
    term: "Formal Probation",
    definition:
      "A probation status for higher-risk youth needing additional court jurisdiction, interventions, and more intense supervision.",
    domain: "Corte Juvenil",
  },
  {
    term: "Guardian ad Litem (GAL)",
    definition:
      "An attorney appointed to represent the best interests of a youth, which may differ from the youth's own wishes.",
    domain: "Corte Juvenil",
  },
  {
    term: "Guardianship",
    definition:
      "A legal relationship giving a guardian rights and obligations to care for a child, without severing the parent-child relationship.",
    domain: "Corte Juvenil",
  },
  {
    term: "Hearing",
    definition:
      "A session held before a judge to decide issues of fact, of law, or both.",
    domain: "Corte Juvenil",
  },
  {
    term: "Home Detention",
    definition:
      "An alternative to locked detention allowing a youth to be confined at home if not a danger to themselves or the community.",
    domain: "Corte Juvenil",
  },
  {
    term: "Incentives",
    definition:
      "Items or areas of value that encourage a youth's motivation for change and compliance with court-ordered conditions.",
    domain: "Corte Juvenil",
  },
  {
    term: "Intake Probation",
    definition:
      "A probation status for lower-risk youth needing less court jurisdiction and limited supervision.",
    domain: "Corte Juvenil",
  },
  {
    term: "Juvenile Court Judge",
    definition:
      "The judicial official overseeing a youth's case under a \"one family, one judge\" philosophy.",
    domain: "Corte Juvenil",
  },
  {
    term: "Mediation",
    definition:
      "Resolution of a dispute between two people with the help of an independent third party.",
    domain: "Corte Juvenil",
  },
  {
    term: "Misdemeanor",
    definition:
      "A minor offense, lower than a felony, classified into Class A, B, and C in Utah.",
    domain: "Corte Juvenil",
  },
  {
    term: "Non-Compliance",
    definition:
      "When a youth fails to follow through with a probation request, court order, or engages in problematic behavior.",
    domain: "Corte Juvenil",
  },
  {
    term: "Nonjudicial Agreement (NJA)",
    definition:
      "A written agreement (also known as diversion) between a delinquent youth and a probation officer that avoids filing a petition with the court.",
    domain: "Corte Juvenil",
  },
  {
    term: "Offense",
    definition:
      "A matter referred to juvenile court alleging that a youth violated a law or ordinance.",
    domain: "Corte Juvenil",
  },
  {
    term: "Petition",
    definition:
      "A legal document describing the alleged offense committed by a youth, or alleging abuse, neglect, or dependency of a child.",
    domain: "Corte Juvenil",
  },
  {
    term: "Plea",
    definition:
      "The youth's formal response to an offense, entered as \"admit\" or \"deny.\"",
    domain: "Corte Juvenil",
  },
  {
    term: "Plea in Abeyance",
    definition:
      "When an offense admission is put on hold while the youth completes court-ordered requirements, after which the admission is withdrawn and offenses dismissed.",
    domain: "Corte Juvenil",
  },
  {
    term: "Probation Officer (PO)",
    definition:
      "An officer who supervises youth under juvenile court jurisdiction, completes assessments and case plans, and monitors compliance.",
    domain: "Corte Juvenil",
  },
  {
    term: "Prosecutor",
    definition:
      "A public official who represents the state or local jurisdiction during court proceedings.",
    domain: "Corte Juvenil",
  },
  {
    term: "Public Defender",
    definition:
      "A government lawyer appointed to provide free legal defense to a youth charged with an offense.",
    domain: "Corte Juvenil",
  },
  {
    term: "Recidivism",
    definition:
      "The commission of another offense after having previously been adjudicated of a prior offense.",
    domain: "Corte Juvenil",
  },
  {
    term: "Referral",
    definition:
      "A written report alleging that a juvenile committed an offense placing them within the jurisdiction of the juvenile court.",
    domain: "Corte Juvenil",
  },
  {
    term: "Restitution",
    definition:
      "Money, goods, or services assessed against a youth for an offense, to compensate a victim for their loss.",
    domain: "Corte Juvenil",
  },
  {
    term: "Review",
    definition:
      "A hearing before a juvenile court judge on the progress of a youth's case under continuing jurisdiction.",
    domain: "Corte Juvenil",
  },
  {
    term: "Secure Care",
    definition:
      "A secure facility for long-term placement of youth, similar to adult prisons.",
    domain: "Corte Juvenil",
  },
  {
    term: "Shelter Hearing",
    definition:
      "A court hearing held 72 hours after a child's removal from home in abuse, dependency, or neglect cases.",
    domain: "Corte Juvenil",
  },
  {
    term: "Status Offense",
    definition:
      "Misbehavior that would not be criminal for an adult but is an offense because of the youth's age, such as truancy.",
    domain: "Corte Juvenil",
  },
  {
    term: "Summons",
    definition:
      "A notice ordering a parent or guardian to appear in juvenile court with their youth at a set time and place.",
    domain: "Corte Juvenil",
  },
  {
    term: "Termination of Jurisdiction",
    definition:
      "The juvenile court concluding any control, authority, or interest in a case by court order.",
    domain: "Corte Juvenil",
  },
  {
    term: "Termination of Parental Rights (TPR)",
    definition:
      "The permanent elimination of all parental rights and duties by court order.",
    domain: "Corte Juvenil",
  },
  {
    term: "Trial",
    definition:
      "A formal, adversarial proceeding to determine facts and reach a decision on a contested matter.",
    domain: "Corte Juvenil",
  },
  {
    term: "Truant",
    definition:
      "A school-age youth who is absent from school without a legitimate or valid excuse.",
    domain: "Corte Juvenil",
  },
  {
    term: "Utah Juvenile Court",
    definition:
      "The Utah court with exclusive original jurisdiction over youth under 18 who violate the law, and children who are abused, neglected, or dependent.",
    domain: "Corte Juvenil",
  },
  {
    term: "Warrant",
    definition:
      "An order commanding a law enforcement officer to perform an arrest, search, or seizure.",
    domain: "Corte Juvenil",
  },
  {
    term: "Youth Court",
    definition:
      "A diversion program addressing minor offenses to prevent youth from entering the juvenile justice system.",
    domain: "Corte Juvenil",
  },
];

const SEED_GLOSSARY = [
  ...Object.entries(WEEK_CONTENT).flatMap(([week, data]) =>
    data.sections.flatMap((s) =>
      s.terms.map((t) => ({ ...t, week: Number(week), section: s.title }))
    )
  ),
  ...REFERENCE_GLOSSARY,
  ...JUVENILE_GLOSSARY,
];

function NavButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="pj-nav-button md:w-full text-left px-4 py-2.5 rounded-xl transition-all whitespace-nowrap shrink-0"
      style={{
        fontFamily: sans,
        fontSize: 13,
        fontWeight: active ? 600 : 500,
        color: active ? "#ffffff" : "#b9c5d8",
        backgroundColor: active ? "rgba(255,255,255,0.14)" : "transparent",
        border: active ? "1px solid rgba(255,255,255,0.13)" : "1px solid transparent",
        cursor: "pointer",
        boxShadow: active ? "0 8px 24px rgba(0,0,0,0.18)" : "none",
      }}
    >
      {children}
    </button>
  );
}

function WeekView({ week }) {
  const content = WEEK_CONTENT[week];
  const [openSection, setOpenSection] = useState(null);

  return (
    <div className="pj-page">
      <header className="pj-hero">
        <div className="pj-hero-copy">
          <span className="pj-eyebrow">PROGRAMA DE CERTIFICACIÓN · UTAH</span>
          <h1 style={{ fontFamily: serif }}>Semana {week}</h1>
          <p>
            {content
              ? "Domina el vocabulario, los conceptos y el lenguaje preciso de esta sesión."
              : "Aún no hay contenido cargado para esta semana."}
          </p>
        </div>
        {content && (
          <div className="pj-hero-stats" aria-label="Resumen de la semana">
            <div><strong>{content.sections.length}</strong><span>temas</span></div>
            <div><strong>{content.sections.reduce((n, s) => n + s.terms.length, 0)}</strong><span>términos</span></div>
          </div>
        )}
      </header>

      {content ? (
        <section className="pj-study-section mt-6">
          <h2
            style={{
              fontFamily: serif,
              color: C.text,
              fontSize: 19,
              fontWeight: 700,
              letterSpacing: "-0.3px",
              margin: "0 0 14px 0",
            }}
          >
            Temario de la clase
          </h2>
          <div className="flex flex-col gap-3">
            {content.sections.map((s, i) => {
              const isOpen = openSection === s.title;
              return (
                <div
                  key={s.title}
                  className={`pj-topic-card ${isOpen ? "is-open" : ""}`}
                  style={{
                    backgroundColor: C.card,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <button
                    onClick={() => setOpenSection(isOpen ? null : s.title)}
                    className="w-full px-4 py-4 flex items-center gap-3 text-left"
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                  >
                    <span
                      style={{
                        fontFamily: serif,
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#ffffff",
                        background: C.accent,
                        width: 28,
                        height: 28,
                        borderRadius: 9,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span
                      style={{
                        fontFamily: sans,
                        fontSize: 14,
                        fontWeight: 600,
                        color: C.text,
                        flex: 1,
                      }}
                    >
                      {s.title}
                    </span>
                    <span className="pj-count-pill" style={{ fontFamily: sans }}>
                      {s.terms.length}
                    </span>
                  </button>
                  {isOpen && (
                    <div
                      className="pj-topic-content px-4 pb-4 flex flex-col gap-2"
                      style={{ borderTop: `1px solid ${C.border}` }}
                    >
                      {s.terms.map((t) => (
                        <div key={t.term} className="pt-2">
                          <p
                            style={{
                              fontFamily: sans,
                              fontSize: 13,
                              color: C.text,
                              margin: 0,
                            }}
                          >
                            {t.term}
                            {t.es && (
                              <span
                                style={{
                                  fontStyle: "italic",
                                  color: C.accent,
                                  marginLeft: 6,
                                }}
                              >
                                — {t.es}
                              </span>
                            )}
                          </p>
                          <p
                            style={{
                              fontFamily: sans,
                              fontSize: 12,
                              color: C.muted,
                              margin: "3px 0 0 0",
                              lineHeight: 1.4,
                            }}
                          >
                            {t.definition}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="mt-6">
          <div
            className="rounded p-4"
            style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}
          >
            <p style={{ fontFamily: sans, color: C.muted, fontSize: 13, margin: 0 }}>
              Sube la guía de la clase cuando la tengas.
            </p>
          </div>
        </section>
      )}

      {content && (
        <section className="mt-5">
          <h2
            style={{
              fontFamily: serif,
              color: C.accent,
              fontSize: 17,
              margin: "0 0 8px 0",
            }}
          >
            Autoevaluación rápida
          </h2>
          <FillBlank
            terms={content.sections.flatMap((s) => s.terms)}
          />
        </section>
      )}
    </div>
  );
}

function normalizeAnswer(s) {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function FillBlank({ terms }) {
  const [order, setOrder] = useState(() => shuffle(terms));
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(null); // null | "correct" | "wrong"
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const current = order[idx];
  const done = idx >= order.length;

  function check() {
    if (!answer.trim() || checked) return;
    const isCorrect = normalizeAnswer(answer) === normalizeAnswer(current.term);
    setChecked(isCorrect ? "correct" : "wrong");
    setScore((s) => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      total: s.total + 1,
    }));
  }

  function next() {
    setAnswer("");
    setChecked(null);
    setIdx((i) => i + 1);
  }

  if (order.length === 0) return null;

  if (done) {
    return (
      <div
        className="rounded p-4 text-center"
        style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}
      >
        <img
          src={LOGO_URI}
          alt=""
          style={{ width: 26, height: 26, margin: "0 auto 8px auto", display: "block", opacity: 0.18 }}
        />
        <p style={{ fontFamily: serif, fontSize: 18, color: C.text, margin: 0 }}>
          {score.correct} de {score.total} correctas
        </p>
        <button
          onClick={() => {
            setOrder(shuffle(terms));
            setIdx(0);
            setAnswer("");
            setChecked(null);
            setScore({ correct: 0, total: 0 });
          }}
          className="mt-3"
          style={{
            fontFamily: sans,
            fontSize: 13,
            padding: "6px 14px",
            borderRadius: 4,
            border: `1px solid ${C.border}`,
            backgroundColor: "transparent",
            color: C.text,
            cursor: "pointer",
          }}
        >
          Repetir
        </button>
      </div>
    );
  }

  return (
    <div
      className="rounded p-4"
      style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}
    >
      <p style={{ fontFamily: sans, fontSize: 11, color: C.label, margin: 0 }}>
        {idx + 1} de {order.length} · {score.correct} correctas hasta ahora
      </p>
      <p
        style={{
          fontFamily: sans,
          fontSize: 14,
          color: C.text,
          lineHeight: 1.5,
          margin: "8px 0 0 0",
        }}
      >
        {current.definition}
      </p>

      <input
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && (checked ? next() : check())}
        placeholder="Escribe el término en inglés..."
        disabled={!!checked}
        className="w-full rounded px-3 py-2 mt-3"
        style={{
          fontFamily: sans,
          fontSize: 14,
          color: C.text,
          backgroundColor: C.bg,
          border: `1px solid ${
            checked === "correct"
              ? "#8a9e7a"
              : checked === "wrong"
              ? "#b06a5a"
              : C.border
          }`,
          outline: "none",
        }}
      />

      {checked && (
        <p
          style={{
            fontFamily: sans,
            fontSize: 13,
            color: checked === "correct" ? "#8a9e7a" : "#c8936a",
            margin: "8px 0 0 0",
          }}
        >
          {checked === "correct"
            ? "Correcto."
            : `La respuesta era: ${current.term}`}
          {current.es && (
            <span style={{ color: C.muted }}> — {current.es}</span>
          )}
        </p>
      )}

      <button
        onClick={checked ? next : check}
        className="mt-3"
        style={{
          fontFamily: sans,
          fontSize: 13,
          padding: "8px 16px",
          borderRadius: 4,
          border: "none",
          backgroundColor: C.accent,
          color: C.bg,
          cursor: "pointer",
        }}
      >
        {checked ? "Siguiente" : "Comprobar"}
      </button>
    </div>
  );
}

function GlossaryView({ terms }) {
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState(null);
  const [openTerm, setOpenTerm] = useState(null);

  const letters = useMemo(() => {
    const set = new Set(terms.map((t) => t.term[0].toUpperCase()));
    return Array.from(set).sort();
  }, [terms]);

  const filtered = useMemo(() => {
    let list = terms;
    if (letter) list = list.filter((t) => t.term[0].toUpperCase() === letter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.term.toLowerCase().includes(q) ||
          (t.es && t.es.toLowerCase().includes(q)) ||
          t.definition.toLowerCase().includes(q)
      );
    }
    return list;
  }, [terms, letter, query]);

  return (
    <div>
      <h1
        style={{ fontFamily: serif, color: C.text, fontSize: 30, margin: 0 }}
      >
        Glosario jurídico
      </h1>
      <p style={{ fontFamily: sans, color: C.muted, fontSize: 14, marginTop: 4 }}>
        {terms.length} términos · inglés y español · busca por palabra o navega por letra
      </p>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar término o definición..."
        className="w-full rounded px-3 py-2 mt-5"
        style={{
          fontFamily: sans,
          fontSize: 14,
          color: C.text,
          backgroundColor: C.card,
          border: `1px solid ${C.border}`,
          outline: "none",
        }}
      />

      <div className="flex flex-wrap gap-1 mt-3">
        <button
          onClick={() => setLetter(null)}
          style={{
            fontFamily: sans,
            fontSize: 12,
            padding: "4px 9px",
            borderRadius: 4,
            border: `1px solid ${C.border}`,
            backgroundColor: letter === null ? C.accent : "transparent",
            color: letter === null ? C.bg : C.muted,
            cursor: "pointer",
          }}
        >
          Todas
        </button>
        {letters.map((l) => (
          <button
            key={l}
            onClick={() => setLetter(l)}
            style={{
              fontFamily: sans,
              fontSize: 12,
              padding: "4px 9px",
              borderRadius: 4,
              border: `1px solid ${C.border}`,
              backgroundColor: letter === l ? C.accent : "transparent",
              color: letter === l ? C.bg : C.muted,
              cursor: "pointer",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-2">
        {filtered.length === 0 && (
          <p style={{ fontFamily: sans, color: C.muted, fontSize: 13 }}>
            Sin resultados para esa búsqueda.
          </p>
        )}
        {filtered.map((t) => {
          const isOpen = openTerm === t.term;
          return (
            <div
              key={t.term}
              className="rounded"
              style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}
            >
              <button
                onClick={() => setOpenTerm(isOpen ? null : t.term)}
                className="w-full text-left px-4 py-3 flex items-center justify-between gap-3"
                style={{
                  fontFamily: sans,
                  fontSize: 14,
                  color: C.text,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <span>
                  {t.term}
                  {t.es && (
                    <span
                      style={{
                        display: "block",
                        fontStyle: "italic",
                        color: C.accent,
                        fontSize: 12,
                        marginTop: 2,
                      }}
                    >
                      {t.es}
                    </span>
                  )}
                </span>
                {(t.week || t.domain) && (
                  <span
                    style={{
                      fontSize: 11,
                      color: C.label,
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {t.week ? `Semana ${t.week}` : t.domain}
                  </span>
                )}
              </button>
              {isOpen && (
                <div className="px-4 pb-4">
                  <p
                    style={{
                      fontFamily: sans,
                      fontSize: 13,
                      color: C.muted,
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {t.definition}
                  </p>
                  {t.context && (
                    <p
                      className="mt-3 pl-3"
                      style={{
                        fontFamily: sans,
                        fontSize: 13,
                        fontStyle: "italic",
                        color: C.text,
                        margin: "12px 0 0 0",
                        borderLeft: `2px solid ${C.accent}`,
                        lineHeight: 1.5,
                      }}
                    >
                      {t.context}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FlashcardsView({ terms }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const term = terms[idx];

  function next() {
    setFlipped(false);
    setIdx((idx + 1) % terms.length);
  }
  function prev() {
    setFlipped(false);
    setIdx((idx - 1 + terms.length) % terms.length);
  }

  return (
    <div>
      <h1
        style={{ fontFamily: serif, color: C.text, fontSize: 30, margin: 0 }}
      >
        Flashcards
      </h1>
      <p style={{ fontFamily: sans, color: C.muted, fontSize: 14, marginTop: 4 }}>
        Tarjeta {idx + 1} de {terms.length}
      </p>

      <div
        onClick={() => setFlipped(!flipped)}
        className="mt-6 rounded flex flex-col items-center justify-center text-center p-8"
        style={{
          backgroundColor: C.card,
          border: `1px solid ${C.border}`,
          minHeight: 220,
          cursor: "pointer",
        }}
      >
        {flipped ? (
          <>
            {term.es && (
              <p
                style={{
                  fontFamily: serif,
                  fontSize: 19,
                  fontStyle: "italic",
                  color: C.accent,
                  margin: "0 0 12px 0",
                }}
              >
                {term.es}
              </p>
            )}
            <p
              style={{
                fontFamily: sans,
                fontSize: 14,
                color: C.text,
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {term.definition}
            </p>
            {term.context && (
              <p
                style={{
                  fontFamily: sans,
                  fontSize: 13,
                  fontStyle: "italic",
                  color: C.muted,
                  lineHeight: 1.5,
                  margin: "14px 0 0 0",
                }}
              >
                {term.context}
              </p>
            )}
          </>
        ) : (
          <p
            style={{
              fontFamily: serif,
              fontSize: 24,
              color: C.text,
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            {term.term}
          </p>
        )}
      </div>
      <p
        className="text-center mt-2"
        style={{ fontFamily: sans, fontSize: 12, color: C.label }}
      >
        toca la tarjeta para {flipped ? "ver el término" : "ver la definición"}
      </p>

      <div className="flex justify-center gap-3 mt-5">
        <button
          onClick={prev}
          style={{
            fontFamily: sans,
            fontSize: 13,
            padding: "8px 16px",
            borderRadius: 4,
            border: `1px solid ${C.border}`,
            backgroundColor: "transparent",
            color: C.text,
            cursor: "pointer",
          }}
        >
          Anterior
        </button>
        <button
          onClick={next}
          style={{
            fontFamily: sans,
            fontSize: 13,
            padding: "8px 16px",
            borderRadius: 4,
            border: "none",
            backgroundColor: C.accent,
            color: C.bg,
            cursor: "pointer",
          }}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

function ResourceCard({ title, subtitle, note, url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="block rounded px-3 py-3"
      style={{
        backgroundColor: C.card,
        border: `1px solid ${C.border}`,
        textDecoration: "none",
      }}
    >
      <p
        style={{
          fontFamily: serif,
          fontSize: 14,
          color: C.text,
          margin: 0,
        }}
      >
        {title}
      </p>
      {subtitle && (
        <p
          style={{
            fontFamily: sans,
            fontSize: 12,
            fontStyle: "italic",
            color: C.accent,
            margin: "3px 0 0 0",
          }}
        >
          {subtitle}
        </p>
      )}
      {note && (
        <p
          style={{
            fontFamily: sans,
            fontSize: 12,
            color: C.muted,
            lineHeight: 1.5,
            margin: "6px 0 0 0",
          }}
        >
          {note}
        </p>
      )}
    </a>
  );
}

function ResourcesView({ data }) {
  return (
    <div>
      <h1 style={{ fontFamily: serif, color: C.text, fontSize: 30, margin: 0 }}>
        Recursos del intérprete
      </h1>
      <p style={{ fontFamily: sans, color: C.muted, fontSize: 14, marginTop: 4 }}>
        Libros, video y fuentes oficiales
      </p>

      <section className="mt-6">
        <h2
          style={{
            fontFamily: serif,
            color: C.accent,
            fontSize: 17,
            margin: "0 0 8px 0",
          }}
        >
          Libros
        </h2>
        <div className="flex flex-col gap-2">
          {data.books.map((b) => (
            <ResourceCard
              key={b.title}
              title={b.title}
              subtitle={b.author}
              note={b.note}
              url={b.url}
            />
          ))}
        </div>
      </section>

      <section className="mt-5">
        <h2
          style={{
            fontFamily: serif,
            color: C.accent,
            fontSize: 17,
            margin: "0 0 8px 0",
          }}
        >
          Video
        </h2>
        {data.videos.length === 0 ? (
          <div
            className="rounded p-4"
            style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}
          >
            <p style={{ fontFamily: sans, color: C.muted, fontSize: 13, margin: 0 }}>
              Aún no hay video agregado.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {data.videos.map((v) => (
              <ResourceCard
                key={v.title}
                title={v.title}
                subtitle={v.author}
                note={v.note}
                url={v.url}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mt-5 mb-2">
        <h2
          style={{
            fontFamily: serif,
            color: C.accent,
            fontSize: 17,
            margin: "0 0 8px 0",
          }}
        >
          Fuentes oficiales
        </h2>
        <div className="flex flex-col gap-1">
          {data.officialSources.map((s) => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              style={{
                fontFamily: sans,
                fontSize: 12,
                color: C.accent,
                textDecoration: "none",
              }}
            >
              {s.title}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

function CaseView({ data }) {
  return (
    <div>
      <h1 style={{ fontFamily: serif, color: C.text, fontSize: 30, margin: 0 }}>
        Caso de la semana
      </h1>
      <p style={{ fontFamily: sans, color: C.muted, fontSize: 14, marginTop: 4 }}>
        {data.dateLabel}
      </p>

      <h2
        style={{
          fontFamily: serif,
          color: C.accent,
          fontSize: 19,
          margin: "20px 0 8px 0",
        }}
      >
        {data.title}
      </h2>
      <p
        style={{
          fontFamily: sans,
          fontSize: 14,
          color: C.text,
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {data.summary}
      </p>

      <section className="mt-5">
        <h3
          style={{
            fontFamily: serif,
            color: C.accent,
            fontSize: 16,
            margin: "0 0 8px 0",
          }}
        >
          Cómo cambiaron los cargos
        </h3>
        <div
          className="rounded overflow-hidden"
          style={{ border: `1px solid ${C.border}` }}
        >
          {data.chargeChanges.map((c, i) => (
            <div
              key={i}
              className="px-3 py-2 flex items-center justify-between gap-3"
              style={{
                backgroundColor: i % 2 === 0 ? C.card : C.bg,
                borderTop: i === 0 ? "none" : `1px solid ${C.border}`,
              }}
            >
              <span style={{ fontFamily: sans, fontSize: 13, color: C.muted }}>
                {c.original}
              </span>
              <span style={{ fontFamily: sans, fontSize: 11, color: C.label }}>
                →
              </span>
              <span
                style={{
                  fontFamily: sans,
                  fontSize: 13,
                  color: C.text,
                  textAlign: "right",
                }}
              >
                {c.result}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5">
        <h3
          style={{
            fontFamily: serif,
            color: C.accent,
            fontSize: 16,
            margin: "0 0 8px 0",
          }}
        >
          Terminología en contexto
        </h3>
        <div className="flex flex-col gap-2">
          {data.connections.map((c, i) => (
            <p
              key={i}
              className="rounded px-3 py-2"
              style={{
                backgroundColor: C.card,
                border: `1px solid ${C.border}`,
                fontFamily: sans,
                fontSize: 13,
                color: C.text,
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {c}
            </p>
          ))}
        </div>
      </section>

      <section className="mt-5 mb-2">
        <h3
          style={{
            fontFamily: serif,
            color: C.accent,
            fontSize: 16,
            margin: "0 0 8px 0",
          }}
        >
          Fuentes
        </h3>
        <div className="flex flex-col gap-1">
          {data.sources.map((s, i) => (
            <a
              key={i}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              style={{
                fontFamily: sans,
                fontSize: 12,
                color: C.accent,
                textDecoration: "none",
              }}
            >
              {s.title}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

function buildMCQuestions(terms, count) {
  const pool = shuffle(terms).slice(0, count);
  return pool.map((t) => {
    const qWord = t.term.toLowerCase();
    // Evita distractores que compartan raíz de palabra con el término preguntado
    // (ej. "Arson" vs "First degree arson") o que la repitan en su definición.
    const isSafe = (x) =>
      x.term !== t.term &&
      !x.term.toLowerCase().includes(qWord) &&
      !qWord.includes(x.term.toLowerCase()) &&
      !x.definition.toLowerCase().includes(qWord);

    const tag = t.section || t.domain;
    const sameTag = terms.filter((x) => isSafe(x) && (x.section || x.domain) === tag);
    const rest = terms.filter((x) => isSafe(x) && (x.section || x.domain) !== tag);
    // Prioriza distractores del mismo tema/dominio; si no hay suficientes, rellena con el resto.
    const distractorSource = shuffle(sameTag)
      .slice(0, 2)
      .concat(shuffle(rest))
      .slice(0, 2);
    const options = shuffle([
      { text: t.definition, correct: true },
      ...distractorSource.map((d) => ({ text: d.definition, correct: false })),
    ]);
    return { term: t.term, es: t.es, options };
  });
}

function shareRoot(a, b) {
  const x = a.toLowerCase();
  const y = b.toLowerCase();
  return x !== y && (x.includes(y) || y.includes(x));
}

function pickDistinctTerms(terms, count) {
  const shuffled = shuffle(terms);
  const chosen = [];
  for (const t of shuffled) {
    if (chosen.length >= count) break;
    if (chosen.some((c) => shareRoot(c.term, t.term))) continue;
    chosen.push(t);
  }
  return chosen;
}

function MatchView() {
  const weekNumbers = Object.keys(WEEK_CONTENT).map(Number);
  const [scope, setScope] = useState(weekNumbers[0] || "all");

  const scopePool = useMemo(() => {
    if (scope === "all") return SEED_GLOSSARY;
    return SEED_GLOSSARY.filter((t) => t.week === scope);
  }, [scope]);

  const [pairs, setPairs] = useState(() => pickDistinctTerms(scopePool, 5));
  const [rightOrder, setRightOrder] = useState(() => shuffle(pairs));
  const [leftSel, setLeftSel] = useState(null);
  const [matched, setMatched] = useState(new Set());
  const [wrong, setWrong] = useState(null); // { leftTerm, rightTerm } briefly

  function newRound(pool) {
    const fresh = pickDistinctTerms(pool, 5);
    setPairs(fresh);
    setRightOrder(shuffle(fresh));
    setLeftSel(null);
    setMatched(new Set());
    setWrong(null);
  }

  function changeScope(s) {
    setScope(s);
    const pool = s === "all" ? SEED_GLOSSARY : SEED_GLOSSARY.filter((t) => t.week === s);
    newRound(pool);
  }

  function pickLeft(term) {
    if (matched.has(term)) return;
    setLeftSel(term);
  }

  function pickRight(term) {
    if (matched.has(term) || leftSel === null) return;
    if (leftSel === term) {
      setMatched((m) => new Set([...m, term]));
      setLeftSel(null);
    } else {
      setWrong({ left: leftSel, right: term });
      setTimeout(() => setWrong(null), 500);
      setLeftSel(null);
    }
  }

  const done = pairs.length > 0 && matched.size === pairs.length;

  return (
    <div>
      <h1 style={{ fontFamily: serif, color: C.text, fontSize: 30, margin: 0 }}>
        Relacionar
      </h1>
      <p style={{ fontFamily: sans, color: C.muted, fontSize: 14, marginTop: 4 }}>
        Toca un término y luego su definición
      </p>

      <div className="flex flex-wrap gap-1 mt-4">
        {weekNumbers.map((w) => (
          <button
            key={w}
            onClick={() => changeScope(w)}
            style={{
              fontFamily: sans,
              fontSize: 12,
              padding: "4px 10px",
              borderRadius: 4,
              border: `1px solid ${C.border}`,
              backgroundColor: scope === w ? C.accent : "transparent",
              color: scope === w ? C.bg : C.muted,
              cursor: "pointer",
            }}
          >
            Semana {w}
          </button>
        ))}
        <button
          onClick={() => changeScope("all")}
          style={{
            fontFamily: sans,
            fontSize: 12,
            padding: "4px 10px",
            borderRadius: 4,
            border: `1px solid ${C.border}`,
            backgroundColor: scope === "all" ? C.accent : "transparent",
            color: scope === "all" ? C.bg : C.muted,
            cursor: "pointer",
          }}
        >
          Todo
        </button>
      </div>

      {done ? (
        <div
          className="mt-6 rounded p-4 text-center"
          style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}
        >
          <img
            src={LOGO_URI}
            alt=""
            style={{ width: 26, height: 26, margin: "0 auto 8px auto", display: "block", opacity: 0.18 }}
          />
          <p style={{ fontFamily: serif, fontSize: 18, color: C.text, margin: 0 }}>
            Tanda completa
          </p>
          <button
            onClick={() => newRound(scopePool)}
            className="mt-3"
            style={{
              fontFamily: sans,
              fontSize: 13,
              padding: "6px 14px",
              borderRadius: 4,
              border: `1px solid ${C.border}`,
              backgroundColor: "transparent",
              color: C.text,
              cursor: "pointer",
            }}
          >
            Nueva tanda
          </button>
        </div>
      ) : (
        (() => {
          const visLeft = pairs.filter((p) => !matched.has(p.term));
          const visRight = rightOrder.filter((p) => !matched.has(p.term));
          return (
            <div
              className="mt-6"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                gap: "8px",
                alignItems: "stretch",
              }}
            >
              {visLeft.map((p, i) => (
                <button
                  key={p.term}
                  onClick={() => pickLeft(p.term)}
                  className="rounded px-3 py-2 flex items-center justify-center text-center"
                  style={{
                    gridColumn: 1,
                    gridRow: i + 1,
                    fontFamily: sans,
                    fontSize: 13,
                    color: leftSel === p.term ? C.bg : C.text,
                    backgroundColor:
                      wrong && wrong.left === p.term
                        ? "rgba(176,106,90,0.14)"
                        : leftSel === p.term
                        ? C.accent
                        : C.card,
                    border: `1px solid ${C.border}`,
                    cursor: "pointer",
                  }}
                >
                  {p.term}
                </button>
              ))}
              {visRight.map((p, i) => (
                <button
                  key={p.term}
                  onClick={() => pickRight(p.term)}
                  className="text-left rounded px-3 py-2 flex items-center"
                  style={{
                    gridColumn: 2,
                    gridRow: i + 1,
                    fontFamily: sans,
                    fontSize: 13,
                    color: C.muted,
                    backgroundColor:
                      wrong && wrong.right === p.term
                        ? "rgba(176,106,90,0.14)"
                        : C.card,
                    border: `1px solid ${C.border}`,
                    cursor: leftSel === null ? "default" : "pointer",
                    lineHeight: 1.5,
                    opacity: leftSel === null ? 0.6 : 1,
                  }}
                >
                  {p.definition}
                </button>
              ))}
            </div>
          );
        })()
      )}
    </div>
  );
}

function QuizView({ terms }) {
  const [freshOrder, setFreshOrder] = useState(() => buildMCQuestions(terms, 15));
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const current = freshOrder[idx];
  const done = idx >= freshOrder.length;

  function choose(i) {
    if (selected !== null) return;
    setSelected(i);
    setScore((s) => ({
      correct: s.correct + (current.options[i].correct ? 1 : 0),
      total: s.total + 1,
    }));
  }

  function next() {
    setSelected(null);
    setIdx((i) => i + 1);
  }

  function restart() {
    setFreshOrder(buildMCQuestions(terms, 15));
    setIdx(0);
    setSelected(null);
    setScore({ correct: 0, total: 0 });
  }

  if (terms.length === 0) return null;

  return (
    <div>
      <h1 style={{ fontFamily: serif, color: C.text, fontSize: 30, margin: 0 }}>
        Quiz
      </h1>

      {done ? (
        <div
          className="mt-6 rounded p-4 text-center"
          style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}
        >
          <img
            src={LOGO_URI}
            alt=""
            style={{ width: 26, height: 26, margin: "0 auto 8px auto", display: "block", opacity: 0.18 }}
          />
          <p style={{ fontFamily: serif, fontSize: 18, color: C.text, margin: 0 }}>
            {score.correct} de {score.total} correctas
          </p>
          <button
            onClick={restart}
            className="mt-3"
            style={{
              fontFamily: sans,
              fontSize: 13,
              padding: "6px 14px",
              borderRadius: 4,
              border: `1px solid ${C.border}`,
              backgroundColor: "transparent",
              color: C.text,
              cursor: "pointer",
            }}
          >
            Repetir con preguntas nuevas
          </button>
        </div>
      ) : (
        <div
          className="mt-6 rounded p-4"
          style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}
        >
          <p style={{ fontFamily: sans, fontSize: 11, color: C.label, margin: 0 }}>
            {idx + 1} de {freshOrder.length} · {score.correct} correctas hasta ahora
          </p>
          <p
            style={{
              fontFamily: serif,
              fontSize: 19,
              color: C.text,
              margin: "8px 0 4px 0",
            }}
          >
            {current.term}
          </p>
          {current.es && (
            <p
              style={{
                fontFamily: sans,
                fontSize: 13,
                fontStyle: "italic",
                color: C.accent,
                margin: "0 0 12px 0",
              }}
            >
              {current.es}
            </p>
          )}

          <div className="flex flex-col gap-2 mt-2">
            {current.options.map((opt, i) => {
              const isChosen = selected === i;
              const showResult = selected !== null;
              let bg = C.bg;
              if (showResult && opt.correct) bg = "rgba(138,158,122,0.14)";
              else if (showResult && isChosen && !opt.correct)
                bg = "rgba(176,106,90,0.14)";
              return (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  disabled={selected !== null}
                  className="text-left rounded px-3 py-2 flex items-start gap-2"
                  style={{
                    fontFamily: sans,
                    fontSize: 13,
                    color: C.text,
                    backgroundColor: bg,
                    border: `1px solid ${C.border}`,
                    cursor: selected === null ? "pointer" : "default",
                    lineHeight: 1.4,
                  }}
                >
                  <span style={{ flex: 1 }}>{opt.text}</span>
                  {showResult && opt.correct && (
                    <span
                      style={{
                        color: "#8a9e7a",
                        fontSize: 13,
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </span>
                  )}
                  {showResult && isChosen && !opt.correct && (
                    <span
                      style={{
                        color: "#b06a5a",
                        fontSize: 13,
                        flexShrink: 0,
                      }}
                    >
                      ✗
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <button
              onClick={next}
              className="mt-4"
              style={{
                fontFamily: sans,
                fontSize: 13,
                padding: "8px 16px",
                borderRadius: 4,
                border: "none",
                backgroundColor: C.accent,
                color: C.bg,
                cursor: "pointer",
              }}
            >
              Siguiente
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [section, setSection] = useState("semana-1");

  return (
    <div
      className="flex flex-col md:flex-row w-full min-h-screen"
      style={{ backgroundColor: C.bg }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`}</style>
      <aside
        className="pj-sidebar w-full md:w-64 shrink-0 p-3 md:p-5 flex flex-col md:sticky md:top-0 md:h-screen"
        style={{
          backgroundColor: C.navy,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          borderRight: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "12px 0 36px rgba(11, 23, 48, 0.12)",
          backdropFilter: "blur(14px)",
        }}
      >
        <div className="mb-3 md:mb-6 px-1 md:px-2 flex items-center gap-3">
          <span
            className="flex items-center justify-center rounded-full"
            style={{
              width: 46,
              height: 46,
              backgroundColor: "#ffffff",
              border: "1px solid rgba(255,255,255,0.25)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              flexShrink: 0,
            }}
          >
            <img
              src={LOGO_URI}
              alt=""
              style={{ width: 32, height: 32, opacity: 0.95 }}
            />
          </span>
          <div>
            <p
              style={{
                fontFamily: brand,
                fontWeight: 700,
                color: "#ffffff",
                fontSize: 16,
                letterSpacing: "-0.2px",
                margin: 0,
              }}
            >
              Palabra Justa
            </p>
            <p
              style={{
                fontFamily: sans,
                color: "#8190a8",
                fontSize: 11,
                margin: "1px 0 0 0",
              }}
            >
              Interpretación judicial · Utah
            </p>
          </div>
        </div>

        <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-1 md:pb-0">
          {WEEKS.map((w) => (
            <NavButton
              key={w}
              active={section === `semana-${w}`}
              onClick={() => setSection(`semana-${w}`)}
            >
              Semana {w}
            </NavButton>
          ))}

          <div
            className="hidden md:block my-2"
            style={{ borderTop: "1px solid rgba(255,255,255,0.09)" }}
          />

          <NavButton
            active={section === "caso"}
            onClick={() => setSection("caso")}
          >
            Caso de la semana
          </NavButton>
          <NavButton
            active={section === "recursos"}
            onClick={() => setSection("recursos")}
          >
            Recursos
          </NavButton>

          <div
            className="hidden md:block my-2"
            style={{ borderTop: "1px solid rgba(255,255,255,0.09)" }}
          />

          <NavButton
            active={section === "glosario"}
            onClick={() => setSection("glosario")}
          >
            Glosario
          </NavButton>
          <NavButton
            active={section === "flashcards"}
            onClick={() => setSection("flashcards")}
          >
            Flashcards
          </NavButton>
          <NavButton
            active={section === "match"}
            onClick={() => setSection("match")}
          >
            Relacionar
          </NavButton>
          <NavButton
            active={section === "quiz"}
            onClick={() => setSection("quiz")}
          >
            Quiz
          </NavButton>
        </div>
      </aside>

      <main className="pj-main flex-1 w-full min-w-0 px-4 py-6 md:px-10 md:py-10 lg:px-14">
        <div style={{ width: "100%", maxWidth: 1040, margin: "0 auto" }}>
        {section.startsWith("semana-") && (
          <WeekView week={Number(section.split("-")[1])} />
        )}
        {section === "caso" && <CaseView data={CASE_OF_THE_WEEK} />}
        {section === "recursos" && <ResourcesView data={RESOURCES} />}
        {section === "glosario" && <GlossaryView terms={SEED_GLOSSARY} />}
        {section === "flashcards" && <FlashcardsView terms={SEED_GLOSSARY} />}
        {section === "match" && <MatchView />}
        {section === "quiz" && <QuizView terms={SEED_GLOSSARY} />}
        </div>
      </main>
    </div>
  );
}
