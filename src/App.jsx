
import { useEffect, useMemo, useState } from "react";
import {
  Users, UserPlus, Search, BriefcaseBusiness, Wallet,
  TrendingUp, Pencil, Trash2, X, Sparkles, LayoutDashboard,
  RefreshCw, Mail, Building2, CheckCircle2, Clock3,
  AlertCircle, ArrowUpRight, LoaderCircle, Code2
} from "lucide-react";

const API = "https://jsonplaceholder.typicode.com/users";

const departments = [
  "Engineering", "Design", "Marketing", "Human Resources",
  "Finance", "Sales", "Operations"
];

const palette = [
  "from-violet-500 to-indigo-500",
  "from-cyan-500 to-blue-500",
  "from-rose-500 to-orange-400",
  "from-emerald-500 to-teal-400",
  "from-amber-500 to-pink-500"
];

const initialEmployees = [
  { id: 101, name: "Aarav Patel", email: "aarav@company.com",
    department: "Engineering", role: "Frontend Developer",
    salary: 65000, status: "Active" },
  { id: 102, name: "Diya Shah", email: "diya@company.com",
    department: "Design", role: "UI/UX Designer",
    salary: 58000, status: "Active" },
  { id: 103, name: "Krish Mehta", email: "krish@company.com",
    department: "Marketing", role: "Marketing Executive",
    salary: 45000, status: "On Leave" },
  { id: 104, name: "Anaya Desai", email: "anaya@company.com",
    department: "Finance", role: "Financial Analyst",
    salary: 62000, status: "Active" }
];

const blankForm = {
  name: "", email: "", department: "Engineering",
  role: "", salary: "", status: "Active"
};

