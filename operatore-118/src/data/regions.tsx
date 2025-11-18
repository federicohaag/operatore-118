
import {type Region, RegionStatus} from '../model/region';
import * as hospitals from './hospitals';
import * as calabria from './dispatch-centers/Calabria/dispatch-centers';
import * as emiliaRomagna from './dispatch-centers/Emilia-Romagna/dispatch-centers';
import * as lazio from './dispatch-centers/Lazio/dispatch-centers';
import * as liguria from './dispatch-centers/Liguria/dispatch-centers';
import * as lombardia from './dispatch-centers/Lombardia/dispatch-centers';
import * as puglia from './dispatch-centers/Puglia/dispatch-centers';
import * as sardegna from './dispatch-centers/Sardegna/dispatch-centers';
import * as veneto from './dispatch-centers/Veneto/dispatch-centers';
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
    dispatchCenters: calabria.CALABRIA_DISPATCH_CENTERS,
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
    dispatchCenters: emiliaRomagna.EMILIA_ROMAGNA_DISPATCH_CENTERS,
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
    dispatchCenters: lazio.LAZIO_DISPATCH_CENTERS,
    hospitals: []
};

export const LIGURIA: Region = { 
    id: 'liguria',
    label: 'Liguria', 
    status: RegionStatus.Available,
    dispatchCenters: liguria.LIGURIA_DISPATCH_CENTERS,
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
    status: RegionStatus.Available,
    dispatchCenters: puglia.PUGLIA_DISPATCH_CENTERS,
    hospitals: []
};

export const SARDEGNA: Region = { 
    id: 'sardegna',
    label: 'Sardegna', 
    status: RegionStatus.Available,
    dispatchCenters: sardegna.SARDEGNA_DISPATCH_CENTERS,
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
    dispatchCenters: veneto.VENETO_DISPATCH_CENTERS,
    hospitals: []
};
