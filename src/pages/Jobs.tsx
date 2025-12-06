import { useState, useEffect } from 'react';
import { MapPin, DollarSign, Briefcase, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  location?: string;
  job_type?: string;
  salary_min?: number;
  salary_max?: number;
  posted_by: string;
  created_at: string;
  profiles?: {
    full_name: string;
    profile_image_url?: string;
  };
}

interface JobApplication {
  id: string;
  job_id: string;
  status: string;
}

export function JobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Map<string, JobApplication>>(new Map());
  const [showPostForm, setShowPostForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    job_type: 'full-time',
    salary_min: '',
    salary_max: '',
  });

  useEffect(() => {
    loadJobs();
    if (user) {
      loadApplications();
    }
  }, [user]);

  const loadJobs = async () => {
    const { data } = await supabase
      .from('jobs')
      .select('*, profiles(full_name, profile_image_url)')
      .order('created_at', { ascending: false });

    setJobs(data || []);
    setLoading(false);
  };

  const loadApplications = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('job_applications')
      .select('*')
      .eq('applicant_id', user.id);

    const appMap = new Map();
    (data || []).forEach((app) => {
      appMap.set(app.job_id, app);
    });
    setApplications(appMap);
  };

  const postJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    const { data, error } = await supabase
      .from('jobs')
      .insert({
        posted_by: user.id,
        ...formData,
        salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
      })
      .select('*, profiles(full_name, profile_image_url)')
      .single();

    if (!error && data) {
      setJobs([data, ...jobs]);
      setFormData({
        title: '',
        company: '',
        description: '',
        location: '',
        job_type: 'full-time',
        salary_min: '',
        salary_max: '',
      });
      setShowPostForm(false);
    }

    setLoading(false);
  };

  const applyForJob = async (jobId: string) => {
    if (!user) return;

    const { data } = await supabase
      .from('job_applications')
      .insert({
        job_id: jobId,
        applicant_id: user.id,
      })
      .select('*')
      .single();

    if (data) {
      setApplications((prev) => new Map(prev).set(jobId, data));
    }
  };

  const deleteJob = async (jobId: string) => {
    if (!user) return;

    await supabase.from('jobs').delete().eq('id', jobId);
    setJobs(jobs.filter((j) => j.id !== jobId));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Jobs</h1>
        <button
          onClick={() => setShowPostForm(!showPostForm)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition"
        >
          <Plus size={20} />
          Post Job
        </button>
      </div>

      {showPostForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Post a Job</h2>

          <form onSubmit={postJob} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                <select
                  value={formData.job_type}
                  onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Salary</label>
                <input
                  type="number"
                  value={formData.salary_min}
                  onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Salary</label>
                <input
                  type="number"
                  value={formData.salary_max}
                  onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 font-semibold transition"
              >
                {loading ? 'Posting...' : 'Post Job'}
              </button>
              <button
                type="button"
                onClick={() => setShowPostForm(false)}
                className="flex-1 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                <p className="text-lg text-gray-700">{job.company}</p>
              </div>

              {user?.id === job.posted_by && (
                <button
                  onClick={() => deleteJob(job.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            <p className="text-gray-600 mb-4">{job.description}</p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
              {job.location && (
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  {job.location}
                </div>
              )}
              {job.job_type && (
                <div className="flex items-center gap-1">
                  <Briefcase size={16} />
                  {job.job_type}
                </div>
              )}
              {job.salary_min && job.salary_max && (
                <div className="flex items-center gap-1">
                  <DollarSign size={16} />
                  ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}
                </div>
              )}
            </div>

            {user?.id !== job.posted_by && (
              <button
                onClick={() => applyForJob(job.id)}
                disabled={applications.has(job.id)}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  applications.has(job.id)
                    ? 'bg-gray-100 text-gray-700 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {applications.has(job.id) ? 'Applied' : 'Apply Now'}
              </button>
            )}
          </div>
        ))}
      </div>

      {!loading && jobs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No jobs posted yet</p>
        </div>
      )}
    </div>
  );
}
