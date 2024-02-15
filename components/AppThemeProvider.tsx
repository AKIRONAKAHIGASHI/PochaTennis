"use client"

import React, { ReactNode } from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import colors from '@/lib/colors';
import fonts from '@/lib/fonts';

interface AppThemeProviderProps {
    children: ReactNode;
}

const customTheme = extendTheme({
    colors,
    fonts,
    styles: {
        global: {
            body: {
                // bg: 'grass.100',
                // color: 'grass.800',
            },
        },
    },
    // その他のテーマ設定
});

const AppThemeProvider: React.FC<AppThemeProviderProps> = ({ children }) => {
    return (
        <ChakraProvider theme={customTheme}>
            {children}
        </ChakraProvider>
    );
};

export default AppThemeProvider;
