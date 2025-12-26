export const theme = {
    colors: {
        primary: '#2196F3',
        secondary: '#FF9800',
        background: '#0A0E27',
        surface: '#1A1F3A',
        card: '#242B4A',
        text: '#FFFFFF',
        textSecondary: '#B0B8D4',
        border: '#2D3548',
        error: '#F44336',
        success: '#4CAF50',
        warning: '#FF9800',
        live: '#FF4444',

        // Sport-specific colors
        sports: {
            cricket: '#4CAF50',
            football: '#FF9800',
            hockey: '#2196F3',
            soccer: '#9C27B0',
            tennis: '#FFEB3B',
            badminton: '#F44336',
        },
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
    borderRadius: {
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
    },
    typography: {
        h1: {
            fontSize: 32,
            fontWeight: 'bold' as const,
            lineHeight: 40,
        },
        h2: {
            fontSize: 24,
            fontWeight: 'bold' as const,
            lineHeight: 32,
        },
        h3: {
            fontSize: 20,
            fontWeight: '600' as const,
            lineHeight: 28,
        },
        body: {
            fontSize: 16,
            fontWeight: 'normal' as const,
            lineHeight: 24,
        },
        caption: {
            fontSize: 14,
            fontWeight: 'normal' as const,
            lineHeight: 20,
        },
        small: {
            fontSize: 12,
            fontWeight: 'normal' as const,
            lineHeight: 16,
        },
    },
    shadows: {
        small: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        },
        medium: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 4,
        },
        large: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 16,
            elevation: 8,
        },
    },
};

export type Theme = typeof theme;
