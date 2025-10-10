import { type Hospital, HospitalClassification, HospitalSpecialty, HospitalTraumaLevel } from '../model/hospital';

export const H_LECCO: Hospital = {
    id: 'H_LECCO',
    name: 'H LECCO',
    latitude: 45.853242,
    longitude: 9.415524,
    maxPatients: 60,
    classification: HospitalClassification.eas,
    traumaLevel: HospitalTraumaLevel.ctz,
    specialties: [
        HospitalSpecialty.puntoNascita,
        HospitalSpecialty.pediatria,
        HospitalSpecialty.trauma,
        HospitalSpecialty.emodinamica,
        HospitalSpecialty.strokeUnit,
        HospitalSpecialty.neurochirurgia,
        HospitalSpecialty.rianimazione,
        HospitalSpecialty.psichiatria
    ]
};

export const H_MERATE: Hospital = {
    id: 'H_MERATE',
    name: 'H MERATE',
    latitude: 45.698204,
    longitude: 9.427831,
    maxPatients: 40,
    classification: HospitalClassification.dea,
    traumaLevel: HospitalTraumaLevel.pst,
    specialties: [
        HospitalSpecialty.pediatria,
        HospitalSpecialty.trauma,
        HospitalSpecialty.strokeUnit,
        HospitalSpecialty.rianimazione
    ]
};
export const H_VIMERCATE: Hospital = {
    id: 'H_VIMERCATE',
    name: 'H VIMERCATE',
    latitude: 45.6075192,
    longitude: 9.3555951,
    maxPatients: 40,
    classification: HospitalClassification.dea,
    traumaLevel: HospitalTraumaLevel.pst,
    specialties: [
        HospitalSpecialty.puntoNascita,
        HospitalSpecialty.pediatria,
        HospitalSpecialty.trauma,
        HospitalSpecialty.emodinamica,
        HospitalSpecialty.strokeUnit,
        HospitalSpecialty.rianimazione,
        HospitalSpecialty.psichiatria
    ]
};
export const H_S_GERARDO: Hospital = {
    id: 'H_S_GERARDO',
    name: 'H S. GERARDO',
    latitude: 45.602252,
    longitude: 9.257939,
    maxPatients: 80,
    classification: HospitalClassification.eas,
    traumaLevel: HospitalTraumaLevel.cts,
    specialties: [
        HospitalSpecialty.puntoNascita,
        HospitalSpecialty.pediatria,
        HospitalSpecialty.trauma,
        HospitalSpecialty.emodinamica,
        HospitalSpecialty.strokeUnit,
        HospitalSpecialty.neurochirurgia,
        HospitalSpecialty.rianimazione,
        HospitalSpecialty.psichiatria
    ]
};
export const H_POLICLINICO_MB: Hospital = {
    id: 'H_POLICLINICO_MB',
    name: 'H POLICLINICO MB',
    latitude: 45.5839275,
    longitude: 9.2959861,
    maxPatients: 30,
    classification: HospitalClassification.dea,
    traumaLevel: HospitalTraumaLevel.ott,
    specialties: [
        HospitalSpecialty.trauma,
        HospitalSpecialty.emodinamica,
        HospitalSpecialty.strokeUnit,
        HospitalSpecialty.neurochirurgia,
        HospitalSpecialty.rianimazione
    ]
};
export const H_DESIO: Hospital = {
    id: 'H_DESIO',
    name: 'H DESIO',
    latitude: 45.627490,
    longitude: 9.195487,
    maxPatients: 40,
    classification: HospitalClassification.dea,
    traumaLevel: HospitalTraumaLevel.ott,
    specialties: [
        HospitalSpecialty.puntoNascita,
        HospitalSpecialty.pediatria,
        HospitalSpecialty.trauma,
        HospitalSpecialty.emodinamica,
        HospitalSpecialty.strokeUnit,
        HospitalSpecialty.rianimazione,
        HospitalSpecialty.psichiatria
    ]
};
export const H_CARATE_BZA: Hospital = {
    id: 'H_CARATE_BZA',
    name: 'H CARATE B.ZA',
    latitude: 45.670483,
    longitude: 9.248291,
    maxPatients: 30,
    classification: HospitalClassification.ps,
    traumaLevel: HospitalTraumaLevel.ott,
    specialties: [
        HospitalSpecialty.puntoNascita,
        HospitalSpecialty.pediatria,
        HospitalSpecialty.trauma,
        HospitalSpecialty.rianimazione
    ]
};
export const H_ERBA: Hospital = {
    id: 'H_ERBA',
    name: 'H ERBA',
    latitude: 45.816936,
    longitude: 9.226226,
    maxPatients: 30,
    classification: HospitalClassification.ps,
    traumaLevel: HospitalTraumaLevel.ott,
    specialties: [
        HospitalSpecialty.puntoNascita,
        HospitalSpecialty.pediatria,
        HospitalSpecialty.trauma,
        HospitalSpecialty.emodinamica,
        HospitalSpecialty.strokeUnit,
        HospitalSpecialty.rianimazione,
        HospitalSpecialty.psichiatria
    ]
};
export const H_CANTU: Hospital = {
    id: 'H_CANTU',
    name: 'H CANTU',
    latitude: 45.7390571,
    longitude: 9.1404271,
    maxPatients: 30,
    classification: HospitalClassification.ps,
    traumaLevel: HospitalTraumaLevel.pst,
    specialties: [
        HospitalSpecialty.pediatria,
        HospitalSpecialty.trauma,
        HospitalSpecialty.rianimazione,
        HospitalSpecialty.psichiatria
    ]
};
export const H_S_ANNA: Hospital = {
    id: 'H_S_ANNA',
    name: 'H S. ANNA',
    latitude: 45.792512,
    longitude: 9.045426,
    maxPatients: 60,
    classification: HospitalClassification.eas,
    traumaLevel: HospitalTraumaLevel.ctz,
    specialties: [
        HospitalSpecialty.puntoNascita,
        HospitalSpecialty.pediatria,
        HospitalSpecialty.trauma,
        HospitalSpecialty.emodinamica,
        HospitalSpecialty.strokeUnit,
        HospitalSpecialty.neurochirurgia,
        HospitalSpecialty.rianimazione,
        HospitalSpecialty.psichiatria
    ]
};
export const H_VALDUCE: Hospital = {
    id: 'H_VALDUCE',
    name: 'H VALDUCE',
    latitude: 45.8107148,
    longitude: 9.088739,
    maxPatients: 40,
    classification: HospitalClassification.dea,
    traumaLevel: HospitalTraumaLevel.ott,
    specialties: [
        HospitalSpecialty.puntoNascita,
        HospitalSpecialty.pediatria,
        HospitalSpecialty.trauma,
        HospitalSpecialty.strokeUnit,
        HospitalSpecialty.rianimazione
    ]
};
export const H_MENAGGIO: Hospital = {
    id: 'H_MENAGGIO',
    name: 'H MENAGGIO',
    latitude: 46.0181217,
    longitude: 9.2281901,
    maxPatients: 25,
    classification: HospitalClassification.ps,
    traumaLevel: HospitalTraumaLevel.ott,
    specialties: [
        HospitalSpecialty.trauma,
        HospitalSpecialty.rianimazione
    ]
};
