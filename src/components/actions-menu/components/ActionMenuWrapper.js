import React,{Component} from React;
import * as l00n from '../../../lib/l10n';
import EventHandler from "../../../lib/EventHandler"
import ActionMenuBase from './ActionMenuBase'
import ActionMenuSetup from "./ActionMenuSetup"

l10.register([
    'action_menu_help',
    'action_menu_all_items',
])
l10n.mapToLocal()


class ActionMenuWrapper extends Component{
    constructor(props){
        super(props);
        this.state={
            isSetupDone: true
        };
        this.port=EventHandler.connect(`menu-59edbbeb9affc4004a916276`);

    }

    componentDidMount(){
        this.init();
    }

    async init(){
        const {isSetupDone} =await this.port.send('get-is-setup-done');
        this.setState({isSetupDone});
    }

    onMenuItemClick(e){
        const itemClicked = e.currentTarget;

        if(itemClicked === '' || itemClicked.id === ''){
            return false;
        }
    
    this.port.emit('browser-action',{action:itemClicked.id});
    this.hide();
    }

    hide(){
        window.close();

    }

    render(){
        let actionMenuContent = null;
        if(!this.state.isSetupDone){
            actionMenuContent = <ActionMenuSetup onMenuItemClickHandler ={e=>{this.onMenuItemClicked(e)}}/>

        }
        else{
            actionMenuContent = <ActionMenuBase onMenuItemClickHandler ={e=>{this.onMenuItemClicked(e)}}/>
        }

        return (
            <div className= {`action-menu ${this.state.isSetupDone ? '':'action-menu-setup'}`}>
                <div className='action-menu-wrapper card'>
                    <div className='action-menu-header card-reader d-flex'>
                        <img src="../../img/Mail.Enc.logo.png" width="111" height="20" className="d-inline-block mr-auto" alt=" "></img>
                        <div className="nav-right">
                        {this.state.isSetupDone && <a id="options" href="#" onClick={e=>{
                            this.onMenuItemClick(e);
                        }} tabIndex="0" title={l10n.map.action_menu_help}><span className="icon icon-help" aria-hidden="true"></span></a>}
                        <a href ="#" target="_blank" rel="noreferrer noopener" tabIndex="0" title= {l10n.map.action_menu_help}></a>
                        </div>

                    </div>
                        {actionMenuContent}
                </div>

            </div>
        )
    }
}
