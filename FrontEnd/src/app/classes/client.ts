export class client{
    ID: number;
    Name: string;
    Long: string; // Consider renaming this to something else since you'll add LAT and LNG
    Status: string;
    falling: String;
    LAT: number; // Optional properties for latitude
    LNG: number; // Optional properties for longitude
    constructor(ID, Name, Long, Status, LAT, LNG) {
        this.ID = ID;
        this.Name = Name;
        this.Long = Long;
        this.Status = Status;
        this.LAT = LAT;
        this.LNG = LNG;
    }
}
export class clientrequest{
    Long: string;
    Status: string;
    falling:String;
    constructor(Long,Status,falling){
        this.Long = Long;
        this.Status=Status;
        this.falling=falling;
    }
}
export class Rapportvalues{
    Lat:number;
    Lang:number;
    Status:string;
    constructor(Lat,Lang,Status){
        this.Lang=Lang;
        this.Lat=Lat;
        this.Status=Status;
    }

}
