import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, LineChart, Line
} from 'recharts';
import { QRCodeSVG } from 'qrcode.react';
import { Html5Qrcode } from 'html5-qrcode';
import { 
  Wallet, Target, Percent, TrendingUp, BarChart3, Lock, Eye, EyeOff, 
  Download, Upload, Info, X, Plus, Trash2, ShieldAlert, Sparkles, Settings, CreditCard, Menu,
  Sun, Moon, Scale, Hourglass, Landmark, ChevronRight, Check, AlertTriangle, CalendarDays, Activity
} from 'lucide-react';

// ====================================================
// STATE OBFUSCATION / ENCRYPTION ENGINE
// ====================================================
const ENCRYPTION_KEY = 'APEX_WEALTH_CYPHER_KEY';

const encryptState = (stateObj) => {
  try {
    const json = JSON.stringify(stateObj);
    let encrypted = '';
    for (let i = 0; i < json.length; i++) {
      encrypted += String.fromCharCode(json.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length));
    }
    return btoa(unescape(encodeURIComponent(encrypted)));
  } catch (e) {
    console.error("Encryption failed:", e);
    return '';
  }
};

const decryptState = (cipherText) => {
  try {
    const encrypted = decodeURIComponent(escape(atob(cipherText)));
    let decrypted = '';
    for (let i = 0; i < encrypted.length; i++) {
      decrypted += String.fromCharCode(encrypted.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length));
    }
    return JSON.parse(decrypted);
  } catch (e) {
    console.error("Decryption failed:", e);
    return null;
  }
};

// ====================================================
// MULTI-LINGUAL SYSTEM DICTIONARY
// ====================================================
const i18n = {
  en: {
    title: "Apex Wealth",
    tagline: "Your Premium Offline Personal Finance Toolkit",
    tab_budget: "Budget Planner",
    tab_sinking: "Sinking Funds",
    tab_savings: "Savings Goals",
    tab_loan: "EMI Prepayment",
    tab_growth: "SIP Growth Projections",
    tab_debt: "Debt Payoff Plan",
    tab_tax: "Tax Regime Optimizer",
    tab_retirement: "Retirement & FIRE",
    tab_networth: "Net Worth Tracker",
    tab_stresstest: "Stress Testing",
    tab_impulse: "Impulse Simulator",
    tab_vault: "Life Vault",
    btn_export: "Export Backup",
    btn_import: "Import Backup",
    btn_scan_qr: "Scan Partner QR",
    btn_show_qr: "Show State QR",
    btn_add: "Add Entry",
    btn_delete: "Delete",
    btn_apply: "Apply Test",
    btn_clear: "Reset Test",
    salary_label: "Monthly Take-Home Salary (₹)",
    other_income_label: "Other Monthly Income (₹)",
    fixed_costs: "Fixed Costs (EMIs, Rent, Bills)",
    variable_costs: "Variable Costs (Dining, Leisure)",
    agility_score: "Financial Agility Score",
    agility_tooltip: "Measures the portion of your income not locked into fixed commitments. Higher is safer.",
    sinking_fund_deduction: "Sinking Fund Monthly Withholding",
    surplus_label: "Remaining Monthly Surplus",
    impulse_title: "Should I Buy This? (Impulse Simulator)",
    item_cost: "Cost of Item (₹)",
    labor_cost_calc: "Labor Hour Cost",
    labor_hours_msg: "This costs you {hours} hours of actual physical labor (based on ₹{rate}/hr).",
    opportunity_cost_calc: "Opportunity Cost (15 Yrs)",
    opp_cost_msg: "If invested at 12% instead, it would grow to {val} in 15 years.",
    monte_carlo_title: "Monte Carlo Wealth Forecast",
    best_case: "Best-Case Scenario ({rate}%)",
    median_case: "Median Trend ({rate}%)",
    worst_case: "Worst-Case Scenario ({rate}%)",
    fire_title: "FIRE Speedometer",
    fire_target: "FIRE Target Corpus",
    fire_autonomy: "FIRE Autonomy",
    fire_tooltip: "FIRE target is calculated as 25x-30x of your annual expenses.",
    sinking_fund_title: "Sinking Fund (Annual Ledgers)",
    annual_expense_name: "Annual Expense Name",
    annual_amount: "Annual Amount (₹)",
    sinking_withholding: "Withholding (₹{val}/mo)",
    haircut_label: "Conservative Liquidity Haircut (Real Estate -20%, Gold -5%)",
    liquid_nw_label: "True Liquid Net Worth",
    tangible_translation: "Tangible Wealth Translation",
    sync_title: "Offline Sync (Partner Exchange)",
    scan_webcam: "Scan QR Code",
    show_qr_code: "Scan this QR code from another device to replicate state",
    vault_title: "Life-Admin Document Vault",
    vault_subtitle: "Checklist for critical life admin (wills, term nominees, master password files) stored locally."
  },
  kn: {
    title: "ಅಪೆಕ್ಸ್ ಇಂಟೆಲ್",
    tagline: "ಆಫ್‌ಲೈನ್ ವೈಯಕ್ತಿಕ ಹಣಕಾಸು ಮತ್ತು ಗೌಪ್ಯತೆ PWA",
    tab_budget: "ಬಜೆಟ್ ಪ್ಲಾನರ್",
    tab_sinking: "ಸಿಂಕಿಂಗ್ ಫಂಡ್‌ಗಳು",
    tab_savings: "ಉಳಿತಾಯ ಗುರಿಗಳು",
    tab_loan: "ಇಎಂಐ ಪ್ರಿಪೇಮೆಂಟ್",
    tab_growth: "ಎಸ್‌ಐಪಿ ಬೆಳವಣಿಗೆ",
    tab_debt: "ಸಾಲ ತೀರಿಸುವಿಕೆ",
    tab_tax: "ತೆರಿಗೆ ಆಪ್ಟಿಮೈಜರ್",
    tab_retirement: "ನಿವೃತ್ತಿ ಮತ್ತು FIRE",
    tab_networth: "ನಿವ್ವಳ ಮೌಲ್ಯ",
    tab_stresstest: "ಒತ್ತಡ ಪರೀಕ್ಷೆ",
    tab_impulse: "ಇಂಪಲ್ಸ್ ಸಿಮ್ಯುಲೇಟರ್",
    tab_vault: "ಲೈಫ್ ವಾಲ್ಟ್",
    btn_export: "ಬ್ಯಾಕಪ್ ರಫ್ತು",
    btn_import: "ಬ್ಯಾಕಪ್ ಆಮದು",
    btn_scan_qr: "QR ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
    btn_show_qr: "ನನ್ನ QR ತೋರಿಸು",
    btn_add: "ಸೇರಿಸಿ",
    btn_delete: "ಅಳಿಸಿ",
    btn_apply: "ಪರೀಕ್ಷೆ ಅನ್ವಯಿಸು",
    btn_clear: "ಮರುಹೊಂದಿಸಿ",
    salary_label: "ತಿಂಗಳ ಕೈಗೆ ಬರುವ ಸಂಬಳ (₹)",
    other_income_label: "ಇತರ ಮಾಸಿಕ ಆದಾಯ (₹)",
    fixed_costs: "ಸ್ಥಿರ ವೆಚ್ಚಗಳು (ಬಾಡಿಗೆ, ಇಎಂಐ)",
    variable_costs: "ಬದಲಾಗುವ ವೆಚ್ಚಗಳು (ಊಟ, ಮನರಂಜನೆ)",
    agility_score: "ಹಣಕಾಸು ಚುರುಕುತನ ಸ್ಕೋರ್",
    agility_tooltip: "ನಿಮ್ಮ ಆದಾಯದಲ್ಲಿ ಸ್ಥಿರ ವೆಚ್ಚಗಳಿಗೆ ಒಳಗಾಗದ ಭಾಗವನ್ನು ಅಳೆಯುತ್ತದೆ. ಹೆಚ್ಚು ಇದ್ದರೆ ಆರ್ಥಿಕ ಆಘಾತಗಳನ್ನು ಸುಲಭವಾಗಿ ಎದುರಿಸಬಹುದು.",
    sinking_fund_deduction: "ಸಿಂಕಿಂಗ್ ಫಂಡ್ ಮಾಸಿಕ ಕಡಿತ",
    surplus_label: "ಉಳಿದಿರುವ ಮಾಸಿಕ ಹೆಚ್ಚುವರಿ",
    impulse_title: "ನಾನು ಇದನ್ನು ಖರೀದಿಸಬೇಕೇ? (ಇಂಪಲ್ಸ್ ಸಿಮ್ಯುಲೇಟರ್)",
    item_cost: "ವಸ್ತುವಿನ ಬೆಲೆ (₹)",
    labor_cost_calc: "ಶ್ರಮದ ಸಮಯದ ಲೆಕ್ಕಾಚಾರ",
    labor_hours_msg: "ಇದು ನಿಮ್ಮ {hours} ಗಂಟೆಗಳ ನಿಜವಾದ ಶ್ರಮಕ್ಕೆ ಸಮನಾಗಿದೆ (₹{rate}/ಗಂಟೆಗೆ ಆಧಾರಿತವಾಗಿ).",
    opportunity_cost_calc: "ಅವಕಾಶದ ವೆಚ್ಚ (15 ವರ್ಷಗಳು)",
    opp_cost_msg: "ಇದನ್ನು 12% ದರದಲ್ಲಿ ಹೂಡಿಕೆ ಮಾಡಿದರೆ, 15 ವರ್ಷಗಳಲ್ಲಿ ₹{val} ಆಗಿ ಬೆಳೆಯುತ್ತದೆ.",
    monte_carlo_title: "ಮಾಂಟೆ ಕಾರ್ಲೋ ಸಂಪತ್ತು ಮುನ್ಸೂಚನೆ",
    best_case: "ಉತ್ತಮ ಸನ್ನಿವೇಶ ({rate}%)",
    median_case: "ಮಧ್ಯಮ ಪ್ರವೃತ್ತಿ ({rate}%)",
    worst_case: "ಕಡಿಮೆ ಸನ್ನಿವೇಶ ({rate}%)",
    fire_title: "FIRE ಸ್ವಾಯತ್ತತೆ ಸ್ಪೀಡೋಮೀಟರ್",
    fire_target: "FIRE ಗುರಿ ಮೊತ್ತ",
    fire_autonomy: "FIRE ಪ್ರಗತಿ",
    fire_tooltip: "FIRE ಗುರಿಯನ್ನು ನಿಮ್ಮ ವಾರ್ಷಿಕ ವೆಚ್ಚಗಳ 25x-30x ಎಂದು ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತದೆ.",
    sinking_fund_title: "ಸಿಂಕಿಂಗ್ ಫಂಡ್ (ವಾರ್ಷಿಕ ಲೆಡ್ಜರ್)",
    annual_expense_name: "ವಾರ್ಷಿಕ ವೆಚ್ಚದ ಹೆಸರು",
    annual_amount: "ವಾರ್ಷಿಕ ಮೊತ್ತ (₹)",
    sinking_withholding: "ಮಾಸಿಕ ತಡೆಹಿಡಿಯುವಿಕೆ (₹{val}/ತಿಂಗಳು)",
    haircut_label: "ದ್ರವ್ಯತೆ ರಿಯಾಯಿತಿ (ರಿಯಲ್ ಎಸ್ಟೇಟ್ -20%, ಚಿನ್ನ -5%)",
    liquid_nw_label: "ನೈಜ ದ್ರವ ನಿವ್ವಳ ಮೌಲ್ಯ",
    tangible_translation: "ಸಂಪತ್ತಿನ ನೈಜ ಹೋಲಿಕೆ",
    sync_title: "ಆಫ್‌ಲೈನ್ ಸಿಂಕ್ ಮತ್ತು ವರ್ಗಾವಣೆ",
    scan_webcam: "ಕ್ಯಾಮೆರಾ ಬಳಸಿ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
    show_qr_code: "ಮತ್ತೊಂದು ಸಾಧನದಿಂದ ಸ್ಕ್ಯಾನ್ ಮಾಡಲು ಈ QR ಕೋಡ್ ಬಳಸಿ",
    vault_title: "ಲೈಫ್-ಅಡ್ಮಿನ್ ಡಾಕ್ಯುಮೆಂಟ್ ವಾಲ್ಟ್",
    vault_subtitle: "ನಿಮ್ಮ ಪ್ರಮುಖ ದಾಖಲೆಗಳನ್ನು ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ ನವೀಕರಿಸಿ"
  },
  hi: {
    title: "एपेक्स इंटेल",
    tagline: "ऑफ़लाइन व्यक्तिगत वित्त PWA",
    tab_budget: "बजट योजना",
    tab_sinking: "सिंकिंग फंड",
    tab_savings: "बचत लक्ष्य",
    tab_loan: "ईएमआई प्रीपेमेंट",
    tab_growth: "एसआईपी विकास",
    tab_debt: "ऋण चुकौती",
    tab_tax: "टैक्स कैलकुलेटर",
    tab_retirement: "सेवानिवृत्ति व FIRE",
    tab_networth: "कुल संपत्ति",
    tab_stresstest: "तनाव परीक्षण",
    tab_impulse: "इम्पल्स सिम्युलेटर",
    tab_vault: "जीवन तिजोरी",
    btn_export: "बैकअप निर्यात",
    btn_import: "बैकअप आयात",
    btn_scan_qr: "क्यूआर स्कैन करें",
    btn_show_qr: "मेरा क्यूआर दिखाएं",
    btn_add: "जोड़ें",
    btn_delete: "हटाएं",
    btn_apply: "परीक्षण लागू करें",
    btn_clear: "रीसेट करें",
    salary_label: "मासिक वेतन (₹)",
    other_income_label: "अन्य मासिक आय (₹)",
    fixed_costs: "निश्चित लागत (किराया, ईएमआई)",
    variable_costs: "परिवर्तनशील लागत (मनोरंजन, भोजन)",
    agility_score: "वित्तीय चपलता स्कोर",
    agility_tooltip: "यह आपकी आय के उस हिस्से को मापता है जो निश्चित बिलों में बंद नहीं है। अधिक होने पर आप वित्तीय झटकों का सामना कर सकते हैं।",
    sinking_fund_deduction: "सिंकिंग फंड मासिक कटौती",
    surplus_label: "शेष मासिक अधिशेष",
    impulse_title: "क्या मुझे इसे खरीदना चाहिए? (इम्पल्स सिम्युलेटर)",
    item_cost: "वस्तु की कीमत (₹)",
    labor_cost_calc: "श्रम समय लागत",
    labor_hours_msg: "इस वस्तु की कीमत आपके {hours} घंटे के वास्तविक श्रम के बराबर है (₹{rate}/घंटा के आधार पर)।",
    opportunity_cost_calc: "अवसर लागत (15 वर्ष)",
    opp_cost_msg: "यदि इसे 12% पर निवेश किया जाता, तो 15 वर्षों में यह ₹{val} हो जाता।",
    monte_carlo_title: "मोंटे कार्लो वेल्थ फोरकास्ट",
    best_case: "सर्वश्रेष्ठ परिदृश्य ({rate}%)",
    median_case: "मध्यम प्रवृत्ति ({rate}%)",
    worst_case: "सबसे खराब परिदृश्य ({rate}%)",
    fire_title: "FIRE स्पीडोमीटर",
    fire_target: "FIRE लक्ष्य कोष",
    fire_autonomy: "FIRE प्रगति",
    fire_tooltip: "FIRE लक्ष्य की गणना आपके वार्षिक खर्चों के 25x-30x के रूप में की जाती है।",
    sinking_fund_title: "सिंकिंग फंड (वार्षिक बहीखाता)",
    annual_expense_name: "वार्षिक व्यय का नाम",
    annual_amount: "वार्षिक राशि (₹)",
    sinking_withholding: "मासिक रोक (₹{val}/माह)",
    haircut_label: "तरलता छूट (रियल एस्टेट -20%, सोना -5%)",
    liquid_nw_label: "वास्तविक तरल कुल संपत्ति",
    tangible_translation: "वास्तविक धन अनुवाद",
    sync_title: "ऑफ़लाइन सिंक और स्थानांतरण",
    scan_webcam: "कैमरे से स्कैन करें",
    show_qr_code: "दूसरे डिवाइस से स्कैन करने के लिए यह क्यूआर कोड दिखाएं",
    vault_title: "लाइफ-एडमिन दस्तावेज़ तिजोरी",
    vault_subtitle: "अपने महत्वपूर्ण पारिवारिक रिकॉर्ड को ऑफ़लाइन सुरक्षित रखें"
  },
  ta: {
    title: "அபெக்ஸ் இண்டெல்",
    tagline: "முழு ஆஃப்லைன் தனிப்பட்ட நிதி PWA",
    tab_budget: "வரவு செலவு திட்டம்",
    tab_sinking: "சிங்கிங் ஃபண்டுகள்",
    tab_savings: "சேமிப்பு இலக்குகள்",
    tab_loan: "கடன் முன்பணம் செலுத்துதல்",
    tab_growth: "SIP முதலீட்டு வளர்ச்சி",
    tab_debt: "கடன் தீர்த்தல்",
    tab_tax: "வரி கால்குலேட்டர்",
    tab_retirement: "ஓய்வூதியம் & FIRE",
    tab_networth: "நிகர மதிப்பு",
    tab_stresstest: "அழுத்த சோதனை",
    tab_impulse: "இம்பல்ஸ் சிமுலேட்டர்",
    tab_vault: "வாழ்க்கை பெட்டகம்",
    btn_export: "காப்புப்பிரதி ஏற்றுமதி",
    btn_import: "காப்புப்பிரதி இறக்குமதி",
    btn_scan_qr: "QR ஸ்கேன் செய்",
    btn_show_qr: "எனது QR காட்டு",
    btn_add: "சேர்",
    btn_delete: "அழி",
    btn_apply: "சோதனை செய்",
    btn_clear: "மீட்டமை",
    salary_label: "மாத சம்பளம் (₹)",
    other_income_label: "இதರ மாத வருமானம் (₹)",
    fixed_costs: "நிலையான செலவுகள் (வாடகை, தவணை)",
    variable_costs: "மாறும் செலவுகள் (உணவு, பொழுதுபோக்கு)",
    agility_score: "நிதி நெகிழ்வுத்தன்மை மதிப்பெண்",
    agility_tooltip: "நிலையான செலவுகளில் சிக்காத உங்கள் வருமானத்தின் பகுதியை இது அளவிடுகிறது. அதிகமாக இருந்தால் நிதி நெருக்கடிகளை எளிதில் சமாளிக்கலாம்.",
    sinking_fund_deduction: "சிங்கிங் ஃபண்ட் மாத கழிவு",
    surplus_label: "மீதமுள்ள மாத உபரி",
    impulse_title: "நான் இதை வாங்க வேண்டுமா? (இம்பல்ஸ் சிமுலேட்டர்)",
    item_cost: "பொருளின் விலை (₹)",
    labor_cost_calc: "உழைப்பு நேர செலவு",
    labor_hours_msg: "இப்பொருள் உங்கள் {hours} மணிநேர உழைப்புக்கு சமம் (₹{rate}/மணிநேரம் என்ற அடிப்படையில்).",
    opportunity_cost_calc: "வாய்ப்பு செலவு (15 ஆண்டுகள்)",
    opp_cost_msg: "இதனை 12%-ல் முதலீடு செய்திருந்தால், 15 ஆண்டுகளில் ₹{val}-ஆக வளர்ந்திருக்கும்.",
    monte_carlo_title: "மான்டே கார்லோ நிதி முன்னறிவிப்பு",
    best_case: "சிறந்த சூழ்நிலை ({rate}%)",
    median_case: "நடுத்தர போக்கு ({rate}%)",
    worst_case: "மோசமான சூழ்நிலை ({rate}%)",
    fire_title: "FIRE ஸ்பீடோமீட்டர்",
    fire_target: "FIRE இலக்கு தொகை",
    fire_autonomy: "FIRE முன்னேற்றம்",
    fire_tooltip: "FIRE இலக்கு என்பது உங்கள் ஆண்டு செலவுகளின் 25x-30x மடங்கு ஆகும்.",
    sinking_fund_title: "சிங்கிங் ஃபண்ட் (ஆண்டு கணக்கு)",
    annual_expense_name: "ஆண்டு செலவு பெயர்",
    annual_amount: "ஆண்டு தொகை (₹)",
    sinking_withholding: "மாதாந்திர ஒதுக்கீடு (₹{val}/மாதம்)",
    haircut_label: "சொத்து மதிப்பு தள்ளுபடி (ரியல் எஸ்டேட் -20%, தங்கம் -5%)",
    liquid_nw_label: "உண்மையான திரவ நிகர மதிப்பு",
    tangible_translation: "உண்மையான நிதி ஒப்பீடு",
    sync_title: "ஆஃப்லைன் ஒத்திசைவு மற்றும் பரிமாற்றம்",
    scan_webcam: "கேமரா மூலம் ஸ்கேன் செய்",
    show_qr_code: "மற்றொரு சாதனத்திலிருந்து ஸ்கேன் செய்ய இந்த QR குறியீட்டை காட்டு",
    vault_title: "லைஃப்-அட்மின் ஆவண பெட்டகம்",
    vault_subtitle: "உங்கள் குடும்ப முக்கிய ஆவணங்களை பாதுகாப்பாக சேமிக்கவும்"
  },
  te: {
    title: "అపెక్స్ ఇంటెల్",
    tagline: "పూర్తిగా ఆఫ్‌లైన్ వ్యక్తిగత ఆర్థిక PWA",
    tab_budget: "బడ్జెట్ ప్లానర్",
    tab_sinking: "సింకింగ్ ఫండ్స్",
    tab_savings: "పొదుపు లక్ష్యాలు",
    tab_loan: "ఈఎంఐ ముందస్తు చెల్లింపు",
    tab_growth: "SIP వృద్ధి అంచనా",
    tab_debt: "రుణ విముక్తి",
    tab_tax: "పన్ను కాలిక్యులేటర్",
    tab_retirement: "రిటైర్మెంట్ & FIRE",
    tab_networth: "నికర విలువ",
    tab_stresstest: "ఒత్తిడి పరీక్ష",
    tab_impulse: "ఇంపల్స్ సిమ్యులేటర్",
    tab_vault: "లైఫ్ వాల్ట్",
    btn_export: "బ్యాకప్ ఎగుమతి",
    btn_import: "బ్యాకప్ దిగుమతి",
    btn_scan_qr: "QR స్కాన్ చేయి",
    btn_show_qr: "నా QR చూపించు",
    btn_add: "జతచేయి",
    btn_delete: "తొలగించు",
    btn_apply: "పరీక్షించు",
    btn_clear: "రీసెట్ చేయి",
    salary_label: "నెలవారీ చేతికి వచ్చే జీతం (₹)",
    other_income_label: "ఇతర నెలవారీ ఆదాయం (₹)",
    fixed_costs: "స్థిర ఖర్చులు (అద్దె, ఈఎంఐ)",
    variable_costs: "అస్థిర ఖర్చులు (భోజనం, వినోదం)",
    agility_score: "ఆర్థిక చురుకుదనం స్కోరు",
    agility_tooltip: "స్థిర బిల్లులకు కేటాయించని మీ ఆదాయ భాగాన్ని ఇది కొలుస్తుంది. ఎక్కువ ఉంటే ఆర్థిక ఒడిదుడుకులను సులభంగా ఎదుర్కోవచ్చు.",
    sinking_fund_deduction: "సింకింగ్ ఫండ్ నెలవారీ కోత",
    surplus_label: "మిగిలిన నెలవారీ అదనపు బడ్జెట్",
    impulse_title: "నేను ఇది కొనాలా? (ఇంపల్స్ సిమ్యులేటర్)",
    item_cost: "వస్తువు ధర (₹)",
    labor_cost_calc: "శ్రమ సమయపు ఖరీదు",
    labor_hours_msg: "ఈ వస్తువు కొనడానికి మీరు {hours} గంటల పాటు శ్రమించాలి (₹{rate}/గంట ప్రాతిపదికన).",
    opportunity_cost_calc: "అవకాశపు ఖరీదు (15 సంవత్సరాలు)",
    opp_cost_msg: "దీనిని 12% వడ్డీతో పెట్టుబడి పెడితే, 15 ఏళ్లలో ₹{val} అవుతుంది.",
    monte_carlo_title: "మోంటే కార్లో సంపద అంచనా",
    best_case: "అత్యుత్తమ మార్గం ({rate}%)",
    median_case: "మధ్యస్థ మార్గం ({rate}%)",
    worst_case: "అల్ప మార్గం ({rate}%)",
    fire_title: "FIRE స్పీడోమీటర్",
    fire_target: "FIRE లక్ష్య నిధి",
    fire_autonomy: "FIRE ప్రగతి",
    fire_tooltip: "FIRE లక్ష్యం మీ వార్షిక ఖర్చులకు 25x-30x రెట్లుగా లెక్కించబడుతుంది.",
    sinking_fund_title: "సింకింగ్ ఫండ్ (వార్షిక ఖాతా)",
    annual_expense_name: "వార్షిక ఖర్చు పేరు",
    annual_amount: "వార్షిక మొత్తం (₹)",
    sinking_withholding: "నెలవారీ పొదుపు (₹{val}/నెల)",
    haircut_label: "ఆస్తుల విలువ తగ్గింపు (రియల్ ఎస్టేట్ -20%, బంగారం -5%)",
    liquid_nw_label: "నిజమైన నికర విలువ",
    tangible_translation: "వాస్తవిక సంపద పోలిక",
    sync_title: "ఆఫ్‌లైన్ సింక్ & బదిలీ",
    scan_webcam: "కెమెరాతో స్కాన్ చేయి",
    show_qr_code: "మరో పరికరం నుండి స్కాన్ చేయడానికి ఈ క్యూఆర్ చూపించు",
    vault_title: "లైఫ్-అడ్మిన్ డాక్యుమెంట్ వాల్ట్",
    vault_subtitle: "మీ ముఖ్యమైన కుటుంబ రికార్డులను ఆఫ్‌లైన్ లో భద్రపరచుకోండి"
  }
};

