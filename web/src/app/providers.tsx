'use client';

/**
 * Client-side providers for the application.
 *
 * Wraps the app with:
 * - Ant Design ConfigProvider (theming)
 * - TanStack Query QueryClientProvider (data fetching)
 * - i18n (internationalization)
 */
import React, { useState } from 'react';
import '@ant-design/v5-patch-for-react-19';
import { ConfigProvider, App as AntdApp, theme } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';

// Initialize i18n (side-effect import)
import '@/i18n';

const antdLocaleMap: Record<string, typeof enUS> = {
    en: enUS,
    'zh-CN': zhCN,
};

// ... imports
import { useTranslation } from 'react-i18next';

// ...

export default function Providers({
    children,
}: {
    children: React.ReactNode;
}) {
    const { i18n } = useTranslation();
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000, // 1 minute
                        retry: 1,
                        refetchOnWindowFocus: false,
                    },
                },
            })
    );

    // Get Ant Design locale from i18n language (default to enUS)
    // Handle 'zh-CN' vs 'en' mapping
    const locale = antdLocaleMap[i18n.language] ?? enUS;

    return (
        <QueryClientProvider client={queryClient}>
            <ConfigProvider
                locale={locale}
                theme={{
                    algorithm: theme.defaultAlgorithm,
                    token: {
                        colorPrimary: '#1677ff',
                        borderRadius: 6,
                    },
                }}
            >
                <AntdApp>{children}</AntdApp>
            </ConfigProvider>
        </QueryClientProvider>
    );
}
