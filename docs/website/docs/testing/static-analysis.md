---
sidebar_position: 3
title: Static Analysis
---

# Static Analysis

Static checks form the base of the [test pyramid](./overview.md#the-test-pyramid). They analyse the code without running it, run on every change, and are the cheapest place to catch a defect. ScoreBook uses three tools at this layer, each answering a different question.

| Tool | Question it answers | Blocks merge? |
| :--- | :--- | :--- |
| ESLint + TypeScript | Does it compile, and does it follow our rules? | Yes |
| SonarCloud | Is the new code covered, secure and maintainable? | Yes (quality gate) |
| Gitar | Would a careful reviewer spot a problem in this diff? | No (advisory) |

## Lint & type checks

**What it checks**: TypeScript compilation (`tsc --noEmit`) for `mobile/` and `backend/`, plus ESLint rules for correctness (unused variables, hooks rules, unsafe `any`) and consistent style.

**How it runs**: in the `lint-and-test` job of `.github/workflows/ci.yml`, on every PR and push to `main` / `develop`.

```bash
# From repo root
npm run lint                    # mobile + backend
cd mobile && npx tsc --noEmit
cd backend && npx tsc --noEmit
```

**What good looks like**: under 1 minute, with zero errors and zero warnings (`--max-warnings 0`).

:::warning Current gap
Both packages' `lint` scripts end with `|| echo 'Linting skipped - ESLint not configured'`, so a lint failure currently passes CI. To make this layer a real gate, add an ESLint config to each package and remove the fallback.
:::

## SonarCloud

**What it checks**: the quality gate is applied to *new code* in each PR, so legacy debt doesn't block unrelated changes.

| Dimension | What SonarCloud measures | Proposed gate |
| :--- | :--- | :--- |
| Coverage | Line and branch coverage from Jest LCOV reports (`mobile/coverage/lcov.info`, `backend/coverage/lcov.info`) | ≥ 80% on new code |
| Reliability | Bugs | 0 new bugs, rating A |
| Security | Vulnerabilities and security hotspots (injection, hard-coded secrets, insecure HTTP) | 0 new vulnerabilities, 100% of hotspots reviewed, rating A |
| Maintainability | Code smells, cognitive complexity, duplication | Rating A, ≤ 3% duplicated lines on new code |

**How it runs**: a scan job after the unit and mocked acceptance tests in CI, so their coverage reports can be uploaded. SonarCloud then posts the gate result as a PR check and a decorated summary comment.

**Acting on findings**: fix bugs and vulnerabilities in the PR. Review hotspots in SonarCloud and mark each one *Safe* or *Fix*. If you think a code smell is a false positive, mark it *Won't fix* with a reason, and don't silence the rule globally.

**What good looks like**: the scan finishes in under 5 minutes and the gate is green.

## Gitar (AI code review)

**What it checks**: Gitar reviews the PR diff and leaves inline comments on likely logic errors, missed edge cases, inconsistent error handling and risky changes. It can also summarise the PR for human reviewers.

**How it runs**: the Gitar GitHub app triggers on PR open and on every push to the PR branch.

**Acting on findings**: the author resolves or replies to every comment before requesting human review. Gitar is **advisory**: it adds a second pair of eyes but doesn't replace the human approval required to merge.

**What good looks like**: first feedback within 10 minutes of a push, and no unresolved Gitar comments at merge time.

## Related

- [Test Strategy](./strategy.md): where static checks sit in the PR gate
- [Running Tests](./running-tests.md): coverage commands that feed SonarCloud
