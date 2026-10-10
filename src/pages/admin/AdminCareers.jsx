import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Edit2, Trash2, X, MapPin, Clock, ToggleLeft, ToggleRight } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import adminDataService from '../../services/adminDataService';
import { jobDepartments, jobTypes } from '../../data/careers';

const inputClass = 'w-full px-3 py-2 rounded-xl adm-input';

export const AdminCareers = () => {
  const [jobs, setJobs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const emptyJob = {
    id: '',
    title: '',
    department: jobDepartments[0],
    location: 'Ameerpet, Hyderabad',
    type: 'Full-time',
    experience: '',
    summary: '',
    responsibilities: [],
    requirements: [],
    active: true
  };

  const loadJobs = async () => {
    const data = await adminDataService.getJobs();
    setJobs(data || []);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  // Responsibilities / requirements are edited as one item per line
  const openModal = (job) => {
    setEditingJob({
      ...job,
      responsibilitiesText: (job.responsibilities || []).join('\n'),
      requirementsText: (job.requirements || []).join('\n')
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this job opening?')) {
      const updated = await adminDataService.deleteJob(id);
      setJobs(updated);
    }
  };

  const handleToggleActive = async (job) => {
    const updated = await adminDataService.saveJob({ ...job, active: !job.active });
    setJobs([...updated]);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingJob.title) return;
    const { responsibilitiesText, requirementsText, ...job } = editingJob;
    const toList = (text) => text.split('\n').map((l) => l.trim()).filter(Boolean);
    await adminDataService.saveJob({
      ...job,
      responsibilities: toList(responsibilitiesText),
      requirements: toList(requirementsText)
    });
    await loadJobs();
    setIsModalOpen(false);
  };

  const activeCount = jobs.filter((j) => j.active).length;

  return (
    <AdminLayout title="Job Openings" subtitle="Roles listed on the public Careers page">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-[13px] text-adm-muted">
            {jobs.length} openings · {activeCount} live on website
          </p>
          <button
            onClick={() => openModal(emptyJob)}
            className="px-4 py-2.5 bg-adm-accent hover:bg-adm-accent-hover text-adm-on-accent rounded-xl text-[13px] font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> New Opening
          </button>
        </div>

        <div className="adm-card overflow-hidden">
          {jobs.length === 0 && (
            <div className="p-12 text-center text-adm-muted text-[13px]">
              <Briefcase className="w-8 h-8 mx-auto mb-3 opacity-40" />
              No job openings yet. Add your first role.
            </div>
          )}
          <ul className="divide-y divide-adm-border">
            {jobs.map((job) => (
              <li key={job.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-adm-fg/[0.02] transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-[15px] font-semibold text-adm-fg">{job.title}</h3>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-adm-accent/10 text-adm-accent font-medium">
                      {job.department}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-4 text-[12px] text-adm-muted flex-wrap">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {job.type}</span>
                    {job.experience && <span>{job.experience}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleActive(job)}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-medium flex items-center gap-1.5 transition-colors ${
                      job.active
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                        : 'bg-adm-fg/5 text-adm-muted'
                    }`}
                    title={job.active ? 'Hide from website' : 'Publish on website'}
                  >
                    {job.active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    {job.active ? 'Live' : 'Closed'}
                  </button>
                  <button onClick={() => openModal(job)} className="p-2 rounded-lg text-adm-muted hover:text-adm-fg hover:bg-adm-fg/5">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(job.id)} className="p-2 rounded-lg text-adm-muted hover:text-red-600 hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {isModalOpen && editingJob && (
          <div className="fixed inset-0 z-50 bg-black/25 backdrop-blur-md flex items-center justify-center p-4">
            <div className="adm-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4" data-lenis-prevent>
              <div className="flex items-center justify-between pb-3 border-b border-adm-border">
                <h3 className="text-base font-semibold text-adm-fg">
                  {editingJob.id ? 'Edit Job Opening' : 'New Job Opening'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-adm-muted hover:text-adm-fg"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSave} className="space-y-3 text-[13px]">
                <div>
                  <label className="block text-adm-fg/80 mb-1">Job Title</label>
                  <input
                    type="text"
                    required
                    value={editingJob.title}
                    onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-adm-fg/80 mb-1">Department</label>
                    <select
                      value={editingJob.department}
                      onChange={(e) => setEditingJob({ ...editingJob, department: e.target.value })}
                      className={inputClass}
                    >
                      {jobDepartments.map((d) => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-adm-fg/80 mb-1">Employment Type</label>
                    <select
                      value={editingJob.type}
                      onChange={(e) => setEditingJob({ ...editingJob, type: e.target.value })}
                      className={inputClass}
                    >
                      {jobTypes.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-adm-fg/80 mb-1">Location</label>
                    <input
                      type="text"
                      value={editingJob.location}
                      onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-adm-fg/80 mb-1">Experience</label>
                    <input
                      type="text"
                      placeholder="e.g. 3–5 years"
                      value={editingJob.experience}
                      onChange={(e) => setEditingJob({ ...editingJob, experience: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-adm-fg/80 mb-1">Summary</label>
                  <textarea
                    rows={2}
                    value={editingJob.summary}
                    onChange={(e) => setEditingJob({ ...editingJob, summary: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-adm-fg/80 mb-1">Responsibilities <span className="text-adm-muted">(one per line)</span></label>
                    <textarea
                      rows={5}
                      value={editingJob.responsibilitiesText}
                      onChange={(e) => setEditingJob({ ...editingJob, responsibilitiesText: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-adm-fg/80 mb-1">Requirements <span className="text-adm-muted">(one per line)</span></label>
                    <textarea
                      rows={5}
                      value={editingJob.requirementsText}
                      onChange={(e) => setEditingJob({ ...editingJob, requirementsText: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-adm-fg/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingJob.active}
                    onChange={(e) => setEditingJob({ ...editingJob, active: e.target.checked })}
                    className="w-4 h-4 accent-[rgb(var(--adm-accent))]"
                  />
                  Show on Careers page
                </label>
                <div className="pt-3 flex items-center justify-end gap-3 border-t border-adm-border">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-adm-fg/5 hover:bg-adm-fg/10 rounded-xl text-adm-fg">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-adm-accent hover:bg-adm-accent-hover rounded-xl text-adm-on-accent font-medium">Save Opening</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCareers;
