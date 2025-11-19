import type { Vehicle } from '../../../../model/vehicle';

/**
 * Emergency vehicles assigned to SOREU Laghi dispatch center
 */

export const SRL_VEHICLES: Vehicle[] = [
  {
    stationName: "Agrate B.za Dist. VOLVIM",
    stationCoordinates: { latitude: 45.5873456, longitude: 9.3580023 },
    vehicleType: "MSB" as const,
    radioName: "VOLVIM_154.02B1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Arcore Dist. VOLVIM",
    stationCoordinates: { latitude: 45.613961, longitude: 9.323324 },
    vehicleType: "MSB" as const,
    radioName: "VOLVIM_144.05B2",
    convention: "H12" as const,
    schedule: {
      workingHours: "7:00-19:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "AVIS Meda",
    stationCoordinates: { latitude: 45.655419, longitude: 9.170387 },
    vehicleType: "MSB" as const,
    radioName: "AVIMED_103.06B2",
    convention: "H12" as const,
    schedule: {
      workingHours: "7:00-19:00",
      days: "LUN-SAB"
    }
  },
  {
    stationName: "AVPS Vimercate",
    stationCoordinates: { latitude: 45.618771, longitude: 9.376584 },
    vehicleType: "MSB" as const,
    radioName: "VOLVIM_150.02A1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "AVPS Vimercate",
    stationCoordinates: { latitude: 45.618771, longitude: 9.376584 },
    vehicleType: "MSB" as const,
    radioName: "VOLVIM_245",
    convention: "GET" as const,
    schedule: {
      workingHours: "8:00-16:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "AVSA Cornate",
    stationCoordinates: { latitude: 45.645382, longitude: 9.467512 },
    vehicleType: "MSB" as const,
    radioName: "VOLCOR_106.07A1",
    convention: "H24" as const,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "AVSA Cornate",
    stationCoordinates: { latitude: 45.645382, longitude: 9.467512 },
    vehicleType: "MSB" as const,
    radioName: "VOLVIM_153.07A1",
    convention: "H24" as const,
    schedule: {
      workingHours: "20:00-8:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Busnago Soccorso",
    stationCoordinates: { latitude: 45.6005815, longitude: 9.4582827 },
    vehicleType: "MSB" as const,
    radioName: "SOCBUS_373",
    convention: "GET" as const,
    schedule: {
      workingHours: "19:00-00:00, SAB-DOM 8:00-14:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Casargo Dist. CRIPRE",
    stationCoordinates: { latitude: 46.0388184, longitude: 9.3882746 },
    vehicleType: "MSB" as const,
    radioName: "CRIPRE+351",
    convention: "GET" as const,
    schedule: {
      workingHours: "21:00-6:00",
      days: "SAB-DOM"
    }
  },
  {
    stationName: "Cislago Dist CRISAR",
    stationCoordinates: { latitude: 45.660923, longitude: 8.974269 },
    vehicleType: "MSB" as const,
    radioName: "CRISAR_199.22A2",
    convention: "H8" as const,
    schedule: {
      workingHours: "10:00-18:00",
      days: "LUN-SAB"
    }
  },
  {
    stationName: "Cittiglio Dist. CRIGAV",
    stationCoordinates: { latitude: 45.8931293, longitude: 8.6678866 },
    vehicleType: "MSB" as const,
    radioName: "CRIGAV_120.01C1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Argento Limbiate",
    stationCoordinates: { latitude: 45.593897, longitude: 9.138892 },
    vehicleType: "MSB" as const,
    radioName: "ARGLIM_105.07A1",
    convention: "H24" as const,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Argento Saronno",
    stationCoordinates: { latitude: 45.619298, longitude: 9.046789 },
    vehicleType: "MSB" as const,
    radioName: "ARGSAR_331",
    convention: "GET" as const,
    schedule: {
      workingHours: "9:00-18:00",
      days: "LUN-VEN"
    }
  },
  {
    stationName: "Croce Azzurra Cadorago",
    stationCoordinates: { latitude: 45.7254998, longitude: 9.0380364 },
    vehicleType: "MSB" as const,
    radioName: "AZZCAD_152.04C1",
    convention: "H24" as const,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Azzurra Caronno Pertusella",
    stationCoordinates: { latitude: 45.596266, longitude: 9.048169 },
    vehicleType: "MSB" as const,
    radioName: "AZZCAR_137.23A1",
    convention: "H24" as const,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Azzurra Como",
    stationCoordinates: { latitude: 45.790055, longitude: 9.087885 },
    vehicleType: "MSB" as const,
    radioName: "AZZ_CO_152.05B1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Azzurra Porlezza",
    stationCoordinates: { latitude: 46.0364666, longitude: 9.1290498 },
    vehicleType: "MSB" as const,
    radioName: "AZZPOR_133.01A1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Azzurra Rovellasca",
    stationCoordinates: { latitude: 45.6651888, longitude: 9.0567227 },
    vehicleType: "MSB" as const,
    radioName: "AZZROV_151.04B1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Bianca Besana Brianza",
    stationCoordinates: { latitude: 45.701124, longitude: 9.282241 },
    vehicleType: "MSB" as const,
    radioName: "BIABES_168.01A2",
    convention: "H12" as const,
    schedule: {
      workingHours: "7:00-19:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Bianca Besana Brianza",
    stationCoordinates: { latitude: 45.701124, longitude: 9.282241 },
    vehicleType: "MSB" as const,
    radioName: "BIABES_179.01A1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Bianca Biassono",
    stationCoordinates: { latitude: 45.6309402, longitude: 9.273582 },
    vehicleType: "MSB" as const,
    radioName: "BIABIA_411",
    convention: "GET" as const,
    schedule: {
      workingHours: "21:00-7:00",
      days: "LUN-SAB"
    }
  },
  {
    stationName: "Croce Bianca Bovisio Masciago",
    stationCoordinates: { latitude: 45.6098911, longitude: 9.1466598 },
    vehicleType: "MSB" as const,
    radioName: "BIACES_396",
    convention: "GET" as const,
    schedule: {
      workingHours: "18:30-00:30",
      days: "LUN-VEN"
    }
  },
  {
    stationName: "Croce Bianca Brugherio",
    stationCoordinates: { latitude: 45.5543219, longitude: 9.305386 },
    vehicleType: "MSB" as const,
    radioName: "BIABRU_150.05A1",
    convention: "H24" as const,
    schedule: {
      workingHours: "6:00-14:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Bianca Brugherio",
    stationCoordinates: { latitude: 45.5543219, longitude: 9.305386 },
    vehicleType: "MSB" as const,
    radioName: "BIABRU_150",
    convention: "GET" as const,
    schedule: {
      workingHours: "22:00-6:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Bianca Castello di Brianza",
    stationCoordinates: { latitude: 45.7666801, longitude: 9.3463132 },
    vehicleType: "MSB" as const,
    radioName: "BIABEC_371",
    convention: "GET" as const,
    schedule: {
      workingHours: "19:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Bianca Cesano Maderno",
    stationCoordinates: { latitude: 45.6244233, longitude: 9.140358 },
    vehicleType: "MSB" as const,
    radioName: "BIACES_194.08A1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Bianca Giussano",
    stationCoordinates: { latitude: 45.6913316, longitude: 9.203068 },
    vehicleType: "MSB" as const,
    radioName: "BIAGIU_222",
    convention: "GET" as const,
    schedule: {
      workingHours: "10:00-16:00, 18:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Bianca Mariano Comense",
    stationCoordinates: { latitude: 45.6943316, longitude: 9.1827115 },
    vehicleType: "MSB" as const,
    radioName: "BIAMAR_104.06D1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Bianca Merate",
    stationCoordinates: { latitude: 45.6932192, longitude: 9.4268477 },
    vehicleType: "MSB" as const,
    radioName: "BIAMER_112.06A1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Bianca Seveso",
    stationCoordinates: { latitude: 45.651548, longitude: 9.135717 },
    vehicleType: "MSB" as const,
    radioName: "BIASEV_323",
    convention: "GET" as const,
    schedule: {
      workingHours: "19:30-00:30",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Medica Dist. Castiglione",
    stationCoordinates: { latitude: 45.9548909, longitude: 9.0917016 },
    vehicleType: "MSA1" as const,
    radioName: "CO_008",
    convention: "H12" as const,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Medica Dist. Castiglione",
    stationCoordinates: { latitude: 45.9548909, longitude: 9.0917016 },
    vehicleType: "MSB" as const,
    radioName: "MDCCST_135.02A2",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Asso",
    stationCoordinates: { latitude: 45.8616959, longitude: 9.2696378 },
    vehicleType: "MSB" as const,
    radioName: "CRIASS+313",
    convention: "GET" as const,
    schedule: {
      workingHours: "21:00-7:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Ballabio",
    stationCoordinates: { latitude: 45.920654, longitude: 9.4391789 },
    vehicleType: "MSB" as const,
    radioName: "CRIBAL_283",
    convention: "GET" as const,
    schedule: {
      workingHours: "9:00-19:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Ballabio",
    stationCoordinates: { latitude: 45.920654, longitude: 9.4391789 },
    vehicleType: "MSB" as const,
    radioName: "CRIBAL_184.02A1",
    convention: "H24" as const,
    schedule: {
      workingHours: "20:00-8:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Barzanò",
    stationCoordinates: { latitude: 45.7417565, longitude: 9.3214771 },
    vehicleType: "MSB" as const,
    radioName: "CRICAN_156.06B1",
    convention: "H24" as const,
    schedule: {
      workingHours: "14:00-6:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Brugherio",
    stationCoordinates: { latitude: 45.549869, longitude: 9.307872 },
    vehicleType: "MSB" as const,
    radioName: "CRIBRU_151.05A1",
    convention: "H24" as const,
    schedule: {
      workingHours: "14:00-6:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Busto Arsizio",
    stationCoordinates: { latitude: 45.6204195, longitude: 8.8517789 },
    vehicleType: "MSB" as const,
    radioName: "CRIBUS_146.06E1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Busto Arsizio",
    stationCoordinates: { latitude: 45.6204195, longitude: 8.8517789 },
    vehicleType: "MSB" as const,
    radioName: "CRIBUS_166.06D1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Busto Arsizio",
    stationCoordinates: { latitude: 45.6204195, longitude: 8.8517789 },
    vehicleType: "MSA1" as const,
    radioName: "VA_006",
    convention: "H12" as const,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Cantù",
    stationCoordinates: { latitude: 45.735904, longitude: 9.1237527 },
    vehicleType: "MSB" as const,
    radioName: "CRICTU_105.06B1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Cermenate",
    stationCoordinates: { latitude: 45.7012481, longitude: 9.0778371 },
    vehicleType: "MSB" as const,
    radioName: "CRICMN+308",
    convention: "GET" as const,
    schedule: {
      workingHours: "19:30-6:30",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Cernobbio",
    stationCoordinates: { latitude: 45.839133, longitude: 9.0650818 },
    vehicleType: "MSB" as const,
    radioName: "CRICRN_192.02B1",
    convention: "H24" as const,
    schedule: {
      workingHours: "6:00-22:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Colico",
    stationCoordinates: { latitude: 46.1392862, longitude: 9.3956714 },
    vehicleType: "MSB" as const,
    radioName: "CRICOL_117.01B1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Colico",
    stationCoordinates: { latitude: 46.1392862, longitude: 9.3956714 },
    vehicleType: "MSA2" as const,
    radioName: "LC_006",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Como",
    stationCoordinates: { latitude: 45.804252, longitude: 9.083708 },
    vehicleType: "MSA1" as const,
    radioName: "CO_003",
    convention: "H12" as const,
    schedule: {
      workingHours: "20:00-8:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Como",
    stationCoordinates: { latitude: 45.804252, longitude: 9.083708 },
    vehicleType: "MSA2" as const,
    radioName: "CO_003",
    convention: "H12" as const,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Como",
    stationCoordinates: { latitude: 45.804252, longitude: 9.083708 },
    vehicleType: "MSB" as const,
    radioName: "CRI_CO_122.05A1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Desio",
    stationCoordinates: { latitude: 45.6252665, longitude: 9.2034786 },
    vehicleType: "MSB" as const,
    radioName: "CRIDES_329",
    convention: "GET" as const,
    schedule: {
      workingHours: "19:30-6:30, SAB-DOM 7:00-18:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Galbiate",
    stationCoordinates: { latitude: 45.8164625, longitude: 9.3776936 },
    vehicleType: "MSB" as const,
    radioName: "CRIGLB+399",
    convention: "GET" as const,
    schedule: {
      workingHours: "19:30-6:30, SAB-DOM 7:00-18:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Gallarate",
    stationCoordinates: { latitude: 45.6675037, longitude: 8.8037716 },
    vehicleType: "MSB" as const,
    radioName: "CRIGAL_136.05B1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Gallarate",
    stationCoordinates: { latitude: 45.6675037, longitude: 8.8037716 },
    vehicleType: "MSB" as const,
    radioName: "CRIGAL_139.05A1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Gavirate",
    stationCoordinates: { latitude: 45.8439529, longitude: 8.7129882 },
    vehicleType: "MSB" as const,
    radioName: "CRIGAV_343",
    convention: "GET" as const,
    schedule: {
      workingHours: "19:30-00:30",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Grandate",
    stationCoordinates: { latitude: 45.7730457, longitude: 9.0561846 },
    vehicleType: "MSB" as const,
    radioName: "CRIGRA_193.05C1",
    convention: "H24" as const,
    schedule: {
      workingHours: "8:00-8:00",
      days: "LUN,MER,VEN,SAB"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Grandate",
    stationCoordinates: { latitude: 45.7730457, longitude: 9.0561846 },
    vehicleType: "MSB" as const,
    radioName: "CRIGRA_293",
    convention: "GET" as const,
    schedule: {
      workingHours: "8:00-8:00",
      days: "MAR,GIO,DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Lainate",
    stationCoordinates: { latitude: 45.562788, longitude: 9.024662 },
    vehicleType: "MSB" as const,
    radioName: "CRILAI_305",
    convention: "GET" as const,
    schedule: {
      workingHours: "18:00-00:00, SAB-DOM 8:00-18:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Lecco",
    stationCoordinates: { latitude: 45.8613483, longitude: 9.4005782 },
    vehicleType: "MSB" as const,
    radioName: "CRI_LC_177.03A1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Lentate",
    stationCoordinates: { latitude: 45.677521, longitude: 9.119524 },
    vehicleType: "MSB" as const,
    radioName: "CRILEN_339",
    convention: "GET" as const,
    schedule: {
      workingHours: "19:30-6:30, SAB-DOM 7:00-18:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Lipomo",
    stationCoordinates: { latitude: 45.7940846, longitude: 9.1163124 },
    vehicleType: "MSB" as const,
    radioName: "CRILIP_120.06C1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Lomazzo",
    stationCoordinates: { latitude: 45.6981653, longitude: 9.03271 },
    vehicleType: "MSB" as const,
    radioName: "CRILOM_148.04D1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Luino",
    stationCoordinates: { latitude: 45.990969, longitude: 8.7620458 },
    vehicleType: "MSB" as const,
    radioName: "CRILUI_128.01A1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Lurate Caccivio",
    stationCoordinates: { latitude: 45.771265, longitude: 8.9978786 },
    vehicleType: "MSB" as const,
    radioName: "CRILUR_154.04E1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Lurate Caccivio",
    stationCoordinates: { latitude: 45.771265, longitude: 8.9978786 },
    vehicleType: "MSA1" as const,
    radioName: "CO_004",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Masilianico",
    stationCoordinates: { latitude: 45.8404098, longitude: 9.0444822 },
    vehicleType: "MSB" as const,
    radioName: "CRIMAS_192.02B1",
    convention: "H24" as const,
    schedule: {
      workingHours: "22:00-6:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Menaggio",
    stationCoordinates: { latitude: 46.0213657, longitude: 9.2403722 },
    vehicleType: "MSB" as const,
    radioName: "CRIMEN_121.01B1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Misinto",
    stationCoordinates: { latitude: 45.657469, longitude: 9.07889 },
    vehicleType: "MSB" as const,
    radioName: "CRIMIS_130.07A2",
    convention: "H12" as const,
    schedule: {
      workingHours: "7:00-19:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Misinto",
    stationCoordinates: { latitude: 45.657469, longitude: 9.07889 },
    vehicleType: "MSA1" as const,
    radioName: "CO_007",
    convention: "H12" as const,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Montorfano",
    stationCoordinates: { latitude: 45.7838303, longitude: 9.1501239 },
    vehicleType: "MSB" as const,
    radioName: "CRIMNT+373",
    convention: "GET" as const,
    schedule: {
      workingHours: "18:00-2:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Monza",
    stationCoordinates: { latitude: 45.5764677, longitude: 9.2678848 },
    vehicleType: "MSB" as const,
    radioName: "CRI_MB_288.05B1",
    convention: "H24" as const,
    schedule: {
      workingHours: "22:00-6:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Monza",
    stationCoordinates: { latitude: 45.5764677, longitude: 9.2678848 },
    vehicleType: "MSB" as const,
    radioName: "CRI_MB_184.05C1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Monza",
    stationCoordinates: { latitude: 45.5764677, longitude: 9.2678848 },
    vehicleType: "MSB" as const,
    radioName: "CRI_MB_196.05B2",
    convention: "H12" as const,
    schedule: {
      workingHours: "7:00-19:00",
      days: "LUN-SAB"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Monza",
    stationCoordinates: { latitude: 45.5764677, longitude: 9.2678848 },
    vehicleType: "MSB" as const,
    radioName: "CRI_MB_A.BK",
    convention: "AGG" as const,
    schedule: {
      workingHours: "22:00-6:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Muggiò",
    stationCoordinates: { latitude: 45.595134, longitude: 9.2303846 },
    vehicleType: "MSB" as const,
    radioName: "CRIMUG_323",
    convention: "GET" as const,
    schedule: {
      workingHours: "18:00-2:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Nova Milanese",
    stationCoordinates: { latitude: 45.5867611, longitude: 9.2039573 },
    vehicleType: "MSB" as const,
    radioName: "CRINOV_343",
    convention: "GET" as const,
    schedule: {
      workingHours: "18:30-00:30",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Olgiate Molgora",
    stationCoordinates: { latitude: 45.7191623, longitude: 9.3995321 },
    vehicleType: "MSB" as const,
    radioName: "CRIOLG+303",
    convention: "GET" as const,
    schedule: {
      workingHours: "19:30-00:30",
      days: "RANDOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Premana",
    stationCoordinates: { latitude: 46.0542433, longitude: 9.4172059 },
    vehicleType: "MSB" as const,
    radioName: "CRIPRE_194.02B1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - San Fedele Intelvi",
    stationCoordinates: { latitude: 45.9702052, longitude: 9.0776858 },
    vehicleType: "MSB" as const,
    radioName: "CRISFD_314",
    convention: "GET" as const,
    schedule: {
      workingHours: "18:30-00:30",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - San Fermo della Battaglia",
    stationCoordinates: { latitude: 45.806793, longitude: 9.051056 },
    vehicleType: "MSB" as const,
    radioName: "CRISFB_163.05C1",
    convention: "H24" as const,
    schedule: {
      workingHours: "8:00-8:00",
      days: "MAR,GIO,DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - San Fermo della Battaglia",
    stationCoordinates: { latitude: 45.806793, longitude: 9.051056 },
    vehicleType: "MSB" as const,
    radioName: "CRISFB_261",
    convention: "GET" as const,
    schedule: {
      workingHours: "8:00-8:00",
      days: "LUN,MER,VEN,SAB"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Saronno",
    stationCoordinates: { latitude: 45.623675, longitude: 9.037303 },
    vehicleType: "MSB" as const,
    radioName: "CRISAR_192.22A1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Tradate",
    stationCoordinates: { latitude: 45.7050341, longitude: 8.9074299 },
    vehicleType: "MSB" as const,
    radioName: "CRITRA_122.04A1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Tradate",
    stationCoordinates: { latitude: 45.7050341, longitude: 8.9074299 },
    vehicleType: "MSA1" as const,
    radioName: "VA_003",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Uggiate Trevano",
    stationCoordinates: { latitude: 45.8237455, longitude: 8.9529333 },
    vehicleType: "MSB" as const,
    radioName: "CRIUGG+354",
    convention: "GET" as const,
    schedule: {
      workingHours: "21:00-6:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Valceresio",
    stationCoordinates: { latitude: 45.8628819, longitude: 8.8620013 },
    vehicleType: "MSB" as const,
    radioName: "CRIVLC_181.02C2",
    convention: "H12" as const,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Valceresio",
    stationCoordinates: { latitude: 45.8628819, longitude: 8.8620013 },
    vehicleType: "MSB" as const,
    radioName: "CRIVLC+382",
    convention: "GET" as const,
    schedule: {
      workingHours: "20:30-7:30",
      days: "RANDOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Valmadrera",
    stationCoordinates: { latitude: 45.8469095, longitude: 9.3602592 },
    vehicleType: "MSB" as const,
    radioName: "CRIVMD_327",
    convention: "GET" as const,
    schedule: {
      workingHours: "20:30-7:30",
      days: "RANDOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Varedo",
    stationCoordinates: { latitude: 45.5991642, longitude: 9.1518244 },
    vehicleType: "MSB" as const,
    radioName: "CRIVAR_141.07A1",
    convention: "H24" as const,
    schedule: {
      workingHours: "20:00-8:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Varese",
    stationCoordinates: { latitude: 45.7965279, longitude: 8.846416 },
    vehicleType: "MSB" as const,
    radioName: "CRI_VA_108.02A1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Varese",
    stationCoordinates: { latitude: 45.7965279, longitude: 8.846416 },
    vehicleType: "MSB" as const,
    radioName: "CRI_VA_125.02B1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Varese",
    stationCoordinates: { latitude: 45.7965279, longitude: 8.846416 },
    vehicleType: "MSB" as const,
    radioName: "CRI_VA_109.02A2",
    convention: "H12" as const,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Rossa Italiana - Villasanta",
    stationCoordinates: { latitude: 45.6015832, longitude: 9.3037616 },
    vehicleType: "MSB" as const,
    radioName: "CRIVLS_329",
    convention: "GET" as const,
    schedule: {
      workingHours: "20:30-7:30, SAB-DOM 9:00-19:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce San Nicolò",
    stationCoordinates: { latitude: 45.841086, longitude: 9.4080434 },
    vehicleType: "MSB" as const,
    radioName: "CRO_LC_136.03A2",
    convention: "H12" as const,
    schedule: {
      workingHours: "7:30-19:30",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce San Nicolò",
    stationCoordinates: { latitude: 45.841086, longitude: 9.4080434 },
    vehicleType: "MSB" as const,
    radioName: "CRO_LC_335",
    convention: "GET" as const,
    schedule: {
      workingHours: "19:30-6:30",
      days: "VEN-SAB"
    }
  },
  {
    stationName: "Croce Verde Bosisio",
    stationCoordinates: { latitude: 45.8006579, longitude: 9.2872012 },
    vehicleType: "MSB" as const,
    radioName: "VERBOS_112.04A1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Verde Fino Mornasco",
    stationCoordinates: { latitude: 45.743566, longitude: 9.052472 },
    vehicleType: "MSB" as const,
    radioName: "VERFIN_353",
    convention: "GET" as const,
    schedule: {
      workingHours: "8:00-20:00",
      days: "SAB-DOM"
    }
  },
  {
    stationName: "Croce Verde Fino Mornasco",
    stationCoordinates: { latitude: 45.743566, longitude: 9.052472 },
    vehicleType: "MSB" as const,
    radioName: "VERFIN_152.04C1",
    convention: "H24" as const,
    schedule: {
      workingHours: "20:00-8:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Verde Lissone",
    stationCoordinates: { latitude: 45.6179265, longitude: 9.2384601 },
    vehicleType: "MSB" as const,
    radioName: "VERLIS_145.04A1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Verde Lissone",
    stationCoordinates: { latitude: 45.6179265, longitude: 9.2384601 },
    vehicleType: "MSB" as const,
    radioName: "VERLIS_238.04A2",
    convention: "H12" as const,
    schedule: {
      workingHours: "7:00-19:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Croce Viola Cesate",
    stationCoordinates: { latitude: 45.5891414, longitude: 9.0704301 },
    vehicleType: "MSB" as const,
    radioName: "VIOCST_146.23A1",
    convention: "H24" as const,
    schedule: {
      workingHours: "20:00-8:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Gazzada Dist. CRI_VA",
    stationCoordinates: { latitude: 45.7730789, longitude: 8.8240692 },
    vehicleType: "MSB" as const,
    radioName: "CRI_VA_135.04B2",
    convention: "H12" as const,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Gazzada Dist. CRI_VA",
    stationCoordinates: { latitude: 45.7730789, longitude: 8.8240692 },
    vehicleType: "MSB" as const,
    radioName: "CRI_VA+333",
    convention: "GET" as const,
    schedule: {
      workingHours: "20:30-7:30",
      days: "VEN-SAB"
    }
  },
  {
    stationName: "Inter SOS Dist. Desio",
    stationCoordinates: { latitude: 45.6282312, longitude: 9.2126976 },
    vehicleType: "MSB" as const,
    radioName: "INTDES_187.06A1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Lariosoccorso Dongo",
    stationCoordinates: { latitude: 46.122947, longitude: 9.280596 },
    vehicleType: "MSB" as const,
    radioName: "LARDON_193.01C1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Lariosoccorso Erba",
    stationCoordinates: { latitude: 45.803505, longitude: 9.228768 },
    vehicleType: "MSB" as const,
    radioName: "LARERB_167.06A1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Lariosoccorso Erba",
    stationCoordinates: { latitude: 45.803505, longitude: 9.228768 },
    vehicleType: "MSA2" as const,
    radioName: "CO_006",
    convention: "H12" as const,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Lariosoccorso Erba",
    stationCoordinates: { latitude: 45.803505, longitude: 9.228768 },
    vehicleType: "MSA1" as const,
    radioName: "CO_006",
    convention: "H12" as const,
    schedule: {
      workingHours: "20:00-8:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Lecco Soccorso",
    stationCoordinates: { latitude: 45.841036, longitude: 9.408472 },
    vehicleType: "MSB" as const,
    radioName: "SOC_LC+341",
    convention: "GET" as const,
    schedule: {
      workingHours: "8:30-19:30",
      days: "RANDOM"
    }
  },
  {
    stationName: "Limido Dist AZZCAD",
    stationCoordinates: { latitude: 45.680589, longitude: 8.987465 },
    vehicleType: "MSB" as const,
    radioName: "AZZCAD_134.04F1",
    convention: "H24" as const,
    schedule: {
      workingHours: "6:00-22:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Lombardia Soccorso",
    stationCoordinates: { latitude: 45.6619637, longitude: 8.8914252 },
    vehicleType: "MSB" as const,
    radioName: "LOSGOR+315",
    convention: "GET" as const,
    schedule: {
      workingHours: "10:00-16:00, 18:00-00:00",
      days: "RANDOM"
    }
  },
  {
    stationName: "Missaglia Dist. BIAMER",
    stationCoordinates: { latitude: 45.7090561, longitude: 9.333384 },
    vehicleType: "MSB" as const,
    radioName: "BIAMER_120.06B1",
    convention: "H24" as const,
    schedule: {
      workingHours: "6:00-14:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Monza Dist. VOLVIM",
    stationCoordinates: { latitude: 45.564316, longitude: 9.27043 },
    vehicleType: "MSB" as const,
    radioName: "VOLVIM_451",
    convention: "AGG" as const,
    schedule: {
      workingHours: "6:00-22:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Monza Dist. VOLVIM",
    stationCoordinates: { latitude: 45.564316, longitude: 9.27043 },
    vehicleType: "MSB" as const,
    radioName: "VOLVIM_151.05B1",
    convention: "H24" as const,
    schedule: {
      workingHours: "6:00-22:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Nesso Dist. SOSCNZ",
    stationCoordinates: { latitude: 45.9089868, longitude: 9.1605779 },
    vehicleType: "MSB" as const,
    radioName: "SOSCNZ_161.03C1",
    convention: "H24" as const,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Padana Emergenza Luino",
    stationCoordinates: { latitude: 46.0043885, longitude: 8.754254 },
    vehicleType: "MSB" as const,
    radioName: "PEMLUI_105.01B1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Postazione AREU - Bellano",
    stationCoordinates: { latitude: 46.04828, longitude: 9.306907 },
    vehicleType: "MSA1" as const,
    radioName: "LC_001",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Postazione AREU - Cantù",
    stationCoordinates: { latitude: 45.739193, longitude: 9.14035 },
    vehicleType: "MSA1" as const,
    radioName: "CO_005",
    convention: "H12" as const,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Postazione AREU - Cantù",
    stationCoordinates: { latitude: 45.739193, longitude: 9.14035 },
    vehicleType: "MSA2" as const,
    radioName: "CO_005",
    convention: "H12" as const,
    schedule: {
      workingHours: "20:00-8:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Postazione AREU - Desio",
    stationCoordinates: { latitude: 45.6269342, longitude: 9.1963828 },
    vehicleType: "MSA2" as const,
    radioName: "MB_003",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Postazione AREU - Gallarate",
    stationCoordinates: { latitude: 45.6558635, longitude: 8.7925187 },
    vehicleType: "MSA2" as const,
    radioName: "VA_004",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Postazione AREU - Gravedona",
    stationCoordinates: { latitude: 46.142989, longitude: 9.300284 },
    vehicleType: "MSA1" as const,
    radioName: "CO_001",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Postazione AREU - Lecco",
    stationCoordinates: { latitude: 45.852326, longitude: 9.415311 },
    vehicleType: "MSA2" as const,
    radioName: "LC_002",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Postazione AREU - Luino",
    stationCoordinates: { latitude: 45.9972301, longitude: 8.7461974 },
    vehicleType: "MSA2" as const,
    radioName: "VA_001",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Postazione AREU - Menaggio",
    stationCoordinates: { latitude: 46.017983, longitude: 9.228001 },
    vehicleType: "MSA2" as const,
    radioName: "CO_002",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Postazione AREU - Merate",
    stationCoordinates: { latitude: 45.697072, longitude: 9.426777 },
    vehicleType: "MSA1" as const,
    radioName: "LC_004",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Postazione AREU - Molteno",
    stationCoordinates: { latitude: 45.778411, longitude: 9.306803 },
    vehicleType: "MSA1" as const,
    radioName: "LC_003",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Postazione AREU - Monza",
    stationCoordinates: { latitude: 45.6022413, longitude: 9.2580486 },
    vehicleType: "MSA2" as const,
    radioName: "MB_011",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Postazione AREU - Saronno",
    stationCoordinates: { latitude: 45.630968, longitude: 9.0387396 },
    vehicleType: "MSA1" as const,
    radioName: "MI_012",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Postazione AREU - Varese",
    stationCoordinates: { latitude: 45.8085062, longitude: 8.8399358 },
    vehicleType: "MSA2" as const,
    radioName: "VA_002",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Postazione AREU - Vimercate",
    stationCoordinates: { latitude: 45.6069618, longitude: 9.3562818 },
    vehicleType: "MSA2" as const,
    radioName: "MB_004",
    convention: "H12" as const,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Postazione AREU - Vimercate",
    stationCoordinates: { latitude: 45.6069618, longitude: 9.3562818 },
    vehicleType: "MSA1" as const,
    radioName: "MB_004",
    convention: "H12" as const,
    schedule: {
      workingHours: "20:00-8:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Seregno Soccorso",
    stationCoordinates: { latitude: 45.6468209, longitude: 9.2087062 },
    vehicleType: "MSB" as const,
    radioName: "SOCSER_112.06B1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Soccorso Bellanese",
    stationCoordinates: { latitude: 46.0409336, longitude: 9.3006632 },
    vehicleType: "MSB" as const,
    radioName: "SOCBEL_122.01A1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Soccorso Centro Valsassina",
    stationCoordinates: { latitude: 45.9773224, longitude: 9.446444 },
    vehicleType: "MSB" as const,
    radioName: "SOCINT_174.02A1",
    convention: "H24" as const,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Soccorso Centro Valsassina",
    stationCoordinates: { latitude: 45.9773224, longitude: 9.446444 },
    vehicleType: "MSB" as const,
    radioName: "SOCINT_273",
    convention: "GET" as const,
    schedule: {
      workingHours: "21:00-6:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Soccorso Mandello del Lario",
    stationCoordinates: { latitude: 45.918032, longitude: 9.3228926 },
    vehicleType: "MSB" as const,
    radioName: "SOCMAN_122.01C1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Solaro Dist. CRIMIS",
    stationCoordinates: { latitude: 45.616564, longitude: 9.077873 },
    vehicleType: "MSB" as const,
    radioName: "CRIMIS_307",
    convention: "GET" as const,
    schedule: {
      workingHours: "22:00-7:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Somma Lombardo Dist. CRIGAL",
    stationCoordinates: { latitude: 45.683377, longitude: 8.714549 },
    vehicleType: "MSB" as const,
    radioName: "CRIGAL_135.05C1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "SOS Appiano Gentile",
    stationCoordinates: { latitude: 45.733122, longitude: 8.9889164 },
    vehicleType: "MSB" as const,
    radioName: "SOSAPP_169.04A1",
    convention: "H24" as const,
    schedule: {
      workingHours: "20:00-8:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "SOS Canzo",
    stationCoordinates: { latitude: 45.8514634, longitude: 9.2826358 },
    vehicleType: "MSB" as const,
    radioName: "SOSCNZ_166.03B1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "SOS dei Laghi Dist Travedona",
    stationCoordinates: { latitude: 45.808006, longitude: 8.6744576 },
    vehicleType: "MSB" as const,
    radioName: "SOSTRA_208.03B1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "SOS dei Laghi Dist. Besozzo",
    stationCoordinates: { latitude: 45.8416676, longitude: 8.6641259 },
    vehicleType: "MSB" as const,
    radioName: "SOSBES+202",
    convention: "GET" as const,
    schedule: {
      workingHours: "8:00-14:00",
      days: "SAB-DOM"
    }
  },
  {
    stationName: "SOS del Seprio Carnago",
    stationCoordinates: { latitude: 45.7136074, longitude: 8.8450277 },
    vehicleType: "MSB" as const,
    radioName: "SOSCAR_176.06E2",
    convention: "H12" as const,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "SOS Lurago d Erba",
    stationCoordinates: { latitude: 45.750788, longitude: 9.2213151 },
    vehicleType: "MSB" as const,
    radioName: "SOSLRG_167.06E1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "SOS Malnate",
    stationCoordinates: { latitude: 45.8023566, longitude: 8.8826956 },
    vehicleType: "MSB" as const,
    radioName: "SOSMAL_183.02D1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "SOS Mozzate",
    stationCoordinates: { latitude: 45.6752385, longitude: 8.9564359 },
    vehicleType: "MSB" as const,
    radioName: "SOSMOZ_134.04F1",
    convention: "H24" as const,
    schedule: {
      workingHours: "22:00-6:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "SOS Olgiate Comasco",
    stationCoordinates: { latitude: 45.7851213, longitude: 8.9685263 },
    vehicleType: "MSB" as const,
    radioName: "SOSOLG_169.04A1",
    convention: "H24" as const,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "SOS Tre valli Curnardo",
    stationCoordinates: { latitude: 45.933276, longitude: 8.803148 },
    vehicleType: "MSB" as const,
    radioName: "SOSCUN_149.01D1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "SOS Uboldo",
    stationCoordinates: { latitude: 45.6134521, longitude: 9.0092297 },
    vehicleType: "MSB" as const,
    radioName: "SOSUBO_129.23A2",
    convention: "H12" as const,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-SAB"
    }
  },
  {
    stationName: "SOS Uboldo",
    stationCoordinates: { latitude: 45.6134521, longitude: 9.0092297 },
    vehicleType: "MSB" as const,
    radioName: "SOSUBO_328",
    convention: "GET" as const,
    schedule: {
      workingHours: "20:30-01:30",
      days: "SAB-DOM"
    }
  },
  {
    stationName: "SOS Valbossa - Azzate",
    stationCoordinates: { latitude: 45.7789924, longitude: 8.7988565 },
    vehicleType: "MSB" as const,
    radioName: "SOSAZZ_138.04B1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "SOS Valceresio - Besano",
    stationCoordinates: { latitude: 45.8881927, longitude: 8.8872929 },
    vehicleType: "MSB" as const,
    radioName: "SOSBES_102.02C1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Sumirago Dist. CRIGAL",
    stationCoordinates: { latitude: 45.7403116, longitude: 8.7807055 },
    vehicleType: "MSB" as const,
    radioName: "CRIGAL+382",
    convention: "GET" as const,
    schedule: {
      workingHours: "19:30-00:30",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Volontari Ambulanza Angera",
    stationCoordinates: { latitude: 45.775637, longitude: 8.578263 },
    vehicleType: "MSB" as const,
    radioName: "VOLANG_102.03A1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Volontari Ambulanza Lanzo",
    stationCoordinates: { latitude: 45.9789033, longitude: 9.0230975 },
    vehicleType: "MSB" as const,
    radioName: "VOLLAN_731",
    convention: "GET" as const,
    schedule: {
      workingHours: "21:00-6:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Volontari Ambulanze Angera Sez Sesto Calende",
    stationCoordinates: { latitude: 45.7276866, longitude: 8.6502599 },
    vehicleType: "MSA1" as const,
    radioName: "VA_007",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Volontari Ambulanze Angera Sez Sesto Calende",
    stationCoordinates: { latitude: 45.7276866, longitude: 8.6502599 },
    vehicleType: "MSB" as const,
    radioName: "VOLANG_103.03A2",
    convention: "H12" as const,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Volontari Ambulanze Angera Sez Sesto Calende",
    stationCoordinates: { latitude: 45.7276866, longitude: 8.6502599 },
    vehicleType: "MSB" as const,
    radioName: "VOLANG+107",
    convention: "GET" as const,
    schedule: {
      workingHours: "21:00-7:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Volontari Calolziocorte",
    stationCoordinates: { latitude: 45.8033924, longitude: 9.4224543 },
    vehicleType: "MSB" as const,
    radioName: "VOLCAL_106.05A1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Volontari del soccorso Bellagio",
    stationCoordinates: { latitude: 45.97689, longitude: 9.25868 },
    vehicleType: "MSB" as const,
    radioName: "VOLBEL_107.03A1",
    convention: "H24" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Volontari del soccorso Faggeto Lario",
    stationCoordinates: { latitude: 45.8581034, longitude: 9.1583425 },
    vehicleType: "MSB" as const,
    radioName: "VOLFGT_161.03C1",
    convention: "H24" as const,
    schedule: {
      workingHours: "20:00-8:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Volontari Del Soccorso Veleso",
    stationCoordinates: { latitude: 45.9081452, longitude: 9.1822873 },
    vehicleType: "MSB" as const,
    radioName: "VOLVEL_301",
    convention: "GET" as const,
    schedule: {
      workingHours: "19:00-00:00, SAB-DOM 8:00-16:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "HighCare",
    stationCoordinates: { latitude: 45.5720112, longitude: 9.272325 },
    vehicleType: "MSB" as const,
    radioName: "HCR_MB_307",
    convention: "GET" as const,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "La Varesina Emergenza",
    stationCoordinates: { latitude: 45.7453756, longitude: 8.7698675 },
    vehicleType: "MSB" as const,
    radioName: "VARMOR_329",
    convention: "GET" as const,
    schedule: {
      workingHours: "8:00-18:00",
      days: "LUN-DOM"
    }
  },
  {
    stationName: "Due Stelle Soccorso",
    stationCoordinates: { latitude: 45.7024456, longitude: 9.1652485 },
    vehicleType: "MSB" as const,
    radioName: "SOCMAR_ 311",
    convention: "GET" as const,
    schedule: {
      workingHours: "8:00-18:00",
      days: "LUN-VEN"
    }
  }
];
