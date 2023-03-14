import { db } from '../services/firebase-config';
import { query, where, getDocs, collection, writeBatch } from 'firebase/firestore';



export const markProductsAsReserved = (productIDS) => {
    const collectionRef = collection(db, 'products');
    const q = query(collectionRef, where("id", "in", productIDS));

    const batch = writeBatch(db);

    getDocs(q).then(
        (querySnapshot) => {
            querySnapshot.forEach((doc)=>{
                const docRef = doc.ref;
                batch.update(docRef, {stock: 0})
            })
            batch.commit().then((res)=>{
                console.log("Productos actualizados: ", productIDS)
            }).catch((err)=>{
                console.log(err)
            })
        }
    )  
}

export default markProductsAsReserved;
