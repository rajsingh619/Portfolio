// ─────────────────────────────────────────────────────────────
//  ALL portfolio content lives here. Edit this file to update the site.
// ─────────────────────────────────────────────────────────────

export type Social = { label: 'GitHub' | 'LinkedIn' | 'Email' | 'X'; href: string }

export type Experience = {
  role: string
  company: string
  companyUrl?: string
  location?: string
  start: string // e.g. "Jan 2024"
  end: string // e.g. "Present"
  bullets: string[]
  tech?: string[]
}

export type Education = {
  degree: string
  school: string
  start: string
  end: string
  details?: string
}

export type Project = {
  title: string
  description: string
  tech: string[]
  github?: string
  live?: string
  image?: string // path under /public, e.g. "/projects/foo.png"
  featured?: boolean
}

export type Certification = {
  title: string
  detail: string
  href?: string
}

export const profile = {
  name: 'Raj Singh',
  title: 'Software Developer',
  tagline: 'I build dependable software end to end, from banking-grade services to interfaces people enjoy using.',
  bio: [
    'I turn messy business requirements into clean, maintainable software. I work across the stack, with Java and Spring Boot on the backend and React on the front, and I care as much about how a product feels to use as how it runs.',
    'I work closely with product owners, analysts and architects, and I stay with my code after release: debugging production issues and keeping services healthy. Outside of work I build full-stack projects and have solved 500+ problems on LeetCode.',
  ],
  location: '', // add your city here (e.g. 'Kolkata, India') to show it under the intro
  status: 'Open to new opportunities', // used by the "Next stop" card in Experience
  email: 'rajsingh.mailto@gmail.com',
  githubUsername: 'rajsingh619', // drives the live Coding Activity section
  leetcodeUsername: 'code_soul',
  resumeUrl: '/resume.pdf', // public/resume.pdf
  avatar: '', // optional: e.g. '/avatar.jpg' in /public
  socials: [
    { label: 'GitHub', href: 'https://github.com/rajsingh619' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/raj-singh-7b6338192/' },
    { label: 'Email', href: 'mailto:rajsingh.mailto@gmail.com' },
  ] as Social[],
}

// Group names and skill names are also keys in src/lib/skillIcons.ts (icons + colours).
// A new skill with no entry there still renders, using a generic icon.
export const skills: Record<string, string[]> = {
  Frontend: ['React.js', 'JavaScript (ES6+)', 'Tailwind CSS', 'HTML', 'CSS'],
  Backend: ['Java', 'Spring Boot', 'Spring MVC', 'Spring Data JPA', 'Hibernate', 'RESTful APIs', 'Microservices'],
  Databases: ['SQL', 'MySQL', 'PostgreSQL'],
  'Deployment & DevOps': ['Docker', 'GitHub Actions', 'Jenkins', 'CI/CD'],
}

export const workingStyle: string[] = ['Agile/Scrum']

export const certifications: Certification[] = [
  {
    title: 'Claude Certified Developer Foundations (CCDV-F)',
    detail: 'Foundational developer practices and working with Claude.',
  },
  {
    title: 'AWS Cloud Fundamentals',
    detail: 'Foundational understanding of cloud computing concepts and services.',
  },
  {
    title: '500+ LeetCode problems solved',
    detail: 'Data structures and algorithms practice.',
  },
  {
    title: 'Core Member, Google Developer Student Club',
    detail: 'Contributed to technical sessions, peer learning and collaborative projects during college.',
  },
]

export const experience: Experience[] = [
  {
    role: 'Associate Systems Engineer',
    company: 'IBM',
    start: 'Feb 2024',
    end: 'Present',
    bullets: [
      'Designed and developed 4+ Spring Boot microservices (Java 8, REST APIs, Spring Data JPA) to modularize banking pricing modules, improving modularity and deployment speed by 45%.',
      'Collaborated with product owners, business analysts and architecture teams to translate business requirements into technical solutions, delivering 4+ microservice modules with a 95% sprint delivery success rate.',
      'Built and integrated RESTful APIs with relational databases using Spring Boot and Spring Data JPA, optimizing data access and reducing API response time by 25%.',
      'Managed production incidents, troubleshooting and defect resolution across application modules, resolving critical issues 30% faster and improving SLA compliance by 25%.',
    ],
    tech: ['Java 8', 'Spring Boot', 'Spring Data JPA', 'REST APIs', 'Microservices'],
  },
]

export const education: Education[] = [
  {
    degree: 'B.Tech in Electronics and Computer Engineering',
    school: 'Heritage Institute of Technology, Kolkata',
    start: '2019',
    end: '2023',
    details: 'CGPA: 7.7',
  },
]

export const projects: Project[] = [
  {
    title: 'JobTracker',
    description:
      'Full-stack job application management platform with a React.js frontend and a Java Spring Boot backend, split into clearly separated layers. REST APIs with Spring Data JPA and PostgreSQL handle persistence, services are containerized with Docker, and GitHub Actions pipelines automate build, test and deployment.',
    tech: ['Java', 'Spring Boot', 'React.js', 'PostgreSQL', 'Docker', 'GitHub Actions'],
    github: 'https://github.com/rajsingh619/jobTracker',
    featured: true,
  },
  {
    title: 'CineScope',
    description:
      'Responsive movie search app built with React that uses the OMDb REST API to search movies and show detailed information in a dynamic modal. Uses async/await with React Hooks for data fetching, reusable components, and is deployed on Vercel.',
    tech: ['React', 'JavaScript', 'Tailwind CSS', 'REST APIs'],
    live: 'https://cinescope-ten-lake.vercel.app/',
    image: '/projects/cinescope.png',
    featured: true,
  },
]
