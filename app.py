import streamlit as st
import streamlit.components.v1 as components
import pandas as pd
import math
import json

# Page Config
st.set_page_config(
    page_title="Apex Wealth",
    page_icon="💼",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom CSS for Flat Minimal Design
st.markdown("""
<style>
    /* Clean Flat Cards */
    div[data-testid="stVerticalBlock"] > div[data-testid="element-container"]:has(div.card) {
        margin-bottom: 1rem;
    }
    
    /* Sticky header style */
    .sticky-header {
        background-color: var(--background-color);
        padding: 1rem 0;
        border-bottom: 1px solid rgba(128, 128, 128, 0.2);
        margin-bottom: 1.5rem;
    }
    
    /* Description footer */
    .disclaimer {
        font-size: 0.8rem;
        color: gray;
        text-align: center;
        margin-top: 3rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(128, 128, 128, 0.2);
    }
    
    /* Metrics override */
    div[data-testid="stMetricValue"] {
        font-size: 1.8rem;
        font-weight: 700;
    }
    
    /* Table headers styling */
    th {
        background-color: rgba(128, 128, 128, 0.05) !important;
        font-weight: 600 !important;
    }
</style>
""", unsafe_allow_html=True)

# ----------------------------------------------------
# UTILITIES
# ----------------------------------------------------
def format_inr(number):
    """Formats a number in Indian Standard representation (e.g. ₹1,50,000)"""
    number = round(number)
    neg = "-" if number < 0 else ""
    s = str(abs(number))
    if len(s) <= 3:
        return f"{neg}₹{s}"
    last_three = s[-3:]
    other_parts = s[:-3]
    pairs = []
    while len(other_parts) > 0:
        pairs.append(other_parts[-2:])
        other_parts = other_parts[:-2]
    pairs.reverse()
    formatted = ",".join(pairs) + "," + last_three
    return f"{neg}₹{formatted}"

def render_chartjs(chart_id, chart_type, labels, datasets, options={}, height=300):
    """Embeds an interactive Chart.js chart inside an iframe, adapting to Light/Dark themes"""
    js_datasets = json.dumps(datasets)
    js_labels = json.dumps(labels)
    js_options = json.dumps(options)
    
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"></script>
        <style>
            body {{
                margin: 0;
                padding: 0;
                background-color: transparent;
                overflow: hidden;
            }}
            canvas {{
                max-width: 100%;
                max-height: {height}px;
            }}
        </style>
    </head>
    <body>
        <canvas id="{chart_id}"></canvas>
        <script>
            // Check current system preferences for dark mode
            const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            const datasets = {js_datasets};
            const labels = {js_labels};
            const customOptions = {js_options};
            
            const defaultOptions = {{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {{
                    legend: {{
                        labels: {{
                            color: isDark ? '#f3f4f6' : '#212529',
                            font: {{ family: 'system-ui' }}
                        }}
                    }}
                }}
            }};
            
            const mergedOptions = {{...defaultOptions, ...customOptions}};
            
            new Chart(document.getElementById('{chart_id}'), {{
                type: '{chart_type}',
                data: {{
                    labels: labels,
                    datasets: datasets
                }},
                options: mergedOptions
            }});
        </script>
    </body>
    </html>
    """
    components.html(html, height=height)

# ----------------------------------------------------
# SESSION STATE INITIALIZATION
# ----------------------------------------------------
if 'expenses' not in st.session_state:
    st.session_state.expenses = pd.DataFrame([
        {"Category": "Rent", "Amount (₹)": 10000.0, "Type": "Needs"},
        {"Category": "Food & Groceries", "Amount (₹)": 6000.0, "Type": "Needs"},
        {"Category": "Transport", "Amount (₹)": 2000.0, "Type": "Needs"},
        {"Category": "Utilities", "Amount (₹)": 3000.0, "Type": "Needs"},
        {"Category": "Entertainment", "Amount (₹)": 1500.0, "Type": "Wants"}
    ])

if 'savings_goals' not in st.session_state:
    st.session_state.savings_goals = pd.DataFrame([
        {"Goal Name": "Emergency Fund", "Target (₹)": 90000.0, "Saved So Far (₹)": 15000.0},
        {"Goal Name": "New Phone", "Target (₹)": 20000.0, "Saved So Far (₹)": 8000.0}
    ])

# Synchronizers for Slider & Number Inputs
# Tab 3 Loan Inputs
if 'loan_amount' not in st.session_state: st.session_state.loan_amount = 500000.0
if 'loan_rate' not in st.session_state: st.session_state.loan_rate = 10.5
if 'loan_tenure' not in st.session_state: st.session_state.loan_tenure = 60

# Tab 4 SIP Inputs
if 'sip_amount' not in st.session_state: st.session_state.sip_amount = 2000.0
if 'sip_return' not in st.session_state: st.session_state.sip_return = 12.0
if 'sip_period' not in st.session_state: st.session_state.sip_period = 15

# App Title Header
st.title("💼 Apex Wealth")

# Tabs Navigation
tabs = st.tabs([
    "🧮 Budget Planner", 
    "🐷 Savings Goals", 
    "📈 EMI Calculator", 
    "📊 Growth Simulator", 
    "📉 Debt Payoff", 
    "📚 Lessons", 
    "🏛️ Net Worth"
])

# ----------------------------------------------------
# TAB 1: BUDGET PLANNER
# ----------------------------------------------------
with tabs[0]:
    st.header("Monthly Budget Planner")
    
    col_input, col_output = st.columns([1, 2], gap="large")
    
    with col_input:
        with st.container(border=True):
            st.subheader("Monthly Income")
            salary = st.number_input("Take-Home Salary (₹)", min_value=0.0, value=25000.0, step=1000.0)
            other_income = st.number_input("Other Monthly Income (₹)", min_value=0.0, value=3000.0, step=500.0)
            total_income = salary + other_income
            
            st.subheader("Monthly Expenses")
            st.info("Double click table rows below to edit names, amounts, or delete them. Add new entries at the bottom.")
            edited_expenses = st.data_editor(
                st.session_state.expenses,
                num_rows="dynamic",
                column_config={
                    "Category": st.column_config.TextColumn("Expense Category", required=True),
                    "Amount (₹)": st.column_config.NumberColumn("Amount (₹)", min_value=0.0, format="%.0f"),
                    "Type": st.column_config.SelectboxColumn("Type", options=["Needs", "Wants"], required=True)
                },
                use_container_width=True
            )
            # Save state in memory
            st.session_state.expenses = edited_expenses
            
    with col_output:
        # Sum calculations
        total_expenses = edited_expenses["Amount (₹)"].sum() if not edited_expenses.empty else 0.0
        left_to_save = total_income - total_expenses
        savings_rate = (left_to_save / total_income * 100) if total_income > 0 else 0.0
        
        # Metric Cards
        col_m1, col_m2, col_m3, col_m4 = st.columns(4)
        col_m1.metric("Total Income", format_inr(total_income))
        col_m2.metric("Total Expenses", format_inr(total_expenses))
        col_m3.metric("Left to Save", format_inr(left_to_save))
        col_m4.metric("Savings Rate", f"{round(savings_rate)}%" if left_to_save >= 0 else "0%")
        
        # Color Coded Alert
        if left_to_save < 0:
            st.error(f"⚠️ You are overspending by {format_inr(abs(left_to_save))}! Try reducing your Wants to avoid debt.")
        elif savings_rate < 10.0:
            st.warning(f"⚠️ Saving only {round(savings_rate)}% — aim for at least 20% to build a secure future.")
        else:
            st.success(f"✅ Great! You are saving {round(savings_rate)}% of your income.")
            
        # Donut Chart & 50/30/20 Rule Check
        col_c1, col_c2 = st.columns(2)
        
        with col_c1:
            st.subheader("Expense Allocation")
            if not edited_expenses.empty and total_expenses > 0:
                # Group by Category Name
                grouped = edited_expenses.groupby("Category")["Amount (₹)"].sum().reset_index()
                labels = grouped["Category"].tolist()
                data = grouped["Amount (₹)"].tolist()
                
                # Render Donut Chart
                render_chartjs(
                    chart_id="expenseDonut",
                    chart_type="doughnut",
                    labels=labels,
                    datasets=[{
                        "data": data,
                        "backgroundColor": ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6']
                    }],
                    options={"cutout": "65%"},
                    height=240
                )
            else:
                st.write("No expenses added yet.")
                
        with col_c2:
            st.subheader("50/30/20 Rule Check")
            st.markdown("<small>Ideal target: 50% Needs, 30% Wants, 20% Savings</small>", unsafe_allow_html=True)
            
            # Categories math
            needs_total = edited_expenses[edited_expenses["Type"] == "Needs"]["Amount (₹)"].sum() if not edited_expenses.empty else 0.0
            wants_total = edited_expenses[edited_expenses["Type"] == "Wants"]["Amount (₹)"].sum() if not edited_expenses.empty else 0.0
            
            needs_pct = (needs_total / total_income * 100) if total_income > 0 else 0.0
            wants_pct = (wants_total / total_income * 100) if total_income > 0 else 0.0
            savings_pct = (left_to_save / total_income * 100) if total_income > 0 else 0.0
            
            st.write(f"Needs: {round(needs_pct)}% (Ideal: 50%)")
            st.progress(min(max(needs_pct / 100.0, 0.0), 1.0))
            
            st.write(f"Wants: {round(wants_pct)}% (Ideal: 30%)")
            st.progress(min(max(wants_pct / 100.0, 0.0), 1.0))
            
            st.write(f"Savings: {round(savings_pct)}% (Ideal: 20%)")
            st.progress(min(max(savings_pct / 100.0, 0.0), 1.0))

# ----------------------------------------------------
# TAB 2: SAVINGS GOALS
# ----------------------------------------------------
with tabs[1]:
    st.header("Track Your Savings Goals")
    
    col_g_input, col_g_display = st.columns([1, 2], gap="large")
    
    with col_g_input:
        with st.container(border=True):
            st.subheader("Manage Savings Goals")
            edited_goals = st.data_editor(
                st.session_state.savings_goals,
                num_rows="dynamic",
                column_config={
                    "Goal Name": st.column_config.TextColumn("Goal Name", required=True),
                    "Target (₹)": st.column_config.NumberColumn("Target (₹)", min_value=0.0, format="%.0f"),
                    "Saved So Far (₹)": st.column_config.NumberColumn("Saved So Far (₹)", min_value=0.0, format="%.0f")
                },
                use_container_width=True
            )
            st.session_state.savings_goals = edited_goals
            
    with col_g_display:
        st.subheader("Goal Progress")
        
        total_target = 0.0
        total_saved = 0.0
        
        if not edited_goals.empty:
            for idx, row in edited_goals.iterrows():
                name = row["Goal Name"]
                target = row["Target (₹)"]
                saved = row["Saved So Far (₹)"]
                
                if pd.isna(name) or target <= 0:
                    continue
                    
                total_target += target
                total_saved += saved
                
                pct = round((saved / target) * 100)
                remaining = max(0.0, target - saved)
                
                st.write(f"**{name}**")
                st.progress(min(saved / target, 1.0))
                st.markdown(f"<small>{format_inr(saved)} saved of {format_inr(target)} — <strong>{pct}%</strong> — {format_inr(remaining)} to go</small>", unsafe_allow_html=True)
                st.write("")
        else:
            st.write("No savings goals added yet.")
            
        # Summary Calculator Box
        total_remaining = total_target - total_saved
        
        if total_target > 0:
            # Fetch Left to Save from Tab 1
            t1_salary = salary + other_income
            t1_expenses = edited_expenses["Amount (₹)"].sum() if not edited_expenses.empty else 0.0
            t1_savings = t1_salary - t1_expenses
            
            st.write("---")
            if t1_savings <= 0:
                st.warning(f"⚠️ You need {format_inr(total_remaining)} to reach your goals. Setup positive savings on Tab 1 to see how fast you will reach it.")
            else:
                months_needed = math.ceil(total_remaining / t1_savings)
                st.success(f"💪 You need {format_inr(total_remaining)} total. Saving your budget's {format_inr(t1_savings)}/month gets you there in **{months_needed} months**.")
                
            # Savings Advisor copy block
            advice_prompt = f"I am building a savings plan.\nMy total goals remaining amount is {format_inr(total_remaining)}.\nMy monthly savings capacity from my budget is {format_inr(t1_savings if t1_savings > 0 else 0)}.\nPlease give me 3 simple, non-jargon steps on how to speed up my savings, manage emergencies, and reach these targets."
            
            st.subheader("AI Financial Advisor Prompt")
            st.write("Click copy on the right of the block below to ask this prompt in our chat window:")
            st.code(advice_prompt, language="markdown")

# ----------------------------------------------------
# TAB 3: EMI & LOAN CALCULATOR
# ----------------------------------------------------
with tabs[2]:
    st.header("EMI & Loan Calculator")
    
    col_l_sliders, col_l_results = st.columns([1, 2], gap="large")
    
    with col_l_sliders:
        with st.container(border=True):
            st.subheader("Configure Loan details")
            
            # Slider + Number inputs linked
            # Loan Amount
            st.session_state.loan_amount = st.slider("Loan Amount (₹)", min_value=10000, max_value=5000000, step=10000, value=int(st.session_state.loan_amount))
            st.session_state.loan_amount = st.number_input("Enter Loan Amount (₹)", min_value=10000, max_value=100000000, step=10000, value=int(st.session_state.loan_amount))
            
            # Interest Rate
            st.session_state.loan_rate = st.slider("Annual Interest Rate (%)", min_value=1.0, max_value=30.0, step=0.1, value=float(st.session_state.loan_rate))
            st.session_state.loan_rate = st.number_input("Enter Interest Rate (%)", min_value=0.5, max_value=50.0, step=0.1, value=float(st.session_state.loan_rate))
            
            # Tenure
            st.session_state.loan_tenure = st.slider("Loan Tenure (Months)", min_value=6, max_value=360, step=6, value=int(st.session_state.loan_tenure))
            st.session_state.loan_tenure = st.number_input("Enter Loan Tenure (Months)", min_value=1, max_value=600, step=1, value=int(st.session_state.loan_tenure))
            
    with col_l_results:
        P = st.session_state.loan_amount
        R = st.session_state.loan_rate
        N = st.session_state.loan_tenure
        
        # EMI Math
        monthly_rate = R / (12 * 100)
        emi = P * monthly_rate * math.pow(1 + monthly_rate, N) / (math.pow(1 + monthly_rate, N) - 1)
        total_payable = emi * N
        total_interest = total_payable - P
        interest_ratio = (total_interest / P) * 100
        
        # Large Display
        col_em1, col_em2, col_em3, col_em4 = st.columns(4)
        col_em1.metric("Monthly EMI", format_inr(emi))
        col_em2.metric("Total Payable", format_inr(total_payable))
        col_em3.metric("Total Interest Cost", format_inr(total_interest))
        col_em4.metric("Interest Portion %", f"{round(interest_ratio)}%")
        
        # EMI Risk rating
        t1_salary = salary + other_income
        if t1_salary > 0:
            emi_pct = (emi / t1_salary) * 100
            if emi_pct > 40.0:
                st.error(f"🚨 DANGER: Your EMI is {round(emi_pct)}% of your salary. This is too high! Keep it below 30%.")
            elif emi_pct >= 30.0:
                st.warning(f"⚠️ WARNING: Your EMI is {round(emi_pct)}% of your salary. Consider stretching the tenure to reduce monthly pressure.")
            else:
                st.success(f"✅ SAFE: Your EMI is only {round(emi_pct)}% of your monthly salary.")
        else:
            st.info("ℹ️ Enter your salary on Tab 1 to run an EMI risk assessment.")
            
        # Cumulative Amortization Schedule
        st.subheader("Yearly Repayment Schedule")
        years = math.ceil(N / 12)
        labels = [f"Year {y}" for y in range(1, years + 1)]
        
        principal_cumulative = []
        interest_cumulative = []
        
        balance = P
        tot_pr = 0
        tot_int = 0
        for y in range(1, years + 1):
            year_pr = 0
            year_int = 0
            for m in range(12):
                curr_month = (y - 1) * 12 + m + 1
                if curr_month > N:
                    break
                intr = balance * monthly_rate
                pr = emi - intr
                balance -= pr
                year_pr += pr
                year_int += intr
            tot_pr += year_pr
            tot_int += year_int
            principal_cumulative.append(tot_pr)
            interest_cumulative.append(tot_int)
            
        render_chartjs(
            chart_id="loanAmortization",
            chart_type="line",
            labels=labels,
            datasets=[
                {
                    "label": "Cumulative Principal Paid (₹)",
                    "data": principal_cumulative,
                    "borderColor": "#10b981",
                    "backgroundColor": "rgba(16, 185, 129, 0.1)",
                    "fill": True
                },
                {
                    "label": "Cumulative Interest Paid (₹)",
                    "data": interest_cumulative,
                    "borderColor": "#ef4444",
                    "backgroundColor": "rgba(239, 68, 68, 0.1)",
                    "fill": True
                }
            ],
            options={
                "scales": {
                    "y": {
                        "grid": { "color": "rgba(128, 128, 128, 0.1)" }
                    },
                    "x": {
                        "grid": { "color": "rgba(128, 128, 128, 0.1)" }
                    }
                }
            },
            height=220
        )
        
        # Optimizer Recommendation
        st.subheader("💡 Money Saving Tip")
        extra_payment = emi * 0.10
        extra_monthly = emi + extra_payment
        
        sim_balance = P
        sim_months = 0
        sim_interest = 0
        while sim_balance > 0 and sim_months < 600:
            intr = sim_balance * monthly_rate
            pr = extra_monthly - intr
            if pr <= 0:
                break
            sim_interest += intr
            sim_balance -= pr
            sim_months += 1
            
        interest_saved = total_interest - sim_interest
        months_saved = N - sim_months
        
        if months_saved > 0 and interest_saved > 100:
            st.markdown(f"Paying an extra 10% monthly (**{format_inr(extra_payment)}** more) will save you **{format_inr(interest_saved)}** in total interest and make you loan-free **{months_saved} months earlier**!")
        else:
            st.markdown("To save money on loans, always pay more than the minimum EMI whenever you have spare cash.")

# ----------------------------------------------------
# TAB 4: INVESTMENT GROWTH SIMULATOR
# ----------------------------------------------------
with tabs[3]:
    st.header("SIP & Lump Sum Investment Growth Simulator")
    
    col_i_inputs, col_i_results = st.columns([1, 2], gap="large")
    
    with col_i_inputs:
        with st.container(border=True):
            st.subheader("Configure Investment")
            st.session_state.sip_amount = st.slider("Monthly SIP Amount (₹)", min_value=100, max_value=50000, step=100, value=int(st.session_state.sip_amount))
            st.session_state.sip_return = st.slider("Expected Annual Return (%)", min_value=5.0, max_value=25.0, step=0.5, value=float(st.session_state.sip_return))
            st.session_state.sip_period = st.slider("Investment Period (Years)", min_value=1, max_value=40, step=1, value=int(st.session_state.sip_period))
            
            lump_sum = st.number_input("One-time Lump Sum Investment (₹) — Optional", min_value=0.0, value=0.0, step=5000.0)
            
    with col_i_results:
        S = st.session_state.sip_amount
        R = st.session_state.sip_return
        Y = st.session_state.sip_period
        
        # Future value math
        n = Y * 12
        r = R / (12 * 100)
        
        fv_sip = 0.0
        if S > 0 and r > 0:
            fv_sip = S * ((math.pow(1 + r, n) - 1) / r) * (1 + r)
        elif S > 0:
            fv_sip = S * n
            
        fv_lump = lump_sum * math.pow(1 + R/100, Y)
        final_corpus = fv_sip + fv_lump
        total_invested = (S * n) + lump_sum
        wealth_gain = max(0.0, final_corpus - total_invested)
        multiplier = (final_corpus / total_invested) if total_invested > 0 else 1.0
        
        # Display Metrics
        col_im1, col_im2, col_im3, col_im4 = st.columns(4)
        col_im1.metric("Estimated Future Value", format_inr(final_corpus))
        col_im2.metric("Total Invested", format_inr(total_invested))
        col_im3.metric("Returns Earned", format_inr(wealth_gain))
        col_im4.metric("Multiplier", f"{multiplier:.1f}x your money")
        
        # Starting 5 years earlier formula
        early_n = (Y + 5) * 12
        early_fv_sip = S * ((math.pow(1 + r, early_n) - 1) / r) * (1 + r) if S > 0 and r > 0 else S * early_n
        early_fv_lump = lump_sum * math.pow(1 + R/100, Y + 5)
        early_corpus = early_fv_sip + early_fv_lump
        early_diff = early_corpus - final_corpus
        
        st.success(f"🚀 **Motivational Tip**: Starting 5 years earlier would have given you an extra **{format_inr(early_diff)}** at maturity!")
        
        # Growth Chart
        st.subheader("Growth Timeline")
        labels = [f"Yr {y}" for y in range(1, Y + 1)]
        invested_timeline = []
        corpus_timeline = []
        for y in range(1, Y + 1):
            inv = (S * y * 12) + lump_sum
            curr_n = y * 12
            fv_s = S * ((math.pow(1 + r, curr_n) - 1) / r) * (1 + r) if S > 0 and r > 0 else S * curr_n
            fv_l = lump_sum * math.pow(1 + R/100, y)
            invested_timeline.append(inv)
            corpus_timeline.append(fv_s + fv_l)
            
        render_chartjs(
            chart_id="sipGrowth",
            chart_type="line",
            labels=labels,
            datasets=[
                {
                    "label": "Total Corpus Value (₹)",
                    "data": corpus_timeline,
                    "borderColor": "#10b981",
                    "backgroundColor": "rgba(16, 185, 129, 0.15)",
                    "fill": True
                },
                {
                    "label": "Amount Invested (₹)",
                    "data": invested_timeline,
                    "borderColor": "#6366f1",
                    "backgroundColor": "rgba(99, 102, 241, 0.05)",
                    "fill": True
                }
            ],
            options={
                "scales": {
                    "y": { "grid": { "color": "rgba(128, 128, 128, 0.1)" } },
                    "x": { "grid": { "color": "rgba(128, 128, 128, 0.1)" } }
                }
            },
            height=220
        )
        
        # Comparison Grid
        st.subheader("What a ₹2,000/month SIP Becomes")
        comp_periods = [10, 20, 30]
        comp_rates = [8, 12, 15]
        
        comp_data = []
        for yr in comp_periods:
            row_vals = [f"{yr} Years"]
            for rt in comp_rates:
                curr_months = yr * 12
                curr_r = rt / (12 * 100)
                fv = 2000 * ((math.pow(1 + curr_r, curr_months) - 1) / curr_r) * (1 + curr_r)
                row_vals.append(format_inr(fv))
            comp_data.append(row_vals)
            
        df_comp = pd.DataFrame(comp_data, columns=["Period", "8% Return", "12% Return (Mutual Fund)", "15% Return (High Growth)"])
        st.table(df_comp.set_index("Period"))

# ----------------------------------------------------
# TAB 5: DEBT PAYOFF PLANNER
# ----------------------------------------------------
with tabs[4]:
    st.header("Debt Payoff Planner")
    
    col_d_inputs, col_d_results = st.columns([1, 2], gap="large")
    
    with col_d_inputs:
        with st.container(border=True):
            st.subheader("Enter Outstanding Debt")
            debt_amount = st.number_input("Total Debt Amount (₹)", min_value=0.0, value=150000.0, step=5000.0)
            debt_rate = st.number_input("Annual Interest Rate (%)", min_value=0.0, value=14.0, step=0.5)
            monthly_pay = st.number_input("Monthly Payment Capacity (₹)", min_value=0.0, value=5000.0, step=500.0)
            
    with col_d_results:
        if debt_amount > 0 and monthly_pay > 0:
            monthly_r = debt_rate / (12 * 100)
            accrued_interest = debt_amount * monthly_r
            
            if monthly_pay <= accrued_interest:
                st.error(f"🚨 DANGER: Your monthly payment of {format_inr(monthly_pay)} is less than or equal to the interest accrued ({format_inr(accrued_interest)}). Your debt will grow forever! Pay at least {format_inr(accrued_interest + 200)} to start clearing principal.")
                months_needed = "Infinite"
                total_interest_paid = 0
                total_repaid = 0
            else:
                # Payoff simulator
                sim_bal = debt_amount
                months_needed = 0
                total_interest_paid = 0
                while sim_bal > 0 and months_needed < 1200:
                    intr = sim_bal * monthly_r
                    pr = monthly_pay - intr
                    total_interest_paid += intr
                    sim_bal -= pr
                    months_needed += 1
                total_repaid = debt_amount + total_interest_paid
                
            # Metric output
            col_dm1, col_dm2, col_dm3 = st.columns(3)
            col_dm1.metric("Time to Debt Freedom", f"{months_needed} months" if isinstance(months_needed, int) else months_needed)
            col_dm2.metric("Total Interest Paid", format_inr(total_interest_paid))
            col_dm3.metric("Total Amount Repaid", format_inr(total_repaid))
            
            if isinstance(months_needed, int):
                # Bar Chart Paid vs Principal
                st.subheader("Repayment Composition")
                render_chartjs(
                    chart_id="debtRepayment",
                    chart_type="bar",
                    labels=["Original Debt", "Total Repayment"],
                    datasets=[
                        {
                            "label": "Original Principal (₹)",
                            "data": [debt_amount, debt_amount],
                            "backgroundColor": "#6366f1"
                        },
                        {
                            "label": "Interest Cost (₹)",
                            "data": [0, total_interest_paid],
                            "backgroundColor": "#ef4444"
                        }
                    ],
                    options={
                        "scales": {
                            "x": { "stacked": True },
                            "y": { "stacked": True }
                        }
                    },
                    height=200
                )
        else:
            st.info("ℹ️ Enter your debt balance details to calculate your payoff timeline.")
            
        # Strategy Explainer
        st.write("---")
        st.subheader("Repayment Methods")
        col_ds1, col_ds2 = st.columns(2)
        with col_ds1:
            with st.container(border=True):
                st.markdown("**1. Avalanche Method**")
                st.markdown("<small>Pay off loans with the <strong>highest interest first</strong>. Saves you the most interest cash overall.</small>", unsafe_allow_html=True)
        with col_ds2:
            with st.container(border=True):
                st.markdown("**2. Snowball Method**")
                st.markdown("<small>Pay off loans with the <strong>smallest balance first</strong>. Gives you fast psychological wins to stay motivated.</small>", unsafe_allow_html=True)
                
        # Advice Prompt code block
        debt_prompt = f"I have a debt of {format_inr(debt_amount)} at {debt_rate}% interest.\nMy monthly payment budget is {format_inr(monthly_pay)}.\nShould I focus on the Avalanche or Snowball method? Give me 3 simple tips in basic English on how to clear this debt fast."
        st.subheader("Which is better for me?")
        st.write("Copy this prompt to ask this AI session:")
        st.code(debt_prompt, language="markdown")

# ----------------------------------------------------
# TAB 6: FINANCIAL LITERACY LESSONS
# ----------------------------------------------------
with tabs[5]:
    st.header("Financial Literacy Lessons")
    st.write("Learn these core concepts in plain English to manage your family's money wisely.")
    
    lessons = [
        {
            "icon": "📊",
            "title": "The 50/30/20 Rule",
            "desc": "Manage your salary easily: Spend 50% on Needs (rent, grains, school bills), 30% on Wants (festivals, tea, entertainment), and save the last 20% for your future.",
            "prompt": "Explain the 50/30/20 rule in simple English. How should a family with ₹25,000 monthly income split their budget using this rule?"
        },
        {
            "icon": "🛡️",
            "title": "Emergency Fund",
            "desc": "Keep 3 to 6 months of basic expenses in a safe bank account. Never touch this money unless for real emergencies like hospital bills or job loss.",
            "prompt": "Why is an emergency fund critical for a family in India? How should we build one if our salary is small?"
        },
        {
            "icon": "✨",
            "title": "Compound Interest",
            "desc": "When you invest, your money earns returns. In the next year, you earn interest on both your initial cash and the interest already earned. It grows like a rolling snowball!",
            "prompt": "Explain compound interest to a 10 year old. How does investing ₹1,000 per month help build huge savings over 20 years?"
        },
        {
            "icon": "⚖️",
            "title": "Good Debt vs Bad Debt",
            "desc": "Good debt is borrowing to build future value (like education or a home loan). Bad debt is borrowing to buy depreciating things (like clothes on credit cards).",
            "prompt": "What makes a loan good or bad in India? Explain why gold loans or personal loans can sometimes become bad debt."
        },
        {
            "icon": "🌱",
            "title": "SIP mutual funds",
            "desc": "Systematic Investment Plan (SIP) lets you invest a fixed small amount (like ₹500) every month in mutual funds. You don't need to guess stock prices.",
            "prompt": "How does an SIP mutual fund work in India? Is it safe for a low-income earner to start with ₹500/month?"
        },
        {
            "icon": "🤝",
            "title": "Insurance First",
            "desc": "Protect your family first. Get a basic Term Life Insurance to secure your family, and Health Insurance so medical bills do not consume all your savings.",
            "prompt": "Why should I buy health insurance and term insurance before investing in mutual funds in India?"
        },
        {
            "icon": "💨",
            "title": "Inflation",
            "desc": "Inflation means items become costlier over time. If inflation is 6%, an item costing ₹100 today will cost ₹106 next year. Savings must grow to keep up.",
            "prompt": "Explain inflation. Why does keeping cash in a home locker lose value and how can I defeat inflation?"
        },
        {
            "icon": "⭐",
            "title": "Credit Score",
            "desc": "A rating of how reliably you repay loans. Repaying on time gives a high score (like CIBIL), making future loans cheaper and easier to get.",
            "prompt": "What is CIBIL credit score in India? What are 3 easy habits to keep my score high so I can get cheap home loans?"
        }
    ]
    
    # 2x4 columns layout
    for i in range(0, len(lessons), 2):
        col_l1, col_l2 = st.columns(2)
        with col_l1:
            with st.container(border=True):
                st.markdown(f"### {lessons[i]['icon']} {lessons[i]['title']}")
                st.write(lessons[i]["desc"])
                with st.expander("Learn more (Copy AI Prompt)"):
                    st.code(lessons[i]["prompt"], language="markdown")
        with col_l2:
            with st.container(border=True):
                st.markdown(f"### {lessons[i+1]['icon']} {lessons[i+1]['title']}")
                st.write(lessons[i+1]["desc"])
                with st.expander("Learn more (Copy AI Prompt)"):
                    st.code(lessons[i+1]["prompt"], language="markdown")

# ----------------------------------------------------
# TAB 7: NET WORTH TRACKER
# ----------------------------------------------------
with tabs[6]:
    st.header("Net Worth Tracker")
    
    col_n1, col_n2 = st.columns(2, gap="large")
    
    with col_n1:
        with st.container(border=True):
            st.subheader("🟢 My Assets")
            a_cash = st.number_input("Cash & Bank Balance (₹)", min_value=0.0, value=25000.0, step=1000.0)
            a_stocks = st.number_input("Mutual Funds / Stocks value (₹)", min_value=0.0, value=40000.0, step=2000.0)
            a_gold = st.number_input("Gold value (₹)", min_value=0.0, value=60000.0, step=5000.0)
            a_prop = st.number_input("Property / Land value (₹)", min_value=0.0, value=0.0, step=100000.0)
            a_other = st.number_input("Other Assets (₹)", min_value=0.0, value=5000.0, step=500.0)
            total_assets = a_cash + a_stocks + a_gold + a_prop + a_other
            
    with col_n2:
        with st.container(border=True):
            st.subheader("🔴 My Liabilities")
            l_home = st.number_input("Home Loan outstanding (₹)", min_value=0.0, value=0.0, step=100000.0)
            l_personal = st.number_input("Personal Loan outstanding (₹)", min_value=0.0, value=15000.0, step=1000.0)
            l_cc = st.number_input("Credit Card Debt (₹)", min_value=0.0, value=4500.0, step=500.0)
            l_other = st.number_input("Other Debts owed (₹)", min_value=0.0, value=0.0, step=1000.0)
            total_liabilities = l_home + l_personal + l_cc + l_other
            
    # Calculations
    net_worth = total_assets - total_liabilities
    
    # Net Worth Metrics
    col_nw1, col_nw2, col_nw3 = st.columns(3)
    col_nw1.metric("Total Assets", format_inr(total_assets))
    col_nw2.metric("Total Liabilities", format_inr(total_liabilities))
    
    # Custom colored net worth metric
    if net_worth >= 0:
        col_nw3.metric("Net Worth", format_inr(net_worth), delta="Positive Net Worth")
    else:
        col_nw3.metric("Net Worth", format_inr(net_worth), delta="Negative Net Worth (Liabilities exceed assets)", delta_color="inverse")
        
    st.write("---")
    
    col_g1, col_g2 = st.columns(2)
    
    with col_g1:
        st.subheader("Assets vs Liabilities Ratio")
        total_sum = total_assets + total_liabilities
        if total_sum > 0:
            asset_pct = (total_assets / total_sum)
            st.progress(asset_pct)
            st.markdown(f"<small>Assets: <strong>{round(asset_pct * 100)}%</strong> | Liabilities: <strong>{round((1 - asset_pct) * 100)}%</strong></small>", unsafe_allow_html=True)
        else:
            st.write("Enter values above to show ratio.")
            
        # Recommendations Card
        st.subheader("💡 Personalised Advice")
        t1_expenses = edited_expenses["Amount (₹)"].sum() if not edited_expenses.empty else 0.0
        
        if net_worth < 0:
            st.error("❌ Your liabilities exceed your assets. Focus on paying down your debts (especially Credit Cards and Personal Loans) before starting new investments.")
        elif a_cash < (t1_expenses * 3):
            st.warning(f"⚠️ Your cash reserves ({format_inr(a_cash)}) are less than 3 months of basic expenses ({format_inr(t1_expenses * 3)}). Build your emergency fund first.")
        else:
            st.success("✅ You are successfully building wealth. Diversify your investments into equity mutual funds (SIP) or gold for long term safety.")
            
    with col_g2:
        st.subheader("Asset Allocation Breakdown")
        if total_assets > 0:
            labels = ["Cash & Bank", "Mutual Funds", "Gold", "Property", "Other Assets"]
            data = [a_cash, a_stocks, a_gold, a_prop, a_other]
            
            render_chartjs(
                chart_id="netWorthAllocation",
                chart_type="doughnut",
                labels=labels,
                datasets=[{
                    "data": data,
                    "backgroundColor": ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#6b7280']
                }],
                options={"cutout": "55%"},
                height=220
            )
        else:
            st.write("Enter asset values above to see chart.")

# ----------------------------------------------------
# GLOBAL FEATURES
# ----------------------------------------------------
st.write("---")
# Ask floating question helper
st.subheader("💬 Ask a Financial Question")
user_question = st.text_input("Type your question below (e.g. 'Should I buy health insurance or invest?'):")
if user_question:
    full_prompt = f"I have a question about personal finance in India: {user_question}"
    st.write("Copy this prompt to ask this AI session:")
    st.code(full_prompt, language="markdown")

# Footer Disclaimer
st.markdown("""
<div class="disclaimer">
    This tool is for educational purposes only and does not constitute financial advice. Consult a SEBI-registered financial advisor for personalised guidance.
</div>
""", unsafe_allow_html=True)
