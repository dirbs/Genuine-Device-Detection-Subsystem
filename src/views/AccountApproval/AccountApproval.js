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
import { Button, Input, Label, ListGroup, ListGroupItem, InputGroup, InputGroupAddon, FormGroup } from 'reactstrap';
import { getBrands, getAssociatedBrands, associateBrands } from './../../actions/brandActions';
import { getOEMs } from './../../actions/oemActions';
import { connect } from "react-redux";
import { updateTokenHOC } from './../../utilities/helpers';
import Pagination from "react-js-pagination";
import { ITEMS_PER_PAGE, PAGE_LIMIT } from './../../utilities/constants';
import i18n from "i18next";
import { PointSpreadLoading } from 'react-loadingg';
import SimpleBar from 'simplebar-react';

class AccountApproval extends Component {
  constructor() {
    super();

    this.state = {
      start: 0,
      limit: 15,
      data: null,
      brandLoading: true,
      activePage: 1,
      brandsTotalCount: 0,
      apiFetched: false,
      options: ITEMS_PER_PAGE,
      OEMList: [],
      selectedOEM: { oemName: '', oemId: '' },
      selectedBrands: [],
      brandsList: [],
      brandsSearchParam: '',
      isSaveEnable: false,
      isShowSelected: false,
      oemCardHeight: window.innerHeight,
      brandClientPaginated: [],
      searchedSelectedTotal: 0
    };
  }
  componentDidMount() {
    updateTokenHOC(this.props.getOEMs, this.props.auth.kc);
    updateTokenHOC(this.props.getBrands, this.props.auth.kc, AccountApproval.prepareGetBrandsParams(this.state.start, this.state.limit, this.state.brandsSearchParam));
    window.addEventListener('resize', this.setOemCardHeight);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setOemCardHeight);
  }

  setOemCardHeight = () => {
    this.setState({ oemCardHeight: window.innerHeight });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.OEMData.oemList !== prevState.OEMList) {
      return {
        OEMList: nextProps.OEMData.oemList
      }
    }
    if (nextProps.brandData.data !== prevState.brandsList) {
      let garbage = nextProps.brandData.data[0] === "" && nextProps.brandData.data.shift();
      return {
        brandsList: nextProps.brandData.data,
        brandsTotalCount: nextProps.brandData.count,
        brandLoading: false
      }
    }
    if (nextProps.brandData.associatedBrandList !== prevState.selectedBrands) {
      const paginatedData = AccountApproval.updateClientPaginationData(nextProps.brandData.associatedBrandList, prevState.start, prevState.limit, prevState.brandsSearchParam);
      return {
        selectedBrands: nextProps.brandData.associatedBrandList,
        brandClientPaginated: paginatedData.paginatedArray,
        searchedSelectedTotal: paginatedData.count
      }
    }
    return null
  }

  static prepareGetBrandsParams = (start, limit, search) => {
    let params = {
      search: search,
      start: start,
      limit: limit
    };
    return params;
  }

  selectOEM = (oemId, oemName) => {
    if (oemId !== this.state.selectedOEM.oem_id) {
      let oem = this.state.selectedOEM
      oem.oemName = oemName;
      oem.oemId = oemId;
      this.setState({ selectedOEM: oem, isSaveEnable: false, brandClientPaginated: [] }, () => {
        updateTokenHOC(this.props.getAssociatedBrands, this.props.auth.kc, oemId);
        this.handlePageClick(1)
      });
    }
  }

  selectBrand = (elemName) => {
    let selectedBrandsArray = this.state.selectedBrands;
    if (selectedBrandsArray.includes(elemName)) {
      selectedBrandsArray.splice(selectedBrandsArray.indexOf(elemName), 1);
    }
    else {
      selectedBrandsArray.push(elemName);
    }
    this.setState({ selectedBrands: selectedBrandsArray, isSaveEnable: true })
  }

  handlePageClick = (page) => {
    let a1 = 1;
    let d = this.state.limit;
    let start = a1 + d * (page - 1) - 1;

    this.setState({ start: start, activePage: page, brandLoading: true }, () => {
      if (this.state.isShowSelected) {
        const paginatedData = AccountApproval.updateClientPaginationData(this.state.selectedBrands, this.state.start, this.state.limit, this.state.brandsSearchParam);
        this.setState({ brandClientPaginated: paginatedData.paginatedArray, searchedSelectedTotal: paginatedData.count, brandLoading: false })
      }
      else {
        updateTokenHOC(this.props.getBrands, this.props.auth.kc, AccountApproval.prepareGetBrandsParams(this.state.start, this.state.limit, this.state.brandsSearchParam));
      }
    });
  }

  static updateClientPaginationData = (selectedbrands, start, limit, search) => {
    let paginatedData = selectedbrands;
    if (search !== null && search !== undefined) {
      paginatedData = selectedbrands.filter((elem) => elem.includes(search))
    }
    let clientselectedCount = paginatedData.length;
    //this.setState({searchedSelectedTotal: paginatedData.length });
    paginatedData = paginatedData.slice(start, limit + start);
    return { paginatedArray: paginatedData, count: clientselectedCount };
  }

  brandSearchOnChange = (e) => {
    this.setState({ brandsSearchParam: e.target.value });
    var input = e.target;
    // Execute a function when the user releases a key on the keyboard
    input.addEventListener("keyup", function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("searchBtn").click();
      }
    });
  }

  brandSearchClear = (e) => {
    this.setState({ brandsSearchParam: '' }, () => this.brandSearch());
  }

  brandSearch = () => {
    if (this.state.isShowSelected) {
      let paginatedData = AccountApproval.updateClientPaginationData(this.state.selectedBrands, this.state.start, this.state.limit, this.state.brandsSearchParam);
      this.setState({ brandClientPaginated: paginatedData.paginatedArray, searchedSelectedTotal: paginatedData.count });
    } else {
      updateTokenHOC(this.props.getBrands, this.props.auth.kc, AccountApproval.prepareGetBrandsParams(0, this.state.limit, this.state.brandsSearchParam));
    }
  }

  saveAssociatedBrands = () => {
    const { selectedOEM, selectedBrands } = this.state;
    const params = {
      login_name: selectedOEM.oemName,
      login_id: selectedOEM.oemId,
      brands_list: selectedBrands
    }
    updateTokenHOC(this.props.associateBrands, this.props.auth.kc, params);
    this.setState({ isSaveEnable: false });
  }

  render() {
    const { OEMList, isShowSelected, limit, brandLoading, activePage, brandsTotalCount, selectedOEM, selectedBrands, brandsList, isSaveEnable, brandClientPaginated, searchedSelectedTotal, brandsSearchParam } = this.state;
    const oemCardHeight = this.state.oemCardHeight - 231;
    const brandsCardHeight = this.state.oemCardHeight - 281;
    return (
      <article className="oem-brands animated fadeIn position-relative">
        <div className="oem">
          <h5>OEM</h5>
          <SimpleBar style={{ 'maxHeight': oemCardHeight }}>
            <ListGroup className="butt-list">
              {OEMList && OEMList.map((elem, i) => {
                return <ListGroupItem onClick={() => this.selectOEM(elem.oem_id, elem.oem_name)} key={i} tag="button" action className={elem.oem_id === selectedOEM.oemId && "active"}><span>{elem.oem_name}</span><i className="fa fa-mobile"></i></ListGroupItem>
              })}
            </ListGroup>
          </SimpleBar>
        </div>
        <div className="brands">
          <div className="list-shadow-control">
            <div className="search-bx">
            <h5>{i18n.t('availableBrands')}</h5>
              <InputGroup>
                <Input placeholder="Search brands..." value={brandsSearchParam} onChange={(e) => this.brandSearchOnChange(e)} />
                {brandsSearchParam && <InputGroupAddon addonType="prepend"><Button color="danger" onClick={this.brandSearchClear}><i className="fa fa-close"></i></Button></InputGroupAddon>
                }                <InputGroupAddon addonType="prepend"><Button color="primary" id="searchBtn" onClick={this.brandSearch}><i className="fa fa-search"></i></Button></InputGroupAddon>
              </InputGroup>
            </div>
            <SimpleBar style={{ 'maxHeight': brandsCardHeight }}>
              <ListGroup className="bage-list" style={{ minHeight: brandsCardHeight }}>
                {/* {brandsSearchParam === "" &&
                  <div className="text-right">
                    <FormGroup check>
                      <Label check>
                        <Input type="checkbox" onChange={(e) => this.setState({ isShowSelected: !isShowSelected }, () => this.handlePageClick(1))} />{' '}
                        {i18n.t('showSelected')}
                      </Label>
                    </FormGroup>
                  </div>
                } */}
                {selectedOEM.oemName === '' ? null : brandLoading ? <PointSpreadLoading color='#0093c9' speed={1} style={{ width: '0px !important' }} /> : <div>
                  {brandsList.map((elem, i) => {
                    return !selectedBrands.includes(elem) && <ListGroupItem onClick={() => this.selectBrand(elem)} key={i} tag="button" action className={selectedBrands.includes(elem) && "active"}>{elem}</ListGroupItem>
                  })}
                </div>
                }
              </ListGroup>
            </SimpleBar>
          </div>
          {(((!isShowSelected && brandsTotalCount > limit) || (isShowSelected && searchedSelectedTotal > limit)) && selectedOEM.oemName) !== '' &&
            <article className='data-footer' style={{ backgroundColor: 'rgba(0,0,0,0.05)', padding: '8px 10px 7px' }}>
              <Pagination
                pageRangeDisplayed={4}
                activePage={activePage}
                itemsCountPerPage={limit}
                totalItemsCount={isShowSelected ? searchedSelectedTotal : brandsTotalCount}
                onChange={this.handlePageClick}
                innerClass="pagination"
              />
              <div className="hand-limit">
                {isSaveEnable &&
                  <Button color="primary" onClick={this.saveAssociatedBrands}><i className="fa fa-save"></i>&nbsp;Save</Button>
                }
              </div>
              <div className='start-toend'>
                <span>{i18n.t('total') + ' ' + i18n.t('requests')}</span>
                <span><b>{`: ${isShowSelected ? searchedSelectedTotal : brandsTotalCount}`}</b></span>
              </div>
            </article>
          }
        </div>
        <div className="associate">
        {selectedBrands.length > 0 ? <h5><span>{i18n.t('associatedBrands')}</span><small>{selectedBrands.length}</small></h5> : null }
          <SimpleBar style={{ 'maxHeight': oemCardHeight }}>
            <ListGroup className="bage-list">
              {selectedBrands.length > 0 ? <div>
                {selectedBrands.map((elem, i) => {
                  return selectedBrands.includes(elem) && <ListGroupItem onClick={() => this.selectBrand(elem)} key={i} tag="button" action className={selectedBrands.includes(elem) && "active"}>{elem}</ListGroupItem>
                })}
              </div> :
                <b>{i18n.t('noAssociatedBrands')}</b>
              }
            </ListGroup>
          </SimpleBar>
        </div>
      </article>
    );
  }
}

const mapPropsToState = state => ({
  auth: state.auth,
  brandData: state.brand,
  OEMData: state.oem
});

export default connect(mapPropsToState, { getBrands, getOEMs, getAssociatedBrands, associateBrands })(AccountApproval);
