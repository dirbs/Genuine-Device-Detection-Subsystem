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
import Pagination from "react-js-pagination";
import TableInfo from "../../components/Help/TableInfo";
import {FormGroup,Input,Button,Row,Col,Table,Card,CardBody} from "reactstrap";
import { getOEMResponseDetails } from "../../actions/detailsActions";
import { updateTokenHOC } from "../../utilities/helpers";
import { connect } from "react-redux";
import { PointSpreadLoading } from 'react-loadingg';

class OEMResponseDetails extends Component {
    constructor() {
        super();
        this.state = {
          OEMResponseSelect: ["Pending IMEIS","Responded IMEIS"],
          OEMResponseOption: "",
          OEMResponse: [],
          start: 0,
          limit: 15,
          activePage: 1,
          loading:true,
          totalCount:0
        };
      }
      componentDidMount() {
        this.state.OEMResponse.length=0
        this.state.totalCount=0
      }
      static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.OEMResponse !== prevState.OEMResponse) {
          return {
            OEMResponse: nextProps.OEMResponse,
            totalCount:nextProps.count,
            loading:false
          };
        }
        return null;
      }
      OEMResponseHandle = () => {
        updateTokenHOC(
          this.props.getOEMResponseDetails,
          this.props.auth.kc,
          OEMResponseDetails.prepareGetOEMResponseParams(
            0,
            this.state.limit,
            this.state.OEMResponseOption
          )
        );
        this.handlePageClick(1);
      };
      handlePageClick = (page) => {
        let a1 = 1;
        let d = this.state.limit;
        let start = a1 + d * (page - 1) - 1;
        this.setState({ start: start, activePage: page,loading:true }, () => {
          updateTokenHOC(
            this.props.getOEMResponseDetails,
            this.props.auth.kc,
            OEMResponseDetails.prepareGetOEMResponseParams(
              this.state.start,
              this.state.limit,
              this.state.OEMResponseOption
            )
          );
        });
      };
    
      static prepareGetOEMResponseParams  = (start, limit, OEMResponseOption) => {
        let params = {
          start: start,
          limit: limit,
          selectOption: OEMResponseOption,
        };
    
        return params;
      };
      


    render() { 
        const {
            OEMResponseSelect,
            OEMResponse,
            activePage,
            limit,
            loading,
            OEMResponseOption,
            totalCount
         
          } = this.state;
        return (
            <Col xs={12} xl={12} className="order-xl-1">
            <Row className="d-flex justify-content-center ml-5">
          <Col xs lg="3" md="auto">
            <FormGroup>
              <Input type="select" className="select"  onChange={event => this.setState({OEMResponseOption: event.target.value})}>
                <option >Select Option</option>
                {OEMResponseSelect.map((element) => (
                  <option  key={element} >{element}</option>
                ))}
              </Input>
            </FormGroup>
          </Col>
          <Col xs lg="3" md="auto">
            <Button outline color="primary" className="btn-secondary:focus" onClick={this.OEMResponseHandle} style={{textTransform:"initial"}}>
              Search
            </Button>
          </Col>
          
        </Row>
              {
                (OEMResponseOption === "Select Option" || OEMResponseOption === "") &&

                <TableInfo />
              }
              {
                !(OEMResponseOption === "Select Option" || OEMResponseOption === "")
                 &&
                 <React.Fragment> 
                <Card>
                <CardBody>
               { loading  ?
               
               <Row  className="d-flex justify-content-center"><PointSpreadLoading color='#0093c9' speed={1} style={{ width: '0px !important' }} /></Row> :
               OEMResponse.length > 0 ?
               <Table className="table table-sm table-bordered table-hover mt-3 table-mobile-primary table-search animated fadeIn position-relative">
               <thead className="thead-light">
                 <tr>
                   <th>ID</th>
                   <th>OEM ID</th>
                   <th>OEM IMEI</th>
                   <th>OEM TAc</th>
                   <th>GSMA Brand</th>
                   <th>OEM Serial No</th>
                   <th>OEM Color</th>
                   <th>OEM Brand</th>
                   <th>OEM Modal</th>
                   <th>OEM Response Date</th>
                 </tr>
               </thead>
                 <tbody>
               {
                 OEMResponse &&
                 OEMResponse.map((data) => (
                   <tr key={data.id}>
                     <td>{data.id}</td>
                     <td>{data.oem_id}</td>
                     <td>{data.oem_imei}</td>
                     <td>{data.oem_tac}</td>
                     <td>{data.gsma_brand}</td>
                     <td>{data.oem_serial_no === null ? "null":data.oem_serial_no}</td>
                     <td>{data.oem_color  === null ? "null":data.oem_color}</td>
                     <td>{data.oem_brand === null ? "null":data.oem_brand}</td>
                     <td>{data.oem_model === null ? "null":data.oem_model}</td>
                     <td>{data.oem_response_date}</td>
                   </tr>
                 ))
                 
               }
               </tbody>
             </Table>
             : OEMResponse.length===0 && <b>No Data Found</b> 
               
             
               } 
      
                 
              </CardBody>
                <article className='data-footer' style={{ backgroundColor: 'rgba(0,0,0,0.05)', padding: '8px 8px 7px' }}>
                { (totalCount > 0 || totalCount === !undefined || OEMResponse > 0 ) &&
                 <>
                 <Pagination
                  pageRangeDisplayed={4}
                  activePage={activePage}
                  itemsCountPerPage={limit}
                  totalItemsCount={totalCount}
                  onChange={this.handlePageClick}
                  innerClass="pagination"
                />
                 <span>
                 <b style={{fontSize:"16px",marginTop:"8px"}}>{OEMResponseOption} : {totalCount}</b>
                 </span>
                </>
                }
      
                </article>
                
              </Card>
              </React.Fragment>
              }
            </Col>
          );
        }
      }
      const mapPropsToState = (state) => (      
        {
        auth: state.auth,
        OEMResponse: state.details.OEMResponseDetails,
        count:state.details.count
      });
      
      export default connect(mapPropsToState, { getOEMResponseDetails })(
        OEMResponseDetails
      );
      