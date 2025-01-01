/**
 * Copyright (C) 2017 Mailvelope GmbH
 * Licensed under the GNU Affero General Public License version 3
 */

import React, {Component} from 'react';
import * as l10n from '../../../lib/l10n';
import EventHandler from '../../../lib/EventHandler';
import ActionMenuBase from './ActionMenuBase';
import ActionMenuSetup from './ActionMenuSetup';
import '../ActionMenu.scss';

l10n.register([
  'action_menu_help',
  'action_menu_all_options'
]);
l10n.mapToLocal();

class ActionMenuWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSetupDone: true
    };
    this.port = EventHandler.connect('menu-59edbbeb9affc4004a916276');
  }

  componentDidMount() {
    this.init();
  }

  async init() {
    const {isSetupDone} = await this.port.send('get-is-setup-done');
    this.setState({isSetupDone});
  }

  onMenuItemClick(e) {
    const itemClicked = e.currentTarget;
    if (itemClicked === '' || itemClicked.id === '') {
      return false;
    }
    this.port.emit('browser-action', {action: itemClicked.id});
    this.hide();
  }

  hide() {
    window.close();
  }

  render() {
    let actionMenuContent = null;
    if (!this.state.isSetupDone) {
      actionMenuContent = <ActionMenuSetup onMenuItemClickHandler={e => this.onMenuItemClick(e)} />;
    } else {
      actionMenuContent = <ActionMenuBase onMenuItemClickHandler={e => this.onMenuItemClick(e)} />;
    }

    return (
      <div className={`action-menu ${this.state.isSetupDone ? '' : 'action-menu-setup'}`}>
        <div className="action-menu-wrapper card">
          <div className="action-menu-header card-header d-flex">
            <img src="../../img/Mail.enc/icon.png" width="111" height="20" className="d-inline-block mr-auto" alt="" />
            
          </div>
          {actionMenuContent}
        </div>
      </div>
    );
  }
}

export default ActionMenuWrapper;
