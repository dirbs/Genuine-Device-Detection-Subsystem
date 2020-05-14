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
import { Input, Label, Card, CardHeader, Col, Row } from 'reactstrap';
import { getPendingIMEI, downloadPendingIMEI, singleInfoSubmission, BulkUploadIMEIInfo } from './../../actions/oemActions';
import { connect } from "react-redux";
import { updateTokenHOC } from './../../utilities/helpers';
import { ITEMS_PER_PAGE, PAGE_LIMIT } from './../../utilities/constants';
import TableLoader from './../../components/Loaders/TableLoader';
import Pagination from "react-js-pagination";
import DataTableInfo from './../../components/DataTable/DataTableInfo';
import i18n from "i18next";
import { EnhancedModalForm } from './InfoSubmission';
import { EnhancedModalBulkForm } from './BulkUpload';

class OEMHomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pendingIMEIList: [],
      start: 0,
      limit: PAGE_LIMIT,
      data: null,
      loading: true,
      activePage: 1,
      totalCases: 0,
      apiFetched: false,
      options: ITEMS_PER_PAGE,
      isIMEIInfoSubmited: false,
      enableModal: false,
      enableModalBulk: false
    }
  }

  componentDidMount() {
    updateTokenHOC(this.props.getPendingIMEI, this.props.auth.kc, this.preparePendingIMEIParams(this.state.start, this.state.limit));
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.oemIMEIData.isIMEIInfoSubmited !== prevState.isIMEIInfoSubmited) {
      let params = {
        loginId: nextProps.auth.userDetails.sub,
        start: prevState.start,
        limit: prevState.limit
      };
      updateTokenHOC(nextProps.getPendingIMEI, nextProps.auth.kc, params);
      return {
        enableModal: false
      }
    }
    if (nextProps.oemIMEIData.pendingIMEIList !== prevState.pendingIMEIList) {
      return {
        pendingIMEIList: nextProps.oemIMEIData.pendingIMEIList,
        loading: nextProps.oemIMEIData.loading,
        totalCases: nextProps.oemIMEIData.IMEIcount
      }
    }
    return null
  }

  preparePendingIMEIParams = (start, limit) => {
    let params = {
      loginId: this.props.auth.userDetails.sub,
      start: start,
      limit: limit
    };
    return params;
  }

  toggleModal = (imei, e) => {
    e.preventDefault()
  }

  handlePageClick = (page) => {
    let a1 = 1;
    let d = this.state.limit;
    let start = a1 + d * (page - 1) - 1;

    this.setState({ start: start, activePage: page, loading: true }, () => {
      updateTokenHOC(this.props.getPendingIMEI, this.props.auth.kc, this.preparePendingIMEIParams(this.state.start, this.state.limit));
    });
  }

  handleLimitChange = (e) => {
    e.preventDefault();
    let limit = parseInt(e.target.value);
    let currentPage = Math.ceil((this.state.start + 1) / limit);
    this.setState({ limit: limit }, () => {
      this.handlePageClick(currentPage);
    });
  }

  toggleModal = (param, e) => {
    e.preventDefault()
    if (param === 'bulkUpload') {
      this.setState({
        enableModalBulk: true
      })
    }
    else {
      this.setState({
        selectedIMEI: param
      }, () => {
        this.setState({
          enableModal: true
        })
      })
    }
  }

  closeModal = () => {
    this.setState({
      enableModal: false
    })
  }

  closeModalBulk = () => {
    this.setState({
      enableModalBulk: false
    })
  }

  render() {
    const itemOptions = this.state.options.map((item) => {
      return <option key={item.value} value={item.value}>{item.label}</option>
    })
    return (
      <div>
        <ul className="listbox">
          {
            (this.state.loading)
              ?
              (
                <div>
                  <TableLoader />
                </div>
              )
              : this.state.pendingIMEIList.length > 0
                ?
                <div>
                  <Card className="mb-1">
                    <CardHeader className="border-bottom-0">
                      <b className="text-primary">{`IMEI ${i18n.t('count')}: ${this.state.totalCases}`}</b>
                    </CardHeader>
                  </Card>
                  <Row>
                    <Col xs={12} xl={4} className="order-xl-12 mt-3">
                      <div>
                        <div className="alert alert-info"><b> {i18n.t('missingInfo')}:</b>
                          <ul>
                            <li>{i18n.t('serialNumber')}</li>
                              <li>{i18n.t('color')}</li>
                              <li>{i18n.t('brand')}</li>
                              <li>{i18n.t('modelName')}</li>
                          </ul>
                        </div>
                      </div>
                    </Col>
                    <Col xs={12} xl={8} className="order-xl-1">
                      <table className="table table-sm table-bordered table-hover mt-3 table-mobile-primary table-search">
                        <thead className="thead-light">
                          <tr>
                            <th>IMEIs</th>
                            <th>{i18n.t('requests.actions')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.pendingIMEIList.map((data, i) => {
                            return <tr key={i}>
                              <td data-label="IMEIs">{data}</td>
                              <td data-label={i18n.t('requests.actions')}><button className="btn btn-link btn-sm" onClick={(e) => {
                                this.toggleModal(data, e)
                              }}>{i18n.t('enterMissingInformation')}</button></td>
                            </tr>
                          })
                          }
                        </tbody>
                      </table>
                      <EnhancedModalBulkForm
                        enable={this.state.enableModalBulk}
                        closeModal={this.closeModalBulk}
                        bulkUpload={(file) => updateTokenHOC(this.props.BulkUploadIMEIInfo, this.props.auth.kc, file)}
                      />
                      <EnhancedModalForm
                        enable={this.state.enableModal}
                        selectedIMEI={this.state.selectedIMEI}
                        closeModal={this.closeModal}
                        addSingleIMEIInfo={(data) => updateTokenHOC(this.props.singleInfoSubmission, this.props.auth.kc, data)}
                      />
                    </Col>

                  </Row>
                </div>
                :
                <Card className="mb-1">
                  <CardHeader className="border-bottom-0">
                    <b className="text-danger">{i18n.t('noRequestFound')}</b>
                  </CardHeader>
                </Card>
          }
        </ul>
        <div className="react-bs-table-pagination">
          {this.state.totalCases > 0 &&
            <div>
              <p>
                <button className="btn btn-link"
                  onClick={(e) => updateTokenHOC(this.props.downloadPendingIMEI, this.props.auth.kc, { loginName: this.props.auth.userDetails.preferred_username, loginId: this.props.auth.userDetails.sub })}>{i18n.t('requests.downloadDocuments')}</button>
              </p>
              <p>
                <button className="btn btn-primary btn-sm"
                        onClick={(e) => this.toggleModal('bulkUpload', e)}>{i18n.t('bulkUploadLink')}</button>
              </p>
            </div>
          }
          {(this.state.pendingIMEIList.length > 0 && this.state.totalCases > PAGE_LIMIT && !(this.state.loading)) &&
            <article className='data-footer'>
              <Pagination
                pageRangeDisplayed={window.matchMedia("(max-width: 767px)").matches ? 4 : 10}
                activePage={this.state.activePage}
                itemsCountPerPage={this.state.limit}
                totalItemsCount={this.state.totalCases}
                onChange={this.handlePageClick}
                innerClass="pagination"
              />
              <div className="hand-limit">
                <Label>{i18n.t('show')}</Label>
                <div className="selectbox">
                  <Input value={this.state.limit} onChange={(e) => {
                    this.handleLimitChange(e)
                  }}
                    type="select" name="select">
                    {itemOptions}
                  </Input>
                </div>
                <Label>{i18n.t('requests')}</Label>
              </div>
              <div className='start-toend'>
                <DataTableInfo start={this.state.start} limit={this.state.limit} total={this.state.totalCases} itemType={'requests'} />
              </div>
            </article>
          }
        </div>
      </div>
    );
  }
}

const mapPropsToState = state => ({
  auth: state.auth,
  oemIMEIData: state.oem
});

export default connect(mapPropsToState, { getPendingIMEI, downloadPendingIMEI, singleInfoSubmission, BulkUploadIMEIInfo })(OEMHomePage);
