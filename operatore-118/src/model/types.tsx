export const RegionStatus = {
    Available: 'available',
    Unavailable: 'unavailable',
    WorkInProgress: 'work-in-progress'
} as const;

export type RegionStatus = typeof RegionStatus[keyof typeof RegionStatus];

export type Region = {
    id: string;
    label: string;
    status: RegionStatus;
    dispatchCenters?: DispatchCenter[];
    hospitals: Hospital[];
}

export type DispatchCenter = {
    id: string;
    label: string;
}

export const HospitalClassification = {
    ps: 'ps',
    dea: 'dea',
    eas: 'eas'
} as const;

export type HospitalClassification = typeof HospitalClassification[keyof typeof HospitalClassification];

export const HospitalTraumaLevel = {
    cts: 'cts',
    ctz: 'ctz',
    pst: 'pst',
    ott: 'ott',
} as const;

export type HospitalTraumaLevel = typeof HospitalTraumaLevel[keyof typeof HospitalTraumaLevel];

export const HospitalSpecialty = {
    puntoNascita: 'punto-nascita',
    pediatria: 'pediatria',
    emodinamica: 'emodinamica',
    trauma: 'trauma',
    strokeUnit: 'stroke-unit',
    neurochirurgia: 'neurochirurgia',
    rianimazione: 'rianimazione',
    psichiatria: 'psichiatria'
} as const;

export type HospitalSpecialty = typeof HospitalSpecialty[keyof typeof HospitalSpecialty];

export type Hospital = {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    maxPatients: number;
    classification: HospitalClassification;
    traumaLevel: HospitalTraumaLevel | null;
    specialties: HospitalSpecialty[];
    // traumaLevel must be null if trauma is not in specialties
    // traumaLevel can be non-null only if trauma is in specialties
} & (
    | { specialties: Exclude<HospitalSpecialty, typeof HospitalSpecialty.trauma>[]; traumaLevel: null }
    | { specialties: (HospitalSpecialty)[] & Array<typeof HospitalSpecialty.trauma | HospitalSpecialty>; traumaLevel: HospitalTraumaLevel }
)
