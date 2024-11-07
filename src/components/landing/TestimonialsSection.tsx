import React from 'react';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Sarah M.',
    role: 'French Learner',
    content: "I've tried many apps, but Wordzy's approach to vocabulary retention is unique. My French has improved significantly!",
    rating: 5
  },
  {
    name: 'David K.',
    role: 'Spanish Enthusiast',
    content: 'The spaced repetition system really works. I can actually remember words long-term now.',
    rating: 5
  },
  {
    name: 'Maria L.',
    role: 'Language Teacher',
    content: 'I recommend Wordzy to all my students. The practice methods are scientifically sound.',
    rating: 5
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial) => (
            <div key={testimonial.name} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex gap-1 text-yellow-400 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} size={20} fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                "{testimonial.content}"
              </p>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {testimonial.name}
                </div>
                <div className="text-primary-500 text-sm">
                  {testimonial.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}