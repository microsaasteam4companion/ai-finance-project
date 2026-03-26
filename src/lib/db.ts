import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";

// Collection Names
export const COLLECTIONS = {
  USERS: "users",
  TRANSACTIONS: "transactions",
  BUDGETS: "budgets",
  SUBSCRIPTIONS: "subscriptions",
};

// User Profile
export const getProfile = async (userId: string) => {
  const docRef = doc(db, COLLECTIONS.USERS, userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const updateProfile = async (userId: string, data: any) => {
  const docRef = doc(db, COLLECTIONS.USERS, userId);
  await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
};

export const getPartner = async (householdId: string, currentUserId: string) => {
  const colRef = collection(db, COLLECTIONS.USERS);
  const q = query(colRef, where("household_id", "==", householdId));
  const querySnapshot = await getDocs(q);
  const partners = querySnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(p => p.id !== currentUserId);
  return partners.length > 0 ? partners[0] : null;
};

// Transactions
export const getTransactions = async (userId: string) => {
  const colRef = collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.TRANSACTIONS);
  const q = query(colRef, orderBy("date", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
};

export const addTransaction = async (userId: string, data: any) => {
  const colRef = collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.TRANSACTIONS);
  return await addDoc(colRef, { ...data, createdAt: serverTimestamp() });
};

export const updateTransaction = async (userId: string, transactionId: string, data: any) => {
  const docRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.TRANSACTIONS, transactionId);
  await updateDoc(docRef, data);
};

export const deleteTransaction = async (userId: string, transactionId: string) => {
  const docRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.TRANSACTIONS, transactionId);
  await deleteDoc(docRef);
};

// Budgets
export const getBudgets = async (userId: string) => {
  const colRef = collection(db, "users", userId, "budgets");
  const querySnapshot = await getDocs(colRef);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
};

export const getBudgetByCategory = async (userId: string, category: string) => {
  const docRef = doc(db, "users", userId, "budgets", category.toLowerCase());
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const setBudget = async (userId: string, category: string, amount: number) => {
  const docRef = doc(db, "users", userId, "budgets", category.toLowerCase());
  await setDoc(docRef, { 
    category, 
    limit_amount: amount, 
    updatedAt: serverTimestamp() 
  }, { merge: true });
};

// Subscriptions
export const getSubscriptions = async (userId: string) => {
  const colRef = collection(db, "users", userId, "subscriptions");
  const querySnapshot = await getDocs(colRef);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
};
