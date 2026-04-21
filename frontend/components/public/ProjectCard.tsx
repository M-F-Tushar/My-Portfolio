import Link from 'next/link';
import { ArrowUpRight, Github, MonitorPlay } from 'lucide-react';
import { parseStringArray } from '@/lib/content/json';

export interface ProjectCardProject {
  title: string;
  description: string;
  category: string;
  techStack: string;
  githubUrl?: string | null;
  liveDemoUrl?: string | null;
  caseStudyUrl?: string | null;
  status: string;
}

export default function ProjectCard({ project }: { project: ProjectCardProject }) {
  const techStack = parseStringArray(project.techStack);
  const status = project.status.replaceAll('_', ' ').toLowerCase();
  const links = [
    project.githubUrl ? { label: 'GitHub', href: project.githubUrl, icon: Github } : null,
    project.liveDemoUrl ? { label: 'Live demo', href: project.liveDemoUrl, icon: MonitorPlay } : null,
    project.caseStudyUrl ? { label: 'Case study', href: project.caseStudyUrl, icon: ArrowUpRight } : null,
  ].filter(Boolean) as Array<{ label: string; href: string; icon: typeof ArrowUpRight }>;

  return (
    <article className="project-card group">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-300 via-sky-300 to-emerald-300 opacity-70" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">{project.category}</p>
          <h3 className="mt-5 text-2xl font-semibold text-white transition group-hover:text-cyan-100">{project.title}</h3>
        </div>
        <span className="rounded-md border border-cyan-200/20 bg-cyan-200/8 px-2 py-1 text-xs capitalize text-slate-300">
          {status}
        </span>
      </div>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-300">{project.description}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {techStack.map((tech) => (
          <span key={tech} className="rounded-md border border-cyan-200/10 bg-cyan-200/10 px-2 py-1 text-xs text-cyan-100">
            {tech}
          </span>
        ))}
      </div>
      <div className="mt-6 border-t border-white/10 pt-4">
        {links.length ? (
          <div className="flex flex-wrap gap-3 text-sm">
            {links.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-cyan-200 transition hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Links pending</p>
        )}
      </div>
    </article>
  );
}
