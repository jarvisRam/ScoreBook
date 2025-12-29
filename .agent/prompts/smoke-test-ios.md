# ScoreBook iOS App - Smoke Test Prompt

**Purpose:** Comprehensive smoke testing of the ScoreBook iOS application covering all sports, match statuses, and core functionality.

**Expected Duration:** 15-20 minutes

**Prerequisites:**
- iOS Simulator running with ScoreBook app installed
- mobile-mcp server configured and available
- App should be in a clean state (freshly launched or relaunched)

---

## Test Execution Instructions

Perform comprehensive smoke testing of the ScoreBook iOS app using mobile-mcp. Follow these steps systematically:

### 1. Environment Setup

1. List available iOS devices using `mobile_list_available_devices`
2. Verify the target device is online
3. Get screen size and orientation
4. Launch the ScoreBook app (package: `com.anonymous.mobile`)
5. Take initial screenshot and save as `smoke_test_initial.png`

### 2. Test Scenarios to Execute

Execute ALL of the following test scenarios in order. For EACH scenario:
- Take a screenshot
- Save screenshot with descriptive name (e.g., `cricket_live.png`, `football_upcoming.png`)
- List elements on screen to verify data
- Document findings

#### Scenario Group 1: Cricket Sport (🏏)

**S1.1: Cricket - Live Matches**
- Navigate to Cricket sport (tap at coordinates ~30, 150)
- Navigate to Live status (tap at coordinates ~100, 200)
- Screenshot: `cricket_live.png`
- Verify:
  - Cricket emoji (🏏) is displayed
  - Live match cards with identifiers: `matchCard_cricket_live_N`
  - Scores displayed as: runs/wickets (overs) format
  - Tournament names visible
  - Team names visible
  - Venue information displayed
  - Match format shown (ODI/T20/Test)
  - At least 2 matches visible

**S1.2: Cricket - Upcoming Matches**
- Stay on Cricket sport
- Navigate to Upcoming status (tap at coordinates ~200, 200)
- Screenshot: `cricket_upcoming.png`
- Verify:
  - Match cards with identifiers: `matchCard_cricket_upcoming_N`
  - Scores shown as "-" (no scores)
  - Match times displayed
  - Venue information present
  - Tournament names visible
  - At least 2 matches visible

**S1.3: Cricket - Completed Matches**
- Stay on Cricket sport
- Navigate to Completed status (tap at coordinates ~300, 200)
- Screenshot: `cricket_completed.png`
- Verify:
  - Match cards with identifiers: `matchCard_cricket_completed_N`
  - Final scores displayed
  - Match results shown (if available)
  - Venue information present
  - At least 2 matches visible

#### Scenario Group 2: Football Sport (🏈)

**S2.1: Football - Live Matches**
- Navigate to Football sport (tap at coordinates ~150, 150)
- Navigate to Live status (tap at coordinates ~100, 200)
- Screenshot: `football_live.png`
- Verify:
  - Football emoji (🏈) is displayed
  - Match cards with identifiers: `matchCard_football_live_N`
  - Scores displayed as points
  - Current quarter/period shown (e.g., "3rd", "2nd")
  - Team names visible
  - Venue information displayed
  - At least 2 matches visible

**S2.2: Football - Upcoming Matches**
- Stay on Football sport
- Navigate to Upcoming status (tap at coordinates ~200, 200)
- Screenshot: `football_upcoming.png`
- Verify:
  - Match cards with identifiers: `matchCard_football_upcoming_N`
  - Scores shown as "-" (no scores)
  - Match times displayed
  - Venue information present
  - At least 2 matches visible

**S2.3: Football - Completed Matches**
- Stay on Football sport
- Navigate to Completed status (tap at coordinates ~300, 200)
- Screenshot: `football_completed.png`
- Verify:
  - Match cards with identifiers: `matchCard_football_completed_N`
  - Final scores displayed
  - "Final" status shown
  - Venue information present
  - At least 2 matches visible

#### Scenario Group 3: Hockey Sport (🏒)

**S3.1: Hockey - Live Matches**
- Navigate to Hockey sport (tap at coordinates ~300, 150)
- Navigate to Live status (tap at coordinates ~100, 200)
- Screenshot: `hockey_live.png`
- Verify:
  - Hockey emoji (🏒) is displayed
  - Match cards with identifiers: `matchCard_hockey_live_N`
  - Scores displayed as goals/points
  - Current period shown (e.g., "2nd", "3rd")
  - Team names visible
  - Venue information displayed
  - At least 2 matches visible

**S3.2: Hockey - Upcoming Matches**
- Stay on Hockey sport
- Navigate to Upcoming status (tap at coordinates ~200, 200)
- Screenshot: `hockey_upcoming.png`
- Verify:
  - Match cards with identifiers: `matchCard_hockey_upcoming_N`
  - Scores shown as "-" (no scores)
  - Match times displayed
  - Venue information present
  - At least 2 matches visible

**S3.3: Hockey - Completed Matches**
- Stay on Hockey sport
- Navigate to Completed status (tap at coordinates ~300, 200)
- Screenshot: `hockey_completed.png`
- Verify:
  - Match cards with identifiers: `matchCard_hockey_completed_N`
  - Final scores displayed
  - "Final" status shown
  - Venue information present
  - At least 2 matches visible

### 3. Additional Test Scenarios

**S4.1: Navigation Flow Test**
- Test navigation between all sports (Cricket → Football → Hockey → Cricket)
- Verify smooth transitions
- Screenshot: `navigation_flow.png`

