// Sidebar configuration for Docusaurus
// This file should be placed at: docs/sidebars.js

module.exports = {
    docs: [
        {
            type: 'doc',
            id: 'intro',
            label: 'Introduction',
        },
        {
            type: 'category',
            label: '🚀 Getting Started',
            collapsed: false,
            items: [
                'getting-started/installation',
                'getting-started/quick-start',
                'getting-started/project-structure',
            ],
        },
        {
            type: 'category',
            label: '🏗️ Architecture',
            collapsed: false,
            items: [
                'architecture/system-architecture',
                'architecture/data-flow',
                'architecture/design-decisions',
            ],
        },
        {
            type: 'category',
            label: '🔌 API Reference',
            collapsed: false,
            items: [
                'api/overview',
                'api/health',
                'api/sports',
                'api/matches-live',
                'api/matches-by-sport',
                'api/match-detail',
            ],
        },
        {
            type: 'category',
            label: '📱 Frontend',
            collapsed: false,
            items: [
                {
                    type: 'category',
                    label: 'Screens',
                    items: [
                        'frontend/screens/sport-screen',
                        'frontend/screens/match-detail-screen',
                    ],
                },
                {
                    type: 'category',
                    label: 'Components',
                    items: [
                        'frontend/components/overview',
                        'frontend/components/MatchCard',
                        'frontend/components/TeamDisplay',
                        'frontend/components/ScoreDisplay',
                        'frontend/components/LiveIndicator',
                        'frontend/components/VenueInfo',
                        'frontend/components/LoadingState',
                        'frontend/components/ErrorState',
                        'frontend/components/EmptyState',
                    ],
                },
                {
                    type: 'category',
                    label: 'State & Hooks',
                    items: [
                        'frontend/state-management',
                        'frontend/hooks/useMatches',
                        'frontend/hooks/useAppStore',
                    ],
                },
                'frontend/navigation',
                'frontend/theming',
            ],
        },
        {
            type: 'category',
            label: '⚙️ Backend',
            collapsed: false,
            items: [
                'backend/structure',
                'backend/mock-data-service',
                'backend/routes',
                'backend/middleware',
            ],
        },
        {
            type: 'category',
            label: '🧪 Testing',
            collapsed: false,
            items: [
                'testing/overview',
                'testing/backend-testing',
                'testing/component-testing',
                'testing/e2e-testing',
                'testing/test-data',
            ],
        },
        {
            type: 'category',
            label: '🤝 Contributing',
            collapsed: false,
            items: [
                'contributing/guidelines',
                'contributing/code-style',
                'contributing/pull-requests',
                'contributing/adding-new-sport',
                'contributing/adding-new-feature',
            ],
        },
    ],
};
