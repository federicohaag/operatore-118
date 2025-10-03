import type { Hospital } from '../model/types';
import { HospitalClassification, HospitalSpecialty, HospitalTraumaLevel } from '../model/types';

export const HOSPITALS: ReadonlyArray<Hospital> = [
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
        id: 'H_GRAVEDONA',
        name: 'H GRAVEDONA',
        latitude: 46.1421321,
        longitude: 9.2996511,
        maxPatients: 30,
        classification: HospitalClassification.dea,
        traumaLevel: HospitalTraumaLevel.ctz,
        specialties: [
            HospitalSpecialty.puntoNascita,
            HospitalSpecialty.pediatria,
            HospitalSpecialty.trauma,
            HospitalSpecialty.emodinamica,
            HospitalSpecialty.strokeUnit,
            HospitalSpecialty.neurochirurgia,
            HospitalSpecialty.rianimazione
        ]
    },
    {
        id: 'H_SARONNO',
        name: 'H SARONNO',
        latitude: 45.630403,
        longitude: 9.039218,
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
    },
    {
        id: 'H_CASTELLANZA',
        name: 'H CASTELLANZA',
        latitude: 45.609084,
        longitude: 8.906880,
        maxPatients: 30,
        classification: HospitalClassification.ps,
        traumaLevel: HospitalTraumaLevel.ott,
        specialties: [
            HospitalSpecialty.trauma,
            HospitalSpecialty.emodinamica,
            HospitalSpecialty.rianimazione
        ]
    },
    {
        id: 'H_BUSTO_ARSIZIO',
        name: 'H BUSTO ARSIZIO',
        latitude: 45.623361,
        longitude: 8.846532,
        maxPatients: 40,
        classification: HospitalClassification.ps,
        traumaLevel: HospitalTraumaLevel.ott,
        specialties: [
            HospitalSpecialty.puntoNascita,
            HospitalSpecialty.pediatria,
            HospitalSpecialty.trauma,
            HospitalSpecialty.emodinamica,
            HospitalSpecialty.rianimazione
        ]
    },
    {
        id: 'H_TRADATE',
        name: 'H TRADATE',
        latitude: 45.722282,
        longitude: 8.900797,
        maxPatients: 30,
        classification: HospitalClassification.ps,
        traumaLevel: HospitalTraumaLevel.pst,
        specialties: [
            HospitalSpecialty.pediatria,
            HospitalSpecialty.trauma,
            HospitalSpecialty.strokeUnit,
            HospitalSpecialty.rianimazione
        ]
    },
    {
        id: 'H_ANGERA',
        name: 'H ANGERA',
        latitude: 45.775994,
        longitude: 8.578733,
        maxPatients: 20,
        classification: HospitalClassification.ps,
        traumaLevel: HospitalTraumaLevel.ott,
        specialties: [
            HospitalSpecialty.pediatria,
            HospitalSpecialty.trauma
        ]
    },
    {
        id: 'H_CITTIGLIO',
        name: 'H CITTIGLIO',
        latitude: 45.894206,
        longitude: 8.667556,
        maxPatients: 20,
        classification: HospitalClassification.ps,
        traumaLevel: HospitalTraumaLevel.pst,
        specialties: [
            HospitalSpecialty.puntoNascita,
            HospitalSpecialty.pediatria,
            HospitalSpecialty.trauma,
            HospitalSpecialty.psichiatria
        ]
    },
    {
        id: 'H_LUINO',
        name: 'H LUINO',
        latitude: 45.996143,
        longitude: 8.745852,
        maxPatients: 20,
        classification: HospitalClassification.ps,
        traumaLevel: HospitalTraumaLevel.pst,
        specialties: [
            HospitalSpecialty.trauma
        ]
    },
    {
        id: 'H_VARESE',
        name: 'H VARESE',
        latitude: 45.8074569,
        longitude: 8.8412989,
        maxPatients: 60,
        classification: HospitalClassification.eas,
        traumaLevel: HospitalTraumaLevel.cts,
        specialties: [
            HospitalSpecialty.trauma,
            HospitalSpecialty.emodinamica,
            HospitalSpecialty.strokeUnit,
            HospitalSpecialty.neurochirurgia,
            HospitalSpecialty.rianimazione,
            HospitalSpecialty.psichiatria
        ]
    },
    {
        id: 'H_DEL_PONTE',
        name: 'H DEL PONTE',
        latitude: 45.815245,
        longitude: 8.834975,
        maxPatients: 20,
        classification: HospitalClassification.ps,
        traumaLevel: HospitalTraumaLevel.ott,
        specialties: [
            HospitalSpecialty.puntoNascita,
            HospitalSpecialty.pediatria,
            HospitalSpecialty.trauma
        ]
    },
    {
        id: 'H_GALLARATE',
        name: 'H GALLARATE',
        latitude: 45.6560024,
        longitude: 8.7921443,
        maxPatients: 40,
        classification: HospitalClassification.dea,
        traumaLevel: HospitalTraumaLevel.pst,
        specialties: [
            HospitalSpecialty.puntoNascita,
            HospitalSpecialty.pediatria,
            HospitalSpecialty.trauma,
            HospitalSpecialty.emodinamica,
            HospitalSpecialty.strokeUnit,
            HospitalSpecialty.rianimazione
        ]
    }
];
