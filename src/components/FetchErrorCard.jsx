import React from 'react';
import PropTypes from 'prop-types';
import { RetryIcon ,CloudOffIcon } from '../icons/Svg';

/**
 * A modern card component to display a data fetching error.
 */
const FetchErrorCard = ({ errorMessage, onRetry }) => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-xl w-full mx-auto border border-gray-100">
      <div className="flex flex-col items-center text-center">
        
        {/* Icon */}
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
          <CloudOffIcon />
        </div>

        {/* Text Content */}
        <h3 className="text-xl font-semibold text-slate-800">
          Unable to Fetch Data
        </h3>
        <p className="mt-2 text-slate-500">
          {errorMessage}
        </p>

        {/* Action Button */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-6 flex items-center justify-center rounded-lg bg-slate-800 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500"
          >
            <RetryIcon /> 
            &nbsp; Try Again
          </button>
        )}
      </div>
    </div>
  );
};

FetchErrorCard.propTypes = {
  /** A function to be called when the user clicks the "Try Again" button. */
  onRetry: PropTypes.func.isRequired,
};

export default FetchErrorCard;