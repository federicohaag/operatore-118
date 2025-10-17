/**
 * Mission-related domain types and enums for emergency call management
 */

/**
 * Mission priority code (color-based triage system)
 */
export const Codice = {
    ROSSO: 'ROSSO',
    GIALLO: 'GIALLO',
    VERDE: 'VERDE'
} as const;

export type Codice = typeof Codice[keyof typeof Codice];

/**
 * Location type where the emergency occurred
 */
export const Luogo = {
    CASA: 'CASA',
    STRADA: 'STRADA',
    UFFICI_ED_ES_PUBBL: 'UFFICI ED ES. PUBBL.',
    STR_SANITARIA: 'STR. SANITARIA',
    IMPIANTO_SPORTIVO: 'IMPIANTO SPORTIVO',
    IMPIANTO_LAVORATIVO: 'IMPIANTO LAVORATIVO',
    SCUOLE: 'SCUOLE',
    STAZIONE: 'STAZIONE',
    FERROVIA: 'FERROVIA',
    METROPOLITANA: 'METROPOLITANA',
    AEREOPORTI: 'AEREOPORTI',
    QUESTURA_CASERME: 'QUESTURA/CASERME',
    LUOGHI_DI_CULTO: 'LUOGHI DI CULTO',
    IMPERVIO: 'IMPERVIO',
    ALTRO_LUOGO: 'ALTRO LUOGO'
} as const;

export type Luogo = typeof Luogo[keyof typeof Luogo];

/**
 * Detailed location specifications for CASA
 */
export const DettLuogoCasa = {
    ABITAZIONE: 'ABITAZIONE',
    SCALE: 'SCALE',
    ASCENSORE: 'ASCENSORE',
    CORTILE: 'CORTILE',
    GARAGE: 'GARAGE',
    BALCONE: 'BALCONE',
    TETTO: 'TETTO',
    CANTINA: 'CANTINA',
    GIARDINO: 'GIARDINO'
} as const;

export type DettLuogoCasa = typeof DettLuogoCasa[keyof typeof DettLuogoCasa];

export const DettLuogoStrada = {
    STRADA: 'STRADA',
    MARCIAPIEDE: 'MARCIAPIEDE',
    PISTA_CICLABILE: 'PISTA CICLABILE',
    SOTTOPASSO: 'SOTTOPASSO',
    CAVALCAVIA: 'CAVALCAVIA'
} as const;

export type DettLuogoStrada = typeof DettLuogoStrada[keyof typeof DettLuogoStrada];

export const DettLuogoUffici = {
    UFFICIO: 'UFFICIO',
    NEGOZIO: 'NEGOZIO',
    BAR_RISTORANTE: 'BAR/RISTORANTE',
    ALBERGO: 'ALBERGO',
    CENTRO_COMMERCIALE: 'CENTRO COMMERCIALE',
    BANCA: 'BANCA',
    POSTA: 'POSTA',
    TEATRO_CINEMA: 'TEATRO/CINEMA'
} as const;

export type DettLuogoUffici = typeof DettLuogoUffici[keyof typeof DettLuogoUffici];

export const DettLuogoStrSanitaria = {
    OSPEDALE: 'OSPEDALE',
    CASA_DI_CURA: 'CASA DI CURA',
    AMBULATORIO: 'AMBULATORIO',
    LABORATORIO: 'LABORATORIO',
    RSA: 'RSA',
    CENTRO_DIALISI: 'CENTRO DIALISI'
} as const;

export type DettLuogoStrSanitaria = typeof DettLuogoStrSanitaria[keyof typeof DettLuogoStrSanitaria];

export const DettLuogoImpiantoSportivo = {
    PALESTRA: 'PALESTRA',
    PISCINA: 'PISCINA',
    CAMPO_SPORTIVO: 'CAMPO SPORTIVO',
    STADIO: 'STADIO',
    PISTA: 'PISTA'
} as const;

export type DettLuogoImpiantoSportivo = typeof DettLuogoImpiantoSportivo[keyof typeof DettLuogoImpiantoSportivo];

export const DettLuogoImpiantoLavorativo = {
    FABBRICA: 'FABBRICA',
    CANTIERE: 'CANTIERE',
    MAGAZZINO: 'MAGAZZINO',
    UFFICIO: 'UFFICIO',
    NEGOZIO: 'NEGOZIO'
} as const;

export type DettLuogoImpiantoLavorativo = typeof DettLuogoImpiantoLavorativo[keyof typeof DettLuogoImpiantoLavorativo];

