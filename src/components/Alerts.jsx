import React from 'react';
import AlertItem from './AlertItem';
import { useSelector } from 'react-redux';

const Alerts = () => {
  const alerts = useSelector((state)=>state.alerts.alertsList);
  return (
    <div className="fixed gap-4 bottom-4 left-4 z-50 space-y-reverse flex flex-col-reverse">
      {alerts.map((alert) => (
        <AlertItem key={alert.id} alert={alert} />
      ))}
    </div>
  );
};

export default Alerts;
