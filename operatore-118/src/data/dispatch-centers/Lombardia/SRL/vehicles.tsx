import type { Vehicle } from '../../../../model/vehicle';
import { VehicleType, ConventionType } from '../../../../model/vehicle';

export const SRL_VEHICLES: Vehicle[] = [
  {
    station: {
      name: "Agrate B.za Dist. VOLVIM",
      coordinates: { latitude: 45.5873456, longitude: 9.3580023 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "VOLVIM_154.02B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Arcore Dist. VOLVIM",
      coordinates: { latitude: 45.613961, longitude: 9.323324 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "VOLVIM_144.05B2",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "7:00-19:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "AVIS Meda",
      coordinates: { latitude: 45.655419, longitude: 9.170387 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "AVIMED_103.06B2",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "7:00-19:00",
      days: "LUN-SAB"
    }
  },
  {
    station: {
      name: "AVPS Vimercate",
      coordinates: { latitude: 45.618771, longitude: 9.376584 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "VOLVIM_150.02A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "AVPS Vimercate",
      coordinates: { latitude: 45.618771, longitude: 9.376584 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "VOLVIM_245",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "8:00-16:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "AVSA Cornate",
      coordinates: { latitude: 45.645382, longitude: 9.467512 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "VOLCOR_106.07A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "AVSA Cornate",
      coordinates: { latitude: 45.645382, longitude: 9.467512 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "VOLVIM_153.07A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "20:00-8:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Busnago Soccorso",
      coordinates: { latitude: 45.6005815, longitude: 9.4582827 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "SOCBUS_373",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "19:00-00:00, SAB-DOM 8:00-14:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Casargo Dist. CRIPRE",
      coordinates: { latitude: 46.0388184, longitude: 9.3882746 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRIPRE+351",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "21:00-6:00",
      days: "SAB-DOM"
    }
  },
  {
    station: {
      name: "Cislago Dist CRISAR",
      coordinates: { latitude: 45.660923, longitude: 8.974269 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRISAR_199.22A2",
    convention: ConventionType.H8,
    schedule: {
      workingHours: "10:00-18:00",
      days: "LUN-SAB"
    }
  },
  {
    station: {
      name: "Cittiglio Dist. CRIGAV",
      coordinates: { latitude: 45.8931293, longitude: 8.6678866 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRIGAV_120.01C1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Argento Limbiate",
      coordinates: { latitude: 45.593897, longitude: 9.138892 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "ARGLIM_105.07A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Argento Saronno",
      coordinates: { latitude: 45.619298, longitude: 9.046789 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "ARGSAR_331",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "9:00-18:00",
      days: "LUN-VEN"
    }
  },
  {
    station: {
      name: "Croce Azzurra Cadorago",
      coordinates: { latitude: 45.7254998, longitude: 9.0380364 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "AZZCAD_152.04C1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Azzurra Caronno Pertusella",
      coordinates: { latitude: 45.596266, longitude: 9.048169 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "AZZCAR_137.23A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Azzurra Como",
      coordinates: { latitude: 45.790055, longitude: 9.087885 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "AZZ_CO_152.05B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Azzurra Porlezza",
      coordinates: { latitude: 46.0364666, longitude: 9.1290498 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "AZZPOR_133.01A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Azzurra Rovellasca",
      coordinates: { latitude: 45.6651888, longitude: 9.0567227 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "AZZROV_151.04B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Bianca Besana Brianza",
      coordinates: { latitude: 45.701124, longitude: 9.282241 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "BIABES_168.01A2",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "7:00-19:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Bianca Besana Brianza",
      coordinates: { latitude: 45.701124, longitude: 9.282241 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "BIABES_179.01A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Bianca Biassono",
      coordinates: { latitude: 45.6309402, longitude: 9.273582 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "BIABIA_411",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "21:00-7:00",
      days: "LUN-SAB"
    }
  },
  {
    station: {
      name: "Croce Bianca Bovisio Masciago",
      coordinates: { latitude: 45.6098911, longitude: 9.1466598 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "BIACES_396",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "18:30-00:30",
      days: "LUN-VEN"
    }
  },
  {
    station: {
      name: "Croce Bianca Brugherio",
      coordinates: { latitude: 45.5543219, longitude: 9.305386 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "BIABRU_150.05A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "6:00-14:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Bianca Brugherio",
      coordinates: { latitude: 45.5543219, longitude: 9.305386 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "BIABRU_150",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "22:00-6:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Bianca Castello di Brianza",
      coordinates: { latitude: 45.7666801, longitude: 9.3463132 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "BIABEC_371",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "19:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Bianca Cesano Maderno",
      coordinates: { latitude: 45.6244233, longitude: 9.140358 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "BIACES_194.08A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Bianca Giussano",
      coordinates: { latitude: 45.6913316, longitude: 9.203068 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "BIAGIU_222",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "10:00-16:00, 18:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Bianca Mariano Comense",
      coordinates: { latitude: 45.6943316, longitude: 9.1827115 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "BIAMAR_104.06D1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Bianca Merate",
      coordinates: { latitude: 45.6932192, longitude: 9.4268477 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "BIAMER_112.06A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Bianca Seveso",
      coordinates: { latitude: 45.651548, longitude: 9.135717 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "BIASEV_323",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "19:30-00:30",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Medica Dist. Castiglione",
      coordinates: { latitude: 45.9548909, longitude: 9.0917016 }
    },
    vehicleType: VehicleType.MSA1,
    radioName: "CO_008",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Medica Dist. Castiglione",
      coordinates: { latitude: 45.9548909, longitude: 9.0917016 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "MDCCST_135.02A2",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Asso",
      coordinates: { latitude: 45.8616959, longitude: 9.2696378 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRIASS+313",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "21:00-7:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Ballabio",
      coordinates: { latitude: 45.920654, longitude: 9.4391789 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRIBAL_283",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "9:00-19:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Ballabio",
      coordinates: { latitude: 45.920654, longitude: 9.4391789 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRIBAL_184.02A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "20:00-8:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Barzanò",
      coordinates: { latitude: 45.7417565, longitude: 9.3214771 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRICAN_156.06B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "14:00-6:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Brugherio",
      coordinates: { latitude: 45.549869, longitude: 9.307872 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRIBRU_151.05A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "14:00-6:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Busto Arsizio",
      coordinates: { latitude: 45.6204195, longitude: 8.8517789 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRIBUS_146.06E1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Busto Arsizio",
      coordinates: { latitude: 45.6204195, longitude: 8.8517789 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRIBUS_166.06D1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Busto Arsizio",
      coordinates: { latitude: 45.6204195, longitude: 8.8517789 }
    },
    vehicleType: VehicleType.MSA1,
    radioName: "VA_006",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Cantù",
      coordinates: { latitude: 45.735904, longitude: 9.1237527 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRICTU_105.06B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Cermenate",
      coordinates: { latitude: 45.7012481, longitude: 9.0778371 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRICMN+308",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "19:30-6:30",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Cernobbio",
      coordinates: { latitude: 45.839133, longitude: 9.0650818 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRICRN_192.02B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "6:00-22:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Colico",
      coordinates: { latitude: 46.1392862, longitude: 9.3956714 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRICOL_117.01B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Colico",
      coordinates: { latitude: 46.1392862, longitude: 9.3956714 }
    },
    vehicleType: VehicleType.MSA2,
    radioName: "LC_006",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Como",
      coordinates: { latitude: 45.804252, longitude: 9.083708 }
    },
    vehicleType: VehicleType.MSA1,
    radioName: "CO_003",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "20:00-8:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Como",
      coordinates: { latitude: 45.804252, longitude: 9.083708 }
    },
    vehicleType: VehicleType.MSA2,
    radioName: "CO_003",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Como",
      coordinates: { latitude: 45.804252, longitude: 9.083708 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRI_CO_122.05A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Desio",
      coordinates: { latitude: 45.6252665, longitude: 9.2034786 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRIDES_329",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "19:30-6:30, SAB-DOM 7:00-18:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Galbiate",
      coordinates: { latitude: 45.8164625, longitude: 9.3776936 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRIGLB+399",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "19:30-6:30, SAB-DOM 7:00-18:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Gallarate",
      coordinates: { latitude: 45.6675037, longitude: 8.8037716 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRIGAL_136.05B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Gallarate",
      coordinates: { latitude: 45.6675037, longitude: 8.8037716 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRIGAL_139.05A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Gavirate",
      coordinates: { latitude: 45.8439529, longitude: 8.7129882 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRIGAV_343",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "19:30-00:30",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Grandate",
      coordinates: { latitude: 45.7730457, longitude: 9.0561846 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRIGRA_193.05C1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "8:00-8:00",
      days: "LUN,MER,VEN,SAB"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Grandate",
      coordinates: { latitude: 45.7730457, longitude: 9.0561846 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRIGRA_293",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "8:00-8:00",
      days: "MAR,GIO,DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Lainate",
      coordinates: { latitude: 45.562788, longitude: 9.024662 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRILAI_305",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "18:00-00:00, SAB-DOM 8:00-18:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Lecco",
      coordinates: { latitude: 45.8613483, longitude: 9.4005782 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRI_LC_177.03A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Lentate",
      coordinates: { latitude: 45.677521, longitude: 9.119524 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRILEN_339",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "19:30-6:30, SAB-DOM 7:00-18:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Lipomo",
      coordinates: { latitude: 45.7940846, longitude: 9.1163124 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRILIP_120.06C1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Lomazzo",
      coordinates: { latitude: 45.6981653, longitude: 9.03271 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRILOM_148.04D1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Luino",
      coordinates: { latitude: 45.990969, longitude: 8.7620458 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRILUI_128.01A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Lurate Caccivio",
      coordinates: { latitude: 45.771265, longitude: 8.9978786 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRILUR_154.04E1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Lurate Caccivio",
      coordinates: { latitude: 45.771265, longitude: 8.9978786 }
    },
    vehicleType: VehicleType.MSA1,
    radioName: "CO_004",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Masilianico",
      coordinates: { latitude: 45.8404098, longitude: 9.0444822 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRIMAS_192.02B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "22:00-6:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Menaggio",
      coordinates: { latitude: 46.0213657, longitude: 9.2403722 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRIMEN_121.01B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Misinto",
      coordinates: { latitude: 45.657469, longitude: 9.07889 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRIMIS_130.07A2",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "7:00-19:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Misinto",
      coordinates: { latitude: 45.657469, longitude: 9.07889 }
    },
    vehicleType: VehicleType.MSA1,
    radioName: "CO_007",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Montorfano",
      coordinates: { latitude: 45.7838303, longitude: 9.1501239 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRIMNT+373",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "18:00-2:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Monza",
      coordinates: { latitude: 45.5764677, longitude: 9.2678848 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRI_MB_288.05B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "22:00-6:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Monza",
      coordinates: { latitude: 45.5764677, longitude: 9.2678848 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRI_MB_184.05C1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Monza",
      coordinates: { latitude: 45.5764677, longitude: 9.2678848 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRI_MB_196.05B2",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "7:00-19:00",
      days: "LUN-SAB"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Monza",
      coordinates: { latitude: 45.5764677, longitude: 9.2678848 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRI_MB_A.BK",
    convention: ConventionType.AGG,
    schedule: {
      workingHours: "22:00-6:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Muggiò",
      coordinates: { latitude: 45.595134, longitude: 9.2303846 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRIMUG_323",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "18:00-2:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Nova Milanese",
      coordinates: { latitude: 45.5867611, longitude: 9.2039573 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRINOV_343",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "18:30-00:30",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Olgiate Molgora",
      coordinates: { latitude: 45.7191623, longitude: 9.3995321 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRIOLG+303",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "19:30-00:30",
      days: "RANDOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Premana",
      coordinates: { latitude: 46.0542433, longitude: 9.4172059 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRIPRE_194.02B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - San Fedele Intelvi",
      coordinates: { latitude: 45.9702052, longitude: 9.0776858 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRISFD_314",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "18:30-00:30",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - San Fermo della Battaglia",
      coordinates: { latitude: 45.806793, longitude: 9.051056 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRISFB_163.05C1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "8:00-8:00",
      days: "MAR,GIO,DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - San Fermo della Battaglia",
      coordinates: { latitude: 45.806793, longitude: 9.051056 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRISFB_261",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "8:00-8:00",
      days: "LUN,MER,VEN,SAB"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Saronno",
      coordinates: { latitude: 45.623675, longitude: 9.037303 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRISAR_192.22A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Tradate",
      coordinates: { latitude: 45.7050341, longitude: 8.9074299 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRITRA_122.04A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Tradate",
      coordinates: { latitude: 45.7050341, longitude: 8.9074299 }
    },
    vehicleType: VehicleType.MSA1,
    radioName: "VA_003",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Uggiate Trevano",
      coordinates: { latitude: 45.8237455, longitude: 8.9529333 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRIUGG+354",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "21:00-6:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Valceresio",
      coordinates: { latitude: 45.8628819, longitude: 8.8620013 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRIVLC_181.02C2",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Valceresio",
      coordinates: { latitude: 45.8628819, longitude: 8.8620013 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRIVLC+382",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "20:30-7:30",
      days: "RANDOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Valmadrera",
      coordinates: { latitude: 45.8469095, longitude: 9.3602592 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRIVMD_327",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "20:30-7:30",
      days: "RANDOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Varedo",
      coordinates: { latitude: 45.5991642, longitude: 9.1518244 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRIVAR_141.07A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "20:00-8:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Varese",
      coordinates: { latitude: 45.7965279, longitude: 8.846416 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRI_VA_108.02A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Varese",
      coordinates: { latitude: 45.7965279, longitude: 8.846416 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRI_VA_125.02B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Varese",
      coordinates: { latitude: 45.7965279, longitude: 8.846416 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRI_VA_109.02A2",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Rossa Italiana - Villasanta",
      coordinates: { latitude: 45.6015832, longitude: 9.3037616 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRIVLS_329",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "20:30-7:30, SAB-DOM 9:00-19:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce San Nicolò",
      coordinates: { latitude: 45.841086, longitude: 9.4080434 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRO_LC_136.03A2",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "7:30-19:30",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce San Nicolò",
      coordinates: { latitude: 45.841086, longitude: 9.4080434 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRO_LC_335",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "19:30-6:30",
      days: "VEN-SAB"
    }
  },
  {
    station: {
      name: "Croce Verde Bosisio",
      coordinates: { latitude: 45.8006579, longitude: 9.2872012 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "VERBOS_112.04A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Verde Fino Mornasco",
      coordinates: { latitude: 45.743566, longitude: 9.052472 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "VERFIN_353",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "8:00-20:00",
      days: "SAB-DOM"
    }
  },
  {
    station: {
      name: "Croce Verde Fino Mornasco",
      coordinates: { latitude: 45.743566, longitude: 9.052472 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "VERFIN_152.04C1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "20:00-8:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Verde Lissone",
      coordinates: { latitude: 45.6179265, longitude: 9.2384601 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "VERLIS_145.04A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Verde Lissone",
      coordinates: { latitude: 45.6179265, longitude: 9.2384601 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "VERLIS_238.04A2",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "7:00-19:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Croce Viola Cesate",
      coordinates: { latitude: 45.5891414, longitude: 9.0704301 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "VIOCST_146.23A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "20:00-8:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Gazzada Dist. CRI_VA",
      coordinates: { latitude: 45.7730789, longitude: 8.8240692 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRI_VA_135.04B2",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Gazzada Dist. CRI_VA",
      coordinates: { latitude: 45.7730789, longitude: 8.8240692 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRI_VA+333",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "20:30-7:30",
      days: "VEN-SAB"
    }
  },
  {
    station: {
      name: "Inter SOS Dist. Desio",
      coordinates: { latitude: 45.6282312, longitude: 9.2126976 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "INTDES_187.06A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Lariosoccorso Dongo",
      coordinates: { latitude: 46.122947, longitude: 9.280596 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "LARDON_193.01C1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Lariosoccorso Erba",
      coordinates: { latitude: 45.803505, longitude: 9.228768 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "LARERB_167.06A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Lariosoccorso Erba",
      coordinates: { latitude: 45.803505, longitude: 9.228768 }
    },
    vehicleType: VehicleType.MSA2,
    radioName: "CO_006",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Lariosoccorso Erba",
      coordinates: { latitude: 45.803505, longitude: 9.228768 }
    },
    vehicleType: VehicleType.MSA1,
    radioName: "CO_006",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "20:00-8:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Lecco Soccorso",
      coordinates: { latitude: 45.841036, longitude: 9.408472 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "SOC_LC+341",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "8:30-19:30",
      days: "RANDOM"
    }
  },
  {
    station: {
      name: "Limido Dist AZZCAD",
      coordinates: { latitude: 45.680589, longitude: 8.987465 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "AZZCAD_134.04F1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "6:00-22:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Lombardia Soccorso",
      coordinates: { latitude: 45.6619637, longitude: 8.8914252 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "LOSGOR+315",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "10:00-16:00, 18:00-00:00",
      days: "RANDOM"
    }
  },
  {
    station: {
      name: "Missaglia Dist. BIAMER",
      coordinates: { latitude: 45.7090561, longitude: 9.333384 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "BIAMER_120.06B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "6:00-14:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Monza Dist. VOLVIM",
      coordinates: { latitude: 45.564316, longitude: 9.27043 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "VOLVIM_451",
    convention: ConventionType.AGG,
    schedule: {
      workingHours: "6:00-22:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Monza Dist. VOLVIM",
      coordinates: { latitude: 45.564316, longitude: 9.27043 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "VOLVIM_151.05B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "6:00-22:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Nesso Dist. SOSCNZ",
      coordinates: { latitude: 45.9089868, longitude: 9.1605779 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "SOSCNZ_161.03C1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Padana Emergenza Luino",
      coordinates: { latitude: 46.0043885, longitude: 8.754254 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "PEMLUI_105.01B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Postazione AREU - Bellano",
      coordinates: { latitude: 46.04828, longitude: 9.306907 }
    },
    vehicleType: VehicleType.MSA1,
    radioName: "LC_001",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Postazione AREU - Cantù",
      coordinates: { latitude: 45.739193, longitude: 9.14035 }
    },
    vehicleType: VehicleType.MSA1,
    radioName: "CO_005",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Postazione AREU - Cantù",
      coordinates: { latitude: 45.739193, longitude: 9.14035 }
    },
    vehicleType: VehicleType.MSA2,
    radioName: "CO_005",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "20:00-8:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Postazione AREU - Desio",
      coordinates: { latitude: 45.6269342, longitude: 9.1963828 }
    },
    vehicleType: VehicleType.MSA2,
    radioName: "MB_003",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Postazione AREU - Gallarate",
      coordinates: { latitude: 45.6558635, longitude: 8.7925187 }
    },
    vehicleType: VehicleType.MSA2,
    radioName: "VA_004",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Postazione AREU - Gravedona",
      coordinates: { latitude: 46.142989, longitude: 9.300284 }
    },
    vehicleType: VehicleType.MSA1,
    radioName: "CO_001",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Postazione AREU - Lecco",
      coordinates: { latitude: 45.852326, longitude: 9.415311 }
    },
    vehicleType: VehicleType.MSA2,
    radioName: "LC_002",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Postazione AREU - Luino",
      coordinates: { latitude: 45.9972301, longitude: 8.7461974 }
    },
    vehicleType: VehicleType.MSA2,
    radioName: "VA_001",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Postazione AREU - Menaggio",
      coordinates: { latitude: 46.017983, longitude: 9.228001 }
    },
    vehicleType: VehicleType.MSA2,
    radioName: "CO_002",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Postazione AREU - Merate",
      coordinates: { latitude: 45.697072, longitude: 9.426777 }
    },
    vehicleType: VehicleType.MSA1,
    radioName: "LC_004",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Postazione AREU - Molteno",
      coordinates: { latitude: 45.778411, longitude: 9.306803 }
    },
    vehicleType: VehicleType.MSA1,
    radioName: "LC_003",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Postazione AREU - Monza",
      coordinates: { latitude: 45.6022413, longitude: 9.2580486 }
    },
    vehicleType: VehicleType.MSA2,
    radioName: "MB_011",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Postazione AREU - Saronno",
      coordinates: { latitude: 45.630968, longitude: 9.0387396 }
    },
    vehicleType: VehicleType.MSA1,
    radioName: "MI_012",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Postazione AREU - Varese",
      coordinates: { latitude: 45.8085062, longitude: 8.8399358 }
    },
    vehicleType: VehicleType.MSA2,
    radioName: "VA_002",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Postazione AREU - Vimercate",
      coordinates: { latitude: 45.6069618, longitude: 9.3562818 }
    },
    vehicleType: VehicleType.MSA2,
    radioName: "MB_004",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Postazione AREU - Vimercate",
      coordinates: { latitude: 45.6069618, longitude: 9.3562818 }
    },
    vehicleType: VehicleType.MSA1,
    radioName: "MB_004",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "20:00-8:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Seregno Soccorso",
      coordinates: { latitude: 45.6468209, longitude: 9.2087062 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "SOCSER_112.06B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Soccorso Bellanese",
      coordinates: { latitude: 46.0409336, longitude: 9.3006632 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "SOCBEL_122.01A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Soccorso Centro Valsassina",
      coordinates: { latitude: 45.9773224, longitude: 9.446444 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "SOCINT_174.02A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Soccorso Centro Valsassina",
      coordinates: { latitude: 45.9773224, longitude: 9.446444 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "SOCINT_273",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "21:00-6:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Soccorso Mandello del Lario",
      coordinates: { latitude: 45.918032, longitude: 9.3228926 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "SOCMAN_122.01C1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Solaro Dist. CRIMIS",
      coordinates: { latitude: 45.616564, longitude: 9.077873 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRIMIS_307",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "22:00-7:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Somma Lombardo Dist. CRIGAL",
      coordinates: { latitude: 45.683377, longitude: 8.714549 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRIGAL_135.05C1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "SOS Appiano Gentile",
      coordinates: { latitude: 45.733122, longitude: 8.9889164 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "SOSAPP_169.04A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "20:00-8:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "SOS Canzo",
      coordinates: { latitude: 45.8514634, longitude: 9.2826358 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "SOSCNZ_166.03B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "SOS dei Laghi Dist Travedona",
      coordinates: { latitude: 45.808006, longitude: 8.6744576 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "SOSTRA_208.03B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "SOS dei Laghi Dist. Besozzo",
      coordinates: { latitude: 45.8416676, longitude: 8.6641259 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "SOSBES+202",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "8:00-14:00",
      days: "SAB-DOM"
    }
  },
  {
    station: {
      name: "SOS del Seprio Carnago",
      coordinates: { latitude: 45.7136074, longitude: 8.8450277 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "SOSCAR_176.06E2",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "SOS Lurago d Erba",
      coordinates: { latitude: 45.750788, longitude: 9.2213151 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "SOSLRG_167.06E1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "SOS Malnate",
      coordinates: { latitude: 45.8023566, longitude: 8.8826956 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "SOSMAL_183.02D1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "SOS Mozzate",
      coordinates: { latitude: 45.6752385, longitude: 8.9564359 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "SOSMOZ_134.04F1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "22:00-6:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "SOS Olgiate Comasco",
      coordinates: { latitude: 45.7851213, longitude: 8.9685263 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "SOSOLG_169.04A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "SOS Tre valli Curnardo",
      coordinates: { latitude: 45.933276, longitude: 8.803148 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "SOSCUN_149.01D1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "SOS Uboldo",
      coordinates: { latitude: 45.6134521, longitude: 9.0092297 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "SOSUBO_129.23A2",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-SAB"
    }
  },
  {
    station: {
      name: "SOS Uboldo",
      coordinates: { latitude: 45.6134521, longitude: 9.0092297 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "SOSUBO_328",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "20:30-01:30",
      days: "SAB-DOM"
    }
  },
  {
    station: {
      name: "SOS Valbossa - Azzate",
      coordinates: { latitude: 45.7789924, longitude: 8.7988565 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "SOSAZZ_138.04B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "SOS Valceresio - Besano",
      coordinates: { latitude: 45.8881927, longitude: 8.8872929 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "SOSBES_102.02C1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Sumirago Dist. CRIGAL",
      coordinates: { latitude: 45.7403116, longitude: 8.7807055 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "CRIGAL+382",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "19:30-00:30",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Volontari Ambulanza Angera",
      coordinates: { latitude: 45.775637, longitude: 8.578263 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "VOLANG_102.03A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Volontari Ambulanza Lanzo",
      coordinates: { latitude: 45.9789033, longitude: 9.0230975 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "VOLLAN_731",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "21:00-6:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Volontari Ambulanze Angera Sez Sesto Calende",
      coordinates: { latitude: 45.7276866, longitude: 8.6502599 }
    },
    vehicleType: VehicleType.MSA1,
    radioName: "VA_007",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Volontari Ambulanze Angera Sez Sesto Calende",
      coordinates: { latitude: 45.7276866, longitude: 8.6502599 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "VOLANG_103.03A2",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Volontari Ambulanze Angera Sez Sesto Calende",
      coordinates: { latitude: 45.7276866, longitude: 8.6502599 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "VOLANG+107",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "21:00-7:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Volontari Calolziocorte",
      coordinates: { latitude: 45.8033924, longitude: 9.4224543 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "VOLCAL_106.05A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Volontari del soccorso Bellagio",
      coordinates: { latitude: 45.97689, longitude: 9.25868 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "VOLBEL_107.03A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Volontari del soccorso Faggeto Lario",
      coordinates: { latitude: 45.8581034, longitude: 9.1583425 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "VOLFGT_161.03C1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "20:00-8:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Volontari Del Soccorso Veleso",
      coordinates: { latitude: 45.9081452, longitude: 9.1822873 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "VOLVEL_301",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "19:00-00:00, SAB-DOM 8:00-16:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "HighCare",
      coordinates: { latitude: 45.5720112, longitude: 9.272325 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "HCR_MB_307",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "La Varesina Emergenza",
      coordinates: { latitude: 45.7453756, longitude: 8.7698675 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "VARMOR_329",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "8:00-18:00",
      days: "LUN-DOM"
    }
  },
  {
    station: {
      name: "Due Stelle Soccorso",
      coordinates: { latitude: 45.7024456, longitude: 9.1652485 }
    },
    vehicleType: VehicleType.MSB,
    radioName: "SOCMAR_ 311",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "8:00-18:00",
      days: "LUN-VEN"
    }
  }
];
