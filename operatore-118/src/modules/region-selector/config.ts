import { type RegionConfiguration, type RegionName } from './types';
import { Regions, RegionStatus } from './types';

interface DispatchCenterOption {
    id: string;
    label: string;
}

export const dispatchCenterConfig: Partial<Record<RegionName, DispatchCenterOption[]>> = {
    [Regions.Calabria]: [
        { id: 'NORD', label: 'SUEM 118 Nord' },
        { id: 'SUD', label: 'SUEM 118 Sud' }
    ],
    [Regions.EmiliaRomagna]: [
        { id: '118 Emilia Ovest', label: '118 Emilia Ovest' },
        { id: '118 Emilia Est', label: '118 Emilia Est' },
        { id: '118 Romagna', label: '118 Romagna' }
    ],
    [Regions.Lazio]: [
        { id: 'NORD', label: 'CORES NORD' },
        { id: 'METRO', label: 'CORES METROPOLITANA' },
        { id: 'SUD', label: 'CORES SUD' }
    ],
    [Regions.Liguria]: [
        { id: 'ASL1', label: '118 Imperia Soccorso' },
        { id: 'ASL2', label: '118 Savona Soccorso' },
        { id: 'ASL3', label: '118 Genova Soccorso' },
        { id: 'ASL4', label: '118 Tigullio Soccorso' },
        { id: 'ASL5', label: '118 La Spezia Soccorso' }
    ],
    [Regions.Lombardia]: [
        { id: 'SRA', label: 'SOREU Alpina' },
        { id: 'SRL', label: 'SOREU Laghi' },
        { id: 'SRM', label: 'SOREU Metropolitana' },
        { id: 'SRP', label: 'SOREU Pianura' }
    ],
    [Regions.Puglia]: [
        { id: 'FG', label: '118 Foggia' },
        { id: 'BA', label: '118 Bari' },
        { id: 'BR', label: '118 Brindisi' },
        { id: 'LE', label: '118 Lecce' }
    ],
    [Regions.Sardegna]: [
        { id: 'NORD', label: '118 Nord - Sassari' },
        { id: 'SUD', label: '118 Sud - Cagliari' }
    ],
    [Regions.Veneto]: [
        { id: 'Belluno Emergenza', label: '118 Belluno Emergenza' },
        { id: 'Padova Emergenza', label: '118 Padova Emergenza' },
        { id: 'Rovigo Emergenza', label: '118 Rovigo Emergenza' },
        { id: 'Treviso Emergenza', label: '118 Treviso Emergenza' },
        { id: 'Venezia Emergenza', label: '118 Venezia Emergenza' },
        { id: 'Vicenza Emergenza', label: '118 Vicenza Emergenza' },
        { id: 'Verona Emergenza', label: '118 Verona Emergenza' }
    ]
};

export const regionsConfiguration: RegionConfiguration[] = [
    { region: Regions.Calabria, status: RegionStatus.Available },
    { region: Regions.EmiliaRomagna, status: RegionStatus.Available },
    { region: Regions.Lazio, status: RegionStatus.Available },
    { region: Regions.Liguria, status: RegionStatus.Available },
    { region: Regions.Lombardia, status: RegionStatus.Available },
    { region: Regions.Puglia, status: RegionStatus.Available },
    { region: Regions.Sardegna, status: RegionStatus.Available },
    { region: Regions.Veneto, status: RegionStatus.Available },
    { region: Regions.Abruzzo, status: RegionStatus.WorkInProgress },
    { region: Regions.Basilicata, status: RegionStatus.Unavailable },
    { region: Regions.Campania, status: RegionStatus.Unavailable },
    { region: Regions.FriuliVeneziaGiulia, status: RegionStatus.WorkInProgress },
    { region: Regions.Marche, status: RegionStatus.WorkInProgress },
    { region: Regions.Molise, status: RegionStatus.Unavailable },
    { region: Regions.Piemonte, status: RegionStatus.Unavailable },
    { region: Regions.Sicilia, status: RegionStatus.WorkInProgress },
    { region: Regions.Toscana, status: RegionStatus.WorkInProgress },
    { region: Regions.TrentinoAltoAdige, status: RegionStatus.WorkInProgress },
    { region: Regions.Umbria, status: RegionStatus.Unavailable },
    { region: Regions.ValleDAosta, status: RegionStatus.WorkInProgress }
];