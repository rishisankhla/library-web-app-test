import React from 'react';

const Notification = ({ message, type }) => {
  return (
    <div className={`bg-${type}-100 border-t-4 border-${type}-500 rounded-b text-${type}-900 px-4 py-3 shadow-md`} role="alert">
      <div className="flex">
        <div className="py-1">
          <svg className={`fill-current h-6 w-6 text-${type}-500 mr-4`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            {type === 'success' && (
              <path fillRule="evenodd" d="M10 0a10 10 0 0110 10c0 2.761-1.137 5.25-2.965 7.052a9.976 9.976 0 01-7.35 3.134h-.067a9.976 9.976 0 01-7.35-3.134C1.137 15.25 0 12.761 0 10c0-5.523 4.477-10 10-10zm0 16a1.1 1.1 0 100-2.2 1.1 1.1 0 000 2.2zm1.555-11.456a1.1 1.1 0 00-1.555-1.555l-4.95 4.95a1.1 1.1 0 001.555 1.555l3.844-3.844 3.844 3.844a1.1 1.1 0 001.555-1.555l-4.95-4.95z" clipRule="evenodd"/>
            )}
            {type === 'error' && (
              <path fillRule="evenodd" d="M10 0a10 10 0 0110 10c0 5.523-4.477 10-10 10S0 15.523 0 10 4.477 0 10 0zm0 18a8 8 0 100-16 8 8 0 000 16zm-.707-11.293a1 1 0 011.414 0l2.121 2.121 2.121-2.121a1 1 0 111.414 1.414L13.414 10l2.121 2.121a1 1 0 01-1.414 1.414L12 11.414l-2.121 2.121a1 1 0 01-1.414-1.414L10.586 10l-2.121-2.121a1 1 0 010-1.414 1 1 0 011.414 0L12 8.586l2.121-2.121z" clipRule="evenodd"/>
            )}
          </svg>
        </div>
        <div>
          <p className={`font-bold`}>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Notification;
