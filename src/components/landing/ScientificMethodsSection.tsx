import React from 'react';
import { 
  Repeat, Layers, Zap, Gauge, 
  Lightbulb, LineChart, BookOpen 
} from 'lucide-react';

const SCIENTIFIC_METHODS = [
  {
    icon: Repeat,
    title: 'SuperMemo-2 Algorithm',
    description: 'Our spaced repetition system optimizes review intervals based on your performance, ensuring 95% retention rate',
    research: 'Based on Hermann Ebbinghaus\' Forgetting Curve research',
    color: 'from-blue-500 to-indigo-500'
  },
  {
    icon: Layers,
    title: 'Interleaved Practice',
    description: 'Mix different word categories to strengthen neural pathways and improve long-term retention by up to 300%',
    research: 'Validated by Robert Bjork\'s desirable difficulties studies',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Zap,
    title: 'Active Recall',
    description: 'Engage in challenging retrieval practice that doubles memory retention compared to passive review',
    research: 'Proven by Karpicke & Roediger\'s testing effect studies',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: Gauge,
    title: 'Adaptive Difficulty',
    description: 'Dynamic difficulty adjustment keeps you in the optimal learning zone, increasing engagement by 45%',
    research: 'Based on Mihaly Csikszentmihalyi\'s Flow Theory',
    color: 'from-purple-500 to-pink-500'
  }
];

const LEARNING_TECHNIQUES = [
  {
    icon: Lightbulb,
    title: 'Cognitive Load Optimization',
    description: 'Carefully structured practice sessions that prevent mental fatigue and maximize learning efficiency',
    stat: '37% faster learning'
  },
  {
    icon: LineChart,
    title: 'Errorful Learning',
    description: 'Strategic introduction of challenges that enhance memory formation and recall',
    stat: '2.5x better retention'
  },
  {
    icon: BookOpen,
    title: 'Contextual Learning',
    description: 'Learn words in meaningful contexts that mirror real-world usage',
    stat: '89% better application'
  }
];

export function ScientificMethodsSection() {
  return (
    <section id="science" className="py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Backed by Cognitive Science
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our learning methods are based on decades of research in cognitive psychology and neuroscience,
            proven to accelerate vocabulary acquisition and retention.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {SCIENTIFIC_METHODS.map(({ icon: Icon, title, description, research, color }) => (
            <div key={title} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-500 dark:group-hover:opacity-10"
                   style={{ backgroundImage: `linear-gradient(to right, var(--${color}))` }}></div>
              <div className="relative z-10">
                <div className="text-primary-500 mb-4">
                  <Icon size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
                  {description}
                </p>
                <p className="text-sm text-primary-500 dark:text-primary-400 font-medium">
                  {research}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {LEARNING_TECHNIQUES.map(({ icon: Icon, title, description, stat }) => (
            <div key={title} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="text-secondary-500 mb-4">
                <Icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {description}
              </p>
              <div className="text-lg font-bold bg-gradient-to-r from-primary-500 to-secondary-500 text-transparent bg-clip-text">
                {stat}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}