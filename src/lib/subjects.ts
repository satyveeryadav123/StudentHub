/**
 * Single Shared Source of Truth for Official AKTU B.Tech Computer Science & Engineering (CSE) Curriculum
 * Source: Dr. A.P.J. Abdul Kalam Technical University Official Evaluation Scheme & Syllabus (aktu.ac.in)
 * Scheme: Choice Based Credit System (CBCS) / NEP 2020 Guidelines
 */

export interface SubjectItem {
  name: string;
  code: string;
  credits: number;
  slug: string;
  type: "Theory" | "Practical" | "Audit";
  desc: string;
  unitsCount?: number;
}

export interface SemesterData {
  title: string;
  subjects: SubjectItem[];
}

export const SUBJECT_DATA: Record<string, SemesterData> = {
  "sem-1": {
    title: "Semester 1",
    subjects: [
      { name: "Engineering Chemistry", code: "BAS102", credits: 4, slug: "engineering-chemistry", type: "Theory", desc: "Atomic & Molecular Structure, Spectroscopic Techniques, Water Chemistry, Polymers & Organometallics, Fuels & Combustion.", unitsCount: 5 },
      { name: "Engineering Mathematics-I", code: "BAS103", credits: 4, slug: "engineering-mathematics-1", type: "Theory", desc: "Matrices, Differential Calculus-I, Differential Calculus-II, Multivariable Calculus, Vector Calculus.", unitsCount: 5 },
      { name: "Fundamentals of Electronics Engineering", code: "BEC101", credits: 3, slug: "fundamentals-electronics-engineering", type: "Theory", desc: "Semiconductor Diodes, BJT Configuration, Operational Amplifiers, Digital Electronics, Electronic Instrumentation.", unitsCount: 5 },
      { name: "Fundamentals of Mechanical Engineering", code: "BME101", credits: 3, slug: "fundamentals-mechanical-engineering", type: "Theory", desc: "Introduction to IC Engines, Laws of Thermodynamics, Fluid Mechanics, Engineering Materials, Power Transmission.", unitsCount: 5 },
      { name: "Soft Skills", code: "BAS105", credits: 0, slug: "soft-skills", type: "Audit", desc: "Vocabulary Building, Applied Grammar, Oral Communication, Professional Writing, Interview Skills.", unitsCount: 5 },
      { name: "Engineering Chemistry Lab", code: "BAS152", credits: 1, slug: "engineering-chemistry-lab", type: "Practical", desc: "Determination of hardness of water, Viscosity coefficient, Flash point, Titrations.", unitsCount: 5 },
      { name: "Basic Electronics Engineering Lab", code: "BEC151", credits: 1.5, slug: "basic-electronics-engineering-lab", type: "Practical", desc: "V-I Characteristics of PN diode, Zener diode regulator, Op-Amp applications, Logic gates verification.", unitsCount: 5 },
      { name: "English Language Lab", code: "BAS155", credits: 1.5, slug: "english-language-lab", type: "Practical", desc: "Listening comprehension, Phonetics & Pronunciation, Group Discussion techniques, Presentation skills.", unitsCount: 5 },
      { name: "Workshop Practice Lab", code: "BME151", credits: 1.5, slug: "workshop-practice-lab", type: "Practical", desc: "Fitting shop, Carpentry shop, Welding shop, Sheet metal shop, Machining.", unitsCount: 5 },
    ],
  },
  "sem-2": {
    title: "Semester 2",
    subjects: [
      { name: "Engineering Physics", code: "BAS201", credits: 4, slug: "engineering-physics", type: "Theory", desc: "Quantum Mechanics, Wave Optics & Interference, Lasers & Fiber Optics, Electromagnetics & Dielectrics, Superconductivity.", unitsCount: 5 },
      { name: "Engineering Mathematics-II", code: "BAS203", credits: 4, slug: "engineering-mathematics-2", type: "Theory", desc: "Ordinary Differential Equations, Higher Order Linear ODEs, Complex Variables, Laplace Transforms, Fourier Series.", unitsCount: 5 },
      { name: "Programming for Problem Solving", code: "BCS201", credits: 3, slug: "programming-problem-solving", type: "Theory", desc: "Basics of C Programming, Conditionals & Loops, Arrays & Pointers, User Functions & Recursion, Structures & File I/O.", unitsCount: 5 },
      { name: "Fundamentals of Electrical Engineering", code: "BEE201", credits: 3, slug: "fundamentals-electrical-engineering", type: "Theory", desc: "DC Circuit Analysis, AC Fundamentals, Transformers, Electrical Machines, Electrical Installations & Safety.", unitsCount: 5 },
      { name: "Environment & Ecology", code: "BAS204", credits: 0, slug: "environment-ecology", type: "Audit", desc: "Ecosystem Dynamics, Natural Resources, Environmental Pollution, Global Warming & Climate Change, Sustainable Development.", unitsCount: 5 },
      { name: "Engineering Physics Lab", code: "BAS251", credits: 1, slug: "engineering-physics-lab", type: "Practical", desc: "Newton's Rings experiment, Diffraction Grating, Fiber optics numerical aperture, Hall effect.", unitsCount: 5 },
      { name: "Programming for Problem Solving Lab", code: "BCS251", credits: 1.5, slug: "programming-problem-solving-lab", type: "Practical", desc: "C programming implementation of sorting, searching, matrices, recursion, and file processing.", unitsCount: 5 },
      { name: "Basic Electrical Engineering Lab", code: "BEE251", credits: 1, slug: "basic-electrical-engineering-lab", type: "Practical", desc: "Verification of KCL & KVL, Thevenin's & Norton's theorems, Single-phase transformer open/short circuit test.", unitsCount: 5 },
      { name: "Engineering Graphics & Design Lab", code: "BCE251", credits: 1.5, slug: "engineering-graphics-design-lab", type: "Practical", desc: "Projections of points, lines & planes, Projection of solids, Isometric projections, CAD software basics.", unitsCount: 5 },
    ],
  },
  "sem-3": {
    title: "Semester 3",
    subjects: [
      { name: "Data Structures", code: "BCS301", credits: 4, slug: "data-structures", type: "Theory", desc: "Arrays, Stacks, Queues, Linked Lists, Binary Trees, AVL Trees, B-Trees, Graph Algorithms, Hashing & Sorting.", unitsCount: 5 },
      { name: "Computer Organization & Architecture", code: "BCS302", credits: 4, slug: "computer-organization-architecture", type: "Theory", desc: "CPU Structure, ALU Arithmetic Algorithms, Memory Hierarchy, Pipelining, Instruction Set Architecture, I/O Subsystems.", unitsCount: 5 },
      { name: "Discrete Mathematics", code: "BAS301", credits: 4, slug: "discrete-mathematics", type: "Theory", desc: "Set Theory, Relations, Functions, Propositional Logic, Graph Theory, Trees, Algebraic Structures, Combinatorics.", unitsCount: 5 },
      { name: "Cyber Security", code: "BCC301", credits: 2, slug: "cyber-security", type: "Audit", desc: "Cyber Attacks, Malware Analysis, Cryptography Fundamentals, Web Security, E-Commerce Security, Cyber Laws & IT Act.", unitsCount: 5 },
      { name: "Universal Human Values & Professional Ethics", code: "BAS302", credits: 3, slug: "universal-human-values", type: "Theory", desc: "Human Values, Self-Exploration, Harmony in Self, Family, Society, & Nature, Professional Ethics & Conduct.", unitsCount: 5 },
      { name: "Data Structures Lab", code: "BCS351", credits: 1, slug: "data-structures-lab", type: "Practical", desc: "C/C++ implementation of Stacks, Queues, Binary Search Trees, Graph Traversals (DFS/BFS), Sorting algorithms.", unitsCount: 5 },
      { name: "Computer Organization & Architecture Lab", code: "BCS352", credits: 1, slug: "computer-organization-architecture-lab", type: "Practical", desc: "Design of ALU, Shift registers, Memory decoding, Verilog/VHDL simulation of CPU components.", unitsCount: 5 },
      { name: "Web Designing Workshop", code: "BCS353", credits: 1, slug: "web-designing-workshop", type: "Practical", desc: "HTML5, CSS3, JavaScript DOM manipulation, Responsive Web Design, Bootstrap, Responsive Layouts.", unitsCount: 5 },
      { name: "Mini Project & Internship Assessment-I", code: "BVE351", credits: 1, slug: "mini-project-internship-1", type: "Practical", desc: "Practical project development and presentation evaluating summer internship / technical training.", unitsCount: 3 },
    ],
  },
  "sem-4": {
    title: "Semester 4",
    subjects: [
      { name: "Operating Systems", code: "BCS401", credits: 4, slug: "operating-systems", type: "Theory", desc: "Process Management, Threads, CPU Scheduling, Synchronization & Deadlocks, Memory Management, Virtual Memory, File Systems.", unitsCount: 5 },
      { name: "Database Management Systems", code: "BCS402", credits: 4, slug: "database-management-systems", type: "Theory", desc: "ER Modeling, Relational Algebra, SQL Queries, Normalization (1NF to BCNF), Transaction Processing, Concurrency Control.", unitsCount: 5 },
      { name: "Theory of Automata & Formal Languages", code: "BCS403", credits: 4, slug: "theory-automata", type: "Theory", desc: "Finite Automata, Regular Expressions, Context-Free Grammars, Pushdown Automata, Turing Machines, Decidability.", unitsCount: 5 },
      { name: "Technical Communication", code: "BAS401", credits: 2, slug: "technical-communication", type: "Theory", desc: "Technical Writing, Research Papers, Proposal Writing, Business Letters, Group Communication & Presentation Skills.", unitsCount: 5 },
      { name: "Python Programming (Open Elective-I)", code: "BOE401", credits: 3, slug: "python-programming-elective", type: "Theory", desc: "Python Syntax, Data Types, Control Structures, Modules, OOP in Python, File Handling, Exception Handling.", unitsCount: 5 },
      { name: "Operating Systems Lab", code: "BCS451", credits: 1, slug: "operating-systems-lab", type: "Practical", desc: "Linux Shell Scripting, Process Creation (fork), CPU Scheduling implementation, Semaphore synchronization.", unitsCount: 5 },
      { name: "Database Management Systems Lab", code: "BCS452", credits: 1, slug: "database-management-systems-lab", type: "Practical", desc: "SQL DDL/DML queries, Joins, Triggers, Stored Procedures, PL/SQL blocks, ER diagram design.", unitsCount: 5 },
      { name: "Java Programming Lab", code: "BCS453", credits: 1, slug: "java-programming-lab", type: "Practical", desc: "Core Java syntax, Object-Oriented concepts, Inheritance, Exception handling, Multithreading, Swing/JavaFX GUI.", unitsCount: 5 },
      { name: "Cyber Security & Audit Lab", code: "BVE451", credits: 1, slug: "cyber-security-audit-lab", type: "Practical", desc: "Network Scanning tools, Wireshark packet capture, Vulnerability assessment, Cryptography lab exercises.", unitsCount: 5 },
    ],
  },
  "sem-5": {
    title: "Semester 5",
    subjects: [
      { name: "Compiler Design", code: "BCS501", credits: 4, slug: "compiler-design", type: "Theory", desc: "Lexical Analysis, Syntax Analysis (Parsing), Syntax-Directed Translation, Intermediate Code Generation, Code Optimization.", unitsCount: 5 },
      { name: "Computer Networks", code: "BCS502", credits: 4, slug: "computer-networks", type: "Theory", desc: "OSI & TCP/IP Reference Models, Data Link Layer, IP Addressing, Routing Protocols, Transport Layer (TCP/UDP), Application Protocols.", unitsCount: 5 },
      { name: "Design & Analysis of Algorithms", code: "BCS503", credits: 4, slug: "design-analysis-algorithms", type: "Theory", desc: "Divide & Conquer, Greedy Method, Dynamic Programming, Backtracking, Branch & Bound, NP-Completeness.", unitsCount: 5 },
      { name: "Web Technology (Department Elective-I)", code: "BCSE501", credits: 3, slug: "web-technology-elective", type: "Theory", desc: "Client-Server Architecture, Node.js, Express.js, RESTful APIs, React.js, NoSQL Databases (MongoDB).", unitsCount: 5 },
      { name: "Management Information Systems (Open Elective-II)", code: "BOE501", credits: 3, slug: "management-information-systems", type: "Theory", desc: "Information Systems in Global Business, Enterprise Applications, DSS, E-Commerce Technology, System Security.", unitsCount: 5 },
      { name: "Compiler Design Lab", code: "BCS551", credits: 1, slug: "compiler-design-lab", type: "Practical", desc: "Implementation of Lexical Analyzer using LEX, Parser generation using YACC, Symbol Table implementation.", unitsCount: 5 },
      { name: "Computer Networks Lab", code: "BCS552", credits: 1, slug: "computer-networks-lab", type: "Practical", desc: "Socket Programming in C/Python, Network Simulator (NS2/Cisco Packet Tracer), Packet Analysis via Wireshark.", unitsCount: 5 },
      { name: "Design & Analysis of Algorithms Lab", code: "BCS553", credits: 1, slug: "design-analysis-algorithms-lab", type: "Practical", desc: "Implementation of Divide & Conquer, Kruskal/Prim MST, Dijkstra, Knapsack, 8-Queens problem.", unitsCount: 5 },
      { name: "Industrial Internship Assessment", code: "BCS554", credits: 2, slug: "industrial-internship-assessment-1", type: "Practical", desc: "Evaluation of 4-6 week summer industrial internship training and prototype software presentation.", unitsCount: 3 },
    ],
  },
  "sem-6": {
    title: "Semester 6",
    subjects: [
      { name: "Software Engineering", code: "BCS601", credits: 4, slug: "software-engineering", type: "Theory", desc: "SDLC Models, Agile Methodologies, Requirement Engineering, UML Diagrams, Software Testing, Quality Assurance.", unitsCount: 5 },
      { name: "Data Science & Machine Learning", code: "BCS602", credits: 4, slug: "data-science-machine-learning", type: "Theory", desc: "Data Preprocessing, Supervised Learning, Unsupervised Learning, Neural Networks, Model Evaluation & Selection.", unitsCount: 5 },
      { name: "Computer Graphics", code: "BCS603", credits: 4, slug: "computer-graphics", type: "Theory", desc: "Line & Circle Drawing Algorithms, 2D/3D Transformations, Clipping, Visible Surface Detection, Illumination & Shading.", unitsCount: 5 },
      { name: "Cloud Computing (Department Elective-II)", code: "BCSE601", credits: 3, slug: "cloud-computing-elective", type: "Theory", desc: "Cloud Architecture, IaaS, PaaS, SaaS, Virtualization Technologies, AWS/GCP Overview, Cloud Security.", unitsCount: 5 },
      { name: "Operations Research (Open Elective-III)", code: "BOE601", credits: 3, slug: "operations-research", type: "Theory", desc: "Linear Programming, Simplex Method, Transportation & Assignment Problems, Game Theory, Queuing Theory.", unitsCount: 5 },
      { name: "Software Engineering Lab", code: "BCS651", credits: 1, slug: "software-engineering-lab", type: "Practical", desc: "Requirement Analysis, Software Requirement Specification (SRS) preparation, UML Modeling using StarUML.", unitsCount: 5 },
      { name: "Data Science & Machine Learning Lab", code: "BCS652", credits: 1, slug: "data-science-machine-learning-lab", type: "Practical", desc: "Python Scikit-Learn, Pandas, NumPy, Linear Regression, Decision Trees, K-Means Clustering implementation.", unitsCount: 5 },
      { name: "Computer Graphics Lab", code: "BCS653", credits: 1, slug: "computer-graphics-lab", type: "Practical", desc: "C/OpenGL implementation of DDA, Bresenham line & circle drawing, 2D transformations, clipping.", unitsCount: 5 },
      { name: "Seminar & Professional Ethics", code: "BCS654", credits: 2, slug: "seminar-professional-ethics", type: "Practical", desc: "Individual research presentation on emerging computing technologies and technical report writing.", unitsCount: 3 },
    ],
  },
  "sem-7": {
    title: "Semester 7",
    subjects: [
      { name: "Artificial Intelligence", code: "BCS701", credits: 4, slug: "artificial-intelligence", type: "Theory", desc: "Problem Solving & Search Strategies, Knowledge Representation, Propositional & First-Order Logic, Expert Systems, Natural Language Processing.", unitsCount: 5 },
      { name: "Cryptography & Network Security (Department Elective-III)", code: "BCSE701", credits: 3, slug: "cryptography-network-security", type: "Theory", desc: "Symmetric & Asymmetric Encryption, DES, AES, RSA, Hash Functions, Digital Signatures, Firewalls.", unitsCount: 5 },
      { name: "Deep Learning & Neural Networks (Department Elective-IV)", code: "BCSE705", credits: 3, slug: "deep-learning-neural-networks", type: "Theory", desc: "Perceptrons, Backpropagation, CNNs, RNNs, LSTM, Autoencoders, PyTorch/TensorFlow Applications.", unitsCount: 5 },
      { name: "Entrepreneurship Development (Open Elective-IV)", code: "BOE701", credits: 3, slug: "entrepreneurship-development", type: "Theory", desc: "Entrepreneurial Mindset, Business Plan Creation, Venture Capital, Intellectual Property Rights, Start-up Management.", unitsCount: 5 },
      { name: "Artificial Intelligence & Deep Learning Lab", code: "BCS751", credits: 1, slug: "artificial-intelligence-lab", type: "Practical", desc: "Python implementation of A* Search, Minimax, Constraint Satisfaction, PyTorch Convolutional Neural Networks.", unitsCount: 5 },
      { name: "Major Project Stage-I", code: "BCS752", credits: 4, slug: "major-project-stage-1", type: "Practical", desc: "Problem identification, Literature survey, Requirement analysis, System design & Architecture specification.", unitsCount: 3 },
      { name: "Industrial Training Assessment II", code: "BCS753", credits: 2, slug: "industrial-training-assessment-2", type: "Practical", desc: "Presentation and viva voce evaluation of 6-week summer industrial training at IT companies.", unitsCount: 3 },
    ],
  },
  "sem-8": {
    title: "Semester 8",
    subjects: [
      { name: "High Performance Computing (Department Elective-V)", code: "BCSE801", credits: 3, slug: "high-performance-computing", type: "Theory", desc: "Parallel Computer Architecture, OpenMP, MPI Programming, CUDA GPU Computing, Cluster Performance.", unitsCount: 5 },
      { name: "Big Data Analytics (Open Elective-V)", code: "BOE801", credits: 3, slug: "big-data-analytics", type: "Theory", desc: "Big Data Architecture, Hadoop Ecosystem, MapReduce, Apache Spark, HDFS, NoSQL & Real-time Analytics.", unitsCount: 5 },
      { name: "Major Project Stage-II / Dissertation", code: "BCS851", credits: 10, slug: "major-project-stage-2", type: "Practical", desc: "Complete software implementation, testing, deployment, experimental verification, thesis writing & defense.", unitsCount: 3 },
      { name: "Comprehensive Viva & Grand Seminar", code: "BCS852", credits: 2, slug: "comprehensive-viva-seminar", type: "Practical", desc: "Comprehensive oral examination covering all core computer science subjects studied across 4 years.", unitsCount: 3 },
    ],
  },
};

