# ScoreBook Testing Prompts

This directory contains reusable prompt files for automated testing of the ScoreBook application as part of the SDLC.

---

## Available Prompts

### 📱 iOS Smoke Test
**File:** `smoke-test-ios.md`  
**Purpose:** Comprehensive smoke testing of the ScoreBook iOS app  
**Coverage:** All sports (Cricket, Football, Hockey) × All statuses (Live, Upcoming, Completed)  
**Duration:** 15-20 minutes  
**Scenarios:** 12+ test cases  

**Quick Start:**
```
Please run the smoke test from .agent/prompts/smoke-test-ios.md
```

**Documentation:** See `HOW_TO_USE_SMOKE_TEST.md` for detailed usage instructions

---

## Directory Structure

```
.agent/prompts/
├── README.md                      # This file
├── smoke-test-ios.md              # iOS smoke test prompt
└── HOW_TO_USE_SMOKE_TEST.md       # Usage guide
```

---

## How to Use These Prompts

### With AI Assistant (Recommended)

1. Copy the prompt file path
2. Ask your AI assistant:
   ```
   Execute the test plan in .agent/prompts/{prompt-file}.md
   ```
3. Review generated reports and screenshots

### Manual Testing

1. Open the prompt file
2. Follow test scenarios step-by-step
3. Document findings manually

---

## When to Run Tests

### iOS Smoke Test
- ✅ Before each release
- ✅ After major features
- ✅ Weekly during development
- ✅ After critical bug fixes

---

## Expected Outputs

All test prompts generate:
1. **Comprehensive Test Report** (Markdown)
2. **Quick Summary** (Markdown)
3. **Screenshots** (PNG files)
4. **Test Execution Log**

---

## Adding New Prompts

To add a new test prompt:

1. Create new `.md` file in this directory
2. Follow the structure of existing prompts:
   - Purpose and prerequisites
   - Test scenarios with verification steps
   - Screenshot requirements
   - Report generation instructions
   - Success/failure criteria
3. Update this README
4. Create usage guide if needed

### Prompt Template Structure

```markdown
# {Test Name} - Test Prompt

**Purpose:** {What this test covers}
**Duration:** {Expected time}
**Prerequisites:** {What's needed}

## Test Scenarios
{List of scenarios with steps}

## Screenshot Requirements
{What screenshots to capture}

## Report Generation
{What to include in report}

## Success Criteria
{When test passes/fails}
```

---

## Best Practices

1. **Version Control:** Keep prompts in git
2. **Documentation:** Update usage guides when prompts change
3. **Consistency:** Use same format across all prompts
4. **Maintenance:** Review and update quarterly
5. **Archiving:** Keep test reports for comparison

---

## Integration with SDLC

```
Development → Build → Smoke Test → Review → Merge → Release
                ↑
         (Use prompts here)
```

---

## Future Prompts (Planned)

- [ ] `smoke-test-android.md` - Android app smoke testing
- [ ] `smoke-test-backend.md` - Backend API testing
- [ ] `regression-test-ios.md` - Full regression suite
- [ ] `performance-test.md` - Performance benchmarks
- [ ] `accessibility-test.md` - Accessibility compliance

---

## Support

For questions or issues:
- Check the `HOW_TO_USE_*.md` guides
- Review previous test reports
- Contact QA team

---

## Version History

- **v1.0** (2025-12-27): Initial setup with iOS smoke test prompt

---

**Maintained By:** QA Team  
**Last Updated:** 2025-12-27
