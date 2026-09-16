import type { FirebaseApp } from 'firebase/app';
import type { Auth, Persistence } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { Functions } from 'firebase/functions';

/**
 * Firebase modules loaded through Metro with Auth registered before App.
 * Static imports of firebase/app can load before Auth registers on React Native.
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const firebaseAuthModule = require('firebase/auth');
const firebaseAppModule = require('firebase/app');
const firebaseFirestoreModule = require('firebase/firestore');
const firebaseFunctionsModule = require('firebase/functions');
const firebaseAnalyticsModule = require('firebase/analytics');
/* eslint-enable @typescript-eslint/no-require-imports */

export const initializeAuth = firebaseAuthModule.initializeAuth as typeof import('firebase/auth').initializeAuth;
export const getAuth = firebaseAuthModule.getAuth as typeof import('firebase/auth').getAuth;
export const getReactNativePersistence = firebaseAuthModule.getReactNativePersistence as (storage: {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}) => Persistence;

export const initializeApp = firebaseAppModule.initializeApp as typeof import('firebase/app').initializeApp;
export const getApps = firebaseAppModule.getApps as typeof import('firebase/app').getApps;
export const getApp = firebaseAppModule.getApp as typeof import('firebase/app').getApp;

export const initializeFirestore =
  firebaseFirestoreModule.initializeFirestore as typeof import('firebase/firestore').initializeFirestore;
export const persistentLocalCache =
  firebaseFirestoreModule.persistentLocalCache as typeof import('firebase/firestore').persistentLocalCache;
export const memoryLocalCache =
  firebaseFirestoreModule.memoryLocalCache as typeof import('firebase/firestore').memoryLocalCache;

export const getFunctions =
  firebaseFunctionsModule.getFunctions as typeof import('firebase/functions').getFunctions;

export const connectAuthEmulator =
  firebaseAuthModule.connectAuthEmulator as typeof import('firebase/auth').connectAuthEmulator;
export const connectFirestoreEmulator =
  firebaseFirestoreModule.connectFirestoreEmulator as typeof import('firebase/firestore').connectFirestoreEmulator;
export const connectFunctionsEmulator =
  firebaseFunctionsModule.connectFunctionsEmulator as typeof import('firebase/functions').connectFunctionsEmulator;

export const httpsCallable =
  firebaseFunctionsModule.httpsCallable as typeof import('firebase/functions').httpsCallable;

export const getAnalytics =
  firebaseAnalyticsModule.getAnalytics as typeof import('firebase/analytics').getAnalytics;
export const initializeAnalytics =
  firebaseAnalyticsModule.initializeAnalytics as typeof import('firebase/analytics').initializeAnalytics;
export const isSupported =
  firebaseAnalyticsModule.isSupported as typeof import('firebase/analytics').isSupported;
export const logEvent =
  firebaseAnalyticsModule.logEvent as typeof import('firebase/analytics').logEvent;

export const signInAnonymously =
  firebaseAuthModule.signInAnonymously as typeof import('firebase/auth').signInAnonymously;
export const onAuthStateChanged =
  firebaseAuthModule.onAuthStateChanged as typeof import('firebase/auth').onAuthStateChanged;

export const doc = firebaseFirestoreModule.doc as typeof import('firebase/firestore').doc;
export const collection = firebaseFirestoreModule.collection as typeof import('firebase/firestore').collection;
export const getDoc = firebaseFirestoreModule.getDoc as typeof import('firebase/firestore').getDoc;
export const setDoc = firebaseFirestoreModule.setDoc as typeof import('firebase/firestore').setDoc;
export const deleteDoc = firebaseFirestoreModule.deleteDoc as typeof import('firebase/firestore').deleteDoc;
export const getDocs = firebaseFirestoreModule.getDocs as typeof import('firebase/firestore').getDocs;
export const query = firebaseFirestoreModule.query as typeof import('firebase/firestore').query;
export const where = firebaseFirestoreModule.where as typeof import('firebase/firestore').where;
export const orderBy = firebaseFirestoreModule.orderBy as typeof import('firebase/firestore').orderBy;

export type { Auth, Persistence, User } from 'firebase/auth';
export type { FirebaseApp } from 'firebase/app';
export type { Firestore, DocumentReference, DocumentData } from 'firebase/firestore';
export type { Functions } from 'firebase/functions';
