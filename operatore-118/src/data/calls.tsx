import type { CallTemplate } from '../model/call';

export const CALL_TEMPLATES: CallTemplate[] = [
    {
        text: "Salve, chiamo da (indirizzo abitazione). C'è un signore, avrà circa 53 anni, che è per terra nel cortile. È caduto per terra da circa 5 minuti, non si muove, e non capiamo se è sveglio o no. Respira ma non ci risponde. Potete mandare qualcuno subito?",
        stableCaseFeedback: {
            msb: "Maschio, circa 53 anni, trovato cosciente nel cortile dopo caduta da posizione eretta. Parametri vitali nella norma: FC 78 bpm, PA 130/80 mmHg, SpO₂ 98%. Presenta dolore e gonfiore all'arto inferiore destro con escoriazioni superficiali. Immobilizzato l'arto con steccobenda. Trauma ginocchio dx. Nessuna anamnesi disponibile. [OTT]",
            msa1: "Maschio, circa 53 anni, trovato cosciente nel cortile dopo caduta da posizione eretta Parametri vitali stabili: FC 80 bpm, PA 130/80 mmHg, SpO₂ 97%, GCS 15. Riscontrata deformità compatibile con frattura dell'arto inferiore destro. Somministrato Fentanil 50 mcg EV, eseguita immobilizzazione. Sospetto di frattura del piatto tibiale. Nessuna patologia nota. [OTT]",
            msa2: "Maschio, circa 53 anni, trovato cosciente nel cortile dopo caduta da posizione eretta. Parametri: FC 76 bpm, PA 125/85 mmHg, SpO₂ 98%, GCS 15. Presente deformità compatibile con frattura arto inferiore. Eseguita immobilizzazione e analgesia con Fentanil 50 mcg EV. Sospetto di frattura del piatto tibiale. Nessuna anamnesi rilevabile. [OTT]"
        },
        mediumCaseFeedback: {
            msb: "Maschio, circa 53 anni, trovato confuso nel cortile dopo caduta da posizione eretta. Parametri vitali alterati: FC 95 bpm, PA 145/90 mmHg, SpO₂ 94%. Presenta disorientamento e lesione contusiva in area frontale. Immobilizzato su asse spinale. Sospetto trauma cranico minore. Anamnesi non disponibile. [DEA]",
            msa1: "Maschio, circa 53 anni, trovato confuso nel cortile dopo caduta da posizione eretta GCS 12. Parametri vitali: FC 105 bpm, PA 150/95 mmHg, SpO₂ 92%. Evidente contusione frontale, nessun sanguinamento. Somministrato O₂ 6 l/min, posizionato accesso EV. Sospetto trauma cranico commotivo. Nessuna patologia nota. [DEA]",
            msa2: "Maschio, circa 53 anni, trovato confuso nel cortile dopo caduta da posizione eretta. Parametri vitali: FC 110 bpm, PA 155/95 mmHg, SpO₂ 90%, GCS 10. Lesione alla regione frontale, riferito trauma con breve perdita di coscienza. Somministrato Fentanil 100 mcg EV, monitoraggio . Sospetta commozione cerebrale. Nessuna anamnesi disponibile. [DEA]"
        },
        criticalCaseFeedback: {
            msb: "Maschio, circa 53 anni, riferita caduta improvvisa nel cortile di casa.All'arrivo, paziente incosciente, respiro superficiale. Parametri vitali compromessi: FC 40 bpm, PA 70/40 mmHg, SpO₂ 80%. Contusione occipitale evidente. Sospetto trauma cranico severo con compromissione neurologica. Immobilizzato, Anamnesi non disponibile. richiesto supporto MSA. [NCH]",
            msa1: "Paziente incosciente dopo caduta, GCS 6. Parametri vitali: FC 35 bpm, PA 60/30 mmHg, SpO₂ 75%. Evidente contusione occipitale, stato neurologico gravemente compromesso. Posizionato accesso EV, O₂ ad alti flussi. Nessuna anamnesi nota, Sospetto trauma cranico grave. Richiesta MSA2. [NCH]",
            msa2: "Maschio, 53 anni, incosciente in seguito a caduta riferita da testimoni. GCS 3, parametri gravemente compromessi: FC 30 bpm, PA 55/25 mmHg, SpO₂ 70%. Lesione occipitale con probabile emorragia cerebrale. Sedato ed intubato. Trasferimento urgente verso CTZ con neurochirurgia. [NCH]"
        }
    },
    {
        text: "Pronto? Chiamo da (indirizzo abitazione), c'è una signora anziana che ha perso conoscenza mentre era seduta. È scivolata dalla sedia e ora non risponde. Respira, ma è molto pallida e sudata. Potete mandare qualcuno subito?",
        stableCaseFeedback: {
            msb: "Femmina, circa 75 anni, trovata cosciente all'arrivo, riferita perdita di coscienza transitoria . Parametri vitali nella norma: FC 72 bpm, PA 125/75 mmHg, SpO₂ 99%. Nessun trauma apparente. Nessuna patologia riferita. [PS]",
            msa1: "Femmina, 75 anni, vigile all'arrivo, riferito episodio pre sincopale. Parametri stabili: FC 74 bpm, PA 130/80 mmHg, SpO₂ 98%, GCS 15. Nessuna lesione visibile, verosimile episodio lipotimico. [PS]",
            msa2: "Femmina, 75 anni, ritrovata cosciente ma confusa dopo episodio presincopale. Parametri vitali: FC 76 bpm, PA 120/70 mmHg, SpO₂ 97%, GCS 14. Monitoraggio e accesso EV posizionato. Osservazione per sospetta sincope vasovagale. Nessun trauma. Nessuna anamnesi significativa. [PS]"
        },
        mediumCaseFeedback: {
            msb: "Femmina, circa 75 anni, trovata soporosa, respiro regolare. Parametri alterati: FC 48 bpm, PA 90/60 mmHg, SpO₂ 93%. Sudorazione fredda e pallore. Posizionata su barella, monitorata. Sospetta crisi ipotensiva. Nessuna anamnesi nota. [DEA]",
            msa1: "Femmina, 75 anni, trovata soporosa, risvegliabile con stimoli. Parametri vitali: FC 50 bpm, PA 85/55 mmHg, SpO₂ 92%. Ipoperfusa, cute fredda e sudata. Somministrato bolo di fisiologica EV, monitoraggio continuo. Sospetto sincope con ipotensione importante.  [DEA]",
            msa2: "Femmina, 75 anni, soporosa, episodio sincopale riferito. FC 52 bpm, PA 80/50 mmHg, SpO₂ 91%, GCS 13. Eseguito monitoraggio avanzato, accesso EV e fluidoterapia. Sospetto disturbo ritmico con ipoperfusione cerebrale. Nessuna anamnesi disponibile. [DEA]"
        },
        criticalCaseFeedback: {
            msb: "Femmina, circa 75 anni, trovata incosciente, respiro lento. Parametri compromessi: FC 40 bpm, PA 70/40 mmHg, SpO₂ 85% non responsiva a nessuno stimolo, immobilizzata. Nessuna anamnesi disponibile. Richiesta MSA.[Rianimazione]",
            msa1: "Paziente incosciente, GCS 6, FC 38 bpm, PA 60/30 mmHg, SpO₂ 80%. Pallore marcato, respiro irregolare. Accesso EV e ossigeno ad alti flussi. Defibrillatore pronto. Richiesto supporto MSA2. [Rianimazione]",
            msa2: "Femmina, 75 anni, incosciente all'arrivo. Parametri critici: FC 35 bpm, PA 55/25 mmHg, SpO₂ 75%, GCS 3. Stato comatoso, assenza di risposta. Sedata e intubata. Ventilazione assistita avviata. Sospetto evento cardiovascolare maggiore. Trasferimento urgente in Rianimazione. [Rianimazione]"
        }
    },
    {
        text: "Buongiorno, chiamo da (scuola) Un ragazzo di 16 anni sembra sia svenuto, è a terra ed è pallido. Dice che gli gira la testa e ha il cuore che batte fortissimo. È sveglio ma molto spaventato.",
        stableCaseFeedback: {
            msb: "Maschio, 16 anni, vigile all'arrivo, riferito episodio di vertigini e astenia. Parametri vitali normali: FC 85 bpm, PA 125/75 mmHg, SpO₂ 98%. Nessun trauma. Ansioso, monitorato e rassicurato. Sospetta lipotimia da sforzo. Nessuna patologia nota.[PS]",
            msa1: "Maschio, 16 anni, cosciente e collaborante. Parametri vitali: FC 90 bpm, PA 120/70 mmHg, SpO₂ 99%, GCS 15. Palpitazioni autolimitate, nessun trauma. Ringer Acetato 500ml EV. [PS]",
            msa2: "Maschio, 16 anni, vigile. Parametri: FC 88 bpm, PA 122/72 mmHg, SpO₂ 98%, GCS 15. Nessuna alterazione neurologica. Episodio compatibile con sincope da sforzo. Nessuna anamnesi significativa.[PS]"
        },
        mediumCaseFeedback: {
            msb: "Maschio, 16 anni, vigile ma ipoteso. FC 105 bpm, PA 90/60 mmHg, SpO₂ 95%. Pallore e sudorazione fredda. Posizionato su barella, idratazione orale. Sospetta disidratazione/ipotensione da calore. Nessuna patologia nota.[DEA]",
            msa1: "Maschio, 16 anni, leggermente soporoso, GCS 13. FC 110 bpm, PA 85/55 mmHg, SpO₂ 94%. Tachicardico e sudato. Ringer Acetato 500ml EV, monitoraggio. Sospetta lipotimia.[DEA]",
            msa2: "Maschio, 16 anni, soporoso ma risvegliabile. Parametri: FC 115 bpm, PA 80/50 mmHg, SpO₂ 93%, GCS 12. Accesso EV e monitoraggio neurologico. Possibile reazione vaso-vagale severa. Nessuna anamnesi.[DEA]"
        },
        criticalCaseFeedback: {
            msb: "Maschio, 16 anni, incosciente all'arrivo, respiro superficiale. FC 40 bpm, PA 70/45 mmHg, SpO₂ 88%. Pallore marcato, stato neurologico compromesso. Nessuna anamnesi nota. Richiesta MSA.[Rianimazione]",
            msa1: "Incosciente, GCS 6, FC 38 bpm, PA 60/30 mmHg, SpO₂ 82%. Accesso EV, O₂ ad alti flussi. ECG in corso, sospetto disturbo del ritmo grave. Richiesto MSA2. [Rianimazione]",
            msa2: "Maschio, 16 anni, incosciente. Parametri vitali compromessi: GCS 12, FC 30 bpm, PA 55/25 mmHg, SpO₂ 78%. Sedato e intubato, ventilazione assistita. Sospetta bradiaritmia severa con sincope. [Rianimazione]"
        }
    }
];
