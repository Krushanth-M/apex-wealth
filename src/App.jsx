import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend 
} from 'recharts';
import { QRCodeSVG } from 'qrcode.react';
import { Html5Qrcode } from 'html5-qrcode';
import { 
  Wallet, Target, Percent, TrendingUp, BarChart3, Lock, Eye, EyeOff, 
  Download, Upload, Info, X, Plus, Trash2, ShieldAlert, Sparkles, Settings, CreditCard, Menu
} from 'lucide-react';

// ====================================================
// STATE OBFUSCATION / ENCRYPTION ENGINE
// ====================================================
const ENCRYPTION_KEY = 'APEX_INTEL_CYPHER_KEY';

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
    title: "Apex Intel",
    tagline: "Strictly Offline Personal Finance & Privacy PWA",
    tab_budget: "Budget Planner",
    tab_savings: "Savings Goals",
    tab_loan: "EMI Calculator",
    tab_growth: "Growth Simulator",
    tab_debt: "Debt Payoff",
    tab_networth: "Net Worth",
    tab_stresstest: "Stress Testing",
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
    best_case: "Best-Case Scenario (16%)",
    median_case: "Median Trend (12%)",
    worst_case: "Worst-Case Scenario (8%)",
    fire_title: "FIRE Speedometer",
    fire_target: "FIRE Target Corpus",
    fire_autonomy: "FIRE Autonomy",
    fire_tooltip: "FIRE (Financial Independence, Retire Early) target is calculated as 25x-30x of your annual expenses.",
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
    tab_savings: "ಉಳಿತಾಯ ಗುರಿಗಳು",
    tab_loan: "ಸಾಮಾನ್ಯ ಇಎಂಐ",
    tab_growth: "ಬೆಳವಣಿಗೆಯ ಸಿಮ್ಯುಲೇಟರ್",
    tab_debt: "ಸಾಲ ತೀರಿಸುವಿಕೆ",
    tab_networth: "ನಿವ್ವಳ ಮೌಲ್ಯ",
    tab_stresstest: "ಒತ್ತಡ ಪರೀಕ್ಷೆ",
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
    best_case: "ಉತ್ತಮ ಸನ್ನಿವೇಶ (16%)",
    median_case: "ಮಧ್ಯಮ ಪ್ರವೃತ್ತಿ (12%)",
    worst_case: "ಕಡಿಮೆ ಸನ್ನಿವೇಶ (8%)",
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
    tab_savings: "बचत लक्ष्य",
    tab_loan: "ऋण ईएमआई",
    tab_growth: "विकास सिम्युलेटर",
    tab_debt: "ऋण चुकौती",
    tab_networth: "कुल संपत्ति",
    tab_stresstest: "तनाव परीक्षण",
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
    best_case: "सर्वश्रेष्ठ परिदृश्य (16%)",
    median_case: "मध्यम प्रवृत्ति (12%)",
    worst_case: "सबसे खराब परिदृश्य (8%)",
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
    tab_savings: "சேமிப்பு இலக்குகள்",
    tab_loan: "கடன் தவணை",
    tab_growth: "வளர்ச்சி சிமுலேட்டர்",
    tab_debt: "கடன் தீர்த்தல்",
    tab_networth: "நிகர மதிப்பு",
    tab_stresstest: "அழுத்த சோதனை",
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
    other_income_label: "இதர மாத வருமானம் (₹)",
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
    best_case: "சிறந்த சூழ்நிலை (16%)",
    median_case: "நடுத்தர போக்கு (12%)",
    worst_case: "மோசமான சூழ்நிலை (8%)",
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
    tab_savings: "పొదుపు లక్ష్యాలు",
    tab_loan: "ఈఎంఐ క్యాలిక్యులేటర్",
    tab_growth: "వృద్ధి సిమ్యులేటర్",
    tab_debt: "రుణ విముక్తి",
    tab_networth: "నికర విలువ",
    tab_stresstest: "ఒత్తిడి పరీక్ష",
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
    best_case: "అత్యుత్తమ మార్గం (16%)",
    median_case: "మధ్యస్థ మార్గం (12%)",
    worst_case: "అల్ప మార్గం (8%)",
    fire_title: "FIRE స్పీడోమీటర్",
    fire_target: "FIRE లక్ష్య నిధి",
    fire_autonomy: "FIRE పురోగతి",
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
    vault_subtitle: "మీ ముఖ్యమైన కుటుంబ రికార్డులను ఆఫ్‌లైన్‌లో భద్రపరచుకోండి"
  }
};

// ====================================================
// INITIAL SYSTEM DEFAULT STATE
// ====================================================
const initialAppState = {
  lang: 'en',
  theme: 'theme-emerald-matrix',
  salary: 50000,
  otherIncome: 5000,
  fixedExpenses: [
    { id: 1, name: 'House Rent', amount: 15000 },
    { id: 2, name: 'Car Loan EMI', amount: 8000 },
    { id: 3, name: 'Insurance Premium', amount: 2000 }
  ],
  variableExpenses: [
    { id: 4, name: 'Groceries & Household', amount: 7000 },
    { id: 5, name: 'Dining & Leisure', amount: 4000 },
    { id: 6, name: 'Shopping & Fuel', amount: 5000 }
  ],
  impulseCost: 10000,
  fireFactor: 25,
  currentLiquidAssets: 200000,
  stressTestApplied: {
    jobLoss: false,
    medicalEmergency: false
  },
  sinkingFunds: [
    { id: 1, name: 'Car Insurance & Tax', annualAmount: 12000 },
    { id: 2, name: 'Festival Budget', annualAmount: 24000 }
  ],
  applyHaircut: false,
  assets: {
    cash: 80000,
    stocks: 150000,
    gold: 200000,
    property: 3500000,
    other: 30000
  },
  liabilities: {
    homeLoan: 800000,
    personalLoan: 40000,
    creditCard: 12000,
    otherDebt: 0
  },
  documentVault: {
    termLifeNominee: false,
    willDrafted: false,
    passwordsShared: false,
    healthCardsPrinted: false,
    bankNomineeAdded: false
  },
  privacyActive: false
};

