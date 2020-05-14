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

import * as types from "./types";
import * as actions from "./oemActions";
import * as OEMServices from "../api/OEMServices";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import fetchMock from "fetch-mock";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("oem action", () => {
  it("oem list actions", () => {
    const data = ["Item1", "Item2", "Item3"];
    const expectedAction = {
      type: types.SET_OEM_LIST,
      payload: data
    };
    expect(actions.OEMListAction(data)).toEqual(expectedAction);
  });

  it("IMEI list action", () => {
    const data = ["Item1", "Item2", "Item3"];
    const expectedAction = {
      type: types.SET_PENDING_IMEI_LIST,
      payload: data
    };
    expect(actions.IMEIListAction(data)).toEqual(expectedAction);
  });

  it("Download IMEI list action", () => {
    const data = ["Item1", "Item2", "Item3"];
    const expectedAction = {
      type: types.DOWNLOADED_PENDING_IMEI_LIST,
      payload: data
    };
    expect(actions.DownloadIMEIListAction(data)).toEqual(expectedAction);
  });

  it("Single submission action", () => {
    const data = ["Item1", "Item2", "Item3"];
    const expectedAction = {
      type: types.IS_MISSING_INFO_SUBMITTED,
      payload: data
    };
    expect(actions.singleSubmissionAction(data)).toEqual(expectedAction);
  });

  it("Bulk upload action", () => {
    const data = ["Item1", "Item2", "Item3"];
    const expectedAction = {
      type: types.BULK_UPLOAD_SUBMITTED,
      payload: data
    };
    expect(actions.bulkUploadAction(data)).toEqual(expectedAction);
  });

  it("get OEM List(no config files so cant fetch data)", async () => {
    const data = ["Item1", "Item2", "Item3"];
    const store = mockStore();
    const expectedAction = [{ payload: data, type: types.SET_OEM_LIST }];
    const response = await OEMServices.getOEMLoginsAPI(
      localStorage.getItem("token")
    );
    if (response.status === 200) {
      store.dispatch(actions.OEMListAction(data));
    }
    expect(store.getActions()).toEqual(expectedAction);
  });

  it("get OEM pending IMEIs List(no config files so cant fetch data)", async () => {
    const data = ["Item1", "Item2", "Item3"];
    const store = mockStore();
    const expectedAction = [
      { payload: data, type: types.SET_PENDING_IMEI_LIST },
      { payload: false, type: "IS_MISSING_INFO_SUBMITTED" }
    ];
    const response = { status: 200 }


    if (response.status === 200) {
      store.dispatch(actions.IMEIListAction(data));
      store.dispatch(actions.singleSubmissionAction(false));
    }
    expect(store.getActions()).toEqual(expectedAction);
  });

  it("Submitting single IMEI missing Information(no config files so cant fetch data)", async () => {
    const store = mockStore();
    const expectedAction = [
      { payload: false, type: "IS_MISSING_INFO_SUBMITTED" }
    ];
    store.dispatch(actions.singleInfoSubmission());
    store.dispatch(actions.singleSubmissionAction(false));
    expect(store.getActions()).toEqual(expectedAction);
  });

  it("download OEM pending IMEIs List(no config files so cant fetch data)", async () => {
    const store = mockStore();
    let params = {
      loginName: "sso",
      loginId: "9a9f5b79-3252-4e7d-a513-111111111111"
    };
    const expectedAction = [
      { payload: true, type: "DOWNLOADED_PENDING_IMEI_LIST" }
    ];
    store.dispatch(
      actions.downloadPendingIMEI(
        localStorage.getItem("token"),
        params.loginName,
        params.loginId
      )
    );
    store.dispatch(actions.DownloadIMEIListAction(true));
    expect(store.getActions()).toEqual(expectedAction);
  });

  it("Submitting single IMEI missing Information for Public(no config files so cant fetch data)", async () => {
    const store = mockStore({ todos: [] });
    store.dispatch(actions.singlePublicInfoSubmission({}));
  });


});
