import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';
import ExpertTable from '../components/ExpertTable';

export default function ExpertPage() {
  const navigate = useNavigate();
  const { isExpert } = useSelector((state) => state.eth);

  useEffect(() => {
    if (!isExpert) {
      navigate('/');
    }
  }, [isExpert, navigate]);

  return (
    <div className="container">
      <div style={{ marginBottom: 40 }}>
        <ExpertTable />
      </div>
    </div>
  );
}