**S4.2: Scroll Test**
- On any sport/status with multiple matches, test scrolling
- Swipe up to see more matches (if available)
- Verify scroll behavior
- Screenshot: `scroll_test.png`

**S4.3: App Backgrounding Test**
- Press HOME button
- Take screenshot of home screen
- Relaunch app
- Verify app returns to previous state
- Screenshot: `app_resume.png`

### 4. Screenshot Organization

Save all screenshots to: `/Users/sriramvenkataraman/Documents/GitHub/ScoreBook/smoke_test_screenshots/`

Create subdirectories:
- `smoke_test_screenshots/cricket/`
- `smoke_test_screenshots/football/`
- `smoke_test_screenshots/hockey/`
- `smoke_test_screenshots/general/`

Screenshot naming convention:
- `{sport}_{status}_{timestamp}.png` (e.g., `cricket_live_20250127.png`)
- `{test_scenario}_{timestamp}.png` for general tests

### 5. Report Generation

Generate a comprehensive smoke test report with the following sections:

#### Report Structure:

**1. Executive Summary**
- Overall test status (PASS/FAIL)
- Pass rate (X/Y tests passed)
- Critical issues found (if any)
- Test date, time, duration
- Device information

**2. Test Environment Details**
- Device name and ID
- iOS version
- Screen size and orientation
- App package name
- App version (if available)

**3. Test Results by Sport**

For each sport (Cricket, Football, Hockey):
- **Live Matches Section:**
  - Status: PASS/FAIL
  - Matches found: Count
  - Sample match data
  - Screenshot reference
  - Issues found (if any)

- **Upcoming Matches Section:**
  - Status: PASS/FAIL
  - Matches found: Count
  - Sample match data
  - Screenshot reference
  - Issues found (if any)

- **Completed Matches Section:**
  - Status: PASS/FAIL
  - Matches found: Count
  - Sample match data
  - Screenshot reference
  - Issues found (if any)

**4. Test Coverage Matrix**
```
| Sport    | Live | Upcoming | Completed | Total |
|----------|------|----------|-----------|-------|
| Cricket  | ✅/❌ | ✅/❌    | ✅/❌     | X/3   |
| Football | ✅/❌ | ✅/❌    | ✅/❌     | X/3   |
| Hockey   | ✅/❌ | ✅/❌    | ✅/❌     | X/3   |
| Total    | X/3  | X/3     | X/3      | X/9   |
```

**5. Navigation Tests**
- Sports navigation results
- Status navigation results
- App lifecycle tests

**6. UI/UX Observations**
- Design consistency
- Data formatting accuracy
- Emoji display
- Accessibility identifiers
- Performance observations

**7. Issues Summary**
- Critical issues (blocking)
- Major issues (important)
- Minor issues (nice to have)
- Observations (informational)

**8. Data Validation**
- Sample data from each sport/status
- Verify correct formatting
- Verify all required fields present

**9. Recommendations**
- Immediate actions required
- Short-term improvements
- Long-term enhancements

**10. Appendix**
- All screenshot references
- Test execution log
- Device information
- Next testing phases

Save report as: `SMOKE_TEST_REPORT_{YYYYMMDD}_{HHMMSS}.md`

### 6. Success Criteria

The smoke test is considered PASSED if:
- ✅ All 9 sport/status combinations are accessible
- ✅ All match cards display correctly with proper data
- ✅ Navigation between sports works smoothly
- ✅ Navigation between statuses works smoothly
- ✅ No app crashes occur
- ✅ All screenshots are captured successfully
- ✅ Data formatting is correct for each sport
- ✅ Accessibility identifiers are present

The smoke test is considered FAILED if:
- ❌ Any sport/status combination is not accessible
- ❌ App crashes during testing
- ❌ Critical data is missing or incorrectly formatted
- ❌ Navigation is broken
- ❌ More than 2 major issues are found

---

## Expected Output

At the end of the smoke test, provide:

1. **Comprehensive Test Report** (Markdown file)
   - All sections as outlined above
   - Detailed findings for each test scenario
   - Pass/Fail status for each test
   - Overall pass rate and recommendation

2. **Screenshot Collection** (12+ PNG files)
   - One for each sport/status combination (9 screenshots)
   - Additional screenshots for navigation, scroll, lifecycle tests
   - All organized in appropriate directories

3. **Quick Summary** (Markdown file)
   - High-level pass/fail status
   - Key findings
   - Critical issues (if any)
   - Overall recommendation

4. **Test Execution Log**
   - List of all actions performed
   - Timestamps for each test scenario
   - Any errors or warnings encountered

---

## Notes for Tester

- **Coordinate Adjustments:** If screen size differs, adjust tap coordinates proportionally
- **Timing:** Allow 1-2 seconds between actions for UI to update
- **Screenshots:** Always capture screenshots AFTER the UI has fully loaded
- **Element Verification:** Use `list_elements_on_screen` to verify data, not just screenshots
- **Error Handling:** If a test scenario fails, document it and continue with remaining tests
- **Data Validation:** Verify at least 2 sample matches per sport/status combination
- **Consistency:** Use the same device and configuration for all tests in a session

---

## Automation Considerations

This prompt can be used with:
- Manual execution by AI assistant with mobile-mcp
- Automated test scripts
- CI/CD pipeline integration
- Regular regression testing

**Frequency Recommendation:** Run smoke tests:
- After every major feature addition
- Before each release
- After critical bug fixes
- Weekly for ongoing development

---

## Version History

- **v1.0** (2025-12-27): Initial version covering Cricket, Football, Hockey with Live/Upcoming/Completed statuses

---

## Contact

For questions or issues with this smoke test prompt, contact the QA team or refer to the ScoreBook testing documentation.
