import R from 'ramda';
import React from 'react';
import './breadcrumbs.styl';

/**
 * A component for rendering a path
 * as a series of clickable breadcrumb links.
 */

const Breadcrumbs = ({ path }) => {
  const components = R.splitEvery(2, path);

  return (
    <div className="breadcrumbs">
      {
        components.map((component, index) => (
          <div className="breadcrumbComponent" key={component.join('/')}>
            <div className="breadcrumbSlash">
              /
            </div>
            <button
              className="breadcrumbPath"
              onClick={() => {
                console.log('Clicked path component:', component);
              }}
            >
              {component.join(' ')}
            </button>
          </div>
        ))
      }

      { /* Clearfix */ }
      <div className="breadcrumbsSpacer" />
    </div>
  );
};

Breadcrumbs.defaultProps = {
  path: []
};

Breadcrumbs.propTypes = {
  path: React.PropTypes.array
};

export default Breadcrumbs;
