// src/types/barber.types.ts

// 1. Public model
export interface PublicBarber {
    id: string;
    name: string;
    surname: string;
    // No phone ir order to conserve the privacy
  }
  
  // 2. Private model
  export interface PrivateBarber {
    id: string;
    name: string;
    surname: string;
    phone: string; 
    role: string;
    isActive: boolean;
  }
  