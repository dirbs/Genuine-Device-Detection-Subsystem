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

import * as SummaryServices from "./../api/SummaryServices";
import { errors } from "./../utilities/helpers";
import {
  USER_RESPONSE_SUMMARY,
  DUPLICATION_LIST_SUMMARY,
  OEM_LOGINS_BRANDS_SUMMARY,
  OEM_RESPONSE_SUMMARY
 
} from "./types";


export const userRespononseAction = (data) => {
  
  return {
    type: USER_RESPONSE_SUMMARY,
    payload: data,
  };
};

export const duplicationnListAction = (data) => {
  
  return {
    type: DUPLICATION_LIST_SUMMARY,
    payload: data,
  };
};

export const OEMLoginBrandsAction = (data) => {
  return {
    type: OEM_LOGINS_BRANDS_SUMMARY,
    payload: data,
  };
};

export const OEMResponseAction = (data) => {
  return {
    type: OEM_RESPONSE_SUMMARY,
    payload: data,
  };
};


// get User Respononse Action Summary
export const getUserResponse = (config) => (dispatch) => {
  const response = SummaryServices.getUserResponseSummaryAPI(config);
  response
    .then((res) => dispatch(userRespononseAction(res.data)))
    .catch((err) => errors(this, err));
};

// get User Duplication List Summary
export const getDuplicationList = (config) => (dispatch) => {
  const response = SummaryServices.getDuplicationListSummaryAPI(config);
  response
    .then((res) => dispatch(duplicationnListAction(res.data)))
    .catch((err) => errors(this, err));
};

// get OEM-Logins Brands Summary
export const getOEMLoginsBrands = (config) => (dispatch) => {
  const response = SummaryServices.getOEMLoginsBrandsSummaryAPI(config);
  response
    .then((res) => dispatch(OEMLoginBrandsAction(res.data)))
    .catch((err) => errors(this, err));
};


// get OEM-Response Summary
export const getOEMResponse = (config) => (dispatch) => {
  const response = SummaryServices.getOEMResponseSummaryAPI(config);
  response
    .then((res) => dispatch(OEMResponseAction(res.data)))
    .catch((err) => errors(this, err));
};

