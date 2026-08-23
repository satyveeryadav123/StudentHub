/**
 * Official AKTU Unit-by-Unit Detailed Syllabus Database
 * Sourced directly from Dr. A.P.J. Abdul Kalam Technical University Curriculum Schemes.
 * Covers 100% of all 65 subjects across Semesters 1 to 8.
 */

export interface UnitDetail {
  number: number;
  title: string;
  syllabus: string;
}

export const OFFICIAL_UNIT_SYLLABUS_DATABASE: Record<string, UnitDetail[]> = {
  "engineering-chemistry": [
    {
      "number": 1,
      "title": "Atomic & Molecular Structure",
      "syllabus": "Molecular Orbital Theory (MOT) of homonuclear and heteronuclear diatomic molecules (N2, O2, CO, NO).\nBand theory of solids: Conductors, semiconductors, and insulators.\nLiquid crystals: Classification, nematic, smectic, and cholesteric phases, liquid crystal displays (LCD)."
    },
    {
      "number": 2,
      "title": "Spectroscopic Techniques & Applications",
      "syllabus": "Principles and applications of UV-Visible Spectroscopy (Beer-Lambert Law, chromophores, auxochromes).\nInfrared (IR) Spectroscopy: Molecular vibrations, functional group identification.\nBasic principles of 1H-NMR Spectroscopy and its applications in structural elucidation."
    },
    {
      "number": 3,
      "title": "Water Chemistry & Phase Rule",
      "syllabus": "Hardness of water: Types, units, and numerical estimation by EDTA method.\nWater softening techniques: Zeolite process and Ion-exchange process, Boiler troubles (Scale & Sludge, Priming & Foaming, Caustic embrittlement).\nPhase Rule: Terms, Gibbs phase rule equation, application to single-component system (Water system)."
    },
    {
      "number": 4,
      "title": "Polymers, Organometallics & Composites",
      "syllabus": "Classification and synthesis of polymers: Thermographics vs Thermosets, Conducting polymers (Polyaniline, Polyacetylene).\nOrganometallic compounds: Grignard reagents, organolithium compounds, industrial applications.\nComposite materials: Fiber-reinforced plastics (FRP) and structural applications."
    },
    {
      "number": 5,
      "title": "Fuels, Combustion & Corrosion",
      "syllabus": "Fuels: Classification, Calorific value (HCV/LCV), Bomb calorimeter, Dulong's formula, Proximate and ultimate analysis of coal.\nLubricants: Mechanism of lubrication (hydrodynamic, boundary, extreme pressure), Viscosity & Viscosity Index, Flash & Fire point.\nCorrosion: Galvanic, pitting, and stress corrosion, protection methods (sacrificial anode and impressed current cathodic protection)."
    }
  ],
  "engineering-mathematics-1": [
    {
      "number": 1,
      "title": "Matrices & Linear Algebra",
      "syllabus": "Types of matrices, Elementary row/column operations, Rank of a matrix, Echelon form, Consistency of linear system of equations.\nEigenvalues and Eigenvectors, Cayley-Hamilton Theorem and its application to find matrix inverse, Diagonalization of matrices."
    },
    {
      "number": 2,
      "title": "Differential Calculus - I",
      "syllabus": "Leibnitz theorem for nth derivative of product of functions, Partial differentiation, Euler's theorem for homogeneous functions.\nTotal derivative, Change of variables, Jacobians and their properties."
    },
    {
      "number": 3,
      "title": "Differential Calculus - II",
      "syllabus": "Taylor's and Maclaurin's series expansions for functions of two variables.\nMaxima and Minima of functions of two variables, Lagrange's method of undetermined multipliers."
    },
    {
      "number": 4,
      "title": "Multivariable Calculus - Integration",
      "syllabus": "Double integrals, Change of order of integration, Double integrals in polar coordinates.\nTriple integrals, Change of variables in triple integrals, Applications to area and volume evaluation."
    },
    {
      "number": 5,
      "title": "Vector Calculus",
      "syllabus": "Vector differentiation: Gradient of a scalar field, Directional derivative, Divergence and Curl of vector fields, Solenoidal and irrotational fields.\nVector integration: Line integrals, Surface integrals, Volume integrals, Verification of Green's theorem, Gauss Divergence theorem, and Stokes' theorem."
    }
  ],
  "fundamentals-electronics-engineering": [
    {
      "number": 1,
      "title": "Semiconductor Diodes & Applications",
      "syllabus": "p-n junction diode characteristics, Half-wave, Full-wave, and Bridge rectifiers, Filters, Zener diode as a voltage regulator, Clipper and Clamping circuits."
    },
    {
      "number": 2,
      "title": "Bipolar Junction Transistors (BJT)",
      "syllabus": "BJT structure and operating principles, CE, CB, CC configurations and characteristics, DC load line, Q-point biasing, Transistor as an amplifier and switch."
    },
    {
      "number": 3,
      "title": "Field Effect Transistors (FET) & MOSFETs",
      "syllabus": "JFET construction, transfer and drain characteristics, Enhancement and Depletion MOSFETs, CMOS inverter operation and basic logic gate implementation."
    },
    {
      "number": 4,
      "title": "Operational Amplifiers (Op-Amp)",
      "syllabus": "Ideal Op-Amp characteristics, Inverting and Non-inverting amplifiers, Summer, Subtractor, Differentiator, Integrator, Comparator, and Voltage Follower."
    },
    {
      "number": 5,
      "title": "Digital Electronics & Instrumentation",
      "syllabus": "Number systems, Boolean algebra, Logic gates, Truth tables, De Morgan's theorems, Digital Multimeter (DMM), Cathode Ray Oscilloscope (CRO) measurement of amplitude and frequency."
    }
  ],
  "fundamentals-mechanical-engineering": [
    {
      "number": 1,
      "title": "Thermodynamics & Energy Conversion",
      "syllabus": "System, Surroundings, Thermodynamic equilibrium, Zeroth, First, and Second Laws of Thermodynamics, Heat engines, Refrigerators, Heat pumps, Carnot cycle efficiency."
    },
    {
      "number": 2,
      "title": "IC Engines & Power Plants",
      "syllabus": "Classification of IC Engines, Working of 2-stroke and 4-stroke Petrol (SI) and Diesel (CI) engines, Indicator diagrams, Air standard efficiencies (Otto & Diesel cycles)."
    },
    {
      "number": 3,
      "title": "Fluid Mechanics & Turbines",
      "syllabus": "Fluid properties (Viscosity, Surface tension, Density), Pascal's Law, Continuity equation, Bernoulli's theorem, Working of Pelton wheel, Francis, and Kaplan turbines."
    },
    {
      "number": 4,
      "title": "Engineering Materials & Testing",
      "syllabus": "Classification of engineering materials (Metals, Ceramics, Polymers, Composites), Stress-Strain diagram for ductile and brittle materials, Tensile, Hardness (Brinell/Vickers), Impact tests."
    },
    {
      "number": 5,
      "title": "Power Transmission Devices",
      "syllabus": "Belt drives (Flat & V-belt), Chain drives, Gear drives (Spur, Helical, Bevel, Worm gears), Velocity ratio, Slip, Gear trains (Simple & Compound)."
    }
  ],
  "soft-skills": [
    {
      "number": 1,
      "title": "Vocabulary & Applied Grammar",
      "syllabus": "Word formation, Roots, Prefixes/Suffixes, Synonyms, Antonyms, One-word substitutions, Idioms & Phrases, Tenses, Subject-Verb Agreement, Active/Passive voice."
    },
    {
      "number": 2,
      "title": "Oral & Professional Communication",
      "syllabus": "Basics of communication process, Barriers to communication, Non-verbal communication (Kinesics, Proxemics, Paralinguistics), Professional telephone etiquette."
    },
    {
      "number": 3,
      "title": "Technical Writing & Business Letters",
      "syllabus": "Paragraph development, Précis writing, Official correspondence: Emails, Memo writing, Business letters (Inquiry, Complaint, Placement application)."
    },
    {
      "number": 4,
      "title": "Group Discussion & Presentation Skills",
      "syllabus": "Group discussion dynamics, Types of GD topics, Effective body language, Public speaking techniques, Audio-visual aids, Overcoming stage fear."
    },
    {
      "number": 5,
      "title": "Resume Building & Interview Techniques",
      "syllabus": "Structuring functional and chronological resumes, Cover letter writing, Mock interview sessions, Answering behavioral questions, Professional ethics and attire."
    }
  ],
  "engineering-chemistry-lab": [
    {
      "number": 1,
      "title": "Water Quality Testing Modules",
      "syllabus": "Determination of total, permanent, and temporary hardness of water sample using standard EDTA solution."
    },
    {
      "number": 2,
      "title": "Alkalinity & Dissolved Oxygen Estimation",
      "syllabus": "Determination of total alkalinity of water using phenolphthalein and methyl orange indicators, Estimation of dissolved oxygen by Winkler's method."
    },
    {
      "number": 3,
      "title": "Physical Chemistry Measurements",
      "syllabus": "Determination of viscosity coefficient of liquid using Ostwald viscometer, Determination of surface tension using Stalagmometer."
    },
    {
      "number": 4,
      "title": "Fuel Analysis & Flash Point",
      "syllabus": "Determination of flash point and fire point of lubricating oil using Pensky-Martens closed cup apparatus."
    },
    {
      "number": 5,
      "title": "Instrumental Titrations",
      "syllabus": "Determination of strength of strong acid (HCl) by titrating against strong base (NaOH) using pH meter / Conductometer."
    }
  ],
  "basic-electronics-engineering-lab": [
    {
      "number": 1,
      "title": "Diode V-I Characteristics",
      "syllabus": "Plotting forward and reverse V-I characteristics of standard P-N junction diode and Zener diode."
    },
    {
      "number": 2,
      "title": "Rectifiers & Filter Circuits",
      "syllabus": "Implementation and waveform analysis of Half-wave and Full-wave bridge rectifiers with and without capacitor filter."
    },
    {
      "number": 3,
      "title": "BJT Characterization",
      "syllabus": "Measurement of Common Emitter (CE) BJT input and output static characteristics and calculation of current gain beta."
    },
    {
      "number": 4,
      "title": "Op-Amp Applications",
      "syllabus": "Verification of Inverting, Non-inverting, Adder, and Subtractor circuits using IC 741 Operational Amplifier."
    },
    {
      "number": 5,
      "title": "Logic Gates & Oscilloscope Operation",
      "syllabus": "Verification of truth tables for basic AND, OR, NOT, NAND, NOR, XOR logic gates, Measurement of AC signals using CRO."
    }
  ],
  "english-language-lab": [
    {
      "number": 1,
      "title": "Phonetics & Pronunciation",
      "syllabus": "International Phonetic Alphabet (IPA) symbols, Vowel and Consonant sounds, Word stress, Syllabification, and Pitch intonation patterns."
    },
    {
      "number": 2,
      "title": "Listening Comprehension",
      "syllabus": "Active listening techniques, Note-taking strategies during lectures, Understanding diverse accents (Indian, British, American)."
    },
    {
      "number": 3,
      "title": "Reading Fluency & Vocabulary",
      "syllabus": "Skimming, Scanning, Critical reading of technical texts, Contextual vocabulary acquisition."
    },
    {
      "number": 4,
      "title": "Oral Presentation Practice",
      "syllabus": "Extempore speaking, Individual slide presentation delivery, Voice modulation, Pitch control, Time management during talks."
    },
    {
      "number": 5,
      "title": "Mock Group Discussions & Debates",
      "syllabus": "Participating in simulated GD rounds, Assertive communication practice, Debate dynamics, Constructive feedback evaluation."
    }
  ],
  "workshop-practice-lab": [
    {
      "number": 1,
      "title": "Fitting Shop Practice",
      "syllabus": "Filing, Sawing, Marking, Drilling, Tapping exercises on mild steel flat plates using precision calipers and tri-squares."
    },
    {
      "number": 2,
      "title": "Carpentry Shop Practice",
      "syllabus": "Timber selection, Marking, Planning, Chiselling, and Joint preparation (T-Lap joint, Mortise & Tenon joint)."
    },
    {
      "number": 3,
      "title": "Welding Shop Practice",
      "syllabus": "Arc welding equipment operation, Safety precautions, Preparation of Lap joint, Butt joint, and T-joint."
    },
    {
      "number": 4,
      "title": "Sheet Metal & Soldering",
      "syllabus": "Development of surfaces, Cutting, Bending, Hemming, Fabrication of rectangular tray/funnel, Electric soldering techniques."
    },
    {
      "number": 5,
      "title": "Machining & Lathe Basics",
      "syllabus": "Introduction to Lathe machine operations: Facing, Plain turning, Step turning, Knurling exercises."
    }
  ],
  "engineering-physics": [
    {
      "number": 1,
      "title": "Quantum Mechanics",
      "syllabus": "De-Broglie hypothesis, Wave-particle duality, Wave packet, Phase and Group velocity.\nHeisenberg's Uncertainty Principle, Physical significance of wave function.\nTime-dependent and Time-independent Schrödinger wave equations, Particle in a one-dimensional infinite potential box."
    },
    {
      "number": 2,
      "title": "Electromagnetic Field Theory",
      "syllabus": "Displacement current, Maxwell's equations in differential and integral forms.\nElectromagnetic wave propagation in free space, isotropic dielectrics, and conducting media.\nPoynting vector and Poynting theorem, Skin depth and attenuation constant."
    },
    {
      "number": 3,
      "title": "Wave Optics & Interference",
      "syllabus": "Coherence, Division of wavefront and division of amplitude, Thin film interference, Newton's rings experiment and applications.\nFresnel and Fraunhofer diffraction, Single slit diffraction, Double slit diffraction, Diffraction grating, Resolving power of grating."
    },
    {
      "number": 4,
      "title": "Lasers & Fiber Optics",
      "syllabus": "Laser fundamentals: Spontaneous and stimulated emission, Einstein's A and B coefficients, Population inversion, Optical pumping and optical resonators.\nRuby laser, He-Ne laser, Semiconductor laser.\nFiber Optics: Principle of light propagation, Acceptance angle, Numerical Aperture (NA), Step-index and Graded-index optical fibers."
    },
    {
      "number": 5,
      "title": "Superconductivity & Nanomaterials",
      "syllabus": "Superconductivity: Meissner effect, Critical field and temperature, Type-I and Type-II superconductors, BCS theory (qualitative), High-Tc superconductors.\nNanomaterials: Introduction, Quantum dots/wires/wells, Synthesis methods (Sol-Gel, CVD), Carbon Nanotubes (CNTs) properties and applications."
    }
  ],
  "engineering-mathematics-2": [
    {
      "number": 1,
      "title": "Ordinary Differential Equations of Higher Order",
      "syllabus": "Linear differential equations of nth order with constant coefficients, Complementary function and Particular integral.\nSimultaneous linear differential equations, Differential equations of second order with variable coefficients by changing dependent and independent variables.\nMethod of variation of parameters, Cauchy-Euler homogeneous equations."
    },
    {
      "number": 2,
      "title": "Multivariable Calculus & Partial Differential Equations",
      "syllabus": "Formation of Partial Differential Equations (PDEs), First order linear PDEs (Lagrange's equation).\nFirst order non-linear PDEs (Charpit's method), Homogeneous and non-homogeneous linear PDEs with constant coefficients.\nSolution of PDEs by method of separation of variables."
    },
    {
      "number": 3,
      "title": "Applications of Partial Differential Equations",
      "syllabus": "Classification of second-order linear PDEs: Elliptic, Parabolic, and Hyperbolic equations.\nOne-dimensional Wave Equation (vibrating string) and its solution by D'Alembert's method.\nOne-dimensional Heat Conduction Equation and Two-dimensional Laplace Equation in Cartesian coordinates."
    },
    {
      "number": 4,
      "title": "Complex Variables - Analytic Functions",
      "syllabus": "Limit, continuity, and differentiability of complex functions.\nCauchy-Riemann (C-R) equations in Cartesian and polar forms, Analytic functions, Harmonic functions and harmonic conjugate.\nMilne-Thomson method for constructing analytic functions, Conformal mapping and Bilinear transformations."
    },
    {
      "number": 5,
      "title": "Complex Integration & Series",
      "syllabus": "Complex line integrals, Cauchy's Integral Theorem, Cauchy's Integral Formula for derivatives.\nTaylor's series and Laurent's series expansion of complex functions.\nSingularities, Zeros, Poles, Cauchy's Residue Theorem, Evaluation of real definite integrals around unit circle and semi-circle."
    }
  ],
  "programming-problem-solving": [
    {
      "number": 1,
      "title": "Basics of Programming & C Fundamentals",
      "syllabus": "Computer structure, Compiler, Interpreter, Linker, Loader, Algorithms, Flowcharts, Pseudo-code.\nC basics: Tokens, Data types, Variables, Constants, Operators (Arithmetic, Relational, Logical, Bitwise, Assignment, Increment/Decrement), Operator precedence."
    },
    {
      "number": 2,
      "title": "Control Structures & Decision Making",
      "syllabus": "Conditional branching: if, if-else, nested if-else, switch-case statement.\nIterative loops: while loop, do-while loop, for loop, nested loops, break, continue, and goto statements."
    },
    {
      "number": 3,
      "title": "Arrays & Strings",
      "syllabus": "1D arrays: Declaration, initialization, traversal, searching (Linear & Binary search), sorting (Bubble & Selection sort).\n2D arrays: Matrix operations (Addition, Multiplication, Transpose).\nStrings: String declaration, string handling functions (strlen, strcpy, strcat, strcmp), array of strings."
    },
    {
      "number": 4,
      "title": "Functions & Recursion",
      "syllabus": "Function declaration, definition, and call, Parameter passing techniques (Call by Value, Call by Reference).\nScope of variables: Local, Global, Static, Register, Extern storage classes.\nRecursion: Direct and indirect recursion, Factorial, Fibonacci series, Tower of Hanoi using recursion."
    },
    {
      "number": 5,
      "title": "Pointers, Structures & File I/O",
      "syllabus": "Pointers: Pointer declaration, pointer arithmetic, pointers and arrays, dynamic memory allocation (malloc, calloc, realloc, free).\nStructures & Unions: Declaration, nested structures, array of structures, structure pointers.\nFile Handling: File opening modes (r, w, a), fgetc, fputc, fgets, fputs, fread, fwrite, fscanf, fprintf, fclose."
    }
  ],
  "fundamentals-electrical-engineering": [
    {
      "number": 1,
      "title": "DC Circuit Analysis",
      "syllabus": "KCL, KVL, Mesh analysis, Nodal analysis, Superposition theorem, Thevenin's theorem, Norton's theorem, Maximum Power Transfer theorem."
    },
    {
      "number": 2,
      "title": "AC Steady-State Analysis",
      "syllabus": "Representation of sinusoidal waveforms, Peak, RMS, Average values, Form factor, Phasor representation, R-L, R-C, R-L-C series and parallel circuits, Resonance, Power factor."
    },
    {
      "number": 3,
      "title": "Transformers",
      "syllabus": "Magnetic circuits, Single-phase transformer construction, E.M.F equation, Ideal and Practical transformer, Phasor diagram, Losses, Efficiency, Open and Short circuit tests."
    },
    {
      "number": 4,
      "title": "Electrical Machines",
      "syllabus": "DC Machines: Construction, EMF equation of DC Generator, Torque equation of DC Motor, Single-phase & Three-phase Induction Motors: Construction, Principle, Slip-torque characteristics."
    },
    {
      "number": 5,
      "title": "Electrical Installations & Batteries",
      "syllabus": "Switchgear: Fuses, MCB, ELCB, Earthing types (Pipe & Plate earthing), Batteries: Lead-acid battery, Lithium-ion battery, Energy consumption calculations."
    }
  ],
  "environment-ecology": [
    {
      "number": 1,
      "title": "Ecosystems & Biodiversity",
      "syllabus": "Concept of ecosystem, Structure and function, Food chains, Food webs, Ecological pyramids, Biodiversity levels, Hotspots, Conservation (In-situ & Ex-situ)."
    },
    {
      "number": 2,
      "title": "Natural Resources & Management",
      "syllabus": "Forest resources, Water resources, Mineral resources, Food resources, Energy resources: Renewable (Solar, Wind, Hydro) vs Non-renewable."
    },
    {
      "number": 3,
      "title": "Environmental Pollution",
      "syllabus": "Air pollution: Sources, Effects, Control measures, Water pollution: Industrial effluents, Sewage treatment, Thermal & Noise pollution, Solid waste management."
    },
    {
      "number": 4,
      "title": "Social Issues & Climate Change",
      "syllabus": "Sustainable development, Urban problems related to energy, Water conservation, Acid rain, Ozone layer depletion, Global warming, Greenhouse effect."
    },
    {
      "number": 5,
      "title": "Environmental Acts & Human Health",
      "syllabus": "Environment Protection Act, Air Act, Water Act, Wildlife Protection Act, Forest Conservation Act, Human population growth and impact on health."
    }
  ],
  "engineering-physics-lab": [
    {
      "number": 1,
      "title": "Optics & Wavelength Measurements",
      "syllabus": "Determination of wavelength of sodium light using Newton's rings experiment."
    },
    {
      "number": 2,
      "title": "Spectrometer & Diffraction",
      "syllabus": "Determination of wavelength of spectral lines of mercury light using Diffraction Grating and Spectrometer."
    },
    {
      "number": 3,
      "title": "Fiber Optics Parameters",
      "syllabus": "Measurement of Acceptance Angle and Numerical Aperture (NA) of an optical fiber."
    },
    {
      "number": 4,
      "title": "Solid State Measurements",
      "syllabus": "Determination of band gap of a semiconductor using Four-Probe method / P-N junction diode method."
    },
    {
      "number": 5,
      "title": "Electromagnetics & Hall Effect",
      "syllabus": "Determination of Hall coefficient and carrier concentration of a semiconductor using Hall Effect setup."
    }
  ],
  "programming-problem-solving-lab": [
    {
      "number": 1,
      "title": "Basic C Syntax & Branching Exercises",
      "syllabus": "C programs demonstrating arithmetic expressions, conditional if-else statements, and switch-case menus."
    },
    {
      "number": 2,
      "title": "Loops & Series Calculation",
      "syllabus": "Iterative C programs to generate prime numbers, Armstrong numbers, Fibonacci series, and pattern printing."
    },
    {
      "number": 3,
      "title": "Arrays & Searching Algorithms",
      "syllabus": "Implementation of 1D array operations, Linear Search, Binary Search, and Bubble Sort in C."
    },
    {
      "number": 4,
      "title": "Matrix Operations & Strings",
      "syllabus": "Matrix addition, matrix multiplication, and string manipulation programs without using built-in string functions."
    },
    {
      "number": 5,
      "title": "Pointers, Recursion & Files",
      "syllabus": "Swapping values using pointers, Recursive factorial/Tower of Hanoi, and File copy operations in C."
    }
  ],
  "basic-electrical-engineering-lab": [
    {
      "number": 1,
      "title": "Network Theorems Verification",
      "syllabus": "Experimental verification of Kirchhoff's laws (KCL/KVL), Thevenin's theorem, and Norton's theorem."
    },
    {
      "number": 2,
      "title": "Superposition & Maximum Power",
      "syllabus": "Verification of Superposition theorem and Maximum Power Transfer theorem on DC resistive circuits."
    },
    {
      "number": 3,
      "title": "R-L-C Series Resonance",
      "syllabus": "Plotting frequency response curve of R-L-C series circuit and measuring resonant frequency, bandwidth, and Q-factor."
    },
    {
      "number": 4,
      "title": "Single-Phase Transformer Testing",
      "syllabus": "Open-circuit and Short-circuit tests on single-phase transformer to calculate efficiency and voltage regulation."
    },
    {
      "number": 5,
      "title": "Three-Phase Power Measurement",
      "syllabus": "Measurement of 3-phase active power using Two-Wattmeter method on balanced star and delta loads."
    }
  ],
  "engineering-graphics-design-lab": [
    {
      "number": 1,
      "title": "CAD Fundamentals & Lettering",
      "syllabus": "Introduction to CAD software interface, Drawing setup, Layers, Dimensioning styles, Projections of Points."
    },
    {
      "number": 2,
      "title": "Projections of Lines",
      "syllabus": "Projections of straight lines inclined to both Reference Planes (HP and VP), True length and true inclinations determination."
    },
    {
      "number": 3,
      "title": "Projections of Planes",
      "syllabus": "Projections of polygonal and circular plane surfaces inclined to HP and VP."
    },
    {
      "number": 4,
      "title": "Projections of Solids",
      "syllabus": "Projections of regular solids: Prisms, Pyramids, Cylinders, and Cones inclined to HP and VP."
    },
    {
      "number": 5,
      "title": "Isometric Projections & Sections",
      "syllabus": "Sectioning of solids, Development of lateral surfaces of truncated solids, Isometric views of combined 3D objects."
    }
  ],
  "data-structures": [
    {
      "number": 1,
      "title": "Complexity & Linear Lists",
      "syllabus": "Asymptotic Notations (Big-Oh, Theta, Omega), time and space complexity analysis.\nSingle, double, and circular linked lists implementation.\nOperations on lists: Insertion, deletion, reversal, polynomial addition using linked lists."
    },
    {
      "number": 2,
      "title": "Stacks & Queues",
      "syllabus": "Stack ADT, array and linked list representation of stacks.\nExpressions: Infix to Postfix, Infix to Prefix conversion, Postfix expression evaluation.\nQueue ADT: Linear queue, Circular queue, Double-Ended Queue (Deque), Priority queues."
    },
    {
      "number": 3,
      "title": "Trees & Binary Search Trees",
      "syllabus": "Tree terminology, Binary tree properties, Binary tree traversals (Preorder, Inorder, Postorder).\nBinary Search Trees (BST): insertion, deletion, searching.\nAVL Trees: Balance factor, single and double rotations, B-Trees and B+ Trees overview."
    },
    {
      "number": 4,
      "title": "Graphs & Spanning Trees",
      "syllabus": "Graph terminology, Adjacency matrix and Adjacency list representations.\nGraph Traversals: Breadth First Search (BFS), Depth First Search (DFS).\nMinimum Spanning Trees (MST): Prim's and Kruskal's algorithms.\nShortest Path Algorithms: Dijkstra's and Warshall's algorithms."
    },
    {
      "number": 5,
      "title": "Searching, Sorting & Hashing",
      "syllabus": "Searching: Linear search, Binary search.\nSorting: Insertion sort, Selection sort, Bubble sort, Quick sort, Merge sort, Heap sort.\nHashing: Hash functions, Collision resolution (Separate chaining, Linear probing, Quadratic probing, Double hashing)."
    }
  ],
  "computer-organization-architecture": [
    {
      "number": 1,
      "title": "Register Transfer & Microoperations",
      "syllabus": "Functional blocks of a computer, Register transfer language, Bus and memory transfers.\nArithmetic microoperations, Logic microoperations, Shift microoperations, Arithmetic Logic Shift Unit (ALSU)."
    },
    {
      "number": 2,
      "title": "Basic Computer Organization & CPU Design",
      "syllabus": "Instruction codes, Computer registers, Computer instructions, Timing and control.\nInstruction cycle: Fetch, Decode, Execute, Memory reference instructions, Input-Output and Interrupt cycle.\nDesign of basic computer accumulator and CPU instruction formats (3-address, 2-address, 1-address, 0-address)."
    },
    {
      "number": 3,
      "title": "Computer Arithmetic",
      "syllabus": "Addition and subtraction with signed magnitude data, Hardware implementation.\nMultiplication algorithms: Booth's multiplication algorithm, Hardware implementation for Booth's algorithm.\nDivision algorithms: Restoring and Non-restoring division algorithms, Floating-point arithmetic operations (IEEE 754 standard)."
    },
    {
      "number": 4,
      "title": "Memory Organization & Pipelining",
      "syllabus": "Memory hierarchy, Main memory (RAM/ROM), Auxiliary memory (Magnetic disk/tape).\nAssociative memory, Cache memory: Mapping techniques (Direct, Associative, Set-Associative), Cache write policies.\nVirtual memory: Address mapping, Page replacement policies, Parallel processing and Pipelining (Instruction pipeline, Arithmetic pipeline, Pipeline hazards)."
    },
    {
      "number": 5,
      "title": "Input-Output Organization",
      "syllabus": "Peripheral devices, Input-Output Interface, Asynchronous data transfer (Strobe control, Handshaking).\nModes of transfer: Programmed I/O, Interrupt-initiated I/O, Direct Memory Access (DMA), DMA controller, Input-Output Processor (IOP)."
    }
  ],
  "discrete-mathematics": [
    {
      "number": 1,
      "title": "Set Theory & Relations",
      "syllabus": "Sets, Subsets, Power set, Venn diagrams, Set operations, Inclusion-Exclusion principle.\nRelations: Properties of binary relations, Equivalence relations, Partial ordering relations (Posets), Hasse diagrams, Lattices as posets."
    },
    {
      "number": 2,
      "title": "Functions & Combinatorics",
      "syllabus": "Functions: Types of functions (Injective, Surjective, Bijective), Composition of functions, Inverse functions.\nCombinatorics: Permutations and Combinations, Pigeonhole Principle, Recurrence relations, Generating functions."
    },
    {
      "number": 3,
      "title": "Propositional & Predicate Logic",
      "syllabus": "Propositional Logic: Truth tables, Tautologies, Contradictions, Logical equivalences, Normal forms (DNF, CNF), Rules of Inference.\nPredicate Logic: Quantifiers (Universal & Existential), Nested quantifiers, Proof techniques."
    },
    {
      "number": 4,
      "title": "Algebraic Structures",
      "syllabus": "Algebraic systems, Binary operations, Groups, Subgroups, Cyclic groups, Cosets, Lagrange's Theorem.\nRings, Integral Domains, Fields, Homomorphism and Isomorphism of algebraic structures."
    },
    {
      "number": 5,
      "title": "Graph Theory & Trees",
      "syllabus": "Graph basics: Directed/Undirected graphs, Degree of vertices, Eulerian & Hamiltonian paths, Planar graphs, Graph coloring.\nTrees: Spanning trees, Rooted trees, Tree traversal, Binary trees."
    }
  ],
  "cyber-security": [
    {
      "number": 1,
      "title": "Cyber Security Fundamentals & Threats",
      "syllabus": "Introduction to Cyber Space, Information Security concepts, Cyber Attacks taxonomy: Malware (Viruses, Worms, Trojans), Ransomware, Phishing, Man-in-the-Middle (MitM), Denial of Service (DoS/DDoS)."
    },
    {
      "number": 2,
      "title": "Cryptography & Encryption Basics",
      "syllabus": "Symmetric Encryption (DES, AES), Asymmetric Encryption (RSA), Hash functions (SHA-256, MD5), Digital Signatures, Public Key Infrastructure (PKI), Digital Certificates."
    },
    {
      "number": 3,
      "title": "Web & Network Security",
      "syllabus": "Network security protocols: IPsec, SSL/TLS, HTTPS, Firewalls, Intrusion Detection Systems (IDS/IPS), Web security threats: SQL Injection (SQLi), Cross-Site Scripting (XSS), CSRF."
    },
    {
      "number": 4,
      "title": "Cyber Forensics & Incident Response",
      "syllabus": "Digital Forensics process: Evidence collection, preservation, analysis, Mobile forensics, Memory forensics, Incident response life cycle, Log management."
    },
    {
      "number": 5,
      "title": "Cyber Laws & IT Act 2000",
      "syllabus": "Cyber Crimes taxonomy, IT Act 2000 provisions, Sections 65, 66, 67, Intellectual Property Rights (IPR) in digital domain, Data Privacy Regulations (GDPR/DPDP Act)."
    }
  ],
  "universal-human-values": [
    {
      "number": 1,
      "title": "Introduction to Value Education",
      "syllabus": "Understanding Value Education, Process of Self-Exploration, Continuous Happiness and Prosperity, Basic Human Aspirations, Right Understanding."
    },
    {
      "number": 2,
      "title": "Harmony in Human Being",
      "syllabus": "Understanding Human Being as Co-existence of 'I' and 'Body', Needs of 'I' and 'Body', Harmony of 'I' with 'Body', Correct Appraisal of Physical Needs."
    },
    {
      "number": 3,
      "title": "Harmony in Family & Society",
      "syllabus": "Values in Family: Trust (Vishwas) and Respect (Samman), Foundational Human Values, Harmony in Society: From Family to World Family."
    },
    {
      "number": 4,
      "title": "Harmony in Nature & Existence",
      "syllabus": "Interconnectedness and Mutual Fulfillment in Nature, Four Orders in Nature (Material, Plant, Animal, Human), Existence as Co-existence."
    },
    {
      "number": 5,
      "title": "Professional Ethics & Conduct",
      "syllabus": "Natural Acceptance of Human Values, Definitiveness of Ethical Human Conduct, Competence in Professional Ethics, Vision for Holistic Technologies."
    }
  ],
  "data-structures-lab": [
    {
      "number": 1,
      "title": "Arrays & Linked List Lab",
      "syllabus": "C/C++ programs for dynamic memory allocation, single and double linked list insertion, deletion, and reversal."
    },
    {
      "number": 2,
      "title": "Stack & Queue Lab",
      "syllabus": "Implementing Stack using arrays/linked lists, Infix to Postfix conversion, and Circular Queue simulation."
    },
    {
      "number": 3,
      "title": "Binary Search Tree Lab",
      "syllabus": "Constructing Binary Search Tree (BST), Recursive Inorder/Preorder/Postorder traversals, and node deletion."
    },
    {
      "number": 4,
      "title": "Graph Traversal & Spanning Trees",
      "syllabus": "Breadth-First Search (BFS), Depth-First Search (DFS) implementation, Prim's and Kruskal's MST algorithms in C++."
    },
    {
      "number": 5,
      "title": "Sorting & Hashing Lab",
      "syllabus": "Implementing Quick Sort, Merge Sort, Heap Sort, and Hash Table with Chaining collision resolution."
    }
  ],
  "computer-organization-architecture-lab": [
    {
      "number": 1,
      "title": "Logic Gates & Combinational Circuits",
      "syllabus": "Designing Adder, Subtractor, Multiplexer, and Demultiplexer using digital logic simulator tools."
    },
    {
      "number": 2,
      "title": "Sequential Circuits & Registers",
      "syllabus": "Implementing Flip-Flops (JK, D, T), Shift Registers, and Synchronous Counters."
    },
    {
      "number": 3,
      "title": "ALU Simulation",
      "syllabus": "Verilog / VHDL simulation of 4-bit Arithmetic Logic Unit (ALU) supporting addition, subtraction, AND, OR."
    },
    {
      "number": 4,
      "title": "Booth's Multiplier Simulation",
      "syllabus": "Simulating Booth's Multiplication Algorithm for signed binary numbers."
    },
    {
      "number": 5,
      "title": "Memory & Cache Mapping",
      "syllabus": "Simulation of Direct and Set-Associative Cache Memory mapping strategies."
    }
  ],
  "web-designing-workshop": [
    {
      "number": 1,
      "title": "HTML5 & Semantic Markup",
      "syllabus": "Building structured web pages using HTML5 semantic tags, Forms, Input validations, Media elements."
    },
    {
      "number": 2,
      "title": "CSS3 & Responsive Layouts",
      "syllabus": "Styling web pages with CSS3 selectors, Flexbox grid system, CSS Grid, Media queries for mobile responsiveness."
    },
    {
      "number": 3,
      "title": "JavaScript DOM Manipulation",
      "syllabus": "JavaScript variables, Functions, Event handling, DOM selection and dynamic element creation."
    },
    {
      "number": 4,
      "title": "Bootstrap Framework",
      "syllabus": "Utilizing Bootstrap 5 components: Navbars, Modals, Cards, Grid system, Form controls."
    },
    {
      "number": 5,
      "title": "Web Hosting & Mini Project",
      "syllabus": "Building a responsive portfolio / college portal and deploying to GitHub Pages / Vercel."
    }
  ],
  "mini-project-internship-1": [
    {
      "number": 1,
      "title": "Project Proposal & Requirements",
      "syllabus": "Defining project scope, problem statement, technology stack selection, and SRS document creation."
    },
    {
      "number": 2,
      "title": "System Design & Prototyping",
      "syllabus": "Designing ER diagrams, UML class diagrams, UI wireframes, and database schema setup."
    },
    {
      "number": 3,
      "title": "Implementation & Demo",
      "syllabus": "Coding core features, integration testing, project demonstration, and viva voce assessment."
    }
  ],
  "operating-systems": [
    {
      "number": 1,
      "title": "OS Introduction & Process Management",
      "syllabus": "Operating system objectives and structure, System calls, Dual-mode operation.\nProcess concept, Process Control Block (PCB), Process state transition, Threads and multithreading models.\nCPU scheduling criteria, FCFS, SJF, Priority, Round Robin (RR), Multilevel Queue scheduling."
    },
    {
      "number": 2,
      "title": "Process Synchronization & Deadlocks",
      "syllabus": "Critical section problem, Peterson's solution, Hardware synchronization primitives.\nSemaphores (Counting & Binary), Classical synchronization problems (Bounded Buffer, Readers-Writers, Dining Philosophers).\nDeadlock characterization, Resource allocation graph, Deadlock handling strategies, Banker's algorithm for deadlock avoidance, Deadlock detection and recovery."
    },
    {
      "number": 3,
      "title": "Memory Management & Virtual Memory",
      "syllabus": "Contiguous memory allocation, Fixed and dynamic partitioning, Paging and page table architecture.\nSegmentation, Virtual memory concept, Demand paging, Page replacement algorithms (FIFO, Optimal, LRU, LFU).\nThrashing and working-set model."
    },
    {
      "number": 4,
      "title": "File Systems & Mass Storage",
      "syllabus": "File concept and access methods, Directory structures (Single-level, Two-level, Tree-structured), File system mounting and protection.\nDisk structure, Disk scheduling algorithms (FCFS, SSTF, SCAN, C-SCAN, LOOK), RAID structure."
    },
    {
      "number": 5,
      "title": "Protection, Security & OS Case Studies",
      "syllabus": "Domain of protection, Access matrix implementation, Security threats (Trojan horses, Viruses, Worms).\nAuthentication and access control mechanisms, Linux and Windows operating system architectures, Case studies on kernel structure and IPC."
    }
  ],
  "database-management-systems": [
    {
      "number": 1,
      "title": "DBMS Architecture & ER Modeling",
      "syllabus": "Database system concepts, DBMS architecture, Data independence (Physical & Logical), Data models.\nEntity-Relationship (ER) model: Entities, Attributes, Relationships, Keys (Candidate, Primary, Foreign), Enhanced ER (EER) diagrams, ER-to-Relational mapping."
    },
    {
      "number": 2,
      "title": "Relational Data Model & SQL",
      "syllabus": "Relational Algebra: Select, Project, Join, Union, Intersection, Difference, Cartesian product.\nSQL: DDL, DML, DCL commands, Table creation, Constraints, Subqueries, Nested queries, Joins (Inner, Outer), Views, Triggers, Stored Procedures."
    },
    {
      "number": 3,
      "title": "Relational Database Design & Normalization",
      "syllabus": "Functional Dependencies, Closure of functional dependencies, Canonical cover.\nNormalization: 1NF, 2NF, 3NF, Boyce-Codd Normal Form (BCNF), 4NF, Lossless join decomposition, Dependency preservation."
    },
    {
      "number": 4,
      "title": "Transaction Processing & Concurrency Control",
      "syllabus": "Transaction concept, ACID properties, Transaction states, Schedule serializability (Conflict & View serializability).\nConcurrency control: Lock-based protocols (2PL, Strict 2PL), Timestamp-based protocols, Validation-based protocols, Deadlock handling in DBMS."
    },
    {
      "number": 5,
      "title": "Recovery System & Indexing",
      "syllabus": "Failure classification, Storage structure, Recovery algorithms: Log-based recovery (Deferred & Immediate modification), Checkpoints, Shadow paging.\nIndexing: B-Trees, B+ Trees indexing structures, Static and Dynamic Hashing."
    }
  ],
  "theory-automata": [
    {
      "number": 1,
      "title": "Finite Automata & Regular Expressions",
      "syllabus": "Alphabet, Words, Languages, Deterministic Finite Automata (DFA), Non-deterministic Finite Automata (NFA), Equivalence of DFA and NFA, NFA with Epsilon transitions, Minimization of DFA, Regular Expressions, Pumping Lemma for Regular Languages."
    },
    {
      "number": 2,
      "title": "Context-Free Grammars & Languages",
      "syllabus": "Context-Free Grammars (CFG), Parse Trees, Ambiguity in CFG, Chomsky Normal Form (CNF), Greibach Normal Form (GNF), Pumping Lemma for Context-Free Languages, Closure properties of CFLs."
    },
    {
      "number": 3,
      "title": "Pushdown Automata (PDA)",
      "syllabus": "Pushdown Automata definition, Instantaneous descriptions, Acceptance by final state and empty stack, Deterministic PDA vs Non-deterministic PDA, Equivalence of CFG and PDA."
    },
    {
      "number": 4,
      "title": "Turing Machines (TM)",
      "syllabus": "Turing Machine model, Representation of TMs, Design of TMs for language recognition and function computation, Modifications of TMs (Multi-tape, Multi-track, Non-deterministic TMs), Church-Turing Thesis."
    },
    {
      "number": 5,
      "title": "Decidability & Undecidability",
      "syllabus": "Decidable and Undecidable problems, Halting Problem of Turing Machine, Post Correspondence Problem (PCP), Rice's Theorem, Chomsky Hierarchy of languages (Type 0, Type 1, Type 2, Type 3)."
    }
  ],
  "technical-communication": [
    {
      "number": 1,
      "title": "Fundamentals of Technical Communication",
      "syllabus": "Definition, Features, and Importance of Technical Communication, Difference between General and Technical Communication, Communication Barriers, 7 Cs of Communication."
    },
    {
      "number": 2,
      "title": "Technical Writing Elements",
      "syllabus": "Audience Analysis, Technical Vocabulary, Thesis statement, Paragraph writing patterns (Deductive, Inductive, Chronological, Spatial), Plain language guidelines."
    },
    {
      "number": 3,
      "title": "Technical Reports & Proposals",
      "syllabus": "Types of technical reports (Feasibility, Progress, Inspection), Report structure: Front matter, Body, Back matter, Technical Proposal writing (Solicited vs Unsolicited)."
    },
    {
      "number": 4,
      "title": "Research Papers & Manuals",
      "syllabus": "Abstract writing, Citation styles (IEEE, APA), User manual preparation, Executive summary writing."
    },
    {
      "number": 5,
      "title": "Interviews & Group Communication",
      "syllabus": "Participating in technical panel interviews, Conducting professional meetings, Drafting agendas and minutes of meeting (MoM)."
    }
  ],
  "python-programming-elective": [
    {
      "number": 1,
      "title": "Python Basics & Control Flow",
      "syllabus": "Python installation, Data types (int, float, str, bool), Operators, Conditional branching (if-elif-else), Iterative loops (while, for), range function, break/continue."
    },
    {
      "number": 2,
      "title": "Data Structures in Python",
      "syllabus": "Lists: Operations, Slicing, List comprehension, Tuples: Immutability, Operations, Sets: Operations, Dictionaries: Key-value access, Methods."
    },
    {
      "number": 3,
      "title": "Functions, Modules & Packages",
      "syllabus": "Defining functions, Default arguments, *args, **kwargs, Lambda functions, Built-in modules (math, random, datetime), Creating custom packages."
    },
    {
      "number": 4,
      "title": "Object-Oriented Programming & Exceptions",
      "syllabus": "Classes and Objects, Constructors (__init__), Inheritance, Polymorphism, Encapsulation, Exception handling (try-except-finally)."
    },
    {
      "number": 5,
      "title": "File I/O & NumPy Basics",
      "syllabus": "File operations (read, write, append), Working with CSV files, Introduction to NumPy arrays, Pandas DataFrames basics."
    }
  ],
  "operating-systems-lab": [
    {
      "number": 1,
      "title": "Linux Shell Command Scripting",
      "syllabus": "Linux terminal navigation, File permissions (chmod), Shell scripting variables, Conditionals, and Loops."
    },
    {
      "number": 2,
      "title": "Process Control System Calls",
      "syllabus": "Writing C programs demonstrating process creation using fork(), exec(), wait(), and exit() system calls."
    },
    {
      "number": 3,
      "title": "CPU Scheduling Algorithms Lab",
      "syllabus": "Implementing FCFS, SJF, Priority, and Round Robin CPU scheduling algorithms in C/C++."
    },
    {
      "number": 4,
      "title": "Semaphore & Synchronization Lab",
      "syllabus": "Implementing Producer-Consumer problem using POSIX semaphores and mutex locks."
    },
    {
      "number": 5,
      "title": "Page Replacement Algorithms Lab",
      "syllabus": "Simulating FIFO, LRU, and Optimal page replacement algorithms in C/C++."
    }
  ],
  "database-management-systems-lab": [
    {
      "number": 1,
      "title": "SQL DDL & DML Commands",
      "syllabus": "Executing CREATE TABLE, ALTER, DROP, INSERT, UPDATE, DELETE commands with Primary and Foreign key constraints."
    },
    {
      "number": 2,
      "title": "Advanced SQL Queries & Joins",
      "syllabus": "Executing GROUP BY, HAVING, Nested Subqueries, INNER JOIN, LEFT/RIGHT OUTER JOIN queries."
    },
    {
      "number": 3,
      "title": "PL/SQL Control Structures",
      "syllabus": "Writing PL/SQL blocks using IF-THEN-ELSE, Loops, and Exception Handling."
    },
    {
      "number": 4,
      "title": "PL/SQL Cursors & Triggers",
      "syllabus": "Creating Explicit Cursors, Database Triggers (BEFORE/AFTER INSERT/UPDATE), and Stored Procedures."
    },
    {
      "number": 5,
      "title": "Mini Database Project",
      "syllabus": "Designing ER diagram, normalization up to 3NF, and building a relational database schema for a real-world system."
    }
  ],
  "java-programming-lab": [
    {
      "number": 1,
      "title": "Java OOP Basics",
      "syllabus": "Writing Java programs for class design, constructors, method overloading, and static keyword usage."
    },
    {
      "number": 2,
      "title": "Inheritance & Interfaces",
      "syllabus": "Demonstrating Single, Multilevel inheritance, Abstract classes, Interface implementation, and method overriding."
    },
    {
      "number": 3,
      "title": "Exception Handling & Packages",
      "syllabus": "Creating user-defined exceptions, try-catch-finally blocks, and custom package creation."
    },
    {
      "number": 4,
      "title": "Multithreading & Collections",
      "syllabus": "Creating threads using Thread class and Runnable interface, ArrayList, HashMap operations."
    },
    {
      "number": 5,
      "title": "GUI Development",
      "syllabus": "Building desktop GUI applications using Java Swing / JavaFX components and event handling."
    }
  ],
  "cyber-security-audit-lab": [
    {
      "number": 1,
      "title": "Network Scanning & Wireshark",
      "syllabus": "Performing network reconnaissance using Nmap, Packet sniffing and protocol analysis using Wireshark."
    },
    {
      "number": 2,
      "title": "Vulnerability Scanning",
      "syllabus": "Using OpenVAS / Nessus tools to audit system vulnerabilities and generate security report."
    },
    {
      "number": 3,
      "title": "Web Security Auditing",
      "syllabus": "Testing web applications for SQL Injection (SQLi) and Cross-Site Scripting (XSS) using Burp Suite."
    },
    {
      "number": 4,
      "title": "Cryptography Lab",
      "syllabus": "Implementing AES encryption/decryption, RSA key pair generation, and SHA-256 hash calculation."
    },
    {
      "number": 5,
      "title": "Log & Forensic Analysis",
      "syllabus": "Analyzing system authentication logs, inspecting digital evidence hashes using Autopsy tools."
    }
  ],
  "compiler-design": [
    {
      "number": 1,
      "title": "Introduction & Lexical Analysis",
      "syllabus": "Compiler architecture phases, Lexical Analyzer role, Input buffering, Tokens, Patterns, Regular Expressions, LEX tool."
    },
    {
      "number": 2,
      "title": "Top-Down Parsing",
      "syllabus": "Context-Free Grammars, Recursive Descent Parsing, LL(1) Parsers, FIRST and FOLLOW sets, Parsing table construction."
    },
    {
      "number": 3,
      "title": "Bottom-Up Parsing",
      "syllabus": "Shift-Reduce parsing, SLR(1), CLR(1), LALR(1) Parsing tables, YACC parser generator tool."
    },
    {
      "number": 4,
      "title": "Syntax-Directed Translation & Intermediate Code",
      "syllabus": "Syntax-Directed Definitions, Three-Address Code (Quadruples, Triples), Translation of Expressions and Control Statements."
    },
    {
      "number": 5,
      "title": "Code Optimization & Generation",
      "syllabus": "Basic Blocks, Flow Graphs, DAG representation, Peephole Optimization, Register Allocation, Code Generation algorithms."
    }
  ],
  "computer-networks": [
    {
      "number": 1,
      "title": "Network Fundamentals & Physical Layer",
      "syllabus": "Network topologies, Transmission modes, OSI vs TCP/IP reference models, Transmission media, Modulation, Circuit/Packet switching."
    },
    {
      "number": 2,
      "title": "Data Link Layer & MAC Sublayer",
      "syllabus": "Framing, Error detection (CRC), Flow control (Sliding Window), CSMA/CD, Ethernet, Wireless LANs (IEEE 802.11)."
    },
    {
      "number": 3,
      "title": "Network Layer & Routing Protocols",
      "syllabus": "IPv4 addressing, Subnetting, IPv6, Routing algorithms (Distance Vector, Link State), OSPF, BGP, ARP, ICMP, DHCP."
    },
    {
      "number": 4,
      "title": "Transport Layer Protocols",
      "syllabus": "Socket interface, UDP segment format, TCP 3-way handshake, TCP Congestion Control (Slow Start), Flow control."
    },
    {
      "number": 5,
      "title": "Application Layer & Security",
      "syllabus": "DNS, HTTP/HTTPS, FTP, SMTP, Cryptography (AES, RSA), Digital Signatures, Firewalls, SSL/TLS."
    }
  ],
  "design-analysis-algorithms": [
    {
      "number": 1,
      "title": "Algorithm Analysis & Divide & Conquer",
      "syllabus": "Asymptotic notation, Recurrence relations (Master Theorem), Merge Sort, Quick Sort, Binary Search, Strassen's Matrix Multiplication."
    },
    {
      "number": 2,
      "title": "Greedy Strategy & Dynamic Programming",
      "syllabus": "Greedy: Fractional Knapsack, Huffman Coding, Prim's & Kruskal's MST.\nDP: 0/1 Knapsack, Longest Common Subsequence (LCS), Matrix Chain Multiplication."
    },
    {
      "number": 3,
      "title": "Graph Algorithms & Backtracking",
      "syllabus": "All-Pairs Shortest Path (Floyd-Warshall), Single-Source Shortest Path (Dijkstra, Bellman-Ford).\nBacktracking: N-Queens problem, Subset Sum problem, Graph Coloring."
    },
    {
      "number": 4,
      "title": "Branch & Bound & String Matching",
      "syllabus": "Branch & Bound: Traveling Salesperson Problem (TSP), 15-Puzzle problem.\nString Matching: Naive, Rabin-Karp, Knuth-Morris-Pratt (KMP) algorithm."
    },
    {
      "number": 5,
      "title": "NP-Completeness & Approximation Algorithms",
      "syllabus": "P, NP, NP-Hard, NP-Complete classes, Polynomial time reduction, Cook's Theorem, Vertex Cover & TSP Approximation algorithms."
    }
  ],
  "web-technology-elective": [
    {
      "number": 1,
      "title": "Client-Side Technologies (HTML/CSS/JS)",
      "syllabus": "HTML5 APIs, CSS Flexbox & Grid, JavaScript ES6+ features (Promises, Async/Await, Fetch API, DOM manipulation)."
    },
    {
      "number": 2,
      "title": "Node.js & Express.js Backend",
      "syllabus": "Node.js Architecture, Event Loop, NPM, Express.js Routing, Middleware functions, RESTful API architecture design."
    },
    {
      "number": 3,
      "title": "React.js Framework",
      "syllabus": "React Components (Functional vs Class), JSX, Props, State, React Hooks (useState, useEffect, useContext), Client-Side Routing."
    },
    {
      "number": 4,
      "title": "NoSQL Databases & MongoDB",
      "syllabus": "MongoDB document model, CRUD operations, Indexing, Aggregation Framework, Mongoose ODM integration."
    },
    {
      "number": 5,
      "title": "Full-Stack Security & Deployment",
      "syllabus": "JWT Authentication, Password hashing (bcrypt), CORS, Helmet security, Deploying application to Vercel/Render."
    }
  ],
  "management-information-systems": [
    {
      "number": 1,
      "title": "MIS Foundations in Digital Firm",
      "syllabus": "Role of MIS in business, Digital firm concept, Components of Information Systems, Strategic role of IS."
    },
    {
      "number": 2,
      "title": "Information Systems & Business Strategy",
      "syllabus": "Porter's Competitive Forces Model, Value Chain Model, Enterprise Systems (ERP, SCM, CRM)."
    },
    {
      "number": 3,
      "title": "Decision Support Systems & Business Intelligence",
      "syllabus": "Decision Making process, DSS architecture, Group DSS, Data Warehousing, Data Mining, Executive Support Systems (ESS)."
    },
    {
      "number": 4,
      "title": "E-Commerce & Digital Markets",
      "syllabus": "E-Commerce business models (B2C, B2B, C2C), Digital payment systems, E-commerce security, Mobile Commerce."
    },
    {
      "number": 5,
      "title": "IS Security, Ethics & Project Management",
      "syllabus": "IS Vulnerabilities, Disaster Recovery Planning, Ethical & Social issues in IS, System Development Life Cycle (SDLC) for MIS."
    }
  ],
  "compiler-design-lab": [
    {
      "number": 1,
      "title": "Lexical Analyzer in C/C++",
      "syllabus": "Writing a program to identify keywords, identifiers, constants, and operators from C input code."
    },
    {
      "number": 2,
      "title": "LEX Tool Practice",
      "syllabus": "Writing LEX specifications to count lines/words, convert numbers, and recognize tokens."
    },
    {
      "number": 3,
      "title": "YACC Parser Generator Practice",
      "syllabus": "Writing YACC specifications for evaluating arithmetic expressions and validating syntax."
    },
    {
      "number": 4,
      "title": "Intermediate Code Generation",
      "syllabus": "Generating Three-Address Code (Quadruples/Triples) for simple assignment statements."
    },
    {
      "number": 5,
      "title": "Code Optimization Lab",
      "syllabus": "Implementing constant folding and dead code elimination algorithms."
    }
  ],
  "computer-networks-lab": [
    {
      "number": 1,
      "title": "Cisco Packet Tracer Setup",
      "syllabus": "Designing network topologies using Hubs, Switches, and Routers in Cisco Packet Tracer."
    },
    {
      "number": 2,
      "title": "Socket Programming in C/Python",
      "syllabus": "Writing TCP and UDP client-server socket programs for message exchange."
    },
    {
      "number": 3,
      "title": "IP Subnetting & Router Configuration",
      "syllabus": "Configuring Static and Dynamic Routing (RIP/OSPF) on Cisco Routers."
    },
    {
      "number": 4,
      "title": "Wireshark Packet Capture",
      "syllabus": "Capturing and analyzing HTTP, DNS, TCP 3-way handshake, and ARP packets."
    },
    {
      "number": 5,
      "title": "Network Simulation Tools",
      "syllabus": "Simulating wireless LAN performance and throughput using NS2 / Mininet."
    }
  ],
  "design-analysis-algorithms-lab": [
    {
      "number": 1,
      "title": "Divide & Conquer Lab",
      "syllabus": "Implementing Merge Sort and Quick Sort with recursive call tree tracking and execution time analysis."
    },
    {
      "number": 2,
      "title": "Greedy Algorithms Lab",
      "syllabus": "Implementing Fractional Knapsack problem and Prim's / Kruskal's Minimum Spanning Tree."
    },
    {
      "number": 3,
      "title": "Dynamic Programming Lab",
      "syllabus": "Implementing 0/1 Knapsack, Longest Common Subsequence (LCS), and Matrix Chain Multiplication."
    },
    {
      "number": 4,
      "title": "Backtracking Lab",
      "syllabus": "Implementing 8-Queens problem, Subset Sum problem, and Graph Coloring."
    },
    {
      "number": 5,
      "title": "Shortest Path Algorithms Lab",
      "syllabus": "Implementing Dijkstra's single-source and Floyd-Warshall all-pairs shortest path algorithms."
    }
  ],
  "industrial-internship-assessment-1": [
    {
      "number": 1,
      "title": "Internship Certificate & Logbook",
      "syllabus": "Submitting verified company internship certificate, daily work logbook, and mentor evaluation."
    },
    {
      "number": 2,
      "title": "Technical Report Submission",
      "syllabus": "Drafting formal internship report covering organization profile, technology stack used, and project contribution."
    },
    {
      "number": 3,
      "title": "PowerPoint Presentation & Viva",
      "syllabus": "Delivering technical presentation before department faculty board and answering viva questions."
    }
  ],
  "software-engineering": [
    {
      "number": 1,
      "title": "Software Process Models & Agile Methods",
      "syllabus": "SDLC process models (Waterfall, Spiral, RAD), Agile methodology, Scrum framework, XP."
    },
    {
      "number": 2,
      "title": "Software Requirements Engineering",
      "syllabus": "Requirements Elicitation, SRS Document (IEEE std), Use Case diagrams, Requirements Validation."
    },
    {
      "number": 3,
      "title": "Software Design & Architecture",
      "syllabus": "Modularity, Cohesion & Coupling, UML diagrams (Class, Sequence, Activity), Architectural styles."
    },
    {
      "number": 4,
      "title": "Software Testing & Quality Assurance",
      "syllabus": "Black-box & White-box testing, Basis path testing, Cyclomatic complexity, Integration & System testing, SQA, CMMI."
    },
    {
      "number": 5,
      "title": "Software Project Management & Maintenance",
      "syllabus": "COCOMO estimation model, Risk Management, Software Maintenance types, Re-engineering."
    }
  ],
  "data-science-machine-learning": [
    {
      "number": 1,
      "title": "Data Preprocessing & EDA",
      "syllabus": "Data cleaning, Missing value imputation, Feature scaling (Normalization, Standardization), Categorical encoding, Exploratory Data Analysis (EDA)."
    },
    {
      "number": 2,
      "title": "Supervised Learning - Regression & Classification",
      "syllabus": "Linear Regression, Logistic Regression, Decision Trees (ID3, CART), Random Forests, Support Vector Machines (SVM), K-Nearest Neighbors (KNN)."
    },
    {
      "number": 3,
      "title": "Unsupervised Learning & Dimensionality Reduction",
      "syllabus": "K-Means Clustering, Hierarchical Clustering, Principal Component Analysis (PCA), Linear Discriminant Analysis (LDA)."
    },
    {
      "number": 4,
      "title": "Neural Networks & Deep Learning Basics",
      "syllabus": "Artificial Neural Networks (ANN), Perceptron, Multi-Layer Perceptron (MLP), Activation Functions, Backpropagation, Gradient Descent."
    },
    {
      "number": 5,
      "title": "Model Evaluation & Deployment",
      "syllabus": "Confusion Matrix, Precision, Recall, F1-Score, ROC-AUC curve, Cross-Validation, Deploying ML model using Flask/FastAPI."
    }
  ],
  "computer-graphics": [
    {
      "number": 1,
      "title": "Graphics Hardware & Line/Circle Algorithms",
      "syllabus": "Raster scan vs Vector scan displays, DDA Line algorithm, Bresenham's Line & Circle drawing algorithms, Midpoint Circle algorithm."
    },
    {
      "number": 2,
      "title": "2D Transformations & Clipping",
      "syllabus": "2D Translation, Scaling, Rotation, Reflection, Shear, Homogeneous coordinates, Cohen-Sutherland Line Clipping, Sutherland-Hodgman Polygon Clipping."
    },
    {
      "number": 3,
      "title": "3D Graphics & Transformations",
      "syllabus": "3D Translation, Scaling, Rotation about arbitrary axis, 3D Projections: Parallel (Orthographic, Oblique) and Perspective Projections."
    },
    {
      "number": 4,
      "title": "Curves & Visible Surface Detection",
      "syllabus": "Bezier curves, B-Spline curves properties, Visible Surface Detection: Depth-Buffer (Z-Buffer) algorithm, A-Buffer, Back-Face Culling, Scan-Line algorithm."
    },
    {
      "number": 5,
      "title": "Illumination Models & Shading",
      "syllabus": "Ambient, Diffuse, and Specular reflection models (Phong & Gouraud shading), Color models (RGB, CMYK, HSV), Computer Animation techniques."
    }
  ],
  "cloud-computing-elective": [
    {
      "number": 1,
      "title": "Cloud Computing Architecture & Models",
      "syllabus": "NIST Cloud model, Characteristics, Cloud Service Models (IaaS, PaaS, SaaS), Deployment Models (Public, Private, Hybrid, Community)."
    },
    {
      "number": 2,
      "title": "Virtualization Technology",
      "syllabus": "Virtualization hypervisors (Type 1 & Type 2), Full Virtualization vs Para-Virtualization, Containerization (Docker, Kubernetes)."
    },
    {
      "number": 3,
      "title": "Cloud Infrastructure (AWS/GCP/Azure)",
      "syllabus": "AWS EC2, S3 Storage, VPC Networking, GCP Compute Engine, Azure Virtual Machines, Auto-scaling, Load Balancing."
    },
    {
      "number": 4,
      "title": "Cloud Storage & Security",
      "syllabus": "Cloud storage architecture, Object storage vs Block storage, Cloud Security threats, Identity and Access Management (IAM), Encryption."
    },
    {
      "number": 5,
      "title": "Serverless & Future Trends",
      "syllabus": "Serverless computing (AWS Lambda), Cloud Edge computing, Multi-cloud management, Cloud economics."
    }
  ],
  "operations-research": [
    {
      "number": 1,
      "title": "Linear Programming & Simplex Method",
      "syllabus": "LPP formulation, Graphical solution, Standard LPP form, Simplex method, Big-M method, Two-phase method, Duality in LPP."
    },
    {
      "number": 2,
      "title": "Transportation & Assignment Problems",
      "syllabus": "Transportation Problem: Initial Basic Feasible Solution (North-West, Least Cost, VAM), MODI method for optimality.\nAssignment Problem: Hungarian method."
    },
    {
      "number": 3,
      "title": "Game Theory & Decision Analysis",
      "syllabus": "Two-person zero-sum games, Pure strategies (Saddle point), Mixed strategies, Dominance property, Graphical method for 2xn and mx2 games."
    },
    {
      "number": 4,
      "title": "Inventory Models & Queuing Theory",
      "syllabus": "Deterministic inventory models (EOQ model with/without shortages), Queuing models: Kendall's notation, M/M/1 queuing system performance metrics."
    },
    {
      "number": 5,
      "title": "Network Analysis (CPM & PERT)",
      "syllabus": "Network representation, Critical Path Method (CPM), Program Evaluation and Review Technique (PERT), Float calculations, Project crashing."
    }
  ],
  "software-engineering-lab": [
    {
      "number": 1,
      "title": "SRS Preparation Lab",
      "syllabus": "Writing IEEE standard Software Requirement Specification (SRS) for assigned project module."
    },
    {
      "number": 2,
      "title": "UML Use Case & Class Diagram",
      "syllabus": "Designing Use Case and Class diagrams using StarUML / Draw.io."
    },
    {
      "number": 3,
      "title": "UML Behavioral Diagrams",
      "syllabus": "Designing Sequence, Activity, and Statechart diagrams for system workflows."
    },
    {
      "number": 4,
      "title": "Test Case Design Lab",
      "syllabus": "Writing Test Cases for Equivalence Partitioning, Boundary Value Analysis, and Basis Path Testing."
    },
    {
      "number": 5,
      "title": "Automated Testing Practice",
      "syllabus": "Executing automated unit tests using Selenium / JUnit / Jest framework."
    }
  ],
  "data-science-machine-learning-lab": [
    {
      "number": 1,
      "title": "Pandas & NumPy Data Wrangling",
      "syllabus": "Loading dataset, handling missing values, filtering, and performing feature transformation using Pandas."
    },
    {
      "number": 2,
      "title": "Regression & Classification Models",
      "syllabus": "Building Linear Regression and Logistic Regression models using Scikit-Learn."
    },
    {
      "number": 3,
      "title": "Decision Trees & Random Forest",
      "syllabus": "Training Decision Tree and Random Forest classifiers and plotting Confusion Matrix."
    },
    {
      "number": 4,
      "title": "K-Means Clustering Lab",
      "syllabus": "Implementing K-Means clustering algorithm and finding optimal K using Elbow method."
    },
    {
      "number": 5,
      "title": "Deep Learning MLP in PyTorch",
      "syllabus": "Building a Multi-Layer Perceptron neural network for digit classification in PyTorch/TensorFlow."
    }
  ],
  "computer-graphics-lab": [
    {
      "number": 1,
      "title": "Line Drawing Algorithms in C",
      "syllabus": "C implementation of DDA and Bresenham Line Drawing algorithms."
    },
    {
      "number": 2,
      "title": "Circle & Ellipse Algorithms",
      "syllabus": "C implementation of Midpoint Circle and Midpoint Ellipse drawing algorithms."
    },
    {
      "number": 3,
      "title": "2D Transformation Lab",
      "syllabus": "Implementing 2D Translation, Rotation, and Scaling transformations on 2D polygons."
    },
    {
      "number": 4,
      "title": "Line Clipping Algorithms",
      "syllabus": "C implementation of Cohen-Sutherland Line Clipping algorithm."
    },
    {
      "number": 5,
      "title": "OpenGL 3D Graphics Basics",
      "syllabus": "Creating 3D Cube rendering and lighting effects using OpenGL / GLUT."
    }
  ],
  "seminar-professional-ethics": [
    {
      "number": 1,
      "title": "Topic Selection & Literature Survey",
      "syllabus": "Selecting emerging computing technology topic and performing literature review of IEEE IEEE/Springer papers."
    },
    {
      "number": 2,
      "title": "Technical Report Writing",
      "syllabus": "Drafting seminar technical report adhering to IEEE formatting standards."
    },
    {
      "number": 3,
      "title": "Presentation & Ethics Viva",
      "syllabus": "Delivering PowerPoint presentation before faculty committee and answering technical viva questions."
    }
  ],
  "artificial-intelligence": [
    {
      "number": 1,
      "title": "AI Introduction & Search Strategies",
      "syllabus": "Turing test, Agent architectures, Uninformed Search (BFS, DFS), Heuristic Search (A*, Greedy Best-First, Minimax)."
    },
    {
      "number": 2,
      "title": "Knowledge Representation & Logic",
      "syllabus": "Propositional Logic, First-Order Logic (FOL), Unification, Forward/Backward Chaining, Resolution refutation."
    },
    {
      "number": 3,
      "title": "Probabilistic Reasoning & Decision Making",
      "syllabus": "Bayesian Networks, Markov Decision Processes (MDP), Hidden Markov Models (HMM)."
    },
    {
      "number": 4,
      "title": "Machine Learning & Neural Nets",
      "syllabus": "Supervised vs Unsupervised learning, Decision Trees, Perceptron, Backpropagation."
    },
    {
      "number": 5,
      "title": "NLP & Expert Systems",
      "syllabus": "Natural Language Processing basics, Tokenization, Parsing, Expert System architecture (MYCIN)."
    }
  ],
  "cryptography-network-security": [
    {
      "number": 1,
      "title": "Symmetric Encryption & Block Ciphers",
      "syllabus": "Classical Encryption Techniques (Caesar, Playfair, Hill), Feistel Cipher structure, Data Encryption Standard (DES), Advanced Encryption Standard (AES), Block cipher modes of operation (ECB, CBC, CTR)."
    },
    {
      "number": 2,
      "title": "Asymmetric Encryption & Key Exchange",
      "syllabus": "Number theory basics (Prime numbers, Fermat's & Euler's theorems, Modular arithmetic), RSA algorithm, Diffie-Hellman Key Exchange, Elliptic Curve Cryptography (ECC)."
    },
    {
      "number": 3,
      "title": "Cryptographic Hash Functions & Digital Signatures",
      "syllabus": "Cryptographic Hash Functions (MD5, SHA-256, SHA-3), Message Authentication Codes (MAC), Digital Signature Standard (DSS), Digital Certificates (X.509)."
    },
    {
      "number": 4,
      "title": "Network & Transport Layer Security",
      "syllabus": "IPsec architecture (AH & ESP protocols), SSL/TLS protocol stack, HTTPS, Wireless Network Security (WEP, WPA2, WPA3), Email security (PGP, S/MIME)."
    },
    {
      "number": 5,
      "title": "System Security & Intrusions",
      "syllabus": "Intrusion Detection Systems (Host-based & Network-based IDS), Malicious software (Viruses, Worms, Rootkits), Firewalls (Packet filtering, Stateful, Application gateway)."
    }
  ],
  "deep-learning-neural-networks": [
    {
      "number": 1,
      "title": "Deep Learning Foundations & Perceptrons",
      "syllabus": "Biological vs Artificial Neuron, Single-layer Perceptron, Multi-Layer Perceptron (MLP), Activation Functions (Sigmoid, Tanh, ReLU, Softmax), Loss Functions, Optimization (SGD, Adam, RMSprop)."
    },
    {
      "number": 2,
      "title": "Convolutional Neural Networks (CNNs)",
      "syllabus": "CNN Architecture: Convolutional layers, Kernel/Filter, Stride, Padding, Pooling layers (Max, Average), Feature maps, LeNet-5, AlexNet, VGGNet, ResNet architectures."
    },
    {
      "number": 3,
      "title": "Recurrent Neural Networks (RNNs) & Sequence Models",
      "syllabus": "Recurrent Neural Networks (RNN), Vanishing/Exploding Gradient Problem, Long Short-Term Memory (LSTM) networks, Gated Recurrent Units (GRU), Sequence-to-Sequence models."
    },
    {
      "number": 4,
      "title": "Autoencoders & Generative Models",
      "syllabus": "Autoencoders architecture, Denoising Autoencoders, Variational Autoencoders (VAE), Generative Adversarial Networks (GANs): Generator and Discriminator training."
    },
    {
      "number": 5,
      "title": "Deep Learning Frameworks & Applications",
      "syllabus": "PyTorch & TensorFlow hands-on: Tensor operations, DataLoader, Model building, Object Detection (YOLO), Transfer Learning."
    }
  ],
  "entrepreneurship-development": [
    {
      "number": 1,
      "title": "Entrepreneurial Mindset & Innovation",
      "syllabus": "Concept of Entrepreneurship, Characteristics of successful entrepreneurs, Mindset, Innovation & Creativity, Design Thinking process."
    },
    {
      "number": 2,
      "title": "Opportunity Identification & Business Plan",
      "syllabus": "Business Opportunity Identification, Environmental Scanning, Feasibility Analysis (Technical, Financial, Market), Structuring a Business Plan."
    },
    {
      "number": 3,
      "title": "Financial Planning & Venture Capital",
      "syllabus": "Sources of Startup Finance: Bootstrapping, Angel Investors, Venture Capital, Crowdfunding, Break-even analysis, Financial statements."
    },
    {
      "number": 4,
      "title": "Marketing & Intellectual Property",
      "syllabus": "Startup Marketing strategies, Product positioning, Digital marketing, Intellectual Property Rights (IPR): Patents, Trademarks, Copyrights."
    },
    {
      "number": 5,
      "title": "Startup Ecosystem & Governance",
      "syllabus": "Government schemes (Make in India, Startup India), Incubation centers, Legal aspects of business registration, Exit strategies."
    }
  ],
  "artificial-intelligence-lab": [
    {
      "number": 1,
      "title": "Uninformed & Heuristic Search in Python",
      "syllabus": "Implementing BFS, DFS, and A* Search algorithms in Python for grid navigation."
    },
    {
      "number": 2,
      "title": "Game Playing Minimax Algorithm",
      "syllabus": "Implementing Minimax algorithm with Alpha-Beta pruning for Tic-Tac-Toe game."
    },
    {
      "number": 3,
      "title": "Constraint Satisfaction Problems",
      "syllabus": "Solving Cryptarithmetic puzzles and Map Coloring problem using Constraint Satisfaction."
    },
    {
      "number": 4,
      "title": "Bayesian Network Simulation",
      "syllabus": "Building Bayesian Network inference models using Python pgmpy library."
    },
    {
      "number": 5,
      "title": "Deep Learning CNN Classifier",
      "syllabus": "Training Convolutional Neural Network (CNN) in PyTorch for image classification."
    }
  ],
  "major-project-stage-1": [
    {
      "number": 1,
      "title": "Problem Definition & Literature Survey",
      "syllabus": "Identifying real-world problem statement, conducting literature survey across high-impact research papers."
    },
    {
      "number": 2,
      "title": "System Architecture & SRS",
      "syllabus": "Formulating system architecture, data flow diagrams, database design, and technical specifications."
    },
    {
      "number": 3,
      "title": "Prototype Demo & Stage-1 Defense",
      "syllabus": "Developing preliminary working prototype and presenting project progress report before evaluation panel."
    }
  ],
  "industrial-training-assessment-2": [
    {
      "number": 1,
      "title": "Training Completion Certificate",
      "syllabus": "Submission of 6-week summer industrial training completion certificate from recognized IT industry."
    },
    {
      "number": 2,
      "title": "Technical Project Report",
      "syllabus": "Submission of comprehensive industrial training project report detailing tools, technologies, and code modules."
    },
    {
      "number": 3,
      "title": "PowerPoint Seminar & Viva",
      "syllabus": "Presentation of technical work performed during training and responding to faculty panel viva voce."
    }
  ],
  "high-performance-computing": [
    {
      "number": 1,
      "title": "Parallel Architecture & Flynn's Taxonomy",
      "syllabus": "Implicit Parallelism, Pipeline hazards, Memory hierarchy, Flynn's Taxonomy (SISD, SIMD, MISD, MIMD), Shared Memory vs Distributed Memory Architectures."
    },
    {
      "number": 2,
      "title": "Shared Memory Programming with OpenMP",
      "syllabus": "OpenMP execution model, Compiler directives, Parallel regions, Work-sharing constructs (for, sections), Data environment (private, shared, reduction), Synchronization (critical, atomic, barrier)."
    },
    {
      "number": 3,
      "title": "Distributed Memory Programming with MPI",
      "syllabus": "Message Passing Interface (MPI) primitives, MPI_Init, MPI_Comm_rank, MPI_Send, MPI_Recv, Collective Communications (MPI_Bcast, MPI_Reduce, MPI_Scatter, MPI_Gather)."
    },
    {
      "number": 4,
      "title": "GPU Computing with CUDA",
      "syllabus": "GPU Architecture, Heterogeneous computing, CUDA Thread Hierarchy (Threads, Blocks, Grids), Memory architecture (Global, Shared, Constant memory), Writing CUDA Kernels."
    },
    {
      "number": 5,
      "title": "Parallel Performance Metrics & Applications",
      "syllabus": "Speedup, Efficiency, Amdahl's Law, Gustafson's Law, Parallel Matrix Multiplication, Parallel Sorting algorithms, Cluster Computing overview."
    }
  ],
  "big-data-analytics": [
    {
      "number": 1,
      "title": "Big Data Architecture & Ecosystem",
      "syllabus": "Big Data characteristics (5 Vs), Big Data Architecture, Distributed Systems fundamentals, Overview of Hadoop Ecosystem."
    },
    {
      "number": 2,
      "title": "Hadoop Distributed File System (HDFS)",
      "syllabus": "HDFS Architecture: NameNode, DataNode, Secondary NameNode, Block replication, Data Read/Write pipeline, HDFS CLI commands."
    },
    {
      "number": 3,
      "title": "MapReduce Programming Framework",
      "syllabus": "MapReduce Execution Model: Mapper, Reducer, Combiner, Partitioner, Writing MapReduce programs in Java/Python for word count and log analysis."
    },
    {
      "number": 4,
      "title": "Apache Spark & Real-Time Processing",
      "syllabus": "Apache Spark Architecture, Resilient Distributed Datasets (RDD), Spark SQL, DataFrames, Spark Streaming, Comparison with MapReduce."
    },
    {
      "number": 5,
      "title": "NoSQL Databases & Graph Analytics",
      "syllabus": "NoSQL Database types (Key-Value, Document, Column-family, Graph), HBase, Cassandra, MongoDB, Graph Analytics with Spark GraphX."
    }
  ],
  "major-project-stage-2": [
    {
      "number": 1,
      "title": "Full System Implementation",
      "syllabus": "Complete coding implementation of software modules, frontend/backend integration, database connection."
    },
    {
      "number": 2,
      "title": "Experimental Verification & Testing",
      "syllabus": "Conducting unit testing, integration testing, system performance evaluation, bench-marking results."
    },
    {
      "number": 3,
      "title": "Dissertation Thesis & Grand Defense",
      "syllabus": "Drafting final project dissertation thesis document, submitting plagiarism report, delivering grand defense demonstration."
    }
  ],
  "comprehensive-viva-seminar": [
    {
      "number": 1,
      "title": "Core Computer Science Fundamentals Review",
      "syllabus": "Oral review of Data Structures, Operating Systems, Database Systems, Computer Networks, Algorithm Design."
    },
    {
      "number": 2,
      "title": "Technical Seminar Presentation",
      "syllabus": "Presentation on recent industry trends, cloud architecture, AI developments before external university examiner."
    },
    {
      "number": 3,
      "title": "Grand Viva Voce Examination",
      "syllabus": "Comprehensive oral examination covering 4-year engineering coursework, project contributions, and core domain knowledge."
    }
  ]
};
