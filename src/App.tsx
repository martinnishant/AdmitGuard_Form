/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ReactNode } from "react";
import { User, Mail, Phone, GraduationCap, ClipboardCheck, IdCard, Calendar, Percent, Trophy, CheckCircle2, AlertTriangle, ListFilter, FileText, Eye, X } from "lucide-react";

interface Rules {
  strict: {
    name_min_length: number;
    phone_length: number;
    phone_starts_with: number[];
    aadhaar_length: number;
  };
  soft: {
    age_min: number;
    age_max: number;
    grad_year_min: number;
    grad_year_max: number;
    percentage_min: number;
    cgpa_min: number;
    screening_min: number;
  };
  exception: {
    min_chars: number;
    keywords: string[];
    max_exceptions_before_flag: number;
  };
}

export default function App() {
  const [rules, setRules] = useState<Rules | null>(null);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [aadhaarError, setAadhaarError] = useState("");
  const [interviewStatus, setInterviewStatus] = useState("");
  const [score, setScore] = useState("");
  const [requestException, setRequestException] = useState(false);
  const [rationale, setRationale] = useState("");
  const [rationaleError, setRationaleError] = useState("");
  const [age, setAge] = useState("");
  const [ageRequestException, setAgeRequestException] = useState(false);
  const [ageRationale, setAgeRationale] = useState("");
  const [ageRationaleError, setAgeRationaleError] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [gradYearRequestException, setGradYearRequestException] = useState(false);
  const [gradYearRationale, setGradYearRationale] = useState("");
  const [gradYearRationaleError, setGradYearRationaleError] = useState("");
  const [screeningScore, setScreeningScore] = useState("");
  const [screeningRequestException, setScreeningRequestException] = useState(false);
  const [screeningRationale, setScreeningRationale] = useState("");
  const [screeningRationaleError, setScreeningRationaleError] = useState("");
  const [qualification, setQualification] = useState("");
  const [offerLetter, setOfferLetter] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"form" | "log">("form");
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/config/rules.json")
      .then((res) => res.json())
      .then((data) => setRules(data))
      .catch((err) => console.error("Failed to load rules:", err));

    // Load logs from localStorage on mount
    const savedLogs = localStorage.getItem("admitguard_logs");
    if (savedLogs) {
      try {
        setLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.error("Failed to parse logs from localStorage:", e);
      }
    }
  }, []);

  if (!rules) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isLowScore = () => {
    const val = parseFloat(score);
    if (isNaN(val)) return false;
    if (val < 10) return val < rules.soft.cgpa_min; // Assume CGPA
    return val < rules.soft.percentage_min; // Assume Percentage
  };

  const isInvalidAge = () => {
    const val = parseInt(age);
    if (isNaN(val)) return false;
    return val < rules.soft.age_min || val > rules.soft.age_max;
  };

  const isInvalidGradYear = () => {
    const val = parseInt(gradYear);
    if (isNaN(val)) return false;
    return val < rules.soft.grad_year_min || val > rules.soft.grad_year_max;
  };

  const isLowScreeningScore = () => {
    const val = parseFloat(screeningScore);
    if (isNaN(val)) return false;
    return val < rules.soft.screening_min;
  };

  const validateRationale = (value: string) => {
    setRationale(value);
    if (!value) {
      setRationaleError("");
      return;
    }

    const hasKeyword = rules.exception.keywords.some(keyword => value.toLowerCase().includes(keyword));
    
    if (value.length < rules.exception.min_chars || !hasKeyword) {
      setRationaleError(`Rationale must be ${rules.exception.min_chars}+ characters and include required keyword.`);
    } else {
      setRationaleError("");
    }
  };

  const validateAgeRationale = (value: string) => {
    setAgeRationale(value);
    if (!value) {
      setAgeRationaleError("");
      return;
    }

    const hasKeyword = rules.exception.keywords.some(keyword => value.toLowerCase().includes(keyword));
    
    if (value.length < rules.exception.min_chars || !hasKeyword) {
      setAgeRationaleError(`Rationale must be ${rules.exception.min_chars}+ characters and include required keyword.`);
    } else {
      setAgeRationaleError("");
    }
  };

  const validateGradYearRationale = (value: string) => {
    setGradYearRationale(value);
    if (!value) {
      setGradYearRationaleError("");
      return;
    }

    const hasKeyword = rules.exception.keywords.some(keyword => value.toLowerCase().includes(keyword));
    
    if (value.length < rules.exception.min_chars || !hasKeyword) {
      setGradYearRationaleError(`Rationale must be ${rules.exception.min_chars}+ characters and include required keyword.`);
    } else {
      setGradYearRationaleError("");
    }
  };

  const validateScreeningRationale = (value: string) => {
    setScreeningRationale(value);
    if (!value) {
      setScreeningRationaleError("");
      return;
    }

    const hasKeyword = rules.exception.keywords.some(keyword => value.toLowerCase().includes(keyword));
    
    if (value.length < rules.exception.min_chars || !hasKeyword) {
      setScreeningRationaleError(`Rationale must be ${rules.exception.min_chars}+ characters and include required keyword.`);
    } else {
      setScreeningRationaleError("");
    }
  };

  const validateName = (value: string) => {
    setName(value);
    if (!value) {
      setNameError("");
      return;
    }
    if (value.length < rules.strict.name_min_length) {
      setNameError(`Name must be at least ${rules.strict.name_min_length} characters.`);
    } else if (/\d/.test(value)) {
      setNameError("Numbers are not allowed in the name.");
    } else {
      setNameError("");
    }
  };

  const validateEmail = (value: string) => {
    setEmail(value);
    if (!value) {
      setEmailError("");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setNameError(""); // Clear other errors if needed? No, just email.
      setEmailError("Please enter a valid email address (e.g., user@domain.com).");
    } else {
      setEmailError("");
    }
  };

  const validateAadhaar = (value: string) => {
    // Remove spaces for validation but maybe keep them for display? 
    // User request says "exactly 12 digits, no letters/symbols".
    const cleanValue = value.replace(/\s/g, "");
    setAadhaar(value);
    
    if (!cleanValue) {
      setAadhaarError("");
      return;
    }

    if (!/^\d+$/.test(cleanValue)) {
      setAadhaarError("Only numbers are allowed.");
    } else if (cleanValue.length !== rules.strict.aadhaar_length) {
      setAadhaarError(`Aadhaar number must be exactly ${rules.strict.aadhaar_length} digits.`);
    } else {
      setAadhaarError("");
    }
  };

  const validatePhone = (value: string) => {
    setPhone(value);
    if (!value) {
      setPhoneError("");
      return;
    }
    
    const startsWithPattern = `^[${rules.strict.phone_starts_with.join("")}]`;
    const phoneRegex = new RegExp(`${startsWithPattern}\\d{${rules.strict.phone_length - 1}}$`);
    
    if (!phoneRegex.test(value)) {
      if (value.length !== rules.strict.phone_length) {
        setPhoneError(`Phone number must be exactly ${rules.strict.phone_length} digits.`);
      } else if (!new RegExp(startsWithPattern).test(value)) {
        setPhoneError(`Phone number must start with ${rules.strict.phone_starts_with.join(", ")}.`);
      } else {
        setPhoneError("Invalid phone number format.");
      }
    } else {
      setPhoneError("");
    }
  };

  const handleSubmit = () => {
    if (!rules) return;

    const exceptionsUsed = [];
    if (requestException && isLowScore()) {
      exceptionsUsed.push({ field: "Percentage/CGPA", rationale });
    }
    if (ageRequestException && isInvalidAge()) {
      exceptionsUsed.push({ field: "Age", rationale: ageRationale });
    }
    if (gradYearRequestException && isInvalidGradYear()) {
      exceptionsUsed.push({ field: "Graduation Year", rationale: gradYearRationale });
    }
    if (screeningRequestException && isLowScreeningScore()) {
      exceptionsUsed.push({ field: "Screening Test Score", rationale: screeningRationale });
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      fields: {
        name,
        email,
        phone,
        qualification,
        interviewStatus,
        aadhaar,
        offerLetter,
        age,
        gradYear,
        score,
        screeningScore
      },
      exceptions_used: exceptionsUsed,
      flagged: activeExceptionsCount > rules.exception.max_exceptions_before_flag
    };

    const updatedLogs = [...logs, logEntry];
    setLogs(updatedLogs);
    localStorage.setItem("admitguard_logs", JSON.stringify(updatedLogs));

    setSuccessMessage("Application submitted successfully. Audit log updated.");
    resetForm();
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  const resetForm = () => {
    setName("");
    setNameError("");
    setEmail("");
    setEmailError("");
    setPhone("");
    setPhoneError("");
    setAadhaar("");
    setAadhaarError("");
    setQualification("");
    setInterviewStatus("");
    setOfferLetter(false);
    setAge("");
    setAgeRequestException(false);
    setAgeRationale("");
    setAgeRationaleError("");
    setGradYear("");
    setGradYearRequestException(false);
    setGradYearRationale("");
    setGradYearRationaleError("");
    setScore("");
    setRequestException(false);
    setRationale("");
    setRationaleError("");
    setScreeningScore("");
    setScreeningRequestException(false);
    setScreeningRationale("");
    setScreeningRationaleError("");
  };

  const activeExceptionsCount = [
    requestException,
    ageRequestException,
    gradYearRequestException,
    screeningRequestException
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 relative">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">AdmitGuard Portal</h1>
              <p className="text-blue-100 mt-1 text-sm">Candidate Admission & Audit Management</p>
            </div>
            
            <div className="flex flex-col md:items-end gap-3">
              <div className="bg-blue-500/40 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-400/30 self-start md:self-auto">
                Total Submissions: {logs.length}
              </div>
              <div className="flex bg-blue-700/50 p-1 rounded-lg self-start md:self-auto">
                <button
                  onClick={() => setActiveTab("form")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === "form" ? "bg-white text-blue-600 shadow-sm" : "text-blue-100 hover:bg-blue-600/50"
                  }`}
                >
                  <FileText size={16} />
                  Admission Form
                </button>
                <button
                  onClick={() => setActiveTab("log")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === "log" ? "bg-white text-blue-600 shadow-sm" : "text-blue-100 hover:bg-blue-600/50"
                  }`}
                >
                  <ListFilter size={16} />
                  Audit Log
                </button>
              </div>
            </div>
          </div>

          {activeTab === "form" ? (
            /* Form Content */
            <form className="p-4 space-y-6">
              {activeExceptionsCount > rules.exception.max_exceptions_before_flag && (
                <div className="bg-red-600 text-white p-3 rounded-lg flex items-center gap-3 shadow-md animate-in fade-in slide-in-from-top-4 duration-500">
                  <AlertTriangle size={20} className="shrink-0 animate-pulse" />
                  <span className="font-bold text-sm uppercase tracking-wide">
                    FLAGGED FOR REVIEW — More than {rules.exception.max_exceptions_before_flag} exceptions requested.
                  </span>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <User size={16} className="text-blue-600" />
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => validateName(e.target.value)}
                    className={`w-full px-3 py-2 bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      nameError 
                        ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" 
                        : "border-slate-300 focus:ring-blue-500/20 focus:border-blue-500"
                    }`}
                  />
                  {nameError && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{nameError}</p>
                  )}
                </div>

                {/* 2. Email */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Mail size={16} className="text-blue-600" />
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => validateEmail(e.target.value)}
                    className={`w-full px-3 py-2 bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      emailError 
                        ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" 
                        : "border-slate-300 focus:ring-blue-500/20 focus:border-blue-500"
                    }`}
                  />
                  {emailError && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{emailError}</p>
                  )}
                </div>

                {/* 3. Phone */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Phone size={16} className="text-blue-600" />
                    Phone Number
                  </label>
                  <input 
                    type="tel" 
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => validatePhone(e.target.value)}
                    className={`w-full px-3 py-2 bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      phoneError 
                        ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" 
                        : "border-slate-300 focus:ring-blue-500/20 focus:border-blue-500"
                    }`}
                  />
                  {phoneError && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{phoneError}</p>
                  )}
                </div>

                {/* 4. Qualification (Dropdown) */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <GraduationCap size={16} className="text-blue-600" />
                    Highest Qualification
                  </label>
                  <select 
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select Qualification</option>
                    <option value="high-school">High School</option>
                    <option value="bachelors">Bachelor's Degree</option>
                    <option value="masters">Master's Degree</option>
                    <option value="phd">PhD</option>
                  </select>
                </div>

                {/* 5. Interview Status (Dropdown) */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <ClipboardCheck size={16} className="text-blue-600" />
                    Interview Status
                  </label>
                  <select 
                    value={interviewStatus}
                    onChange={(e) => setInterviewStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select Status</option>
                    <option value="pending">Pending</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="cleared">Cleared</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* 6. Aadhaar Number */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <IdCard size={16} className="text-blue-600" />
                    Aadhaar Number
                  </label>
                  <input 
                    type="text" 
                    placeholder="123456789012"
                    value={aadhaar}
                    onChange={(e) => validateAadhaar(e.target.value)}
                    className={`w-full px-3 py-2 bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      aadhaarError 
                        ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" 
                        : "border-slate-300 focus:ring-blue-500/20 focus:border-blue-500"
                    }`}
                  />
                  {aadhaarError && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{aadhaarError}</p>
                  )}
                </div>

                {/* 8. Age */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Calendar size={16} className="text-blue-600" />
                      Age
                    </label>
                    {isInvalidAge() && (
                      <button
                        type="button"
                        onClick={() => setAgeRequestException(!ageRequestException)}
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded transition-all ${
                          ageRequestException 
                            ? "bg-amber-100 text-amber-700 border border-amber-200" 
                            : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {ageRequestException ? "Exception Requested" : "Request Exception"}
                      </button>
                    )}
                  </div>
                  <input 
                    type="number" 
                    placeholder="22"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className={`w-full px-3 py-2 bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      isInvalidAge() && !ageRequestException
                        ? "border-amber-400 focus:ring-amber-500/20 focus:border-amber-500" 
                        : "border-slate-300 focus:ring-blue-500/20 focus:border-blue-500"
                    }`}
                  />
                  {isInvalidAge() && !ageRequestException && (
                    <p className="text-xs text-amber-600 mt-1 font-medium bg-amber-50 p-2 rounded border border-amber-100 animate-in fade-in slide-in-from-top-1 transition-all duration-300">
                      Warning: Age should be between {rules.soft.age_min} and {rules.soft.age_max} years.
                    </p>
                  )}
                </div>

                {/* Age Rationale for Exception */}
                {isInvalidAge() && ageRequestException && (
                  <div className="md:col-span-2 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <ClipboardCheck size={16} className="text-blue-600" />
                      Age Exception Rationale
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Provide rationale (e.g., 'Approved by HR due to special case...')"
                      value={ageRationale}
                      onChange={(e) => validateAgeRationale(e.target.value)}
                      className={`w-full px-3 py-2 bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all resize-none ${
                        ageRationaleError 
                          ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" 
                          : "border-slate-300 focus:ring-blue-500/20 focus:border-blue-500"
                      }`}
                    />
                    {ageRationaleError ? (
                      <p className="text-xs text-red-500 mt-1 font-medium">{ageRationaleError}</p>
                    ) : (
                      <p className="text-[10px] text-slate-500 italic">
                        Required: {rules.exception.min_chars}+ chars and one keyword ({rules.exception.keywords.join(", ")}).
                      </p>
                    )}
                  </div>
                )}

                {/* 9. Graduation Year */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Calendar size={16} className="text-blue-600" />
                      Graduation Year
                    </label>
                    {isInvalidGradYear() && (
                      <button
                        type="button"
                        onClick={() => setGradYearRequestException(!gradYearRequestException)}
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded transition-all ${
                          gradYearRequestException 
                            ? "bg-amber-100 text-amber-700 border border-amber-200" 
                            : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {gradYearRequestException ? "Exception Requested" : "Request Exception"}
                      </button>
                    )}
                  </div>
                  <input 
                    type="number" 
                    placeholder="2024"
                    value={gradYear}
                    onChange={(e) => setGradYear(e.target.value)}
                    className={`w-full px-3 py-2 bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      isInvalidGradYear() && !gradYearRequestException
                        ? "border-amber-400 focus:ring-amber-500/20 focus:border-amber-500" 
                        : "border-slate-300 focus:ring-blue-500/20 focus:border-blue-500"
                    }`}
                  />
                  {isInvalidGradYear() && !gradYearRequestException && (
                    <p className="text-xs text-amber-600 mt-1 font-medium bg-amber-50 p-2 rounded border border-amber-100 animate-in fade-in slide-in-from-top-1 transition-all duration-300">
                      Warning: Graduation year should be between {rules.soft.grad_year_min} and {rules.soft.grad_year_max}.
                    </p>
                  )}
                </div>

                {/* Graduation Year Rationale for Exception */}
                {isInvalidGradYear() && gradYearRequestException && (
                  <div className="md:col-span-2 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <ClipboardCheck size={16} className="text-blue-600" />
                      Graduation Year Exception Rationale
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Provide rationale (e.g., 'Approved by Registrar due to special case...')"
                      value={gradYearRationale}
                      onChange={(e) => validateGradYearRationale(e.target.value)}
                      className={`w-full px-3 py-2 bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all resize-none ${
                        gradYearRationaleError 
                          ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" 
                          : "border-slate-300 focus:ring-blue-500/20 focus:border-blue-500"
                      }`}
                    />
                    {gradYearRationaleError ? (
                      <p className="text-xs text-red-500 mt-1 font-medium">{gradYearRationaleError}</p>
                    ) : (
                      <p className="text-[10px] text-slate-500 italic">
                        Required: {rules.exception.min_chars}+ chars and one keyword ({rules.exception.keywords.join(", ")}).
                      </p>
                    )}
                  </div>
                )}

                {/* 10. Percentage/CGPA */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Percent size={16} className="text-blue-600" />
                      Percentage / CGPA
                    </label>
                    {isLowScore() && (
                      <button
                        type="button"
                        onClick={() => setRequestException(!requestException)}
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded transition-all ${
                          requestException 
                            ? "bg-amber-100 text-amber-700 border border-amber-200" 
                            : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {requestException ? "Exception Requested" : "Request Exception"}
                      </button>
                    )}
                  </div>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="8.5 or 85%"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    className={`w-full px-3 py-2 bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      isLowScore() && !requestException
                        ? "border-amber-400 focus:ring-amber-500/20 focus:border-amber-500" 
                        : "border-slate-300 focus:ring-blue-500/20 focus:border-blue-500"
                    }`}
                  />
                  {isLowScore() && !requestException && (
                    <p className="text-xs text-amber-600 mt-1 font-medium bg-amber-50 p-2 rounded border border-amber-100 animate-in fade-in slide-in-from-top-1 transition-all duration-300">
                      Warning: Score is below the recommended threshold ({rules.soft.percentage_min}% or {rules.soft.cgpa_min} CGPA).
                    </p>
                  )}
                </div>

                {/* Rationale for Exception */}
                {isLowScore() && requestException && (
                  <div className="md:col-span-2 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <ClipboardCheck size={16} className="text-blue-600" />
                      Exception Rationale
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Provide rationale (e.g., 'Approved by Department Head due to special case...')"
                      value={rationale}
                      onChange={(e) => validateRationale(e.target.value)}
                      className={`w-full px-3 py-2 bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all resize-none ${
                        rationaleError 
                          ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" 
                          : "border-slate-300 focus:ring-blue-500/20 focus:border-blue-500"
                      }`}
                    />
                    {rationaleError ? (
                      <p className="text-xs text-red-500 mt-1 font-medium">{rationaleError}</p>
                    ) : (
                      <p className="text-[10px] text-slate-500 italic">
                        Required: {rules.exception.min_chars}+ chars and one keyword ({rules.exception.keywords.join(", ")}).
                      </p>
                    )}
                  </div>
                )}

                {/* 11. Screening Test Score */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Trophy size={16} className="text-blue-600" />
                      Screening Test Score
                    </label>
                    {isLowScreeningScore() && (
                      <button
                        type="button"
                        onClick={() => setScreeningRequestException(!screeningRequestException)}
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded transition-all ${
                          screeningRequestException 
                            ? "bg-amber-100 text-amber-700 border border-amber-200" 
                            : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {screeningRequestException ? "Exception Requested" : "Request Exception"}
                      </button>
                    )}
                  </div>
                  <input 
                    type="number" 
                    placeholder="85"
                    value={screeningScore}
                    onChange={(e) => setScreeningScore(e.target.value)}
                    className={`w-full px-3 py-2 bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      isLowScreeningScore() && !screeningRequestException
                        ? "border-amber-400 focus:ring-amber-500/20 focus:border-amber-500" 
                        : "border-slate-300 focus:ring-blue-500/20 focus:border-blue-500"
                    }`}
                  />
                  {isLowScreeningScore() && !screeningRequestException && (
                    <p className="text-xs text-amber-600 mt-1 font-medium bg-amber-50 p-2 rounded border border-amber-100 animate-in fade-in slide-in-from-top-1 transition-all duration-300">
                      Warning: Screening test score is below the recommended threshold ({rules.soft.screening_min}).
                    </p>
                  )}
                </div>

                {/* Screening Score Rationale for Exception */}
                {isLowScreeningScore() && screeningRequestException && (
                  <div className="md:col-span-2 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <ClipboardCheck size={16} className="text-blue-600" />
                      Screening Score Exception Rationale
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Provide rationale (e.g., 'Approved by Panel due to special case...')"
                      value={screeningRationale}
                      onChange={(e) => validateScreeningRationale(e.target.value)}
                      className={`w-full px-3 py-2 bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all resize-none ${
                        screeningRationaleError 
                          ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" 
                          : "border-slate-300 focus:ring-blue-500/20 focus:border-blue-500"
                      }`}
                    />
                    {screeningRationaleError ? (
                      <p className="text-xs text-red-500 mt-1 font-medium">{screeningRationaleError}</p>
                    ) : (
                      <p className="text-[10px] text-slate-500 italic">
                        Required: {rules.exception.min_chars}+ chars and one keyword ({rules.exception.keywords.join(", ")}).
                      </p>
                    )}
                  </div>
                )}

                {/* 7. Offer Letter (Checkbox) - Only visible if Interview Status is 'Cleared' */}
                {interviewStatus === "cleared" && (
                  <div className="md:col-span-2 pt-2 animate-in fade-in slide-in-from-top-1 duration-300">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input 
                          type="checkbox" 
                          checked={offerLetter}
                          onChange={(e) => setOfferLetter(e.target.checked)}
                          className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 bg-white checked:bg-blue-600 checked:border-blue-600 transition-all"
                        />
                        <CheckCircle2 className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 left-0.5 pointer-events-none transition-opacity" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                        Offer Letter Issued
                      </span>
                    </label>
                  </div>
                )}

              </div>

              {/* Submit Button */}
              <div className="pt-4 space-y-3">
                {successMessage && (
                  <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-lg shadow-emerald-200 flex items-center gap-3 animate-in zoom-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white/20 p-1.5 rounded-full">
                      <CheckCircle2 size={20} className="text-white" />
                    </div>
                    <span className="text-sm font-bold tracking-wide">{successMessage}</span>
                  </div>
                )}
                {interviewStatus === "rejected" && (
                  <p className="text-sm text-red-600 font-medium flex items-center gap-2 bg-red-50 p-3 rounded-lg border border-red-100">
                    <CheckCircle2 size={16} className="text-red-500 rotate-45" />
                    Submission blocked: Candidate rejected in interview.
                  </p>
                )}
                <button 
                  type="button"
                  onClick={handleSubmit}
                  disabled={interviewStatus === "rejected"}
                  className={`w-full font-semibold py-2.5 rounded-lg shadow-sm transition-all active:scale-[0.98] ${
                    interviewStatus === "rejected"
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
                  }`}
                >
                  Submit Candidate Data
                </button>
              </div>
            </form>
          ) : (
            /* Audit Log Content */
            <div className="p-6 overflow-x-auto">
              {logs.length === 0 ? (
                <div className="text-center py-12">
                  <ListFilter size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500 font-medium text-lg">No submissions recorded yet</p>
                  <p className="text-slate-400 text-sm mt-1">Submit the admission form to see logs here.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="pb-4 pt-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Date/Time</th>
                      <th className="pb-4 pt-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Candidate Name</th>
                      <th className="pb-4 pt-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                      <th className="pb-4 pt-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Flagged Status</th>
                      <th className="pb-4 pt-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Exceptions Used</th>
                      <th className="pb-4 pt-2 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {logs.map((log: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 text-sm text-slate-600">
                          {new Date(log.timestamp).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </td>
                        <td className="py-4 text-sm font-semibold text-slate-900">{log.fields.name}</td>
                        <td className="py-4 text-sm text-slate-600">{log.fields.email}</td>
                        <td className="py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                            log.flagged 
                              ? "bg-red-100 text-red-700" 
                              : "bg-emerald-100 text-emerald-700"
                          }`}>
                            {log.flagged ? "Flagged" : "Normal"}
                          </span>
                        </td>
                        <td className="py-4 text-sm text-slate-600 italic">
                          {log.exceptions_used.length > 0 
                            ? log.exceptions_used.map((e: any) => e.field).join(", ")
                            : "None"}
                        </td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => setSelectedLog(log)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors"
                          >
                            <Eye size={14} />
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal for Log Details */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Submission Details</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  ID: {new Date(selectedLog.timestamp).getTime()} • {new Date(selectedLog.timestamp).toLocaleString()}
                </p>
              </div>
              <button 
                onClick={() => setSelectedLog(null)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Flagged Status Section */}
              <div className={`p-4 rounded-xl border flex items-start gap-4 ${
                selectedLog.flagged 
                  ? "bg-red-50 border-red-100 text-red-800" 
                  : "bg-emerald-50 border-emerald-100 text-emerald-800"
              }`}>
                <div className={`p-2 rounded-lg ${selectedLog.flagged ? "bg-red-100" : "bg-emerald-100"}`}>
                  <AlertTriangle size={20} className={selectedLog.flagged ? "text-red-600" : "text-emerald-600"} />
                </div>
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wide">
                    {selectedLog.flagged ? "Flagged for Review" : "Standard Submission"}
                  </h3>
                  <p className="text-sm mt-1 opacity-90">
                    {selectedLog.flagged 
                      ? `This candidate requested ${selectedLog.exceptions_used.length} exceptions, which exceeds the threshold of ${rules.exception.max_exceptions_before_flag}.`
                      : "This submission meets the standard criteria or has an acceptable number of exceptions."}
                  </p>
                </div>
              </div>

              {/* Grid of Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <DetailItem label="Full Name" value={selectedLog.fields.name} icon={<User size={14} />} />
                <DetailItem label="Email Address" value={selectedLog.fields.email} icon={<Mail size={14} />} />
                <DetailItem label="Phone Number" value={selectedLog.fields.phone} icon={<Phone size={14} />} />
                <DetailItem label="Qualification" value={selectedLog.fields.qualification} icon={<GraduationCap size={14} />} />
                <DetailItem label="Interview Status" value={selectedLog.fields.interviewStatus} icon={<ClipboardCheck size={14} />} />
                <DetailItem label="Aadhaar Number" value={selectedLog.fields.aadhaar} icon={<IdCard size={14} />} />
                <DetailItem label="Age" value={selectedLog.fields.age} icon={<Calendar size={14} />} />
                <DetailItem label="Graduation Year" value={selectedLog.fields.gradYear} icon={<Calendar size={14} />} />
                <DetailItem label="Percentage/CGPA" value={selectedLog.fields.score} icon={<Percent size={14} />} />
                <DetailItem label="Screening Score" value={selectedLog.fields.screeningScore} icon={<Trophy size={14} />} />
                <DetailItem 
                  label="Offer Letter" 
                  value={selectedLog.fields.offerLetter ? "Issued" : "Not Issued"} 
                  icon={<CheckCircle2 size={14} />} 
                />
              </div>

              {/* Exceptions Section */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Requested Exceptions</h3>
                {selectedLog.exceptions_used.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">No exceptions were requested for this candidate.</p>
                ) : (
                  <div className="space-y-4">
                    {selectedLog.exceptions_used.map((exc: any, i: number) => (
                      <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                            {exc.field}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">
                          <span className="font-semibold text-slate-900">Rationale: </span>
                          {exc.rationale}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
              <button 
                onClick={() => setSelectedLog(null)}
                className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({ label, value, icon }: { label: string; value: any; icon: ReactNode }) {
  return (
    <div className="space-y-1">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
        {icon}
        {label}
      </span>
      <p className="text-sm font-medium text-slate-900">{value || "—"}</p>
    </div>
  );
}
