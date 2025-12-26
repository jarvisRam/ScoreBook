# Documentation Site Configuration
# This file should be placed at: docs / docusaurus.config.js

module.exports = {
    title: 'ScoreBook Docs',
    tagline: 'Cross-platform sports scoreboard application',
    url: 'https://your-domain.com',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',

    organizationName: 'your-org',
    projectName: 'scorebook-docs',

    presets: [
        [
            'classic',
            {
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    editUrl: 'https://github.com/your-org/scorebook/tree/main/docs/',
                    routeBasePath: '/',
                },
                blog: false,
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            },
        ],
    ],

    themeConfig: {
        navbar: {
            title: 'ScoreBook',
            logo: {
                alt: 'ScoreBook Logo',
                src: 'img/logo.svg',
            },
            items: [
                {
                    type: 'doc',
                    docId: 'intro',
                    position: 'left',
                    label: 'Docs',
                },
                {
                    href: 'https://github.com/your-org/scorebook',
                    label: 'GitHub',
                    position: 'right',
                },
            ],
        },
        footer: {
            style: 'dark',
            links: [
                {
                    title: 'Docs',
                    items: [
                        {
                            label: 'Introduction',
                            to: '/',
                        },
                        {
                            label: 'API Reference',
                            to: '/api/overview',
                        },
                        {
                            label: 'Testing',
                            to: '/testing/overview',
                        },
                    ],
                },
                {
                    title: 'Community',
                    items: [
                        {
                            label: 'GitHub',
                            href: 'https://github.com/your-org/scorebook',
                        },
                        {
                            label: 'Issues',
                            href: 'https://github.com/your-org/scorebook/issues',
                        },
                    ],
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} ScoreBook. Built with Docusaurus.`,
        },
        prism: {
            theme: require('prism-react-renderer/themes/github'),
            darkTheme: require('prism-react-renderer/themes/dracula'),
            additionalLanguages: ['typescript', 'javascript', 'bash', 'json'],
        },
    },
};