function money(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function initials(name = "") {
  return name.split(" ").filter(Boolean)
    .map(part => part[0]).join("").slice(0, 2).toUpperCase();
}

function Button({ children, onClick, variant = "primary", className = "", type = "button" }) {
  const styles = variant === "primary"
    ? "bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/20"
    : variant === "danger"
    ? "bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
    : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10";

  return (
    <button type={type} onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${styles} ${className}`}>
      {children}
    </button>
  );
}

function StatCard({ title, value, note, icon: Icon, color }) {
  return (
    <div className="group rounded-2xl border border-white/[0.08] bg-[#111827]/90 p-5 transition hover:-translate-y-1 hover:border-indigo-400/30">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <h3 className="mt-3 text-2xl font-bold tracking-tight text-white">{value}</h3>
        </div>
        <div className={`rounded-xl bg-gradient-to-br ${color} p-3 text-white shadow-lg`}>
          <Icon size={21} />
        </div>
      </div>
      <p className="mt-4 flex items-center gap-1 text-xs text-slate-400">
        <TrendingUp size={14} className="text-emerald-400" />
        {note}
      </p>
    </div>
  );
}

function EmployeeCard({ employee, index, onEdit, onDelete }) {
  const gradient = palette[index % palette.length];

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111827] p-5 transition duration-300 hover:-translate-y-1 hover:border-indigo-400/40 hover:shadow-xl hover:shadow-indigo-950/30">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${gradient}`} />

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className={`flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-sm font-bold text-white`}>
            {initials(employee.name)}
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-white">{employee.name}</h3>
            <p className="mt-1 truncate text-xs text-slate-400">{employee.role}</p>
          </div>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
          employee.status === "Active"
            ? "bg-emerald-400/10 text-emerald-300"
            : "bg-amber-400/10 text-amber-300"
        }`}>
          {employee.status}
        </span>
      </div>

      <div className="mt-5 space-y-3 border-t border-white/[0.07] pt-4">
        <p className="flex items-center gap-2 text-sm text-slate-400">
          <Mail size={15} className="shrink-0 text-indigo-300" />
          <span className="truncate">{employee.email}</span>
        </p>
        <p className="flex items-center gap-2 text-sm text-slate-400">
          <Building2 size={15} className="text-indigo-300" />
          {employee.department}
        </p>
        <div className="flex items-end justify-between pt-2">
          <div>
            <p className="text-xs text-slate-500">Monthly salary</p>
            <p className="mt-1 text-lg font-bold text-white">{money(employee.salary)}</p>
          </div>
          <div className="flex gap-2 opacity-100 transition sm:opacity-70 sm:group-hover:opacity-100">
            <button aria-label={`Edit ${employee.name}`}
              onClick={() => onEdit(employee)}
              className="rounded-lg border border-white/10 p-2 text-slate-300 hover:border-indigo-400/40 hover:bg-indigo-500/10 hover:text-indigo-300">
              <Pencil size={16} />
            </button>
            <button aria-label={`Delete ${employee.name}`}
              onClick={() => onDelete(employee)}
              className="rounded-lg border border-white/10 p-2 text-slate-300 hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-rose-300">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function EmployeeModal({ employee, onClose, onSave }) {
  const [form, setForm] = useState(() =>
    employee ? { ...employee, salary: String(employee.salary) } : blankForm
  );
  const [error, setError] = useState("");

  function change(event) {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  }

  function submit(event) {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.role.trim()) {
      setError("Please fill in the name, email, and job title.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.salary === "" || !Number.isFinite(Number(form.salary)) || Number(form.salary) < 0) {
      setError("Please enter a valid, non-negative salary.");
      return;
    }

    onSave({
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role.trim(),
      salary: Number(form.salary)
    });
  }

  const field = "mt-1.5 w-full rounded-xl border border-white/10 bg-[#0b1120] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/10";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm"
      onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="employee-form-title"
        className="my-auto w-full max-w-xl rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-2xl shadow-black/50 sm:p-8">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">
              Employee workspace
            </span>
            <h2 id="employee-form-title" className="mt-2 text-2xl font-bold text-white">
              {employee ? "Edit employee" : "Add new employee"}
            </h2>
            <p className="mt-1 text-sm text-slate-400">Keep your team information up to date.</p>
          </div>
          <button onClick={onClose} aria-label="Close form"
            className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-slate-300">
              Full name *
              <input className={field} name="name" value={form.name}
                onChange={change} placeholder="e.g. Riya Patel" required />
            </label>
            <label className="text-sm text-slate-300">
              Email address *
              <input className={field} name="email" type="email"
                value={form.email} onChange={change}
                placeholder="riya@company.com" required />
            </label>
            <label className="text-sm text-slate-300">
              Department
              <select className={field} name="department"
                value={form.department} onChange={change}>
                {departments.map(department =>
                  <option key={department}>{department}</option>
                )}
              </select>
            </label>
            <label className="text-sm text-slate-300">
              Job title *
              <input className={field} name="role" value={form.role}
                onChange={change} placeholder="e.g. Software Developer" required />
            </label>
            <label className="text-sm text-slate-300">
              Monthly salary (₹) *
              <input className={field} name="salary" type="number" min="0"
                value={form.salary} onChange={change} placeholder="50000" required />
            </label>
            <label className="text-sm text-slate-300">
              Employment status
              <select className={field} name="status" value={form.status} onChange={change}>
                <option>Active</option>
                <option>On Leave</option>
              </select>
            </label>
          </div>

          {error && (
            <p role="alert" className="flex items-center gap-2 text-sm text-rose-300">
              <AlertCircle size={16} />{error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-white/[0.08] pt-5 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit">
              <CheckCircle2 size={16} />
              {employee ? "Save changes" : "Create employee"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function App() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("All");
  const [modalEmployee, setModalEmployee] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteEmployee, setDeleteEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [apiLoaded, setApiLoaded] = useState(false);

  const activeCount = employees.filter(e => e.status === "Active").length;
  const payroll = employees.reduce((sum, e) => sum + Number(e.salary), 0);
  const deptCount = new Set(employees.map(e => e.department)).size;

  const filteredEmployees = useMemo(() => employees.filter(employee => {
    const term = search.toLowerCase().trim();
    const matchesSearch =
      employee.name.toLowerCase().includes(term) ||
      employee.email.toLowerCase().includes(term) ||
      employee.role.toLowerCase().includes(term);
    return matchesSearch &&
      (department === "All" || employee.department === department) &&
      (status === "All" || employee.status === status);
  }), [employees, search, department, status]);

  function notify(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  }

  function openAdd() {
    setModalEmployee(null);
    setModalOpen(true);
  }

  function openEdit(employee) {
    setModalEmployee(employee);
    setModalOpen(true);
  }

  function saveEmployee(form) {
    if (modalEmployee) {
      setEmployees(current => current.map(e =>
        e.id === modalEmployee.id ? { ...e, ...form } : e
      ));
      notify("Employee updated successfully.");
    } else {
      setEmployees(current => [{ ...form, id: Date.now() }, ...current]);
      notify("New employee added successfully.");
    }
    setModalOpen(false);
  }

  function confirmDelete() {
    setEmployees(current => current.filter(e => e.id !== deleteEmployee.id));
    notify(`${deleteEmployee.name} has been removed.`);
    setDeleteEmployee(null);
  }

  async function loadFromAPI() {
    setLoading(true);
    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error("API request failed");
      const users = await response.json();

      const mapped = users.map((user, index) => ({
        id: `api-${user.id}`,
        name: user.name,
        email: user.email,
        department: departments[index % departments.length],
        role: ["Software Engineer", "Product Designer", "Business Analyst"][index % 3],
        salary: 35000 + index * 4500,
        status: index % 4 === 0 ? "On Leave" : "Active"
      }));

      setEmployees(current => {
        const local = current.filter(e =>
          !(typeof e.id === "string" && e.id.startsWith("api-"))
        );
        return [...local, ...mapped];
      });
      setApiLoaded(true);
      notify("Employee records loaded from the REST API.");
    } catch {
      notify("Could not reach the API. Check your internet connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_#22204b_0%,_#0b1120_38%,_#080d19_75%)] text-slate-100">
      <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-7 lg:px-10 lg:py-8">

        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-600/30">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white sm:text-2xl">
                Team<span className="text-indigo-400">Sphere</span>
              </h1>
              <p className="mt-0.5 text-xs text-slate-400">People & performance, reimagined.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 sm:flex">
              <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
              <span className="text-xs text-slate-300">Workspace online</span>
            </div>
            <Button onClick={openAdd}>
              <UserPlus size={17} /> Add employee
            </Button>
          </div>
        </header>

        <section className="relative mt-7 overflow-hidden rounded-3xl border border-indigo-300/15 bg-gradient-to-r from-indigo-600/20 via-violet-500/10 to-cyan-500/10 p-6 sm:p-9">
          <div className="pointer-events-none absolute -right-8 -top-24 size-64 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-indigo-300/10 px-3 py-1.5 text-xs font-semibold text-indigo-200">
                <Sparkles size={14} /> YOUR PEOPLE, ONE WORKSPACE
              </div>
              <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
                Great teams build
                <span className="block bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
                  extraordinary things.
                </span>
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-slate-400">
                One clear view of your people. Manage employee records,
                explore your team, and keep every detail in sync.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="rounded-xl bg-emerald-400/10 p-3 text-emerald-300">
                <Users size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-400">Team members</p>
                <p className="text-2xl font-black text-white">{employees.length}</p>
                <p className="text-xs text-emerald-300">Live dashboard total</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total employees" value={employees.length}
            note="All employee records" icon={Users} color="from-indigo-500 to-violet-500" />
          <StatCard title="Active members" value={activeCount}
            note={`${employees.length - activeCount} currently on leave`}
            icon={CheckCircle2} color="from-emerald-500 to-teal-400" />
          <StatCard title="Departments" value={deptCount}
            note="Across your organization" icon={BriefcaseBusiness}
            color="from-cyan-500 to-blue-500" />
          <StatCard title="Monthly payroll" value={money(payroll)}
            note="Combined monthly salaries" icon={Wallet}
            color="from-orange-500 to-pink-500" />
        </section>

        <section className="mt-9">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-white">Your people</h2>
                <span className="rounded-lg bg-white/[0.07] px-2 py-1 text-xs text-slate-300">
                  {filteredEmployees.length} records
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-400">Search, filter, and manage your workforce.</p>
            </div>
            <Button variant="secondary" onClick={loadFromAPI} disabled={loading}>
              {loading
                ? <LoaderCircle size={16} className="animate-spin" />
                : <RefreshCw size={16} />}
              {loading ? "Connecting..." : apiLoaded ? "Refresh API data" : "Load from API"}
            </Button>
          </div>

          <div className="mt-5 grid gap-3 rounded-2xl border border-white/[0.08] bg-[#111827]/80 p-3 sm:grid-cols-[1fr_190px_160px]">
            <div className="relative">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search name, email, or job title..."
                aria-label="Search employees"
                className="w-full rounded-xl border border-white/[0.08] bg-[#0b1120] py-3 pl-10 pr-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-400/60" />
            </div>
            <select value={department} onChange={e => setDepartment(e.target.value)}
              aria-label="Filter by department"
              className="rounded-xl border border-white/[0.08] bg-[#0b1120] px-3 py-3 text-sm text-slate-300 outline-none focus:border-indigo-400/60">
              <option value="All">All departments</option>
              {departments.map(d => <option key={d}>{d}</option>)}
            </select>
            <select value={status} onChange={e => setStatus(e.target.value)}
              aria-label="Filter by status"
              className="rounded-xl border border-white/[0.08] bg-[#0b1120] px-3 py-3 text-sm text-slate-300 outline-none focus:border-indigo-400/60">
              <option value="All">All statuses</option>
              <option>Active</option>
              <option>On Leave</option>
            </select>
          </div>

          {filteredEmployees.length > 0 ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredEmployees.map((employee, index) => (
                <EmployeeCard key={employee.id} employee={employee}
                  index={index} onEdit={openEdit}
                  onDelete={setDeleteEmployee} />
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-3xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
                <Search size={25} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">No employees found</h3>
              <p className="mt-2 text-sm text-slate-400">Try changing your filters or add a new team member.</p>
              <Button className="mt-5" onClick={() => {
                setSearch(""); setDepartment("All"); setStatus("All");
              }}>Clear filters</Button>
            </div>
          )}
        </section>

        <footer className="mt-12 flex flex-col justify-between gap-3 border-t border-white/[0.08] py-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p className="flex items-center gap-2">
            <Code2 size={15} className="text-indigo-400" />
            TeamSphere · React + Tailwind CSS
          </p>
          <p>Built for better teams. Designed to stand out.</p>
        </footer>
      </div>

      {notice && (
        <div role="status" className="fixed bottom-5 right-5 z-[70] flex max-w-sm items-center gap-3 rounded-2xl border border-emerald-400/20 bg-[#111827] p-4 text-sm text-white shadow-2xl">
          <CheckCircle2 className="shrink-0 text-emerald-400" size={20} />
          {notice}
          <button onClick={() => setNotice("")} aria-label="Dismiss notification">
            <X size={16} className="text-slate-400" />
          </button>
        </div>
      )}

      {modalOpen && (
        <EmployeeModal employee={modalEmployee}
          onClose={() => setModalOpen(false)} onSave={saveEmployee} />
      )}

      {deleteEmployee && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div role="alertdialog" aria-modal="true"
            aria-labelledby="delete-title"
            className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-2xl">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-300">
              <Trash2 size={22} />
            </div>
            <h2 id="delete-title" className="mt-5 text-xl font-bold text-white">Delete employee?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Are you sure you want to remove <strong className="text-white">{deleteEmployee.name}</strong>?
              This action cannot be undone in the current session.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setDeleteEmployee(null)}>Cancel</Button>
              <Button variant="danger" onClick={confirmDelete}>
                <Trash2 size={16} /> Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