export const DettLuogoScuole = {
    SCUOLA_MATERNA: 'SCUOLA MATERNA',
    SCUOLA_ELEMENTARE: 'SCUOLA ELEMENTARE',
    SCUOLA_MEDIA: 'SCUOLA MEDIA',
    SCUOLA_SUPERIORE: 'SCUOLA SUPERIORE',
    UNIVERSITA: 'UNIVERSITÀ'
} as const;

export type DettLuogoScuole = typeof DettLuogoScuole[keyof typeof DettLuogoScuole];

export const DettLuogoStazione = {
    STAZIONE_FERROVIARIA: 'STAZIONE FERROVIARIA',
    STAZIONE_METROPOLITANA: 'STAZIONE METROPOLITANA',
    STAZIONE_AUTOBUS: 'STAZIONE AUTOBUS'
} as const;

export type DettLuogoStazione = typeof DettLuogoStazione[keyof typeof DettLuogoStazione];

export const DettLuogoFerrovia = {
    BINARIO: 'BINARIO',
    BANCHINA: 'BANCHINA',
    SOTTOPASSAGGIO: 'SOTTOPASSAGGIO',
    TUNNEL: 'TUNNEL'
} as const;

export type DettLuogoFerrovia = typeof DettLuogoFerrovia[keyof typeof DettLuogoFerrovia];

export const DettLuogoMetropolitana = {
    BINARIO: 'BINARIO',
    BANCHINA: 'BANCHINA',
    SOTTOPASSAGGIO: 'SOTTOPASSAGGIO',
    TUNNEL: 'TUNNEL',
    SCALA_MOBILE: 'SCALA MOBILE'
} as const;

export type DettLuogoMetropolitana = typeof DettLuogoMetropolitana[keyof typeof DettLuogoMetropolitana];

export const DettLuogoAereoporti = {
    TERMINAL: 'TERMINAL',
    PISTA: 'PISTA',
    HANGAR: 'HANGAR',
    PARCHEGGIO: 'PARCHEGGIO'
} as const;

export type DettLuogoAereoporti = typeof DettLuogoAereoporti[keyof typeof DettLuogoAereoporti];

export const DettLuogoQuesturaCaserme = {
    QUESTURA: 'QUESTURA',
    CASERMA_CC: 'CASERMA CC',
    CASERMA_GDF: 'CASERMA GDF',
    CASERMA_VVF: 'CASERMA VVF'
} as const;

export type DettLuogoQuesturaCaserme = typeof DettLuogoQuesturaCaserme[keyof typeof DettLuogoQuesturaCaserme];

export const DettLuogoLuoghiDiCulto = {
    CHIESA: 'CHIESA',
    MOSCHEA: 'MOSCHEA',
    SINAGOGA: 'SINAGOGA',
    TEMPIO: 'TEMPIO'
} as const;

export type DettLuogoLuoghiDiCulto = typeof DettLuogoLuoghiDiCulto[keyof typeof DettLuogoLuoghiDiCulto];

export const DettLuogoImpervio = {
    BOSCO: 'BOSCO',
    MONTAGNA: 'MONTAGNA',
    GROTTA: 'GROTTA',
    FIUME: 'FIUME',
    LAGO: 'LAGO'
} as const;

export type DettLuogoImpervio = typeof DettLuogoImpervio[keyof typeof DettLuogoImpervio];

/**
 * Union type of all possible detailed location values
 */
export type DettLuogo = DettLuogoCasa | DettLuogoStrada | DettLuogoUffici | DettLuogoStrSanitaria | 
    DettLuogoImpiantoSportivo | DettLuogoImpiantoLavorativo | DettLuogoScuole | DettLuogoStazione | 
    DettLuogoFerrovia | DettLuogoMetropolitana | DettLuogoAereoporti | DettLuogoQuesturaCaserme | 
    DettLuogoLuoghiDiCulto | DettLuogoImpervio;

/**
 * Reason for the emergency call
 */
export const Motivo = {
    MEDICO_ACUTO: 'MEDICO ACUTO',
    SOCCORSO_PERSONA: 'SOCCORSO PERSONA',
    EVENTO_VIOLENTO: 'EVENTO VIOLENTO',
    CADUTA: 'CADUTA',
    INCIDENTE_INFORTUNIO: 'INCIDENTE/INFORTUNIO',
    INC_STRADALE: 'INC. STRADALE',
    INC_FERROVIA: 'INC. FERROVIA',
    INC_ARIA: 'INC. ARIA',
    INC_ACQUA: 'INC. ACQUA',
    INC_MONTANO: 'INC. MONTANO',
    INC_SPELEO_FORRA: 'INC. SPELEO/FORRA',
    INTOSSICAZIONE: 'INTOSSICAZIONE',
    ANIMALI: 'ANIMALI',
    PREVENZIONE: 'PREVENZIONE',
    EVENTO_DI_MASSA: 'EVENTO DI MASSA',
    MAXI_EMERGENZA: 'MAXI EMERGENZA',
    SOCCORSO_SECONDARIO: 'SOCCORSO SECONDARIO',
    ALTRO_NON_NOTO: 'ALTRO/NON NOTO'
} as const;

