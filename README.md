# BarbApp Frontend (Mobile App)

[Español](#español) | [English](#english)

---

<a name="español"></a>
## Español

### Descripción
Cliente móvil nativo del ecosistema BarbApp, diseñado con React Native y Expo. Implementa una arquitectura de componentes y navegación por roles (Cliente, Barbero, Administrador) para interactuar fluidamente con la API REST central.

### Requisitos previos
* Node.js (versión LTS recomendada)
* Expo CLI
* Simulador iOS/Android o dispositivo físico con la app de "Expo Go" instalada.

### Instalación y Despliegue

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/databaandsc/BarbApp-Frontend.git](https://github.com/databaandsc/BarbApp-Frontend.git)
   cd BarbApp-Frontend
Instalar dependencias:
Navegar a la raíz del proyecto y ejecutar:

Bash
npm install
Configuración del Entorno:
Asegurarse de que el servidor Backend de BarbApp se encuentra en ejecución. Configurar las variables de entorno necesarias (por ejemplo, en un archivo .env o en la configuración del cliente), incluyendo la URL de conexión a la API (EXPO_PUBLIC_API_URL) y las claves públicas de Supabase (EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY).

Ejecutar la aplicación:

Bash
npx expo start
Escanea el código QR generado en la terminal con la aplicación Expo Go en tu dispositivo móvil, o pulsa "i" / "a" en tu teclado para abrir los simuladores de iOS o Android.

English
Description
The native mobile client of the BarbApp ecosystem, built with React Native and Expo. It implements a component-based architecture and role-based navigation (Client, Barber, Administrator) to interact seamlessly with the central REST API.

Prerequisites
Node.js (LTS version recommended)

Expo CLI

iOS/Android Simulator or a physical device with the "Expo Go" app installed.

Installation and Deployment
Clone the repository:

Bash
git clone [https://github.com/databaandsc/BarbApp-Frontend.git](https://github.com/databaandsc/BarbApp-Frontend.git)
cd BarbApp-Frontend
Install dependencies:
Navigate to the project root and run:

Bash
npm install
Environment Setup:
Ensure that the BarbApp Backend server is running. Configure the necessary environment variables (e.g., in a .env file or in your client configuration), including the API connection URL (EXPO_PUBLIC_API_URL) and the Supabase public keys (EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY).

Run the application:

Bash
npx expo start
Scan the QR code generated in the terminal with the Expo Go app on your mobile device, or press "i" / "a" on your keyboard to open the iOS or Android simulators.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
