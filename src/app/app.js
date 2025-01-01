import React from 'react';
import PropTypes from "prop-types";
import {withRouter,Route,Redirect,Link} from 'react-router-dom';
import {Collapse} from 'reactstrap';
import * as l10n from '../lib/l10n';
import {APP_TOP_FRAME_ID} from '../lib/constants';
import EventHandler from '../lib/EventHandler'
import {NavLink} from './uti/util';
import SecurityBG from "../components/utils/SecurityBG"
import Terminate from "../components/util/Terminate"
import Dashboard from "./dashboard/Dashboard"
import Encrypt from "./encrypt/Encrypt"
import Decrypt from "./decrypt/Decrypt"
import Settings from "./settings/Settings";
import AnalyticsConsent from './settings/AnalyticsConsent'

import './app.css';

l10n.register([
    'decrypt_home',
    'encrypt_home',
    'feature_banner_new_security_background_btn',
    'feature_banner_new_security_background_text',
    'keyring_header',
    'options_docu',
    'options_home',
    'options_title'
  ]);

  export let port; //EventHandler

  export const AppOptions=React.createContext({gnupg:false});

  class App extends React.Component{

    constructor(props){
        super(props);
        const query = new URLSearchParams(document.location.search);

        port=EventHandler.connect(`app-${this.getId(query)}`);
        port.on('terminate',this.terminate);
        l10n.mapToLocal();

        document.title = l10n.map.options.title;

        //set initial state
        this.state = {
            prefs:null,
            gnupg:false,
            collapse:false,
            terminate:false,
            version:''
        };
        this.handleChangePrefs = this.handleChangePrefs.bind(this);
        this.toggleNavbar=this.toggleNavbar.bind(this);
    }

    getId(query){
        if(window.top === window.self){
            return APP_TOP_FRAME_ID;
        }
        else{
            let id=query.get('id');
            if(id === APP_TOP_FRAME_ID){
                id='';
            }
            return id;
        }
    }
    terminate(){
        this.setState({terminate:true},()=>this.port.disconnect());
    }
    componentDidMount(){
        port.send('get-version').then(version => this.setState({version}));
        port.send('get-prefs').then(prefs=>this.setState({prefs}));
        port.send('get-gnupg-status').then(gnupg=>this.setState({gnupg}));

    }

    handleChangePrefs(update){
        return new Promise(resolve =>{
            port.send('set-prefs',{prefs:update}).then(()=>port.send('get-prefs').then(prefs=> this.setState({prefs},()=>{resolve()})));
        
        });
    }
    render(){
        return(
            <SecurityBG port={port}>
                <Route exact path="/" render={()=><Redirect to="/keyring"/>}/>
                <Route exact path="/encryption" render={()=><Redirect to="/encryption/file-encrypt"/>}/>
                <Route exact path="/settings" render={()=><Redirect to="/settings/general"/>}/>

                <nav className="navbar flex-column fixed-top navbar-expand-md navbar-light bg-white">
                    <div className="container-lg py-2">
                        <Link to="/dashboard" className="navbar-brand">
                        <img src="../img/Mail.Enc/logo.png" width="175" height="32" className="d-inline-block align-top" alt=""/>
                        <h1 className="navbar-brand">Mail.Enc</h1>
                        </Link>
                        <button className="navbar-toggler" type="button" onClick={this.toggleNavbar}>
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <Collapse isOpen={this.state.collapse} className="navbar-collapse">
                        <ul className="navbar-nav mr-auto">
                            <NavLink to="/keyring">
                            Key Management
                            </NavLink>
                            <NavLink to="/encrypt">
                            Encrypt
                            </NavLink>
                            <NavLink to="/decrypt">
                            Decrypt
                            </NavLink>
                            <NavLink to="/settings">
                            Settings
                            </NavLink>

                        </ul>
                        
                        </Collapse>
                    </div>
                    {(this.state.prefs && !this.state.prefs.security.personalized && this.props.location.pathname !== '/settings/security-background') && <div className="feature-banner d-flex align-items-center justify-content-center align-self-stretch p-3"><span className="mr-3">{l10n.map.feature_banner_new_security_background_text}</span><Link to="/settings/security-background" className="btn btn-sm btn-primary">{l10n.map.feature_banner_new_security_background_btn}</Link></div>}
                </nav>
                <main className={`container-lg ${(this.state.prefs && !this.state.prefs.security.personalized && this.props.location.pathname !== '/settings/security-background') ? 'featured' : ''}`} role="main">
          <AppOptions.Provider value={{gnupg: this.state.gnupg}}>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/keyring" render={() => <Keyring prefs={this.state.prefs} />} />
            <Route path="/encrypt" component={Encrypt} />
            <Route path="/decrypt" component={Decrypt} />
            <Route path="/settings" render={() => <Settings prefs={this.state.prefs} onChangePrefs={this.handleChangePrefs} />} />
            <Route path="/analytics-consent" component={AnalyticsConsent} />
          </AppOptions.Provider>
        </main>
        <footer className="container-lg">
          <div className="d-flex justify-content-between">
            <p><span className="pr-2">&copy; 2024</span><a className="text-reset" href="https://mailvelope.com/about" target="_blank" rel="noreferrer noopener" tabIndex="0">Mailvelope GmbH</a></p>
            <p id="version" className="d-sm-none d-md-block">{this.state.version}</p>
          </div>
        </footer>
        {this.state.terminate && <Terminate />}

            </SecurityBG>
        );
    }

  }

App.propTypes = {
    location: PropTypes.object
  };
  
  export default withRouter(App);
  
  /**
   * Retrieve slot ID from query parameter and get slot data from background
   * @return {Promise.<String>}
   */
  export function getAppDataSlot() {
    const query = new URLSearchParams(document.location.search);
    const slotId = query.get('slotId');
    return port.send('get-app-data-slot', {slotId});
  }