export type Motivo = typeof Motivo[keyof typeof Motivo];

/**
 * Detailed reason specifications
 */
export const DettMotivoMedicoAcuto = {
    DOLORE_TORACICO: 'DOLORE TORACICO',
    DISPNEA: 'DISPNEA',
    DOLORE_ADDOMINALE: 'DOLORE ADDOMINALE',
    SINCOPE: 'SINCOPE',
    FEBBRE: 'FEBBRE',
    ALTRO: 'ALTRO'
} as const;

export type DettMotivoMedicoAcuto = typeof DettMotivoMedicoAcuto[keyof typeof DettMotivoMedicoAcuto];

export const DettMotivoSoccorsoPersona = {
    PERSONA_A_TERRA: 'PERSONA A TERRA',
    PERSONA_BLOCCATA: 'PERSONA BLOCCATA',
    PERSONA_DISPERSA: 'PERSONA DISPERSA'
} as const;

export type DettMotivoSoccorsoPersona = typeof DettMotivoSoccorsoPersona[keyof typeof DettMotivoSoccorsoPersona];

export const DettMotivoEventoViolento = {
    AGGRESSIONE: 'AGGRESSIONE',
    ACCOLTELLAMENTO: 'ACCOLTELLAMENTO',
    ARMA_DA_FUOCO: 'ARMA DA FUOCO',
    ALTRO: 'ALTRO'
} as const;

export type DettMotivoEventoViolento = typeof DettMotivoEventoViolento[keyof typeof DettMotivoEventoViolento];

export const DettMotivoCaduta = {
    CADUTA_DA_ALTEZZA: 'CADUTA DA ALTEZZA',
    CADUTA_IN_PIANO: 'CADUTA IN PIANO',
    CADUTA_DA_SCALA: 'CADUTA DA SCALA'
} as const;

export type DettMotivoCaduta = typeof DettMotivoCaduta[keyof typeof DettMotivoCaduta];

export const DettMotivoIncidenteInfortunio = {
    SUL_LAVORO: 'SUL LAVORO',
    DOMESTICO: 'DOMESTICO',
    ALTRO: 'ALTRO'
} as const;

export type DettMotivoIncidenteInfortunio = typeof DettMotivoIncidenteInfortunio[keyof typeof DettMotivoIncidenteInfortunio];

export const DettMotivoIncStradale = {
    AUTO: 'AUTO',
    MOTO: 'MOTO',
    BICI: 'BICI',
    PEDONE: 'PEDONE',
    CAMION: 'CAMION'
} as const;

export type DettMotivoIncStradale = typeof DettMotivoIncStradale[keyof typeof DettMotivoIncStradale];

export const DettMotivoIncFerrovia = {
    TRENO: 'TRENO',
    PEDONE: 'PEDONE',
    VEICOLO: 'VEICOLO'
} as const;

export type DettMotivoIncFerrovia = typeof DettMotivoIncFerrovia[keyof typeof DettMotivoIncFerrovia];

export const DettMotivoIncAria = {
    AEREO: 'AEREO',
    ELICOTTERO: 'ELICOTTERO',
    ALTRO: 'ALTRO'
} as const;

export type DettMotivoIncAria = typeof DettMotivoIncAria[keyof typeof DettMotivoIncAria];

export const DettMotivoIncAcqua = {
    ANNEGAMENTO: 'ANNEGAMENTO',
    QUASI_ANNEGAMENTO: 'QUASI ANNEGAMENTO',
    IMMERSIONE: 'IMMERSIONE'
} as const;

export type DettMotivoIncAcqua = typeof DettMotivoIncAcqua[keyof typeof DettMotivoIncAcqua];

export const DettMotivoIncMontano = {
    CADUTA: 'CADUTA',
    VALANGA: 'VALANGA',
    DISPERSO: 'DISPERSO'
} as const;

export type DettMotivoIncMontano = typeof DettMotivoIncMontano[keyof typeof DettMotivoIncMontano];

