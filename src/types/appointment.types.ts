/**
 * Mirror of the backend 'AppointmentResponseDTO' record.
 * Handles the data returned from the Spring Boot API.
 */

export interface AppointmentResponse {
    id: string;
    clientId: string;
    barberId: string;
    startAt: string; 
    endAt: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'; 
    totalPrice: number;
    totalDurationMinutes: number;
    clientNotes: string;
  }
  