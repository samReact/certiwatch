import React from 'react';
import CreateTable from './CreateTable';

export default function CreatePage({ marketplace, certificate }) {
  return (
    <div className="container">
      <CreateTable marketplace={marketplace} certificate={certificate} />
    </div>
  );
}
