import R from 'ramda';
import React from 'react';
import { connect } from 'react-redux';
import { slice } from '../../redux/actions/history';

import './breadcrumbs.styl';

/**
 * A component for rendering a path
 * as a series of clickable breadcrumb links.
 */

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  sliceHistory: (path) => {
    dispatch(slice(path));
  }
});

const Breadcrumbs = ({ path, sliceHistory }) => {
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
                const subPath = R.slice(0, index + 1, components);

                // Ignore clicks on last component (we're already on that crumb)
                if (index === components.length - 1) { return; }

                sliceHistory(subPath);
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
  path: [],
  sliceHistory: () => {}
};

Breadcrumbs.propTypes = {
  path: React.PropTypes.array,
  sliceHistory: React.PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Breadcrumbs);