export const DettMotivoIncSpeleoForra = {
    BLOCCATO: 'BLOCCATO',
    INFORTUNATO: 'INFORTUNATO',
    DISPERSO: 'DISPERSO'
} as const;

export type DettMotivoIncSpeleoForra = typeof DettMotivoIncSpeleoForra[keyof typeof DettMotivoIncSpeleoForra];

export const DettMotivoIntossicazione = {
    ALIMENTARE: 'ALIMENTARE',
    DA_GAS: 'DA GAS',
    DA_FARMACI: 'DA FARMACI',
    DA_DROGHE: 'DA DROGHE'
} as const;

export type DettMotivoIntossicazione = typeof DettMotivoIntossicazione[keyof typeof DettMotivoIntossicazione];

export const DettMotivoAnimali = {
    MORSO_DI_CANE: 'MORSO DI CANE',
    PUNTURA_INSETTO: 'PUNTURA INSETTO',
    ALTRO: 'ALTRO'
} as const;

export type DettMotivoAnimali = typeof DettMotivoAnimali[keyof typeof DettMotivoAnimali];

export const DettMotivoPrevenzione = {
    EVENTO_SPORTIVO: 'EVENTO SPORTIVO',
    EVENTO_PUBBLICO: 'EVENTO PUBBLICO',
    ALTRO: 'ALTRO'
} as const;

export type DettMotivoPrevenzione = typeof DettMotivoPrevenzione[keyof typeof DettMotivoPrevenzione];

export const DettMotivoEventoDiMassa = {
    INCIDENTE_MULTIPLO: 'INCIDENTE MULTIPLO',
    CROLLO: 'CROLLO',
    ESPLOSIONE: 'ESPLOSIONE'
} as const;

export type DettMotivoEventoDiMassa = typeof DettMotivoEventoDiMassa[keyof typeof DettMotivoEventoDiMassa];

export const DettMotivoMaxiEmergenza = {
    CATASTROFE: 'CATASTROFE',
    TERREMOTO: 'TERREMOTO',
    ALLUVIONE: 'ALLUVIONE'
} as const;

export type DettMotivoMaxiEmergenza = typeof DettMotivoMaxiEmergenza[keyof typeof DettMotivoMaxiEmergenza];

export const DettMotivoSoccorsoSecondario = {
    TRASFERIMENTO: 'TRASFERIMENTO',
    DIMISSIONE: 'DIMISSIONE'
} as const;

export type DettMotivoSoccorsoSecondario = typeof DettMotivoSoccorsoSecondario[keyof typeof DettMotivoSoccorsoSecondario];

/**
 * Union type of all possible detailed reason values
 */
export type DettMotivo = DettMotivoMedicoAcuto | DettMotivoSoccorsoPersona | DettMotivoEventoViolento | 
    DettMotivoCaduta | DettMotivoIncidenteInfortunio | DettMotivoIncStradale | DettMotivoIncFerrovia | 
    DettMotivoIncAria | DettMotivoIncAcqua | DettMotivoIncMontano | DettMotivoIncSpeleoForra | 
    DettMotivoIntossicazione | DettMotivoAnimali | DettMotivoPrevenzione | DettMotivoEventoDiMassa | 
    DettMotivoMaxiEmergenza | DettMotivoSoccorsoSecondario;

/**
 * Patient consciousness level
 */
export const Coscienza = {
    RISPONDE: 'RISPONDE',
    ALTERATA: 'ALTERATA',
    NON_RISPONDE: 'NON RISPONDE',
    NON_RISPONDE_NON_RESPIRA: 'NON RISPONDE NON RESPIRA',
    INCOSCIENTE: 'INCOSCIENTE',
    NON_NOTO: 'NON NOTO'
} as const;

export type Coscienza = typeof Coscienza[keyof typeof Coscienza];

/**
 * Event notes (symptoms, signs, circumstances)
 */
