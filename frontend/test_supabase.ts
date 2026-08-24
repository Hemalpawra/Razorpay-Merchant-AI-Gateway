import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = Object.fromEntries(
  envFile.split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => {
      const parts = line.split('=');
      return [parts[0], parts.slice(1).join('=')];
    })
);

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing connection to Supabase...');
  
  const { data, error } = await supabase.from('merchants').select('*').limit(1);
  
  if (error) {
    console.error('Connection or query error:', error.message);
    if (error.code === 'PGRST116' || error.message.includes('relation "public.merchants" does not exist')) {
        console.error('\nResult: The database is reachable, but the tables do NOT exist yet. The migration has not been applied.');
    } else {
        console.error('\nResult: There was an error connecting to Supabase.');
    }
  } else {
    console.log('Successfully queried merchants table. Data:', data);
    console.log('\nResult: YES! Supabase is fully connected and the schema migrations have been applied!');
  }
}

testConnection();
