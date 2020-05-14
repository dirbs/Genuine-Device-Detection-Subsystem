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


import * as types from "../actions/types";
import reducer from "./oemReducer";

describe("auth reducer", () => {
  it("should return initial state", () => {
    expect(reducer(undefined, {})).toEqual({
      loading: false,
      success: false,
      error: false,
      oemList: [],
      pendingIMEIList: [],
      IMEIcount: 0,
      isIMEIFileDownloaded: false,
      isIMEIInfoSubmited: false,
      message: ""
    });
  });

  it("should set oem listy", () => {
    expect(
      reducer([], {
        type: types.SET_OEM_LIST,
        payload: { oem_logins: ["Nokia", "SAMSUNG"], success: true }
      })
    ).toEqual({ oemList: ["Nokia", "SAMSUNG"], success: true });
  });

  it("should set imei pending list", () => {
    expect(
      reducer([], {
        type: types.SET_PENDING_IMEI_LIST,
        payload: { count: 2,IMEIs:["Nokia", "SAMSUNG"], success: true }
      })
    ).toEqual({ IMEIcount: 2, pendingIMEIList:["Nokia", "SAMSUNG"], success: true });
  });


  it("should download pending imei list", () => {
    expect(
      reducer([], {
        type: types.DOWNLOADED_PENDING_IMEI_LIST,
        payload: ""
      })
    ).toEqual({"isIMEIFileDownloaded": ""});
  });

  it("should check for missing info submitted", () => {
    expect(
      reducer([], {
        type: types.IS_MISSING_INFO_SUBMITTED,
        payload: ""
      })
    ).toEqual({"isIMEIInfoSubmited": ""});
  });

  it("should check for bulk upload submitted", () => {
    expect(
      reducer([], {
        type: types.BULK_UPLOAD_SUBMITTED,
        payload: "Submitted"
      })
    ).toEqual({"message": "Submitted"});
  });



});
