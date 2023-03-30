import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminPage from './routes/AdminPage';
import CreatePage from './routes/CreatePage';
import ExpertPage from './routes/ExpertPage';
import HomePage from './routes/HomePage';
import SellPage from './routes/SellPage';
import ShopPage from './routes/ShopPage';
import WatchPage from './routes/WatchPage';
import ExpertForm from './routes/ExpertForm';

export default function Root() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sell" element={<SellPage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/shop/:id" element={<WatchPage />} />
      <Route path="/mint" element={<CreatePage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/expert" element={<ExpertPage />} />
      <Route path="/expert/:id" element={<ExpertForm />} />
    </Routes>
  );
}
