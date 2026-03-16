import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const SUPABASE_URL = 'https://nrarikdgntzywumergvi.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ZzAMGFMNFAaCSp-LkQaWUw_vU2fOQ--';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
