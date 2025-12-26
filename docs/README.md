# ScoreBook Documentation

This directory contains the comprehensive documentation for the ScoreBook application.

## Documentation Structure

```
docs/
├── intro.md                      # Documentation homepage
├── docusaurus.config.js          # Docusaurus configuration
├── sidebars.js                   # Sidebar navigation structure
│
├── getting-started/              # Setup and installation guides
│   ├── installation.md
│   ├── quick-start.md
│   └── project-structure.md
│
├── architecture/                 # System design and architecture
│   ├── system-architecture.md
│   ├── data-flow.md
│   └── design-decisions.md
│
├── api/                          # Backend API documentation
│   ├── overview.md
│   ├── health.md
│   ├── sports.md
│   ├── matches-live.md
│   ├── matches-by-sport.md
│   └── match-detail.md
│
├── frontend/                     # Frontend documentation
│   ├── screens/                  # Screen components
│   │   ├── sport-screen.md
│   │   └── match-detail-screen.md
│   ├── components/               # Reusable components
│   │   ├── overview.md
│   │   ├── MatchCard.md
│   │   ├── TeamDisplay.md
│   │   ├── ScoreDisplay.md
│   │   ├── LiveIndicator.md
│   │   ├── VenueInfo.md
│   │   ├── LoadingState.md
│   │   ├── ErrorState.md
│   │   └── EmptyState.md
│   ├── hooks/                    # Custom React hooks
│   │   ├── useMatches.md
│   │   └── useAppStore.md
│   ├── navigation.md
│   ├── state-management.md
│   └── theming.md
│
├── backend/                      # Backend documentation
│   ├── structure.md
│   ├── mock-data-service.md
│   ├── routes.md
│   └── middleware.md
│
├── testing/                      # Testing guides
│   ├── overview.md
│   ├── backend-testing.md
│   ├── component-testing.md
│   ├── e2e-testing.md
│   └── test-data.md
│
└── contributing/                 # Contribution guidelines
    ├── guidelines.md
    ├── code-style.md
    ├── pull-requests.md
    ├── adding-new-sport.md
    └── adding-new-feature.md
```

## Viewing the Documentation

### Option 1: Read Markdown Files Directly

All documentation is written in Markdown and can be read directly in GitHub or any Markdown viewer.

### Option 2: Run Docusaurus Locally

1. **Install Docusaurus** (one-time setup):

```bash
cd docs
npm init docusaurus@latest website classic
```

2. **Copy configuration files**:

```bash
# Copy the provided config files
cp docusaurus.config.js website/
cp sidebars.js website/
```

3. **Move documentation files**:

```bash
# Move all .md files to website/docs/
cp -r . website/docs/
```

4. **Start local server**:

```bash
cd website
npm start
```

Visit `http://localhost:3000` to view the documentation site.

### Option 3: Deploy to GitHub Pages

1. Update `docusaurus.config.js` with your GitHub info
2. Run `npm run build` to generate static files
3. Run `npm run deploy` to publish to GitHub Pages

## Documentation Standards

### File Naming

- Use kebab-case for file names: `match-card.md`
- Use descriptive names: `adding-new-sport.md` not `new-sport.md`

### Markdown Frontmatter

All documentation pages should include frontmatter:

```markdown
---
sidebar_position: 1
title: Page Title
---
```

### Code Examples

Always include language identifiers in code blocks:

````markdown
```typescript
const example = "code";
```
````

### Cross-References

Link to related documentation using relative paths:

```markdown
See [API Overview](../api/overview.md) for more details.
```

## Contributing to Documentation

1. Follow the existing structure
2. Include code examples where applicable
3. Add diagrams for complex concepts
4. Keep language clear and concise
5. Test all code examples
6. Update the sidebar configuration if adding new pages

## Documentation Principles

1. **User-Centric:** Write for developers who will use or maintain the code
2. **Complete:** Cover all features, components, and APIs
3. **Practical:** Include real examples and use cases
4. **Current:** Keep documentation synchronized with code
5. **Navigable:** Organize logically with clear cross-references

## Need Help?

- Open an issue in the GitHub repository
- Check existing documentation for similar topics
- Contact the maintainers

---

*Last Updated: December 2024*
