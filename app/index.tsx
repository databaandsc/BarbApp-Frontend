import { Redirect } from 'expo-router';

/**
 * Root Entry Point (Redirect)
 * 
 * This file serves as the initial route. Instead of rendering content, 
 * it immediately redirects the user to the Authentication flow.
 * In a future stage, this will include logic to check for a valid session token 
 * and redirect users to either 'Login' or the 'Home' dashboard.
 */

export default function Index() {
  return <Redirect href="/(auth)/login" />;
}
