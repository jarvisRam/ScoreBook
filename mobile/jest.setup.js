// Mock @expo/vector-icons to avoid native module resolution issues in tests
jest.mock('@expo/vector-icons/MaterialCommunityIcons', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return {
        __esModule: true,
        default: ({ name, size, color, ...props }) =>
            React.createElement(Text, { ...props, testID: `icon-${name}` }, name),
    };
});
