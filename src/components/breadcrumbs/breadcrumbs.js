import R from 'ramda';
import React from 'react';
import isUUID from 'uuid-validate';
import pluralize from 'pluralize';
import _ from 'lodash';
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

class Breadcrumbs extends React.Component {
  render() {
    const { path, sliceHistory } = this.props;
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
                { /*
                  Format the path component to be more human friendly:
                  - Pluralize and capitalize strings (assumes string names are model names)
                  - Don't do anything to numbers or UUIDs
                  - Ignore the special case 'New' which corresponds to new doc
                  - Join components with a space (e.g. Widgets 0)
                */}
                {component.map((cc) => {
                  if (typeof cc === 'string' && !isUUID(cc)) {
                    if (cc === 'new') {
                      return 'New';
                    }
                    return _.startCase(pluralize(cc));
                  }

                  return cc;
                }).join(' ')}
              </button>
            </div>
          ))
        }

        { /* Clearfix */ }
        <div className="breadcrumbsSpacer" />
      </div>
    );
  }
}

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
