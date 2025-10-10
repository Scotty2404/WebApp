import { Diagnosis } from "./diagnosis";
import { Notes } from "./notes";

export interface HealthRecord {
    id: number;
    date: Date;
    wightKg?: number;
    vaccine?: string[];
    diagnosis?: Diagnosis[];
    notes?: Notes[];
}
