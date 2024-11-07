import React from 'react';

const METRICS = [
  { label: 'Active Users', value: '50K+' },
  { label: 'Words Learned', value: '2M+' },
  { label: 'Success Rate', value: '94%' },
  { label: 'Languages', value: '10+' }
];

export function MetricsSection() {
  return (
    <section className="py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {METRICS.map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 text-transparent bg-clip-text mb-2">
                {value}
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}