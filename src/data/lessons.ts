import { Lesson } from '../types/learning';

export const LESSONS: Lesson[] = [
  // Spanish Lessons
  {
    id: 'es-l1',
    unitId: 'es-u1',
    title: 'Basic Greetings',
    description: 'Learn simple ways to say hello and goodbye in Spanish.',
    order: 1,
    xpReward: 10,
    estimatedMinutes: 3,
    goals: [
      { title: 'Say Hello', description: 'Greet people politely in Spanish' },
      { title: 'Say Goodbye', description: 'Bid farewell to friends and family' }
    ],
    vocabulary: [
      { word: 'Hola', translation: 'Hello', pronunciation: 'OH-lah', emoji: '👋' },
      { word: 'Adiós', translation: 'Goodbye', pronunciation: 'ah-DYOHS', emoji: '👋' },
      { word: 'Gracias', translation: 'Thank you', pronunciation: 'GRAH-see-as', emoji: '🙏' }
    ],
    phrases: [
      { text: '¡Hola! ¿Cómo estás?', translation: 'How are you?', pronunciation: 'OH-lah KOH-moh ess-TAHS' },
      { text: 'Muchas gracias', translation: 'Thank you very much', pronunciation: 'MOO-chas GRAH-see-as' }
    ],
    activities: [
      {
        id: 'es-l1-a1',
        type: 'multiple-choice',
        question: 'How do you say "Hello" in Spanish?',
        options: ['Hola', 'Adiós', 'Gracias', 'Por favor'],
        correctAnswer: 'Hola'
      },
      {
        id: 'es-l1-a2',
        type: 'translate',
        question: 'Translate: "Gracias"',
        options: ['Thank you', 'Please', 'Hello', 'Goodbye'],
        correctAnswer: 'Thank you'
      },
      {
        id: 'es-l1-a3',
        type: 'vocabulary',
        question: 'What is the pronunciation for "Hola"?',
        correctAnswer: 'OH-lah'
      },
      {
        id: 'es-l1-a4',
        type: 'listen',
        question: 'Listen and select the correct word',
        options: ['Hola', 'Adiós', 'Gracias'],
        correctAnswer: 'Hola'
      }
    ],
    aiTeacherPrompt: {
      characterName: 'Luna',
      systemPrompt: 'You are Luna, an encouraging Spanish teacher. Help the student practice basic greetings and pronunciation.',
      introMessage: '¡Hola! I am Luna. Let us practice Spanish greetings together today!',
      topics: ['Greetings', 'Polite expressions', 'Self introduction']
    }
  },
  {
    id: 'es-l2',
    unitId: 'es-u1',
    title: 'Essential Phrases',
    description: 'Master polite everyday expressions in Spanish.',
    order: 2,
    xpReward: 15,
    estimatedMinutes: 4,
    goals: [
      { title: 'Be Polite', description: 'Use please and thank you effectively' }
    ],
    vocabulary: [
      { word: 'Por favor', translation: 'Please', pronunciation: 'por fah-VOR', emoji: '🙏' },
      { word: 'De nada', translation: 'You are welcome', pronunciation: 'deh NAH-dah', emoji: '😊' }
    ],
    phrases: [
      { text: 'Por favor y gracias', translation: 'Please and thank you', pronunciation: 'por fah-VOR ee GRAH-see-as' }
    ],
    activities: [
      {
        id: 'es-l2-a1',
        type: 'multiple-choice',
        question: 'What does "Por favor" mean?',
        options: ['Please', 'Thank you', 'Excuse me', 'Sorry'],
        correctAnswer: 'Please'
      }
    ],
    aiTeacherPrompt: {
      characterName: 'Luna',
      systemPrompt: 'You are Luna. Practice polite conversational Spanish.',
      introMessage: '¡Hola! Ready to practice polite expressions?',
      topics: ['Politeness', 'Asking nicely']
    }
  },
  {
    id: 'es-l3',
    unitId: 'es-u1',
    title: 'Introducing Yourself',
    description: 'Learn to share your name and ask others theirs.',
    order: 3,
    xpReward: 15,
    estimatedMinutes: 4,
    goals: [
      { title: 'Introduce Yourself', description: 'State your name with confidence' }
    ],
    vocabulary: [
      { word: 'Me llamo', translation: 'My name is', pronunciation: 'meh YAH-moh', emoji: '🗣️' }
    ],
    phrases: [
      { text: '¿Cómo te llamas?', translation: 'What is your name?', pronunciation: 'KOH-moh teh YAH-mas' }
    ],
    activities: [
      {
        id: 'es-l3-a1',
        type: 'translate',
        question: 'Translate: "¿Cómo te llamas?"',
        correctAnswer: 'What is your name?'
      }
    ],
    aiTeacherPrompt: {
      characterName: 'Luna',
      systemPrompt: 'You are Luna. Help students practice introducing themselves in Spanish.',
      introMessage: '¡Hola! ¿Cómo te llamas?',
      topics: ['Introductions', 'Names']
    }
  },

  // French Lessons
  {
    id: 'fr-l1',
    unitId: 'fr-u1',
    title: 'Bonjour & Basics',
    description: 'Learn initial French greetings and introductions.',
    order: 1,
    xpReward: 10,
    estimatedMinutes: 3,
    goals: [
      { title: 'Basic Greetings', description: 'Say hello and goodbye in French' }
    ],
    vocabulary: [
      { word: 'Bonjour', translation: 'Hello / Good morning', pronunciation: 'bon-ZHOOR', emoji: '☀️' },
      { word: 'Merci', translation: 'Thank you', pronunciation: 'mair-SEE', emoji: '🙏' }
    ],
    phrases: [
      { text: 'Bonjour, comment allez-vous ?', translation: 'Hello, how are you?', pronunciation: 'bon-ZHOOR koh-mahn tah-lay VOO' }
    ],
    activities: [
      {
        id: 'fr-l1-a1',
        type: 'multiple-choice',
        question: 'How do you say "Hello" in French?',
        options: ['Bonjour', 'Merci', 'Au revoir', 'S\'il vous plaît'],
        correctAnswer: 'Bonjour'
      }
    ],
    aiTeacherPrompt: {
      characterName: 'Claire',
      systemPrompt: 'You are Claire, an elegant French tutor. Guide students through conversational French.',
      introMessage: 'Bonjour ! I am Claire. Let us learn French together.',
      topics: ['French greetings', 'Politeness']
    }
  },
  {
    id: 'fr-l2',
    unitId: 'fr-u1',
    title: 'Polite Expressions',
    description: 'Learn how to thank someone and say goodbye in French.',
    order: 2,
    xpReward: 10,
    estimatedMinutes: 3,
    goals: [
      { title: 'Express Gratitude', description: 'Thank others in French' }
    ],
    vocabulary: [
      { word: 'Au revoir', translation: 'Goodbye', pronunciation: 'oh ruh-VWAR', emoji: '👋' }
    ],
    phrases: [
      { text: 'Merci beaucoup !', translation: 'Thank you very much!', pronunciation: 'mair-SEE boh-KOO' }
    ],
    activities: [
      {
        id: 'fr-l2-a1',
        type: 'translate',
        question: 'Translate: "Au revoir"',
        correctAnswer: 'Goodbye'
      }
    ],
    aiTeacherPrompt: {
      characterName: 'Claire',
      systemPrompt: 'You are Claire. Practice polite French conversations.',
      introMessage: 'Bonjour ! Ready for French basics?',
      topics: ['Greetings', 'Saying goodbye']
    }
  },

  // Japanese Lessons
  {
    id: 'ja-l1',
    unitId: 'ja-u1',
    title: 'Konnichiwa & Greetings',
    description: 'Learn foundational Japanese greetings.',
    order: 1,
    xpReward: 10,
    estimatedMinutes: 3,
    goals: [
      { title: 'Japanese Greetings', description: 'Greet people in Japanese' }
    ],
    vocabulary: [
      { word: 'こんにちは (Konnichiwa)', translation: 'Hello / Good afternoon', pronunciation: 'kohn-nee-chee-wah', emoji: '🎌' },
      { word: 'ありがとう (Arigatou)', translation: 'Thank you', pronunciation: 'ah-ree-gah-toh', emoji: '🙏' }
    ],
    phrases: [
      { text: 'こんにちは！お元気ですか？', translation: 'Hello! How are you?', pronunciation: 'kohn-nee-chee-wah oh-gen-kee des-kah' }
    ],
    activities: [
      {
        id: 'ja-l1-a1',
        type: 'multiple-choice',
        question: 'What does "Konnichiwa" mean?',
        options: ['Hello', 'Goodbye', 'Thank you', 'Sorry'],
        correctAnswer: 'Hello'
      }
    ],
    aiTeacherPrompt: {
      characterName: 'Yuki',
      systemPrompt: 'You are Yuki, a friendly Japanese language guide. Practice conversational Japanese with warm feedback.',
      introMessage: 'Konnichiwa! I am Yuki. Let us practice Japanese greetings!',
      topics: ['Japanese greetings', 'Cultural etiquette']
    }
  },
  {
    id: 'ja-l2',
    unitId: 'ja-u1',
    title: 'Saying Thank You',
    description: 'Express gratitude in Japanese.',
    order: 2,
    xpReward: 10,
    estimatedMinutes: 3,
    goals: [
      { title: 'Saying Thanks', description: 'Use Arigatou in conversation' }
    ],
    vocabulary: [
      { word: 'さようなら (Sayounara)', translation: 'Goodbye', pronunciation: 'sah-yoh-nah-rah', emoji: '👋' }
    ],
    phrases: [
      { text: 'どうもありがとう', translation: 'Thank you very much', pronunciation: 'doh-moh ah-ree-gah-toh' }
    ],
    activities: [
      {
        id: 'ja-l2-a1',
        type: 'translate',
        question: 'Translate: "Arigatou"',
        correctAnswer: 'Thank you'
      }
    ],
    aiTeacherPrompt: {
      characterName: 'Yuki',
      systemPrompt: 'You are Yuki. Help students learn Japanese polite phrases.',
      introMessage: 'Konnichiwa! Let us continue practicing Japanese.',
      topics: ['Gratitude', 'Polite Japanese']
    }
  },

  // German Lessons
  {
    id: 'de-l1',
    unitId: 'de-u1',
    title: 'Hallo & Basics',
    description: 'Learn basic German greetings.',
    order: 1,
    xpReward: 10,
    estimatedMinutes: 3,
    goals: [
      { title: 'German Greetings', description: 'Say hello in German' }
    ],
    vocabulary: [
      { word: 'Hallo', translation: 'Hello', pronunciation: 'HAH-loh', emoji: '👋' },
      { word: 'Danke', translation: 'Thank you', pronunciation: 'DAHN-kuh', emoji: '🙏' }
    ],
    phrases: [
      { text: 'Hallo! Wie geht\'s?', translation: 'Hello! How are you?', pronunciation: 'HAH-loh vee GAYTS' }
    ],
    activities: [
      {
        id: 'de-l1-a1',
        type: 'multiple-choice',
        question: 'How do you say "Hello" in German?',
        options: ['Hallo', 'Danke', 'Tschüss', 'Bitte'],
        correctAnswer: 'Hallo'
      }
    ],
    aiTeacherPrompt: {
      characterName: 'Max',
      systemPrompt: 'You are Max, an engaging German instructor. Practice German vocabulary and conversation.',
      introMessage: 'Hallo! I am Max. Welcome to your German lesson!',
      topics: ['German greetings', 'Everyday German']
    }
  },
  {
    id: 'de-l2',
    unitId: 'de-u1',
    title: 'Saying Goodbye',
    description: 'Learn how to bid farewell in German.',
    order: 2,
    xpReward: 10,
    estimatedMinutes: 3,
    goals: [
      { title: 'Bid Farewell', description: 'Say goodbye in German' }
    ],
    vocabulary: [
      { word: 'Tschüss', translation: 'Goodbye', pronunciation: 'CHOOS', emoji: '👋' }
    ],
    phrases: [
      { text: 'Tschüss! Bis später!', translation: 'Goodbye! See you later!', pronunciation: 'CHOOS bees SHPAY-ter' }
    ],
    activities: [
      {
        id: 'de-l2-a1',
        type: 'translate',
        question: 'Translate: "Tschüss"',
        correctAnswer: 'Goodbye'
      }
    ],
    aiTeacherPrompt: {
      characterName: 'Max',
      systemPrompt: 'You are Max. Practice German greetings and farewells.',
      introMessage: 'Hallo! Ready for German farewells?',
      topics: ['Farewells', 'German practice']
    }
  }
];

export const getLessonsByUnitId = (unitId: string): Lesson[] => {
  return LESSONS.filter(l => l.unitId === unitId);
};

export const getLessonById = (id: string): Lesson | undefined => {
  return LESSONS.find(l => l.id === id);
};
