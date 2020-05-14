/*
Copyright (c) 2018-2019 Qualcomm Technologies, Inc.
All rights reserved.
Redistribution and use in source and binary forms, with or without modification, are permitted (subject to the limitations in the 
disclaimer below) provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer 
      in the documentation and/or other materials provided with the distribution.
    * Neither the name of Qualcomm Technologies, Inc. nor the names of its contributors may be used to endorse or promote 
      products derived from this software without specific prior written permission.
    * The origin of this software must not be misrepresented; you must not claim that you wrote the original software. If you use 
      this software in a product, an acknowledgment is required by displaying the trademark/log as per the details provided 
      here: https://www.qualcomm.com/documents/dirbs-logo-and-brand-guidelines
    * Altered source versions must be plainly marked as such, and must not be misrepresented as being the original software.
    * This notice may not be removed or altered from any source distribution.
NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED BY THIS LICENSE. THIS SOFTWARE IS PROVIDED 
BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT 
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO 
EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, 
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; 
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN 
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS 
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { Helmet } from 'react-helmet';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';
import DeviceInfoEnhanced from '../../views/DeviceInfo/DeviceInfo'
import { I18n, translate } from 'react-i18next';
import { Provider } from "react-redux";
import store from "../../store";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class PublicRoutes extends Component {

  constructor(props) {
    super(props);
    this.state = {
      lang: 'en'
    }
    this.changeLanguage = this.changeLanguage.bind(this);
  }

  componentDidMount() {
    this.setState({
      lang: localStorage.getItem('i18nextLng')
    })
  }

  changeLanguage(lng) {
    const { i18n } = this.props;
    i18n.changeLanguage(lng);
    this.setState({
      lang: lng
    })
  }

  render() {
    return (
      <I18n ns="translations">
        {
          (t, { i18n }) => (
            <div className="app">
              <Helmet>
                <html lang={this.state.lang} />
                <title>{i18n.t('title')}</title>
                <body dir={this.state.lang === 'ar' ? 'rtl' : 'ltr'} />
              </Helmet>
              <Header {...this.props} switchLanguage={this.changeLanguage} />
              <div className="app-body">
                <Sidebar {...this.props} isDisabled={true}/>
                <main className="main">
                  <br/>
                  <Container fluid>
                    <ToastContainer
                      position="top-left"
                      hideProgressBar />
                    <Provider store={store}>
                          <DeviceInfoEnhanced />
                    </Provider>
                  </Container>
                </main>
              </div>
              <Footer />
            </div>
          )
        }
      </I18n>
    );
  }
}

export default translate('translations')(PublicRoutes);
