/* ==========================================================================
   data.js  —  EDIT THIS FILE to customise your whole portfolio.
   Everything on the page (text, links, images, agent comments) comes from here.
   ========================================================================== */
window.PORTFOLIO = {
  name: "Sayan De Karmakar",
  nameLine1: "SAYAN DE",
  nameLine2: "KARMAKAR",
  role: "Electrical Engineer",
  taglines: [
    "Electrical Engineer",
    "Siemens Scholar",
    "PLC & Industrial Automation",
    "Power Electronics · IoT · Embedded"
  ],
  email: "sayandekarmakar2020@gmail.com",
  phone: "+91 9933103342",
  location: "West Bengal, India",

  /* ---- LINKS (change these) ---- */
  links: {
    linkedin: "https://www.linkedin.com/in/sayan-de-karmakar",
    github: "",                       // e.g. "https://github.com/yourname"  (leave "" to hide)
    resume: "assets/resume/Sayan_De_Karmakar_Resume.pdf"
  },

  /* ---- MUSIC: replace assets/audio/music.mp3 with your own song (same name) ---- */
  music: "assets/audio/music.mp3",

  /* ---- HERO PROFILE ----
     The round profile plays image frames step by step (like a tiny flip-book video).
     Put your images in assets/images/profile/ named frame-01.jpg, frame-02.jpg ...
     then set ext:"jpg" and count to the number of images. fps = frames per second.
     OR set `video` to a path (e.g. "assets/video/profile.mp4") to use a video instead. */
  hero: {
    frames: { folder: "assets/images/profile/", prefix: "frame-", pad: 2, ext: "svg", count: 8, fps: 6, start: 1 },
    video: "assets/video/profile.mp4",
    highlights: [
      { k: "7.73", v: "CGPA · B.Tech EE" },
      { k: "Top 200", v: "Siemens Scholar" },
      { k: "100%", v: "IEC compliance QA" },
      { k: "TIA Portal", v: "PLC programming" },
      { k: "5", v: "Projects built" },
      { k: "IEEE", v: "Conference paper goal" },
      { k: "3", v: "Languages spoken" }
    ]
  },

  /* ---- ABOUT ---- */
  about: {
    title: "Powering ideas with <em>circuits</em> & code.",
    paragraphs: [
      "I'm an Electrical Engineer (B.Tech, Ramkrishna Mahato Government Engineering College, 2022–2026) with a hands-on bent for industrial automation, power electronics and embedded systems.",
      "I was selected as a <strong>Siemens Scholar</strong> — one of the top 200 students in India under the German Dual Education System — and have trained on Siemens TIA Portal, SIMATIC STEP 7, pneumatic & hydraulic control and mechatronics. Most recently I interned at C&S Electric (Siemens) working with QA and R&D on contactors, relays and control panels.",
      "I like projects where hardware meets software: robots, wireless tracking, wearables and EV charging power-quality."
    ],
    stats: [
      { value: 7.73, decimals: 2, label: "CGPA · B.Tech EE" },
      { value: 88.6, decimals: 1, suffix: "%", label: "Senior Secondary" },
      { value: 4, label: "Trainings & internship" },
      { value: 5, label: "Projects" }
    ],
    skills: [
      { group: "Core Areas", items: ["Mechatronics (Basic + Advanced)", "Circuit Design", "Power Systems", "Electrical Machines", "Power Electronics", "Instrumentation & Troubleshooting"] },
      { group: "Tools & Technologies", items: ["MATLAB / Simulink", "TIA Portal", "PLC Programming", "SolidWorks", "Solid Edge", "Raspberry Pi", "Arduino Uno", "VS Code", "MS Office"] },
      { group: "Programming", items: ["C (Basic)", "C++ (Basic)", "Python (Basic)", "Arduino (Basic)"] },
      { group: "Soft Skills", items: ["Leadership", "Communication", "Teamwork", "Problem-solving"] }
    ],
    languages: ["English", "Hindi", "Bengali (Native)"]
  },

  /* ---- EDUCATION ---- */
  education: [
    {
      school: "Ramkrishna Mahato Government Engineering College",
      place: "Purulia, West Bengal",
      degree: "Bachelor of Technology in Electrical Engineering",
      score: "CGPA 7.73",
      years: "Aug 2022 – May 2026",
      icon: "graduation"
    },
    {
      school: "Kenjakura Molebona High School",
      place: "Bankura, West Bengal",
      degree: "Senior Secondary (W.B.C.H.S.E)",
      score: "88.60%",
      years: "2022",
      icon: "book"
    },
    {
      school: "Kenjakura Molebona High School",
      place: "Bankura, West Bengal",
      degree: "Secondary (W.B.B.S.E)",
      score: "87.75%",
      years: "2020",
      icon: "book"
    }
  ],

  /* ---- EXPERIENCE & TRAINING ----
     `link` = where the "View on LinkedIn" button goes. Change per card if you like. */
  experience: [
    {
      role: "Intern",
      org: "C&S Electric Limited (under Siemens)",
      place: "Noida, UP",
      date: "Jun 2025 – Aug 2025",
      points: [
        "Collaborated with a QA team to monitor production of contactors, relays, starters, signalling devices & control panels — ensuring 100% compliance with IEC standards.",
        "Gained a complete understanding of assembly lines; ran failure diagnostics and root-cause evaluations together with the R&D department."
      ],
      tags: ["QA", "IEC Standards", "Control Panels", "Root-cause analysis"],
      link: "https://www.linkedin.com/in/sayan-de-karmakar"
    },
    {
      role: "Advanced Mechatronics Training",
      org: "Siemens SMSCP, GGSF",
      place: "Nashik, MH",
      date: "Dec 2024",
      points: [
        "Trained in Siemens TIA Portal (V14) and SIMATIC STEP 7 for PLC programming and control-logic implementation.",
        "Designed pneumatic, electro-pneumatic and hydraulic control circuits using FluidSIM and Digikit.",
        "Applied advanced troubleshooting techniques on real-life diagnostic simulations."
      ],
      tags: ["TIA Portal V14", "STEP 7", "FluidSIM", "PLC"],
      link: "https://www.linkedin.com/in/sayan-de-karmakar"
    },
    {
      role: "Basic Mechatronics Industrial Automation Training",
      org: "GGSF",
      place: "Nashik, MH",
      date: "Jul 2024",
      points: [
        "Studied and implemented pneumatic & hydraulic control systems across 5 industrial automation stations.",
        "Hands-on with PLCs, sensors and automation principles.",
        "Practised ladder logic, Sequential Function Charts (SFC) and Data Structure Diagrams (DSD)."
      ],
      tags: ["Ladder Logic", "SFC", "Sensors", "Pneumatics"],
      link: "https://www.linkedin.com/in/sayan-de-karmakar"
    },
    {
      role: "Basic Mechanical & Electrical Training (STA)",
      org: "Siemens",
      place: "Airoli, Navi Mumbai",
      date: "Dec 2024",
      points: [
        "Learned fundamentals of electrical systems, motors & drives, basic electronics and electrical measuring instruments.",
        "Hands-on with mechanical tools, machining, welding, hydraulics & pneumatics."
      ],
      tags: ["Motors & Drives", "Electronics", "Welding", "Hydraulics"],
      link: "https://www.linkedin.com/in/sayan-de-karmakar"
    }
  ],

  /* ---- PROJECTS ---- image: put your photo in assets/images/projects/ and change the path ---- */
  projects: [
    {
      title: "Multifunctional Arduino Car",
      stack: ["Arduino UNO", "Bluetooth", "Ultrasonic", "Servo"],
      image: "assets/images/projects/p1.svg",
      summary: "Voice, smartphone and autonomous control — real-time obstacle avoidance.",
      points: [
        "Built an Arduino UNO robotic car with voice, smartphone and autonomous control using Bluetooth, an ultrasonic sensor and a servo motor.",
        "Showcased in Robo Racing, demonstrating embedded system design and real-time obstacle avoidance."
      ],
      status: "Completed",
      link: ""
    },
    {
      title: "Real-Time Location Tracking",
      stack: ["ESP32", "Arduino Uno", "Wireless"],
      image: "assets/images/projects/p2.svg",
      summary: "ESP32-based tracker streaming live data to a central server.",
      points: [
        "Engineered a location tracking system using ESP32 and Arduino Uno for real-time data transmission to a central server.",
        "Applied wireless communication and system-integration techniques in microcontroller programming."
      ],
      status: "Completed",
      link: ""
    },
    {
      title: "Virtual Computing & Automation",
      stack: ["Raspberry Pi", "Python", "MobaXterm"],
      image: "assets/images/projects/p3.svg",
      summary: "Remote virtual-machine access and IoT automation on a Raspberry Pi.",
      points: [
        "Set up a Raspberry Pi for remote virtual machine access and automation using Python and MobaXterm.",
        "Gained experience in virtualization, automation and scripting for IoT-based applications."
      ],
      status: "Completed",
      link: ""
    },
    {
      title: "Smart Heart Monitoring System",
      stack: ["Biomedical Sensors", "Wearable", "Data analysis"],
      image: "assets/images/projects/p4.svg",
      summary: "Wearable real-time heart-rate monitor with automated alerts.",
      points: [
        "Designed a wearable device for real-time heart-rate monitoring using biomedical sensors and data analysis.",
        "Aimed to detect irregular patterns and trigger automated alerts for early medical response."
      ],
      status: "Completed",
      link: ""
    },
    {
      title: "EV Charging & Power Factor Correction",
      stack: ["Boost PFC Converter", "Power Electronics", "Simulation"],
      image: "assets/images/projects/p5.svg",
      summary: "Single-phase boost PFC converter for efficient EV charging.",
      points: [
        "Developing a single-phase boost Power Factor Correction (PFC) converter to optimise EV charging.",
        "Implementing advanced PFC techniques to improve power quality and minimise grid-side losses.",
        "Analysing system performance with the goal of publishing findings at an IEEE conference."
      ],
      status: "In progress",
      link: ""
    }
  ],

  /* ---- ACHIEVEMENTS (the 3D scroll gallery) ----
     Replace each `image` with a photo of your certificate / award (jpg/png/webp). Add or remove items freely. */
  achievements: [
    { title: "Siemens Scholar", desc: "Top 200 students from India, selected under the German Dual Education System.", image: "assets/images/achievements/a01.svg" },
    { title: "WBJEE Qualified", desc: "Qualified the West Bengal Joint Entrance Examination (2022).", image: "assets/images/achievements/a02.svg" },
    { title: "Siemens STA Certificate", desc: "Basic Mechanical and Electrical Training (2024).", image: "assets/images/achievements/a03.svg" },
    { title: "Solid Edge — Associate", desc: "Siemens Solid Edge certification.", image: "assets/images/achievements/a04.svg" },
    { title: "Solid Edge — Professional", desc: "Siemens Solid Edge certification.", image: "assets/images/achievements/a05.svg" },
    { title: "Solid Edge — Expert", desc: "Siemens Solid Edge certification.", image: "assets/images/achievements/a06.svg" },
    { title: "Siemens Mechatronics — Basic", desc: "Basic mechatronics & industrial automation certification.", image: "assets/images/achievements/a07.svg" },
    { title: "Siemens Mechatronics — Advanced", desc: "TIA Portal, STEP 7, electro-pneumatic & hydraulic control.", image: "assets/images/achievements/a08.svg" },
    { title: "Internship · C&S Electric (Siemens)", desc: "QA & R&D internship, Noida (Jun–Aug 2025).", image: "assets/images/achievements/a09.svg" },
    { title: "Robo Racing", desc: "Showcased the Multifunctional Arduino Car.", image: "assets/images/achievements/a10.svg" }
  ],

  /* ---- HOBBIES (placeholders — edit to your real interests) ---- */
  hobbies: [
    { title: "Robotics & Arduino", text: "Building small bots and sensor gadgets on the weekend.", icon: "cpu" },
    { title: "Circuit Simulation", text: "Tinkering with converters and drives in MATLAB / Simulink.", icon: "zap" },
    { title: "Industrial Automation", text: "PLC ladder logic, pneumatics and control puzzles.", icon: "wrench" },
    { title: "Music", text: "The right playlist is part of every good debug session.", icon: "music" },
    { title: "Learning New Tech", text: "Reading about EVs, power quality and embedded systems.", icon: "book" },
    { title: "Travelling", text: "Exploring new places and industries.", icon: "compass" }
  ],

  /* ---- AI AGENT "Volt" ---- */
  agent: {
    name: "Volt",
    greeting: "Hi, I'm Volt — Sayan's AI guide! I'll tag along with your cursor. Click me or press / to chat.",
    sections: {
      home: "Welcome! This is Sayan's portfolio. Tap the profile to play music, or ride the card wheel below.",
      about: "This is about Sayan — an electrical engineer and Siemens Scholar who loves automation.",
      education: "Education: B.Tech in Electrical Engineering, CGPA 7.73. Strong school scores too!",
      experience: "Experience: a Siemens-group internship plus hands-on PLC & mechatronics training. Drag the cards!",
      projects: "Projects! Scroll to rotate the ribbon — click any card for details.",
      achievements: "Achievements — scroll to fly through the gallery. Siemens Scholar is the big one.",
      hobbies: "Hobbies — what Sayan does beyond the lab. Hover the tiles!",
      contact: "Want to work together? Say hi here or jump to LinkedIn."
    }
  }
};
