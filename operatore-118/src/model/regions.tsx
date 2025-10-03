
import {type Region, RegionStatus} from './types';
import * as hospitals from './hospitals';

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
        { id: 'NORD', label: 'SUEM 118 Nord' },
        { id: 'SUD', label: 'SUEM 118 Sud' }
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
        { id: '118 Emilia Ovest', label: '118 Emilia Ovest' },
        { id: '118 Emilia Est', label: '118 Emilia Est' },
        { id: '118 Romagna', label: '118 Romagna' }
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
        { id: 'NORD', label: 'CORES NORD' },
        { id: 'METRO', label: 'CORES METROPOLITANA' },
        { id: 'SUD', label: 'CORES SUD' }
    ],
    hospitals: []
};

export const LIGURIA: Region = { 
    id: 'liguria',
    label: 'Liguria', 
    status: RegionStatus.Available,
    dispatchCenters: [
        { id: 'ASL1', label: '118 Imperia Soccorso' },
        { id: 'ASL2', label: '118 Savona Soccorso' },
        { id: 'ASL3', label: '118 Genova Soccorso' },
        { id: 'ASL4', label: '118 Tigullio Soccorso' },
        { id: 'ASL5', label: '118 La Spezia Soccorso' }
    ],
    hospitals: []
};

export const LOMBARDIA: Region = { 
    id: 'lombardia',
    label: 'Lombardia', 
    status: RegionStatus.Available,
    dispatchCenters: [
        { id: 'SRA', label: 'SOREU Alpina' },
        { id: 'SRL', label: 'SOREU Laghi' },
        { id: 'SRM', label: 'SOREU Metropolitana' },
        { id: 'SRP', label: 'SOREU Pianura' }
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
        { id: 'FG', label: '118 Foggia' },
        { id: 'BA', label: '118 Bari' },
        { id: 'BR', label: '118 Brindisi' },
        { id: 'LE', label: '118 Lecce' }
    ],
    hospitals: []
};

export const SARDEGNA: Region = { 
    id: 'sardegna',
    label: 'Sardegna', 
    status: RegionStatus.Available,
    dispatchCenters: [
        { id: 'NORD', label: '118 Nord - Sassari' },
        { id: 'SUD', label: '118 Sud - Cagliari' }
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
        { id: 'Belluno Emergenza', label: '118 Belluno Emergenza' },
        { id: 'Padova Emergenza', label: '118 Padova Emergenza' },
        { id: 'Rovigo Emergenza', label: '118 Rovigo Emergenza' },
        { id: 'Treviso Emergenza', label: '118 Treviso Emergenza' },
        { id: 'Venezia Emergenza', label: '118 Venezia Emergenza' },
        { id: 'Vicenza Emergenza', label: '118 Vicenza Emergenza' },
        { id: 'Verona Emergenza', label: '118 Verona Emergenza' }
    ],
    hospitals: []
};
