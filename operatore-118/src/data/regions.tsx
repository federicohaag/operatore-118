
import {type Region, RegionStatus} from '../model/region';
import * as hospitals from './dispatch-centers/Lombardia/hospitals';
import * as lombardia from './dispatch-centers/Lombardia/dispatch-centers';

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
    status: RegionStatus.WorkInProgress, 
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
    status: RegionStatus.WorkInProgress,
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
    status: RegionStatus.WorkInProgress,
    hospitals: []
};

export const LIGURIA: Region = { 
    id: 'liguria',
    label: 'Liguria', 
    status: RegionStatus.WorkInProgress,
    hospitals: []
};

export const LOMBARDIA: Region = { 
    id: 'lombardia',
    label: 'Lombardia', 
    status: RegionStatus.Available,
    dispatchCenters: lombardia.LOMBARDIA_DISPATCH_CENTERS,
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
    status: RegionStatus.WorkInProgress,
    hospitals: []
};

export const SARDEGNA: Region = { 
    id: 'sardegna',
    label: 'Sardegna', 
    status: RegionStatus.WorkInProgress,
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
    status: RegionStatus.WorkInProgress,
    hospitals: []
};