export const NoteEvento = {
    RESPIRA: 'RESPIRA',
    DOLORE: 'DOLORE',
    DEFORMITA: 'DEFORMITA',
    CARDIOCIRCOLATORIO: 'CARDIOCIRCOLATORIO',
    EDEMA: 'EDEMA',
    DISTRETTO_TRAUMA: 'DISTRETTO TRAUMA',
    CONVULSIONI: 'CONVULSIONI',
    CPSS: 'CPSS',
    VERTIGINI: 'VERTIGINI',
    STATO_CONFUSIONALE: 'STATO CONFUSIONALE',
    ASTENIA: 'ASTENIA',
    SEGNI: 'SEGNI',
    CUTE: 'CUTE',
    SANGUINA: 'SANGUINA',
    ABRASIONE_CONTUSIONE: 'ABRASIONE/CONTUSIONE',
    DIABETICO: 'DIABETICO',
    INSUFFICIENZA_RENALE: 'INSUFFICIENZA RENALE',
    PENETRANTE: 'PENETRANTE',
    PROIETTATO: 'PROIETTATO',
    SBALZATO: 'SBALZATO',
    INCASTRATO: 'INCASTRATO',
    MINUS_2_5_MT: '-2.5 MT',
    FROM_2_5_TO_5_MT: '2.5 - 5 MT',
    PLUS_5_MT: '+ 5 MT',
    TRAVAGLIO: 'TRAVAGLIO',
    CONTRAZIONI_MINUS_5_MIN: 'CONTRAZIONI - 5 MIN',
    GRAVIDANZA: 'GRAVIDANZA',
    PARTO: 'PARTO',
    INCENDIO: 'INCENDIO',
    INCENDIO_INDUSTRIALE: 'INCENDIO INDUSTRIALE',
    INCENDIO_ABITAZIONE: 'INCENDIO ABITAZIONE',
    SOSP_INTOSSICAZIONE_DA_MONOSSIDO: 'SOSP INTOSSICAZIONE DA MONOSSIDO',
    AUTOLESIONISMO: 'AUTOLESIONISMO',
    PSICHIATRICO_NOTO: 'PSICHIATRICO NOTO',
    NO_NON_NOTO: 'NO/NON NOTO',
    ALTRI_SEGNI: 'ALTRI SEGNI',
    SEGUE: 'SEGUE'
} as const;

export type NoteEvento = typeof NoteEvento[keyof typeof NoteEvento];

/**
 * Detailed event notes specifications
 */
export const NoteEvento2Respira = {
    NORMALE: 'NORMALE',
    DIFFICOLTOSA: 'DIFFICOLTOSA',
    ASSENTE: 'ASSENTE'
} as const;

export type NoteEvento2Respira = typeof NoteEvento2Respira[keyof typeof NoteEvento2Respira];

export const NoteEvento2Dolore = {
    TORACE: 'TORACE',
    ADDOME: 'ADDOME',
    ARTI: 'ARTI',
    TESTA: 'TESTA',
    SCHIENA: 'SCHIENA'
} as const;

export type NoteEvento2Dolore = typeof NoteEvento2Dolore[keyof typeof NoteEvento2Dolore];

export const NoteEvento2Deformita = {
    ARTI_SUPERIORI: 'ARTI SUPERIORI',
    ARTI_INFERIORI: 'ARTI INFERIORI',
    BACINO: 'BACINO',
    TORACE: 'TORACE'
} as const;

export type NoteEvento2Deformita = typeof NoteEvento2Deformita[keyof typeof NoteEvento2Deformita];

export const NoteEvento2Cardiocircolatorio = {
    TACHICARDIA: 'TACHICARDIA',
    BRADICARDIA: 'BRADICARDIA',
    IPOTENSIONE: 'IPOTENSIONE',
    IPERTENSIONE: 'IPERTENSIONE'
} as const;

export type NoteEvento2Cardiocircolatorio = typeof NoteEvento2Cardiocircolatorio[keyof typeof NoteEvento2Cardiocircolatorio];

export const NoteEvento2Edema = {
    ARTI_INFERIORI: 'ARTI INFERIORI',
    ARTI_SUPERIORI: 'ARTI SUPERIORI',
    GENERALIZZATO: 'GENERALIZZATO'
} as const;

export type NoteEvento2Edema = typeof NoteEvento2Edema[keyof typeof NoteEvento2Edema];

export const NoteEvento2DistrettoTrauma = {
    CRANIO: 'CRANIO',
    TORACE: 'TORACE',
    ADDOME: 'ADDOME',
    BACINO: 'BACINO',
    ARTI: 'ARTI'
} as const;

export type NoteEvento2DistrettoTrauma = typeof NoteEvento2DistrettoTrauma[keyof typeof NoteEvento2DistrettoTrauma];

export const NoteEvento2Convulsioni = {
    IN_ATTO: 'IN ATTO',
    CESSATE: 'CESSATE'
} as const;

export type NoteEvento2Convulsioni = typeof NoteEvento2Convulsioni[keyof typeof NoteEvento2Convulsioni];

export const NoteEvento2Cpss = {
    POSITIVO: 'POSITIVO',
    NEGATIVO: 'NEGATIVO'
} as const;

