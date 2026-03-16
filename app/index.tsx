import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to the login screen upon application startup
  return <Redirect href="/(auth)/login" />;
}
