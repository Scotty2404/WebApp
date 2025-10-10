import { Pet } from "./pet";

export interface User {
    id: number;
    name: string;
    pets: Pet[];
    pushToken?: string;
}
