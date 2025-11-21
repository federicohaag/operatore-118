import type { Vehicle } from '../../../../model/vehicle';
import { VehicleType, ConventionType } from '../../../../model/vehicle';

export const SRL_VEHICLES: Vehicle[] = [
  {
    id: "74b87915-d95b-48c0-9a2f-b68fd6acfb7e",
    station: {
      name: "Agrate B.za Dist. VOLVIM",
      coordinates: { latitude: 45.5873456, longitude: 9.3580023 }
    },
    currentLocation: { latitude: 45.5873456, longitude: 9.3580023 },
    vehicleType: VehicleType.MSB,
    radioName: "VOLVIM_154.02B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "bf2c28c6-1bcc-4cc1-92b8-21840160d656",
    station: {
      name: "Arcore Dist. VOLVIM",
      coordinates: { latitude: 45.613961, longitude: 9.323324 }
    },
    currentLocation: { latitude: 45.613961, longitude: 9.323324 },
    vehicleType: VehicleType.MSB,
    radioName: "VOLVIM_144.05B2",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "7:00-19:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "0fe72a78-42b3-49ab-8503-50516f4a50a0",
    station: {
      name: "AVIS Meda",
      coordinates: { latitude: 45.655419, longitude: 9.170387 }
    },
    currentLocation: { latitude: 45.655419, longitude: 9.170387 },
    vehicleType: VehicleType.MSB,
    radioName: "AVIMED_103.06B2",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "7:00-19:00",
      days: "LUN-SAB"
    }
  },
  {
    id: "48d7d5af-d573-4eab-b9ea-11f010825695",
    station: {
      name: "AVPS Vimercate",
      coordinates: { latitude: 45.618771, longitude: 9.376584 }
    },
    currentLocation: { latitude: 45.618771, longitude: 9.376584 },
    vehicleType: VehicleType.MSB,
    radioName: "VOLVIM_150.02A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "92f1fd10-02b5-4062-9533-cfb2d6ca3fcb",
    station: {
      name: "AVPS Vimercate",
      coordinates: { latitude: 45.618771, longitude: 9.376584 }
    },
    currentLocation: { latitude: 45.618771, longitude: 9.376584 },
    vehicleType: VehicleType.MSB,
    radioName: "VOLVIM_245",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "8:00-16:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "a60a3285-2155-4c3e-92f5-643e6849a4a4",
    station: {
      name: "AVSA Cornate",
      coordinates: { latitude: 45.645382, longitude: 9.467512 }
    },
    currentLocation: { latitude: 45.645382, longitude: 9.467512 },
    vehicleType: VehicleType.MSB,
    radioName: "VOLCOR_106.07A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "6f80b71e-12d6-403d-a4c5-5693bfe1f074",
    station: {
      name: "AVSA Cornate",
      coordinates: { latitude: 45.645382, longitude: 9.467512 }
    },
    currentLocation: { latitude: 45.645382, longitude: 9.467512 },
    vehicleType: VehicleType.MSB,
    radioName: "VOLVIM_153.07A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "20:00-8:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "39169f25-9c3e-4fcd-8498-79a1c77044fa",
    station: {
      name: "Busnago Soccorso",
      coordinates: { latitude: 45.6005815, longitude: 9.4582827 }
    },
    currentLocation: { latitude: 45.6005815, longitude: 9.4582827 },
    vehicleType: VehicleType.MSB,
    radioName: "SOCBUS_373",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "19:00-00:00, SAB-DOM 8:00-14:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "c07254d5-771c-4adb-b38d-bfcf3fab9091",
    station: {
      name: "Casargo Dist. CRIPRE",
      coordinates: { latitude: 46.0388184, longitude: 9.3882746 }
    },
    currentLocation: { latitude: 46.0388184, longitude: 9.3882746 },
    vehicleType: VehicleType.MSB,
    radioName: "CRIPRE+351",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "21:00-6:00",
      days: "SAB-DOM"
    }
  },
  {
    id: "0c49bc7b-923d-48ff-89cd-b2203b9077bb",
    station: {
      name: "Cislago Dist CRISAR",
      coordinates: { latitude: 45.660923, longitude: 8.974269 }
    },
    currentLocation: { latitude: 45.660923, longitude: 8.974269 },
    vehicleType: VehicleType.MSB,
    radioName: "CRISAR_199.22A2",
    convention: ConventionType.H8,
    schedule: {
      workingHours: "10:00-18:00",
      days: "LUN-SAB"
    }
  },
  {
    id: "6e0de98c-f77e-442a-b1fe-51f5141a14e3",
    station: {
      name: "Cittiglio Dist. CRIGAV",
      coordinates: { latitude: 45.8931293, longitude: 8.6678866 }
    },
    currentLocation: { latitude: 45.8931293, longitude: 8.6678866 },
    vehicleType: VehicleType.MSB,
    radioName: "CRIGAV_120.01C1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "dfe973f2-f16a-4f77-bac5-e123137c2da9",
    station: {
      name: "Croce Argento Limbiate",
      coordinates: { latitude: 45.593897, longitude: 9.138892 }
    },
    currentLocation: { latitude: 45.593897, longitude: 9.138892 },
    vehicleType: VehicleType.MSB,
    radioName: "ARGLIM_105.07A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "bbb94818-06d9-470a-a1b6-f14c3ca435b2",
    station: {
      name: "Croce Argento Saronno",
      coordinates: { latitude: 45.619298, longitude: 9.046789 }
    },
    currentLocation: { latitude: 45.619298, longitude: 9.046789 },
    vehicleType: VehicleType.MSB,
    radioName: "ARGSAR_331",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "9:00-18:00",
      days: "LUN-VEN"
    }
  },
  {
    id: "6447f5c4-490c-43a6-875e-0899c8e67d74",
    station: {
      name: "Croce Azzurra Cadorago",
      coordinates: { latitude: 45.7254998, longitude: 9.0380364 }
    },
    currentLocation: { latitude: 45.7254998, longitude: 9.0380364 },
    vehicleType: VehicleType.MSB,
    radioName: "AZZCAD_152.04C1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "66cbbee7-b928-4be5-932d-cba6ffac91d1",
    station: {
      name: "Croce Azzurra Caronno Pertusella",
      coordinates: { latitude: 45.596266, longitude: 9.048169 }
    },
    currentLocation: { latitude: 45.596266, longitude: 9.048169 },
    vehicleType: VehicleType.MSB,
    radioName: "AZZCAR_137.23A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "bd67dcdf-6cbf-45cf-a326-00bf1e8906da",
    station: {
      name: "Croce Azzurra Como",
      coordinates: { latitude: 45.790055, longitude: 9.087885 }
    },
    currentLocation: { latitude: 45.790055, longitude: 9.087885 },
    vehicleType: VehicleType.MSB,
    radioName: "AZZ_CO_152.05B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "264c0473-1986-4f40-8bdf-b17458781a9e",
    station: {
      name: "Croce Azzurra Porlezza",
      coordinates: { latitude: 46.0364666, longitude: 9.1290498 }
    },
    currentLocation: { latitude: 46.0364666, longitude: 9.1290498 },
    vehicleType: VehicleType.MSB,
    radioName: "AZZPOR_133.01A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "999c1109-048b-406b-9044-503b87f180b0",
    station: {
      name: "Croce Azzurra Rovellasca",
      coordinates: { latitude: 45.6651888, longitude: 9.0567227 }
    },
    currentLocation: { latitude: 45.6651888, longitude: 9.0567227 },
    vehicleType: VehicleType.MSB,
    radioName: "AZZROV_151.04B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "ee661051-79db-4fec-a940-89c1bce54909",
    station: {
      name: "Croce Bianca Besana Brianza",
      coordinates: { latitude: 45.701124, longitude: 9.282241 }
    },
    currentLocation: { latitude: 45.701124, longitude: 9.282241 },
    vehicleType: VehicleType.MSB,
    radioName: "BIABES_168.01A2",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "7:00-19:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "307490c8-e408-442d-b954-ef462154c61f",
    station: {
      name: "Croce Bianca Besana Brianza",
      coordinates: { latitude: 45.701124, longitude: 9.282241 }
    },
    currentLocation: { latitude: 45.701124, longitude: 9.282241 },
    vehicleType: VehicleType.MSB,
    radioName: "BIABES_179.01A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "0a15de52-dd37-4c44-92d6-a77de1f59d7f",
    station: {
      name: "Croce Bianca Biassono",
      coordinates: { latitude: 45.6309402, longitude: 9.273582 }
    },
    currentLocation: { latitude: 45.6309402, longitude: 9.273582 },
    vehicleType: VehicleType.MSB,
    radioName: "BIABIA_411",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "21:00-7:00",
      days: "LUN-SAB"
    }
  },
  {
    id: "c8414274-6dfe-41f3-b8e3-db09b795e662",
    station: {
      name: "Croce Bianca Bovisio Masciago",
      coordinates: { latitude: 45.6098911, longitude: 9.1466598 }
    },
    currentLocation: { latitude: 45.6098911, longitude: 9.1466598 },
    vehicleType: VehicleType.MSB,
    radioName: "BIACES_396",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "18:30-00:30",
      days: "LUN-VEN"
    }
  },
  {
    id: "0244cf03-6055-4080-a321-2793c33b1064",
    station: {
      name: "Croce Bianca Brugherio",
      coordinates: { latitude: 45.5543219, longitude: 9.305386 }
    },
    currentLocation: { latitude: 45.5543219, longitude: 9.305386 },
    vehicleType: VehicleType.MSB,
    radioName: "BIABRU_150.05A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "6:00-14:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "46b0ff60-70f5-4421-8e9b-7df68841c569",
    station: {
      name: "Croce Bianca Brugherio",
      coordinates: { latitude: 45.5543219, longitude: 9.305386 }
    },
    currentLocation: { latitude: 45.5543219, longitude: 9.305386 },
    vehicleType: VehicleType.MSB,
    radioName: "BIABRU_150",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "22:00-6:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "5a375f62-bfac-4ce5-9506-89d9601806cc",
    station: {
      name: "Croce Bianca Castello di Brianza",
      coordinates: { latitude: 45.7666801, longitude: 9.3463132 }
    },
    currentLocation: { latitude: 45.7666801, longitude: 9.3463132 },
    vehicleType: VehicleType.MSB,
    radioName: "BIABEC_371",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "19:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "5d8b88ef-7d4f-4730-8ab6-b41058204056",
    station: {
      name: "Croce Bianca Cesano Maderno",
      coordinates: { latitude: 45.6244233, longitude: 9.140358 }
    },
    currentLocation: { latitude: 45.6244233, longitude: 9.140358 },
    vehicleType: VehicleType.MSB,
    radioName: "BIACES_194.08A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "8a6c2d76-c5f7-4441-9879-28536e0660b0",
    station: {
      name: "Croce Bianca Giussano",
      coordinates: { latitude: 45.6913316, longitude: 9.203068 }
    },
    currentLocation: { latitude: 45.6913316, longitude: 9.203068 },
    vehicleType: VehicleType.MSB,
    radioName: "BIAGIU_222",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "10:00-16:00, 18:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "a6130564-fde4-466a-9a1b-d75320b21093",
    station: {
      name: "Croce Bianca Mariano Comense",
      coordinates: { latitude: 45.6943316, longitude: 9.1827115 }
    },
    currentLocation: { latitude: 45.6943316, longitude: 9.1827115 },
    vehicleType: VehicleType.MSB,
    radioName: "BIAMAR_104.06D1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "d675c1ae-4bd7-4cf9-a999-71ff55af7a25",
    station: {
      name: "Croce Bianca Merate",
      coordinates: { latitude: 45.6932192, longitude: 9.4268477 }
    },
    currentLocation: { latitude: 45.6932192, longitude: 9.4268477 },
    vehicleType: VehicleType.MSB,
    radioName: "BIAMER_112.06A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "382da6e3-b48f-4838-8f1d-7c8cb52ce1d3",
    station: {
      name: "Croce Bianca Seveso",
      coordinates: { latitude: 45.651548, longitude: 9.135717 }
    },
    currentLocation: { latitude: 45.651548, longitude: 9.135717 },
    vehicleType: VehicleType.MSB,
    radioName: "BIASEV_323",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "19:30-00:30",
      days: "LUN-DOM"
    }
  },
  {
    id: "201e0146-09ff-4c32-a66d-624c892b3df6",
    station: {
      name: "Croce Medica Dist. Castiglione",
      coordinates: { latitude: 45.9548909, longitude: 9.0917016 }
    },
    currentLocation: { latitude: 45.9548909, longitude: 9.0917016 },
    vehicleType: VehicleType.MSA1,
    radioName: "CO_008",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "9f8f0d0a-7801-4d3f-b214-1323d1232287",
    station: {
      name: "Croce Medica Dist. Castiglione",
      coordinates: { latitude: 45.9548909, longitude: 9.0917016 }
    },
    currentLocation: { latitude: 45.9548909, longitude: 9.0917016 },
    vehicleType: VehicleType.MSB,
    radioName: "MDCCST_135.02A2",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "628d1559-59b9-42cf-94dc-9612a4a68b3d",
    station: {
      name: "Croce Rossa Italiana - Asso",
      coordinates: { latitude: 45.8616959, longitude: 9.2696378 }
    },
    currentLocation: { latitude: 45.8616959, longitude: 9.2696378 },
    vehicleType: VehicleType.MSB,
    radioName: "CRIASS+313",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "21:00-7:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "72393f1b-e77a-4909-a5d6-8ea38ac19268",
    station: {
      name: "Croce Rossa Italiana - Ballabio",
      coordinates: { latitude: 45.920654, longitude: 9.4391789 }
    },
    currentLocation: { latitude: 45.920654, longitude: 9.4391789 },
    vehicleType: VehicleType.MSB,
    radioName: "CRIBAL_283",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "9:00-19:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "fff95b47-90b2-4b6a-93db-9bfe8ad0c450",
    station: {
      name: "Croce Rossa Italiana - Ballabio",
      coordinates: { latitude: 45.920654, longitude: 9.4391789 }
    },
    currentLocation: { latitude: 45.920654, longitude: 9.4391789 },
    vehicleType: VehicleType.MSB,
    radioName: "CRIBAL_184.02A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "20:00-8:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "e6ec2475-31ad-42e2-8ae7-e88e974f99af",
    station: {
      name: "Croce Rossa Italiana - Barzanò",
      coordinates: { latitude: 45.7417565, longitude: 9.3214771 }
    },
    currentLocation: { latitude: 45.7417565, longitude: 9.3214771 },
    vehicleType: VehicleType.MSB,
    radioName: "CRICAN_156.06B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "14:00-6:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "c6ba3339-ae19-4ce2-bb2b-78a609e87ee2",
    station: {
      name: "Croce Rossa Italiana - Brugherio",
      coordinates: { latitude: 45.549869, longitude: 9.307872 }
    },
    currentLocation: { latitude: 45.549869, longitude: 9.307872 },
    vehicleType: VehicleType.MSB,
    radioName: "CRIBRU_151.05A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "14:00-6:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "9c1643cd-9e43-4ffa-9980-da80e03b1767",
    station: {
      name: "Croce Rossa Italiana - Busto Arsizio",
      coordinates: { latitude: 45.6204195, longitude: 8.8517789 }
    },
    currentLocation: { latitude: 45.6204195, longitude: 8.8517789 },
    vehicleType: VehicleType.MSB,
    radioName: "CRIBUS_146.06E1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "a6f15c0e-ffe6-42cd-8a5c-78a20cf1f4fe",
    station: {
      name: "Croce Rossa Italiana - Busto Arsizio",
      coordinates: { latitude: 45.6204195, longitude: 8.8517789 }
    },
    currentLocation: { latitude: 45.6204195, longitude: 8.8517789 },
    vehicleType: VehicleType.MSB,
    radioName: "CRIBUS_166.06D1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "4181c772-0e86-4a03-bb90-a157a3c73b3e",
    station: {
      name: "Croce Rossa Italiana - Busto Arsizio",
      coordinates: { latitude: 45.6204195, longitude: 8.8517789 }
    },
    currentLocation: { latitude: 45.6204195, longitude: 8.8517789 },
    vehicleType: VehicleType.MSA1,
    radioName: "VA_006",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "0b802095-1f0d-4210-b09e-bbba471d5394",
    station: {
      name: "Croce Rossa Italiana - Cantù",
      coordinates: { latitude: 45.735904, longitude: 9.1237527 }
    },
    currentLocation: { latitude: 45.735904, longitude: 9.1237527 },
    vehicleType: VehicleType.MSB,
    radioName: "CRICTU_105.06B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "97cee7b4-2489-4405-8a73-e2acde47f374",
    station: {
      name: "Croce Rossa Italiana - Cermenate",
      coordinates: { latitude: 45.7012481, longitude: 9.0778371 }
    },
    currentLocation: { latitude: 45.7012481, longitude: 9.0778371 },
    vehicleType: VehicleType.MSB,
    radioName: "CRICMN+308",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "19:30-6:30",
      days: "LUN-DOM"
    }
  },
  {
    id: "475463eb-47d0-47d5-ab30-22e0199e6a59",
    station: {
      name: "Croce Rossa Italiana - Cernobbio",
      coordinates: { latitude: 45.839133, longitude: 9.0650818 }
    },
    currentLocation: { latitude: 45.839133, longitude: 9.0650818 },
    vehicleType: VehicleType.MSB,
    radioName: "CRICRN_192.02B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "6:00-22:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "94a80aeb-4257-4322-9ab0-ef5e85083b41",
    station: {
      name: "Croce Rossa Italiana - Colico",
      coordinates: { latitude: 46.1392862, longitude: 9.3956714 }
    },
    currentLocation: { latitude: 46.1392862, longitude: 9.3956714 },
    vehicleType: VehicleType.MSB,
    radioName: "CRICOL_117.01B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "569c8bb2-7176-4e5e-8b83-d133257c0a92",
    station: {
      name: "Croce Rossa Italiana - Colico",
      coordinates: { latitude: 46.1392862, longitude: 9.3956714 }
    },
    currentLocation: { latitude: 46.1392862, longitude: 9.3956714 },
    vehicleType: VehicleType.MSA2,
    radioName: "LC_006",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "e3332777-c8f3-4528-bb58-93b8651c9c59",
    station: {
      name: "Croce Rossa Italiana - Como",
      coordinates: { latitude: 45.804252, longitude: 9.083708 }
    },
    currentLocation: { latitude: 45.804252, longitude: 9.083708 },
    vehicleType: VehicleType.MSA1,
    radioName: "CO_003",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "20:00-8:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "30970693-5e35-4ded-a990-ffa1994bbdba",
    station: {
      name: "Croce Rossa Italiana - Como",
      coordinates: { latitude: 45.804252, longitude: 9.083708 }
    },
    currentLocation: { latitude: 45.804252, longitude: 9.083708 },
    vehicleType: VehicleType.MSA2,
    radioName: "CO_003",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "6c5f3f43-c135-464c-a211-fdde5688f3f8",
    station: {
      name: "Croce Rossa Italiana - Como",
      coordinates: { latitude: 45.804252, longitude: 9.083708 }
    },
    currentLocation: { latitude: 45.804252, longitude: 9.083708 },
    vehicleType: VehicleType.MSB,
    radioName: "CRI_CO_122.05A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "50655b2d-72c8-4f1d-bd3f-83e8e5a7463d",
    station: {
      name: "Croce Rossa Italiana - Desio",
      coordinates: { latitude: 45.6252665, longitude: 9.2034786 }
    },
    currentLocation: { latitude: 45.6252665, longitude: 9.2034786 },
    vehicleType: VehicleType.MSB,
    radioName: "CRIDES_329",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "19:30-6:30, SAB-DOM 7:00-18:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "516c6ddb-5388-4729-ac12-1b0ea9f0ebbb",
    station: {
      name: "Croce Rossa Italiana - Galbiate",
      coordinates: { latitude: 45.8164625, longitude: 9.3776936 }
    },
    currentLocation: { latitude: 45.8164625, longitude: 9.3776936 },
    vehicleType: VehicleType.MSB,
    radioName: "CRIGLB+399",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "19:30-6:30, SAB-DOM 7:00-18:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "e7222330-29d1-4dbb-b6e5-77a0e64116ac",
    station: {
      name: "Croce Rossa Italiana - Gallarate",
      coordinates: { latitude: 45.6675037, longitude: 8.8037716 }
    },
    currentLocation: { latitude: 45.6675037, longitude: 8.8037716 },
    vehicleType: VehicleType.MSB,
    radioName: "CRIGAL_136.05B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "833fa313-7a72-4d65-addd-39fbcf5ff0d0",
    station: {
      name: "Croce Rossa Italiana - Gallarate",
      coordinates: { latitude: 45.6675037, longitude: 8.8037716 }
    },
    currentLocation: { latitude: 45.6675037, longitude: 8.8037716 },
    vehicleType: VehicleType.MSB,
    radioName: "CRIGAL_139.05A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "1d914327-41d4-4efd-a416-d9d9c89e22f8",
    station: {
      name: "Croce Rossa Italiana - Gavirate",
      coordinates: { latitude: 45.8439529, longitude: 8.7129882 }
    },
    currentLocation: { latitude: 45.8439529, longitude: 8.7129882 },
    vehicleType: VehicleType.MSB,
    radioName: "CRIGAV_343",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "19:30-00:30",
      days: "LUN-DOM"
    }
  },
  {
    id: "867b3202-97b1-4390-955f-66cb41423bd8",
    station: {
      name: "Croce Rossa Italiana - Grandate",
      coordinates: { latitude: 45.7730457, longitude: 9.0561846 }
    },
    currentLocation: { latitude: 45.7730457, longitude: 9.0561846 },
    vehicleType: VehicleType.MSB,
    radioName: "CRIGRA_193.05C1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "8:00-8:00",
      days: "LUN,MER,VEN,SAB"
    }
  },
  {
    id: "801c3a06-837b-4c9e-8bd5-aa0b47066cb5",
    station: {
      name: "Croce Rossa Italiana - Grandate",
      coordinates: { latitude: 45.7730457, longitude: 9.0561846 }
    },
    currentLocation: { latitude: 45.7730457, longitude: 9.0561846 },
    vehicleType: VehicleType.MSB,
    radioName: "CRIGRA_293",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "8:00-8:00",
      days: "MAR,GIO,DOM"
    }
  },
  {
    id: "ffc6f5e5-84e1-46f5-a95d-2545c9da1bc8",
    station: {
      name: "Croce Rossa Italiana - Lainate",
      coordinates: { latitude: 45.562788, longitude: 9.024662 }
    },
    currentLocation: { latitude: 45.562788, longitude: 9.024662 },
    vehicleType: VehicleType.MSB,
    radioName: "CRILAI_305",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "18:00-00:00, SAB-DOM 8:00-18:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "6aab0944-5421-4dee-9505-89a8f169afc9",
    station: {
      name: "Croce Rossa Italiana - Lecco",
      coordinates: { latitude: 45.8613483, longitude: 9.4005782 }
    },
    currentLocation: { latitude: 45.8613483, longitude: 9.4005782 },
    vehicleType: VehicleType.MSB,
    radioName: "CRI_LC_177.03A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "090062e5-e13d-4730-9350-cc89897c465d",
    station: {
      name: "Croce Rossa Italiana - Lentate",
      coordinates: { latitude: 45.677521, longitude: 9.119524 }
    },
    currentLocation: { latitude: 45.677521, longitude: 9.119524 },
    vehicleType: VehicleType.MSB,
    radioName: "CRILEN_339",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "19:30-6:30, SAB-DOM 7:00-18:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "ca2f0748-6a48-4d90-95af-4a5c11cc00e3",
    station: {
      name: "Croce Rossa Italiana - Lipomo",
      coordinates: { latitude: 45.7940846, longitude: 9.1163124 }
    },
    currentLocation: { latitude: 45.7940846, longitude: 9.1163124 },
    vehicleType: VehicleType.MSB,
    radioName: "CRILIP_120.06C1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "cfaba2fd-0a48-44b2-82db-7d2bd096ba53",
    station: {
      name: "Croce Rossa Italiana - Lomazzo",
      coordinates: { latitude: 45.6981653, longitude: 9.03271 }
    },
    currentLocation: { latitude: 45.6981653, longitude: 9.03271 },
    vehicleType: VehicleType.MSB,
    radioName: "CRILOM_148.04D1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "584ff296-80a7-434b-a158-8318d277ba03",
    station: {
      name: "Croce Rossa Italiana - Luino",
      coordinates: { latitude: 45.990969, longitude: 8.7620458 }
    },
    currentLocation: { latitude: 45.990969, longitude: 8.7620458 },
    vehicleType: VehicleType.MSB,
    radioName: "CRILUI_128.01A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "a39d23cc-7f38-4355-b261-6d154ec3979b",
    station: {
      name: "Croce Rossa Italiana - Lurate Caccivio",
      coordinates: { latitude: 45.771265, longitude: 8.9978786 }
    },
    currentLocation: { latitude: 45.771265, longitude: 8.9978786 },
    vehicleType: VehicleType.MSB,
    radioName: "CRILUR_154.04E1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "98571c42-3973-4790-befc-fea048f1d66f",
    station: {
      name: "Croce Rossa Italiana - Lurate Caccivio",
      coordinates: { latitude: 45.771265, longitude: 8.9978786 }
    },
    currentLocation: { latitude: 45.771265, longitude: 8.9978786 },
    vehicleType: VehicleType.MSA1,
    radioName: "CO_004",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "a806d00b-6b01-439c-9d10-9db3dd41ac00",
    station: {
      name: "Croce Rossa Italiana - Masilianico",
      coordinates: { latitude: 45.8404098, longitude: 9.0444822 }
    },
    currentLocation: { latitude: 45.8404098, longitude: 9.0444822 },
    vehicleType: VehicleType.MSB,
    radioName: "CRIMAS_192.02B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "22:00-6:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "ee65968e-3242-442b-a992-6337d6ea35ae",
    station: {
      name: "Croce Rossa Italiana - Menaggio",
      coordinates: { latitude: 46.0213657, longitude: 9.2403722 }
    },
    currentLocation: { latitude: 46.0213657, longitude: 9.2403722 },
    vehicleType: VehicleType.MSB,
    radioName: "CRIMEN_121.01B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "39208800-5440-4943-82b1-628b06a568b9",
    station: {
      name: "Croce Rossa Italiana - Misinto",
      coordinates: { latitude: 45.657469, longitude: 9.07889 }
    },
    currentLocation: { latitude: 45.657469, longitude: 9.07889 },
    vehicleType: VehicleType.MSB,
    radioName: "CRIMIS_130.07A2",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "7:00-19:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "55f2570e-5eef-4620-970b-0621aa12de8d",
    station: {
      name: "Croce Rossa Italiana - Misinto",
      coordinates: { latitude: 45.657469, longitude: 9.07889 }
    },
    currentLocation: { latitude: 45.657469, longitude: 9.07889 },
    vehicleType: VehicleType.MSA1,
    radioName: "CO_007",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "dbfaffe4-d59c-4eff-a1f8-5371f28526cf",
    station: {
      name: "Croce Rossa Italiana - Montorfano",
      coordinates: { latitude: 45.7838303, longitude: 9.1501239 }
    },
    currentLocation: { latitude: 45.7838303, longitude: 9.1501239 },
    vehicleType: VehicleType.MSB,
    radioName: "CRIMNT+373",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "18:00-2:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "38cdd65a-8f51-43f0-8fcf-b28d84eb2dbc",
    station: {
      name: "Croce Rossa Italiana - Monza",
      coordinates: { latitude: 45.5764677, longitude: 9.2678848 }
    },
    currentLocation: { latitude: 45.5764677, longitude: 9.2678848 },
    vehicleType: VehicleType.MSB,
    radioName: "CRI_MB_288.05B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "22:00-6:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "e9bf047e-cc3c-40d4-a3a4-0239d665cfa6",
    station: {
      name: "Croce Rossa Italiana - Monza",
      coordinates: { latitude: 45.5764677, longitude: 9.2678848 }
    },
    currentLocation: { latitude: 45.5764677, longitude: 9.2678848 },
    vehicleType: VehicleType.MSB,
    radioName: "CRI_MB_184.05C1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "4939c440-4040-4d89-96a2-27a87a9f6256",
    station: {
      name: "Croce Rossa Italiana - Monza",
      coordinates: { latitude: 45.5764677, longitude: 9.2678848 }
    },
    currentLocation: { latitude: 45.5764677, longitude: 9.2678848 },
    vehicleType: VehicleType.MSB,
    radioName: "CRI_MB_196.05B2",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "7:00-19:00",
      days: "LUN-SAB"
    }
  },
  {
    id: "a4c089a4-0b2b-4480-841c-77308e058fd5",
    station: {
      name: "Croce Rossa Italiana - Monza",
      coordinates: { latitude: 45.5764677, longitude: 9.2678848 }
    },
    currentLocation: { latitude: 45.5764677, longitude: 9.2678848 },
    vehicleType: VehicleType.MSB,
    radioName: "CRI_MB_A.BK",
    convention: ConventionType.AGG,
    schedule: {
      workingHours: "22:00-6:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "5f95caf5-2bc6-4e5f-83d6-0e1194688482",
    station: {
      name: "Croce Rossa Italiana - Muggiò",
      coordinates: { latitude: 45.595134, longitude: 9.2303846 }
    },
    currentLocation: { latitude: 45.595134, longitude: 9.2303846 },
    vehicleType: VehicleType.MSB,
    radioName: "CRIMUG_323",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "18:00-2:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "de949ecc-718b-424b-af87-6e0afd732684",
    station: {
      name: "Croce Rossa Italiana - Nova Milanese",
      coordinates: { latitude: 45.5867611, longitude: 9.2039573 }
    },
    currentLocation: { latitude: 45.5867611, longitude: 9.2039573 },
    vehicleType: VehicleType.MSB,
    radioName: "CRINOV_343",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "18:30-00:30",
      days: "LUN-DOM"
    }
  },
  {
    id: "55d20d02-4d0b-4047-b998-c0036aeb49a0",
    station: {
      name: "Croce Rossa Italiana - Olgiate Molgora",
      coordinates: { latitude: 45.7191623, longitude: 9.3995321 }
    },
    currentLocation: { latitude: 45.7191623, longitude: 9.3995321 },
    vehicleType: VehicleType.MSB,
    radioName: "CRIOLG+303",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "19:30-00:30",
      days: "RANDOM"
    }
  },
  {
    id: "3a0a5b11-dfb0-40b3-98d6-fd512bad5b70",
    station: {
      name: "Croce Rossa Italiana - Premana",
      coordinates: { latitude: 46.0542433, longitude: 9.4172059 }
    },
    currentLocation: { latitude: 46.0542433, longitude: 9.4172059 },
    vehicleType: VehicleType.MSB,
    radioName: "CRIPRE_194.02B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "36ff6d87-2e06-4269-bb3d-518b1aa2d471",
    station: {
      name: "Croce Rossa Italiana - San Fedele Intelvi",
      coordinates: { latitude: 45.9702052, longitude: 9.0776858 }
    },
    currentLocation: { latitude: 45.9702052, longitude: 9.0776858 },
    vehicleType: VehicleType.MSB,
    radioName: "CRISFD_314",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "18:30-00:30",
      days: "LUN-DOM"
    }
  },
  {
    id: "6a551f0f-e59c-4823-99b1-a14ad06ce2de",
    station: {
      name: "Croce Rossa Italiana - San Fermo della Battaglia",
      coordinates: { latitude: 45.806793, longitude: 9.051056 }
    },
    currentLocation: { latitude: 45.806793, longitude: 9.051056 },
    vehicleType: VehicleType.MSB,
    radioName: "CRISFB_163.05C1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "8:00-8:00",
      days: "MAR,GIO,DOM"
    }
  },
  {
    id: "e48228cd-e326-4b7b-b385-fd8c93d862c3",
    station: {
      name: "Croce Rossa Italiana - San Fermo della Battaglia",
      coordinates: { latitude: 45.806793, longitude: 9.051056 }
    },
    currentLocation: { latitude: 45.806793, longitude: 9.051056 },
    vehicleType: VehicleType.MSB,
    radioName: "CRISFB_261",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "8:00-8:00",
      days: "LUN,MER,VEN,SAB"
    }
  },
  {
    id: "e6d69a89-a5c7-415e-b0ae-c6dfcea39e9c",
    station: {
      name: "Croce Rossa Italiana - Saronno",
      coordinates: { latitude: 45.623675, longitude: 9.037303 }
    },
    currentLocation: { latitude: 45.623675, longitude: 9.037303 },
    vehicleType: VehicleType.MSB,
    radioName: "CRISAR_192.22A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "48b50403-2aa9-4ba4-b6b9-ef826dbb6afc",
    station: {
      name: "Croce Rossa Italiana - Tradate",
      coordinates: { latitude: 45.7050341, longitude: 8.9074299 }
    },
    currentLocation: { latitude: 45.7050341, longitude: 8.9074299 },
    vehicleType: VehicleType.MSB,
    radioName: "CRITRA_122.04A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "746e7a7d-adea-44ce-9c8c-f323d0cdd443",
    station: {
      name: "Croce Rossa Italiana - Tradate",
      coordinates: { latitude: 45.7050341, longitude: 8.9074299 }
    },
    currentLocation: { latitude: 45.7050341, longitude: 8.9074299 },
    vehicleType: VehicleType.MSA1,
    radioName: "VA_003",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "08869f5b-b2b8-4b01-ae4d-33f289fd5b2d",
    station: {
      name: "Croce Rossa Italiana - Uggiate Trevano",
      coordinates: { latitude: 45.8237455, longitude: 8.9529333 }
    },
    currentLocation: { latitude: 45.8237455, longitude: 8.9529333 },
    vehicleType: VehicleType.MSB,
    radioName: "CRIUGG+354",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "21:00-6:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "788b4643-3aff-4ca2-a625-dc5e31faf0f5",
    station: {
      name: "Croce Rossa Italiana - Valceresio",
      coordinates: { latitude: 45.8628819, longitude: 8.8620013 }
    },
    currentLocation: { latitude: 45.8628819, longitude: 8.8620013 },
    vehicleType: VehicleType.MSB,
    radioName: "CRIVLC_181.02C2",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "55f40171-334d-4225-a0c0-47f9c5535a1b",
    station: {
      name: "Croce Rossa Italiana - Valceresio",
      coordinates: { latitude: 45.8628819, longitude: 8.8620013 }
    },
    currentLocation: { latitude: 45.8628819, longitude: 8.8620013 },
    vehicleType: VehicleType.MSB,
    radioName: "CRIVLC+382",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "20:30-7:30",
      days: "RANDOM"
    }
  },
  {
    id: "1ce4ba35-760e-4b83-aad7-1a36b2030133",
    station: {
      name: "Croce Rossa Italiana - Valmadrera",
      coordinates: { latitude: 45.8469095, longitude: 9.3602592 }
    },
    currentLocation: { latitude: 45.8469095, longitude: 9.3602592 },
    vehicleType: VehicleType.MSB,
    radioName: "CRIVMD_327",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "20:30-7:30",
      days: "RANDOM"
    }
  },
  {
    id: "4296d222-8124-499b-bff3-2cd00ec44b00",
    station: {
      name: "Croce Rossa Italiana - Varedo",
      coordinates: { latitude: 45.5991642, longitude: 9.1518244 }
    },
    currentLocation: { latitude: 45.5991642, longitude: 9.1518244 },
    vehicleType: VehicleType.MSB,
    radioName: "CRIVAR_141.07A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "20:00-8:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "714f9249-bbe1-481f-8571-86265b4c2b57",
    station: {
      name: "Croce Rossa Italiana - Varese",
      coordinates: { latitude: 45.7965279, longitude: 8.846416 }
    },
    currentLocation: { latitude: 45.7965279, longitude: 8.846416 },
    vehicleType: VehicleType.MSB,
    radioName: "CRI_VA_108.02A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "7ac6fe52-e588-4309-8683-c49dfb8a2bf1",
    station: {
      name: "Croce Rossa Italiana - Varese",
      coordinates: { latitude: 45.7965279, longitude: 8.846416 }
    },
    currentLocation: { latitude: 45.7965279, longitude: 8.846416 },
    vehicleType: VehicleType.MSB,
    radioName: "CRI_VA_125.02B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "2ed00646-2349-460a-8f2d-08c718d7009a",
    station: {
      name: "Croce Rossa Italiana - Varese",
      coordinates: { latitude: 45.7965279, longitude: 8.846416 }
    },
    currentLocation: { latitude: 45.7965279, longitude: 8.846416 },
    vehicleType: VehicleType.MSB,
    radioName: "CRI_VA_109.02A2",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "311a29eb-d8dd-49aa-964f-432fe52c8566",
    station: {
      name: "Croce Rossa Italiana - Villasanta",
      coordinates: { latitude: 45.6015832, longitude: 9.3037616 }
    },
    currentLocation: { latitude: 45.6015832, longitude: 9.3037616 },
    vehicleType: VehicleType.MSB,
    radioName: "CRIVLS_329",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "20:30-7:30, SAB-DOM 9:00-19:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "dfd2c665-ad65-4485-bc67-6bd49090a385",
    station: {
      name: "Croce San Nicolò",
      coordinates: { latitude: 45.841086, longitude: 9.4080434 }
    },
    currentLocation: { latitude: 45.841086, longitude: 9.4080434 },
    vehicleType: VehicleType.MSB,
    radioName: "CRO_LC_136.03A2",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "7:30-19:30",
      days: "LUN-DOM"
    }
  },
  {
    id: "0ea4ef98-2cb2-4866-b714-c43de3eed631",
    station: {
      name: "Croce San Nicolò",
      coordinates: { latitude: 45.841086, longitude: 9.4080434 }
    },
    currentLocation: { latitude: 45.841086, longitude: 9.4080434 },
    vehicleType: VehicleType.MSB,
    radioName: "CRO_LC_335",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "19:30-6:30",
      days: "VEN-SAB"
    }
  },
  {
    id: "15811779-0251-4de1-a09d-3d29af02c6a1",
    station: {
      name: "Croce Verde Bosisio",
      coordinates: { latitude: 45.8006579, longitude: 9.2872012 }
    },
    currentLocation: { latitude: 45.8006579, longitude: 9.2872012 },
    vehicleType: VehicleType.MSB,
    radioName: "VERBOS_112.04A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "3864430d-d9a9-486e-90e4-69dbd402c63a",
    station: {
      name: "Croce Verde Fino Mornasco",
      coordinates: { latitude: 45.743566, longitude: 9.052472 }
    },
    currentLocation: { latitude: 45.743566, longitude: 9.052472 },
    vehicleType: VehicleType.MSB,
    radioName: "VERFIN_353",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "8:00-20:00",
      days: "SAB-DOM"
    }
  },
  {
    id: "936d92d3-bcd8-462f-9d3c-669a5bb1a841",
    station: {
      name: "Croce Verde Fino Mornasco",
      coordinates: { latitude: 45.743566, longitude: 9.052472 }
    },
    currentLocation: { latitude: 45.743566, longitude: 9.052472 },
    vehicleType: VehicleType.MSB,
    radioName: "VERFIN_152.04C1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "20:00-8:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "925502b6-ec2d-4e3d-b40e-9d5e9662b10f",
    station: {
      name: "Croce Verde Lissone",
      coordinates: { latitude: 45.6179265, longitude: 9.2384601 }
    },
    currentLocation: { latitude: 45.6179265, longitude: 9.2384601 },
    vehicleType: VehicleType.MSB,
    radioName: "VERLIS_145.04A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "60edf1e6-937e-4a0a-b6c0-7018b995e5b8",
    station: {
      name: "Croce Verde Lissone",
      coordinates: { latitude: 45.6179265, longitude: 9.2384601 }
    },
    currentLocation: { latitude: 45.6179265, longitude: 9.2384601 },
    vehicleType: VehicleType.MSB,
    radioName: "VERLIS_238.04A2",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "7:00-19:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "8eea1606-6e99-4044-8ef7-61e4f1abf218",
    station: {
      name: "Croce Viola Cesate",
      coordinates: { latitude: 45.5891414, longitude: 9.0704301 }
    },
    currentLocation: { latitude: 45.5891414, longitude: 9.0704301 },
    vehicleType: VehicleType.MSB,
    radioName: "VIOCST_146.23A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "20:00-8:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "377174eb-4c49-4913-bb14-537ebe36cf4a",
    station: {
      name: "Gazzada Dist. CRI_VA",
      coordinates: { latitude: 45.7730789, longitude: 8.8240692 }
    },
    currentLocation: { latitude: 45.7730789, longitude: 8.8240692 },
    vehicleType: VehicleType.MSB,
    radioName: "CRI_VA_135.04B2",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "34fe97af-cc9e-4873-8fd7-fd10e50e9512",
    station: {
      name: "Gazzada Dist. CRI_VA",
      coordinates: { latitude: 45.7730789, longitude: 8.8240692 }
    },
    currentLocation: { latitude: 45.7730789, longitude: 8.8240692 },
    vehicleType: VehicleType.MSB,
    radioName: "CRI_VA+333",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "20:30-7:30",
      days: "VEN-SAB"
    }
  },
  {
    id: "0d86cb9c-daf7-4b22-bfae-ccbe9398eb55",
    station: {
      name: "Inter SOS Dist. Desio",
      coordinates: { latitude: 45.6282312, longitude: 9.2126976 }
    },
    currentLocation: { latitude: 45.6282312, longitude: 9.2126976 },
    vehicleType: VehicleType.MSB,
    radioName: "INTDES_187.06A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "3e89ee4d-d5cf-4e5b-a3aa-8cdf739dccb5",
    station: {
      name: "Lariosoccorso Dongo",
      coordinates: { latitude: 46.122947, longitude: 9.280596 }
    },
    currentLocation: { latitude: 46.122947, longitude: 9.280596 },
    vehicleType: VehicleType.MSB,
    radioName: "LARDON_193.01C1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "19eaee12-8ca6-4f76-ad7e-ed85b9011cc2",
    station: {
      name: "Lariosoccorso Erba",
      coordinates: { latitude: 45.803505, longitude: 9.228768 }
    },
    currentLocation: { latitude: 45.803505, longitude: 9.228768 },
    vehicleType: VehicleType.MSB,
    radioName: "LARERB_167.06A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "bb0df52a-047c-4b9a-a4c4-bdefa4f7eab2",
    station: {
      name: "Lariosoccorso Erba",
      coordinates: { latitude: 45.803505, longitude: 9.228768 }
    },
    currentLocation: { latitude: 45.803505, longitude: 9.228768 },
    vehicleType: VehicleType.MSA2,
    radioName: "CO_006",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "346bbbcf-746c-4d67-aa83-f50731c103b6",
    station: {
      name: "Lariosoccorso Erba",
      coordinates: { latitude: 45.803505, longitude: 9.228768 }
    },
    currentLocation: { latitude: 45.803505, longitude: 9.228768 },
    vehicleType: VehicleType.MSA1,
    radioName: "CO_006",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "20:00-8:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "2e247447-3fb3-483f-b837-5a8923df1d02",
    station: {
      name: "Lecco Soccorso",
      coordinates: { latitude: 45.841036, longitude: 9.408472 }
    },
    currentLocation: { latitude: 45.841036, longitude: 9.408472 },
    vehicleType: VehicleType.MSB,
    radioName: "SOC_LC+341",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "8:30-19:30",
      days: "RANDOM"
    }
  },
  {
    id: "7351504b-1e74-457d-95b3-4f88241881a7",
    station: {
      name: "Limido Dist AZZCAD",
      coordinates: { latitude: 45.680589, longitude: 8.987465 }
    },
    currentLocation: { latitude: 45.680589, longitude: 8.987465 },
    vehicleType: VehicleType.MSB,
    radioName: "AZZCAD_134.04F1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "6:00-22:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "c3fa7d2a-630c-4b25-98da-55a40bfd318a",
    station: {
      name: "Lombardia Soccorso",
      coordinates: { latitude: 45.6619637, longitude: 8.8914252 }
    },
    currentLocation: { latitude: 45.6619637, longitude: 8.8914252 },
    vehicleType: VehicleType.MSB,
    radioName: "LOSGOR+315",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "10:00-16:00, 18:00-00:00",
      days: "RANDOM"
    }
  },
  {
    id: "2043a58e-d860-48e7-86a6-1c2ebfe2b027",
    station: {
      name: "Missaglia Dist. BIAMER",
      coordinates: { latitude: 45.7090561, longitude: 9.333384 }
    },
    currentLocation: { latitude: 45.7090561, longitude: 9.333384 },
    vehicleType: VehicleType.MSB,
    radioName: "BIAMER_120.06B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "6:00-14:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "c9e9a3c6-1339-4912-babf-d2ce4417a184",
    station: {
      name: "Monza Dist. VOLVIM",
      coordinates: { latitude: 45.564316, longitude: 9.27043 }
    },
    currentLocation: { latitude: 45.564316, longitude: 9.27043 },
    vehicleType: VehicleType.MSB,
    radioName: "VOLVIM_451",
    convention: ConventionType.AGG,
    schedule: {
      workingHours: "6:00-22:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "efd66920-aeec-475f-b97f-c4b204966a03",
    station: {
      name: "Monza Dist. VOLVIM",
      coordinates: { latitude: 45.564316, longitude: 9.27043 }
    },
    currentLocation: { latitude: 45.564316, longitude: 9.27043 },
    vehicleType: VehicleType.MSB,
    radioName: "VOLVIM_151.05B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "6:00-22:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "6496ccc7-d532-4890-872b-13a316b9c319",
    station: {
      name: "Nesso Dist. SOSCNZ",
      coordinates: { latitude: 45.9089868, longitude: 9.1605779 }
    },
    currentLocation: { latitude: 45.9089868, longitude: 9.1605779 },
    vehicleType: VehicleType.MSB,
    radioName: "SOSCNZ_161.03C1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "80c304c2-d826-4bd3-b872-364405115eee",
    station: {
      name: "Padana Emergenza Luino",
      coordinates: { latitude: 46.0043885, longitude: 8.754254 }
    },
    currentLocation: { latitude: 46.0043885, longitude: 8.754254 },
    vehicleType: VehicleType.MSB,
    radioName: "PEMLUI_105.01B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "fc2bda92-98b3-4856-af6c-7ccd7fb87c43",
    station: {
      name: "Postazione AREU - Bellano",
      coordinates: { latitude: 46.04828, longitude: 9.306907 }
    },
    currentLocation: { latitude: 46.04828, longitude: 9.306907 },
    vehicleType: VehicleType.MSA1,
    radioName: "LC_001",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "58b6cea8-4eb7-4027-ac39-d29d36ed1b22",
    station: {
      name: "Postazione AREU - Cantù",
      coordinates: { latitude: 45.739193, longitude: 9.14035 }
    },
    currentLocation: { latitude: 45.739193, longitude: 9.14035 },
    vehicleType: VehicleType.MSA1,
    radioName: "CO_005",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "2a25547a-18e1-47bc-b66a-91c540a43bf1",
    station: {
      name: "Postazione AREU - Cantù",
      coordinates: { latitude: 45.739193, longitude: 9.14035 }
    },
    currentLocation: { latitude: 45.739193, longitude: 9.14035 },
    vehicleType: VehicleType.MSA2,
    radioName: "CO_005",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "20:00-8:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "d7b251b9-f4fc-4315-82df-d83671546885",
    station: {
      name: "Postazione AREU - Desio",
      coordinates: { latitude: 45.6269342, longitude: 9.1963828 }
    },
    currentLocation: { latitude: 45.6269342, longitude: 9.1963828 },
    vehicleType: VehicleType.MSA2,
    radioName: "MB_003",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "74ab9ed3-ad8b-452a-8e06-d4ba2e059f04",
    station: {
      name: "Postazione AREU - Gallarate",
      coordinates: { latitude: 45.6558635, longitude: 8.7925187 }
    },
    currentLocation: { latitude: 45.6558635, longitude: 8.7925187 },
    vehicleType: VehicleType.MSA2,
    radioName: "VA_004",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "e995ab53-fd05-42b7-97c1-ea7e2345aa4b",
    station: {
      name: "Postazione AREU - Gravedona",
      coordinates: { latitude: 46.142989, longitude: 9.300284 }
    },
    currentLocation: { latitude: 46.142989, longitude: 9.300284 },
    vehicleType: VehicleType.MSA1,
    radioName: "CO_001",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "34c7644c-9644-48dc-9a1c-19c42fde2baf",
    station: {
      name: "Postazione AREU - Lecco",
      coordinates: { latitude: 45.852326, longitude: 9.415311 }
    },
    currentLocation: { latitude: 45.852326, longitude: 9.415311 },
    vehicleType: VehicleType.MSA2,
    radioName: "LC_002",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "8343cde8-44cd-44c9-8987-368197a59c56",
    station: {
      name: "Postazione AREU - Luino",
      coordinates: { latitude: 45.9972301, longitude: 8.7461974 }
    },
    currentLocation: { latitude: 45.9972301, longitude: 8.7461974 },
    vehicleType: VehicleType.MSA2,
    radioName: "VA_001",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "e74b7378-481a-4850-bf5a-471d43ad9424",
    station: {
      name: "Postazione AREU - Menaggio",
      coordinates: { latitude: 46.017983, longitude: 9.228001 }
    },
    currentLocation: { latitude: 46.017983, longitude: 9.228001 },
    vehicleType: VehicleType.MSA2,
    radioName: "CO_002",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "f6811237-7f2b-4ebc-994f-998430bfc270",
    station: {
      name: "Postazione AREU - Merate",
      coordinates: { latitude: 45.697072, longitude: 9.426777 }
    },
    currentLocation: { latitude: 45.697072, longitude: 9.426777 },
    vehicleType: VehicleType.MSA1,
    radioName: "LC_004",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "d41ef983-66ba-40f2-95c1-f98c8a2f1723",
    station: {
      name: "Postazione AREU - Molteno",
      coordinates: { latitude: 45.778411, longitude: 9.306803 }
    },
    currentLocation: { latitude: 45.778411, longitude: 9.306803 },
    vehicleType: VehicleType.MSA1,
    radioName: "LC_003",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "99a04110-c342-4da4-9e1d-3f7f49e98df3",
    station: {
      name: "Postazione AREU - Monza",
      coordinates: { latitude: 45.6022413, longitude: 9.2580486 }
    },
    currentLocation: { latitude: 45.6022413, longitude: 9.2580486 },
    vehicleType: VehicleType.MSA2,
    radioName: "MB_011",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "2b96435f-dd40-4f25-ad5a-35526733f53b",
    station: {
      name: "Postazione AREU - Saronno",
      coordinates: { latitude: 45.630968, longitude: 9.0387396 }
    },
    currentLocation: { latitude: 45.630968, longitude: 9.0387396 },
    vehicleType: VehicleType.MSA1,
    radioName: "MI_012",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "0ca6037a-e400-4b3e-b28e-ee2a01602c30",
    station: {
      name: "Postazione AREU - Varese",
      coordinates: { latitude: 45.8085062, longitude: 8.8399358 }
    },
    currentLocation: { latitude: 45.8085062, longitude: 8.8399358 },
    vehicleType: VehicleType.MSA2,
    radioName: "VA_002",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "99636286-f8bf-4718-b1f8-26d3b2e2c43d",
    station: {
      name: "Postazione AREU - Vimercate",
      coordinates: { latitude: 45.6069618, longitude: 9.3562818 }
    },
    currentLocation: { latitude: 45.6069618, longitude: 9.3562818 },
    vehicleType: VehicleType.MSA2,
    radioName: "MB_004",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "c678d49d-713c-4699-b8e9-c9a86341efe4",
    station: {
      name: "Postazione AREU - Vimercate",
      coordinates: { latitude: 45.6069618, longitude: 9.3562818 }
    },
    currentLocation: { latitude: 45.6069618, longitude: 9.3562818 },
    vehicleType: VehicleType.MSA1,
    radioName: "MB_004",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "20:00-8:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "f0e7cd5b-dc60-4484-bf33-9ba087f4e001",
    station: {
      name: "Seregno Soccorso",
      coordinates: { latitude: 45.6468209, longitude: 9.2087062 }
    },
    currentLocation: { latitude: 45.6468209, longitude: 9.2087062 },
    vehicleType: VehicleType.MSB,
    radioName: "SOCSER_112.06B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "a630bbb9-af2c-41b6-9ba9-b6d09b536411",
    station: {
      name: "Soccorso Bellanese",
      coordinates: { latitude: 46.0409336, longitude: 9.3006632 }
    },
    currentLocation: { latitude: 46.0409336, longitude: 9.3006632 },
    vehicleType: VehicleType.MSB,
    radioName: "SOCBEL_122.01A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "88e092c0-91de-4e99-b072-6d501c1e3f86",
    station: {
      name: "Soccorso Centro Valsassina",
      coordinates: { latitude: 45.9773224, longitude: 9.446444 }
    },
    currentLocation: { latitude: 45.9773224, longitude: 9.446444 },
    vehicleType: VehicleType.MSB,
    radioName: "SOCINT_174.02A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "ce7f6381-c5b0-45a2-943b-7d43fd76f043",
    station: {
      name: "Soccorso Centro Valsassina",
      coordinates: { latitude: 45.9773224, longitude: 9.446444 }
    },
    currentLocation: { latitude: 45.9773224, longitude: 9.446444 },
    vehicleType: VehicleType.MSB,
    radioName: "SOCINT_273",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "21:00-6:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "795ac1cc-5109-43f2-bc37-f968cdb301e0",
    station: {
      name: "Soccorso Mandello del Lario",
      coordinates: { latitude: 45.918032, longitude: 9.3228926 }
    },
    currentLocation: { latitude: 45.918032, longitude: 9.3228926 },
    vehicleType: VehicleType.MSB,
    radioName: "SOCMAN_122.01C1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "86377482-301b-4474-b206-187b770f4dd5",
    station: {
      name: "Solaro Dist. CRIMIS",
      coordinates: { latitude: 45.616564, longitude: 9.077873 }
    },
    currentLocation: { latitude: 45.616564, longitude: 9.077873 },
    vehicleType: VehicleType.MSB,
    radioName: "CRIMIS_307",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "22:00-7:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "1b347735-aaef-48f6-ac76-e2a9108ced60",
    station: {
      name: "Somma Lombardo Dist. CRIGAL",
      coordinates: { latitude: 45.683377, longitude: 8.714549 }
    },
    currentLocation: { latitude: 45.683377, longitude: 8.714549 },
    vehicleType: VehicleType.MSB,
    radioName: "CRIGAL_135.05C1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "1d1f073a-d426-4ab5-99b8-1acfe01797c7",
    station: {
      name: "SOS Appiano Gentile",
      coordinates: { latitude: 45.733122, longitude: 8.9889164 }
    },
    currentLocation: { latitude: 45.733122, longitude: 8.9889164 },
    vehicleType: VehicleType.MSB,
    radioName: "SOSAPP_169.04A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "20:00-8:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "d085bb80-6003-4755-be75-e5cf78cdcf70",
    station: {
      name: "SOS Canzo",
      coordinates: { latitude: 45.8514634, longitude: 9.2826358 }
    },
    currentLocation: { latitude: 45.8514634, longitude: 9.2826358 },
    vehicleType: VehicleType.MSB,
    radioName: "SOSCNZ_166.03B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "4f3c3fc7-c5a3-4723-9cc5-3028703261f0",
    station: {
      name: "SOS dei Laghi Dist Travedona",
      coordinates: { latitude: 45.808006, longitude: 8.6744576 }
    },
    currentLocation: { latitude: 45.808006, longitude: 8.6744576 },
    vehicleType: VehicleType.MSB,
    radioName: "SOSTRA_208.03B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "b2fa266e-4003-4c88-abea-7f54d0ed1049",
    station: {
      name: "SOS dei Laghi Dist. Besozzo",
      coordinates: { latitude: 45.8416676, longitude: 8.6641259 }
    },
    currentLocation: { latitude: 45.8416676, longitude: 8.6641259 },
    vehicleType: VehicleType.MSB,
    radioName: "SOSBES+202",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "8:00-14:00",
      days: "SAB-DOM"
    }
  },
  {
    id: "d7112a61-a9cf-4f61-858e-b5a77daafce1",
    station: {
      name: "SOS del Seprio Carnago",
      coordinates: { latitude: 45.7136074, longitude: 8.8450277 }
    },
    currentLocation: { latitude: 45.7136074, longitude: 8.8450277 },
    vehicleType: VehicleType.MSB,
    radioName: "SOSCAR_176.06E2",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "b2709cff-00e3-4e12-8661-91497fef8d93",
    station: {
      name: "SOS Lurago d Erba",
      coordinates: { latitude: 45.750788, longitude: 9.2213151 }
    },
    currentLocation: { latitude: 45.750788, longitude: 9.2213151 },
    vehicleType: VehicleType.MSB,
    radioName: "SOSLRG_167.06E1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "99e1d6f3-166b-457d-978e-b47f17e67965",
    station: {
      name: "SOS Malnate",
      coordinates: { latitude: 45.8023566, longitude: 8.8826956 }
    },
    currentLocation: { latitude: 45.8023566, longitude: 8.8826956 },
    vehicleType: VehicleType.MSB,
    radioName: "SOSMAL_183.02D1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "984c30ca-80e7-41da-b778-96264c7d3b8c",
    station: {
      name: "SOS Mozzate",
      coordinates: { latitude: 45.6752385, longitude: 8.9564359 }
    },
    currentLocation: { latitude: 45.6752385, longitude: 8.9564359 },
    vehicleType: VehicleType.MSB,
    radioName: "SOSMOZ_134.04F1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "22:00-6:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "1ee13130-d368-464f-a92d-966e4f416a05",
    station: {
      name: "SOS Olgiate Comasco",
      coordinates: { latitude: 45.7851213, longitude: 8.9685263 }
    },
    currentLocation: { latitude: 45.7851213, longitude: 8.9685263 },
    vehicleType: VehicleType.MSB,
    radioName: "SOSOLG_169.04A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "b3c33bd1-605a-4273-95b3-184ca7af222d",
    station: {
      name: "SOS Tre valli Curnardo",
      coordinates: { latitude: 45.933276, longitude: 8.803148 }
    },
    currentLocation: { latitude: 45.933276, longitude: 8.803148 },
    vehicleType: VehicleType.MSB,
    radioName: "SOSCUN_149.01D1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "ac566ff5-9b65-427c-9709-188f2a212b59",
    station: {
      name: "SOS Uboldo",
      coordinates: { latitude: 45.6134521, longitude: 9.0092297 }
    },
    currentLocation: { latitude: 45.6134521, longitude: 9.0092297 },
    vehicleType: VehicleType.MSB,
    radioName: "SOSUBO_129.23A2",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-SAB"
    }
  },
  {
    id: "4cfe2f51-8b97-401a-a8d7-808906476bcb",
    station: {
      name: "SOS Uboldo",
      coordinates: { latitude: 45.6134521, longitude: 9.0092297 }
    },
    currentLocation: { latitude: 45.6134521, longitude: 9.0092297 },
    vehicleType: VehicleType.MSB,
    radioName: "SOSUBO_328",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "20:30-01:30",
      days: "SAB-DOM"
    }
  },
  {
    id: "dd2cd8c9-f055-40db-baba-c843aa007d2a",
    station: {
      name: "SOS Valbossa - Azzate",
      coordinates: { latitude: 45.7789924, longitude: 8.7988565 }
    },
    currentLocation: { latitude: 45.7789924, longitude: 8.7988565 },
    vehicleType: VehicleType.MSB,
    radioName: "SOSAZZ_138.04B1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "e415f263-3649-4dc2-8262-815e5f385292",
    station: {
      name: "SOS Valceresio - Besano",
      coordinates: { latitude: 45.8881927, longitude: 8.8872929 }
    },
    currentLocation: { latitude: 45.8881927, longitude: 8.8872929 },
    vehicleType: VehicleType.MSB,
    radioName: "SOSBES_102.02C1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "b8ef3cb3-3dba-4655-8315-94c5aadb37e3",
    station: {
      name: "Sumirago Dist. CRIGAL",
      coordinates: { latitude: 45.7403116, longitude: 8.7807055 }
    },
    currentLocation: { latitude: 45.7403116, longitude: 8.7807055 },
    vehicleType: VehicleType.MSB,
    radioName: "CRIGAL+382",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "19:30-00:30",
      days: "LUN-DOM"
    }
  },
  {
    id: "0ef1aa61-1b57-4dc1-8cc0-ea6956c03dc5",
    station: {
      name: "Volontari Ambulanza Angera",
      coordinates: { latitude: 45.775637, longitude: 8.578263 }
    },
    currentLocation: { latitude: 45.775637, longitude: 8.578263 },
    vehicleType: VehicleType.MSB,
    radioName: "VOLANG_102.03A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "bd5dd9e8-ea8d-4fad-a81e-80e6cca73635",
    station: {
      name: "Volontari Ambulanza Lanzo",
      coordinates: { latitude: 45.9789033, longitude: 9.0230975 }
    },
    currentLocation: { latitude: 45.9789033, longitude: 9.0230975 },
    vehicleType: VehicleType.MSB,
    radioName: "VOLLAN_731",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "21:00-6:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "ddec1776-8538-47b6-bfd2-000bb93a6a08",
    station: {
      name: "Volontari Ambulanze Angera Sez Sesto Calende",
      coordinates: { latitude: 45.7276866, longitude: 8.6502599 }
    },
    currentLocation: { latitude: 45.7276866, longitude: 8.6502599 },
    vehicleType: VehicleType.MSA1,
    radioName: "VA_007",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "e5d1d705-c4d7-4f46-9a05-a935baf8cff3",
    station: {
      name: "Volontari Ambulanze Angera Sez Sesto Calende",
      coordinates: { latitude: 45.7276866, longitude: 8.6502599 }
    },
    currentLocation: { latitude: 45.7276866, longitude: 8.6502599 },
    vehicleType: VehicleType.MSB,
    radioName: "VOLANG_103.03A2",
    convention: ConventionType.H12,
    schedule: {
      workingHours: "8:00-20:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "94b9d176-145b-4a8a-b549-9676e0ee5c57",
    station: {
      name: "Volontari Ambulanze Angera Sez Sesto Calende",
      coordinates: { latitude: 45.7276866, longitude: 8.6502599 }
    },
    currentLocation: { latitude: 45.7276866, longitude: 8.6502599 },
    vehicleType: VehicleType.MSB,
    radioName: "VOLANG+107",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "21:00-7:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "9eb05875-0c6f-45d1-bb41-0cab172612bc",
    station: {
      name: "Volontari Calolziocorte",
      coordinates: { latitude: 45.8033924, longitude: 9.4224543 }
    },
    currentLocation: { latitude: 45.8033924, longitude: 9.4224543 },
    vehicleType: VehicleType.MSB,
    radioName: "VOLCAL_106.05A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "73638fbc-b2cb-462e-b7a8-5e62f9a63d48",
    station: {
      name: "Volontari del soccorso Bellagio",
      coordinates: { latitude: 45.97689, longitude: 9.25868 }
    },
    currentLocation: { latitude: 45.97689, longitude: 9.25868 },
    vehicleType: VehicleType.MSB,
    radioName: "VOLBEL_107.03A1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "bf096cec-2449-4ddf-b0dc-176cf313f78e",
    station: {
      name: "Volontari del soccorso Faggeto Lario",
      coordinates: { latitude: 45.8581034, longitude: 9.1583425 }
    },
    currentLocation: { latitude: 45.8581034, longitude: 9.1583425 },
    vehicleType: VehicleType.MSB,
    radioName: "VOLFGT_161.03C1",
    convention: ConventionType.H24,
    schedule: {
      workingHours: "20:00-8:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "4e25f054-8585-4c46-b451-708ab51dfa97",
    station: {
      name: "Volontari Del Soccorso Veleso",
      coordinates: { latitude: 45.9081452, longitude: 9.1822873 }
    },
    currentLocation: { latitude: 45.9081452, longitude: 9.1822873 },
    vehicleType: VehicleType.MSB,
    radioName: "VOLVEL_301",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "19:00-00:00, SAB-DOM 8:00-16:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "d408a0c4-a850-4ac3-b371-08b3227a0e9d",
    station: {
      name: "HighCare",
      coordinates: { latitude: 45.5720112, longitude: 9.272325 }
    },
    currentLocation: { latitude: 45.5720112, longitude: 9.272325 },
    vehicleType: VehicleType.MSB,
    radioName: "HCR_MB_307",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "00:00-00:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "05239088-b48e-48ba-98c1-d60032c0d6bc",
    station: {
      name: "La Varesina Emergenza",
      coordinates: { latitude: 45.7453756, longitude: 8.7698675 }
    },
    currentLocation: { latitude: 45.7453756, longitude: 8.7698675 },
    vehicleType: VehicleType.MSB,
    radioName: "VARMOR_329",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "8:00-18:00",
      days: "LUN-DOM"
    }
  },
  {
    id: "898e2641-3849-41c1-bfaf-c91e7192eafa",
    station: {
      name: "Due Stelle Soccorso",
      coordinates: { latitude: 45.7024456, longitude: 9.1652485 }
    },
    currentLocation: { latitude: 45.7024456, longitude: 9.1652485 },
    vehicleType: VehicleType.MSB,
    radioName: "SOCMAR_ 311",
    convention: ConventionType.GET,
    schedule: {
      workingHours: "8:00-18:00",
      days: "LUN-VEN"
    }
  }
];
