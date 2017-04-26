import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './tabs.styl';

class Tabs extends Component {
  constructor() {
    super();

    // bind context
    this.onSelectTab = this.onSelectTab.bind(this);
  }

  onSelectTab(id) {
    const { onSelectTab } = this.props;
    onSelectTab(id);
  }

  render() {
    const { activeId, ids } = this.props;
    return (
      <div className="tabs">
        { ids.map((id, ii) =>
          (
            <button
              key={`tab-${id}-${ii}`}
              className={`tab ${id === activeId ? 'active' : ''}`}
              onClick={() => this.onSelectTab(id)}
              style={{
                width: `${(1 / ids.length) * 100}%`
              }}
            >
              {id}
            </button>
          )
        )}
      </div>
    );
  }
}

Tabs.propTypes = {
  ids: PropTypes.arrayOf(PropTypes.string),
  activeId: PropTypes.string,
  onSelectTab: PropTypes.func
};

Tabs.defaultProps = {
  ids: [],
  activeId: null,
  onSelectTab: () => {}
};

export default Tabs;
