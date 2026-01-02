# Environment Switching

ScoreBook Mobile App includes a developer-only feature that allows seamless switching between **Local Development** (mock data) and **Production** (live Render API). This feature is essential for testing and verifying changes without deploying to the backend.

:::tip
This feature is guarded by `__DEV__` checks. It will **not** appear in production release builds.
:::

## How to Access

1.  Run the app in debug mode (e.g., `npx expo start`).
2.  On the Home screen, locate the **Gear Icon (⚙️)** in the top right corner of the header.

![Developer Settings Entry](/img/mobile/dev-settings-entry.png)

## Using Developer Settings

Tap the gear icon to open the **Developer Settings** screen.

![Developer Settings Screen](/img/mobile/dev-settings-screen.png)

### Available Environments

*   **Local Development**: 
    *   Points to `http://localhost:3000/api` (iOS/Web)
    *   Points to `http://10.0.2.2:3000/api` (Android Emulator)
*   **Production**: 
    *   Points to `https://scorebook-api.onrender.com/api`

### Switching

1.  Select the desired environment using the radio buttons.
2.  The "Current Endpoint" display (bottom of screen) will update immediately.
3.  The setting is persisted using `AsyncStorage`.
4.  Navigate back to the app; future API requests will use the new base URL.

## Implementation Details

The switching logic is handled by:
*   `src/context/EnvironmentContext.tsx`: Manages the state and persistence.
*   `src/services/api.ts`: Uses an Axios interceptor to dynamic inject the `baseURL`.
*   `src/screens/DeveloperSettingsScreen.tsx`: The UI implementation.

## Test Automation (Launch Arguments)

For CI/CD and automated testing (e.g., Appium, Detox, Maestro), you can switch environments dynamically using launch arguments. This bypasses the need for manual UI interaction.

### iOS

Pass the `-targetEnvironment` argument using `xcrun` or your test runner capability `launchArgs`.

> **Note**: `booted` targets the currently running simulator. You can replace it with a specific Device UUID if needed.

```bash
# Switch to Production
xcrun simctl launch booted com.anonymous.mobile -targetEnvironment prod

# Switch to Local
xcrun simctl launch booted com.anonymous.mobile -targetEnvironment local
```

### Android

Pass the `targetEnvironment` extra using `adb` or test runner capability `appActivity`.

```bash
# Switch to Production
adb shell am start -n com.anonymous.mobile/.MainActivity --es "targetEnvironment" "prod"

# Switch to Local
adb shell am start -n com.anonymous.mobile/.MainActivity --es "targetEnvironment" "local"
```

> [!IMPORTANT]
> **Priority Rule**: If a launch argument is present, it **overrides** any previously stored setting in `AsyncStorage` for that session. If no argument is passed, the app falls back to the last selected environment from storage.
