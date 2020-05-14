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
import * as actions from "./brandActions";
import * as brandServices from "../api/BrandServices";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import fetchMock from "fetch-mock";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("actions of brands", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it("check brand list action", () => {
    const data = ["NOKIA", "SAMSUNG", "IPHONE"];
    const expectedAction = {
      type: types.SET_BRAND_LIST,
      payload: data
    };
    expect(actions.brandListAction(data)).toEqual(expectedAction);
  });

  it("check associated action", () => {
    const data = ["NOKIA", "SAMSUNG", "IPHONE"];
    const expectedAction = {
      type: types.SET_ASSOCIATED_BRAND_LIST,
      payload: data
    };
    expect(actions.getAssociatedAction(data)).toEqual(expectedAction);
  });

  it("get brands list(no config files so cant fetch data)", async () => {
    const data = ["NOKIA", "SAMSUNG", "IPHONE"];
    const store = mockStore();
    const expectedAction = [{ payload: data, type: types.SET_BRAND_LIST }];
    const response = await brandServices.getBrandsAPI(
      localStorage.getItem("token"),
      1,
      10
    );
    if (response.status === 200) {
      store.dispatch(actions.brandListAction(data));
    }
    expect(store.getActions()).toEqual(expectedAction);
  });

  it("get Associated Brands List(no config files so cant fetch data)", async () => {
    const data = ["NOKIA", "SAMSUNG", "IPHONE"];
    const store = mockStore();
    const expectedAction = [
      { payload: data, type: types.SET_ASSOCIATED_BRAND_LIST }
    ];
    const response = await brandServices.getAssociatedBrandsAPI(
      localStorage.getItem("token"),
      "USER123"
    );
    if (response.status === 200) {
      store.dispatch(actions.getAssociatedAction(data));
    }
    expect(store.getActions()).toEqual(expectedAction);
  });

});
