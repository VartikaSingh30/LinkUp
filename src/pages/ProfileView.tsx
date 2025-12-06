import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, GraduationCap, Award, Link as LinkIcon, MessageSquare, ArrowLeft, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface Experience {
  id: string;
  position: string;
  company: string;
  start_date: string | null;
  end_date: string | null;
  description?: string;
  is_current?: boolean;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  field_of_study: string | null;
  start_date: string | null;
  end_date: string | null;
}

interface Skill {
  id: string;
  skill_name: string;
  endorsements?: number;
}

interface Certificate {
  id: string;
  certificate_name: string;
  issuing_organization: string;
  issue_date: string | null;
  expiry_date: string | null;
  credential_id?: string;
  credential_url?: string;
  description?: string;
}

interface UserProfile {
  id: string;
  full_name: string;
  username?: string;
  headline?: string;
  bio?: string;
  profile_image_url?: string;
  cover_image_url?: string;
  location?: string;
  website?: string;
  company?: string;
  avatar_color?: string;
}

export function ProfileViewPage() {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (userId) {
      loadProfileData();
      checkFollowStatus();
    }
  }, [userId]);

  const loadProfileData = async () => {
    if (!userId) return;
    setLoading(true);

    try {
      const [profileResult, expResult, eduResult, skillsResult, certsResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('experiences').select('*').eq('user_id', userId).order('start_date', { ascending: false }),
        supabase.from('education').select('*').eq('user_id', userId).order('start_date', { ascending: false }),
        supabase.from('skills').select('*').eq('user_id', userId),
        supabase.from('certificates').select('*').eq('user_id', userId).order('issue_date', { ascending: false }),
      ]);

      if (profileResult.data) setProfile(profileResult.data);
      if (expResult.data) setExperiences(expResult.data);
      if (eduResult.data) setEducation(eduResult.data);
      if (skillsResult.data) setSkills(skillsResult.data);
      if (certsResult.data) setCertificates(certsResult.data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFollowStatus = async () => {
    if (!user || !userId) return;
    
    const { data } = await supabase
      .from('connections')
      .select('id')
      .eq('follower_id', user.id)
      .eq('following_id', userId)
      .single();
    
    setIsFollowing(!!data);
  };

  const handleFollowToggle = async () => {
    if (!user || !userId) return;

    if (isFollowing) {
      await supabase
        .from('connections')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', userId);
      setIsFollowing(false);
    } else {
      await supabase
        .from('connections')
        .insert({ follower_id: user.id, following_id: userId });
      setIsFollowing(true);
    }
  };

  const handleMessage = () => {
    navigate('/messages', { state: { selectedUserId: userId } });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Profile not found</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-indigo-600 hover:underline">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isOwnProfile = user?.id === userId;

  return (
    <div className="max-w-4xl mx-auto px-0 md:px-4 pb-24 md:pb-4">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 ml-4 md:ml-0 flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      {/* Profile Header Card */}
      <div className="bg-white md:rounded-lg md:shadow-sm md:border border-gray-200 overflow-hidden mb-3 md:mb-4">
        {/* Cover Image */}
        <div className="h-32 md:h-48 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 relative">
          {profile.cover_image_url && (
            <img src={profile.cover_image_url} alt="" className="w-full h-full object-cover" />
          )}
        </div>

        {/* Profile Info */}
        <div className="px-4 md:px-6 pb-6">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-3 md:gap-4 -mt-12 md:-mt-20 relative z-10 mb-3 md:mb-4">
            {/* Avatar */}
            <div className="relative">
              <div
                className="w-24 h-24 md:w-36 md:h-36 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg"
                style={{ backgroundColor: profile.avatar_color || '#667eea' }}
              >
                {profile.profile_image_url ? (
                  <img src={profile.profile_image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-3xl md:text-4xl font-bold">
                    {getInitials(profile.full_name)}
                  </div>
                )}
              </div>
            </div>

            {/* Name and Actions */}
            <div className="flex-1 w-full">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl md:text-3xl font-bold text-gray-900 break-words">{profile.full_name}</h1>
                  {profile.username && (
                    <p className="text-xs md:text-sm text-gray-500 mt-0.5">@{profile.username}</p>
                  )}
                  {profile.headline && <p className="text-sm md:text-lg text-gray-600 mt-1 break-words">{profile.headline}</p>}
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                    {profile.location && (
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    {profile.company && (
                      <div className="flex items-center gap-1">
                        <Briefcase size={16} />
                        <span>{profile.company}</span>
                      </div>
                    )}
                    {profile.website && (
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-indigo-600 hover:underline"
                      >
                        <LinkIcon size={16} />
                        <span>Website</span>
                      </a>
                    )}
                  </div>
                </div>
                {!isOwnProfile && (
                  <div className="flex gap-2 w-full md:w-auto">
                    <button
                      onClick={handleFollowToggle}
                      className={`flex-1 md:flex-none px-4 md:px-6 py-2.5 rounded-full font-semibold transition active:scale-95 ${
                        isFollowing
                          ? 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                    <button
                      onClick={handleMessage}
                      className="flex-1 md:flex-none px-4 md:px-6 py-2.5 border-2 border-indigo-600 text-indigo-600 rounded-full font-semibold hover:bg-indigo-50 transition flex items-center justify-center gap-2 active:scale-95"
                    >
                      <MessageSquare size={18} />
                      <span>Message</span>
                    </button>
                  </div>
                )}
                {isOwnProfile && (
                  <button
                    onClick={() => navigate('/profile')}
                    className="w-full md:w-auto px-4 md:px-6 py-2.5 border-2 border-indigo-600 text-indigo-600 rounded-full font-semibold hover:bg-indigo-50 transition active:scale-95"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      {profile.bio && (
        <div className="bg-white md:rounded-lg md:shadow-sm md:border border-gray-200 p-4 md:p-6 mb-3 md:mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-3">About</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{profile.bio}</p>
        </div>
      )}

      {/* Experience Section */}
      {experiences.length > 0 && (
        <div className="bg-white md:rounded-lg md:shadow-sm md:border border-gray-200 p-4 md:p-6 mb-3 md:mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
            <Briefcase size={24} />
            Experience
          </h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="border-l-2 border-indigo-200 pl-4">
                <h3 className="font-bold text-gray-900">{exp.position}</h3>
                <p className="text-gray-700">{exp.company}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                </p>
                {exp.description && <p className="text-gray-600 mt-2 text-sm">{exp.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education Section */}
      {education.length > 0 && (
        <div className="bg-white md:rounded-lg md:shadow-sm md:border border-gray-200 p-4 md:p-6 mb-3 md:mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
            <GraduationCap size={24} />
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="border-l-2 border-indigo-200 pl-4">
                <h3 className="font-bold text-gray-900">{edu.school}</h3>
                <p className="text-gray-700">{edu.degree}</p>
                {edu.field_of_study && <p className="text-gray-600">{edu.field_of_study}</p>}
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certificates Section */}
      {certificates.length > 0 && (
        <div className="bg-white md:rounded-lg md:shadow-sm md:border border-gray-200 p-4 md:p-6 mb-3 md:mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
            <Award size={24} />
            Licenses & Certifications
          </h2>
          <div className="space-y-4">
            {certificates.map((cert) => (
              <div key={cert.id} className="border-l-2 border-green-200 pl-4">
                <h3 className="font-bold text-gray-900">{cert.certificate_name}</h3>
                <p className="text-gray-700">{cert.issuing_organization}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Issued {formatDate(cert.issue_date)}
                  {cert.expiry_date && ` · Expires ${formatDate(cert.expiry_date)}`}
                </p>
                {cert.credential_id && (
                  <p className="text-xs text-gray-500 mt-1">Credential ID: {cert.credential_id}</p>
                )}
                {cert.description && <p className="text-gray-600 mt-2 text-sm">{cert.description}</p>}
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-sm text-indigo-600 hover:underline"
                  >
                    <span>Show credential</span>
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Section */}
      {skills.length > 0 && (
        <div className="bg-white md:rounded-lg md:shadow-sm md:border border-gray-200 p-4 md:p-6 mb-3 md:mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
            <Award size={24} />
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full font-medium text-sm"
              >
                {skill.skill_name}
                {skill.endorsements ? ` · ${skill.endorsements}` : ''}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
