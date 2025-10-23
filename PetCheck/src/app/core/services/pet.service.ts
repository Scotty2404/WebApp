import { inject, Injectable } from "@angular/core";
import { Auth } from "@angular/fire/auth";
import { addDoc, collection, Firestore, doc, updateDoc, deleteDoc, collectionData } from "@angular/fire/firestore";
import { Pet } from "../model/pet";


@Injectable({ providedIn: 'root' })
export class PetService {
    private firestore = inject(Firestore);
    private auth = inject(Auth);

    async addPet(pet: Omit<Pet, 'id' | 'ownerId'>) {
        const user = this.auth.currentUser;
        if(!user) throw new Error('Currently not lodded in');

        const ref = collection(this.firestore, `users/${user.uid}/pets`);
        await addDoc(ref, { ...pet, ownerId: user.uid });
    }

    async updatePet(pet: Pet) {
        const user = this.auth.currentUser;
        if(!user) throw new Error('Currently not lodded in');

        const petDoc = doc(this.firestore, `users/${user.uid}/pets/${pet.id}`);
        await updateDoc(petDoc, { ...pet });
    }

    async deletePet(petId: string) {
        const user = this.auth.currentUser;
        if(!user) throw new Error('Currently not lodded in');

        const petDoc = doc(this.firestore, `users/${user.uid}/pets/${petId}`);
        await deleteDoc(petDoc);
    }
}