---
sidebar_position: 1
title: Static Checks
description: Compilation & lint, code quality & security analysis, and AI code review. They run on every change without executing the code.
---

# Static Checks

Static checks form the base of the [test pyramid](../overview.md#the-test-pyramid). They analyse the code without running it, run on every change, and are the cheapest place to catch a defect. The layer has three checks, each answering a different question:

| Check | Question it answers | Tool | Blocks merge? |
| :--- | :--- | :--- | :--- |
| **Compilation & lint** | Does it compile, and does it follow our rules? | ESLint + TypeScript | Yes |
| **Code quality & security analysis** | Is the new code reliable, secure and maintainable? | SonarCloud | Yes (quality gate) |
| **AI code review** | Would a careful reviewer spot a problem in this diff? | Gitar | No (advisory) |

Matrix key: ✅ strong fit · ⚠️ partial / with caveats · ❌ not supported. The chosen tool is in **bold**.

---

## Compilation & lint

**What it checks**: TypeScript compilation (`tsc --noEmit`) for `mobile/` and `backend/`, plus lint rules for correctness (unused variables, React hooks rules, unsafe `any`) and consistent style.

### Decision matrix

| Criteria | **ESLint + tsc** | Biome (+ tsc) | Oxlint (+ tsc) |
| :--- | :--- | :--- | :--- |
| Full TypeScript type checking | ✅ via `tsc` | ⚠️ still needs `tsc` | ⚠️ still needs `tsc` |
| Type-aware lint rules (e.g. floating promises) | ✅ typescript-eslint | ⚠️ limited | ⚠️ limited |
| React Native / Expo rule sets | ✅ `eslint-config-expo`, `react-hooks`, `react-native` plugins | ⚠️ partial ports of core React rules | ⚠️ partial ports of core React rules |
| Speed | ⚠️ slowest of the three, still < 1 min at our size | ✅ very fast (Rust) | ✅ very fast (Rust) |
| Editor and CI integration | ✅ universal | ✅ good | ✅ good |

### Why ESLint + tsc

- **Only `tsc` does real type checking.** Every option needs it anyway, so the real choice is about the linter, and only ESLint has typescript-eslint's type-aware rules.
- **The Expo ecosystem is built around it.** `eslint-config-expo` and the official React hooks rules catch RN-specific mistakes that the faster linters only partly cover.
- Speed is ESLint's weakness, but at ScoreBook's size it stays well inside the < 1 min budget. Revisit Biome or Oxlint if it doesn't.

**What good looks like**: under 1 minute, with zero errors and zero warnings (`--max-warnings 0`).

:::warning Current gap
Both packages' `lint` scripts end with `|| echo 'Linting skipped - ESLint not configured'`, so a lint failure currently passes CI. To make this a real gate, add an ESLint config to each package and remove the fallback.
:::

---

## Code quality & security analysis

**What it checks**: a quality gate applied to *new code* in each PR, so legacy debt doesn't block unrelated changes. It covers bugs, security vulnerabilities and hotspots, code smells and duplication. It also aggregates the Jest coverage reports for the [unit layer's coverage gate](./unit-testing.md#coverage-gate).

### Decision matrix

| Criteria | **SonarCloud** | GitHub CodeQL | Codacy | Qlty (Code Climate) |
| :--- | :--- | :--- | :--- | :--- |
| Bugs + code smells + duplication | ✅ | ❌ security-focused | ✅ | ✅ |
| Security vulnerabilities and hotspot review workflow | ✅ | ✅ deepest data-flow analysis | ⚠️ via bundled scanners | ⚠️ via bundled scanners |
| Quality gate on *new code* only | ✅ first-class concept | ❌ | ⚠️ | ⚠️ |
| Coverage aggregation from LCOV | ✅ | ❌ | ✅ | ✅ |
| Monorepo (mobile + backend) in one project | ✅ | ✅ | ✅ | ✅ |
| PR decoration and status check | ✅ | ✅ | ✅ | ✅ |
| Free for public repositories | ✅ | ✅ | ✅ | ✅ |

### Why SonarCloud

- **One gate for reliability, security and maintainability.** CodeQL is excellent at security but doesn't report smells, duplication or coverage, so we'd need a second tool anyway.
- **The "clean as you code" new-code gate fits a codebase that's still growing.** PRs are judged on what they add, not on inherited debt.
- **It's the industry-standard dashboard** and widely recognised. CodeQL can be added later as a complementary security scan if needed.

:::note Our code only
SonarCloud analyses the source we write. It doesn't scan the packages we import, so its security rating says nothing about a vulnerable dependency. That is covered by [Dependency Security](./dependency-security.md).
:::

**Gate**: 0 new bugs, 0 new vulnerabilities, 100% of new security hotspots reviewed, rating A for reliability, security and maintainability, ≤ 3% duplicated lines on new code.

**Acting on findings**: fix bugs and vulnerabilities in the PR. Review hotspots in SonarCloud and mark each one *Safe* or *Fix*. If you think a code smell is a false positive, mark it *Won't fix* with a reason, and don't silence the rule globally.

**What good looks like**: the scan finishes in under 5 minutes and the gate is green.

---

## AI code review

**What it checks**: an AI reviewer reads the PR diff and leaves inline comments on likely logic errors, missed edge cases, inconsistent error handling and risky changes. It adds to human review and doesn't replace it.

### Decision matrix

| Criteria | **Gitar** | CodeRabbit | GitHub Copilot code review | Qodo Merge |
| :--- | :--- | :--- | :--- | :--- |
| Inline review comments and PR summary | ✅ | ✅ | ✅ | ✅ |
| Acts on findings: pushes fixes, not just comments | ✅ can apply review fixes and fix failing CI | ⚠️ suggested patches | ⚠️ suggested changes | ⚠️ suggested patches |
| Understands CI failures in context | ✅ | ⚠️ | ⚠️ | ⚠️ |
| Repo-level custom review rules | ✅ | ✅ | ✅ | ✅ |
| Setup effort | ✅ GitHub app | ✅ GitHub app | ✅ built in, needs Copilot seats | ✅ GitHub app |

### Why Gitar

- **It closes the loop, not just comments.** Gitar can push fixes for its own review findings and for failing CI checks. That cuts the review → fix → re-run cycle that dominates PR lead time.
- **CI-aware review.** It reads failing check output alongside the diff, so its comments reflect what actually broke, not just a style pass.
- **Works alongside humans.** The comments are advisory and the human approval rule stays in place.

**Acting on findings**: the author resolves or replies to every comment before requesting human review.

**What good looks like**: first feedback within 10 minutes of a push, and no unresolved AI review comments at merge time.

---

## Related

- [Test Strategy](../strategy.md): where static checks sit in the PR gate
- [Running Tests](../running-tests.md): coverage commands that feed SonarCloud
