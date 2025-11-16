
import {type Region, RegionStatus} from '../model/region';
import * as hospitals from './hospitals';
import * as cities from './cities';
// TODO: dispatch centers coordinates are random, should be put correctly
export const ABRUZZO: Region = { 
    id: 'abruzzo', 
    label: 'Abruzzo', 
    status: RegionStatus.WorkInProgress, 
    hospitals: [] 
};

export const BASILICATA: Region = { 
    id: 'basilicata', 
    label: 'Basilicata', 
    status: RegionStatus.WorkInProgress, 
    hospitals: [] 
};

export const CALABRIA: Region = { 
    id: 'calabria',
    label: 'Calabria', 
    status: RegionStatus.Available, 
    dispatchCenters: [
        { id: 'NORD', label: 'SUEM 118 Nord', latitude: 38.9097, longitude: 16.5967, cities: [] },
        { id: 'SUD', label: 'SUEM 118 Sud', latitude: 38.9097, longitude: 16.5967, cities: [] }
    ],
    hospitals: []
};
export const CAMPANIA: Region = { 
    id: 'campania', 
    label: 'Campania', 
    status: RegionStatus.WorkInProgress, 
    hospitals: [] 
};

export const EMILIA_ROMAGNA: Region = { 
    id: 'emilia-romagna',
    label: 'Emilia-Romagna', 
    status: RegionStatus.Available,
    dispatchCenters: [
        { id: '118 Emilia Ovest', label: '118 Emilia Ovest', latitude: 44.4949, longitude: 11.3426, cities: [] },
        { id: '118 Emilia Est', label: '118 Emilia Est', latitude: 44.4949, longitude: 11.3426, cities: [] },
        { id: '118 Romagna', label: '118 Romagna', latitude: 44.4949, longitude: 11.3426, cities: [] }
    ],
    hospitals: []
};

export const FRIULI_VENEZIA_GIULIA: Region = { 
    id: 'friuli-venezia-giulia', 
    label: 'Friuli-Venezia Giulia', 
    status: RegionStatus.WorkInProgress, 
    hospitals: [] 
};
export const LAZIO: Region = { 
    id: 'lazio',
    label: 'Lazio', 
    status: RegionStatus.Available,
    dispatchCenters: [
        { id: 'NORD', label: 'CORES NORD', latitude: 41.9028, longitude: 12.4964, cities: [] },
        { id: 'METRO', label: 'CORES METROPOLITANA', latitude: 41.9028, longitude: 12.4964, cities: [] },
        { id: 'SUD', label: 'CORES SUD', latitude: 41.9028, longitude: 12.4964, cities: [] }
    ],
    hospitals: []
};

export const LIGURIA: Region = { 
    id: 'liguria',
    label: 'Liguria', 
    status: RegionStatus.Available,
    dispatchCenters: [
        { id: 'ASL1', label: '118 Imperia Soccorso', latitude: 44.4056, longitude: 8.9463, cities: [] },
        { id: 'ASL2', label: '118 Savona Soccorso', latitude: 44.4056, longitude: 8.9463, cities: [] },
        { id: 'ASL3', label: '118 Genova Soccorso', latitude: 44.4056, longitude: 8.9463, cities: [] },
        { id: 'ASL4', label: '118 Tigullio Soccorso', latitude: 44.4056, longitude: 8.9463, cities: [] },
        { id: 'ASL5', label: '118 La Spezia Soccorso', latitude: 44.4056, longitude: 8.9463, cities: [] }
    ],
    hospitals: []
};

export const LOMBARDIA: Region = { 
    id: 'lombardia',
    label: 'Lombardia', 
    status: RegionStatus.Available,
    dispatchCenters: [
        { id: 'SRA', label: 'SOREU Alpina', latitude: 45.4642, longitude: 9.1900, cities: [] },
        { id: 'SRL', label: 'SOREU Laghi', latitude: 45.4642, longitude: 9.1900, cities: [cities.COMO, cities.VARESE] },
        { id: 'SRM', label: 'SOREU Metropolitana', latitude: 45.4642, longitude: 9.1900, cities: [] },
        { id: 'SRP', label: 'SOREU Pianura', latitude: 45.4642, longitude: 9.1900, cities: [] }
    ],
    hospitals: [
        hospitals.H_LECCO, hospitals.H_VALDUCE, hospitals.H_CANTU, hospitals.H_S_GERARDO
    ]
};
export const MARCHE: Region = { 
    id: 'marche', 
    label: 'Marche', 
    status: RegionStatus.WorkInProgress, 
    hospitals: [] 
};

