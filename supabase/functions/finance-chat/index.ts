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
    
    console.log('OpenAI API Key exists:', !!openAIApiKey);
    
    if (!openAIApiKey) {
      console.error('OpenAI API key not found in environment variables');
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

    console.log('OpenAI response status:', response.status);
    console.log('OpenAI response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error details:', {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData
      });
      return new Response(
        JSON.stringify({ 
          error: 'Failed to get response from AI',
          details: `OpenAI API returned ${response.status}: ${errorData}`
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    console.log('OpenAI response structure:', {
      hasChoices: !!data.choices,
      choicesLength: data.choices?.length,
      hasMessage: !!data.choices?.[0]?.message,
      hasContent: !!data.choices?.[0]?.message?.content
    });
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
    console.log('Fetching financial context...');
    
    // Fetch courses data
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('title, description, category, price_inr, instructor_name, learning_outcomes')
      .eq('is_active', true)
      .limit(10);

    if (coursesError) {
      console.error('Error fetching courses:', coursesError);
    }

    // Fetch expert data
    const { data: experts, error: expertsError } = await supabase
      .from('experts')
      .select('bio, specialization, experience_years, hourly_rate_inr')
      .eq('is_active', true)
      .eq('is_verified', true)
      .limit(5);

    if (expertsError) {
      console.error('Error fetching experts:', expertsError);
    }

    // Fetch recent videos
    const { data: videos, error: videosError } = await supabase
      .from('videos')
      .select('title, description, category')
      .order('published_at', { ascending: false })
      .limit(10);

    if (videosError) {
      console.error('Error fetching videos:', videosError);
    }

    // Fetch user's bookings if userId provided
    let userBookings = [];
    if (userId) {
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('scheduled_at, amount_inr, status, notes')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
      } else {
        userBookings = bookings || [];
      }
    }

    console.log('Successfully fetched financial context');

    // Get basic market data context
    const marketData = {
      nifty50: "Current trend showing positive momentum in Indian markets",
      sensex: "Trading in positive territory with good fundamentals",
      goldPrice: "₹62,500 per 10g (approximate current rate)",
      silverPrice: "₹74,200 per kg (approximate current rate)"
    };

    return `
AVAILABLE FINANCIAL EDUCATION:
${courses?.length ? courses.map(course => 
  `- ${course.title} (${course.category || 'General'}): ${course.description?.substring(0, 100) || 'Financial course'}... Price: ₹${course.price_inr} by ${course.instructor_name || 'Expert'}`
).join('\n') : 'Educational courses available on the platform'}

VERIFIED FINANCIAL EXPERTS:
${experts?.length ? experts.map(expert => 
  `- Specialization: ${expert.specialization?.join(', ') || 'Financial Planning'}, Experience: ${expert.experience_years || 'Multiple'} years, Rate: ₹${expert.hourly_rate_inr || 'Contact for rates'}/hour`
).join('\n') : 'Certified financial experts available for consultation'}

RECENT EDUCATIONAL CONTENT:
${videos?.length ? videos.map(video => 
  `- ${video.title} (${video.category || 'Finance'}): ${video.description?.substring(0, 80) || 'Educational content'}...`
).join('\n') : 'Educational videos covering various financial topics'}

${userId && userBookings.length ? `
YOUR RECENT ACTIVITIES:
${userBookings.map(booking => 
  `- Session: ₹${booking.amount_inr}, Status: ${booking.status}, Scheduled: ${new Date(booking.scheduled_at).toLocaleDateString()}`
).join('\n')}
` : ''}

CURRENT MARKET CONTEXT:
- Nifty 50: ${marketData.nifty50}
- Sensex: ${marketData.sensex}
- Gold: ${marketData.goldPrice}
- Silver: ${marketData.silverPrice}

Note: This platform offers comprehensive financial education through courses, expert consultations, and educational content.
`;
  } catch (error) {
    console.error('Error in getFinancialContext:', error);
    return `Financial education platform with courses, expert consultations, and market insights available. 
Current market showing positive trends with gold around ₹62,500/10g and active trading in Indian markets.`;
  }
}