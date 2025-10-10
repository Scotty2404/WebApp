import { HealthRecord } from "./health-record";

export interface Pet {
    id: number;
    name: string;
    species: string;
    breed?: string;
    birthDate: Date;
    healthRecords?: HealthRecord[];
}
