import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './components/home/HomePage';
import DashboardView from './components/dashboard/DashboardView';
import CreateListingView from './components/create/CreateListingView';
import { useListings } from './hooks/useListings';
import { useReferencePoint } from './hooks/useReferencePoint';

const ADMIN_ENABLED = import.meta.env.VITE_ADMIN_ENABLED === 'true';
const AdminDashboard = ADMIN_ENABLED
  ? lazy(() => import('./components/admin/AdminDashboard'))
  : null;

export default function App() {
  const { listings, addListing } = useListings();
  const { referencePoint, updateReferencePoint } = useReferencePoint();

  return (
    <div className="flex flex-col min-h-screen bg-mint">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                listings={listings}
                referencePoint={referencePoint}
                onReferencePointChange={updateReferencePoint}
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              <DashboardView
                allListings={listings}
                referencePoint={referencePoint}
              />
            }
          />
          <Route
            path="/create"
            element={<CreateListingView onAddListing={addListing} />}
          />
          {AdminDashboard && (
            <Route
              path="/admin"
              element={
                <Suspense fallback={<div className="p-8 text-center text-dark/50">Loading...</div>}>
                  <AdminDashboard />
                </Suspense>
              }
            />
          )}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
