import Link from 'next/link';
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

  return (
    <article className="glass-panel group flex h-full flex-col rounded-lg p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-200/35">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">{project.category}</p>
        <span className="rounded-md border border-cyan-200/20 px-2 py-1 text-xs capitalize text-slate-300">
          {status}
        </span>
      </div>
      <h3 className="mt-4 text-xl font-semibold text-white">{project.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-300">{project.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {techStack.map((tech) => (
          <span key={tech} className="rounded-md bg-cyan-200/10 px-2 py-1 text-xs text-cyan-100">
            {tech}
          </span>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-3 text-sm">
        {project.githubUrl ? (
          <Link href={project.githubUrl} target="_blank" rel="noreferrer" className="text-cyan-200 hover:text-white">
            GitHub
          </Link>
        ) : null}
        {project.liveDemoUrl ? (
          <Link href={project.liveDemoUrl} target="_blank" rel="noreferrer" className="text-cyan-200 hover:text-white">
            Live demo
          </Link>
        ) : null}
        {project.caseStudyUrl ? (
          <Link href={project.caseStudyUrl} target="_blank" rel="noreferrer" className="text-cyan-200 hover:text-white">
            Case study
          </Link>
        ) : null}
      </div>
    </article>
  );
}
