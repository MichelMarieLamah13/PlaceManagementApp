export class EventData1 {

    //
    public Device: string;
    public Timestamp: number;
    public StatusCode: number;
    public GPSPoint: string;
    public GPSPoint_lat: number;
    public GPSPoint_lon: number;
    public GPSPoint_age: number;
    public Speed: number;
    public Odometer: number;
    public Geozone: string;
    public Geozone_index: number;
    public Address: string;
    public acceleration: number;
    public FuelLevel_Liter: number;
    public FuelLevel_Perc: number;
    public ThermoAverage_C: number;
    public EngineFuelUsed_Liter: number;
    public Index: number;
    public icon?:object={};
}

export class DeviceList1 {
    public Device: string;
    public Device_desc: string;
    public length: number;
    public timestamp: number;
    public speed: number;
    public Adresse: string;
    public Statucode: number;
    public LastTime: string;
    public SimCard: string;
    public Icon: string;
    public DeviceCode: string;
    public EventData: EventData1[];
    //
}

export class Response1 {
    public Account: string;
    public Account_desc: string;
    public TimeZone: string;
    public DeviceList: DeviceList1[];
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
export class tableModel {
    public start: number;
    public initialPosition: string;
    public final: number;
    public finalPosition: string;
    public duration: string;
    public distance: number;
}