// ====================================================
// INITIAL SYSTEM DEFAULT STATE
// ====================================================
const initialAppState = {
  lang: 'en',
  theme: 'theme-emerald-matrix',
  dark: true,
  salary: 120000,
  otherIncome: 18000,
  fixedExpenses: [
    { id: 1, name: 'House Rent & Bills', amount: 30000 },
    { id: 2, name: 'Vehicle Loan EMI', amount: 15000 },
    { id: 3, name: 'Term & Health Insurance', amount: 4000 }
  ],
  variableExpenses: [
    { id: 4, name: 'Groceries & Foods', amount: 18000 },
    { id: 5, name: 'Dining out & Leisure', amount: 10000 },
    { id: 6, name: 'Travel & Subscriptions', amount: 8000 }
  ],
  impulseCost: 25000,
  fireFactor: 25,
  currentLiquidAssets: 600000,
  stressTestApplied: {
    jobLoss: false,
    medicalEmergency: false
  },
  sinkingFunds: [
    { id: 1, name: 'Car Insurance & Maintenance', annualAmount: 24000 },
    { id: 2, name: 'Annual Holiday Budget', annualAmount: 84000 }
  ],
  applyHaircut: false,
  assets: {
    cash: 250000,
    stocks: 650000,
    gold: 300000,
    property: 5500000,
    other: 100000
  },
  liabilities: {
    homeLoan: 1500000,
    personalLoan: 120000,
    creditCard: 22000,
    otherDebt: 0
  },
  documentVault: {
    termLifeNominee: false,
    willDrafted: false,
    passwordsShared: false,
    healthCardsPrinted: false,
    bankNomineeAdded: false
  },
  privacyActive: false,
  savingsGoals: [
    { id: 1, name: 'Emergency Fund (6mo Expenses)', target: 500000, saved: 250000 },
    { id: 2, name: 'International Trip', target: 200000, saved: 60000 }
  ],
  emiPrincipal: 1500000,
  emiRate: 9.25,
  emiTenure: 120,
  emiPrepayment: 15000,
  customDebts: null,
  debtExtra: 15000,
  
  // Growth simulation inputs
  growthLumpSum: 100000,
  growthSIP: 20000,
  growthDuration: 15,
  growthReturnWorst: 8,
  growthReturnMedian: 12,
  growthReturnBest: 16,

  // Tax inputs
  taxSalary: 1800000,
  taxInvestments80C: 150000,
  taxMedical80D: 25000,
  taxHRA: 180000,
  taxOtherDeductions: 50000,

  // Retirement inputs
  retCurrentAge: 28,
  retTargetAge: 52,
  retLifeExpectancy: 85,
  retInflation: 6,
  retPreRetReturn: 12,
  retPostRetReturn: 8
};

const formatINR = (num) => {
  return '₹' + Math.round(num).toLocaleString('en-IN');
};

const OnboardingDot = ({ text }) => {
  return (
    <span className="tooltip-container ml-1.5">
      <span className="pulse-guide w-3 h-3 cursor-help inline-block"></span>
      <span className="tooltip-text">{text}</span>
    </span>
  );
};

