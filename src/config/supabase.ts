import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

/**
 * Supabase Client Configuration
 * 
 * This module initializes the connection to the Supabase backend.
 * Uses react-native-url-polyfill/auto to ensure full compatibility with URL standards
 * within the React Native environment, which is essential for Supabase Auth flows.
 */

const SUPABASE_URL = 'https://nrarikdgntzywumergvi.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ZzAMGFMNFAaCSp-LkQaWUw_vU2fOQ--';

// Create and export a singleton instance of the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
