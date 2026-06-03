import { Metadata } from 'next';

import { ConvexClientProvider } from '../providers/convex-provider';
import { ReduxProvider } from '../providers/redux-provider';

import { AuthenticatedFeatures } from './modules/init/authenticated-features';

import './global.css';

export const metadata: Metadata = {
  title: 'Vulcan',
  description: 'Made by Bo Bramer',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <ReduxProvider>
          <ConvexClientProvider>
            <AuthenticatedFeatures />
            {children}
          </ConvexClientProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