export type NoteEvento2Cpss = typeof NoteEvento2Cpss[keyof typeof NoteEvento2Cpss];

export const NoteEvento2Vertigini = {
    IN_ATTO: 'IN ATTO',
    CESSATE: 'CESSATE'
} as const;

export type NoteEvento2Vertigini = typeof NoteEvento2Vertigini[keyof typeof NoteEvento2Vertigini];

export const NoteEvento2StatoConfusionale = {
    LIEVE: 'LIEVE',
    MODERATO: 'MODERATO',
    GRAVE: 'GRAVE'
} as const;

export type NoteEvento2StatoConfusionale = typeof NoteEvento2StatoConfusionale[keyof typeof NoteEvento2StatoConfusionale];

export const NoteEvento2Astenia = {
    LIEVE: 'LIEVE',
    MODERATA: 'MODERATA',
    GRAVE: 'GRAVE'
} as const;

export type NoteEvento2Astenia = typeof NoteEvento2Astenia[keyof typeof NoteEvento2Astenia];

export const NoteEvento2Segni = {
    CIANOSI: 'CIANOSI',
    PALLORE: 'PALLORE',
    SUDORAZIONE: 'SUDORAZIONE'
} as const;

export type NoteEvento2Segni = typeof NoteEvento2Segni[keyof typeof NoteEvento2Segni];

export const NoteEvento2Cute = {
    CALDA: 'CALDA',
    FREDDA: 'FREDDA',
    SUDATA: 'SUDATA'
} as const;

export type NoteEvento2Cute = typeof NoteEvento2Cute[keyof typeof NoteEvento2Cute];

export const NoteEvento2Sanguina = {
    LIEVE: 'LIEVE',
    MODERATO: 'MODERATO',
    ABBONDANTE: 'ABBONDANTE'
} as const;

export type NoteEvento2Sanguina = typeof NoteEvento2Sanguina[keyof typeof NoteEvento2Sanguina];

export const NoteEvento2AbrasioneContusione = {
    LIEVE: 'LIEVE',
    MODERATA: 'MODERATA',
    GRAVE: 'GRAVE'
} as const;

export type NoteEvento2AbrasioneContusione = typeof NoteEvento2AbrasioneContusione[keyof typeof NoteEvento2AbrasioneContusione];

export const NoteEvento2Diabetico = {
    IPOGLICEMIA: 'IPOGLICEMIA',
    IPERGLICEMIA: 'IPERGLICEMIA',
    SCONOSCIUTO: 'SCONOSCIUTO'
} as const;

export type NoteEvento2Diabetico = typeof NoteEvento2Diabetico[keyof typeof NoteEvento2Diabetico];

export const NoteEvento2InsufficenzaRenale = {
    NOTA: 'NOTA',
    NON_NOTA: 'NON NOTA'
} as const;

export type NoteEvento2InsufficenzaRenale = typeof NoteEvento2InsufficenzaRenale[keyof typeof NoteEvento2InsufficenzaRenale];

export const NoteEvento2Penetrante = {
    TORACE: 'TORACE',
    ADDOME: 'ADDOME',
    ARTI: 'ARTI'
} as const;

export type NoteEvento2Penetrante = typeof NoteEvento2Penetrante[keyof typeof NoteEvento2Penetrante];

export const NoteEvento2SiNo = {
    SI: 'SI',
    NO: 'NO'
} as const;

export type NoteEvento2SiNo = typeof NoteEvento2SiNo[keyof typeof NoteEvento2SiNo];

export const NoteEvento2Travaglio = {
    IN_ATTO: 'IN ATTO',
    IMMINENTE: 'IMMINENTE'
} as const;

export type NoteEvento2Travaglio = typeof NoteEvento2Travaglio[keyof typeof NoteEvento2Travaglio];

export const NoteEvento2Gravidanza = {
    MESE: 'MESE',
    SETTIMANA: 'SETTIMANA'
} as const;

export type NoteEvento2Gravidanza = typeof NoteEvento2Gravidanza[keyof typeof NoteEvento2Gravidanza];

export const NoteEvento2Parto = {
    IN_ATTO: 'IN ATTO',
    IMMINENTE: 'IMMINENTE'
} as const;

export type NoteEvento2Parto = typeof NoteEvento2Parto[keyof typeof NoteEvento2Parto];

export const NoteEvento2Incendio = {
    LIEVE: 'LIEVE',
    MODERATO: 'MODERATO',
    GRAVE: 'GRAVE'
} as const;

export type NoteEvento2Incendio = typeof NoteEvento2Incendio[keyof typeof NoteEvento2Incendio];

