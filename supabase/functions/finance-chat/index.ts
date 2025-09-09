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

    // Fetch relevant financial data
    const financialContext = await getFinancialContext(supabase, userId);
    
    console.log('Processing finance chat with custom AI');

    // Use custom finance AI instead of OpenAI
    const botResponse = await generateFinanceResponse(message, financialContext);

    console.log('Successfully generated custom finance response');

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

async function generateFinanceResponse(message: string, context: string) {
  const lowerMessage = message.toLowerCase();
  
  // Finance knowledge base
  const financeKnowledge = {
    budgeting: {
      keywords: ['budget', 'budgeting', 'expense', 'spending', 'money management', 'track expenses'],
      response: `📊 **Budgeting Fundamentals**

Creating a budget is the foundation of financial health. Here's the 50/30/20 rule:
• **50%** for needs (rent, groceries, utilities)
• **30%** for wants (entertainment, dining out)
• **20%** for savings and debt payments

**Quick Tips:**
• Track expenses for a month to understand spending patterns
• Use apps or spreadsheets to monitor daily expenses
• Review and adjust monthly
• Pay yourself first - save before spending

${context.includes('AVAILABLE FINANCIAL EDUCATION') ? '\n💡 Check our budgeting courses for detailed guidance!' : ''}`
    },
    investing: {
      keywords: ['invest', 'investment', 'stocks', 'mutual funds', 'sip', 'portfolio', 'market', 'equity'],
      response: `📈 **Smart Investing for Indians**

**Start with these basics:**
• **SIP in Mutual Funds** - Start with ₹1,000/month
• **Diversify**: Equity (60%) + Debt (30%) + Gold (10%)
• **Emergency Fund First** - 6-12 months expenses
• **Long-term mindset** - Stay invested for 5+ years

**Popular Options:**
• Index funds (low cost, market returns)
• Large-cap equity funds (stable growth)
• PPF for tax savings (15-year lock-in)
• ELSS for tax deduction under 80C

${context.includes('VERIFIED FINANCIAL EXPERTS') ? '\n👨‍💼 Book a session with our certified experts for personalized advice!' : ''}`
    },
    savings: {
      keywords: ['save', 'saving', 'emergency fund', 'fixed deposit', 'fd', 'savings account'],
      response: `💰 **Building Your Savings**

**Emergency Fund Priority:**
• Target: 6-12 months of expenses
• Keep in liquid savings account or short-term FDs
• Don't invest emergency money in markets

**Savings Ladder:**
1. **High-yield savings** (3-4% returns)
2. **Fixed Deposits** (5-7% returns, safe)
3. **Debt mutual funds** (6-8% returns, low risk)
4. **PPF** (7-8% returns, tax-free, 15-year lock)

**Pro Tip:** Automate savings on salary day - treat it like a non-negotiable expense!

${context.includes('Current trend showing positive momentum') ? '\n📊 Markets are positive - good time to start SIPs!' : ''}`
    },
    debt: {
      keywords: ['debt', 'loan', 'credit card', 'emi', 'personal loan', 'home loan'],
      response: `💳 **Debt Management Strategy**

**Priority Order (Highest interest first):**
1. **Credit Cards** (18-48% interest) - Pay off immediately
2. **Personal Loans** (10-15% interest)
3. **Car Loans** (8-12% interest)
4. **Home Loans** (8-10% interest) - Lowest priority

**Smart Strategies:**
• Pay more than minimum on credit cards
• Consider debt consolidation for multiple loans
• Use balance transfer for credit card debt
• Never withdraw cash from credit cards

**Golden Rule:** If investment returns < loan interest rate, pay off debt first!

${context.includes('Educational courses available') ? '\n📚 Explore our debt management courses for detailed strategies!' : ''}`
    },
    tax: {
      keywords: ['tax', 'tax saving', '80c', 'income tax', 'deduction', 'tax planning'],
      response: `📋 **Tax Saving Guide (India)**

**Section 80C Investments (₹1.5L limit):**
• **ELSS Mutual Funds** (3-year lock, market returns)
• **PPF** (15-year lock, 7-8% tax-free returns)
• **EPF** (Employer contribution counts)
• **Life Insurance Premium**
• **Home Loan Principal**

**Other Deductions:**
• **80D**: Health insurance (₹25K-₹50K)
• **80E**: Education loan interest (no limit)
• **80G**: Donations to charity

**Tax-Free Investments:**
• PPF returns are completely tax-free
• ELSS gains above ₹1L are taxed at 10%

Start tax planning in April, not March!`
    },
    retirement: {
      keywords: ['retirement', 'pension', 'retirement planning', 'old age', 'corpus'],
      response: `🏖️ **Retirement Planning**

**Target Corpus Calculation:**
• Current monthly expenses × 12 × 25-30 times
• Example: ₹50K/month = ₹1.5-2 Crores needed

**Investment Mix by Age:**
• **20s-30s**: 80% equity, 20% debt
• **40s**: 60% equity, 40% debt  
• **50s+**: 40% equity, 60% debt

**Retirement Vehicles:**
• **NPS** (National Pension System) - Tax benefits + low cost
• **PPF** - 15-year cycles, tax-free
• **Equity SIPs** - Long-term wealth creation
• **EPF** - Employer matching, stable returns

**Start Early Advantage:** ₹5K/month from age 25 = ₹4+ Crores by 60!`
    },
    insurance: {
      keywords: ['insurance', 'term insurance', 'health insurance', 'life insurance'],
      response: `🛡️ **Insurance Essentials**

**Life Insurance:**
• **Term Insurance Only** - 10-15x annual income
• Avoid endowment/ULIP plans
• Buy when young for lower premiums
• Separate insurance from investment

**Health Insurance:**
• **Family Floater**: ₹5-10L minimum
• **Top-up Plans**: Additional ₹10-20L coverage
• Check cashless network hospitals
• Read exclusions carefully

**Key Insurance Rules:**
• Insurance is protection, not investment
• Higher coverage > fancy features  
• Review and increase coverage annually
• Inform nominees about all policies

**Don't Over-insure:** Single people need less life insurance than families.`
    }
  };

  // Find matching topic
  let bestMatch = null;
  let maxMatches = 0;

  for (const [topic, data] of Object.entries(financeKnowledge)) {
    const matches = data.keywords.filter(keyword => lowerMessage.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      bestMatch = topic;
    }
  }

  // Generate response
  if (bestMatch && maxMatches > 0) {
    return financeKnowledge[bestMatch].response;
  }

  // Default response for general queries
  return `🎯 **WealthWise Academy Finance Assistant**

I can help you with:
• **💰 Budgeting & Expense Tracking**
• **📈 Investing (SIP, Mutual Funds, Stocks)**
• **💳 Debt Management & Credit Cards** 
• **🏛️ Tax Saving (80C, ELSS, PPF)**
• **🏖️ Retirement Planning**
• **🛡️ Insurance (Term, Health)**

${context.includes('AVAILABLE FINANCIAL EDUCATION') ? '\n📚 **Available Resources:**\nWe have expert courses and certified financial advisors to help you build wealth systematically.\n' : ''}

**Current Market:** Indian markets showing positive momentum - good time to start your investment journey!

**Quick Tip:** Start with emergency fund → SIP in index funds → gradually increase investments.

What specific area would you like to explore? Just ask about budgeting, investing, taxes, or any other finance topic!`;
}

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