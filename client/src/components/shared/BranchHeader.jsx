import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BranchHeader = ({ breadcrumbs }) => {
  if (!breadcrumbs || breadcrumbs.length === 0) return null;

  return (
    <div className="flex items-center space-x-2 p-3 text-sm text-gray-500 bg-white border-b border-gray-100 overflow-x-auto">
      {breadcrumbs.map((crumb, index) => {
        if (!crumb || !crumb.label) return null;
        const isLast = index === breadcrumbs.length - 1;
        return (
          <React.Fragment key={crumb.label + index}>
            {isLast ? (
              <span className="font-semibold text-textMain whitespace-nowrap">{crumb.label}</span>
            ) : (
              <Link to={crumb.path || '/'} className="hover:text-textMain transition-colors whitespace-nowrap">
                {crumb.label}
              </Link>
            )}
            {!isLast && <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />}
          </React.Fragment>
        );
      })}
    </div>
  );
};