// ====================================================
// CORE APPLICATION CONTAINER
// ====================================================
export default function App() {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem('apex_wealth_secured_state');
    if (saved) {
      const decrypted = decryptState(saved);
      if (decrypted) {
        return { ...initialAppState, ...decrypted };
      }
    }
    return initialAppState;
  });

  const [activeTab, setActiveTab] = useState('budget');
  const [showQrModal, setShowQrModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scanError, setScanError] = useState('');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Sync encrypted state on updates & set HTML theme class
  useEffect(() => {
    const cipher = encryptState(state);
    localStorage.setItem('apex_wealth_secured_state', cipher);
    document.documentElement.className = state.theme + (state.dark ? ' dark' : '');
  }, [state]);

  // Double Escape Panic Key
  useEffect(() => {
    let lastEsc = 0;
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        const now = Date.now();
        if (now - lastEsc < 500) {
          localStorage.removeItem('apex_wealth_secured_state');
          window.location.href = 'https://www.google.com';
        }
        lastEsc = now;
      }
    };
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, []);

  const t = (key, replacements = {}) => {
    const lang = state.lang || 'en';
    let text = i18n[lang]?.[key] || i18n['en']?.[key] || key;
    Object.keys(replacements).forEach(r => {
      text = text.replace(`{${r}}`, replacements[r]);
    });
    return text;
  };

  // Masking filter component for privacy mode
  const MaskValue = ({ value, isCurrency = true }) => {
    const [isHovered, setIsHovered] = useState(false);
    const displayVal = isCurrency ? formatINR(value) : value;

    if (!state.privacyActive) {
      return <span>{displayVal}</span>;
    }

    return (
      <span 
        className="relative inline-block cursor-pointer select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsHovered(!isHovered)}
      >
        <motion.span
          animate={{ filter: isHovered ? "blur(0px)" : "blur(6px)" }}
          transition={{ duration: 0.15 }}
          className="inline-block font-mono font-bold text-appText"
        >
          {displayVal}
        </motion.span>
        {!isHovered && (
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-appTextSec/60 tracking-wider pointer-events-none select-none">
            ₹***
          </span>
        )}
      </span>
    );
  };

  // Calculations for Budgets & Sinking funds
  const sinkingFundWithholding = useMemo(() => {
    const totalAnnual = state.sinkingFunds.reduce((sum, item) => sum + item.annualAmount, 0);
    return totalAnnual / 12;
  }, [state.sinkingFunds]);

  const budgetMetrics = useMemo(() => {
    const totalIncome = state.salary + state.otherIncome;
    const totalFixed = state.fixedExpenses.reduce((sum, item) => sum + item.amount, 0);
    const totalVariable = state.variableExpenses.reduce((sum, item) => sum + item.amount, 0);
    
    const totalExpenses = totalFixed + totalVariable + sinkingFundWithholding;
    const surplus = totalIncome - totalExpenses;

    const fixedRatio = totalIncome > 0 ? (totalFixed / totalIncome) * 100 : 100;
    const agilityScore = Math.max(0, 100 - fixedRatio);

    // 50/30/20 budget allocations
    const ideal50 = totalIncome * 0.50; // Needs
    const ideal30 = totalIncome * 0.30; // Wants
    const ideal20 = totalIncome * 0.20; // Savings

    const actual50 = totalFixed + sinkingFundWithholding;
    const actual30 = totalVariable;
    const actual20 = Math.max(0, surplus);

    const pct50 = totalIncome > 0 ? Math.min(100, (actual50 / totalIncome) * 100) : 0;
    const pct30 = totalIncome > 0 ? Math.min(100, (actual30 / totalIncome) * 100) : 0;
    const pct20 = totalIncome > 0 ? Math.min(100, (actual20 / totalIncome) * 100) : 0;

    return { 
      totalIncome, totalFixed, totalVariable, totalExpenses, surplus, agilityScore, 
      ideal50, ideal30, ideal20, actual50, actual30, actual20, pct50, pct30, pct20 
    };
  }, [state.salary, state.otherIncome, state.fixedExpenses, state.variableExpenses, sinkingFundWithholding]);

  const impulseOppCost = state.impulseCost * 5.9958;
  const laborRatePerHour = state.salary / 160;
  const laborHoursRequired = laborRatePerHour > 0 ? state.impulseCost / laborRatePerHour : 0;

  // Net worth & asset slashes (stress testing & haircuts)
  const netWorthMetrics = useMemo(() => {
    let cashVal = state.assets.cash;
    let stocksVal = state.assets.stocks;
    let goldVal = state.assets.gold;
    let propertyVal = state.assets.property;
    let otherVal = state.assets.other;

    if (state.stressTestApplied.jobLoss) {
      cashVal = Math.max(-200000, cashVal - (budgetMetrics.totalExpenses * 6));
    }
    if (state.stressTestApplied.medicalEmergency) {
      cashVal = Math.max(-500000, cashVal - 500000);
    }

    if (state.applyHaircut) {
      propertyVal = propertyVal * 0.80; // 20% haircut
      goldVal = goldVal * 0.95;       // 5% haircut
    }

    const totalAssets = cashVal + stocksVal + goldVal + propertyVal + otherVal;
    const totalLiabilities = Object.values(state.liabilities).reduce((a, b) => a + b, 0);
    const netWorth = totalAssets - totalLiabilities;

    const liquidAssets = cashVal + stocksVal + (state.applyHaircut ? goldVal : goldVal * 0.95);
    const trueLiquidNetWorth = liquidAssets - totalLiabilities;

    return { totalAssets, totalLiabilities, netWorth, trueLiquidNetWorth, cashVal };
  }, [state.assets, state.liabilities, state.applyHaircut, state.stressTestApplied, budgetMetrics]);

  // FIRE speedometer Autonomy
  const fireMetrics = useMemo(() => {
    const annualExpenses = budgetMetrics.totalExpenses * 12;
    const targetCorpus = annualExpenses * state.fireFactor;
    const liquidAssets = state.assets.cash + state.assets.stocks;
    const progressPct = targetCorpus > 0 ? Math.min(100, (liquidAssets / targetCorpus) * 100) : 0;
    return { targetCorpus, progressPct };
  }, [budgetMetrics, state.fireFactor, state.assets]);

  const stressTestWarnings = useMemo(() => {
    const warnings = [];
    if (netWorthMetrics.cashVal < 0) {
      warnings.push(`Emergency cash exhausted! Deficit of ${formatINR(Math.abs(netWorthMetrics.cashVal))}. Life plans disrupted.`);
    }
    return warnings;
  }, [netWorthMetrics.cashVal]);

  const tangibleMessage = useMemo(() => {
    const nw = netWorthMetrics.netWorth;
    if (nw < 50000) return "Equivalent to forming basic family cash reserves.";
    if (nw < 500000) return "Equivalent to 6 months of groceries for the entire family.";
    if (nw < 2000000) return "Equivalent to Term Life and Comprehensive Health covers fully paid.";
    return "Equivalent to a comfortable Tier-1 2BHK flat paid in cash.";
  }, [netWorthMetrics.netWorth]);

  // QR Sync State Encoding
  const qrStateString = useMemo(() => {
    const core = {
      salary: state.salary,
      otherIncome: state.otherIncome,
      fixedExpenses: state.fixedExpenses,
      variableExpenses: state.variableExpenses,
      sinkingFunds: state.sinkingFunds,
      assets: state.assets,
      liabilities: state.liabilities,
      documentVault: state.documentVault,
      fireFactor: state.fireFactor
    };
    return btoa(unescape(encodeURIComponent(JSON.stringify(core))));
  }, [state]);

  const handleExportJson = () => {
    try {
      const cipher = encryptState(state);
      const blob = new Blob([cipher], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `apex_wealth_backup_${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Backup export failed.");
    }
  };

  const handleImportJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (typeof text !== 'string') return;
        const decrypted = decryptState(text);
        if (decrypted && decrypted.salary !== undefined) {
          setState(prev => ({ ...prev, ...decrypted }));
          alert("Backup imported successfully!");
        } else {
          alert("Invalid backup file: decryption failed or format mismatch.");
        }
      } catch (err) {
        alert("Failed to read file.");
      }
    };
    reader.readAsText(file);
  };

  const html5QrScannerRef = useRef(null);
  const startCameraScanner = () => {
    setScanError('');
    setShowScanner(true);
    setTimeout(() => {
      html5QrScannerRef.current = new Html5Qrcode("scanner-viewport");
      html5QrScannerRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText) => {
          try {
            const data = JSON.parse(decodeURIComponent(escape(atob(decodedText))));
            setState(prev => ({ ...prev, ...data }));
            closeCameraScanner();
            alert("Partner state hydrated successfully!");
          } catch (e) {
            setScanError("Failed to parse scan: invalid PWA state.");
          }
        },
        () => {}
      ).catch(() => {
        setScanError("Camera permission denied or active on another app.");
      });
    }, 100);
  };

  const closeCameraScanner = () => {
    if (html5QrScannerRef.current) {
      html5QrScannerRef.current.stop().then(() => {
        setShowScanner(false);
      }).catch(() => {
        setShowScanner(false);
      });
    } else {
      setShowScanner(false);
    }
  };

  // Interactive Growth / Monte Carlo Simulator calculations
  const monteCarloData = useMemo(() => {
    const data = [];
    let worst = state.growthLumpSum;
    let median = state.growthLumpSum;
    let best = state.growthLumpSum;

    const rW = (state.growthReturnWorst / 12) / 100;
    const rM = (state.growthReturnMedian / 12) / 100;
    const rB = (state.growthReturnBest / 12) / 100;

    for (let y = 1; y <= state.growthDuration; y++) {
      for (let m = 1; m <= 12; m++) {
        worst = (worst + state.growthSIP) * (1 + rW);
        median = (median + state.growthSIP) * (1 + rM);
        best = (best + state.growthSIP) * (1 + rB);
      }
      data.push({
        name: `Yr ${y}`,
        Worst: Math.round(worst),
        Median: Math.round(median),
        Best: Math.round(best)
      });
    }
    return data;
  }, [state.growthLumpSum, state.growthSIP, state.growthDuration, state.growthReturnWorst, state.growthReturnMedian, state.growthReturnBest]);

  // EMI Calculator with Prepayment Simulations
  const emiCalculations = useMemo(() => {
    const P = state.emiPrincipal;
    const r = (state.emiRate / 12) / 100;
    const n = state.emiTenure;
    const prepay = state.emiPrepayment || 0;

    // Standard EMI
    const standardEmi = r > 0 
      ? Math.round(P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)) 
      : Math.round(P / n);
    const standardTotalPayable = standardEmi * n;
    const standardInterest = standardTotalPayable - P;

    // Simulation with Prepayments
    let balance = P;
    let monthsPaid = 0;
    let totalInterestPaidWithPrepay = 0;
    const amortizationSchedule = [];

    while (balance > 0 && monthsPaid < 360) {
      monthsPaid++;
      const interestPart = balance * r;
      const principalPaid = Math.min(balance, standardEmi - interestPart + prepay);
      balance = Math.max(0, balance - principalPaid);
      totalInterestPaidWithPrepay += interestPart;

      if (monthsPaid % 12 === 0 || balance === 0) {
        amortizationSchedule.push({
          year: Math.ceil(monthsPaid / 12),
          month: monthsPaid,
          balance: Math.round(balance),
          percentPaid: Math.round((1 - balance / P) * 100)
        });
      }
      if (balance === 0) break;
    }

    const prepayTotalPayable = P + totalInterestPaidWithPrepay;
    const interestSaved = Math.max(0, standardInterest - totalInterestPaidWithPrepay);
    const tenureSaved = Math.max(0, n - monthsPaid);

    return {
      standardEmi,
      standardTotalPayable,
      standardInterest,
      prepayTenure: monthsPaid,
      prepayInterest: Math.round(totalInterestPaidWithPrepay),
      prepayTotalPayable: Math.round(prepayTotalPayable),
      interestSaved: Math.round(interestSaved),
      tenureSaved,
      amortizationSchedule
    };
  }, [state.emiPrincipal, state.emiRate, state.emiTenure, state.emiPrepayment]);

  // Indian Income Tax Regime Calculator (FY 2025-26 slabs)
  const taxCalculations = useMemo(() => {
    const salary = state.taxSalary;
    
    // New regime Standard Deduction
    const newStdDed = 75000;
    const newTaxable = Math.max(0, salary - newStdDed);
    
    // Slabs:
    // Up to 4L: Nil
    // 4L to 8L: 5%
    // 8L to 12L: 10%
    // 12L to 16L: 15%
    // 16L to 20L: 20%
    // Above 20L: 30%
    let newTax = 0;
    if (newTaxable > 2000000) {
      newTax += (newTaxable - 2000000) * 0.30 + 20000 + 40000 + 60000 + 80000;
    } else if (newTaxable > 1600000) {
      newTax += (newTaxable - 1600000) * 0.20 + 20000 + 40000 + 60000;
    } else if (newTaxable > 1200000) {
      newTax += (newTaxable - 1200000) * 0.15 + 20000 + 40000;
    } else if (newTaxable > 800000) {
      newTax += (newTaxable - 800000) * 0.10 + 20000;
    } else if (newTaxable > 400000) {
      newTax += (newTaxable - 400000) * 0.05;
    }
    
    // New regime rebate under 87A: standard rebate up to 1.2L (taxable <= 12,00,000 becomes 0 tax)
    if (newTaxable <= 1200000) {
      newTax = 0;
    }
    const finalNewTax = newTax * 1.04; // Cess 4%

    // Old Regime Standard Deduction + Deductions
    const oldStdDed = 50000;
    const totalOldDeductions = state.taxInvestments80C + state.taxMedical80D + state.taxHRA + state.taxOtherDeductions;
    const oldTaxable = Math.max(0, salary - oldStdDed - totalOldDeductions);
    
    // Slabs:
    // Up to 2.5L: Nil
    // 2.5L to 5L: 5%
    // 5L to 10L: 20%
    // Above 10L: 30%
    let oldTax = 0;
    if (oldTaxable > 1000000) {
      oldTax += (oldTaxable - 1000000) * 0.30 + 100000 + 12500;
    } else if (oldTaxable > 500000) {
      oldTax += (oldTaxable - 500000) * 0.20 + 12500;
    } else if (oldTaxable > 250000) {
      oldTax += (oldTaxable - 250000) * 0.05;
    }
    
    // Old regime rebate under 87A: tax is zero if taxable income <= 5,00,000
    if (oldTaxable <= 500000) {
      oldTax = 0;
    }
    const finalOldTax = oldTax * 1.04; // Cess 4%

    const recommendation = finalNewTax < finalOldTax 
      ? `New Tax Regime is better (Saves ${formatINR(finalOldTax - finalNewTax)})` 
      : finalOldTax < finalNewTax 
        ? `Old Tax Regime is better (Saves ${formatINR(finalNewTax - finalOldTax)})`
        : `Both tax regimes result in the same tax liability`;

    return {
      newTaxable,
      oldTaxable,
      newTax: Math.round(finalNewTax),
      oldTax: Math.round(finalOldTax),
      recommendation,
      totalOldDeductions
    };
  }, [state.taxSalary, state.taxInvestments80C, state.taxMedical80D, state.taxHRA, state.taxOtherDeductions]);

  // Retirement Planner Calculation & Accumulation Drawdown Projection
  const retirementCalculations = useMemo(() => {
    const currentAge = state.retCurrentAge;
    const targetAge = state.retTargetAge;
    const lifeExp = state.retLifeExpectancy;
    const inflation = state.retInflation / 100;
    const preRetRate = state.retPreRetReturn / 100;
    const postRetRate = state.retPostRetReturn / 100;

    const annualExpenses = budgetMetrics.totalExpenses * 12;
    const yearsToRet = Math.max(0, targetAge - currentAge);
    const retYears = Math.max(1, lifeExp - targetAge);

    // Inflated annual expenses at retirement year
    const inflatedExpensesAtRet = annualExpenses * Math.pow(1 + inflation, yearsToRet);
    
    // Inflation adjusted real return in retirement
    const realReturn = ((1 + postRetRate) / (1 + inflation)) - 1;

    // Corpus target needed using annuity due formula
    const targetCorpus = realReturn > 0
      ? inflatedExpensesAtRet * ((1 - Math.pow(1 + realReturn, -retYears)) / realReturn) * (1 + realReturn)
      : inflatedExpensesAtRet * retYears;

    // Projection phase plotting: accumulation & decumulation
    const retirementGraphData = [];
    let balance = state.assets.cash + state.assets.stocks; // start with current liquid assets
    const annualSavings = Math.max(0, budgetMetrics.surplus * 12);

    for (let age = currentAge; age <= lifeExp; age++) {
      if (age < targetAge) {
        // Accumulate phase
        balance = (balance + annualSavings) * (1 + preRetRate);
        retirementGraphData.push({
          age: `Age ${age}`,
          Wealth: Math.round(balance),
          type: 'Accumulation'
        });
      } else {
        // Drawdown phase
        const currentWithdrawal = inflatedExpensesAtRet * Math.pow(1 + inflation, age - targetAge);
        balance = Math.max(0, balance - currentWithdrawal) * (1 + postRetRate);
        retirementGraphData.push({
          age: `Age ${age}`,
          Wealth: Math.round(balance),
          type: 'Drawdown'
        });
      }
    }

    const isSuccess = balance > 0;

    return {
      inflatedExpensesAtRet: Math.round(inflatedExpensesAtRet),
      targetCorpus: Math.round(targetCorpus),
      retirementGraphData,
      isSuccess,
      retYears,
      endingBalance: Math.round(balance)
    };
  }, [state.retCurrentAge, state.retTargetAge, state.retLifeExpectancy, state.retInflation, state.retPreRetReturn, state.retPostRetReturn, budgetMetrics, state.assets]);

  // Debt snowball vs avalanche simulations
  const debtPayoffCalculations = useMemo(() => {
    const debts = state.customDebts || [
      { id: 1, name: 'Credit Card', balance: 75000, rate: 36, minPayment: 3500 },
      { id: 2, name: 'Personal Loan', balance: 200000, rate: 14, minPayment: 5000 },
      { id: 3, name: 'Car Loan', balance: 350000, rate: 9.5, minPayment: 8500 }
    ];
    const extraMonthly = state.debtExtra || 10000;
    const totalDebt = debts.reduce((s, d) => s + d.balance, 0);
    const totalMinPayment = debts.reduce((s, d) => s + d.minPayment, 0);

    const avalanche = [...debts].sort((a, b) => b.rate - a.rate);
    const snowball = [...debts].sort((a, b) => a.balance - b.balance);

    const runSimulation = (orderedDebts) => {
      let balances = orderedDebts.map(d => ({ ...d, bal: d.balance }));
      let months = 0;
      let totalInterestPaid = 0;

      while (balances.some(d => d.bal > 0) && months < 360) {
        months++;
        let extraAvailable = extraMonthly;
        
        // Step 1: Charge interest and pay minimums
        balances = balances.map(d => {
          if (d.bal <= 0) return d;
          const monthlyInt = d.bal * ((d.rate / 12) / 100);
          totalInterestPaid += monthlyInt;
          const payment = Math.min(d.bal + monthlyInt, d.minPayment);
          return { ...d, bal: Math.max(0, d.bal + monthlyInt - payment) };
        });

        // Step 2: Allocate extra snowball/avalanche cash to first active debt
        for (let i = 0; i < balances.length; i++) {
          if (balances[i].bal > 0 && extraAvailable > 0) {
            const pay = Math.min(balances[i].bal, extraAvailable);
            balances[i].bal = Math.max(0, balances[i].bal - pay);
            extraAvailable -= pay;
          }
        }
      }

      return { months, interest: Math.round(totalInterestPaid) };
    };

    const avalancheResults = runSimulation(avalanche);
    const snowballResults = runSimulation(snowball);

    return {
      debts,
      totalDebt,
      totalMinPayment,
      avalancheMonths: avalancheResults.months,
      avalancheInterest: avalancheResults.interest,
      snowballMonths: snowballResults.months,
      snowballInterest: snowballResults.interest
    };
  }, [state.customDebts, state.debtExtra]);

  // Tab navigation configuration (12 items)
  const tabsList = [
    { id: 'budget', icon: <Wallet size={16} />, label: t('tab_budget') },
    { id: 'sinking', icon: <CalendarDays size={16} />, label: t('tab_sinking') },
    { id: 'savings', icon: <Target size={16} />, label: t('tab_savings') },
    { id: 'loan', icon: <CreditCard size={16} />, label: t('tab_loan') },
    { id: 'growth', icon: <TrendingUp size={16} />, label: t('tab_growth') },
    { id: 'debt', icon: <Percent size={16} />, label: t('tab_debt') },
    { id: 'tax', icon: <Scale size={16} />, label: t('tab_tax') },
    { id: 'retirement', icon: <Hourglass size={16} />, label: t('tab_retirement') },
    { id: 'networth', icon: <BarChart3 size={16} />, label: t('tab_networth') },
    { id: 'stresstest', icon: <ShieldAlert size={16} />, label: t('tab_stresstest') },
    { id: 'impulse', icon: <Sparkles size={16} />, label: t('tab_impulse') },
    { id: 'vault', icon: <Lock size={16} />, label: t('tab_vault') }
  ];

  // Recharts Custom Gradient Tooltip
  const RechartsTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-4 rounded-2xl shadow-2xl text-xs space-y-1.5 border border-appBorder">
          <p className="font-extrabold text-appText">{label}</p>
          {payload.map((item, idx) => (
            <p key={idx} className="font-bold flex items-center gap-1.5" style={{ color: item.color || item.stroke }}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: item.color || item.stroke }}></span>
              {item.name}: <span className="font-mono font-black text-appText">{formatINR(item.value)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-appBg text-appText font-sans transition-colors duration-400 w-full overflow-x-hidden selection:bg-appPrimary/20">
      
      {/* Mobile Sticky Header (Glass overlay) */}
      <div className="md:hidden flex items-center justify-between px-6 py-4.5 bg-appCard/80 backdrop-blur-lg border-b border-appBorder/50 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-appPrimary flex items-center justify-center shadow-lg shadow-appPrimary/25">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          </div>
          <span className="font-black text-sm tracking-tight text-appText uppercase font-heading">{t('title')}</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setState(prev => ({ ...prev, dark: !prev.dark }))}
            className="p-2.5 rounded-xl border border-appBorder/60 bg-appCard text-appTextSec hover:text-appText hover:bg-appHoverBg/40 transition-all"
          >
            {state.dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button 
            onClick={() => setState(prev => ({ ...prev, privacyActive: !prev.privacyActive }))}
            className={`p-2.5 rounded-xl border transition-all ${state.privacyActive ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'border-appBorder/60 bg-appCard text-appTextSec'}`}
          >
            {state.privacyActive ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2.5 bg-appCard border border-appBorder/60 rounded-xl text-appTextSec hover:text-appText transition-all"
          >
            <Menu size={16} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="relative w-72 h-full bg-appCard/95 backdrop-blur-md p-6 flex flex-col justify-between border-r border-appBorder shadow-2xl"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-appBorder/60 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-appPrimary flex items-center justify-center shadow-lg shadow-appPrimary/25">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                    </div>
                    <div>
                      <h1 className="text-sm font-black text-appText uppercase font-heading">{t('title')}</h1>
                      <p className="text-[8px] text-appTextSec font-extrabold uppercase tracking-widest">Offline System</p>
                    </div>
                  </div>
                  <button onClick={() => setSidebarOpen(false)} className="text-appTextSec hover:text-appText p-1.5 rounded-lg hover:bg-appHoverBg/40 transition-all">
                    <X size={16} />
                  </button>
                </div>

                <nav className="space-y-1 overflow-y-auto max-h-[70vh] pr-1">
                  {tabsList.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${activeTab === tab.id ? 'bg-appPrimary text-white shadow-lg shadow-appPrimary/20' : 'text-appTextSec hover:bg-appHoverBg hover:text-appText'}`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="border-t border-appBorder pt-4">
                <button 
                  onClick={() => { setSidebarOpen(false); setShowSettingsModal(true); }}
                  className="w-full flex items-center justify-start gap-3 px-3.5 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-appTextSec hover:bg-appHoverBg hover:text-appText transition-all"
                >
                  <Settings size={15} />
                  <span>Settings</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Floating Left Glass Sidebar */}
      <LayoutGroup>
        <aside className="hidden md:flex flex-col w-64 glass-panel m-4 rounded-2xl h-[calc(100vh-2rem)] sticky top-4 z-30 shrink-0 select-none shadow-2xl">
          <div className="p-6 border-b border-appBorder/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-appPrimary flex items-center justify-center shadow-lg shadow-appPrimary/25 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            </div>
            <div>
              <h1 className="text-base font-extrabold text-appText tracking-tight uppercase font-heading">{t('title')}</h1>
            </div>
          </div>

          <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto pr-2">
            {tabsList.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-colors duration-250 z-10 ${isActive ? 'text-white' : 'text-appTextSec hover:text-appText'}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-appPrimary rounded-xl -z-10 shadow-lg shadow-appPrimary/25"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-appBorder/50">
            <button 
              onClick={() => setShowSettingsModal(true)}
              className="w-full flex items-center justify-start gap-3.5 px-4 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider text-appTextSec hover:bg-appHoverBg hover:text-appText transition-all border border-transparent hover:border-appBorder/40"
            >
              <Settings size={15} />
              <span>Settings</span>
            </button>
          </div>
        </aside>
      </LayoutGroup>

      {/* Main Spacious Workspace View */}
      <div className="flex-grow flex flex-col min-h-screen overflow-x-hidden p-0 md:p-4 md:pl-0">
        
        {/* Desktop Sticky Header panel */}
        <header className="hidden md:flex justify-between items-center px-8 py-5 glass-panel rounded-2xl shadow-xl z-20 mb-4 select-none">
          <div>
            <h2 className="text-base font-black text-appText uppercase tracking-widest font-heading">{t(`tab_${activeTab}`)}</h2>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex items-center gap-2 text-xs font-black bg-emerald-500/10 text-emerald-500 px-3.5 py-2 rounded-xl border border-emerald-500/20">
              <Activity size={14} className="animate-pulse" />
              <span>Surplus: <MaskValue value={budgetMetrics.surplus} /></span>
            </div>

            <button 
              onClick={() => setState(prev => ({ ...prev, dark: !prev.dark }))}
              className="p-2.5 rounded-xl border border-appBorder bg-appCard/50 text-appTextSec hover:text-appText hover:bg-appHoverBg/40 transition-all"
              title="Toggle theme mode"
            >
              {state.dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            <button 
              onClick={() => setState(prev => ({ ...prev, privacyActive: !prev.privacyActive }))}
              className={`p-2.5 rounded-xl border transition-all ${state.privacyActive ? 'bg-red-500/10 border-red-500/25 text-red-400' : 'border-appBorder bg-appCard/50 text-appTextSec hover:text-appText'}`}
              title="Privacy Value Blurring"
            >
              {state.privacyActive ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>

            <button 
              onClick={() => setShowSettingsModal(true)}
              className="p-2.5 rounded-xl border border-appBorder bg-appCard/50 text-appTextSec hover:text-appText hover:bg-appHoverBg/40 transition-all"
              title="Settings Preferences"
            >
              <Settings size={15} />
            </button>
          </div>
        </header>

        {/* Global HUD Metrics Strip */}
        <div className="px-4 md:px-0 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="glass-card p-5 flex items-center justify-between relative overflow-hidden">
              <div className="space-y-1.5 z-10">
                <p className="text-[10px] uppercase font-black tracking-widest text-appTextSec">Total Net Worth</p>
                <h3 className="text-2xl font-black text-appText font-mono"><MaskValue value={netWorthMetrics.netWorth} /></h3>
              </div>
              <div className="w-11 h-11 rounded-xl bg-appPrimary/10 flex items-center justify-center text-appPrimary z-10 shadow-sm border border-appPrimary/10">
                <BarChart3 size={18} />
              </div>
            </div>

            <div className="glass-card p-5 flex items-center justify-between relative overflow-hidden">
              <div className="space-y-1.5 z-10">
                <p className="text-[10px] uppercase font-black tracking-widest text-appTextSec">Liquid net worth</p>
                <h3 className="text-2xl font-black text-emerald-500 font-mono"><MaskValue value={netWorthMetrics.trueLiquidNetWorth} /></h3>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 z-10 shadow-sm border border-emerald-500/10">
                <Wallet size={18} />
              </div>
            </div>

            <div className="glass-card p-5 flex items-center justify-between relative overflow-hidden">
              <div className="space-y-1.5 z-10">
                <p className="text-[10px] uppercase font-black tracking-widest text-appTextSec">Monthly Savings Surplus</p>
                <h3 className="text-2xl font-black text-appPrimary font-mono"><MaskValue value={budgetMetrics.surplus} /></h3>
              </div>
              <div className="w-11 h-11 rounded-xl bg-appPrimary/10 flex items-center justify-center text-appPrimary z-10 shadow-sm border border-appPrimary/10">
                <Sparkles size={18} />
              </div>
            </div>

            <div className="glass-card p-5 flex items-center justify-between relative overflow-hidden">
              <div className="space-y-1.5 z-10">
                <p className="text-[10px] uppercase font-black tracking-widest text-appTextSec">Financial Agility</p>
                <h3 className="text-2xl font-black text-violet-500 font-mono">{Math.round(budgetMetrics.agilityScore)}%</h3>
              </div>
              <div className="w-11 h-11 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500 z-10 shadow-sm border border-violet-500/10">
                <TrendingUp size={18} />
              </div>
            </div>

          </div>
        </div>

        {/* Tab Contents Main Area (Glass Panels) */}
        <main className="px-4 md:px-0 flex-grow flex flex-col justify-start">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.985 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="w-full flex-grow flex flex-col justify-start"
            >
              
              {/* TAB 1: BUDGET PLANNER - NEAT & CLEAN */}
              {activeTab === 'budget' && (
                <div className="space-y-6">
                  {/* HUD Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* HUD 1: Total Income */}
                    <div className="glass-card p-5 flex items-center justify-between hover:scale-[1.02] transition-transform duration-200">
                      <div className="space-y-1">
                        <span className="text-[10px] text-appTextSec uppercase font-black tracking-wider block">Take-Home Income</span>
                        <div className="text-xl font-black text-appText font-mono">
                          <MaskValue value={budgetMetrics.totalIncome} />
                        </div>
                      </div>
                      <div className="p-3 bg-appPrimary/10 rounded-xl text-appPrimary shadow-inner">
                        <Wallet size={18} />
                      </div>
                    </div>

                    {/* HUD 2: Monthly Expenses */}
                    <div className="glass-card p-5 flex items-center justify-between hover:scale-[1.02] transition-transform duration-200">
                      <div className="space-y-1">
                        <span className="text-[10px] text-appTextSec uppercase font-black tracking-wider block">Total Expenses</span>
                        <div className="text-xl font-black text-appText font-mono">
                          <MaskValue value={budgetMetrics.totalExpenses} />
                        </div>
                      </div>
                      <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500 shadow-inner">
                        <Scale size={18} />
                      </div>
                    </div>

                    {/* HUD 3: Net Surplus */}
                    <div className="glass-card p-5 flex items-center justify-between hover:scale-[1.02] transition-transform duration-200">
                      <div className="space-y-1">
                        <span className="text-[10px] text-appTextSec uppercase font-black tracking-wider block">Monthly Surplus</span>
                        <div className={`text-xl font-black font-mono ${budgetMetrics.surplus >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                          <MaskValue value={budgetMetrics.surplus} />
                        </div>
                      </div>
                      <div className={`p-3 rounded-xl shadow-inner ${budgetMetrics.surplus >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                        <TrendingUp size={18} />
                      </div>
                    </div>

                    {/* HUD 4: Financial Agility */}
                    <div className="glass-card p-5 flex items-center justify-between hover:scale-[1.02] transition-transform duration-200">
                      <div className="space-y-1">
                        <span className="text-[10px] text-appTextSec uppercase font-black tracking-wider block">Financial Agility</span>
                        <div className="text-xl font-black text-appText font-mono flex items-center gap-1.5">
                          {Math.round(budgetMetrics.agilityScore)}%
                          <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${budgetMetrics.agilityScore > 65 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : budgetMetrics.agilityScore >= 45 ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                            {budgetMetrics.agilityScore > 65 ? "Flexible" : budgetMetrics.agilityScore >= 45 ? "Moderate" : "Locked"}
                          </span>
                        </div>
                      </div>
                      <div className={`p-3 rounded-xl shadow-inner ${budgetMetrics.agilityScore > 65 ? 'bg-emerald-500/10 text-emerald-400' : budgetMetrics.agilityScore >= 45 ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400'}`}>
                        <Activity size={18} />
                      </div>
                    </div>
                  </div>

                  {/* Top section: Income & 50/30/20 Analyzer */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Take-Home Configuration */}
                    <div className="glass-card p-6 space-y-5 lg:col-span-1 h-fit">
                      <div className="flex items-center gap-2 border-b border-appBorder/50 pb-4">
                        <Wallet className="text-appPrimary" size={16} />
                        <h2 className="text-xs font-black uppercase tracking-widest text-appText font-heading">Income Streams</h2>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-[9px] text-appTextSec uppercase font-black tracking-widest mb-1.5 block">
                            Salary (Monthly Take-Home)
                          </label>
                          <div className="relative flex items-center">
                            <span className="absolute left-3.5 text-xs text-appTextSec font-bold">₹</span>
                            <input 
                              type="number" 
                              value={state.salary || ''}
                              onChange={(e) => setState(prev => ({ ...prev, salary: Number(e.target.value) }))}
                              className="w-full text-sm font-bold pl-8 focus:outline-none"
                              placeholder="0"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[9px] text-appTextSec uppercase font-black tracking-widest mb-1.5 block">
                            Other Monthly Income
                          </label>
                          <div className="relative flex items-center">
                            <span className="absolute left-3.5 text-xs text-appTextSec font-bold">₹</span>
                            <input 
                              type="number" 
                              value={state.otherIncome || ''}
                              onChange={(e) => setState(prev => ({ ...prev, otherIncome: Number(e.target.value) }))}
                              className="w-full text-sm font-bold pl-8 focus:outline-none"
                              placeholder="0"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 bg-appHoverBg/30 border border-appBorder/40 rounded-xl text-[10px] text-appTextSec leading-relaxed">
                        💡 Keep your income parameters accurate to optimize 50/30/20 target guidelines, savings trajectories, and asset safety ratios.
                      </div>
                    </div>

                    {/* 50/30/20 Allocation Guard */}
                    {(() => {
                      const { totalIncome, ideal50, ideal30, ideal20, actual50, actual30, actual20, pct50, pct30, pct20 } = budgetMetrics;
                      const rules = [
                        {
                          label: 'Needs (Fixed)',
                          emoji: '🏢',
                          pct: 50,
                          actualAmt: actual50,
                          idealAmt: ideal50,
                          barColor: 'bg-blue-500',
                          badgeBg: actual50 <= ideal50 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20',
                          badgeText: actual50 <= ideal50 ? 'On Track' : 'Over Budget',
                          tip: 'EMIs, rent, utilities, insurance.',
                        },
                        {
                          label: 'Wants (Leisure)',
                          emoji: '🎯',
                          pct: 30,
                          actualAmt: actual30,
                          idealAmt: ideal30,
                          barColor: 'bg-violet-500',
                          badgeBg: actual30 <= ideal30 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
                          badgeText: actual30 <= ideal30 ? 'On Track' : 'Over Limit',
                          tip: 'Dining out, leisure, shopping.',
                        },
                        {
                          label: 'Savings (Invest)',
                          emoji: '💰',
                          pct: 20,
                          actualAmt: actual20,
                          idealAmt: ideal20,
                          barColor: 'bg-emerald-500',
                          badgeBg: actual20 >= ideal20 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20',
                          badgeText: actual20 >= ideal20 ? 'On Track' : 'Under Target',
                          tip: 'Stocks, MFs, gold, emergency fund.',
                        },
                      ];
                      const overallOk = actual50 <= ideal50 && actual30 <= ideal30 && actual20 >= ideal20;
                      return (
                        <div className="glass-card lg:col-span-2 overflow-hidden flex flex-col justify-between">
                          <div className="flex items-center justify-between px-6 py-4 border-b border-appBorder/50">
                            <div className="flex items-center gap-2">
                              <Scale className="text-appPrimary" size={16} />
                              <h3 className="font-extrabold text-xs text-appText uppercase tracking-wider">50 / 30 / 20 Budget Analyzer</h3>
                            </div>
                            <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-md border ${overallOk ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                              {overallOk ? '✓ Balanced Allocation' : '⚠ Adjustments Advised'}
                            </span>
                          </div>

                          {/* Segmented bar */}
                          <div className="px-6 py-5">
                            <div className="relative w-full h-4.5 bg-appBorder/60 rounded-full overflow-hidden flex shadow-inner">
                              <motion.div className="h-full bg-blue-500" initial={{ width: 0 }} animate={{ width: `${pct50}%` }} transition={{ duration: 0.8, ease: "easeOut" }} />
                              <motion.div className="h-full bg-violet-500" initial={{ width: 0 }} animate={{ width: `${pct30}%` }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }} />
                              <motion.div className="h-full bg-emerald-500" initial={{ width: 0 }} animate={{ width: `${pct20}%` }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }} />
                            </div>
                            <div className="flex items-center justify-between flex-wrap gap-4 mt-3">
                              <span className="flex items-center gap-2 text-[9px] text-appTextSec font-bold">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block shadow-sm"></span>
                                Needs ({Math.round(pct50)}% / 50%)
                              </span>
                              <span className="flex items-center gap-2 text-[9px] text-appTextSec font-bold">
                                <span className="w-2.5 h-2.5 rounded-full bg-violet-500 inline-block shadow-sm"></span>
                                Wants ({Math.round(pct30)}% / 30%)
                              </span>
                              <span className="flex items-center gap-2 text-[9px] text-appTextSec font-bold">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-sm"></span>
                                Savings ({Math.round(pct20)}% / 20%)
                              </span>
                            </div>
                          </div>

                          {/* Segment Details */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-appBorder/50">
                            {rules.map((rule, idx) => (
                              <div key={rule.label} className={`p-5 space-y-3 ${idx < 2 ? 'border-r border-appBorder/50' : ''}`}>
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm">{rule.emoji}</span>
                                    <div>
                                      <div className="font-extrabold text-[11px] text-appText uppercase tracking-wider">{rule.label}</div>
                                      <div className="text-[8px] text-appTextSec font-bold">Target: {rule.pct}%</div>
                                    </div>
                                  </div>
                                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${rule.badgeBg}`}>{rule.badgeText}</span>
                                </div>

                                <div className="space-y-1.5 text-xs">
                                  <div className="flex justify-between">
                                    <span className="text-[10px] text-appTextSec">Actual:</span>
                                    <span className="font-bold font-mono text-appText text-[11px]"><MaskValue value={rule.actualAmt} /></span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-[10px] text-appTextSec">Ideal Max:</span>
                                    <span className="font-semibold text-appTextSec font-mono text-[11px]"><MaskValue value={rule.idealAmt} /></span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                  </div>

                  {/* Bottom section: Fixed and Variable Expenses Side-by-Side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Fixed Expenses */}
                    <div className="glass-card p-6 space-y-5 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-appBorder/50 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-base">🏢</span>
                            <div>
                              <h3 className="font-extrabold text-xs text-appText uppercase tracking-wider">Fixed Commitments</h3>
                              <p className="text-[9px] text-appTextSec">Rent, EMI, insurance, utilities</p>
                            </div>
                          </div>
                          <span className="font-mono text-xs font-black text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
                            Total: <MaskValue value={budgetMetrics.totalFixed} />
                          </span>
                        </div>
                        
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                          {state.fixedExpenses.length === 0 ? (
                            <div className="text-center py-8 text-[10px] text-appTextSec font-bold uppercase tracking-widest">
                              No Fixed Commitments
                            </div>
                          ) : (
                            <AnimatePresence>
                              {state.fixedExpenses.map(exp => {
                                const percentage = budgetMetrics.totalIncome > 0 ? ((exp.amount / budgetMetrics.totalIncome) * 100).toFixed(1) : 0;
                                return (
                                  <motion.div 
                                    key={exp.id} 
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.18 }}
                                    className="flex justify-between items-center text-xs text-appText font-semibold bg-appHoverBg/10 hover:bg-appHoverBg/20 p-3 rounded-xl border border-appBorder/20 transition-colors duration-150"
                                  >
                                    <div className="space-y-0.5">
                                      <div className="font-bold text-appText">{exp.name}</div>
                                      {percentage > 0 && (
                                        <div className="text-[8px] text-appTextSec font-mono font-bold uppercase tracking-wider">
                                          {percentage}% of Income
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className="font-mono font-black text-appText"><MaskValue value={exp.amount} /></span>
                                      <button 
                                        onClick={() => setState(prev => ({ ...prev, fixedExpenses: prev.fixedExpenses.filter(e => e.id !== exp.id) }))}
                                        className="text-red-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-500/10 transition-all duration-150"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </AnimatePresence>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-appBorder/50 mt-auto">
                        <div className="relative w-3/5">
                          <input 
                            id="addFixedN" 
                            type="text" 
                            placeholder="Title (e.g. Rent)" 
                            className="text-xs p-2.5 rounded-xl w-full focus:outline-none" 
                          />
                        </div>
                        <div className="relative w-2/5">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-appTextSec font-bold">₹</span>
                          <input 
                            id="addFixedA" 
                            type="number" 
                            placeholder="Amount" 
                            className="text-xs p-2.5 pl-6 rounded-xl w-full focus:outline-none" 
                          />
                        </div>
                        <button 
                          onClick={() => {
                            const n = document.getElementById('addFixedN');
                            const a = document.getElementById('addFixedA');
                            if (n?.value && a?.value) {
                              setState(prev => ({ ...prev, fixedExpenses: [...prev.fixedExpenses, { id: Date.now(), name: n.value, amount: Number(a.value) }] }));
                              n.value = ''; a.value = '';
                            }
                          }} 
                          className="bg-appPrimary hover:bg-appPrimaryHover text-white font-bold px-4 rounded-xl text-xs flex items-center justify-center transition-colors duration-150"
                        >
                          <Plus size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Variable Expenses */}
                    <div className="glass-card p-6 space-y-5 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-appBorder/50 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-base">🍿</span>
                            <div>
                              <h3 className="font-extrabold text-xs text-appText uppercase tracking-wider">Discretionary Expenses</h3>
                              <p className="text-[9px] text-appTextSec">Groceries, shopping, dining, travel</p>
                            </div>
                          </div>
                          <span className="font-mono text-xs font-black text-violet-500 bg-violet-500/10 px-2.5 py-1 rounded-md border border-violet-500/20">
                            Total: <MaskValue value={budgetMetrics.totalVariable} />
                          </span>
                        </div>
                        
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                          {state.variableExpenses.length === 0 ? (
                            <div className="text-center py-8 text-[10px] text-appTextSec font-bold uppercase tracking-widest">
                              No Discretionary Expenses
                            </div>
                          ) : (
                            <AnimatePresence>
                              {state.variableExpenses.map(exp => {
                                const percentage = budgetMetrics.totalIncome > 0 ? ((exp.amount / budgetMetrics.totalIncome) * 100).toFixed(1) : 0;
                                return (
                                  <motion.div 
                                    key={exp.id} 
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.18 }}
                                    className="flex justify-between items-center text-xs text-appText font-semibold bg-appHoverBg/10 hover:bg-appHoverBg/20 p-3 rounded-xl border border-appBorder/20 transition-colors duration-150"
                                  >
                                    <div className="space-y-0.5">
                                      <div className="font-bold text-appText">{exp.name}</div>
                                      {percentage > 0 && (
                                        <div className="text-[8px] text-appTextSec font-mono font-bold uppercase tracking-wider">
                                          {percentage}% of Income
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className="font-mono font-black text-appText"><MaskValue value={exp.amount} /></span>
                                      <button 
                                        onClick={() => setState(prev => ({ ...prev, variableExpenses: prev.variableExpenses.filter(e => e.id !== exp.id) }))}
                                        className="text-red-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-500/10 transition-all duration-150"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </AnimatePresence>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-appBorder/50 mt-auto">
                        <div className="relative w-3/5">
                          <input 
                            id="addVarN" 
                            type="text" 
                            placeholder="Title (e.g. Groceries)" 
                            className="text-xs p-2.5 rounded-xl w-full focus:outline-none" 
                          />
                        </div>
                        <div className="relative w-2/5">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-appTextSec font-bold">₹</span>
                          <input 
                            id="addVarA" 
                            type="number" 
                            placeholder="Amount" 
                            className="text-xs p-2.5 pl-6 rounded-xl w-full focus:outline-none" 
                          />
                        </div>
                        <button 
                          onClick={() => {
                            const n = document.getElementById('addVarN');
                            const a = document.getElementById('addVarA');
                            if (n?.value && a?.value) {
                              setState(prev => ({ ...prev, variableExpenses: [...prev.variableExpenses, { id: Date.now(), name: n.value, amount: Number(a.value) }] }));
                              n.value = ''; a.value = '';
                            }
                          }} 
                          className="bg-appPrimary hover:bg-appPrimaryHover text-white font-bold px-4 rounded-xl text-xs flex items-center justify-center transition-colors duration-150"
                        >
                          <Plus size={15} />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 1.5: SINKING FUNDS [NEW] - NEAT & CLEAN */}
              {activeTab === 'sinking' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Description & Total Withholding */}
                  <div className="glass-card p-6 space-y-6 lg:col-span-1 h-fit">
                    <div className="flex items-center gap-2 border-b border-appBorder/50 pb-4">
                      <CalendarDays className="text-appPrimary" size={18} />
                      <h2 className="text-xs font-black uppercase tracking-widest text-appText font-heading">Sinking Funds HUD</h2>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="text-[10px] text-appTextSec uppercase font-black tracking-widest mb-1">Total Annual Ledger Goal</div>
                        <div className="text-2xl font-black text-appText font-mono">
                          <MaskValue value={state.sinkingFunds.reduce((sum, item) => sum + item.annualAmount, 0)} />
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-appBorder/50">
                        <div className="text-[10px] text-appPrimary uppercase font-black tracking-widest mb-1">Monthly Withholding Amount</div>
                        <div className="text-2xl font-black text-emerald-500 font-mono">
                          <MaskValue value={sinkingFundWithholding} />
                        </div>
                        <p className="text-[9px] text-appTextSec mt-1 font-bold">This is automatically deducted as a Sinking Fund "Need" in the main budget surplus calculations.</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-appHoverBg/30 border border-appBorder/50 text-xs text-appTextSec leading-relaxed">
                      💡 Sinking funds are savings for specific, expected future expenses—such as insurance premiums, festivals, or holidays. Estimating them annually and reserving a fixed portion monthly protects your standard monthly surplus.
                    </div>
                  </div>

                  {/* Right Column: List & Add Form */}
                  <div className="glass-card p-6 space-y-6 lg:col-span-2">
                    <div className="flex items-center justify-between border-b border-appBorder/50 pb-4">
                      <h3 className="font-extrabold text-xs text-appText uppercase tracking-wider">📅 Sinking Fund Annual Ledgers</h3>
                    </div>

                    <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                      <AnimatePresence>
                        {state.sinkingFunds.map(fund => (
                          <motion.div 
                            key={fund.id}
                            layout
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.97 }}
                            transition={{ duration: 0.18 }}
                            className="flex justify-between items-center bg-appHoverBg/20 border border-appBorder/30 p-3.5 rounded-xl text-xs"
                          >
                            <div>
                              <div className="font-bold text-appText text-sm">{fund.name}</div>
                              <div className="text-[10px] text-appTextSec mt-0.5">Saves ₹{Math.round(fund.annualAmount/12)}/month</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-black text-appText text-sm"><MaskValue value={fund.annualAmount} /></span>
                              <button 
                                onClick={() => setState(prev => ({ ...prev, sinkingFunds: prev.sinkingFunds.filter(f => f.id !== fund.id) }))}
                                className="text-red-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-500/10 transition-all"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-appBorder/50">
                      <input id="newSinkName" type="text" placeholder="Expense Title (e.g. Festival, car tax)" className="text-xs p-3 rounded-xl w-3/5 focus:outline-none" />
                      <input id="newSinkAmt" type="number" placeholder="₹ Annual cost" className="text-xs p-3 rounded-xl w-2/5 focus:outline-none" />
                      <button 
                        onClick={() => {
                          const n = document.getElementById('newSinkName');
                          const a = document.getElementById('newSinkAmt');
                          if (n?.value && a?.value) {
                            setState(prev => ({
                              ...prev,
                              sinkingFunds: [...prev.sinkingFunds, { id: Date.now(), name: n.value, annualAmount: Number(a.value) }]
                            }));
                            n.value = ''; a.value = '';
                          }
                        }}
                        className="bg-appPrimary hover:bg-appPrimaryHover text-white px-6 rounded-xl text-xs font-black shadow-md transition-all"
                      >
                        Add Ledger
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SAVINGS GOALS */}
              {activeTab === 'savings' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card p-5 border-l-4 border-l-emerald-500">
                      <div className="text-[10px] uppercase font-black tracking-widest text-appTextSec">Monthly Savings Surplus</div>
                      <div className="text-2xl font-black text-emerald-500 font-mono mt-1"><MaskValue value={budgetMetrics.surplus} /></div>
                      <p className="text-[10px] text-appTextSec mt-1">Available to allocate monthly</p>
                    </div>

                    <div className="glass-card p-5 border-l-4 border-l-blue-500">
                      <div className="text-[10px] uppercase font-black tracking-widest text-appTextSec">Aggregate Target Goals</div>
                      <div className="text-2xl font-black text-blue-500 font-mono mt-1"><MaskValue value={state.savingsGoals.reduce((s, g) => s + g.target, 0)} /></div>
                      <p className="text-[10px] text-appTextSec mt-1">{state.savingsGoals.length} Active savings targets</p>
                    </div>

                    <div className="glass-card p-5 border-l-4 border-l-violet-500">
                      <div className="text-[10px] uppercase font-black tracking-widest text-appTextSec">Total Saved Balance</div>
                      <div className="text-2xl font-black text-violet-500 font-mono mt-1">
                        <MaskValue value={state.savingsGoals.reduce((s, g) => s + g.saved, 0)} />
                      </div>
                      <p className="text-[10px] text-appTextSec mt-1">
                        {(() => {
                          const tar = state.savingsGoals.reduce((s, g) => s + g.target, 0);
                          const sav = state.savingsGoals.reduce((s, g) => s + g.saved, 0);
                          return tar > 0 ? Math.round((sav / tar) * 100) : 0;
                        })()}% of total milestones achieved
                      </p>
                    </div>
                  </div>

                  <div className="glass-card overflow-hidden">
                    <div className="px-6 py-4 border-b border-appBorder/50">
                      <h3 className="font-extrabold text-xs text-appText uppercase tracking-wider">🎯 Savings Goals Timeline Simulator</h3>
                    </div>
                    
                    <div className="divide-y divide-appBorder/50">
                      <AnimatePresence>
                        {state.savingsGoals.map(goal => {
                          const pct = goal.target > 0 ? Math.min(100, (goal.saved / goal.target) * 100) : 0;
                          const remaining = goal.target - goal.saved;
                          const monthlySurp = budgetMetrics.surplus;
                          const monthsLeft = monthlySurp > 0 ? Math.ceil(remaining / monthlySurp) : '∞';

                          return (
                            <motion.div 
                              key={goal.id} 
                              layout
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.98 }}
                              className="p-6 space-y-4"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div>
                                  <h4 className="font-extrabold text-sm text-appText">{goal.name}</h4>
                                  <p className="text-[10px] text-appTextSec mt-0.5 font-bold">
                                    {monthsLeft !== '∞' 
                                      ? `~ ${monthsLeft} months remaining (at current ₹${Math.round(monthlySurp)}/mo savings)` 
                                      : 'Set monthly surplus in Budget tab to compute timeline'}
                                  </p>
                                </div>
                                <div className="flex items-center gap-3 self-end sm:self-center">
                                  <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-md border ${pct >= 100 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                    {pct >= 100 ? 'Achieved' : `${Math.round(pct)}% Saved`}
                                  </span>
                                  <button 
                                    onClick={() => setState(prev => ({ ...prev, savingsGoals: prev.savingsGoals.filter(g => g.id !== goal.id) }))} 
                                    className="text-red-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-500/10 transition-all"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>

                              <div className="w-full bg-appBorder/50 h-2.5 rounded-full overflow-hidden">
                                <motion.div className="h-full bg-appPrimary" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
                              </div>

                              <div className="flex justify-between items-center text-[10px] text-appTextSec font-bold flex-wrap gap-2">
                                <span>Saved: <span className="font-mono text-appText font-black"><MaskValue value={goal.saved} /></span></span>
                                <span>Target: <span className="font-mono text-appText font-black"><MaskValue value={goal.target} /></span></span>
                                <span>Remaining: <span className="font-mono text-red-400 font-black"><MaskValue value={Math.max(0, remaining)} /></span></span>
                              </div>

                              <div className="flex gap-2 max-w-sm pt-1">
                                <input id={`topup_${goal.id}`} type="number" placeholder="Add contribution ₹" className="text-xs p-2 rounded-xl flex-grow focus:outline-none" />
                                <button 
                                  onClick={() => {
                                    const val = Number(document.getElementById(`topup_${goal.id}`)?.value);
                                    if (val > 0) {
                                      setState(prev => ({
                                        ...prev,
                                        savingsGoals: prev.savingsGoals.map(g => g.id === goal.id ? { ...g, saved: Math.min(g.target, g.saved + val) } : g)
                                      }));
                                      const input = document.getElementById(`topup_${goal.id}`);
                                      if (input) input.value = '';
                                    }
                                  }} 
                                  className="bg-appPrimary text-white text-xs px-4 py-2 rounded-xl font-bold shadow-md hover:bg-appPrimaryHover transition-all"
                                >
                                  Deposit
                                </button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>

                    <div className="p-6 border-t border-appBorder/50 bg-appHoverBg/20">
                      <h4 className="text-[10px] uppercase font-black text-appText tracking-wider mb-3 font-heading">Add Custom Savings Goal</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input id="sg_name" type="text" placeholder="Goal Title" className="text-xs p-3 rounded-xl focus:outline-none" />
                        <input id="sg_target" type="number" placeholder="Target Amount (₹)" className="text-xs p-3 rounded-xl focus:outline-none" />
                        <input id="sg_saved" type="number" placeholder="Initial saved (₹)" className="text-xs p-3 rounded-xl focus:outline-none" />
                      </div>
                      <button 
                        onClick={() => {
                          const n = document.getElementById('sg_name');
                          const tAmt = document.getElementById('sg_target');
                          const sAmt = document.getElementById('sg_saved');
                          if (n?.value && tAmt?.value) {
                            setState(prev => ({
                              ...prev,
                              savingsGoals: [...prev.savingsGoals, { id: Date.now(), name: n.value, target: Number(tAmt.value), saved: Number(sAmt?.value || 0) }]
                            }));
                            n.value = ''; tAmt.value = ''; if(sAmt) sAmt.value = '';
                          }
                        }}
                        className="mt-3 bg-appPrimary hover:bg-appPrimaryHover text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-lg shadow-appPrimary/25 transition-all"
                      >
                        Create savings goal
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: EMI PREPAYMENT CALCULATOR */}
              {activeTab === 'loan' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="glass-card p-6 space-y-5 h-fit">
                      <div className="flex items-center gap-2 border-b border-appBorder/50 pb-4">
                        <CreditCard className="text-appPrimary" size={18} />
                        <h2 className="text-xs font-black uppercase tracking-widest text-appText font-heading">Loan Configuration</h2>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-[9px] text-appTextSec uppercase font-black tracking-widest mb-1.5 block">Principal Borrowed (₹)</label>
                          <input type="number" value={state.emiPrincipal} onChange={e => setState(prev => ({...prev, emiPrincipal: Number(e.target.value)}))} className="w-full text-sm font-bold" />
                        </div>
                        <div>
                          <label className="text-[9px] text-appTextSec uppercase font-black tracking-widest mb-1.5 block">Interest Rate (% p.a.)</label>
                          <input type="number" step="0.05" value={state.emiRate} onChange={e => setState(prev => ({...prev, emiRate: Number(e.target.value)}))} className="w-full text-sm font-bold" />
                        </div>
                        <div>
                          <label className="text-[9px] text-appTextSec uppercase font-black tracking-widest mb-1.5 block">Tenure (Months)</label>
                          <input type="number" value={state.emiTenure} onChange={e => setState(prev => ({...prev, emiTenure: Number(e.target.value)}))} className="w-full text-sm font-bold" />
                          <div className="text-[10px] text-appTextSec mt-1.5 font-bold">Equivalent to: {Math.floor(state.emiTenure / 12)} years {state.emiTenure % 12} months</div>
                        </div>
                        <div className="pt-2 border-t border-appBorder/50">
                          <label className="text-[10px] text-appPrimary uppercase font-black tracking-widest mb-1.5 block flex items-center gap-1">
                            <span>⚡ Monthly Prepayment (₹)</span>
                            <OnboardingDot text="Prepayment values clear principal outstanding immediately, decreasing the lifetime interest compounding trajectory." />
                          </label>
                          <input type="number" value={state.emiPrepayment} onChange={e => setState(prev => ({...prev, emiPrepayment: Number(e.target.value)}))} className="w-full border-appPrimary/40 focus:border-appPrimary text-sm font-black" />
                        </div>
                      </div>
                      <div className="pt-2 border-t border-appBorder/50">
                        <div className="text-[10px] text-appTextSec uppercase font-bold tracking-widest mb-2 font-heading">Loan Presets</div>
                        <div className="flex flex-wrap gap-2">
                          {[{l:'Home Loan',p:4500000,r:8.55,t:240},{l:'Car Loan',p:800000,r:9.2,t:60},{l:'Personal Loan',p:300000,r:13.5,t:36}].map(pr => (
                            <button key={pr.l} onClick={() => setState(prev=>({...prev,emiPrincipal:pr.p,emiRate:pr.r,emiTenure:pr.t}))} className="text-[9px] px-3 py-1.5 bg-appHoverBg/30 text-appText hover:bg-appPrimary hover:text-white rounded-lg font-black border border-appBorder/40 transition-all">{pr.l}</button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="glass-card p-5 text-center">
                          <div className="text-[10px] text-appTextSec uppercase font-black tracking-widest mb-1">Standard Monthly EMI</div>
                          <div className="text-xl font-black text-appText font-mono"><MaskValue value={emiCalculations.standardEmi} /></div>
                          <div className="text-[9px] text-appTextSec mt-1 font-bold">₹{emiCalculations.standardEmi + state.emiPrepayment}/mo accelerated</div>
                        </div>
                        <div className="glass-card p-5 border-l-4 border-l-emerald-500 text-center">
                          <div className="text-[10px] text-emerald-500 uppercase font-black tracking-widest mb-1">Total Interest Saved</div>
                          <div className="text-xl font-black text-emerald-500 font-mono"><MaskValue value={emiCalculations.interestSaved} /></div>
                          <div className="text-[9px] text-appTextSec mt-1 font-bold">Paid {formatINR(emiCalculations.prepayInterest)} interest vs {formatINR(emiCalculations.standardInterest)}</div>
                        </div>
                        <div className="glass-card p-5 border-l-4 border-l-blue-500 text-center">
                          <div className="text-[10px] text-blue-500 uppercase font-black tracking-widest mb-1">Tenure Saved</div>
                          <div className="text-xl font-black text-blue-500 font-mono">{emiCalculations.tenureSaved} Months</div>
                          <div className="text-[9px] text-appTextSec mt-1 font-bold">Closed in {Math.round(emiCalculations.prepayTenure)} months (~{(emiCalculations.prepayTenure/12).toFixed(1)} yrs)</div>
                        </div>
                      </div>

                      <div className="glass-card p-6 space-y-4">
                        <div className="text-[10px] uppercase font-black tracking-wider text-appTextSec font-heading">Principal vs Interest split Ratio comparison</div>
                        <div className="space-y-3.5">
                          <div>
                            <div className="flex justify-between text-[10px] text-appTextSec font-bold mb-1.5">
                              <span>Standard Loan Schedule (No extra payments)</span>
                              <span className="text-appText">Interest: {Math.round(emiCalculations.standardInterest/emiCalculations.standardTotalPayable*100)}%</span>
                            </div>
                            <div className="h-4.5 w-full bg-appBorder/50 rounded-full overflow-hidden flex">
                              <div className="h-full bg-appPrimary" style={{ width: `${Math.round(state.emiPrincipal/emiCalculations.standardTotalPayable*100)}%` }} />
                              <div className="h-full bg-red-400" style={{ width: `${Math.round(emiCalculations.standardInterest/emiCalculations.standardTotalPayable*100)}%` }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-[10px] text-appTextSec font-bold mb-1.5">
                              <span>Accelerated Schedule (With prepayments)</span>
                              <span className="text-emerald-500">Interest: {Math.round(emiCalculations.prepayInterest/emiCalculations.prepayTotalPayable*100)}%</span>
                            </div>
                            <div className="h-4.5 w-full bg-appBorder/50 rounded-full overflow-hidden flex">
                              <div className="h-full bg-appPrimary" style={{ width: `${Math.round(state.emiPrincipal/emiCalculations.prepayTotalPayable*100)}%` }} />
                              <div className="h-full bg-emerald-500" style={{ width: `${Math.round(emiCalculations.prepayInterest/emiCalculations.prepayTotalPayable*100)}%` }} />
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-4 pt-1 flex-wrap">
                          <span className="flex items-center gap-1.5 text-[10px] text-appTextSec font-bold"><span className="w-2.5 h-2.5 rounded-full bg-appPrimary inline-block"></span>Principal Paid</span>
                          <span className="flex items-center gap-1.5 text-[10px] text-appTextSec font-bold"><span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block"></span>Standard Interest</span>
                          <span className="flex items-center gap-1.5 text-[10px] text-appTextSec font-bold"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>Prepayment Interest</span>
                        </div>
                      </div>

                      <div className="glass-card overflow-hidden">
                        <div className="px-6 py-4 border-b border-appBorder/50 flex items-center justify-between">
                          <h4 className="font-extrabold text-xs text-appText uppercase tracking-wider">Amortization Table (Accelerated Projections)</h4>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead className="bg-appHoverBg/40 border-b border-appBorder/50">
                              <tr>
                                <th className="text-left px-6 py-3.5 font-black text-appTextSec uppercase tracking-widest">Year</th>
                                <th className="text-right px-6 py-3.5 font-black text-appTextSec uppercase tracking-widest">Ending Month</th>
                                <th className="text-right px-6 py-3.5 font-black text-appTextSec uppercase tracking-widest">Outstanding Principal</th>
                                <th className="text-right px-6 py-3.5 font-black text-appTextSec uppercase tracking-widest">% Principal Cleared</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-appBorder/40">
                              {emiCalculations.amortizationSchedule.map((row, index) => (
                                <tr key={index} className="hover:bg-appHoverBg/20">
                                  <td className="px-6 py-3.5 font-bold text-appText">Year {row.year}</td>
                                  <td className="px-6 py-3.5 text-right text-appTextSec font-bold">Month {row.month}</td>
                                  <td className="px-6 py-3.5 text-right font-mono font-bold text-appText"><MaskValue value={row.balance} /></td>
                                  <td className="px-6 py-3.5 text-right font-bold">
                                    <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black border ${row.percentPaid >= 90 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' : row.percentPaid >= 50 ? 'bg-blue-500/10 text-blue-400 border-blue-500/25' : 'bg-appHoverBg text-appTextSec border-appBorder/50'}`}>{row.percentPaid}%</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: SIP GROWTH SIMULATOR */}
              {activeTab === 'growth' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="glass-card p-6 space-y-6 lg:col-span-1 h-fit">
                      <div className="flex items-center gap-2 border-b border-appBorder/50 pb-4">
                        <TrendingUp className="text-appPrimary" size={18} />
                        <h2 className="text-xs font-black uppercase tracking-widest text-appText font-heading">SIP Parameters</h2>
                      </div>
                      <div className="space-y-5">
                        <div>
                          <div className="flex justify-between mb-1.5">
                            <label className="text-[10px] text-appTextSec uppercase font-bold tracking-widest">Initial Lump Sum (₹)</label>
                            <span className="text-xs font-black text-appPrimary font-mono">{formatINR(state.growthLumpSum)}</span>
                          </div>
                          <input type="range" min="0" max="1000000" step="10000" value={state.growthLumpSum} onChange={e => setState(prev => ({...prev, growthLumpSum: Number(e.target.value)}))} className="cursor-pointer" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1.5">
                            <label className="text-[10px] text-appTextSec uppercase font-bold tracking-widest">Monthly SIP (₹)</label>
                            <span className="text-xs font-black text-appPrimary font-mono">{formatINR(state.growthSIP)}/mo</span>
                          </div>
                          <input type="range" min="0" max="250000" step="2500" value={state.growthSIP} onChange={e => setState(prev => ({...prev, growthSIP: Number(e.target.value)}))} className="cursor-pointer" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1.5">
                            <label className="text-[10px] text-appTextSec uppercase font-bold tracking-widest">Investment Duration</label>
                            <span className="text-xs font-black text-appPrimary font-mono">{state.growthDuration} Years</span>
                          </div>
                          <input type="range" min="3" max="30" step="1" value={state.growthDuration} onChange={e => setState(prev => ({...prev, growthDuration: Number(e.target.value)}))} className="cursor-pointer" />
                        </div>
                      </div>
                      <div className="pt-4 border-t border-appBorder/50 space-y-4">
                        <div className="text-[10px] text-appTextSec uppercase font-bold tracking-widest font-heading">Rate projections presets</div>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-xs mb-1.5 font-bold">
                              <span className="text-red-400">Worst Case Rate:</span>
                              <span className="text-red-400">{state.growthReturnWorst}%</span>
                            </div>
                            <input type="range" min="3" max="10" step="0.5" value={state.growthReturnWorst} onChange={e => setState(prev => ({...prev, growthReturnWorst: Number(e.target.value)}))} className="cursor-pointer" />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1.5 font-bold">
                              <span className="text-appPrimary">Median Rate:</span>
                              <span className="text-appPrimary">{state.growthReturnMedian}%</span>
                            </div>
                            <input type="range" min="8" max="15" step="0.5" value={state.growthReturnMedian} onChange={e => setState(prev => ({...prev, growthReturnMedian: Number(e.target.value)}))} className="cursor-pointer" />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1.5 font-bold">
                              <span className="text-emerald-500">Best Case Rate:</span>
                              <span className="text-emerald-500">{state.growthReturnBest}%</span>
                            </div>
                            <input type="range" min="12" max="22" step="0.5" value={state.growthReturnBest} onChange={e => setState(prev => ({...prev, growthReturnBest: Number(e.target.value)}))} className="cursor-pointer" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-3 space-y-6">
                      <div className="glass-card p-6">
                        <div className="flex items-center gap-1.5 border-b border-appBorder/50 pb-4">
                          <span className="text-appPrimary">📈</span>
                          <h3 className="font-extrabold text-xs text-appText uppercase tracking-wider">{t('monte_carlo_title')}</h3>
                          <OnboardingDot text="Simulates continuous compound growth based on month-on-month compounding formulas under specified rates." />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                          <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/10 text-center border-l-4 border-l-red-500">
                            <div className="text-[9px] text-red-400 uppercase font-black tracking-wider mb-1">{t('worst_case', { rate: state.growthReturnWorst })}</div>
                            <div className="text-lg font-mono font-black text-red-400"><MaskValue value={monteCarloData[state.growthDuration - 1]?.Worst || 0} /></div>
                          </div>
                          <div className="bg-appPrimary/5 p-4 rounded-xl border border-appPrimary/10 text-center border-l-4 border-l-appPrimary">
                            <div className="text-[9px] text-appPrimary uppercase font-black tracking-wider mb-1">{t('median_case', { rate: state.growthReturnMedian })}</div>
                            <div className="text-lg font-mono font-black text-appPrimary"><MaskValue value={monteCarloData[state.growthDuration - 1]?.Median || 0} /></div>
                          </div>
                          <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10 text-center border-l-4 border-l-emerald-500">
                            <div className="text-[9px] text-emerald-400 uppercase font-black tracking-wider mb-1">{t('best_case', { rate: state.growthReturnBest })}</div>
                            <div className="text-lg font-mono font-black text-emerald-500"><MaskValue value={monteCarloData[state.growthDuration - 1]?.Best || 0} /></div>
                          </div>
                        </div>
                        <div className="w-full h-80 pt-2">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monteCarloData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                              <defs>
                                <linearGradient id="colorBest" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorMedian" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.25}/><stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorWorst" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.18}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="4 4" stroke="var(--card-border)" />
                              <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={10} tickLine={false} />
                              <YAxis stroke="var(--text-secondary)" fontSize={10} tickLine={false} tickFormatter={(v) => `₹${(v/100000).toFixed(1)}L`} />
                              <ChartTooltip content={<RechartsTooltip />} />
                              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                              <Area type="monotone" name={`Best Case (${state.growthReturnBest}%)`} dataKey="Best" stroke="#10b981" fillOpacity={1} fill="url(#colorBest)" strokeWidth={2.5} />
                              <Area type="monotone" name={`Median Case (${state.growthReturnMedian}%)`} dataKey="Median" stroke="var(--primary)" fillOpacity={1} fill="url(#colorMedian)" strokeWidth={2.5} />
                              <Area type="monotone" name={`Worst Case (${state.growthReturnWorst}%)`} dataKey="Worst" stroke="#ef4444" fillOpacity={1} fill="url(#colorWorst)" strokeWidth={2.5} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: DEBT PAYOFF PLAN */}
              {activeTab === 'debt' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="glass-card p-5 border-l-4 border-l-red-500">
                      <div className="text-[10px] text-appTextSec uppercase font-black tracking-widest">Total Liability Debt</div>
                      <div className="text-xl font-black text-red-500 font-mono mt-1"><MaskValue value={debtPayoffCalculations.totalDebt} /></div>
                    </div>
                    <div className="glass-card p-5">
                      <div className="text-[10px] text-appTextSec uppercase font-black tracking-widest">Min Monthly Payments</div>
                      <div className="text-xl font-black text-appText font-mono mt-1"><MaskValue value={debtPayoffCalculations.totalMinPayment} /></div>
                      <p className="text-[9px] text-appTextSec mt-0.5 font-bold">Sum of min installments</p>
                    </div>
                    <div className="glass-card p-5 border-l-4 border-l-blue-500">
                      <div className="text-[10px] text-blue-500 uppercase font-black tracking-widest font-heading">Avalanche Timeline</div>
                      <div className="text-xl font-black text-blue-500 font-mono mt-1">{debtPayoffCalculations.avalancheMonths} Months</div>
                      <p className="text-[9px] text-appTextSec mt-0.5 font-bold">Interest: {formatINR(debtPayoffCalculations.avalancheInterest)}</p>
                    </div>
                    <div className="glass-card p-5 border-l-4 border-l-violet-500">
                      <div className="text-[10px] text-violet-500 uppercase font-black tracking-widest font-heading">Snowball Timeline</div>
                      <div className="text-xl font-black text-violet-500 font-mono mt-1">{debtPayoffCalculations.snowballMonths} Months</div>
                      <p className="text-[9px] text-appTextSec mt-0.5 font-bold">Interest: {formatINR(debtPayoffCalculations.snowballInterest)}</p>
                    </div>
                  </div>

                  <div className="glass-card p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div>
                        <h4 className="text-[9px] uppercase font-black text-appTextSec tracking-widest mb-1.5">Extra Monthly Debt payoff Cash</h4>
                        <div className="flex items-center gap-2">
                          <input type="number" value={state.debtExtra} onChange={e => setState(prev=>({...prev,debtExtra:Number(e.target.value)}))} className="px-3.5 py-2.5 rounded-xl w-36 text-sm font-bold" />
                          <span className="text-xs text-appTextSec font-bold">/mo allocated on top of standard minimums</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 max-w-md text-[10px] text-appTextSec">
                        <div className="bg-blue-500/10 text-blue-400 px-3.5 py-2 rounded-xl font-bold border border-blue-500/20">🧊 **Avalanche**: Highest interest rate first. Mathematically optimal. Saves maximum interest expense.</div>
                        <div className="bg-violet-500/10 text-violet-400 px-3.5 py-2 rounded-xl font-bold border border-violet-500/20">❄️ **Snowball**: Lowest balance first. Psychological win. Eliminates individual accounts faster.</div>
                      </div>
                    </div>
                    {debtPayoffCalculations.avalancheInterest < debtPayoffCalculations.snowballInterest && (
                      <div className="mt-4 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-4 py-2.5 rounded-xl font-bold">💡 Avalanche saves you {formatINR(debtPayoffCalculations.snowballInterest - debtPayoffCalculations.avalancheInterest)} in interest and clears debt {Math.abs(debtPayoffCalculations.snowballMonths - debtPayoffCalculations.avalancheMonths)} months faster than Snowball.</div>
                    )}
                  </div>

                  <div className="glass-card overflow-hidden">
                    <div className="px-6 py-4 border-b border-appBorder/50 flex items-center justify-between">
                      <h4 className="font-extrabold text-xs text-appText uppercase tracking-wider">📉 Outstanding Liability accounts</h4>
                    </div>
                    <div className="divide-y divide-appBorder/50">
                      <AnimatePresence>
                        {debtPayoffCalculations.debts.map(debt => {
                          const pct = Math.min(100, (debt.balance / debtPayoffCalculations.totalDebt) * 100);
                          return (
                            <motion.div key={debt.id} layout initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="p-5 flex items-center justify-between gap-6 hover:bg-appHoverBg/20 transition-all">
                              <div className="flex-grow space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="font-extrabold text-sm text-appText">{debt.name}</div>
                                  <span className="text-[10px] font-black bg-red-500/10 text-red-400 px-2 py-0.5 rounded-md border border-red-500/25">{debt.rate}% interest</span>
                                </div>
                                <div className="w-full bg-appBorder/50 h-2.5 rounded-full overflow-hidden">
                                  <div className="h-full bg-red-400" style={{ width: `${pct}%` }} />
                                </div>
                                <div className="flex justify-between text-[10px] text-appTextSec font-bold">
                                  <span>Outstanding: <span className="text-appText font-mono"><MaskValue value={debt.balance} /></span></span>
                                  <span>Min Installment: <span className="text-appText font-mono"><MaskValue value={debt.minPayment} /></span>/mo</span>
                                  <span>{Math.round(pct)}% of gross liabilities</span>
                                </div>
                              </div>
                              <button onClick={() => setState(prev => ({ ...prev, customDebts: (prev.customDebts || debtPayoffCalculations.debts).filter(x => x.id !== debt.id) }))} className="text-red-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-500/10 transition-all"><Trash2 size={14} /></button>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                    <div className="p-5 border-t border-appBorder/50 bg-appHoverBg/30">
                      <h4 className="text-[10px] uppercase font-black text-appText tracking-wider mb-3 font-heading">Add Custom Debt Account</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <input id="d_name" type="text" placeholder="Debt Name" className="text-xs p-3 rounded-xl focus:outline-none" />
                        <input id="d_bal" type="number" placeholder="Outstanding (₹)" className="text-xs p-3 rounded-xl focus:outline-none" />
                        <input id="d_rate" type="number" placeholder="Rate (% p.a.)" className="text-xs p-3 rounded-xl focus:outline-none" />
                        <input id="d_min" type="number" placeholder="Min Payment (₹)" className="text-xs p-3 rounded-xl focus:outline-none" />
                      </div>
                      <button onClick={() => {
                        const n = document.getElementById('d_name');
                        const b = document.getElementById('d_bal');
                        const r = document.getElementById('d_rate');
                        const m = document.getElementById('d_min');
                        if(n?.value && b?.value && r?.value && m?.value) {
                          setState(prev => ({ ...prev, customDebts: [...(prev.customDebts || debtPayoffCalculations.debts), { id: Date.now(), name: n.value, balance: Number(b.value), rate: Number(r.value), minPayment: Number(m.value) }] }));
                          [n,b,r,m].forEach(el => { if(el) el.value = ''; });
                        }
                      }} className="mt-3 bg-appPrimary hover:bg-appPrimaryHover text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-lg transition-all">Create Debt account</button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: TAX OPTIMIZER */}
              {activeTab === 'tax' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="glass-card p-6 space-y-5 h-fit">
                      <div className="flex items-center gap-2 border-b border-appBorder/50 pb-4">
                        <Scale className="text-appPrimary" size={18} />
                        <h2 className="text-xs font-black uppercase tracking-widest text-appText font-heading">Tax Parameters</h2>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-[9px] text-appTextSec uppercase font-black tracking-widest mb-1.5 block">Gross Annual Salary (₹)</label>
                          <input type="number" value={state.taxSalary} onChange={e => setState(prev => ({...prev, taxSalary: Number(e.target.value)}))} className="px-4 py-3 rounded-xl w-full text-sm font-bold" />
                        </div>
                        <div className="pt-3 border-t border-appBorder/50 space-y-3">
                          <label className="text-[10px] text-appTextSec uppercase font-black tracking-widest block font-heading">Old Regime Deductions</label>
                          <div>
                            <label className="text-[9px] text-appTextSec uppercase font-bold mb-1 block">80C Investments (PPF, ELSS - max 1.5L)</label>
                            <input type="number" value={state.taxInvestments80C} onChange={e => setState(prev => ({...prev, taxInvestments80C: Number(e.target.value)}))} className="px-3 py-2.5 rounded-xl w-full text-xs font-medium" />
                          </div>
                          <div>
                            <label className="text-[9px] text-appTextSec uppercase font-bold mb-1 block">80D Health Premiums (max 25k/50k)</label>
                            <input type="number" value={state.taxMedical80D} onChange={e => setState(prev => ({...prev, taxMedical80D: Number(e.target.value)}))} className="px-3 py-2.5 rounded-xl w-full text-xs font-medium" />
                          </div>
                          <div>
                            <label className="text-[9px] text-appTextSec uppercase font-bold mb-1 block">House Rent Allowance Exemption (HRA)</label>
                            <input type="number" value={state.taxHRA} onChange={e => setState(prev => ({...prev, taxHRA: Number(e.target.value)}))} className="px-3 py-2.5 rounded-xl w-full text-xs font-medium" />
                          </div>
                          <div>
                            <label className="text-[9px] text-appTextSec uppercase font-bold mb-1 block">Other Exemptions (Section 24 Home interest, etc.)</label>
                            <input type="number" value={state.taxOtherDeductions} onChange={e => setState(prev => ({...prev, taxOtherDeductions: Number(e.target.value)}))} className="px-3 py-2.5 rounded-xl w-full text-xs font-medium" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                      <div className="glass-card p-6 border-l-4 border-l-appPrimary relative overflow-hidden">
                        <div className="flex items-center gap-1.5 mb-2 text-appPrimary">
                          <Sparkles size={15} />
                          <h4 className="text-[9px] uppercase font-black tracking-widest">Regime Comparison Recommendation</h4>
                        </div>
                        <p className="text-base font-black text-appText leading-relaxed">{taxCalculations.recommendation}</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="glass-card p-6 space-y-4">
                          <h4 className="text-xs font-extrabold text-appTextSec uppercase tracking-widest border-b border-appBorder/50 pb-2 font-heading">New Tax Regime</h4>
                          <div className="space-y-2.5 text-xs">
                            <div className="flex justify-between">
                              <span className="text-appTextSec">Standard Deduction:</span>
                              <span className="font-bold text-appText font-mono">₹75,000</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-appTextSec">Net Taxable Income:</span>
                              <span className="font-bold text-appText font-mono">{formatINR(taxCalculations.newTaxable)}</span>
                            </div>
                            <div className="flex justify-between border-t border-appBorder/50 pt-2.5 mt-2.5">
                              <span className="text-appTextSec font-extrabold">Final Tax Payable:</span>
                              <span className="font-black text-appPrimary font-mono text-base"><MaskValue value={taxCalculations.newTax} /></span>
                            </div>
                          </div>
                          <p className="text-[10px] text-appTextSec leading-relaxed">Lower tax brackets. Zero tax up to ₹12L taxable income under Budget 87A rebate adjustments. No investment requirements.</p>
                        </div>
                        <div className="glass-card p-6 space-y-4">
                          <h4 className="text-xs font-extrabold text-appTextSec uppercase tracking-widest border-b border-appBorder/50 pb-2 font-heading">Old Tax Regime</h4>
                          <div className="space-y-2.5 text-xs">
                            <div className="flex justify-between">
                              <span className="text-appTextSec">Standard Deduction:</span>
                              <span className="font-bold text-appText font-mono">₹50,000</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-appTextSec">Total Exemptions:</span>
                              <span className="font-bold text-appText font-mono">{formatINR(taxCalculations.totalOldDeductions)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-appTextSec">Net Taxable Income:</span>
                              <span className="font-bold text-appText font-mono">{formatINR(taxCalculations.oldTaxable)}</span>
                            </div>
                            <div className="flex justify-between border-t border-appBorder/50 pt-2.5 mt-2.5">
                              <span className="text-appTextSec font-extrabold">Final Tax Payable:</span>
                              <span className="font-black text-red-400 font-mono text-base"><MaskValue value={taxCalculations.oldTax} /></span>
                            </div>
                          </div>
                          <p className="text-[10px] text-appTextSec leading-relaxed">Permits high deductions under 80C/80D/HRA. Better if you have housing loans and large rental outflows.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: RETIREMENT/FIRE PLANNER - WITH INTEGRATED GAUGE */}
              {activeTab === 'retirement' && (
                <div className="space-y-6">
                  {/* Top section: variables & speedometer */}
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* Variables */}
                    <div className="glass-card p-6 space-y-6 lg:col-span-1 h-fit">
                      <div className="flex items-center gap-2 border-b border-appBorder/50 pb-4">
                        <Hourglass className="text-appPrimary" size={18} />
                        <h2 className="text-xs font-black uppercase tracking-widest text-appText font-heading">Retirement Slabs</h2>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-[9px] text-appTextSec uppercase font-black tracking-widest mb-1.5 block">Current Age (Yrs)</label>
                          <input type="number" value={state.retCurrentAge} onChange={e => setState(prev => ({...prev, retCurrentAge: Number(e.target.value)}))} className="w-full text-xs font-bold" />
                        </div>
                        <div>
                          <label className="text-[9px] text-appTextSec uppercase font-black tracking-widest mb-1.5 block">Retirement Age (Yrs)</label>
                          <input type="number" value={state.retTargetAge} onChange={e => setState(prev => ({...prev, retTargetAge: Number(e.target.value)}))} className="w-full text-xs font-bold" />
                        </div>
                        <div>
                          <label className="text-[9px] text-appTextSec uppercase font-black tracking-widest mb-1.5 block">Life Expectancy (Yrs)</label>
                          <input type="number" value={state.retLifeExpectancy} onChange={e => setState(prev => ({...prev, retLifeExpectancy: Number(e.target.value)}))} className="w-full text-xs font-bold" />
                        </div>
                        <div className="pt-3 border-t border-appBorder/50 space-y-3">
                          <div>
                            <div className="flex justify-between mb-1.5">
                              <label className="text-[10px] text-appTextSec uppercase font-bold tracking-widest">Expected Inflation</label>
                              <span className="text-xs font-black text-appPrimary font-mono">{state.retInflation}%</span>
                            </div>
                            <input type="range" min="3" max="10" step="0.5" value={state.retInflation} onChange={e => setState(prev => ({...prev, retInflation: Number(e.target.value)}))} className="cursor-pointer" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1.5">
                              <label className="text-[10px] text-appTextSec uppercase font-bold tracking-widest">Pre-Ret. Yield</label>
                              <span className="text-xs font-black text-appPrimary font-mono">{state.retPreRetReturn}%</span>
                            </div>
                            <input type="range" min="5" max="18" step="0.5" value={state.retPreRetReturn} onChange={e => setState(prev => ({...prev, retPreRetReturn: Number(e.target.value)}))} className="cursor-pointer" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1.5">
                              <label className="text-[10px] text-appTextSec uppercase font-bold tracking-widest">Post-Ret. Yield</label>
                              <span className="text-xs font-black text-appPrimary font-mono">{state.retPostRetReturn}%</span>
                            </div>
                            <input type="range" min="4" max="12" step="0.5" value={state.retPostRetReturn} onChange={e => setState(prev => ({...prev, retPostRetReturn: Number(e.target.value)}))} className="cursor-pointer" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Projections & gauge */}
                    <div className="lg:col-span-3 space-y-6 flex flex-col justify-between">
                      
                      {/* Metric cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="glass-card p-5">
                          <div className="text-[10px] text-appTextSec uppercase font-black tracking-widest">Future Annual Expenses</div>
                          <div className="text-xl font-black text-appText font-mono mt-1"><MaskValue value={retirementCalculations.inflatedExpensesAtRet} /></div>
                          <p className="text-[9px] text-appTextSec mt-1 font-bold">Inflated from current annual expenses {formatINR(budgetMetrics.totalExpenses * 12)}</p>
                        </div>
                        <div className="glass-card p-5 border-l-4 border-l-appPrimary">
                          <div className="text-[10px] text-appPrimary uppercase font-black tracking-widest">Required Corpus Target</div>
                          <div className="text-xl font-black text-appPrimary font-mono mt-1"><MaskValue value={retirementCalculations.targetCorpus} /></div>
                          <p className="text-[9px] text-appTextSec mt-1 font-bold">Corpus needed to support {retirementCalculations.retYears} years of retirement</p>
                        </div>
                        <div className="glass-card p-5 text-center flex flex-col justify-center items-center">
                          <div className="text-[10px] text-appTextSec uppercase font-black tracking-widest">Corpus Sustainability</div>
                          <div className="mt-1 flex items-center justify-center gap-1.5">
                            {retirementCalculations.isSuccess ? (
                              <span className="text-emerald-500 font-black text-base flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">✅ Funded</span>
                            ) : (
                              <span className="text-red-400 font-black text-base flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg">⚠️ Deficit</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Speedometer and sliders row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Speedometer gauge (Migrated from Net Worth) */}
                        <div className="glass-card p-6 flex flex-col items-center justify-between min-h-[260px]">
                          <div className="flex items-center gap-1.5 self-start">
                            <span>🔥</span>
                            <h3 className="font-extrabold text-xs text-appText uppercase tracking-wider">{t('fire_title')}</h3>
                            <OnboardingDot text={t('fire_tooltip')} />
                          </div>

                          {(() => {
                            const val = Math.min(100, Math.max(0, fireMetrics.progressPct));
                            const radius = 54;
                            const circumference = Math.PI * radius; // Semi-circle
                            const strokeOffset = circumference - (val / 100) * circumference;

                            return (
                              <div className="flex flex-col items-center mt-4 w-full">
                                <div className="relative w-48 h-26 overflow-hidden flex items-end justify-center">
                                  <svg className="w-48 h-48 absolute top-0 transform rotate-180">
                                    <circle cx="96" cy="96" r={radius} fill="transparent" stroke="var(--card-border)" strokeWidth="12" strokeDasharray={circumference} strokeLinecap="round" />
                                    <motion.circle 
                                      cx="96" 
                                      cy="96" 
                                      r={radius} 
                                      fill="transparent" 
                                      stroke="var(--primary)" 
                                      strokeWidth="12" 
                                      strokeDasharray={circumference} 
                                      initial={{ strokeDashoffset: circumference }}
                                      animate={{ strokeDashoffset: strokeOffset }}
                                      transition={{ duration: 1.1, ease: "easeOut" }}
                                      strokeLinecap="round" 
                                    />
                                  </svg>
                                  <div className="text-center pb-2 z-10">
                                    <div className="text-3xl font-black text-appText font-heading">{val.toFixed(1)}%</div>
                                    <div className="text-[9px] uppercase font-bold text-appTextSec tracking-widest">{t('fire_autonomy')}</div>
                                  </div>
                                </div>

                                <div className="mt-4 flex items-center gap-3 w-full justify-center">
                                  <span className="text-[9px] text-appTextSec font-bold uppercase tracking-wider">FIRE Multiplier:</span>
                                  <input 
                                    type="range" 
                                    min="25" 
                                    max="35" 
                                    value={state.fireFactor}
                                    onChange={(e) => setState(prev => ({ ...prev, fireFactor: Number(e.target.value) }))}
                                    className="w-20 cursor-pointer"
                                  />
                                  <span className="text-xs font-bold text-appPrimary font-mono">{state.fireFactor}x</span>
                                </div>
                              </div>
                            );
                          })()}

                          <div className="text-center text-[10px] text-appTextSec border-t border-appBorder/50 pt-2.5 w-full mt-2 font-bold">
                            FIRE Target Corpus: <span className="text-appText font-mono font-black"><MaskValue value={fireMetrics.targetCorpus} /></span>
                          </div>
                        </div>

                        {/* Quick milestones description */}
                        <div className="glass-card p-6 flex flex-col justify-between min-h-[260px] text-xs text-appTextSec leading-relaxed">
                          <div className="flex items-center gap-1.5 border-b border-appBorder/50 pb-2">
                            <span>💡</span>
                            <span className="font-extrabold uppercase text-[10px] tracking-wider text-appText">FIRE Autonomy definition</span>
                          </div>
                          <p className="py-2">
                            The FIRE Speedometer gauge measures your liquid savings (cash + stock assets) relative to your FIRE Target Corpus. The target is defined by multiplying your annual expenditure by your choice of multiplier (e.g. 25x or 30x). Achieving 100% means your wealth is theoretically self-sustaining.
                          </p>
                          <div className="border-t border-appBorder/50 pt-2 font-bold flex justify-between">
                            <span>Current Liquid Wealth:</span>
                            <span className="text-emerald-500 font-mono"><MaskValue value={state.assets.cash + state.assets.stocks} /></span>
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>

                  {/* Bottom section: Lifetime Chart */}
                  <div className="glass-card p-6">
                    <div className="flex items-center gap-1.5 border-b border-appBorder/50 pb-4">
                      <span className="text-appPrimary">⌛</span>
                      <h3 className="font-extrabold text-xs text-appText uppercase tracking-wider">Lifetime Wealth Accumulation & Drawdown Projections</h3>
                    </div>
                    <div className="w-full h-80 pt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={retirementCalculations.retirementGraphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="4 4" stroke="var(--card-border)" />
                          <XAxis dataKey="age" stroke="var(--text-secondary)" fontSize={10} tickLine={false} />
                          <YAxis stroke="var(--text-secondary)" fontSize={10} tickLine={false} tickFormatter={(v) => `₹${(v/1000000).toFixed(1)}M`} />
                          <ChartTooltip content={<RechartsTooltip />} />
                          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                          <Line type="monotone" name="Wealth Balance" dataKey="Wealth" stroke="var(--primary)" strokeWidth={3} dot={false} animationDuration={1000} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 8: NET WORTH TRACKER - CLEAN & SPACIOUS */}
              {activeTab === 'networth' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Left Column: Asset & Liability Inputs */}
                  <div className="glass-card p-6 space-y-6 lg:col-span-1 h-fit">
                    <div className="flex items-center gap-2 border-b border-appBorder/50 pb-4">
                      <BarChart3 className="text-appPrimary" size={18} />
                      <h2 className="text-xs font-black uppercase tracking-widest text-appText font-heading">Asset Haircuts</h2>
                    </div>

                    <div className="flex items-center gap-3 bg-appHoverBg/30 p-3.5 rounded-xl border border-appBorder/50">
                      <input 
                        type="checkbox" 
                        checked={state.applyHaircut}
                        onChange={(e) => setState(prev => ({ ...prev, applyHaircut: e.target.checked }))}
                        className="w-4.5 h-4.5 rounded text-appPrimary focus:ring-0 cursor-pointer border-appBorder"
                        id="applyHaircutInput"
                      />
                      <label htmlFor="applyHaircutInput" className="text-xs font-bold text-appText cursor-pointer select-none">
                        {t('haircut_label')}
                      </label>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-black text-xs text-emerald-500 uppercase tracking-widest">🟢 Asset Holdings</h3>
                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-appTextSec font-bold">Cash & Bank (₹):</span>
                          <input type="number" value={state.assets.cash} onChange={(e) => setState(prev => ({ ...prev, assets: { ...prev.assets, cash: Number(e.target.value) } }))} className="text-right p-2 rounded-lg w-32 focus:outline-none" />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-appTextSec font-bold">Stocks & Mutual Funds (₹):</span>
                          <input type="number" value={state.assets.stocks} onChange={(e) => setState(prev => ({ ...prev, assets: { ...prev.assets, stocks: Number(e.target.value) } }))} className="text-right p-2 rounded-lg w-32 focus:outline-none" />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-appTextSec font-bold">Gold Valuation (₹):</span>
                          <input type="number" value={state.assets.gold} onChange={(e) => setState(prev => ({ ...prev, assets: { ...prev.assets, gold: Number(e.target.value) } }))} className="text-right p-2 rounded-lg w-32 focus:outline-none" />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-appTextSec font-bold">Real Estate Properties (₹):</span>
                          <input type="number" value={state.assets.property} onChange={(e) => setState(prev => ({ ...prev, assets: { ...prev.assets, property: Number(e.target.value) } }))} className="text-right p-2 rounded-lg w-32 focus:outline-none" />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-appTextSec font-bold">Other asset classes (₹):</span>
                          <input type="number" value={state.assets.other} onChange={(e) => setState(prev => ({ ...prev, assets: { ...prev.assets, other: Number(e.target.value) } }))} className="text-right p-2 rounded-lg w-32 focus:outline-none" />
                        </div>
                      </div>

                      <h3 className="font-black text-xs text-red-500 uppercase tracking-widest pt-4 border-t border-appBorder/50">🔴 Liabilities Outstanding</h3>
                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-appTextSec font-bold">Home Mortgage (₹):</span>
                          <input type="number" value={state.liabilities.homeLoan} onChange={(e) => setState(prev => ({ ...prev, liabilities: { ...prev.liabilities, homeLoan: Number(e.target.value) } }))} className="text-right p-2 rounded-lg w-32 focus:outline-none" />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-appTextSec font-bold">Personal Loans (₹):</span>
                          <input type="number" value={state.liabilities.personalLoan} onChange={(e) => setState(prev => ({ ...prev, liabilities: { ...prev.liabilities, personalLoan: Number(e.target.value) } }))} className="text-right p-2 rounded-lg w-32 focus:outline-none" />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-appTextSec font-bold">Credit Cards (₹):</span>
                          <input type="number" value={state.liabilities.creditCard} onChange={(e) => setState(prev => ({ ...prev, liabilities: { ...prev.liabilities, creditCard: Number(e.target.value) } }))} className="text-right p-2 rounded-lg w-32 focus:outline-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Milestones Conversions & Explanations */}
                  <div className="glass-card p-6 lg:col-span-2 space-y-6 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-1.5 border-b border-appBorder/50 pb-4">
                        <span>🏡</span>
                        <h3 className="font-extrabold text-xs text-appText uppercase tracking-wider">{t('tangible_translation')}</h3>
                        <OnboardingDot text="Relates abstract balance figures to concrete milestones (flats, insurance, food budgets) to give tangible clarity." />
                      </div>

                      <div className="bg-appHoverBg/30 border border-appBorder/50 p-6 rounded-2xl text-sm leading-relaxed space-y-4">
                        <div className="text-[10px] font-black text-appPrimary uppercase tracking-widest">Tangible Net Worth Definition</div>
                        <p className="font-bold text-appText">
                          {tangibleMessage}
                        </p>
                      </div>

                      <div className="p-6 rounded-xl border border-appBorder/40 bg-appHoverBg/10 space-y-3 text-xs text-appTextSec leading-relaxed">
                        <h4 className="font-extrabold text-[10px] text-appText uppercase tracking-wider">Accounting Definitions</h4>
                        <ul className="list-disc pl-4 space-y-1.5">
                          <li><strong>Total Valuation Assets:</strong> Sum of all listed properties, gold reserves, stock valuations, and cash holdings.</li>
                          <li><strong>Liquid Net Worth:</strong> Evaluated by subtracting liabilities from liquid assets (cash + mutual funds). Slashes property values.</li>
                          <li><strong>Haircut adjustments:</strong> Slashes real estate values by 20% and gold by 5% to simulate emergency sales liquidity penalties.</li>
                        </ul>
                      </div>
                    </div>

                    <div className="text-xs text-appTextSec border-t border-appBorder/50 pt-3.5 space-y-2">
                      <div className="flex justify-between items-center font-bold">
                        <span>{t('liquid_nw_label')}:</span>
                        <span className="font-mono font-black text-emerald-500 text-lg"><MaskValue value={netWorthMetrics.trueLiquidNetWorth} /></span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 9: STRESS TESTING */}
              {activeTab === 'stresstest' && (
                <div className="glass-card p-6 space-y-6">
                  <div className="flex items-center gap-1.5 border-b border-appBorder/50 pb-4">
                    <ShieldAlert className="text-appPrimary" size={18} />
                    <h2 className="text-xs font-black uppercase tracking-widest text-appText font-heading">Hypothetical Shock Stress Testing</h2>
                    <OnboardingDot text="Calculates cash flow deficits under simulation scenarios to diagnose safety margins." />
                  </div>
                  <p className="text-xs text-appTextSec">Apply black swan stress tests to analyze liquidity runways and cash resilience.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="p-5 rounded-2xl border border-appBorder bg-appHoverBg/30 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-sm text-appText">Sudden Job Loss (6 Months Runway)</div>
                          <div className="text-[10px] text-appTextSec mt-0.5 font-bold">Deducts 6 months of expenses ({formatINR(budgetMetrics.totalExpenses * 6)}) from Cash.</div>
                        </div>
                        <button onClick={() => setState(prev => ({ ...prev, stressTestApplied: { ...prev.stressTestApplied, jobLoss: !prev.stressTestApplied.jobLoss } }))} className={`text-xs font-black px-4 py-2.5 rounded-xl transition-all ${state.stressTestApplied.jobLoss ? 'bg-red-500 text-white shadow-md' : 'bg-appCard border border-appBorder text-appText hover:bg-appHoverBg'}`}>{state.stressTestApplied.jobLoss ? t('btn_clear') : t('btn_apply')}</button>
                      </div>
                      <div className="p-5 rounded-2xl border border-appBorder bg-appHoverBg/30 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-sm text-appText">Critical Medical Shock (₹5,00,000)</div>
                          <div className="text-[10px] text-appTextSec mt-0.5 font-bold">Deducts ₹5,00,000 flat from Cash reserves.</div>
                        </div>
                        <button onClick={() => setState(prev => ({ ...prev, stressTestApplied: { ...prev.stressTestApplied, medicalEmergency: !prev.stressTestApplied.medicalEmergency } }))} className={`text-xs font-black px-4 py-2.5 rounded-xl transition-all ${state.stressTestApplied.medicalEmergency ? 'bg-red-500 text-white shadow-md' : 'bg-appCard border border-appBorder text-appText hover:bg-appHoverBg'}`}>{state.stressTestApplied.medicalEmergency ? t('btn_clear') : t('btn_apply')}</button>
                      </div>
                    </div>
                    <div className="bg-appHoverBg/30 border border-appBorder p-6 rounded-2xl space-y-4">
                      <h3 className="font-extrabold text-xs text-appTextSec uppercase tracking-widest font-heading">Simulation Warnings</h3>
                      {stressTestWarnings.length === 0 ? (
                        <div className="text-xs text-emerald-500 font-bold flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
                          <Check size={16} /><span>Simulation cash reserves healthy. No cash deficits observed.</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {stressTestWarnings.map((warning, idx) => (
                            <div key={idx} className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-xs font-bold leading-relaxed flex items-start gap-2 border-l-4 border-l-red-500">
                              <AlertTriangle size={16} className="shrink-0 mt-0.5" /><span>{warning}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="text-xs text-appTextSec border-t border-appBorder/50 pt-4 flex justify-between font-bold">
                        <span>Projected Simulation Cash Balance:</span>
                        <span className={`font-mono font-black ${netWorthMetrics.cashVal < 0 ? 'text-red-400' : 'text-emerald-500'}`}><MaskValue value={netWorthMetrics.cashVal} /></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 10: IMPULSE BUY SIMULATOR [NEW] - SPACIOUS */}
              {activeTab === 'impulse' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Cost Input */}
                  <div className="glass-card p-6 space-y-6 lg:col-span-1 h-fit">
                    <div className="flex items-center gap-2 border-b border-appBorder/50 pb-4">
                      <Sparkles className="text-appPrimary" size={18} />
                      <h2 className="text-xs font-black uppercase tracking-widest text-appText font-heading">{t('impulse_title')}</h2>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-[9px] text-appTextSec uppercase font-black tracking-widest mb-1.5 block">{t('item_cost')}</label>
                        <input 
                          type="number" 
                          value={state.impulseCost}
                          onChange={(e) => setState(prev => ({ ...prev, impulseCost: Number(e.target.value) }))}
                          className="w-full text-sm font-bold"
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-appHoverBg/30 border border-appBorder/50 text-xs text-appTextSec leading-relaxed">
                      💡 The Impulse Purchase Simulator contextualizes discretionary expenditures by converting numeric prices into physical labor hours and long-term investment opportunity costs.
                    </div>
                  </div>

                  {/* Right Column: Dynamic Projections & Guidelines */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Math projections */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      
                      <div className="glass-card p-6 space-y-3">
                        <div className="text-[9px] text-appTextSec font-bold uppercase tracking-widest">{t('labor_cost_calc')}</div>
                        <div className="text-2xl font-black text-appText font-mono">
                          {laborHoursRequired.toFixed(1)} Hours
                        </div>
                        <p className="text-[10px] text-appTextSec font-bold leading-relaxed">
                          This item costs you {laborHoursRequired.toFixed(1)} hours of actual, physical labor (assuming a current rate of {formatINR(laborRatePerHour)}/hour derived from your monthly take-home salary).
                        </p>
                      </div>

                      <div className="glass-card p-6 space-y-3">
                        <div className="text-[9px] text-appTextSec font-bold uppercase tracking-widest">{t('opportunity_cost_calc')}</div>
                        <div className="text-2xl font-black text-appPrimary font-mono">
                          {formatINR(impulseOppCost)}
                        </div>
                        <p className="text-[10px] text-appTextSec font-bold leading-relaxed">
                          If instead of purchasing this item, you invested the same amount at an average rate of 12% p.a., it would grow to {formatINR(impulseOppCost)} in 15 years.
                        </p>
                      </div>

                    </div>

                    {/* Anti-impulse guidelines */}
                    <div className="glass-card p-6 space-y-4">
                      <h4 className="font-extrabold text-xs text-appText uppercase tracking-wider border-b border-appBorder/50 pb-2">🛡️ Impulse-Buy Decisive Rules</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-appTextSec">
                        <div className="bg-appHoverBg/10 border border-appBorder/30 p-4 rounded-xl space-y-1.5">
                          <h5 className="font-black text-appText">⏳ The 48-Hour Wait Rule</h5>
                          <p className="leading-relaxed">Wait exactly 48 hours before purchasing this item. If the desire persists, re-evaluate. Often, the initial spike of purchase excitement fades.</p>
                        </div>
                        <div className="bg-appHoverBg/10 border border-appBorder/30 p-4 rounded-xl space-y-1.5">
                          <h5 className="font-black text-appText">🛒 Needs vs Wants Audit</h5>
                          <p className="leading-relaxed">Verify if this is a survival/well-being necessity or a transient want. If it falls under wants, ensure it does not break your 30% wants budget cap.</p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 12: LIFE VAULT */}
              {activeTab === 'vault' && (
                <div className="glass-card p-6 space-y-6">
                  <div className="flex items-center gap-1.5 border-b border-appBorder/50 pb-4">
                    <Lock className="text-appPrimary" size={18} />
                    <h2 className="text-xs font-black uppercase tracking-widest text-appText font-heading">{t('vault_title')}</h2>
                  </div>
                  <p className="text-xs text-appTextSec font-bold">{t('vault_subtitle')}</p>
                  <div className="space-y-3.5 max-w-xl">
                    {[
                      { key: 'termLifeNominee', label: 'Term Life Nominee Registered & Updated' },
                      { key: 'willDrafted', label: 'Will Drafted & Signed by Witnesses' },
                      { key: 'passwordsShared', label: 'Secure Folder Credentials shared with Trusted Family Member' },
                      { key: 'healthCardsPrinted', label: 'Physical Health Cards Printed & Placed in Emergency Bag' },
                      { key: 'bankNomineeAdded', label: 'Nominees Registered for all active Bank Accounts' }
                    ].map(item => (
                      <label key={item.key} className="flex items-center gap-3.5 p-4 bg-appHoverBg/30 hover:bg-appHoverBg/50 rounded-2xl border border-appBorder/50 cursor-pointer transition-all relative overflow-hidden group select-none">
                        <input type="checkbox" checked={state.documentVault[item.key]} onChange={(e) => setState(prev => ({ ...prev, documentVault: { ...prev.documentVault, [item.key]: e.target.checked } }))} className="w-5 h-5 rounded text-appPrimary focus:ring-0 cursor-pointer border-appBorder" />
                        <span className="relative text-xs font-black text-appText ml-1">
                          {item.label}
                          {state.documentVault[item.key] && (
                            <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.25 }} className="absolute left-0 top-1/2 -translate-y-1/2 h-[1.5px] bg-appTextSec/50" />
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>

        {/* Global Client-side Footer Removed */}
      </div>

      {/* Slide-out System Settings Drawer */}
      <AnimatePresence>
        {showSettingsModal && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSettingsModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 220 }} className="relative w-full max-w-sm h-full bg-appCard/95 backdrop-blur-md border-l border-appBorder shadow-2xl p-6 flex flex-col justify-between overflow-y-auto" >
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-appBorder/50 pb-4">
                  <div>
                    <h3 className="font-extrabold text-sm text-appText uppercase tracking-wider flex items-center gap-2 font-heading"><Settings size={18} className="text-appPrimary" />Preferences</h3>
                    <p className="text-[9px] text-appTextSec font-bold uppercase tracking-wider mt-0.5">Configure Local Environment</p>
                  </div>
                  <button onClick={() => setShowSettingsModal(false)} className="text-appTextSec hover:text-appText p-1.5 rounded-lg hover:bg-appHoverBg/40 transition-all"><X size={18} /></button>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] text-appTextSec uppercase font-black tracking-widest block">Visual Theme Accent</label>
                  <div className="space-y-2">
                    {[
                      { id: 'theme-emerald-matrix', name: 'Emerald Matrix', color: 'bg-emerald-500' },
                      { id: 'theme-nordic-slate', name: 'Nordic Slate', color: 'bg-blue-500' },
                      { id: 'theme-midnight-cyber', name: 'Midnight Cyber', color: 'bg-fuchsia-500' }
                    ].map(tOpt => (
                      <button key={tOpt.id} onClick={() => setState(prev => ({ ...prev, theme: tOpt.id }))} className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-xs font-black transition-all ${state.theme === tOpt.id ? 'border-appPrimary bg-appHoverBg text-appText' : 'border-appBorder bg-appCard/50 text-appTextSec hover:bg-appHoverBg/55'}`} >
                        <span className="flex items-center gap-2.5"><span className={`w-3.5 h-3.5 rounded-full ${tOpt.color}`}></span>{tOpt.name}</span>
                        {state.theme === tOpt.id && <span className="text-appPrimary text-xs font-bold">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] text-appTextSec uppercase font-black tracking-widest block">System Language</label>
                  <div className="grid grid-cols-5 gap-1.5 bg-appHoverBg p-1.5 rounded-xl border border-appBorder">
                    {['en', 'kn', 'hi', 'ta', 'te'].map(code => (
                      <button key={code} onClick={() => setState(prev => ({ ...prev, lang: code }))} className={`py-2 text-[10px] font-black rounded-lg uppercase transition-all ${state.lang === code ? 'bg-appCard text-appText shadow-md' : 'text-appTextSec hover:text-appText'}`} >{code}</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] text-appTextSec uppercase font-black tracking-widest block">Offline Sync</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => { setShowSettingsModal(false); setShowQrModal(true); }} className="flex flex-col items-center justify-center p-4 rounded-xl border border-appBorder/50 bg-appHoverBg/30 hover:bg-appHoverBg text-appText text-center gap-1.5 transition-all" ><span className="text-base">📱</span><span className="text-[9px] font-black uppercase tracking-wider">{t('btn_show_qr')}</span></button>
                    <button onClick={() => { setShowSettingsModal(false); startCameraScanner(); }} className="flex flex-col items-center justify-center p-4 rounded-xl border border-appBorder/50 bg-appHoverBg/30 hover:bg-appHoverBg text-appText text-center gap-1.5 transition-all" ><span className="text-base">📷</span><span className="text-[9px] font-black uppercase tracking-wider">{t('btn_scan_qr')}</span></button>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] text-appTextSec uppercase font-black tracking-widest block">Backup Portability</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="file" ref={fileInputRef} onChange={handleImportJson} style={{ display: 'none' }} accept=".txt" />
                    <button onClick={() => { fileInputRef.current?.click(); }} className="flex items-center justify-center gap-1.5 py-3 rounded-xl border border-appBorder bg-appHoverBg text-appText text-[10px] font-black uppercase tracking-wider transition-all" ><Download size={13} />{t('btn_import')}</button>
                    <button onClick={handleExportJson} className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-appPrimary hover:bg-appPrimaryHover text-white text-[10px] font-black uppercase tracking-wider shadow-lg shadow-appPrimary/25 transition-all" ><Upload size={13} />{t('btn_export')}</button>
                  </div>
                </div>
              </div>
              {/* Settings modal footer removed */}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QR Code Modal sync */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-appCard p-6 rounded-2xl max-w-sm w-full border border-appBorder/50 shadow-2xl text-center space-y-4">
            <h3 className="font-extrabold text-sm text-appText uppercase tracking-wider font-heading">{t('sync_title')}</h3>
            <p className="text-xs text-appTextSec font-bold">{t('show_qr_code')}</p>
            <div className="bg-white p-4 rounded-xl flex justify-center inline-block">
              <QRCodeSVG value={qrStateString} size={200} />
            </div>
            <button onClick={() => setShowQrModal(false)} className="bg-appText text-appCard font-bold py-3 w-full rounded-xl text-xs hover:opacity-90 transition-all font-heading">Close Sync View</button>
          </div>
        </div>
      )}

      {/* QR scanner camera Modal */}
      {showScanner && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-appCard p-6 rounded-2xl max-w-sm w-full border border-appBorder/50 shadow-2xl text-center space-y-4">
            <h3 className="font-extrabold text-sm text-appText uppercase tracking-wider font-heading">{t('scan_webcam')}</h3>
            <div id="scanner-viewport" className="w-full h-64 bg-appBg rounded-xl overflow-hidden border border-appBorder/50"></div>
            {scanError && <p className="text-xs text-red-500 font-bold">{scanError}</p>}
            <button onClick={closeCameraScanner} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 w-full rounded-xl text-xs transition-all font-heading">Cancel Scan</button>
          </div>
        </div>
      )}

    </div>
  );
}
