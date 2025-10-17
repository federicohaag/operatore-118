/**
 * Hospital classification level in the Italian emergency care network
 * 
 * Defines the level of emergency care services available at a hospital:
 * - PS (Pronto Soccorso): Basic emergency room
 * - DEA (Dipartimento Emergenza Accettazione): Emergency department with specialty services
 * - EAS (Emergenza Alta Specialità): Highly specialized emergency department
 */
export const HospitalClassification = {
    /** Pronto Soccorso - Basic emergency room */
    ps: 'ps',
    
    /** Dipartimento Emergenza Accettazione - Emergency department with specialty services */
    dea: 'dea',
    
    /** Emergenza Alta Specialità - Highly specialized emergency department */
    eas: 'eas'
} as const;

export type HospitalClassification = typeof HospitalClassification[keyof typeof HospitalClassification];

/**
 * Trauma center designation levels
 * 
 * Defines the trauma care capabilities of a hospital:
 * - CTS (Centro Trauma di secondo livello): Second-level trauma center
 * - CTZ (Centro Trauma di zona): Regional trauma center
 * - PST (Presidio Sanitario Territoriale): Local healthcare facility with trauma capability
 * - OTT (Ospedale Trauma Team): Hospital with dedicated trauma team
 */
export const HospitalTraumaLevel = {
    /** Centro Trauma di secondo livello - Second-level trauma center */
    cts: 'cts',
    
    /** Centro Trauma di zona - Regional trauma center */
    ctz: 'ctz',
    
    /** Presidio Sanitario Territoriale - Local healthcare facility with trauma capability */
    pst: 'pst',
    
    /** Ospedale Trauma Team - Hospital with dedicated trauma team */
    ott: 'ott',
} as const;

export type HospitalTraumaLevel = typeof HospitalTraumaLevel[keyof typeof HospitalTraumaLevel];

/**
 * Specialized medical services available at a hospital
 * 
 * Indicates which specialized departments and services the hospital has.
 * These specialties determine which types of patients can be appropriately
 * transported to this hospital.
 */
export const HospitalSpecialty = {
    /** Punto nascita - Maternity/birthing services */
    puntoNascita: 'punto-nascita',
    
    /** Pediatria - Pediatric emergency and care services */
    pediatria: 'pediatria',
    
    /** Emodinamica - Cardiac catheterization lab for acute cardiac interventions */
    emodinamica: 'emodinamica',
    
    /** Trauma - Trauma surgery and care capabilities */
    trauma: 'trauma',
    
    /** Stroke Unit - Specialized stroke care unit */
    strokeUnit: 'stroke-unit',
    
    /** Neurochirurgia - Neurosurgery department */
    neurochirurgia: 'neurochirurgia',
    
    /** Rianimazione - Intensive care/resuscitation unit */
    rianimazione: 'rianimazione',
    
    /** Psichiatria - Psychiatric emergency services */
    psichiatria: 'psichiatria'
} as const;

export type HospitalSpecialty = typeof HospitalSpecialty[keyof typeof HospitalSpecialty];

/**
 * Represents a hospital in the emergency care network
 * 
 * Contains geographic location, capacity, classification level, and available
 * specialized services. The type enforces that traumaLevel can only be set
 * when the hospital has trauma specialty capabilities.
 * 
 * Type constraint: traumaLevel must be null if trauma is not in specialties,
 * and must be non-null if trauma is in specialties.
 */
export type Hospital = {
    /** Unique identifier for the hospital */
    id: string;
    
    /** Full name of the hospital */
    name: string;
    
    /** Geographic latitude of the hospital location */
    latitude: number;
    
    /** Geographic longitude of the hospital location */
    longitude: number;
    
    /** Maximum number of patients the hospital can accept simultaneously */
    maxPatients: number;
    
    /** Emergency care classification level (PS, DEA, or EAS) */
    classification: HospitalClassification;
    
    /** Trauma center designation level (only if trauma specialty is available) */
    traumaLevel: HospitalTraumaLevel | null;
    
    /** List of specialized medical services available at this hospital */
    specialties: HospitalSpecialty[];
} & (
    /** Hospital without trauma capabilities - traumaLevel must be null */
    | { specialties: Exclude<HospitalSpecialty, typeof HospitalSpecialty.trauma>[]; traumaLevel: null }
    /** Hospital with trauma capabilities - traumaLevel must be specified */
    | { specialties: (HospitalSpecialty)[] & Array<typeof HospitalSpecialty.trauma | HospitalSpecialty>; traumaLevel: HospitalTraumaLevel }
)