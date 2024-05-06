import { Date } from "./date";

export class Report{
    Name: string;
    Date: Date;
    ID: number;
    Status:string;
    month :string;
    year :number;
    Hours:string;
    Day:number
    constructor( ID, Name, Date, Status,Day,Hours,month,year){
        this.Name = Name;
        this.Date = Date;
        this.ID = ID;
        this.Status=Status;
        this.Day=Day;
        this.month=month;
        this.Hours=Hours;
        this.year=year;
    }
}   