export const MOLISE: Region = { 
    id: 'molise', 
    label: 'Molise', 
    status: RegionStatus.WorkInProgress, 
    hospitals: [] 
};

export const PIEMONTE: Region = { 
    id: 'piemonte', 
    label: 'Piemonte', 
    status: RegionStatus.WorkInProgress, 
    hospitals: [] 
};
export const PUGLIA: Region = { 
    id: 'puglia',
    label: 'Puglia', 
    status: RegionStatus.Available,
    dispatchCenters: [
        { id: 'FG', label: '118 Foggia', latitude: 41.1171, longitude: 16.8719, cities: [] },
        { id: 'BA', label: '118 Bari', latitude: 41.1171, longitude: 16.8719, cities: [] },
        { id: 'BR', label: '118 Brindisi', latitude: 41.1171, longitude: 16.8719, cities: [] },
        { id: 'LE', label: '118 Lecce', latitude: 41.1171, longitude: 16.8719, cities: [] }
    ],
    hospitals: []
};

export const SARDEGNA: Region = { 
    id: 'sardegna',
    label: 'Sardegna', 
    status: RegionStatus.Available,
    dispatchCenters: [
        { id: 'NORD', label: '118 Nord - Sassari', latitude: 39.2238, longitude: 9.1217, cities: [] },
        { id: 'SUD', label: '118 Sud - Cagliari', latitude: 39.2238, longitude: 9.1217, cities: [] }
    ],
    hospitals: []
};
export const SICILIA: Region = { 
    id: 'sicilia', 
    label: 'Sicilia', 
    status: RegionStatus.WorkInProgress, 
    hospitals: [] 
};

export const TOSCANA: Region = { 
    id: 'toscana', 
    label: 'Toscana', 
    status: RegionStatus.WorkInProgress, 
    hospitals: [] 
};

export const TRENTINO_ALTO_ADIGE: Region = { 
    id: 'trentino-alto-adige', 
    label: 'Trentino-Alto Adige', 
    status: RegionStatus.WorkInProgress, 
    hospitals: [] 
};

export const UMBRIA: Region = { 
    id: 'umbria', 
    label: 'Umbria', 
    status: RegionStatus.WorkInProgress, 
    hospitals: [] 
};

export const VALLE_D_AOSTA: Region = { 
    id: 'valle-d-aosta', 
    label: "Valle d'Aosta", 
    status: RegionStatus.WorkInProgress, 
    hospitals: [] 
};

export const VENETO: Region = { 
    id: 'veneto',
    label: 'Veneto', 
    status: RegionStatus.Available,
    dispatchCenters: [
        { id: 'Belluno Emergenza', label: '118 Belluno Emergenza', latitude: 45.4408, longitude: 12.3155, cities: [] },
        { id: 'Padova Emergenza', label: '118 Padova Emergenza', latitude: 45.4408, longitude: 12.3155, cities: [] },
        { id: 'Rovigo Emergenza', label: '118 Rovigo Emergenza', latitude: 45.4408, longitude: 12.3155, cities: [] },
        { id: 'Treviso Emergenza', label: '118 Treviso Emergenza', latitude: 45.4408, longitude: 12.3155, cities: [] },
        { id: 'Venezia Emergenza', label: '118 Venezia Emergenza', latitude: 45.4408, longitude: 12.3155, cities: [] },
        { id: 'Vicenza Emergenza', label: '118 Vicenza Emergenza', latitude: 45.4408, longitude: 12.3155, cities: [] },
        { id: 'Verona Emergenza', label: '118 Verona Emergenza', latitude: 45.4408, longitude: 12.3155, cities: [] }
    ],
    hospitals: []
};
