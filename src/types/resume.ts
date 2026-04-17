// ─── Resume Block Types ─────────────────────────────────────────────
export type ResumeBlockType =
  | "header"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "languages"
  | "volunteering"
  | "achievements";

export interface ResumeHeader {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location: string;
  description: string;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string;
  courses?: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  bullets: string[];
  technologies: string[];
  url?: string;
  github?: string;
  stars?: number;
  forks?: number;
  impact?: string;
}

export interface Skill {
  id: string;
  category: string;
  items: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: "Native" | "Fluent" | "Proficient" | "Intermediate" | "Basic";
}

export interface VolunteerActivity {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date?: string;
}

export interface ResumeBlock {
  id: string;
  type: ResumeBlockType;
  visible: boolean;
  order: number;
  data:
    | ResumeHeader
    | WorkExperience[]
    | Education[]
    | Project[]
    | Skill[]
    | Certification[]
    | Language[]
    | VolunteerActivity[]
    | Achievement[]
    | string; // summary
}

// ─── Resume Templates ───────────────────────────────────────────────
export type ResumeTemplateId =
  | "classic-ats"
  | "premium-corporate"
  | "tech-optimized"
  | "fresher"
  | "leadership";

export interface ResumeTemplate {
  id: ResumeTemplateId;
  name: string;
  description: string;
  bestFor: string;
  preview?: string;
}

// ─── Full Resume ────────────────────────────────────────────────────
export interface Resume {
  id: string;
  userId: string;
  title: string;
  targetRole?: string;
  template: ResumeTemplateId;
  blocks: ResumeBlock[];
  atsScore?: number;
  atsDetails?: ATSDetails;
  createdAt: string;
  updatedAt: string;
}

// ─── ATS Scoring ────────────────────────────────────────────────────
export interface ATSCategory {
  label: string;
  score: number;
  maxScore: number;
  weight: number;
  suggestions: string[];
}

export interface ATSDetails {
  overall: number;
  categories: {
    keywordMatchability: ATSCategory;
    bulletStrength: ATSCategory;
    sectionCompleteness: ATSCategory;
    formattingCompliance: ATSCategory;
    roleAlignment: ATSCategory;
  };
  missingKeywords: string[];
  weakBullets: string[];
  recommendations: string[];
  strengths: string[];
}

// ─── LinkedIn Data ──────────────────────────────────────────────────
export interface LinkedInProfile {
  fullName: string;
  headline: string;
  summary: string;
  location: string;
  email: string;
  profileUrl: string;
  avatarUrl?: string;
  experience: RawExperience[];
  education: RawEducation[];
  skills: string[];
  certifications: RawCertification[];
  languages: RawLanguage[];
  volunteer: RawVolunteer[];
  achievements: string[];
}

export interface RawExperience {
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  location?: string;
  description?: string;
}

export interface RawEducation {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  grade?: string;
}

export interface RawCertification {
  name: string;
  issuer: string;
  date?: string;
  url?: string;
}

export interface RawLanguage {
  name: string;
  proficiency: string;
}

export interface RawVolunteer {
  organization: string;
  role: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

// ─── GitHub Data ────────────────────────────────────────────────────
export interface GitHubProfile {
  username: string;
  name?: string;
  bio?: string;
  avatarUrl?: string;
  profileUrl: string;
  publicRepos: number;
  followers: number;
  repositories: GitHubRepo[];
  pinnedRepos: GitHubRepo[];
  topLanguages: Record<string, number>;
  topFrameworks: string[];
  totalStars: number;
  totalForks: number;
}

export interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  description?: string;
  url: string;
  stars: number;
  forks: number;
  language?: string;
  languages: Record<string, number>;
  topics: string[];
  homepage?: string;
  isPrivate: boolean;
  updatedAt: string;
  readme?: string;
  isPinned?: boolean;
}

// ─── AI Pipeline ────────────────────────────────────────────────────
export interface AIGenerationInput {
  linkedInProfile?: LinkedInProfile;
  gitHubProfile?: GitHubProfile;
  targetRole: string;
  template: ResumeTemplateId;
}

export interface AIGenerationOutput {
  blocks: ResumeBlock[];
  atsDetails: ATSDetails;
  inferredRole: string;
  inferredSeniority: string;
  inferredDomain: string;
}

// ─── Target Roles ───────────────────────────────────────────────────
export const TARGET_ROLES = [
  "Software Engineer",
  "Senior Software Engineer",
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "AI Engineer",
  "Data Analyst",
  "Product Manager",
  "Technical Product Manager",
  "Engineering Manager",
  "CTO",
  "Cybersecurity Analyst",
  "Mobile Developer",
  "Cloud Architect",
  "Solutions Architect",
  "QA Engineer",
  "UX Designer",
  "UI/UX Designer",
] as const;

export type TargetRole = (typeof TARGET_ROLES)[number];

// ─── Session User ───────────────────────────────────────────────────
export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  githubConnected?: boolean;
  linkedinConnected?: boolean;
}
