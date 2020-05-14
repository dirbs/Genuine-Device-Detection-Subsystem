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
import { Row, Col, Card, CardBody, CardHeader, Badge } from 'reactstrap';
import i18n from './../../i18n';
import { Link } from "react-router-dom";
import { getDashboard } from './../../actions/dashboardActions';
import { connect } from "react-redux";
import { updateTokenHOC } from './../../utilities/helpers';
import { getOEMs } from './../../actions/oemActions';

class Dashboard extends Component {

  componentDidMount() {
    updateTokenHOC(this.props.getDashboard, this.props.auth.kc);
    updateTokenHOC(this.props.getOEMs, this.props.auth.kc);
  }

  render() {
    const { approved_logins, pending_logins, total_tacs, unique_brands } = this.props.dashboardData.data;
    return (
      <div className="animated fadeIn position-relative">
        <Row>
          <Col sm={6} xl={3}>
            <ul className="dashbx pendbx">
              <li>
                <div className="iconbx">
                  <svg className="icon-registration" fill="#3f51b5">
                    <use xlinkHref="./img/svg-symbol.svg#regRequest"></use>
                  </svg>
                </div>
                <h4><span>{i18n.t('dashboardLabel.approved')}</span>{i18n.t('dashboardLabel.logins')}</h4>
              </li>
              <hr />
              <li>
                <h3>{approved_logins} <small>{i18n.t('dashboardLabel.requests')}</small></h3>
              </li>
            </ul>
          </Col>
          <Col sm={6} xl={3}>
            <ul className="dashbx awaitbx">
              <li>
                <div className="iconbx">
                  <svg className="icon-registration" fill="#ffc107">
                    <use xlinkHref="./img/svg-symbol.svg#awaitingDoc"></use>
                  </svg>
                </div>
                <h4><span>{i18n.t('dashboardLabel.pending')} </span>{i18n.t('dashboardLabel.logins')}</h4>
              </li>
              <hr />
              <li>
                <h3>{pending_logins} <small>{i18n.t('dashboardLabel.requests')}</small></h3>
              </li>
            </ul>
          </Col>
          <Col sm={6} xl={3}>
            <ul className="dashbx inrevibx">
              <li>
                <div className="iconbx">
                  <svg className="icon-registration" fill="#6c757d">
                    <use xlinkHref="./img/svg-symbol.svg#inrevReg"></use>
                  </svg>
                </div>
                <h4><span>{i18n.t('dashboardLabel.unique')} </span>{i18n.t('dashboardLabel.brands')}</h4>
              </li>
              <hr />
              <li>
                <h3>{unique_brands} <small>{i18n.t('dashboardLabel.requests')}</small></h3>
              </li>
            </ul>
          </Col>
          <Col sm={6} xl={3}>
            <ul className="dashbx pendbx">
              <li>
                <div className="iconbx">
                  <svg className="icon-registration" fill="#3f51b5">
                    <use xlinkHref="./img/svg-symbol.svg#inrevReg"></use>
                  </svg>
                </div>
                <h4><span>{i18n.t('total')} </span>TACs</h4>
              </li>
              <hr />
              <li>
                <h3>{total_tacs} <small>{i18n.t('dashboardLabel.requests')}</small></h3>
              </li>
            </ul>
          </Col>
        </Row>
        <br />
        <Card>
          <CardHeader>
    <b>{i18n.t('dashboardLabel.pending')} {i18n.t('dashboardLabel.logins')}</b>
          </CardHeader>
          <CardBody>
            {this.props.OEMData.oemList ?
              <table className="table table-sm table-bordered table-hover mt-3 table-mobile-primary table-search">
                <thead className="thead-light">
                  <tr>
                    <th>OEM ID</th>
                    <th>{i18n.t('name')}</th>
                    <th>{i18n.t('status')}</th>
                    <th>{i18n.t('requests.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.OEMData.oemList.filter((elem, index) => elem.oem_status === 'new-request' ? true : false).slice(0, 6).map((data, i) => {
                    return <tr key={i}>
                      <td data-label="OEM ID">{data.oem_id}</td>
                      <td data-label={i18n.t('name')}>{data.oem_name}</td>
                      <td data-label={i18n.t('status')}><Badge color="warning">{i18n.t('pending')}</Badge>
                      </td>
                      <td data-label={i18n.t('view')}> <Link to={{
                        pathname: '/account-approval'
                      }}>{i18n.t('view')}</Link>
                      </td>
                    </tr>
                  })
                  }
                </tbody>

              </table> :
              <p>{i18n.t('noRequestFound')}</p>
            }
          </CardBody>
        </Card>
      </div>
    );
  }
}

const mapPropsToState = state => ({
  auth: state.auth,
  dashboardData: state.dashboard,
  OEMData: state.oem
});

export default connect(mapPropsToState, { getDashboard, getOEMs })(Dashboard);