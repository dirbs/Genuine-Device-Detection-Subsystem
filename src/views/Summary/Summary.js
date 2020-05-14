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
import React, { Component } from "react";
import HeaderCard from './../../components/Card/HeaderCard';
import SummaryDataTable from './../../components/DataTable/SummaryDataTable';
import { getUserResponse,getDuplicationList,getOEMLoginsBrands,getOEMResponse } from "./../../actions/summaryAction";
import { connect } from "react-redux";
import { updateTokenHOC } from "./../../utilities/helpers";
import {Row} from "reactstrap";

class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
        OEMLoginBrand:{},
        UserResponse:{},
        DuplicationList:{},
        OEMResponse:[],
        loading:true
    };
  }

  componentDidMount() {
    updateTokenHOC(this.props.getUserResponse, this.props.auth.kc);
    updateTokenHOC(this.props.getDuplicationList, this.props.auth.kc);
    updateTokenHOC(this.props.getOEMLoginsBrands, this.props.auth.kc);
    updateTokenHOC(this.props.getOEMResponse, this.props.auth.kc); 
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    
    if (nextProps.oemLoginBrand !== prevState.OEMLoginBrand) {
      return {
        OEMLoginBrand: nextProps.oemLoginBrand,
      };
    }
    if (nextProps.userResponse !== prevState.UserResponse) {
      return {
        UserResponse: nextProps.userResponse,
      };
    }
    if (nextProps.duplicationList !== prevState.DuplicationList) {
      return {
        DuplicationList: nextProps.duplicationList,
      };
    }
    if (nextProps.oemResponse !== prevState.OEMResponse) {
      return {
        OEMResponse: nextProps.oemResponse,
      };
    }
    
    return null;
  }

  render() {
      const {UserResponse,DuplicationList,OEMLoginBrand,OEMResponse}=this.state
     return (
      <article className="animated fadeIn position-relative">
        <Row>
          
          <HeaderCard headerData={DuplicationList} bgColor="#0093C7" titleText="Duplication List Summary"/>
          <HeaderCard headerData={OEMLoginBrand} bgColor="#0BD49C" titleText="OEM Logins Brands Summary"/>
          <HeaderCard headerData={OEMResponse} bgColor="#0B6EDE" titleText="OEM Response Summary"/>
          <HeaderCard headerData={UserResponse} bgColor="#F07C7C" titleText="User Response Summary"/>
        </Row>
        <Row>
            <SummaryDataTable  tableData={DuplicationList} title="Duplication List Summary"/>
            <SummaryDataTable  tableData={OEMLoginBrand} title="OEM Logins Brands Summary"/>
            <SummaryDataTable  tableData={OEMResponse} title="OEM Response Summary"/>
            <SummaryDataTable  tableData={UserResponse} title="User Response Summary"/>
        </Row>
      </article>
    );
  }
}

const mapPropsToState = (state) => (
  {

  auth: state.auth,
  oemLoginBrand:state.summary.OEMLoginBrand,
  userResponse:state.summary.userResponse,
  duplicationList:state.summary.duplicationList,
  oemResponse:state.summary.OEMResponse.oem_response,
  
});

export default connect(mapPropsToState, { getUserResponse,getDuplicationList,getOEMLoginsBrands,getOEMResponse })(Summary);
