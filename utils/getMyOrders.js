import { db } from '../services/firebase-config';
import { collection, getDocs } from 'firebase/firestore';



export const getMyOrders = (user, onGet) => {
  const clothesRef= collection(db, user.uid, 'orders', 'all');
  getDocs(clothesRef).then(
    (snapshot)=>{
      let orders = [];
      snapshot.forEach(
        (doc) => {
          orders.push({uid: doc.id, ...doc.data()}) 
        }
      )
      onGet(orders)
    }
  );
}

export default getMyOrders;
