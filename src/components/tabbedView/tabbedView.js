import React, { Component } from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';

import Tabs from '../tabs/tabs';

import './tabbedView.styl';

class TabbedView extends Component {
  constructor(props) {
    super(props);

    const firstView = R.head(props.views);

    this.state = {
      activeTabId: firstView ? firstView.id : null
    };

    // bind context
    this.onSelectTab = this.onSelectTab.bind(this);
  }

  onSelectTab(id) {
    this.setState({
      activeTabId: id
    });

    const { onSelectTab } = this.props;
    onSelectTab(id);
  }

  render() {
    const { views } = this.props;

    return (
      <div className="tabbedView">
        <Tabs
          activeId={this.state.activeTabId}
          ids={views.map(vv => vv.id)}
          onSelectTab={this.onSelectTab}
        />
        {
          views.map((view) => {
            const shouldShow =
              this.state.activeTabId === view.id;

            const style = {
              transform: shouldShow ? 'translate3d(0,0,0)' : 'translate3d(-100%,0,0)'
            };

            return (
              <div className="tabbedViewContainer" key={view.id} style={style}>
                { view.component }
              </div>
            );
          })
        }
      </div>
    );
  }
}

TabbedView.propTypes = {
  views: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      component: PropTypes.node
    })
  ),
  onSelectTab: PropTypes.func
};

TabbedView.defaultProps = {
  views: [],
  activeId: null,
  onSelectTab: () => {}
};

export default TabbedView;