export const NoteEvento2Autolesionismo = {
    IN_ATTO: 'IN ATTO',
    PREGRESSO: 'PREGRESSO'
} as const;

export type NoteEvento2Autolesionismo = typeof NoteEvento2Autolesionismo[keyof typeof NoteEvento2Autolesionismo];

/**
 * Union type of all possible detailed event note values
 */
export type NoteEvento2 = NoteEvento2Respira | NoteEvento2Dolore | NoteEvento2Deformita | 
    NoteEvento2Cardiocircolatorio | NoteEvento2Edema | NoteEvento2DistrettoTrauma | NoteEvento2Convulsioni | 
    NoteEvento2Cpss | NoteEvento2Vertigini | NoteEvento2StatoConfusionale | NoteEvento2Astenia | 
    NoteEvento2Segni | NoteEvento2Cute | NoteEvento2Sanguina | NoteEvento2AbrasioneContusione | 
    NoteEvento2Diabetico | NoteEvento2InsufficenzaRenale | NoteEvento2Penetrante | NoteEvento2SiNo | 
    NoteEvento2Travaglio | NoteEvento2Gravidanza | NoteEvento2Parto | NoteEvento2Incendio | 
    NoteEvento2Autolesionismo;

/**
 * Maps Luogo types to their detailed location options
 */
export const LUOGO_DETAILS_MAP: Record<Luogo, readonly string[]> = {
    [Luogo.CASA]: Object.values(DettLuogoCasa),
    [Luogo.STRADA]: Object.values(DettLuogoStrada),
    [Luogo.UFFICI_ED_ES_PUBBL]: Object.values(DettLuogoUffici),
    [Luogo.STR_SANITARIA]: Object.values(DettLuogoStrSanitaria),
    [Luogo.IMPIANTO_SPORTIVO]: Object.values(DettLuogoImpiantoSportivo),
    [Luogo.IMPIANTO_LAVORATIVO]: Object.values(DettLuogoImpiantoLavorativo),
    [Luogo.SCUOLE]: Object.values(DettLuogoScuole),
    [Luogo.STAZIONE]: Object.values(DettLuogoStazione),
    [Luogo.FERROVIA]: Object.values(DettLuogoFerrovia),
    [Luogo.METROPOLITANA]: Object.values(DettLuogoMetropolitana),
    [Luogo.AEREOPORTI]: Object.values(DettLuogoAereoporti),
    [Luogo.QUESTURA_CASERME]: Object.values(DettLuogoQuesturaCaserme),
    [Luogo.LUOGHI_DI_CULTO]: Object.values(DettLuogoLuoghiDiCulto),
    [Luogo.IMPERVIO]: Object.values(DettLuogoImpervio),
    [Luogo.ALTRO_LUOGO]: []
};

/**
 * Maps Motivo types to their detailed reason options
 */
export const MOTIVO_DETAILS_MAP: Record<Motivo, readonly string[]> = {
    [Motivo.MEDICO_ACUTO]: Object.values(DettMotivoMedicoAcuto),
    [Motivo.SOCCORSO_PERSONA]: Object.values(DettMotivoSoccorsoPersona),
    [Motivo.EVENTO_VIOLENTO]: Object.values(DettMotivoEventoViolento),
    [Motivo.CADUTA]: Object.values(DettMotivoCaduta),
    [Motivo.INCIDENTE_INFORTUNIO]: Object.values(DettMotivoIncidenteInfortunio),
    [Motivo.INC_STRADALE]: Object.values(DettMotivoIncStradale),
    [Motivo.INC_FERROVIA]: Object.values(DettMotivoIncFerrovia),
    [Motivo.INC_ARIA]: Object.values(DettMotivoIncAria),
    [Motivo.INC_ACQUA]: Object.values(DettMotivoIncAcqua),
    [Motivo.INC_MONTANO]: Object.values(DettMotivoIncMontano),
    [Motivo.INC_SPELEO_FORRA]: Object.values(DettMotivoIncSpeleoForra),
    [Motivo.INTOSSICAZIONE]: Object.values(DettMotivoIntossicazione),
    [Motivo.ANIMALI]: Object.values(DettMotivoAnimali),
    [Motivo.PREVENZIONE]: Object.values(DettMotivoPrevenzione),
    [Motivo.EVENTO_DI_MASSA]: Object.values(DettMotivoEventoDiMassa),
    [Motivo.MAXI_EMERGENZA]: Object.values(DettMotivoMaxiEmergenza),
    [Motivo.SOCCORSO_SECONDARIO]: Object.values(DettMotivoSoccorsoSecondario),
    [Motivo.ALTRO_NON_NOTO]: []
};

