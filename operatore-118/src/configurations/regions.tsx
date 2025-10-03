import type { Region } from '../model/types';
import { RegionStatus } from '../model/types';

export const REGIONS: ReadonlyArray<Region> = [
    { id: 'abruzzo', label: 'Abruzzo', status: RegionStatus.WorkInProgress },
    { id: 'basilicata', label: 'Basilicata', status: RegionStatus.WorkInProgress },
    { 
        id: 'calabria',
        label: 'Calabria', 
        status: RegionStatus.Available, 
        dispatchCenters: [
            { id: 'NORD', label: 'SUEM 118 Nord' },
            { id: 'SUD', label: 'SUEM 118 Sud' }
        ]
    },
    { id: 'campania', label: 'Campania', status: RegionStatus.WorkInProgress },
    { 
        id: 'emilia-romagna',
        label: 'Emilia-Romagna', 
        status: RegionStatus.Available,
        dispatchCenters: [
            { id: '118 Emilia Ovest', label: '118 Emilia Ovest' },
            { id: '118 Emilia Est', label: '118 Emilia Est' },
            { id: '118 Romagna', label: '118 Romagna' }
        ]
    },
    { id: 'friuli-venezia-giulia', label: 'Friuli-Venezia Giulia', status: RegionStatus.WorkInProgress },
    { 
        id: 'lazio',
        label: 'Lazio', 
        status: RegionStatus.Available,
        dispatchCenters: [
            { id: 'NORD', label: 'CORES NORD' },
            { id: 'METRO', label: 'CORES METROPOLITANA' },
            { id: 'SUD', label: 'CORES SUD' }
        ]
    },
    { 
        id: 'liguria',
        label: 'Liguria', 
        status: RegionStatus.Available,
        dispatchCenters: [
            { id: 'ASL1', label: '118 Imperia Soccorso' },
            { id: 'ASL2', label: '118 Savona Soccorso' },
            { id: 'ASL3', label: '118 Genova Soccorso' },
            { id: 'ASL4', label: '118 Tigullio Soccorso' },
            { id: 'ASL5', label: '118 La Spezia Soccorso' }
        ]
    },
    { 
        id: 'lombardia',
        label: 'Lombardia', 
        status: RegionStatus.Available,
        dispatchCenters: [
            { id: 'SRA', label: 'SOREU Alpina' },
            { id: 'SRL', label: 'SOREU Laghi' },
            { id: 'SRM', label: 'SOREU Metropolitana' },
            { id: 'SRP', label: 'SOREU Pianura' }
        ]
    },
    { id: 'marche', label: 'Marche', status: RegionStatus.WorkInProgress },
    { id: 'molise', label: 'Molise', status: RegionStatus.WorkInProgress },
    { id: 'piemonte', label: 'Piemonte', status: RegionStatus.WorkInProgress },
    { 
        id: 'puglia',
        label: 'Puglia', 
        status: RegionStatus.Available,
        dispatchCenters: [
            { id: 'FG', label: '118 Foggia' },
            { id: 'BA', label: '118 Bari' },
            { id: 'BR', label: '118 Brindisi' },
            { id: 'LE', label: '118 Lecce' }
        ]
    },
    { 
        id: 'sardegna',
        label: 'Sardegna', 
        status: RegionStatus.Available,
        dispatchCenters: [
            { id: 'NORD', label: '118 Nord - Sassari' },
            { id: 'SUD', label: '118 Sud - Cagliari' }
        ]
    },
    { id: 'sicilia', label: 'Sicilia', status: RegionStatus.WorkInProgress },
    { id: 'toscana', label: 'Toscana', status: RegionStatus.WorkInProgress },
    { id: 'trentino-alto-adige', label: 'Trentino-Alto Adige', status: RegionStatus.WorkInProgress },
    { id: 'umbria', label: 'Umbria', status: RegionStatus.WorkInProgress },
    { id: 'valle-d-aosta', label: "Valle d'Aosta", status: RegionStatus.WorkInProgress },
    { 
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
        ]
    }
];