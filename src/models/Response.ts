export class EventData {
  public Device: string;
  public Timestamp: number;
  public Timestamp_date: string;
  public Timestamp_time: string;
  public StatusCode: number;
  public StatusCode_hex: string;
  public StatusCode_desc: string;
  public GPSPoint: string;
  public GPSPoint_lat: number;
  public GPSPoint_lon: number;
  public GPSPoint_age: number;
  public Speed: number;
  public Speed_units: string;
  public Heading: number;
  public Heading_desc: string;
  public Altitude: number;
  public Altitude_units: string;
  public Odometer: number;
  public Odometer_units: string;
  public Geozone: string;
  public Geozone_index: number;
  public Address: string;
  public City: string;
  public PostalCode: string;
  public DigitalInputMask: number;
  public DigitalInputMask_hex: string;
  public EngineRPM: number;
  public EngineHours: number;
  public VehicleBatteryVolts: number;
  public EngineCoolantLevel: number;
  public EngineCoolantLevel_units: string;
  public EngineCoolantTemperature: number;
  public EngineCoolantTemperature_units: string;
  public EngineFuelUsed: number;
  public EngineFuelUsed_units: string;
  public Index: number;
  public markerDescription: string;
  public isActive: boolean;
  public icon?: object = {};
  public distanceBetween?:number;
}

export class DeviceList {
  public Device: string;
  public Device_desc: string;
  public VehicleID: string;
  public State: string;
  public LastNotifyText: string;
  public LastTimestamp: string;
  public LastGPSTimestamp: number;
  public DeviceCode: string;
  public lastEngineHours: number;
  public FuelLevel: number;
  public FuelTotal: number;
  public simPhoneNumber: string;
  public EventData: EventData[];
  //
}

export class DataModel {
  public Account: string;
  public Account_desc: string;
  public TimeZone: string;
  public DeviceList: DeviceList[];
  //2nd param
  public consomFuelL: number;
  public consomFuelPr: number;
  public maxspeed: number;
  public KM: number;
  public KMtotal: number;
  public minStop: number;
  public minOn: number;
  public minMarche: number;
  public minDemarrage: number;
  public Costfuel: number;
}
export class marker {
  lat?: number;
  lng?: number;
  address?:string;
  icon?:any;
}

export class AgmOpt {
  fitbounds?: boolean;
  latitude?: number;
  longitude?: number;
  maxZoom?: number;
  minZoom?: number;
  zoom?: number;
  disableDefaultUI: boolean;
  styles: any[];
}
