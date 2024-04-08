import React from 'react';

/**
 * Determine which to render, a React component or element.
 * @param {React.ComponentType<any> | React.ReactElement} Component - The component to render.
 * @returns {React.ReactElement} The rendered component or element.
 */

export const renderPropComponent = (
  Component?: React.ComponentType<any> | React.ReactElement<any> | null
) => {
  // Check if the component is a valid React element and render it if so
  if (React.isValidElement(Component)) {
    return Component;
  }
  // Otherwise, check if the component is a function or class component and invoke it
  else if (typeof Component === 'function') {
    return <Component />;
  }
  // Return null if none of the above conditions are met
  return null;
};
