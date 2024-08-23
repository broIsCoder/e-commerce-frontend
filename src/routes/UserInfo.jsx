import React from 'react';
import { useSelector } from 'react-redux';
import formatDate from '../utils/dateFormatter';
import nubmerFormatter from '../utils/numberFormatter';
import { User, Mail, Calendar, RefreshCw, Briefcase, ShoppingCart, ShoppingBag} from 'lucide-react';

const UserInfo = () => {
  const userInfo = useSelector((state) => state.userInfo.user);

  const InfoItem = ({ icon, title, value }) => (
    <div className="flex items-start space-x-3">
      <span className='bg-gray-800 p-2 rounded-full'>
        {icon}
      </span>
      <div>
        <h2 className="text-sm font-medium text-black dark:text-gray-400">{title}</h2>
        <p className="mt-1 text-lg font-semibold text-black dark:text-white">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-500 pb-6">
        <InfoItem
          icon={<User className="w-6 h-6 text-blue-400" />}
          title="Username"
          value={userInfo?.username || 'N/A'}
        />
        <InfoItem
          icon={<Mail className="w-6 h-6 text-green-400" />}
          title="Email"
          value={userInfo?.email || 'N/A'}
        />

        <InfoItem
          icon={<ShoppingCart className="w-6 h-6 text-orange-400" />}
          title="Cart"
          value={nubmerFormatter(userInfo?.cart.items.length) || 'N/A'}
        />
        <InfoItem
          icon={<ShoppingBag className="w-6 h-6 text-blue-400" />}
          title="Orders"
          value={nubmerFormatter(userInfo?.orders?.filter(order => order?.orderStatus !== 'Cancelled').length) || 'N/A'}
        />
        <InfoItem
          icon={<Calendar className="w-6 h-6 text-yellow-400" />}
          title="Created At"
          value={formatDate(userInfo?.createdAt) || 'N/A'}
        />
        <InfoItem
          icon={<RefreshCw className="w-6 h-6 text-purple-400" />}
          title="Updated At"
          value={formatDate(userInfo?.updatedAt) || 'N/A'}
        />

        <div className="md:col-span-2">
          <div className="flex items-start space-x-3 ">
            <span className='bg-gray-800 p-2 rounded-full'>
              <Briefcase className="w-6 h-6 text-red-400" />
            </span>
            <div>
              <h2 className="text-sm font-medium text-black dark:text-gray-400">Roles</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {userInfo?.roles?.employee && (
                  <span className="px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-full">
                    Employee
                  </span>
                )}
                {userInfo?.roles?.user && (
                  <span className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">
                    User
                  </span>
                )}
                {(!userInfo?.roles?.employee && !userInfo?.roles?.user) && (
                  <span className="text-gray-500 italic">No roles assigned</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;