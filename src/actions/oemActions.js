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
import * as OEMServices from '../api/OEMServices'
import { SET_OEM_LIST, SET_PENDING_IMEI_LIST, DOWNLOADED_PENDING_IMEI_LIST, IS_MISSING_INFO_SUBMITTED, BULK_UPLOAD_SUBMITTED } from "./types";
import FileSaver from "file-saver";
import { errors, SweetAlert } from "./../utilities/helpers";
import i18n from "i18next";

export const OEMListAction = data => {
  return {
    type: SET_OEM_LIST,
    payload: data
  };
};

export const IMEIListAction = data => {
  return {
    type: SET_PENDING_IMEI_LIST,
    payload: data
  };
};

export const DownloadIMEIListAction = data => {
  return {
    type: DOWNLOADED_PENDING_IMEI_LIST,
    payload: data
  };
};

export const singleSubmissionAction = data => {
  return {
    type: IS_MISSING_INFO_SUBMITTED,
    payload: data
  };
};

export const bulkUploadAction = data => {
  return {
    type: BULK_UPLOAD_SUBMITTED,
    payload: data
  };
};

// get OEM List
export const getOEMs = (config) => dispatch => {
  const response = OEMServices.getOEMLoginsAPI(config);
  response.then(res =>
    dispatch(OEMListAction(res.data))
  )
    .catch(err =>
      errors(this, err)
    );
};

// get OEM pending IMEIs List
export const getPendingIMEI = (config, params) => dispatch => {
  const response = OEMServices.getPendingIMEIAPI(config, params.loginId, params.start, params.limit);
  response.then(res =>{
    dispatch(IMEIListAction(res.data));
    dispatch(singleSubmissionAction(false))
  })
    .catch(err =>
      console.log(err.message)
    );
};

// For Submitting single IMEI missing Information
export const singleInfoSubmission = (config, params) => dispatch => {
  const response = OEMServices.singleInfoSubmissionAPI(config, params);
  response.then(res =>
    dispatch(singleSubmissionAction(true))
  )
    .catch(err =>{
      dispatch(singleSubmissionAction(false));
      errors(this, err);
     });
};

// For Submitting IMEI missing Information in Bulk
export const BulkUploadIMEIInfo = (config, params) => dispatch => {
  const response = OEMServices.bulkUploadAPI(config, params);
  response.then(res =>{
    params = {
      title: 'Successful Records: ' + res.data.Successful_Records,
      message: 'Failed Records: ' +  res.data.Deleted_Record,
      type: 'success'
    }
    SweetAlert(params);
    dispatch(singleSubmissionAction(true));
  })
    .catch(err =>{
      dispatch(bulkUploadAction(err.message));
      errors(this, err);
     });
};

// download OEM pending IMEIs List
export const downloadPendingIMEI = (config, params) => dispatch => {
  const response = OEMServices.downloadPendingIMEIAPI(config, params.loginName, params.loginId);
  response.then(res => {
    try {
      let blob = new Blob([res.data], { type: "text/csv;" });
      FileSaver.saveAs(blob, "Request-Document.csv");
    } catch (err) {
      let file = new Blob([res.data], { type: "text/csv;" });
      window.navigator.msSaveBlob(file, "Request-Document.csv");
    }
    dispatch(DownloadIMEIListAction(true));
  }
  )
    .catch(err =>{
      dispatch(DownloadIMEIListAction(false));
      errors(this, err);
    });
};

// For Submitting single IMEI missing Information for Public
export const singlePublicInfoSubmission = (params) => dispatch => {
  const response = OEMServices.submitPublicResponseAPI(params);
  response.then(res =>{
    if(res.status === 200)
    {
      params = {
      title: i18n.t('success'),
      message: i18n.t('infoSubmitted'),
      type: 'success'
    }
    SweetAlert(params); 
   }
  })
    .catch(err =>{
      params = {
        title: i18n.t('error'),
        message: err.response.data.message,
        type: 'error'
      }
      SweetAlert(params); 
     });
};

