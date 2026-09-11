import { useState, useMemo, useEffect } from "react";

// ---- Tokens (Wasatch palette) ----
const C = {
  bg: "#FFFFFF",
  card: "#F6F8FB",
  border: "#DCE1E8",
  text: "#1B1F27",
  muted: "#5B6472",
  label: "#8A93A3",
  accent: "#0056D2",
};

const serif = "Georgia, 'Times New Roman', serif";
const sans = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const brand = "'Libre Baskerville', Georgia, serif";

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
      className="w-full text-left px-4 py-2 rounded transition-colors"
      style={{
        fontFamily: sans,
        fontSize: 16,
        color: active ? C.bg : C.text,
        backgroundColor: active ? C.accent : "transparent",
        border: "none",
        cursor: "pointer",
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
    <div>
      <h1
        className="flex items-center gap-2"
        style={{ fontFamily: serif, color: C.text, fontSize: 33, margin: 0 }}
      >
        <img
          src={LOGO_URI}
          alt=""
          style={{ width: 46, height: 46, opacity: 0.95 }}
        />
        Semana {week}
      </h1>
      <p style={{ fontFamily: sans, color: C.muted, fontSize: 16, marginTop: 4 }}>
        {content
          ? `${content.sections.reduce((n, s) => n + s.terms.length, 0)} términos · toca un tema para ver sus definiciones`
          : "Aún no hay contenido cargado para esta semana."}
      </p>

      {content ? (
        <section className="mt-6">
          <h2
            style={{
              fontFamily: serif,
              color: C.accent,
              fontSize: 19,
              margin: "0 0 8px 0",
            }}
          >
            Temario de la clase
          </h2>
          <div className="flex flex-col gap-1">
            {content.sections.map((s, i) => {
              const isOpen = openSection === s.title;
              return (
                <div
                  key={s.title}
                  className="rounded"
                  style={{
                    backgroundColor: C.card,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <button
                    onClick={() => setOpenSection(isOpen ? null : s.title)}
                    className="w-full px-3 py-2 flex items-baseline gap-3 text-left"
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                  >
                    <span
                      style={{
                        fontFamily: serif,
                        fontSize: 15,
                        color: C.accent,
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span
                      style={{
                        fontFamily: sans,
                        fontSize: 15,
                        color: C.text,
                        flex: 1,
                      }}
                    >
                      {s.title}
                    </span>
                    <span style={{ fontFamily: sans, fontSize: 13, color: C.label }}>
                      {s.terms.length} términos
                    </span>
                  </button>
                  {isOpen && (
                    <div
                      className="px-3 pb-3 flex flex-col gap-2"
                      style={{ borderTop: `1px solid ${C.border}` }}
                    >
                      {s.terms.map((t) => (
                        <div key={t.term} className="pt-2">
                          <p
                            style={{
                              fontFamily: sans,
                              fontSize: 15,
                              color: C.text,
                              margin: 0,
                            }}
                          >
                            {t.term}
                            {t.es && (
                              <span
                                style={{
                                  fontStyle: "italic",
                                  color: C.text,
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
                              fontSize: 14,
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
            <p style={{ fontFamily: sans, color: C.muted, fontSize: 15, margin: 0 }}>
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
              fontSize: 19,
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
          style={{ width: 38, height: 38, margin: "0 auto 10px auto", display: "block", opacity: 0.18 }}
        />
        <p style={{ fontFamily: serif, fontSize: 20, color: C.text, margin: 0 }}>
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
            fontSize: 15,
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
      <p style={{ fontFamily: sans, fontSize: 13, color: C.label, margin: 0 }}>
        {idx + 1} de {order.length} · {score.correct} correctas hasta ahora
      </p>
      <p
        style={{
          fontFamily: sans,
          fontSize: 16,
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
          fontSize: 16,
          color: C.text,
          backgroundColor: C.bg,
          border: `1px solid ${
            checked === "correct"
              ? "#1E8A5C"
              : checked === "wrong"
              ? "#C0392B"
              : C.border
          }`,
          outline: "none",
        }}
      />

      {checked && (
        <p
          style={{
            fontFamily: sans,
            fontSize: 15,
            color: checked === "correct" ? "#1E8A5C" : "#C0392B",
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
          fontSize: 15,
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
        style={{ fontFamily: serif, color: C.text, fontSize: 33, margin: 0 }}
      >
        Glosario jurídico
      </h1>
      <p style={{ fontFamily: sans, color: C.muted, fontSize: 16, marginTop: 4 }}>
        {terms.length} términos · inglés y español · busca por palabra o navega por letra
      </p>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar término o definición..."
        className="w-full rounded px-3 py-2 mt-5"
        style={{
          fontFamily: sans,
          fontSize: 16,
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
            fontSize: 14,
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
              fontSize: 14,
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
          <p style={{ fontFamily: sans, color: C.muted, fontSize: 15 }}>
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
                  fontSize: 16,
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
                        color: C.text,
                        fontSize: 14,
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
                      fontSize: 13,
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
                      fontSize: 15,
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
                        fontSize: 15,
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
        style={{ fontFamily: serif, color: C.text, fontSize: 33, margin: 0 }}
      >
        Flashcards
      </h1>
      <p style={{ fontFamily: sans, color: C.muted, fontSize: 16, marginTop: 4 }}>
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
                  fontSize: 21,
                  fontStyle: "italic",
                  color: C.text,
                  margin: "0 0 12px 0",
                }}
              >
                {term.es}
              </p>
            )}
            <p
              style={{
                fontFamily: sans,
                fontSize: 16,
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
                  fontSize: 15,
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
        style={{ fontFamily: sans, fontSize: 14, color: C.muted }}
      >
        toca la tarjeta para {flipped ? "ver el término" : "ver la definición"}
      </p>

      <div className="flex justify-center gap-3 mt-5">
        <button
          onClick={prev}
          style={{
            fontFamily: sans,
            fontSize: 15,
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
            fontSize: 15,
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
          fontSize: 16,
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
            fontSize: 14,
            fontStyle: "italic",
            color: C.text,
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
            fontSize: 14,
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
      <h1 style={{ fontFamily: serif, color: C.text, fontSize: 33, margin: 0 }}>
        Recursos del intérprete
      </h1>
      <p style={{ fontFamily: sans, color: C.muted, fontSize: 16, marginTop: 4 }}>
        Libros, video y fuentes oficiales
      </p>

      <section className="mt-6">
        <h2
          style={{
            fontFamily: serif,
            color: C.accent,
            fontSize: 19,
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
            fontSize: 19,
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
            <p style={{ fontFamily: sans, color: C.muted, fontSize: 15, margin: 0 }}>
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
            fontSize: 19,
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
                fontSize: 14,
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
      <h1 style={{ fontFamily: serif, color: C.text, fontSize: 33, margin: 0 }}>
        Caso de la semana
      </h1>
      <p style={{ fontFamily: sans, color: C.muted, fontSize: 16, marginTop: 4 }}>
        {data.dateLabel}
      </p>

      <h2
        style={{
          fontFamily: serif,
          color: C.accent,
          fontSize: 21,
          margin: "20px 0 8px 0",
        }}
      >
        {data.title}
      </h2>
      <p
        style={{
          fontFamily: sans,
          fontSize: 16,
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
            fontSize: 18,
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
              <span style={{ fontFamily: sans, fontSize: 15, color: C.muted }}>
                {c.original}
              </span>
              <span style={{ fontFamily: sans, fontSize: 13, color: C.label }}>
                →
              </span>
              <span
                style={{
                  fontFamily: sans,
                  fontSize: 15,
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
            fontSize: 18,
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
                fontSize: 15,
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
            fontSize: 18,
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
                fontSize: 14,
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
      <h1 style={{ fontFamily: serif, color: C.text, fontSize: 33, margin: 0 }}>
        Relacionar
      </h1>
      <p style={{ fontFamily: sans, color: C.muted, fontSize: 16, marginTop: 4 }}>
        Toca un término y luego su definición
      </p>

      <div className="flex flex-wrap gap-1 mt-4">
        {weekNumbers.map((w) => (
          <button
            key={w}
            onClick={() => changeScope(w)}
            style={{
              fontFamily: sans,
              fontSize: 14,
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
            fontSize: 14,
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
            style={{ width: 38, height: 38, margin: "0 auto 10px auto", display: "block", opacity: 0.18 }}
          />
          <p style={{ fontFamily: serif, fontSize: 20, color: C.text, margin: 0 }}>
            Tanda completa
          </p>
          <button
            onClick={() => newRound(scopePool)}
            className="mt-3"
            style={{
              fontFamily: sans,
              fontSize: 15,
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
                    fontSize: 15,
                    color: leftSel === p.term ? C.bg : C.text,
                    backgroundColor:
                      wrong && wrong.left === p.term
                        ? "rgba(192,57,43,0.10)"
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
                    fontSize: 15,
                    color: C.muted,
                    backgroundColor:
                      wrong && wrong.right === p.term
                        ? "rgba(192,57,43,0.10)"
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
      <h1 style={{ fontFamily: serif, color: C.text, fontSize: 33, margin: 0 }}>
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
            style={{ width: 38, height: 38, margin: "0 auto 10px auto", display: "block", opacity: 0.18 }}
          />
          <p style={{ fontFamily: serif, fontSize: 20, color: C.text, margin: 0 }}>
            {score.correct} de {score.total} correctas
          </p>
          <button
            onClick={restart}
            className="mt-3"
            style={{
              fontFamily: sans,
              fontSize: 15,
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
          <p style={{ fontFamily: sans, fontSize: 13, color: C.label, margin: 0 }}>
            {idx + 1} de {freshOrder.length} · {score.correct} correctas hasta ahora
          </p>
          <p
            style={{
              fontFamily: serif,
              fontSize: 21,
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
                fontSize: 15,
                fontStyle: "italic",
                color: C.text,
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
              if (showResult && opt.correct) bg = "rgba(30,138,92,0.10)";
              else if (showResult && isChosen && !opt.correct)
                bg = "rgba(192,57,43,0.10)";
              return (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  disabled={selected !== null}
                  className="text-left rounded px-3 py-2 flex items-start gap-2"
                  style={{
                    fontFamily: sans,
                    fontSize: 15,
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
                        color: "#1E8A5C",
                        fontSize: 15,
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </span>
                  )}
                  {showResult && isChosen && !opt.correct && (
                    <span
                      style={{
                        color: "#C0392B",
                        fontSize: 15,
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
                fontSize: 15,
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

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth < 768);
    }
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
}

export default function App() {
  const [section, setSection] = useState("semana-1");
  const [navOpen, setNavOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: C.bg,
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&display=swap');`}</style>
      <aside
        style={{
          width: isMobile ? "100%" : 224,
          flexShrink: 0,
          padding: isMobile ? 12 : 16,
          display: "flex",
          flexDirection: "column",
          borderBottom: isMobile ? `1px solid ${C.border}` : "none",
          borderRight: isMobile ? "none" : `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            marginBottom: isMobile ? 4 : 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <div className="flex items-center gap-2">
            <img
              src={LOGO_URI}
              alt=""
              style={{ width: 56, height: 56, opacity: 0.95, flexShrink: 0 }}
            />
            <div>
              <p
                style={{
                  fontFamily: brand,
                  fontWeight: 700,
                  color: C.text,
                  fontSize: 20,
                  letterSpacing: "-0.2px",
                  whiteSpace: "nowrap",
                  margin: 0,
                }}
              >
                Palabra Justa
              </p>
              <p
                style={{
                  fontFamily: sans,
                  color: C.label,
                  fontSize: 15,
                  margin: "1px 0 0 0",
                }}
              >
                Inglés – Español
              </p>
            </div>
          </div>

          {isMobile && (
            <button
              onClick={() => setNavOpen((v) => !v)}
              className="flex items-center justify-center rounded"
              aria-label="Menú"
              style={{
                width: 46,
                height: 46,
                border: `1px solid ${C.border}`,
                backgroundColor: navOpen ? C.accent : "transparent",
                color: navOpen ? C.bg : C.text,
                fontSize: 22,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              {navOpen ? "✕" : "☰"}
            </button>
          )}
        </div>

        <div
          onClick={() => isMobile && setNavOpen(false)}
          style={{
            display: isMobile ? (navOpen ? "flex" : "none") : "flex",
            flexDirection: "column",
            gap: 4,
            marginTop: isMobile ? 8 : 0,
          }}
        >
          {WEEKS.map((w) => (
            <NavButton
              key={w}
              active={section === `semana-${w}`}
              onClick={() => setSection(`semana-${w}`)}
            >
              Semana {w}
            </NavButton>
          ))}

          {!isMobile && (
            <div className="my-2" style={{ borderTop: `1px solid ${C.border}` }} />
          )}

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

          {!isMobile && (
            <div className="my-2" style={{ borderTop: `1px solid ${C.border}` }} />
          )}

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

      <main
        style={{
          flex: 1,
          padding: isMobile ? 16 : 32,
          width: "100%",
          maxWidth: isMobile ? "100%" : 672,
        }}
      >
        {section.startsWith("semana-") && (
          <WeekView week={Number(section.split("-")[1])} />
        )}
        {section === "caso" && <CaseView data={CASE_OF_THE_WEEK} />}
        {section === "recursos" && <ResourcesView data={RESOURCES} />}
        {section === "glosario" && <GlossaryView terms={SEED_GLOSSARY} />}
        {section === "flashcards" && <FlashcardsView terms={SEED_GLOSSARY} />}
        {section === "match" && <MatchView />}
        {section === "quiz" && <QuizView terms={SEED_GLOSSARY} />}
      </main>
    </div>
  );
}
