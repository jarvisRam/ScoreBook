import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg?: React.ComponentType<React.ComponentProps<'svg'>>;
  emoji?: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: '🏏 Multi-Sport Support',
    emoji: '🏏',
    description: (
      <>
        Supports 6 different sports: Cricket, American Football, Hockey, Soccer, Tennis, and Badminton.
        Each sport has custom score formats and display logic.
      </>
    ),
  },
  {
    title: '📱 Cross-Platform',
    emoji: '📱',
    description: (
      <>
        Single React Native codebase runs on iOS, Android, and Web. Built with Expo for rapid development
        and deployment across all platforms.
      </>
    ),
  },
  {
    title: '⚡ Real-Time Updates',
    emoji: '⚡',
    description: (
      <>
        Auto-polling for live matches with React Query. Comprehensive mock data for development and testing.
        Production-ready architecture for real API integration.
      </>
    ),
  },
  {
    title: '🧪 Test-Ready',
    emoji: '🧪',
    description: (
      <>
        Comprehensive testID coverage for E2E automation. Clear testing strategy with Jest, React Native
        Testing Library, and Detox support.
      </>
    ),
  },
  {
    title: '🏗️ Well-Architected',
    emoji: '🏗️',
    description: (
      <>
        Clean component architecture with TypeScript. React Query for server state, Zustand for client state.
        Fully documented codebase for easy maintenance.
      </>
    ),
  },
  {
    title: '📚 Comprehensive Docs',
    emoji: '📚',
    description: (
      <>
        Complete documentation for every component, API endpoint, and architectural decision.
        Perfect for teams and AI-assisted development.
      </>
    ),
  },
];

function Feature({ title, emoji, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <div className={styles.featureSvg}>
          <span style={{ fontSize: '4rem' }}>{emoji}</span>
        </div>
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
