import R from 'ramda';
import React from 'react';
import './breadcrumbs.styl';

const Breadcrumbs = ({ path }) => {
  const components = R.splitEvery(2, path);
  console.log('>>> Path is: ', components);

  return (
    <div className="breadcrumbs">
      { /* path.join('/') */ }
      {
        components.map(component => (
          <div className="breadcrumbComponent" key={component.join('/')}>
            <div className="breadcrumbSlash">
              /
            </div>
            <button className="breadcrumbPath">
              {component.join(' ')}
            </button>
          </div>
        ))
      }
      <div className="breadcrumbsSpacer"></div>
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
