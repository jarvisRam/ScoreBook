// Load shapes, selected with PERF_PROFILE (scripts/run.js --profile=...).
//
//   quick     seconds-long sanity run for local development
//   standard  the scheduled baseline run; the shape baselines are recorded against
//   stress    steps well past expected load to find where latency and errors break.
//             Manual only, mocked stacks only. Baselines and absolute budgets are not applied.
//   smoke     hosted environment: a handful of paced iterations, deliberately tiny
const s = (duration, target) => ({ duration, target });

// Backend: requests per second, per endpoint. Endpoints run one after another, so each
// is measured in isolation.
export const BE_STAGES = {
    quick: [s('3s', 10), s('7s', 10), s('1s', 0)],
    standard: [s('10s', 40), s('30s', 40), s('2s', 0)],
    stress: [s('15s', 100), s('15s', 250), s('15s', 500), s('15s', 1000), s('5s', 0)],
};

// Frontend: concurrent virtual users each loading the app
export const FE_STAGES = {
    quick: [s('3s', 3), s('7s', 3), s('1s', 0)],
    standard: [s('10s', 20), s('30s', 20), s('2s', 0)],
    stress: [s('15s', 50), s('15s', 100), s('15s', 200), s('15s', 400), s('5s', 0)],
};

// Browser journeys are heavy (a real Chromium each), so they are counted in iterations
export const BROWSER_ITERATIONS = { quick: 2, standard: 8, stress: 8, smoke: 3 };

export const HOSTED_SMOKE_ITERATIONS = 5;

export function stagesFor(table, profile) {
    const stages = table[profile];
    if (!stages) {
        throw new Error(`Unknown PERF_PROFILE "${profile}". Use one of: ${Object.keys(table).join(', ')}`);
    }
    return stages;
}

const seconds = (duration) => parseInt(duration, 10);
export const totalSeconds = (stages) => stages.reduce((sum, stage) => sum + seconds(stage.duration), 0);
