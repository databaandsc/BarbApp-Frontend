/**
 * Mirror of the backend 'AppointmentResponseDTO' record.
 * Handles the data returned from the Spring Boot API.
 */

export interface AppointmentResponse {
    id: string;
    clientId: string;
    clientName: string;
    barberId: string;
    barberName: string;
    startAt: string; 
    endAt: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
    totalPrice: number;
    totalDurationMinutes: number;
    clientNotes: string;
  }
  