import { useEffect, useMemo, useState } from 'react'
import { api } from './api'

const emptyApp = {
  company: '',
  jobTitle: '',
  jobUrl: '',
  location: '',
  jobType: 'Full-time',
  salary: '',
  appliedDate: new Date().toISOString().slice(0, 10),
  status: 'APPLIED',
  priority: 'MEDIUM',
  resumeVersion: '',
  notes: ''
}

function statusLabel(s) {
  return s?.replace('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

function App() {
  const [apps, setApps] = useState([])
  const [dashboard, setDashboard] = useState({})
  const [followups, setFollowups] = useState([])
  const [selected, setSelected] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyApp)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [error, setError] = useState('')

  async function load() {
    try {
      const [a, d, f] = await Promise.all([api.applications(), api.dashboard(), api.followups()])
      setApps(a); setDashboard(d); setFollowups(f)
      setError('')
    } catch (e) {
      setError('Backend is not connected. Start Spring Boot on port 8080.')
    }
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  useEffect(() => {
    if (!followups.length) return
    const today = new Date().toISOString().slice(0, 10)
    const due = followups.filter(f => f.dueDate <= today)
    if (due.length && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('JobTrack reminders', {
        body: `${due.length} follow-up${due.length > 1 ? 's are' : ' is'} due.`
      })
    }
  }, [followups])

  const filtered = useMemo(() => apps.filter(a => {
    const text = `${a.company} ${a.jobTitle} ${a.location}`.toLowerCase()
    return text.includes(search.toLowerCase()) && (filter === 'ALL' || a.status === filter)
  }), [apps, search, filter])

  function startAdd() {
    setForm(emptyApp); setSelected(null); setShowForm(true)
  }

  function startEdit(app) {
    setForm({
      company: app.company || '',
      jobTitle: app.jobTitle || '',
      jobUrl: app.jobUrl || '',
      location: app.location || '',
      jobType: app.jobType || '',
      salary: app.salary || '',
      appliedDate: app.appliedDate || '',
      status: app.status || 'APPLIED',
      priority: app.priority || 'MEDIUM',
      resumeVersion: app.resumeVersion || '',
      notes: app.notes || ''
    })
    setSelected(app); setShowForm(true)
  }

  async function save(e) {
    e.preventDefault()
    try {
      if (selected) await api.updateApplication(selected.id, form)
      else await api.createApplication(form)
      setShowForm(false); await load()
    } catch (e) { setError(e.message) }
  }

  async function remove(id) {
    if (!confirm('Delete this application?')) return
    await api.deleteApplication(id)
    if (selected?.id === id) setSelected(null)
    await load()
  }

  async function completeFollowup(id) {
    await api.completeFollowup(id); await load()
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <div className="brand">JobTrack</div>
          <div className="tagline">Nothing slips through the cracks.</div>
        </div>
        <button className="primary" onClick={startAdd}>+ Add Application</button>
      </header>

      {error && <div className="error">{error}</div>}

      <main>
        <section className="stats">
          <Stat title="Applications" value={dashboard.totalApplications ?? 0} />
          <Stat title="Interviews" value={dashboard.interview ?? 0} />
          <Stat title="Offers" value={dashboard.offers ?? 0} />
          <Stat title="Rejected" value={dashboard.rejected ?? 0} />
          <Stat title="Overdue" value={dashboard.overdueFollowUps ?? 0} danger />
        </section>

        <section className="attention">
          <div>
            <strong>Today</strong>
            <span>{dashboard.todayFollowUps ?? 0} follow-up(s) due today</span>
          </div>
          <div>
            <strong>Interview calendar</strong>
            <span>{dashboard.interviewsToday ?? 0} interview(s) today</span>
          </div>
          <div>
            <strong>Open reminders</strong>
            <span>{followups.length} follow-up(s) still open</span>
          </div>
        </section>

        <div className="toolbar">
          <input placeholder="Search company, role, location..." value={search} onChange={e => setSearch(e.target.value)} />
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="ALL">All statuses</option>
            {['APPLIED','SCREENING','ASSESSMENT','INTERVIEW','OFFER','REJECTED','WITHDRAWN'].map(s =>
              <option key={s} value={s}>{statusLabel(s)}</option>
            )}
          </select>
        </div>

        <div className="content-grid">
          <section className="panel">
            <div className="panel-head">
              <h2>Applications</h2><span>{filtered.length} shown</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Company</th><th>Role</th><th>Status</th><th>Priority</th><th>Applied</th><th></th></tr></thead>
                <tbody>
                  {filtered.map(a => (
                    <tr key={a.id} className={selected?.id === a.id ? 'selected-row' : ''} onClick={() => setSelected(a)}>
                      <td><strong>{a.company}</strong><small>{a.location || 'Location not added'}</small></td>
                      <td>{a.jobTitle}</td>
                      <td><span className={`badge ${a.status.toLowerCase()}`}>{statusLabel(a.status)}</span></td>
                      <td><span className={`priority ${a.priority.toLowerCase()}`}>{statusLabel(a.priority)}</span></td>
                      <td>{a.appliedDate || '—'}</td>
                      <td className="actions">
                        <button onClick={e => {e.stopPropagation(); startEdit(a)}}>Edit</button>
                        <button className="danger-text" onClick={e => {e.stopPropagation(); remove(a.id)}}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {!filtered.length && <tr><td colSpan="6" className="empty">No applications found.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="side">
            <section className="panel">
              <div className="panel-head"><h2>Follow-ups</h2><span>Open</span></div>
              <div className="reminders">
                {followups.map(f => (
                  <div className={`reminder ${f.dueDate < new Date().toISOString().slice(0,10) ? 'overdue' : ''}`} key={f.id}>
                    <div>
                      <strong>{f.application?.company || 'Application'}</strong>
                      <span>{f.note || 'Follow up with recruiter'}</span>
                      <small>Due {f.dueDate}</small>
                    </div>
                    <button onClick={() => completeFollowup(f.id)}>✓</button>
                  </div>
                ))}
                {!followups.length && <div className="empty">No open follow-ups.</div>}
              </div>
            </section>

            {selected && <Detail app={selected} reload={load} close={() => setSelected(null)} />}
          </aside>
        </div>
      </main>

      {showForm && <ApplicationModal form={form} setForm={setForm} save={save} close={() => setShowForm(false)} />}
    </div>
  )
}

function Stat({title, value, danger}) {
  return <div className={`stat ${danger ? 'stat-danger' : ''}`}><span>{title}</span><strong>{value}</strong></div>
}

function Detail({app, reload, close}) {
  const [interview, setInterview] = useState({
    roundName: '', type: 'VIDEO', scheduledAt: '', interviewer: '', meetingLink: '', feedback: ''
  })
  const [followup, setFollowup] = useState({ dueDate: '', note: '' })

  async function addInterview(e) {
    e.preventDefault()
    await api.addInterview(app.id, {...interview, scheduledAt: interview.scheduledAt ? interview.scheduledAt + ':00' : null})
    setInterview({roundName:'',type:'VIDEO',scheduledAt:'',interviewer:'',meetingLink:'',feedback:''})
    await reload()
  }

  async function addFollowup(e) {
    e.preventDefault()
    await api.addFollowup(app.id, followup)
    setFollowup({dueDate:'',note:''}); await reload()
  }

  return <section className="panel detail">
    <div className="panel-head"><div><h2>{app.company}</h2><span>{app.jobTitle}</span></div><button onClick={close}>×</button></div>
    <div className="timeline">
      {['APPLIED','SCREENING','ASSESSMENT','INTERVIEW','OFFER'].map(s =>
        <div className={['APPLIED','SCREENING','ASSESSMENT','INTERVIEW','OFFER'].indexOf(s) <= ['APPLIED','SCREENING','ASSESSMENT','INTERVIEW','OFFER'].indexOf(app.status) ? 'step done' : 'step'} key={s}>
          <i></i><span>{statusLabel(s)}</span>
        </div>
      )}
    </div>
    <div className="detail-meta">
      <span>📍 {app.location || '—'}</span>
      <span>💼 {app.jobType || '—'}</span>
      <span>💰 {app.salary || '—'}</span>
    </div>
    {app.jobUrl && <a className="job-link" href={app.jobUrl} target="_blank">Open job posting ↗</a>}

    <h3>Interview rounds</h3>
    {(app.interviews || []).map(i => <div className="mini-card" key={i.id}>
      <strong>{i.roundName || 'Interview'}</strong><span>{i.type} · {i.scheduledAt || 'No date'}</span>
      <small>{i.interviewer || 'Interviewer not added'}</small>
    </div>)}
    <form className="inline-form" onSubmit={addInterview}>
      <input placeholder="Round name" value={interview.roundName} onChange={e=>setInterview({...interview,roundName:e.target.value})} required />
      <select value={interview.type} onChange={e=>setInterview({...interview,type:e.target.value})}><option>VIDEO</option><option>PHONE</option><option>ONSITE</option><option>TECHNICAL</option><option>HR</option><option>OTHER</option></select>
      <input type="datetime-local" value={interview.scheduledAt} onChange={e=>setInterview({...interview,scheduledAt:e.target.value})}/>
      <input placeholder="Interviewer" value={interview.interviewer} onChange={e=>setInterview({...interview,interviewer:e.target.value})}/>
      <button className="secondary">+ Interview</button>
    </form>

    <h3>New follow-up</h3>
    <form className="inline-form" onSubmit={addFollowup}>
      <input type="date" value={followup.dueDate} onChange={e=>setFollowup({...followup,dueDate:e.target.value})} required />
      <input placeholder="e.g. Email recruiter for update" value={followup.note} onChange={e=>setFollowup({...followup,note:e.target.value})}/>
      <button className="secondary">+ Reminder</button>
    </form>
  </section>
}

function ApplicationModal({form,setForm,save,close}) {
  const set = (key, value) => setForm({...form,[key]:value})
  return <div className="modal-backdrop">
    <form className="modal" onSubmit={save}>
      <div className="modal-head"><h2>{form.company ? 'Edit application' : 'New application'}</h2><button type="button" onClick={close}>×</button></div>
      <div className="form-grid">
        <label>Company*<input required value={form.company} onChange={e=>set('company',e.target.value)}/></label>
        <label>Job title*<input required value={form.jobTitle} onChange={e=>set('jobTitle',e.target.value)}/></label>
        <label>Job URL<input value={form.jobUrl} onChange={e=>set('jobUrl',e.target.value)}/></label>
        <label>Location<input value={form.location} onChange={e=>set('location',e.target.value)}/></label>
        <label>Job type<select value={form.jobType} onChange={e=>set('jobType',e.target.value)}><option>Full-time</option><option>Part-time</option><option>Internship</option><option>Contract</option></select></label>
        <label>Salary/package<input value={form.salary} onChange={e=>set('salary',e.target.value)}/></label>
        <label>Applied date<input type="date" value={form.appliedDate} onChange={e=>set('appliedDate',e.target.value)}/></label>
        <label>Status<select value={form.status} onChange={e=>set('status',e.target.value)}>{['APPLIED','SCREENING','ASSESSMENT','INTERVIEW','OFFER','REJECTED','WITHDRAWN'].map(s=><option key={s}>{s}</option>)}</select></label>
        <label>Priority<select value={form.priority} onChange={e=>set('priority',e.target.value)}><option>LOW</option><option>MEDIUM</option><option>HIGH</option></select></label>
        <label>Resume version<input placeholder="Resume-v3" value={form.resumeVersion} onChange={e=>set('resumeVersion',e.target.value)}/></label>
        <label className="wide">Notes<textarea rows="4" value={form.notes} onChange={e=>set('notes',e.target.value)}/></label>
      </div>
      <div className="modal-actions"><button type="button" className="secondary" onClick={close}>Cancel</button><button className="primary">Save application</button></div>
    </form>
  </div>
}

export default App
