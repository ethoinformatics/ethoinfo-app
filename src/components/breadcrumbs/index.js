import R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';
import isUUID from 'uuid-validate';
import pluralize from 'pluralize';
import _ from 'lodash';
import { connect } from 'react-redux';
import { slice } from '../../redux/actions/history';
import { getById } from '../../redux/reducers/documents';
import { getSchema } from '../../schemas/main';

import './breadcrumbs.styl';

/**
 * A component for rendering a path
 * as a series of clickable breadcrumb links.
 */

// Redux setup
const mapStateToProps = (state, ownProps) =>
  ({
    // TODO: Use proper selector here
    docsById: state.docs.byId
  });

const mapDispatchToProps = dispatch => ({
  sliceHistory: (path) => {
    dispatch(slice(path));
  }
});

const isNumber = value => !isNaN(parseInt(value, 10)) && !isUUID(value);

class Breadcrumbs extends React.Component {
  render() {
    const { docsById, path, sliceHistory } = this.props;

    const pathComponents = R.tail(path.split('/'));

    const padded = pathComponents.reduce((acc, currentValue, ii, collection) => {
      const currentIsNumber = isNumber(currentValue);
      if (currentIsNumber) { return acc; }
      const nextValue = R.nth(ii + 1, collection);
      const nextIsNumber = isNumber(nextValue);
      if (nextIsNumber) { return [...acc, currentValue, nextValue]; }

      return [...acc, currentValue, ''];
    }, []);

    const components = R.splitEvery(2, padded);

    return (
      <div className="breadcrumbs">
        {
          components.map((component, index) => (
            <div className="breadcrumbComponent" key={component.join('/')}>
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
                  if (typeof cc === 'string' && !isUUID(cc) && !isNumber(cc)) {
                    if (cc === 'new') {
                      return 'New';
                    }
                    return _.startCase(pluralize(cc));
                  }

                  // Use friendly name string if possible.
                  if (isUUID(cc)) {
                    const doc = getById(docsById, cc);
                    if (doc) {
                      const schema = getSchema(doc.domainName);
                      const displayValue = schema.getFriendlyString(doc);
                      return displayValue;
                    } else {
                      return R.head(cc.split('-'));
                      return "New";
                    }
                  }

                  return cc;
                }).join(' ')}
              </button>
            </div>
          ))
        }

        { /* Clearfix */ }
        {/* <div className="breadcrumbsSpacer" /> */}
      </div>
    );
  }
}

Breadcrumbs.defaultProps = {
  path: '',
  sliceHistory: () => {}
};

Breadcrumbs.propTypes = {
  path: PropTypes.string,
  sliceHistory: PropTypes.func,
  domain: PropTypes.string
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Breadcrumbs);
