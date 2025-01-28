const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://hwunengquaszlffaflum.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3dW5lbmdxdWFzemxmZmFmbHVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNzUwOTQsImV4cCI6MjA1MzY1MTA5NH0.TLQVvSNFvGtwjs0Jr8KOoAnKakHGdC0r4R9voEQDzgI'; // Replace with your Supabase anon key
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
    try {
        // Get the URL with the least redirects
        const { data, error } = await supabase
            .from('redirects')
            .select('*')
            .order('count', { ascending: true })
            .limit(1);

        if (error || data.length === 0) {
            console.error('Error fetching data:', error);
            res.statusCode = 500;
            res.end('Internal Server Error');
            return;
        }

        const selectedRedirect = data[0];

        // Increment the count for the selected URL
        const { error: updateError } = await supabase
            .from('redirects')
            .update({ count: selectedRedirect.count + 1 })
            .eq('id', selectedRedirect.id);

        if (updateError) {
            console.error('Error updating count:', updateError);
            res.statusCode = 500;
            res.end('Internal Server Error');
            return;
        }

        // Redirect to the selected URL
        res.writeHead(302, { Location: selectedRedirect.url });
        res.end();
    } catch (err) {
        console.error('Unexpected error:', err);
        res.statusCode = 500;
        res.end('Internal Server Error');
    }
};