/**
 * Maps NoteEvento types to their detailed note options
 */
export const NOTE_EVENTO_DETAILS_MAP: Record<NoteEvento, readonly string[]> = {
    [NoteEvento.RESPIRA]: Object.values(NoteEvento2Respira),
    [NoteEvento.DOLORE]: Object.values(NoteEvento2Dolore),
    [NoteEvento.DEFORMITA]: Object.values(NoteEvento2Deformita),
    [NoteEvento.CARDIOCIRCOLATORIO]: Object.values(NoteEvento2Cardiocircolatorio),
    [NoteEvento.EDEMA]: Object.values(NoteEvento2Edema),
    [NoteEvento.DISTRETTO_TRAUMA]: Object.values(NoteEvento2DistrettoTrauma),
    [NoteEvento.CONVULSIONI]: Object.values(NoteEvento2Convulsioni),
    [NoteEvento.CPSS]: Object.values(NoteEvento2Cpss),
    [NoteEvento.VERTIGINI]: Object.values(NoteEvento2Vertigini),
    [NoteEvento.STATO_CONFUSIONALE]: Object.values(NoteEvento2StatoConfusionale),
    [NoteEvento.ASTENIA]: Object.values(NoteEvento2Astenia),
    [NoteEvento.SEGNI]: Object.values(NoteEvento2Segni),
    [NoteEvento.CUTE]: Object.values(NoteEvento2Cute),
    [NoteEvento.SANGUINA]: Object.values(NoteEvento2Sanguina),
    [NoteEvento.ABRASIONE_CONTUSIONE]: Object.values(NoteEvento2AbrasioneContusione),
    [NoteEvento.DIABETICO]: Object.values(NoteEvento2Diabetico),
    [NoteEvento.INSUFFICIENZA_RENALE]: Object.values(NoteEvento2InsufficenzaRenale),
    [NoteEvento.PENETRANTE]: Object.values(NoteEvento2Penetrante),
    [NoteEvento.PROIETTATO]: Object.values(NoteEvento2SiNo),
    [NoteEvento.SBALZATO]: Object.values(NoteEvento2SiNo),
    [NoteEvento.INCASTRATO]: Object.values(NoteEvento2SiNo),
    [NoteEvento.MINUS_2_5_MT]: [],
    [NoteEvento.FROM_2_5_TO_5_MT]: [],
    [NoteEvento.PLUS_5_MT]: [],
    [NoteEvento.TRAVAGLIO]: Object.values(NoteEvento2Travaglio),
    [NoteEvento.CONTRAZIONI_MINUS_5_MIN]: Object.values(NoteEvento2SiNo),
    [NoteEvento.GRAVIDANZA]: Object.values(NoteEvento2Gravidanza),
    [NoteEvento.PARTO]: Object.values(NoteEvento2Parto),
    [NoteEvento.INCENDIO]: Object.values(NoteEvento2Incendio),
    [NoteEvento.INCENDIO_INDUSTRIALE]: Object.values(NoteEvento2Incendio),
    [NoteEvento.INCENDIO_ABITAZIONE]: Object.values(NoteEvento2Incendio),
    [NoteEvento.SOSP_INTOSSICAZIONE_DA_MONOSSIDO]: Object.values(NoteEvento2SiNo),
    [NoteEvento.AUTOLESIONISMO]: Object.values(NoteEvento2Autolesionismo),
    [NoteEvento.PSICHIATRICO_NOTO]: Object.values(NoteEvento2SiNo),
    [NoteEvento.NO_NON_NOTO]: [],
    [NoteEvento.ALTRI_SEGNI]: [],
    [NoteEvento.SEGUE]: []
};

/**
 * Mission data structure representing all information collected during emergency call intake
 */
export type EventDetails = {
    /** Priority code (color-based triage) */
    codice: Codice;
    /** Location type */
    luogo: Luogo;
    /** Detailed location specification */
    dettLuogo: DettLuogo;
    /** Reason for emergency */
    motivo: Motivo;
    /** Detailed reason specification */
    dettMotivo: DettMotivo;
    /** Patient consciousness level */
    coscienza: Coscienza;
    /** Event notes (symptoms/circumstances) */
    noteEvento: NoteEvento;
    /** Detailed event notes */
    noteEvento2: NoteEvento2;
    /** Free text for additional notes */
    altroEvento: string;
    /** Fire brigade alerted */
    vvf: boolean;
    /** Police forces alerted */
    ffo: boolean;
};
