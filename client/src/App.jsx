import { useEffect, useMemo, useState } from 'react'
import './App.css'

const companies = [
  { name: 'TCS', type: 'Technology services', tone: 'cyan' }, { name: 'Wipro', type: 'Technology services', tone: 'violet' },
  { name: 'Infosys', type: 'Digital transformation', tone: 'orange' }, { name: 'Accenture', type: 'Consulting & technology', tone: 'red' },
  { name: 'Microsoft', type: 'Cloud & software', tone: 'blue' }, { name: 'Google', type: 'Internet & AI', tone: 'green' },
  { name: 'IBM', type: 'Cloud & consulting', tone: 'indigo' }, { name: 'Deloitte', type: 'Advisory & audit', tone: 'teal' },
  { name: 'Capgemini', type: 'Technology services', tone: 'pink' }, { name: 'Cognizant', type: 'Digital engineering', tone: 'yellow' },
]
const blankForm = { studentName: '', age: '', rollNo: '', dob: '', bloodGroup: '', email: '', address: '', phone: '', department: '', course: '', gender: '', year: '', section: '', backlogs: '0' }
const API_URL = 'https://asmitha.onrender.com/api'

function App() {
  const [activeView, setActiveView] = useState('register')
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(blankForm)
  const [selectedCompanies, setSelectedCompanies] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [notice, setNotice] = useState('')
  const companyCounts = useMemo(() => companies.map((company) => ({ ...company, count: registrations.filter((registration) => registration.companies.includes(company.name)).length })), [registrations])
  useEffect(() => {
    fetch(`${API_URL}/registrations`)
      .then(async (response) => {
        if (!response.ok) throw new Error('Could not load registrations.')
        return response.json()
      })
      .then(setRegistrations)
      .catch((error) => setNotice(error.message))
  }, [])
  const updateField = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const completeRegistration = async (chosenCompanies) => {
    try {
      const response = await fetch(`${API_URL}/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, rollNo: form.rollNo.trim(), companies: chosenCompanies })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Could not save registration.')
      setRegistrations((current) => [data, ...current]); setForm(blankForm); setSelectedCompanies([]); setStep(1); setNotice('Registration submitted successfully.')
    } catch (error) {
      setNotice(error.message)
    }
  }
  const handleDetailsSubmit = (event) => { event.preventDefault(); Number(form.backlogs) === 0 ? setStep(2) : completeRegistration([]) }
  const toggleCompany = (companyName) => setSelectedCompanies((current) => current.includes(companyName) ? current.filter((name) => name !== companyName) : current.length < 4 ? [...current, companyName] : current)
  const handleCompanySubmit = (event) => { event.preventDefault(); if (selectedCompanies.length === 4) completeRegistration(selectedCompanies) }

  return (
    <div className="app-shell"><aside className="sidebar"><div className="brand"><span className="brand-mark">SR</span><span>Student<span>Registry</span></span></div><div className="sidebar-label">Workspace</div><nav><button className={activeView === 'register' ? 'nav-item active' : 'nav-item'} onClick={() => { setActiveView('register'); setNotice('') }}><span>＋</span> New registration</button><button className={activeView === 'admin' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveView('admin')}><span>▦</span> Admin overview</button></nav><div className="sidebar-footer"><span className="status-dot"></span><span>Admissions 2025–26</span></div></aside><main className="main-content"><header className="topbar"><div className="breadcrumb">Student Registry <span>/</span> {activeView === 'register' ? 'New registration' : 'Admin overview'}</div><div className="admin-pill"><span className="avatar">AD</span> Admin <span className="chevron">⌄</span></div></header>{activeView === 'register' ? <section className="page-wrap registration-page"><div className="page-heading"><div><p className="eyebrow">Admissions portal / 2025–26</p><h1>Register a student</h1><p className="subheading">Add a student’s academic profile and career preferences.</p></div><div className="secure-note"><span>◈</span> Secure & private</div></div>{notice && <div className="success-banner"><span>✓</span>{notice}<button onClick={() => setNotice('')} aria-label="Dismiss">×</button></div>}<div className="stepper"><div className={step === 1 ? 'step active-step' : 'step done-step'}><span>1</span><div><strong>Student details</strong><small>Personal & academic profile</small></div></div><div className="step-line"></div><div className={step === 2 ? 'step active-step' : 'step'}><span>2</span><div><strong>Company preferences</strong><small>Choose your top 4 companies</small></div></div></div>{step === 1 ? <form className="form-card" onSubmit={handleDetailsSubmit}><div className="form-section"><div className="section-title"><span className="section-icon">✦</span><div><h2>Personal information</h2><p>Tell us who is registering.</p></div></div><div className="field-grid three-cols"><Field label="Student name" name="studentName" placeholder="e.g. Aisha Rahman" value={form.studentName} onChange={updateField} required /><Field label="Age" name="age" type="number" placeholder="21" value={form.age} onChange={updateField} required /><Field label="Roll no." name="rollNo" placeholder="CS24-001" value={form.rollNo} onChange={updateField} required /><Field label="Date of birth" name="dob" type="date" value={form.dob} onChange={updateField} required /><SelectField label="Blood group" name="bloodGroup" value={form.bloodGroup} onChange={updateField} options={['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−']} required /><SelectField label="Gender" name="gender" value={form.gender} onChange={updateField} options={['Female', 'Male', 'Non-binary', 'Prefer not to say']} required /></div><Field label="Address" name="address" placeholder="House no., street, city, state" value={form.address} onChange={updateField} required /></div><div className="form-section"><div className="section-title"><span className="section-icon">⌁</span><div><h2>Academic information</h2><p>Current course and academic standing.</p></div></div><div className="field-grid three-cols"><Field label="Email ID" name="email" type="email" placeholder="student@university.edu" value={form.email} onChange={updateField} required /><Field label="Phone no." name="phone" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={updateField} required /><SelectField label="Department of engineering" name="department" value={form.department} onChange={updateField} options={['Computer Science', 'Information Technology', 'Electronics & Communication', 'Mechanical', 'Civil', 'Electrical']} required /><SelectField label="Course" name="course" value={form.course} onChange={updateField} options={['B.Tech', 'M.Tech', 'B.E.', 'M.E.']} required /><SelectField label="Year" name="year" value={form.year} onChange={updateField} options={['1st year', '2nd year', '3rd year', '4th year']} required /><SelectField label="Section" name="section" value={form.section} onChange={updateField} options={['A', 'B', 'C', 'D']} required /></div><div className="backlog-field"><Field label="Number of backlogs" name="backlogs" type="number" min="0" placeholder="0" value={form.backlogs} onChange={updateField} required /><span className="field-hint">Students with zero backlogs can select company preferences in the next step.</span></div></div><div className="form-actions"><span><span className="required-star">*</span> Required fields</span><button className="primary-button" type="submit">Continue to preferences <span>→</span></button></div></form> : <form className="form-card preference-card" onSubmit={handleCompanySubmit}><div className="preference-header"><div><p className="eyebrow">Eligibility confirmed</p><h2>Choose your top 4 companies</h2><p>Select four companies you would like to be considered for. You have selected <strong>{selectedCompanies.length} of 4</strong>.</p></div><div className="choice-count">{selectedCompanies.length}<small>/ 4</small></div></div><div className="company-grid">{companies.map((company) => <button type="button" key={company.name} className={`company-option ${selectedCompanies.includes(company.name) ? 'selected' : ''}`} onClick={() => toggleCompany(company.name)}><span className={`company-logo ${company.tone}`}>{company.name.slice(0, 1)}</span><span className="company-copy"><strong>{company.name}</strong><small>{company.type}</small></span><span className="checkmark">{selectedCompanies.includes(company.name) ? '✓' : '○'}</span></button>)}</div><div className="form-actions"><button type="button" className="secondary-button" onClick={() => setStep(1)}>← Back to details</button><button className="primary-button" type="submit" disabled={selectedCompanies.length !== 4}>Submit registration <span>✓</span></button></div></form>}</section> : <section className="page-wrap admin-page"><div className="page-heading"><div><p className="eyebrow">Placement cell / live view</p><h1>Registration overview</h1><p className="subheading">Track student interest across participating companies.</p></div><button className="secondary-button export-button">⇩ Export data</button></div><div className="stats-grid"><Stat number={registrations.length} label="Total registrations" /><Stat number={registrations.filter((item) => item.backlogs === '0').length} label="Eligible students" accent="green" /><Stat number={companies.filter((company) => registrations.some((item) => item.companies.includes(company.name))).length} label="Companies selected" accent="orange" /></div><div className="admin-table-card"><div className="table-heading"><div><h2>Company preferences</h2><p>Student registrations grouped by company choice.</p></div><span className="live-badge"><span></span> Live data</span></div><div className="company-table"><div className="table-row table-label"><span>Company</span><span>Interest</span><span>Registered students</span><span></span></div>{companyCounts.map((company) => <div className="table-row" key={company.name}><span className="company-table-name"><span className={`company-logo mini ${company.tone}`}>{company.name.slice(0, 1)}</span><strong>{company.name}</strong></span><span><span className="interest-bar"><i style={{ width: `${registrations.length ? Math.min(100, (company.count / Math.max(1, registrations.length)) * 100 * 2) : 0}%` }}></i></span></span><span className="registration-count">{company.count} {company.count === 1 ? 'student' : 'students'}</span><span className="row-arrow">›</span></div>)}</div></div></section>}</main></div>
  )
}

function Field({ label, name, value, onChange, type = 'text', placeholder, required, min, max }) { return <label className="field"><span>{label}{required && <b>*</b>}</span><input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} min={min} max={max} /></label> }
function SelectField({ label, name, value, onChange, options, required }) { return <label className="field"><span>{label}{required && <b>*</b>}</span><select name={name} value={value} onChange={onChange} required={required}><option value="">Select</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label> }
function Stat({ number, label, accent }) { return <div className="stat-card"><span className={`stat-icon ${accent || ''}`}>▦</span><div><strong>{number}</strong><span>{label}</span></div></div> }

export default App
