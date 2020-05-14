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
import * as DetailsServices from "../api/DetailsServices";
import {
  OEM_RESPONSE_DETAILS,
  DUPLICATION_LIST_DETAILS,
  USER_RESPONSE_DETAILS,
} from "./types";
import { errors } from "./../utilities/helpers";

export const getOEMResponseDetailsAction = (data) => {
  return {
    type: OEM_RESPONSE_DETAILS,
    payload: data,
  };
};

export const getDuplicationListDetailsAction = (data) => {
  return {
    type: DUPLICATION_LIST_DETAILS,
    payload: data,
  };
};
export const getUserResponseDetailsAction = (data) => {
  return {
    type: USER_RESPONSE_DETAILS,
    payload: data,
  };
};

export const getOEMResponseDetails = (config, params) => (dispatch) => {
  if (params.selectOption === "" || params.selectOption === "Select Option")
    return;
  if (params.selectOption === "" || params.selectOption === "Select Option")
    return;
  switch (params.selectOption) {
    case "Responded IMEIS":
      params.selectOption = "responded_imeis";
      break;
    case "Pending IMEIS":
      params.selectOption = "pending_imeis";
      break;
    default:
      params.selectOption = "";
  }
  const response = DetailsServices.getOEMResponseDetailsAPI(config,params.selectOption,params.start,params.limit);
  response
    .then((res) => dispatch(getOEMResponseDetailsAction(res.data)))
    .catch((err) => errors(this, err));
};

export const getDuplicationListDetails = (config, params) => (dispatch) => {
  if (params.selectOption === "" || params.selectOption === "Select Option")
    return;
  switch (params.selectOption) {
    case "All IMEIS":
      params.selectOption = "all_imeis";
      break;
    case "Processed IMEIS":
      params.selectOption = "processed_imeis";
      break;
    case "Pending IMEIS":
      params.selectOption = "pending_imeis";
      break;
    case "Genuine IMEIS":
      params.selectOption = "genuine_imeis";
      break;
    case "Duplicated IMEIS":
      params.selectOption = "duplicated_imeis";
      break;
    case "Threshold Crossed IMEIS":
      params.selectOption = "threshold_crossed_imeis";
      break;
    case "SMS Notified IMEIS":
      params.selectOption = "sms_notified_imeis";
      break;
    case "SMS Pending IMEIS":
      params.selectOption = "sms_pending_imeis";
      break;
    default:
      params.selectOption = "";
  }
  const response = DetailsServices.getDuplicationListDetailsAPI(config,params.selectOption,params.start,params.limit);
  response
    .then((res) => dispatch(getDuplicationListDetailsAction(res.data)))
    .catch((err) => errors(this, err));
};

export const getUserResponseDetails = (config, params) => (dispatch) => {
  if (params.selectOption === "" || params.selectOption === "Select Option")
    return;
  switch (params.selectOption) {
    case "Pending IMEIS":
      params.selectOption = "pending_imeis";
      break;
    case "Responded IMEIS":
      params.selectOption = "responded_imeis";
      break;
    case "Genuine IMEIS":
      params.selectOption = "genuine_imeis";
      break;
    case "Duplicated IMEIS":
      params.selectOption = "duplicated_imeis";
      break;
    default:
      params.selectOption = "";
  }
  const response = DetailsServices.getUserResponseDetailsAPI(config,params.selectOption,params.start,params.limit);
  response
    .then((res) => dispatch(getUserResponseDetailsAction(res.data)))
    .catch((err) => errors(this, err));
};
