export const Regions = {
    Calabria: 'Calabria',
    EmiliaRomagna: 'Emilia-Romagna',
    Lazio: 'Lazio',
    Liguria: 'Liguria',
    Lombardia: 'Lombardia',
    Puglia: 'Puglia',
    Sardegna: 'Sardegna',
    Veneto: 'Veneto',
    Abruzzo: 'Abruzzo',
    Basilicata: 'Basilicata',
    Campania: 'Campania',
    FriuliVeneziaGiulia: 'Friuli-Venezia Giulia',
    Marche: 'Marche',
    Molise: 'Molise',
    Piemonte: 'Piemonte',
    Sicilia: 'Sicilia',
    Toscana: 'Toscana',
    TrentinoAltoAdige: 'Trentino-Alto Adige',
    Umbria: 'Umbria',
    ValleDAosta: "Valle d'Aosta"
} as const;

export type RegionName = typeof Regions[keyof typeof Regions];

export const RegionStatus = {
    Available: 'available',
    Unavailable: 'unavailable',
    WorkInProgress: 'work-in-progress'
} as const;

export type RegionStatus = typeof RegionStatus[keyof typeof RegionStatus];

export const StatusMessages: Record<RegionStatus, string> = {
    [RegionStatus.Available]: '',
    [RegionStatus.Unavailable]: 'Non disponibile, scriveteci per info',
    [RegionStatus.WorkInProgress]: 'In fase di costruzione, tempistiche non note al momento'
};

export interface RegionConfiguration {
    region: RegionName;
    status: RegionStatus;
}