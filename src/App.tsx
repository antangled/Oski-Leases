import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './components/home/HomePage';
import DashboardView from './components/dashboard/DashboardView';
import CreateListingView from './components/create/CreateListingView';
import SavedListingsView from './components/saved/SavedListingsView';
import LoginPage from './components/auth/LoginPage';
import PricingPage from './components/pricing/PricingPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useListings } from './hooks/useListings';
import { useReferencePoint } from './hooks/useReferencePoint';
import { useSavedListings } from './hooks/useSavedListings';

const ADMIN_ENABLED = import.meta.env.VITE_ADMIN_ENABLED === 'true';
const AdminDashboard = ADMIN_ENABLED
  ? lazy(() => import('./components/admin/AdminDashboard'))
  : null;

export default function App() {
  const { listings, addListing } = useListings();
  const { referencePoint, updateReferencePoint } = useReferencePoint();
  const { savedIds, toggleSaved, isSaved } = useSavedListings();

  return (
    <div className="flex flex-col min-h-screen bg-mint">
      <Navbar savedCount={savedIds.size} />
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                listings={listings}
                referencePoint={referencePoint}
                onReferencePointChange={updateReferencePoint}
                isSaved={isSaved}
                toggleSaved={toggleSaved}
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              <DashboardView
                allListings={listings}
                referencePoint={referencePoint}
                isSaved={isSaved}
                toggleSaved={toggleSaved}
              />
            }
          />
          <Route
            path="/saved"
            element={
              <SavedListingsView
                allListings={listings}
                referencePoint={referencePoint}
                savedIds={savedIds}
                toggleSaved={toggleSaved}
                isSaved={isSaved}
              />
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateListingView onAddListing={addListing} />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/pricing" element={<PricingPage />} />
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
