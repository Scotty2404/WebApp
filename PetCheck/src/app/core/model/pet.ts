import { Timestamp } from "@angular/fire/firestore";
import { HealthRecord } from "./health-record";

export interface Pet {
    id?: string;
    ownerId?: string,
    name: string;
    //species: string;
    //breed?: string;
    //birthDate: Timestamp;
    //healthRecords?: HealthRecord[];
}
