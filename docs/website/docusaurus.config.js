// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const { themes } = require('prism-react-renderer');
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'ScoreBook Docs',
    tagline: 'Cross-platform sports scoreboard application',
    favicon: 'img/favicon.ico',

    // Set the production url of your site here
    url: 'https://scorebook-docs.vercel.app',
    onBrokenLinks: 'warn', // Allow build to complete with warnings for placeholder docs
    // Set the /<baseUrl>/ pathname under which your site is served
    baseUrl: '/',

    // GitHub pages deployment config.
    organizationName: 'jarvisRam',
    projectName: 'scorebook',

    onBrokenMarkdownLinks: 'warn',

    // Even if you don't use internalization, you can use this field to set useful
    // metadata like html lang. For example, if your site is Chinese, you may want
    // to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    routeBasePath: '/',
                    // Please change this to your repo.
                    editUrl:
                        'https://github.com/jarvisRam/ScoreBook/tree/main/docs/website/',
                },
                blog: false,
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            }),
        ],
    ],

    themes: ['@docusaurus/theme-mermaid'],
    markdown: {
        mermaid: true,
    },
    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            // Replace with your project's social card
            image: 'img/docusaurus-social-card.jpg',
            navbar: {
                title: 'ScoreBook',
                logo: {
                    alt: 'ScoreBook Logo',
                    src: 'img/logo.svg',
                },
                items: [
                    {
                        type: 'docSidebar',
                        sidebarId: 'tutorialSidebar',
                        position: 'left',
                        label: 'Documentation',
                    },
                    {
                        to: '/demo',
                        label: 'Demo',
                        position: 'left',
                    },
                    {
                        to: '/references',
                        label: 'References',
                        position: 'left',
                    },
                    {
                        href: 'https://github.com/jarvisRam/ScoreBook',
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
                            { label: 'Introduction', to: '/intro' },
                            { label: 'Demo video', to: '/demo' },
                            { label: 'Getting Started', to: '/getting-started/installation' },
                            { label: 'Architecture', to: '/architecture/system-architecture' },
                            { label: 'API Reference', to: '/api/overview' },
                        ],
                    },
                    {
                        title: 'Testing',
                        items: [
                            { label: 'Testing Overview', to: '/testing/overview' },
                            { label: 'Test Strategy', to: '/testing/strategy' },
                            { label: 'Quality Maturity Model', to: '/testing/quality-maturity-model' },
                            { label: 'Testing Layers', to: '/testing/layers' },
                            { label: 'Running Tests', to: '/testing/running-tests' },
                        ],
                    },
                    {
                        title: 'Quality Tools',
                        items: [
                            { label: 'References', to: '/references' },
                            {
                                label: 'SonarQube Cloud',
                                href: 'https://sonarcloud.io/project/overview?id=jarvisRam_ScoreBook',
                            },
                            { label: 'Pact (Pactflow)', href: 'https://fanduel-a13fd6f7.pactflow.io/pacticipants?filter=favorites' },
                            { label: 'Gitar', href: 'https://app.gitar.ai/sriram20mail/dashboard' },
                            { label: 'BrowserStack', href: 'https://app-automate.browserstack.com/overview' },
                        ],
                    },
                    {
                        title: 'Source',
                        items: [
                            { label: 'GitHub', href: 'https://github.com/jarvisRam/ScoreBook' },
                            {
                                label: 'GitHub Actions',
                                href: 'https://github.com/jarvisRam/ScoreBook/actions',
                            },
                            { label: 'Issues', href: 'https://github.com/jarvisRam/ScoreBook/issues' },
                            { label: 'Pull Requests', href: 'https://github.com/jarvisRam/ScoreBook/pulls' },
                        ],
                    },
                ],
                copyright: `Copyright © ${new Date().getFullYear()} ScoreBook. Built with Docusaurus.`,
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
                additionalLanguages: ['typescript', 'javascript', 'bash', 'json'],
            },
        }),
};

module.exports = config;
