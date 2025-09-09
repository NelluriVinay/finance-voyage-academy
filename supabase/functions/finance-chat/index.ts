import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Fetch relevant financial data
    const financialContext = await getFinancialContext(supabase, userId);
    
    console.log('Sending request to OpenAI for finance chat with context');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a professional finance expert and advisor with access to comprehensive financial data. Your role is to provide helpful, accurate, and educational financial guidance.

Available Data Context:
${financialContext}

Key guidelines:
- Use the provided financial data to give contextual advice
- Provide clear, actionable financial advice based on available courses, expert insights, and market data
- Explain financial concepts in simple terms using examples from the available educational content
- Focus on budgeting, investing, saving, debt management, and financial planning
- Reference relevant courses or expert sessions when appropriate
- Always remind users that this is educational guidance and they should consult with licensed financial advisors for personalized advice
- Be encouraging and supportive while being realistic about financial challenges
- Use specific examples from the educational content when relevant
- If asked about investments, reference available courses or expert guidance

Keep responses concise but informative, typically 2-4 paragraphs unless more detail is specifically requested.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to get response from AI' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    const botResponse = data.choices[0].message.content;

    console.log('Successfully got response from OpenAI');

    return new Response(
      JSON.stringify({ response: botResponse }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in finance-chat function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function getFinancialContext(supabase: any, userId?: string) {
  try {
    // Fetch courses data
    const { data: courses } = await supabase
      .from('courses')
      .select('title, description, category, price_inr, instructor_name, learning_outcomes')
      .eq('is_active', true)
      .limit(10);

    // Fetch expert data
    const { data: experts } = await supabase
      .from('experts')
      .select('bio, specialization, experience_years, hourly_rate_inr')
      .eq('is_active', true)
      .eq('is_verified', true)
      .limit(5);

    // Fetch recent videos
    const { data: videos } = await supabase
      .from('videos')
      .select('title, description, category')
      .order('published_at', { ascending: false })
      .limit(10);

    // Fetch user's bookings if userId provided
    let userBookings = [];
    if (userId) {
      const { data: bookings } = await supabase
        .from('bookings')
        .select('scheduled_at, amount_inr, status, notes')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);
      userBookings = bookings || [];
    }

    // Get real-time market data (mock for now - you can integrate with actual APIs)
    const marketData = {
      nifty50: "Current trend: Market showing positive momentum",
      sensex: "Trading in green territory",
      goldPrice: "₹62,500 per 10g",
      silverPrice: "₹74,200 per kg"
    };

    return `
AVAILABLE COURSES:
${courses?.map(course => 
  `- ${course.title} (${course.category}): ${course.description?.substring(0, 100)}... Price: ₹${course.price_inr} by ${course.instructor_name}`
).join('\n') || 'No courses available'}

VERIFIED EXPERTS:
${experts?.map(expert => 
  `- Specialization: ${expert.specialization?.join(', ') || 'General'}, Experience: ${expert.experience_years} years, Rate: ₹${expert.hourly_rate_inr}/hour`
).join('\n') || 'No experts available'}

RECENT EDUCATIONAL VIDEOS:
${videos?.map(video => 
  `- ${video.title} (${video.category}): ${video.description?.substring(0, 80)}...`
).join('\n') || 'No videos available'}

${userId ? `
USER'S RECENT ACTIVITIES:
${userBookings.map(booking => 
  `- Session: ₹${booking.amount_inr}, Status: ${booking.status}, Scheduled: ${new Date(booking.scheduled_at).toLocaleDateString()}`
).join('\n') || 'No recent bookings'}
` : ''}

CURRENT MARKET INSIGHTS:
- Nifty 50: ${marketData.nifty50}
- Sensex: ${marketData.sensex}
- Gold: ${marketData.goldPrice}
- Silver: ${marketData.silverPrice}
`;
  } catch (error) {
    console.error('Error fetching financial context:', error);
    return 'Financial data currently unavailable';
  }
}