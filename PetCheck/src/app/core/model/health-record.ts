import { Diagnosis } from "./diagnosis";
import { Notes } from "./notes";

export interface HealthRecord {
    id: string;
    date: Date;
    wightKg?: number;
    vaccine?: string[];
    diagnosis?: Diagnosis[];
    notes?: Notes[];
}