const formatINR = (num) => {
  return '₹' + Math.round(num).toLocaleString('en-IN');
};

// ====================================================
// MINIMAL ONBOARDING GUIDE DOT COMPONENT
// ====================================================
const OnboardingDot = ({ text }) => {
  return (
    <span className="tooltip-container ml-1">
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
    const saved = localStorage.getItem('apex_intel_secured_state');
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

  const handleThemeChange = (newTheme) => {
    setState(prev => ({ ...prev, theme: newTheme }));
  };

  const handleExportJson = () => {
    try {
      const cipher = encryptState(state);
      const blob = new Blob([cipher], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `apex_intel_backup_${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Backup export failed:", e);
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

  // Encrypted state sync on updates
  useEffect(() => {
    const cipher = encryptState(state);
    localStorage.setItem('apex_intel_secured_state', cipher);
    document.documentElement.className = state.theme;
  }, [state]);

  // Module 1: Double Escape Panic Key
  useEffect(() => {
    let lastEsc = 0;
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        const now = Date.now();
        if (now - lastEsc < 500) {
          localStorage.removeItem('apex_intel_secured_state');
          window.location.href = 'https://www.google.com';
        }
        lastEsc = now;
      }
    };
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, []);

  // i18n switcher
  const t = (key, replacements = {}) => {
    const lang = state.lang || 'en';
    let text = i18n[lang]?.[key] || i18n['en']?.[key] || key;
    Object.keys(replacements).forEach(r => {
      text = text.replace(`{${r}}`, replacements[r]);
    });
    return text;
  };

  // Module 1: Privacy Value Masking with Framer Motion Blurs
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
          animate={{ filter: isHovered ? "blur(0px)" : "blur(5px)" }}
          transition={{ duration: 0.2 }}
          className="inline-block font-mono font-medium text-gray-900"
        >
          {displayVal}
        </motion.span>
        {!isHovered && (
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-gray-400 tracking-wider pointer-events-none select-none">
            ₹***
          </span>
        )}
      </span>
    );
  };

  // ====================================================
  // RECHARTS FORECAST MATHEMATICS
  // ====================================================
  const monteCarloData = useMemo(() => {
    const data = [];
    let worst = 10000;
    let median = 10000;
    let best = 10000;

    const rW = 0.08 / 12; // Worst-Case Scenario: 8%
    const rM = 0.12 / 12; // Median Trend: 12%
    const rB = 0.16 / 12; // Best-Case Scenario: 16%

    for (let y = 1; y <= 15; y++) {
      for (let m = 1; m <= 12; m++) {
        worst = (worst + 2000) * (1 + rW);
        median = (median + 2000) * (1 + rM);
        best = (best + 2000) * (1 + rB);
      }
      data.push({
        name: `Yr ${y}`,
        [t('worst_case')]: Math.round(worst),
        [t('median_case')]: Math.round(median),
        [t('best_case')]: Math.round(best)
      });
    }
    return data;
  }, [state.lang]);

  // ====================================================
  // LEDGER CALCULATION LOGIC
  // ====================================================
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

    return { totalIncome, totalFixed, totalVariable, totalExpenses, surplus, agilityScore };
  }, [state.salary, state.otherIncome, state.fixedExpenses, state.variableExpenses, sinkingFundWithholding]);

  const impulseOppCost = state.impulseCost * 5.9958;
  const laborRatePerHour = state.salary / 160;
  const laborHoursRequired = laborRatePerHour > 0 ? state.impulseCost / laborRatePerHour : 0;

  // Illiquid valuation slashes Module 4
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
      cashVal = Math.max(-200000, cashVal - 500000);
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

  // speedometer autnonomy calculations
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

  // QR Sync importers
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

  const tabsList = [
    { id: 'budget', icon: <Wallet size={16} /> },
    { id: 'savings', icon: <Target size={16} /> },
    { id: 'loan', icon: <CreditCard size={16} /> },
    { id: 'growth', icon: <TrendingUp size={16} /> },
    { id: 'debt', icon: <Percent size={16} /> },
    { id: 'networth', icon: <BarChart3 size={16} /> },
    { id: 'stresstest', icon: <ShieldAlert size={16} /> },
    { id: 'vault', icon: <Lock size={16} /> }
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50/30 text-gray-900 font-sans selection:bg-appPrimary/10 w-full overflow-x-hidden">
      
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <img src="/icon.svg" className="w-8 h-8" alt="Logo" />
          <span className="font-extrabold text-sm tracking-tight text-gray-900">{t('title')}</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setState(prev => ({ ...prev, privacyActive: !prev.privacyActive }))}
            className={`p-2 rounded-xl border transition-all ${state.privacyActive ? 'bg-red-50 border-red-100 text-red-500' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
          >
            {state.privacyActive ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 bg-gray-50 border border-gray-100 rounded-xl text-gray-600 hover:bg-gray-100 transition-all"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            {/* Slide drawer */}
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-64 h-full bg-white shadow-2xl p-6 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <img src="/icon.svg" className="w-8 h-8" alt="Logo" />
                    <div>
                      <h1 className="text-sm font-extrabold text-gray-900 tracking-tight">{t('title')}</h1>
                      <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">Offline Finance</p>
                    </div>
                  </div>
                  <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-900 p-1">
                    <X size={18} />
                  </button>
                </div>

                <nav className="space-y-1.5">
                  {tabsList.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${activeTab === tab.id ? 'bg-appPrimary text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                      {tab.icon}
                      <span>{t(`tab_${tab.id}`)}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <button 
                  onClick={() => { setSidebarOpen(false); setShowSettingsModal(true); }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all"
                >
                  <span className="flex items-center gap-3">
                    <Settings size={16} />
                    <span>Settings</span>
                  </span>
                  <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full">v4.0</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 h-screen sticky top-0 z-30 shrink-0">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <img src="/icon.svg" className="w-8 h-8" alt="Logo" />
          <div>
            <h1 className="text-base font-extrabold text-gray-900 tracking-tight">{t('title')}</h1>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Offline Finance</p>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          {tabsList.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${activeTab === tab.id ? 'bg-appPrimary text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              {tab.icon}
              <span>{t(`tab_${tab.id}`)}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={() => setShowSettingsModal(true)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all"
          >
            <span className="flex items-center gap-3">
              <Settings size={16} />
              <span>Settings</span>
            </span>
            <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full">v4.0</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-h-screen overflow-x-hidden">
        {/* Desktop Header */}
        <header className="hidden md:flex justify-between items-center px-8 py-5 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900 uppercase tracking-wider">{t(`tab_${activeTab}`)}</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t('tagline')}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Eye Icon Privacy Toggle */}
            <button 
              onClick={() => setState(prev => ({ ...prev, privacyActive: !prev.privacyActive }))}
              className={`p-2.5 rounded-xl border transition-all ${state.privacyActive ? 'bg-red-50/50 border-red-200 text-red-500' : 'bg-gray-50 border-gray-100 text-gray-400 hover:text-gray-900'}`}
              title="Privacy Masking Eye Toggle"
            >
              {state.privacyActive ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

            {/* Quick Settings trigger */}
            <button 
              onClick={() => setShowSettingsModal(true)}
              className="p-2.5 rounded-xl border bg-gray-50 border-gray-100 text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all"
              title="Open Settings"
            >
              <Settings size={18} />
            </button>
          </div>
        </header>

        {/* Tab Contents Main */}
        <main className="px-8 py-8 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-full"
          >
            
            {/* TAB 1: BUDGET PLANNER */}
            {activeTab === 'budget' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Inputs card side */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 lg:col-span-1">
                  <h2 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                    <Wallet className="text-appPrimary" size={20} />
                    {t('tab_budget')}
                  </h2>

                  <div className="space-y-4">
                    <div className="input-group">
                      <label className="text-[10px] text-gray-400 uppercase font-black tracking-wider mb-1.5 block">{t('salary_label')}</label>
                      <input 
                        type="number" 
                        value={state.salary}
                        onChange={(e) => setState(prev => ({ ...prev, salary: Number(e.target.value) }))}
                        className="bg-gray-50 border border-gray-100 text-sm px-4 py-2.5 rounded-xl w-full text-gray-800 focus:outline-none focus:border-appPrimary transition-all"
                      />
                    </div>

                    <div className="input-group">
                      <label className="text-[10px] text-gray-400 uppercase font-black tracking-wider mb-1.5 block">{t('other_income_label')}</label>
                      <input 
                        type="number" 
                        value={state.otherIncome}
                        onChange={(e) => setState(prev => ({ ...prev, otherIncome: Number(e.target.value) }))}
                        className="bg-gray-50 border border-gray-100 text-sm px-4 py-2.5 rounded-xl w-full text-gray-800 focus:outline-none focus:border-appPrimary transition-all"
                      />
                    </div>
                  </div>

                  {/* Sinking Ledgers Module 4 */}
                  <div className="pt-6 border-t border-gray-100 space-y-4">
                    <h3 className="font-extrabold text-xs text-gray-900 uppercase tracking-wider flex items-center justify-between">
                      <span>📅 {t('sinking_fund_title')}</span>
                      <OnboardingDot text="Irregular bills (annual premiums, tax, festivals) are amortized monthly so they don't crash your monthly budgets." />
                    </h3>
                    
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {state.sinkingFunds.map(fund => (
                        <div key={fund.id} className="flex justify-between items-center bg-gray-50/50 border border-gray-100 p-2.5 rounded-xl text-xs">
                          <div>
                            <div className="font-bold text-gray-700">{fund.name}</div>
                            <div className="text-[10px] text-gray-400">{t('sinking_withholding', { val: Math.round(fund.annualAmount/12) })}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-gray-800"><MaskValue value={fund.annualAmount} /></span>
                            <button 
                              onClick={() => setState(prev => ({ ...prev, sinkingFunds: prev.sinkingFunds.filter(f => f.id !== fund.id) }))}
                              className="text-red-400 hover:text-red-500 p-1"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input 
                        id="newSinkName" 
                        type="text" 
                        placeholder="Premium / Festival Name" 
                        className="bg-gray-50 border border-gray-100 text-xs p-2 rounded-xl w-3/5 focus:outline-none"
                      />
                      <input 
                        id="newSinkAmt" 
                        type="number" 
                        placeholder="₹ Yr" 
                        className="bg-gray-50 border border-gray-100 text-xs p-2 rounded-xl w-2/5 focus:outline-none"
                      />
                      <button 
                        onClick={() => {
                          const n = document.getElementById('newSinkName');
                          const a = document.getElementById('newSinkAmt');
                          if (n.value && a.value) {
                            setState(prev => ({
                              ...prev,
                              sinkingFunds: [...prev.sinkingFunds, { id: Date.now(), name: n.value, annualAmount: Number(a.value) }]
                            }));
                            n.value = ''; a.value = '';
                          }
                        }}
                        className="bg-appPrimary hover:bg-appPrimaryHover text-white px-3.5 rounded-xl text-xs font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Outputs & scores */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1">Total Income</div>
                      <div className="text-lg font-extrabold text-appPrimary"><MaskValue value={budgetMetrics.totalIncome} /></div>
                    </div>
                    <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1">{t('fixed_costs')}</div>
                      <div className="text-lg font-extrabold text-gray-800"><MaskValue value={budgetMetrics.totalFixed} /></div>
                    </div>
                    <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1">{t('variable_costs')}</div>
                      <div className="text-lg font-extrabold text-gray-800"><MaskValue value={budgetMetrics.totalVariable} /></div>
                    </div>
                    <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1">{t('surplus_label')}</div>
                      <div className="text-lg font-extrabold text-emerald-600"><MaskValue value={budgetMetrics.surplus} /></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Module 2: Agility Score */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                      <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-wider flex items-center gap-1">
                        <span>⚡ {t('agility_score')}</span>
                        <OnboardingDot text={t('agility_tooltip')} />
                      </h3>
                      <div className="flex justify-between items-center">
                        <div className="text-3xl font-black text-gray-900">{Math.round(budgetMetrics.agilityScore)}%</div>
                        <div className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${budgetMetrics.agilityScore > 65 ? 'bg-emerald-50 text-emerald-700' : budgetMetrics.agilityScore >= 45 ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-500'}`}>
                          {budgetMetrics.agilityScore > 65 ? "Flexible" : budgetMetrics.agilityScore >= 45 ? "Moderate" : "Locked In!"}
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                        <div className="h-full bg-appPrimary transition-all duration-500" style={{ width: `${budgetMetrics.agilityScore}%` }}></div>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        {budgetMetrics.agilityScore > 65 
                          ? "Highly flexible. Low fixed commitments means you can easily navigate income drops."
                          : budgetMetrics.agilityScore >= 45
                            ? "Balanced budget. Monitor fixed overheads to maintain structural agility."
                            : "Low financial agility! A large portion of your cash flow is committed to fixed obligations."}
                      </p>
                      <div className="text-xs text-gray-500 pt-2 border-t border-gray-100 flex justify-between">
                        <span>{t('sinking_fund_deduction')}:</span>
                        <span className="font-bold font-mono text-gray-900"><MaskValue value={sinkingFundWithholding} /></span>
                      </div>
                    </div>

                    {/* Module 2: Impulse simulator */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                      <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles size={16} className="text-appPrimary" />
                        {t('impulse_title')}
                      </h3>
                      <div className="input-group">
                        <label className="text-[10px] text-gray-400 uppercase font-black tracking-wider mb-1.5 block">{t('item_cost')}</label>
                        <input 
                          type="number" 
                          value={state.impulseCost}
                          onChange={(e) => setState(prev => ({ ...prev, impulseCost: Number(e.target.value) }))}
                          className="bg-gray-50 border border-gray-100 text-xs px-3.5 py-2 rounded-xl w-full text-gray-800 focus:outline-none"
                        />
                      </div>
                      <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 text-xs space-y-3">
                        <div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">{t('labor_cost_calc')}</div>
                          <p className="font-bold text-gray-700">{t('labor_hours_msg', { hours: laborHoursRequired.toFixed(1), rate: Math.round(laborRatePerHour) })}</p>
                        </div>
                        <div className="border-t border-gray-100 pt-2.5">
                          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">{t('opportunity_cost_calc')}</div>
                          <p className="font-bold text-appPrimary">{t('opp_cost_msg', { val: formatINR(impulseOppCost) })}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expense subledgers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                      <h3 className="font-extrabold text-xs text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">🏠 {t('fixed_costs')}</h3>
                      <div className="space-y-2">
                        {state.fixedExpenses.map(exp => (
                          <div key={exp.id} className="flex justify-between items-center text-xs text-gray-600">
                            <span>{exp.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-gray-800"><MaskValue value={exp.amount} /></span>
                              <button 
                                onClick={() => setState(prev => ({ ...prev, fixedExpenses: prev.fixedExpenses.filter(e => e.id !== exp.id) }))}
                                className="text-red-400 hover:text-red-500"
                              >
                                ❌
                              </button>
                            </div>
                          </div>
                        ))}
                        <div className="flex gap-2 pt-2 border-t border-gray-50">
                          <input id="addFixedN" type="text" placeholder="Rent, EMI..." className="bg-gray-50 text-xs p-2 rounded-xl w-3/5 focus:outline-none" />
                          <input id="addFixedA" type="number" placeholder="₹" className="bg-gray-50 text-xs p-2 rounded-xl w-2/5 focus:outline-none" />
                          <button onClick={() => {
                            const n = document.getElementById('addFixedN');
                            const a = document.getElementById('addFixedA');
                            if (n.value && a.value) {
                              setState(prev => ({ ...prev, fixedExpenses: [...prev.fixedExpenses, { id: Date.now(), name: n.value, amount: Number(a.value) }] }));
                              n.value = ''; a.value = '';
                            }
                          }} className="bg-appPrimary text-white font-bold px-3.5 rounded-xl">+</button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                      <h3 className="font-extrabold text-xs text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">🍿 {t('variable_costs')}</h3>
                      <div className="space-y-2">
                        {state.variableExpenses.map(exp => (
                          <div key={exp.id} className="flex justify-between items-center text-xs text-gray-600">
                            <span>{exp.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-gray-800"><MaskValue value={exp.amount} /></span>
                              <button 
                                onClick={() => setState(prev => ({ ...prev, variableExpenses: prev.variableExpenses.filter(e => e.id !== exp.id) }))}
                                className="text-red-400 hover:text-red-500"
                              >
                                ❌
                              </button>
                            </div>
                          </div>
                        ))}
                        <div className="flex gap-2 pt-2 border-t border-gray-50">
                          <input id="addVarN" type="text" placeholder="Leisure..." className="bg-gray-50 text-xs p-2 rounded-xl w-3/5 focus:outline-none" />
                          <input id="addVarA" type="number" placeholder="₹" className="bg-gray-50 text-xs p-2 rounded-xl w-2/5 focus:outline-none" />
                          <button onClick={() => {
                            const n = document.getElementById('addVarN');
                            const a = document.getElementById('addVarA');
                            if (n.value && a.value) {
                              setState(prev => ({ ...prev, variableExpenses: [...prev.variableExpenses, { id: Date.now(), name: n.value, amount: Number(a.value) }] }));
                              n.value = ''; a.value = '';
                            }
                          }} className="bg-appPrimary text-white font-bold px-3.5 rounded-xl">+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SAVINGS GOALS */}
            {activeTab === 'savings' && (
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                <h2 className="text-lg font-extrabold text-gray-900 uppercase tracking-wider">🎯 {t('tab_savings')}</h2>
                <p className="text-xs text-gray-400">Budget surplus of <span className="font-bold text-emerald-600 font-mono">{formatINR(budgetMetrics.surplus)}/mo</span> updates local financial trajectories. Setup targets inside the **Net Worth** asset tracker.</p>
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 text-xs text-gray-500 leading-relaxed max-w-xl">
                  <strong>Structural Goal Allocations:</strong> All savings targets are funded client-side using liquid asset valuations (cash + stocks).
                </div>
              </div>
            )}

            {/* TAB 3: EMI CALCULATOR */}
            {activeTab === 'loan' && (
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                <h2 className="text-lg font-extrabold text-gray-900 uppercase tracking-wider">📊 {t('tab_loan')}</h2>
                <p className="text-xs text-gray-400">Personal loan planners. Outstanding liabilities register under the Net Worth sheets, feeding directly into the Budget Fixed obligations.</p>
              </div>
            )}

            {/* TAB 4: GROWTH SIMULATOR (RECHARTS MONTE CARLO) */}
            {activeTab === 'growth' && (
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                <h2 className="text-lg font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span>📈 {t('monte_carlo_title')}</span>
                  <OnboardingDot text="Monte Carlo simulations plot best, worst and median market paths based on standard deviations." />
                </h2>
                <p className="text-xs text-gray-400">Simulating long-term projections of ₹2,000 monthly SIP + ₹10,000 lump sum over a 15-year horizon.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-red-50/50 p-4 rounded-xl border border-red-100 text-center">
                    <div className="text-[10px] text-red-500 uppercase font-black tracking-wider mb-1">{t('worst_case')}</div>
                    <div className="text-lg font-mono font-extrabold text-red-600"><MaskValue value={monteCarloData[14][t('worst_case')]} /></div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                    <div className="text-[10px] text-gray-400 uppercase font-black tracking-wider mb-1">{t('median_case')}</div>
                    <div className="text-lg font-mono font-extrabold text-appPrimary"><MaskValue value={monteCarloData[14][t('median_case')]} /></div>
                  </div>
                  <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 text-center">
                    <div className="text-[10px] text-emerald-500 uppercase font-black tracking-wider mb-1">{t('best_case')}</div>
                    <div className="text-lg font-mono font-extrabold text-emerald-600"><MaskValue value={monteCarloData[14][t('best_case')]} /></div>
                  </div>
                </div>

                <div className="w-full h-80 pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monteCarloData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} tickFormatter={(v) => `₹${(v/100000).toFixed(1)}L`} />
                      <ChartTooltip formatter={(v) => formatINR(v)} contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '11px' }} />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                      <Line type="monotone" dataKey={t('best_case')} stroke="#059669" strokeWidth={2} dot={false} animationDuration={1000} />
                      <Line type="monotone" dataKey={t('median_case')} stroke="var(--primary)" strokeWidth={2} dot={false} animationDuration={1000} />
                      <Line type="monotone" dataKey={t('worst_case')} stroke="#ef4444" strokeWidth={2} dot={false} animationDuration={1000} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* TAB 5: DEBT PAYOFF */}
            {activeTab === 'debt' && (
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                <h2 className="text-lg font-extrabold text-gray-900 uppercase tracking-wider">📉 {t('tab_debt')}</h2>
                <p className="text-xs text-gray-400">Strategic roadmap parameters. Configure outstanding liability details inside the Net Worth tracker sheet.</p>
              </div>
            )}

            {/* TAB 6: NET WORTH TRACKER (HAIRCUTS & VALUATIONS) */}
            {activeTab === 'networth' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Inputs card side */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 lg:col-span-1">
                  <h2 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-3 flex items-center justify-between">
                    <span>🏛️ Assets & Debts</span>
                  </h2>

                  {/* Haircut toggle Module 4 */}
                  <div className="flex items-center gap-3 bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                    <input 
                      type="checkbox" 
                      checked={state.applyHaircut}
                      onChange={(e) => setState(prev => ({ ...prev, applyHaircut: e.target.checked }))}
                      className="w-4 h-4 rounded text-appPrimary focus:ring-0 cursor-pointer border-gray-300"
                      id="applyHaircutInput"
                    />
                    <label htmlFor="applyHaircutInput" className="text-xs font-semibold text-gray-700 cursor-pointer select-none">
                      {t('haircut_label')}
                    </label>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-extrabold text-xs text-emerald-600 uppercase tracking-wider">🟢 Assets</h3>
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 font-medium">Cash & Bank (₹):</span>
                        <input 
                          type="number" 
                          value={state.assets.cash}
                          onChange={(e) => setState(prev => ({ ...prev, assets: { ...prev.assets, cash: Number(e.target.value) } }))}
                          className="bg-gray-50 border border-gray-100 text-right p-1.5 rounded-lg w-28 text-gray-800 focus:outline-none"
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Stocks & Mutual Funds (₹):</span>
                        <input 
                          type="number" 
                          value={state.assets.stocks}
                          onChange={(e) => setState(prev => ({ ...prev, assets: { ...prev.assets, stocks: Number(e.target.value) } }))}
                          className="bg-gray-50 border border-gray-100 text-right p-1.5 rounded-lg w-28 text-gray-800 focus:outline-none"
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Gold Value (₹):</span>
                        <input 
                          type="number" 
                          value={state.assets.gold}
                          onChange={(e) => setState(prev => ({ ...prev, assets: { ...prev.assets, gold: Number(e.target.value) } }))}
                          className="bg-gray-50 border border-gray-100 text-right p-1.5 rounded-lg w-28 text-gray-800 focus:outline-none"
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Real Estate Property (₹):</span>
                        <input 
                          type="number" 
                          value={state.assets.property}
                          onChange={(e) => setState(prev => ({ ...prev, assets: { ...prev.assets, property: Number(e.target.value) } }))}
                          className="bg-gray-50 border border-gray-100 text-right p-1.5 rounded-lg w-28 text-gray-800 focus:outline-none"
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Other Assets (₹):</span>
                        <input 
                          type="number" 
                          value={state.assets.other}
                          onChange={(e) => setState(prev => ({ ...prev, assets: { ...prev.assets, other: Number(e.target.value) } }))}
                          className="bg-gray-50 border border-gray-100 text-right p-1.5 rounded-lg w-28 text-gray-800 focus:outline-none"
                        />
                      </div>
                    </div>

                    <h3 className="font-extrabold text-xs text-red-500 uppercase tracking-wider pt-4 border-t border-gray-100">🔴 Liabilities</h3>
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between items-center">
                        <span>Home Loan (₹):</span>
                        <input 
                          type="number" 
                          value={state.liabilities.homeLoan}
                          onChange={(e) => setState(prev => ({ ...prev, liabilities: { ...prev.liabilities, homeLoan: Number(e.target.value) } }))}
                          className="bg-gray-50 border border-gray-100 text-right p-1.5 rounded-lg w-28 text-gray-800 focus:outline-none"
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Personal Loans (₹):</span>
                        <input 
                          type="number" 
                          value={state.liabilities.personalLoan}
                          onChange={(e) => setState(prev => ({ ...prev, liabilities: { ...prev.liabilities, personalLoan: Number(e.target.value) } }))}
                          className="bg-gray-50 border border-gray-100 text-right p-1.5 rounded-lg w-28 text-gray-800 focus:outline-none"
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Credit Cards (₹):</span>
                        <input 
                          type="number" 
                          value={state.liabilities.creditCard}
                          onChange={(e) => setState(prev => ({ ...prev, liabilities: { ...prev.liabilities, creditCard: Number(e.target.value) } }))}
                          className="bg-gray-50 border border-gray-100 text-right p-1.5 rounded-lg w-28 text-gray-800 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Speedometer & Milestones outputs side */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 text-center">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1">Total Valuation Assets</div>
                      <div className="text-lg font-mono font-extrabold text-emerald-600"><MaskValue value={netWorthMetrics.totalAssets} /></div>
                    </div>
                    <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 text-center">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1">Outstanding Debts</div>
                      <div className="text-lg font-mono font-extrabold text-red-500"><MaskValue value={netWorthMetrics.totalLiabilities} /></div>
                    </div>
                    <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 text-center">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1">{t('tab_networth')}</div>
                      <div className="text-lg font-mono font-extrabold text-appPrimary"><MaskValue value={netWorthMetrics.netWorth} /></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Module 3: Radial speedometer using custom SVG + Framer Motion */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-between min-h-[300px]">
                      <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-wider self-start flex items-center gap-1.5">
                        <span>🔥 {t('fire_title')}</span>
                        <OnboardingDot text={t('fire_tooltip')} />
                      </h3>

                      {(() => {
                        const val = Math.min(100, Math.max(0, fireMetrics.progressPct));
                        const radius = 54;
                        const circumference = Math.PI * radius; // Semi-circle
                        const strokeOffset = circumference - (val / 100) * circumference;

                        return (
                          <div className="flex flex-col items-center mt-4">
                            <div className="relative w-48 h-26 overflow-hidden flex items-end justify-center">
                              <svg className="w-48 h-48 absolute top-0 transform rotate-180">
                                {/* Track */}
                                <circle cx="96" cy="96" r={radius} fill="transparent" stroke="#f1f5f9" strokeWidth="12" strokeDasharray={circumference} strokeLinecap="round" />
                                {/* Value Arc */}
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
                                  transition={{ duration: 1.2, ease: "easeOut" }}
                                  strokeLinecap="round" 
                                />
                              </svg>
                              <div className="text-center pb-2 z-10">
                                <div className="text-3xl font-black text-gray-900">{val.toFixed(1)}%</div>
                                <div className="text-[9px] uppercase font-bold text-gray-400 tracking-widest">{t('fire_autonomy')}</div>
                              </div>
                            </div>

                            {/* Factor slider trigger */}
                            <div className="mt-6 flex items-center gap-3">
                              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">FIRE Multiplier:</span>
                              <input 
                                type="range" 
                                min="25" 
                                max="30" 
                                value={state.fireFactor}
                                onChange={(e) => setState(prev => ({ ...prev, fireFactor: Number(e.target.value) }))}
                                className="w-24 cursor-pointer"
                              />
                              <span className="text-xs font-bold text-appPrimary">{state.fireFactor}x</span>
                            </div>
                          </div>
                        );
                      })()}

                      <div className="text-center text-xs text-gray-500 border-t border-gray-100 pt-3 w-full mt-4">
                        <div>{t('fire_target')}: <span className="font-bold font-mono text-gray-900"><MaskValue value={fireMetrics.targetCorpus} /></span></div>
                      </div>
                    </div>

                    {/* Module 4: Tangible translations & Haircuts */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between min-h-[300px] space-y-4">
                      <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                        <span>🏡 {t('tangible_translation')}</span>
                        <OnboardingDot text="Converts long currency digits into local tangible milestone definitions (groceries, flats)." />
                      </h3>

                      <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-2xl text-xs space-y-2.5">
                        <div className="text-[10px] font-black text-appPrimary uppercase tracking-wider">Valuation Milestones</div>
                        <p className="font-bold text-gray-700 leading-relaxed">
                          {tangibleMessage}
                        </p>
                      </div>

                      <div className="text-xs text-gray-500 border-t border-gray-100 pt-3 space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span>{t('liquid_nw_label')}:</span>
                          <span className="font-mono font-bold text-emerald-600"><MaskValue value={netWorthMetrics.trueLiquidNetWorth} /></span>
                        </div>
                        <div className="text-[10px] text-gray-400">
                          Excludes property value and gold assets according to the active haircut toggle.
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: STRESS TESTING */}
            {activeTab === 'stresstest' && (
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                <h2 className="text-lg font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span>⚡ Institutional Stress Testing</span>
                  <OnboardingDot text="Calculates cash flow deficits under simulation scenarios to diagnose safety margins." />
                </h2>
                <p className="text-xs text-gray-400">Apply hypothetical economic shocks to evaluate reserve cash vulnerability.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Side: Buttons */}
                  <div className="space-y-4">
                    <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-sm text-gray-800">Job Loss (6 Months)</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">Deducts 6 months of expenses ({formatINR(budgetMetrics.totalExpenses * 6)}) from Cash.</div>
                      </div>
                      <button 
                        onClick={() => setState(prev => ({ ...prev, stressTestApplied: { ...prev.stressTestApplied, jobLoss: !prev.stressTestApplied.jobLoss } }))}
                        className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all ${state.stressTestApplied.jobLoss ? 'bg-red-500 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                      >
                        {state.stressTestApplied.jobLoss ? t('btn_clear') : t('btn_apply')}
                      </button>
                    </div>

                    <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-sm text-gray-800">Medical Emergency (₹5,00,000)</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">Deducts ₹5 Lakhs flat from Liquid Cash reserves.</div>
                      </div>
                      <button 
                        onClick={() => setState(prev => ({ ...prev, stressTestApplied: { ...prev.stressTestApplied, medicalEmergency: !prev.stressTestApplied.medicalEmergency } }))}
                        className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all ${state.stressTestApplied.medicalEmergency ? 'bg-red-500 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                      >
                        {state.stressTestApplied.medicalEmergency ? t('btn_clear') : t('btn_apply')}
                      </button>
                    </div>
                  </div>

                  {/* Right Side: Output */}
                  <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-100 space-y-4">
                    <h3 className="font-extrabold text-xs text-gray-400 uppercase tracking-wider">Simulation Warnings</h3>
                    
                    {stressTestWarnings.length === 0 ? (
                      <div className="text-xs text-emerald-600 font-bold flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
                        ✅ Cash Reserves Healthy. All structures secure.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {stressTestWarnings.map((warning, idx) => (
                          <div key={idx} className="bg-red-50 border border-red-100 text-red-600 p-3.5 rounded-xl text-xs font-bold leading-relaxed">
                            ⚠️ {warning}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="text-xs text-gray-500 border-t border-gray-100 pt-3">
                      Current Simulation Cash Balance: <span className={`font-mono font-bold ${netWorthMetrics.cashVal < 0 ? 'text-red-500' : 'text-emerald-600'}`}><MaskValue value={netWorthMetrics.cashVal} /></span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 8: LIFE VAULT CHECKLIST */}
            {activeTab === 'vault' && (
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                <h2 className="text-lg font-extrabold text-gray-900 uppercase tracking-wider">{t('vault_title')}</h2>
                <p className="text-xs text-gray-400">{t('vault_subtitle')}</p>

                <div className="space-y-3.5 max-w-xl">
                  {/* Checklist item 1 */}
                  <label className="flex items-center gap-3 p-3.5 bg-gray-50 hover:bg-gray-100/50 rounded-2xl border border-gray-100 cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      checked={state.documentVault.termLifeNominee}
                      onChange={(e) => setState(prev => ({ ...prev, documentVault: { ...prev.documentVault, termLifeNominee: e.target.checked } }))}
                      className="w-4 h-4 rounded text-appPrimary focus:ring-0 cursor-pointer border-gray-300"
                    />
                    <span className="relative text-xs font-bold text-gray-700">
                      Term Life Nominee Registered & Updated
                      {state.documentVault.termLifeNominee && (
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 0.3 }}
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] bg-gray-400"
                        />
                      )}
                    </span>
                  </label>

                  {/* Checklist item 2 */}
                  <label className="flex items-center gap-3 p-3.5 bg-gray-50 hover:bg-gray-100/50 rounded-2xl border border-gray-100 cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      checked={state.documentVault.willDrafted}
                      onChange={(e) => setState(prev => ({ ...prev, documentVault: { ...prev.documentVault, willDrafted: e.target.checked } }))}
                      className="w-4 h-4 rounded text-appPrimary focus:ring-0 cursor-pointer border-gray-300"
                    />
                    <span className="relative text-xs font-bold text-gray-700">
                      Will Drafted & Signed by Witnesses
                      {state.documentVault.willDrafted && (
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 0.3 }}
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] bg-gray-400"
                        />
                      )}
                    </span>
                  </label>

                  {/* Checklist item 3 */}
                  <label className="flex items-center gap-3 p-3.5 bg-gray-50 hover:bg-gray-100/50 rounded-2xl border border-gray-100 cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      checked={state.documentVault.passwordsShared}
                      onChange={(e) => setState(prev => ({ ...prev, documentVault: { ...prev.documentVault, passwordsShared: e.target.checked } }))}
                      className="w-4 h-4 rounded text-appPrimary focus:ring-0 cursor-pointer border-gray-300"
                    />
                    <span className="relative text-xs font-bold text-gray-700">
                      Secure Folder Credentials shared with Trusted Family Member
                      {state.documentVault.passwordsShared && (
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 0.3 }}
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] bg-gray-400"
                        />
                      )}
                    </span>
                  </label>

                  {/* Checklist item 4 */}
                  <label className="flex items-center gap-3 p-3.5 bg-gray-50 hover:bg-gray-100/50 rounded-2xl border border-gray-100 cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      checked={state.documentVault.healthCardsPrinted}
                      onChange={(e) => setState(prev => ({ ...prev, documentVault: { ...prev.documentVault, healthCardsPrinted: e.target.checked } }))}
                      className="w-4 h-4 rounded text-appPrimary focus:ring-0 cursor-pointer border-gray-300"
                    />
                    <span className="relative text-xs font-bold text-gray-700">
                      Physical Health Cards Printed & Placed in Emergency Bag
                      {state.documentVault.healthCardsPrinted && (
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 0.3 }}
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] bg-gray-400"
                        />
                      )}
                    </span>
                  </label>

                  {/* Checklist item 5 */}
                  <label className="flex items-center gap-3 p-3.5 bg-gray-50 hover:bg-gray-100/50 rounded-2xl border border-gray-100 cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      checked={state.documentVault.bankNomineeAdded}
                      onChange={(e) => setState(prev => ({ ...prev, documentVault: { ...prev.documentVault, bankNomineeAdded: e.target.checked } }))}
                      className="w-4 h-4 rounded text-appPrimary focus:ring-0 cursor-pointer border-gray-300"
                    />
                    <span className="relative text-xs font-bold text-gray-700">
                      Nominees Registered for all active Bank Accounts
                      {state.documentVault.bankNomineeAdded && (
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 0.3 }}
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] bg-gray-400"
                        />
                      )}
                    </span>
                  </label>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer disclaimer */}
      <footer className="text-center py-6 border-t border-gray-100 text-[10px] text-gray-400 font-medium bg-white mt-auto">
        This app operates strictly client-side. Financial variables are encrypted under LocalStorage keys with zero cloud syncing.
      </footer>
      </div>

      {/* Settings Side Panel (Slide-out from right) */}
      <AnimatePresence>
        {showSettingsModal && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettingsModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            {/* Slide-over panel */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-sm h-full bg-white border-l border-gray-100 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-wider flex items-center gap-2">
                      <Settings size={18} className="text-appPrimary" />
                      System Settings
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Configure local environment</p>
                  </div>
                  <button onClick={() => setShowSettingsModal(false)} className="text-gray-400 hover:text-gray-900 p-1 rounded-lg hover:bg-gray-50">
                    <X size={18} />
                  </button>
                </div>

                {/* Section 1: Themes */}
                <div className="space-y-3">
                  <label className="text-[10px] text-gray-400 uppercase font-black tracking-wider block">Visual Theme Accent</label>
                  <div className="space-y-2">
                    {[
                      { id: 'theme-emerald-matrix', name: 'Emerald Matrix', color: 'bg-emerald-600' },
                      { id: 'theme-nordic-slate', name: 'Nordic Slate', color: 'bg-blue-600' },
                      { id: 'theme-midnight-cyber', name: 'Midnight Cyber', color: 'bg-fuchsia-600' }
                    ].map(tOpt => (
                      <button
                        key={tOpt.id}
                        onClick={() => handleThemeChange(tOpt.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all ${state.theme === tOpt.id ? 'border-appPrimary bg-appHoverBg text-appText' : 'border-gray-100 bg-white text-gray-500 hover:bg-gray-50'}`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`w-3.5 h-3.5 rounded-full ${tOpt.color}`}></span>
                          {tOpt.name}
                        </span>
                        {state.theme === tOpt.id && <span className="text-appPrimary text-xs font-bold">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 2: Languages */}
                <div className="space-y-3">
                  <label className="text-[10px] text-gray-400 uppercase font-black tracking-wider block">i18n Vernacular Language</label>
                  <div className="grid grid-cols-5 gap-1.5 bg-gray-50 p-1 rounded-xl border border-gray-100">
                    {['en', 'kn', 'hi', 'ta', 'te'].map(code => (
                      <button
                        key={code}
                        onClick={() => setState(prev => ({ ...prev, lang: code }))}
                        className={`py-2 text-[10px] font-black rounded-lg uppercase transition-all ${state.lang === code ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-900'}`}
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 3: QR Code Sync */}
                <div className="space-y-3">
                  <label className="text-[10px] text-gray-400 uppercase font-black tracking-wider block">Offline State Sync</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => { setShowSettingsModal(false); setShowQrModal(true); }}
                      className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 text-gray-700 text-center gap-1.5 transition-all"
                    >
                      <span className="text-sm">📱</span>
                      <span className="text-[10px] font-black uppercase tracking-wider">{t('btn_show_qr')}</span>
                    </button>
                    <button 
                      onClick={() => { setShowSettingsModal(false); startCameraScanner(); }}
                      className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 text-gray-700 text-center gap-1.5 transition-all"
                    >
                      <span className="text-sm">📷</span>
                      <span className="text-[10px] font-black uppercase tracking-wider">{t('btn_scan_qr')}</span>
                    </button>
                  </div>
                </div>

                {/* Section 4: Data Portability */}
                <div className="space-y-3">
                  <label className="text-[10px] text-gray-400 uppercase font-black tracking-wider block">Local Storage Backup</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImportJson} 
                      style={{ display: 'none' }} 
                      accept=".txt"
                    />
                    <button 
                      onClick={() => { fileInputRef.current?.click(); }}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 text-gray-700 text-[10px] font-black uppercase tracking-wider transition-all"
                    >
                      <Download size={12} />
                      {t('btn_import')}
                    </button>
                    <button 
                      onClick={handleExportJson}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-appPrimary hover:bg-appPrimaryHover text-white text-[10px] font-black uppercase tracking-wider shadow-sm transition-all"
                    >
                      <Upload size={12} />
                      {t('btn_export')}
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 text-center">
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Apex Intel Toolkit v4.0</p>
                <p className="text-[8px] text-gray-400 mt-0.5">Strictly Offline & Obfuscated Local Storage</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QR code sync modal */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full border border-gray-100 shadow-md text-center space-y-4">
            <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-wider">{t('sync_title')}</h3>
            <p className="text-xs text-gray-400">{t('show_qr_code')}</p>
            <div className="bg-gray-50 p-4 rounded-xl flex justify-center inline-block">
              <QRCodeSVG value={qrStateString} size={200} />
            </div>
            <button onClick={() => setShowQrModal(false)} className="bg-gray-900 text-white font-bold py-2 w-full rounded-xl text-xs">
              Close
            </button>
          </div>
        </div>
      )}

      {/* QR scanner camera Modal */}
      {showScanner && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full border border-gray-100 shadow-md text-center space-y-4">
            <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-wider">{t('scan_webcam')}</h3>
            <div id="scanner-viewport" className="w-full h-64 bg-gray-50 rounded-xl overflow-hidden border border-gray-100"></div>
            {scanError && <p className="text-xs text-red-500 font-bold">{scanError}</p>}
            <button onClick={closeCameraScanner} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 w-full rounded-xl text-xs transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