export function normalizeSemesterKey(sem: string): string {
  if (!sem) return "sem-1";
  const clean = sem.toLowerCase().trim();
  if (SUBJECT_DATA[clean]) return clean;
  const numMatch = clean.match(/(\d+)/);
  if (numMatch) {
    const candidate = `sem-${numMatch[1]}`;
    if (SUBJECT_DATA[candidate]) return candidate;
  }
  return clean;
}

export function findSubject(
  subjectParam: string,
  semKeyParam?: string
): { subject: SubjectItem; semKey: string; semesterData: SemesterData } | null {
  if (!subjectParam) return null;
  const rawParam = decodeURIComponent(subjectParam).toLowerCase().trim();
  const cleanParam = rawParam.replace(/[\s-]/g, "");

  if (semKeyParam) {
    const normalizedSem = normalizeSemesterKey(semKeyParam);
    const semData = SUBJECT_DATA[normalizedSem];
    if (semData) {
      const match = semData.subjects.find(
        (s) =>
          s.slug.toLowerCase() === rawParam ||
          s.code.toLowerCase() === rawParam ||
          s.code.toLowerCase().replace(/[\s-]/g, "") === cleanParam ||
          s.slug.toLowerCase().replace(/[\s-]/g, "") === cleanParam
      );
      if (match) {
        return { subject: match, semKey: normalizedSem, semesterData: semData };
      }
    }
  }

  for (const [key, semObj] of Object.entries(SUBJECT_DATA)) {
    const match = semObj.subjects.find(
      (s) =>
        s.slug.toLowerCase() === rawParam ||
        s.code.toLowerCase() === rawParam ||
        s.code.toLowerCase().replace(/[\s-]/g, "") === cleanParam ||
        s.slug.toLowerCase().replace(/[\s-]/g, "") === cleanParam
    );
    if (match) {
      return { subject: match, semKey: key, semesterData: semObj };
    }
  }

  return null;
}

export function hasAvailableNotes(slug: string): boolean {
  const verifiedWithFiles = ["engineering-chemistry", "data-structures", "computer-organization-architecture"];
  return verifiedWithFiles.includes(slug.toLowerCase().trim());
}

export interface ChecklistItem {
  id: string;
  semester: string;
  subject: string;
  code?: string;
  done: boolean;
}

export function generateDefaultChecklist(): ChecklistItem[] {
  const items: ChecklistItem[] = [];
  for (const [semKey, semObj] of Object.entries(SUBJECT_DATA)) {
    const semLabel = semObj.title.replace("Semester ", "Sem ");
    for (const sub of semObj.subjects) {
      items.push({
        id: `${semKey}-${sub.slug}`,
        semester: semLabel,
        subject: sub.name,
        code: sub.code,
        done: false,
      });
    }
  }
  return items;
}

