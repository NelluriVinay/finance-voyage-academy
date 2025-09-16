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
  
  // Comprehensive Finance knowledge base
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
    stockmarket: {
      keywords: ['stock market', 'nifty', 'sensex', 'shares', 'trading', 'bse', 'nse', 'ipo', 'dividend'],
      response: `📈 **Indian Stock Market Guide**

**Major Indices:**
• **Nifty 50**: Top 50 companies by market cap
• **Sensex**: 30 largest companies on BSE
• **Bank Nifty**: Banking sector index
• **Nifty Midcap/Smallcap**: Mid and small companies

**Trading vs Investing:**
• **Trading**: Short-term (days/weeks) - High risk
• **Investing**: Long-term (years) - Lower risk
• **SIP**: Systematic monthly investing

**Stock Selection Basics:**
• Check P/E ratio (Price to Earnings)
• Look at debt-to-equity ratio
• Analyze revenue growth
• Read annual reports

**Risk Management:**
• Never put all money in one stock
• Diversify across sectors
• Set stop-loss limits
• Invest only surplus money

**Current Market:** Nifty trading around 21,000-22,000 levels with positive momentum.`
    },
    banking: {
      keywords: ['bank', 'banking', 'account', 'loan', 'credit', 'debit', 'rtgs', 'neft', 'upi'],
      response: `🏦 **Banking Essentials**

**Account Types:**
• **Savings**: 3-4% interest, high liquidity
• **Current**: For business, no interest
• **FD**: 5-7% fixed returns, locked period
• **RD**: Monthly deposits, fixed returns

**Digital Banking:**
• **UPI**: Instant transfers, 24/7 available
• **NEFT**: Up to ₹10L, charges apply
• **RTGS**: Above ₹2L, real-time settlement
• **IMPS**: Immediate transfers, 24/7

**Credit Products:**
• **Personal Loan**: 10-15% interest, unsecured
• **Home Loan**: 8-10% interest, longest tenure
• **Car Loan**: 8-12% interest, asset-backed
• **Credit Card**: 18-48% interest, revolving credit

**Banking Tips:**
• Maintain minimum balance to avoid charges
• Use ATMs of your bank to avoid fees
• Enable SMS/email alerts for transactions
• Keep KYC documents updated

**Interest Rates:** Current repo rate is 6.5%, affecting all loan rates.`
    },
    crypto: {
      keywords: ['crypto', 'cryptocurrency', 'bitcoin', 'ethereum', 'blockchain', 'digital currency'],
      response: `₿ **Cryptocurrency in India**

**Current Legal Status:**
• Cryptocurrencies are legal in India
• 30% tax on crypto gains + 1% TDS
• No set-off of losses allowed
• Treated as digital assets, not currency

**Popular Cryptocurrencies:**
• **Bitcoin (BTC)**: First and largest crypto
• **Ethereum (ETH)**: Smart contract platform
• **Binance Coin (BNB)**: Exchange token
• **Cardano (ADA)**: Proof-of-stake blockchain

**Investment Approach:**
• Start with small amounts (1-5% of portfolio)
• Focus on established coins (BTC, ETH)
• Use reputable Indian exchanges (WazirX, CoinDCX)
• Never invest more than you can afford to lose

**Risks:**
• Extremely volatile (50%+ swings)
• Regulatory uncertainty
• Technical risks (wallet security)
• No consumer protection

**Current Trend:** Crypto markets showing institutional adoption but remain highly volatile.`
    },
    realEstate: {
      keywords: ['real estate', 'property', 'house', 'flat', 'rent', 'rera', 'home buying'],
      response: `🏠 **Real Estate Investment**

**Home Buying Process:**
• Check RERA registration
• Verify clear title documents
• Get legal verification done
• Arrange home loan pre-approval

**Investment Types:**
• **Residential**: Flats, houses for rental income
• **Commercial**: Offices, shops for business rental
• **REITs**: Real Estate Investment Trusts (stock-like)
• **Land**: Raw land for appreciation

**Financing Options:**
• **Home Loan**: Up to 80% property value, 8-10% interest
• **Down Payment**: Minimum 20% of property value
• **EMI Calculation**: Use 40% of income rule
• **Stamp Duty**: 4-10% depending on state

**Key Considerations:**
• Location and connectivity
• Builder reputation and track record
• Possession timeline
• Hidden costs (maintenance, taxes)

**Current Market:** Property prices stable with good financing options available.`
    },
    mutualFunds: {
      keywords: ['mutual fund', 'sip', 'nav', 'aum', 'expense ratio', 'fund house'],
      response: `💼 **Mutual Funds Mastery**

**Fund Categories:**
• **Equity Funds**: High risk, high returns (12-15% historical)
• **Debt Funds**: Low risk, stable returns (6-8%)
• **Hybrid Funds**: Mix of equity and debt (8-12%)
• **Index Funds**: Track market indices (low cost)

**Popular Fund Houses:**
• SBI Mutual Fund, HDFC AMC, ICICI Prudential
• Axis Mutual Fund, Kotak Mahindra AMC
• DSP Investment Managers, UTI AMC

**SIP Strategy:**
• Start with ₹1,000/month in diversified equity fund
• Increase SIP by 10% annually
• Continue for minimum 5-7 years
• Don't stop during market downturns

**Key Metrics:**
• **NAV**: Net Asset Value (price per unit)
• **Expense Ratio**: Annual fee (0.5-2.5%)
• **AUM**: Assets Under Management (fund size)
• **Returns**: 1Y, 3Y, 5Y performance

**Tax Benefits:**
• ELSS funds offer 80C deduction
• Long-term gains above ₹1L taxed at 10%
• No TDS on mutual fund investments`
    },
    goldSilver: {
      keywords: ['gold', 'silver', 'precious metals', 'gold etf', 'digital gold'],
      response: `🥇 **Gold & Silver Investment**

**Investment Options:**
• **Physical Gold**: Jewelry, coins, bars
• **Gold ETF**: Exchange-traded funds
• **Digital Gold**: Apps like Paytm Gold, PhonePe
• **Gold Mutual Funds**: Fund of funds investing in Gold ETF

**Current Rates:**
• **Gold**: ₹62,500-65,000 per 10 grams
• **Silver**: ₹74,000-78,000 per kg
• Prices vary with international rates and GST

**Allocation Strategy:**
• Keep 5-10% portfolio in gold
• Buy during festivals for better rates
• Prefer ETF/Digital over physical for investment
• Physical gold for emergency purposes

**Tax Implications:**
• Physical gold: 20% LTCG after indexation (3+ years)
• Gold ETF: 10% LTCG without indexation (1+ year)
• GST: 3% on gold, 3% on silver

**Market Factors:**
• International gold prices
• Dollar strength/weakness
• Inflation rates
• Central bank policies`
    },
    insurance: {
      keywords: ['insurance', 'term insurance', 'health insurance', 'life insurance'],
      response: `🛡️ **Comprehensive Insurance Guide**

**Life Insurance:**
• **Term Insurance**: 10-15x annual income coverage
• **Endowment**: Avoid - poor returns
• **ULIP**: Avoid - high charges
• **Start early**: Lower premiums for life

**Health Insurance:**
• **Individual**: ₹5-10L basic coverage
• **Family Floater**: ₹10-15L for family
• **Super Top-up**: Additional ₹20-50L coverage
• **Critical Illness**: Covers 30+ diseases

**Other Insurance:**
• **Motor Insurance**: Mandatory third-party + comprehensive
• **Travel Insurance**: International travel coverage
• **Home Insurance**: Property and contents protection

**Claim Process:**
• Cashless: Direct settlement with hospitals
• Reimbursement: Pay first, claim later
• Keep all medical documents
• Inform insurer within 24-48 hours

**Key Tips:**
• Read policy documents carefully
• Disclose all pre-existing conditions
• Compare online before buying
• Renew on time to avoid lapses`
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