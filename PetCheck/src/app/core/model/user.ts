import { Pet } from "./pet";

export interface User {
    id: string;
    name: string;
    email: string;
    pushToken?: string;
}
