'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PropsWithChildren } from 'react'
import { Toaster } from 'react-hot-toast'

const queryClient = new QueryClient()

export type ProvidersProps = PropsWithChildren

export const Providers = ({ children }: ProvidersProps) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <Toaster
                position='top-center'
                reverseOrder={false}
                toastOptions={{
                    duration: 5000,
                    style: {
                        borderRadius: '0px',
                        background: '#2E252A',
                        color: '#FFFFFF',
                        maxWidth: '500px',
                        borderLeft: '5px solid #AD6205',
                    },
                }}
            />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}
