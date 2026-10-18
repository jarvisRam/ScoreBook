/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
    tutorialSidebar: [
        'intro',
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
            ],
        },
        {
            type: 'category',
            label: '🔌 API Reference',
            collapsed: false,
            items: [
                'api/overview',
                'api/matches-by-sport',
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
                    ],
                },
                {
                    type: 'category',
                    label: 'Components',
                    items: [
                        'frontend/components/MatchCard',
                    ],
                },
            ],
        },
        {
            type: 'category',
            label: '🧪 Testing',
            collapsed: false,
            items: [
                'testing/overview',
                'testing/strategy',
                'testing/quality-maturity-model',
                {
                    type: 'category',
                    label: 'Testing Layers',
                    link: {
                        type: 'generated-index',
                        title: 'Testing Layers',
                        description:
                            'One page per layer of the test pyramid, from static checks to integrated E2E. Each covers what the layer does, how to run it, and the decision matrix behind its tool choice.',
                        slug: '/testing/layers',
                    },
                    items: [
                        'testing/layers/static-checks',
                        'testing/layers/dependency-security',
                        'testing/layers/unit-testing',
                        'testing/layers/frontend-acceptance',
                        'testing/layers/backend-acceptance',
                        'testing/layers/contract-testing',
                        'testing/layers/integrated-e2e',
                    ],
                },
                'testing/test-data',
                'testing/running-tests',
            ],
        },
    ],
};

module.exports = sidebars;
