const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
    const { data, error } = await supabase
        .from('hospitals')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error fetching from hospitals:', error.message);
    } else if (data && data.length > 0) {
        console.log('Columns in hospitals table:', Object.keys(data[0]).join(', '));
    } else {
        // If no data, try to get column names via RPC or just assume user is right
        console.log('No data in hospitals table to check columns.');
    }
}

checkColumns();
