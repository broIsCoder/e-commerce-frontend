import React, { useEffect } from 'react';
import { removeAlertWithDelay } from '../redux-slices/alertsSlice';
import { useDispatch } from 'react-redux';
import { X } from 'lucide-react';

const AlertItem = ({ alert }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeAlertWithDelay(alert.id))
    }, 3000); // Start exit animation after 3000ms

    return () => clearTimeout(timer);
  }, [alert.id, removeAlertWithDelay]);

  const handleRemoveClick = () => {
    dispatch(removeAlertWithDelay(alert.id));
  };

  return (
    <div
      className={`alert flex gap-4 items-center justify-between alert-${alert.type} p-2 rounded-lg shadow-lg transition-all duration-500 ease-in-out transform ${alert.type === 'info' ? 'bg-blue-200 text-blue-800' :
          alert.type === 'success' ? 'bg-green-200 text-green-800' :
            alert.type === 'warning' ? 'bg-yellow-200 text-yellow-800' :
              'bg-red-200 text-red-800'
        } ${alert.exiting ? 'animate-fadeOutRight' : 'animate-fadeInUp'}`}
    >
      <div>
        {alert.message}
      </div>
      <div onClick={handleRemoveClick} className="size-8 rounded-full border-black border-2 bg-white flex justify-center items-center cursor-pointer">
        <X scale={80}/>
      </div>
    </div>
  );
};

export default AlertItem;
