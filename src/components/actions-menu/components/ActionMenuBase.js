import React from "react"
import PropTypes from "prop-types"
import * as l10n from '../../../lib/l10n'

l10n.register([
    'action_menu_activate_current_tab',
    'action_menu_dashboard_description',
    'action_menu_dashboard_label',
    'action_menu_file_encryption_description',
    'action_menu_file_ecryption_label',
    'action_menu_keyring_description',
    'action_menu_keyring_label',
    'action_menu_primary_menu_aria_label',
    'action_menu_reload_extension_scripts',
    'action_menu_review_security_logs_description',
    'action_menu_review_security_logs_label'
]);

export default function ActionMenuBase(props){

    return(
        <>
        <div className="action-menu-content list-group list-group-flush" role="menu" aria-label={l10n.map.action_menu_primary_menu_aria_label}>
        <a className="action-menu-item list-group-item list-group-item-action" id="dashboard" role="menuitem" onClick={props.onMenuItemClickHandler}>
           <div className="action-menu-item-title d-flex align-items-center"><img src="../../img/Mail.Enc/dashboard.svg" role="presentation" ></img><strong>{l10n.map.action_menu_dashboard}</strong></div>
            <p>{l10n.map.action_menu_dashboard_description}</p>
        </a>
        <a className="action-menu-item list-group-item list-group-item-action" id="encrypt-file" role="menuitem" onClick={props.onMenuItemClickHandler}>
        <div className="action-menu-item-title d-flex align-items-center"><img src="../../img/Mail.Enc/keyring.svg" role="presentation" ></img><strong>Key Management</strong></div>

            <p>{l10n.map.action_menu_keyring_description}</p>
        </a><a className="action-menu-item list-group-item list-group-item-action" id="dashboard" role="menuitem" onClick={props.onMenuItemClickHandler}>
        <div className="action-menu-item-title d-flex align-items-center"><img src="../../img/Mail.Enc/encryption.svg" role="presentation" ></img><strong>Encrypt</strong></div>

            <p>{l10n.map.action_menu_encryption_description}</p>
        </a>
        </div>
        </>
    )
}
ActionMenuBase.propTypes ={
    onMenuItemClickHandler : PropTypes.func
}