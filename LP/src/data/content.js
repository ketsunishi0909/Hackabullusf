export const socialLinks = [
  { href: 'https://discord.gg/GTu5DKZ2', base: 'discordlogo', ext: 'jpg', alt: 'Discord' },
  { href: 'https://www.instagram.com/hackabull/', base: 'instalogo', ext: 'jpg', alt: 'Instagram' },
  { href: 'https://www.linkedin.com/company/shpe-usf/', base: 'linkedinlogo', ext: 'jpg', alt: 'LinkedIn' },
];

export const navLinks = [
  { href: '#about', label: 'ABOUT' },
  { href: '#tracks', label: 'TRACKS' },
  { href: '#sponsors', label: 'SPONSORS' },
  { href: '#faq', label: 'FAQS' },
];

export const heroContent = {
  tagline: 'Ready for the show?',
  date: 'April 25-26',
  applyHref: 'https://luma.com/d7jhn2yp',
};

export const aboutContent = {
  title: 'ABOUT US',
  lead:
    "Join Hackabull 2026, the seventh edition of USF's flagship 36-hour hackathon where innovation meets community. Collaborate with passionate hackers, turn bold ideas into real projects, and explore cutting-edge technology through workshops, mentorship, and sponsor challenges.",
  pills: ['36-hours event', 'All meals provided', '200+ hackers'],
};

export const tracksContent = [
  {
    title: 'Tech for good',
    desc: 'Build technology that creates positive social impact and helps communities around the world.',
    base: 'techforgood',
    ext: 'jpg',
    alt: 'Tech for good',
  },
  {
    title: 'Art design',
    desc: 'Combine creativity and code to build visually stunning and innovative digital experiences.',
    base: 'artdesign',
    ext: 'jpg',
    alt: 'Art design',
  },
  {
    title: 'Hello world',
    desc: 'Perfect for beginners — build your first project and take your first steps into hacking.',
    base: 'helloworld',
    ext: 'jpg',
    alt: 'Hello world',
  },
  {
    title: 'Hardware',
    desc: 'Get hands-on with physical computing, circuits, and embedded systems to build real devices.',
    base: 'hardware',
    ext: 'jpg',
    alt: 'Hardware',
  },
];

export const galleryContent = {
  title: 'GALLERY',
  subtitle: 'Check out our 2025 hackathons!',
  caption: 'HACKABULL 2025 & HACKJAM 2025',
  slides: [
    { base: 'hackjam1', alt: 'Hackjam 2025' },
    { base: 'hackjam2', alt: 'Hackjam 2025' },
    { base: 'hackjam3', alt: 'Hackjam 2025' },
    { base: 'hackjam4', alt: 'Hackjam 2025' },
    { base: 'hackjam5', alt: 'Hackjam 2025' },
  ],
};

export const sponsorsContent = {
  title: 'Sponsors & Partners',
  grid: [
    { base: 'microsoftsponsor', ext: 'jpg', alt: 'Microsoft' },
    { base: 'Velerasponsor', ext: 'jpg', alt: 'Velera' },
    { base: 'PureButtonsponsor', ext: 'jpg', alt: 'Pure Button' },
    { base: 'robobullssponsor', ext: 'jpg', alt: 'Robobulls' },
    { base: 'sasesponsor', ext: 'jpg', alt: 'SASE' },
    { base: 'wicsesponsor', ext: 'jpg', alt: 'WICSE' },
  ],
};

export const faqContent = {
  title: 'FAQ',
  tabs: [
    { key: 'logistics', label: 'Food & Logistics' },
    { key: 'preparation', label: 'Preparation' },
    { key: 'volunteering', label: 'Volunteering & Sponsors' },
  ],
  items: [
    {
      cat: 'logistics',
      question: 'Will food be provided?',
      answer: 'Yes! Food, snacks, and drinks will be provided all throughout the event.',
    },
    {
      cat: 'logistics',
      question: 'Where can I sleep?',
      answer: 'Rooms will be provided for hackers to rest when needed.',
    },
    {
      cat: 'logistics',
      question: 'Do I need to stay for the entire event?',
      answer:
        "No, you are free to come and go as needed during the event. However, we encourage you to stay so you don't miss any of the fun!",
    },
    {
      cat: 'logistics',
      question: 'Can I register on the day of HackaBull VII?',
      answer: 'Yes, day-of registration will be available. However, we recommend registering early to secure your spot.',
    },
    {
      cat: 'logistics',
      question: 'I have more questions — how can I ask them?',
      answer: 'Feel free to ask on the',
      link: { href: 'https://discord.gg/GTu5DKZ2', label: 'HackaBull Discord' },
    },
    {
      cat: 'preparation',
      question: 'Do I need a team?',
      answer:
        'No, you do not need a team to participate. You can join solo and find teammates at the event. Teams are capped at 5 members.',
    },
    {
      cat: 'preparation',
      question: 'How can I find or join a team for HackaBull VII?',
      answer: 'You can find teammates in the',
      link: { href: 'https://discord.gg/GTu5DKZ2', label: 'HackaBull Discord' },
    },
    {
      cat: 'preparation',
      question: 'Should I come with a project idea ready?',
      answer:
        'No, you are not required to have a project idea beforehand. There will be time to brainstorm ideas and form teams at the start of the event.',
    },
    {
      cat: 'preparation',
      question: 'What should I bring?',
      answer:
        "Bring your ID, laptop, and charger — plus any gear you want to use. If you're staying overnight, grab a blanket and your essentials. Wear comfy clothes. We've got the food and Wi-Fi covered!",
    },
    {
      cat: 'preparation',
      question: 'What if I have no experience with coding or hackathons?',
      answer:
        'No experience is required! There will be a track specifically for beginners, as well as workshops and mentors at the event to help you succeed.',
    },
    {
      cat: 'volunteering',
      question: 'Who can volunteer at HackaBull VII?',
      answer:
        "We're looking for enthusiastic volunteers to help make HackaBull VII a success! Volunteers help with registration, logistics, mentoring, and various event activities. It's a great way to be part of the hackathon community and gain experience.",
    },
    {
      cat: 'volunteering',
      question: 'Do volunteers get any perks?',
      answer: 'Yes! Volunteers receive food throughout the event and exclusive SHPE merch.',
    },
    {
      cat: 'volunteering',
      question: 'How long do volunteers need to stay?',
      answer: "Volunteers will be assigned shifts, so you won't need to be there the entire time. We'll share the shift schedule closer to the event.",
    },
  ],
};
