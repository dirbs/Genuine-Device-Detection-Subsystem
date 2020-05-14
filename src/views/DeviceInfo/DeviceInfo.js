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
import { I18n } from 'react-i18next';
import { Row, Col, Button, Form, Card, CardHeader, CardBody } from 'reactstrap';
import i18n from "i18next";
import doubleEntryInput from '../../components/Form/DoubleEntryInput'
import { withFormik, Field, FieldArray } from 'formik';
import renderInput from '../../components/Form/RenderInput';
import { singlePublicInfoSubmission } from './../../actions/oemActions'
import { connect } from "react-redux";

export function errorClass(errors, touched, i) {
  return (errors &&
    errors.imei &&
    errors.imei[i] &&
    errors.imei[i]['imei'] &&
    touched &&
    touched.imei &&
    touched.imei[i] &&
    touched.imei[i]['imei']) ? 'is-invalid' : '';

}

class DeviceInfo extends Component {

  render() {
    const {
      values,
      touched,
      errors,
      handleSubmit
    } = this.props
    return (
      <I18n ns="translations">
        {
          (t, { i18n }) => (
                <Form onSubmit={handleSubmit}>
                  <Card>
                    <CardHeader><b>{i18n.t('submit') + ' ' + i18n.t('dashboardLabel.requested') + ' ' + i18n.t('dashboardLabel.information')}</b></CardHeader>
                    <CardBody>
                      <div className="add-remove-wrap position-relative">
                        <FieldArray
                          name="imei"
                          render={({ insert, remove, push }) => {
                            return (
                              <div>
                                {values.imei && values.imei.length > 0 && values.imei.map((imei, i) => {
                                  let inputClass = errorClass(errors, touched, i);
                                  let reInputClass = errorClass(errors, touched, i);
                                  return (
                                    <Row key={i} className="mt-3">
                                      <Col xs={6}>
                                        <Field name={`imei[${i}].imei`} component={doubleEntryInput} label={i18n.t('typeImei')}
                                          type="text" placeholder={i18n.t('typeImei') + ' ' + (i + 1)} requiredStar groupClass="mb-0"
                                          inputClass={inputClass} />
                                        {errors &&
                                          errors.imei &&
                                          errors.imei[i] &&
                                          errors.imei[i]['imei'] &&
                                          touched &&
                                          touched.imei &&
                                          touched.imei[i] &&
                                          touched.imei[i]['imei'] &&
                                          (
                                            <span className="invalid-feedback p-0"
                                              style={{ display: 'block' }}>{errors.imei[i]['imei']}</span>
                                          )}
                                      </Col>
                                      <Col xs={6}>
                                        <div className="buttonbox">
                                          <Field name={`imei[${i}].reImei`} component={doubleEntryInput} label={i18n.t('retypeImei')}
                                            type="text" placeholder={i18n.t('retypeImei') + ' ' + (i + 1)} requiredStar
                                            groupClass="mb-0" inputClass={reInputClass} />
                                          {errors &&
                                            errors.imei &&
                                            errors.imei[i] &&
                                            errors.imei[i]['reImei'] &&
                                            touched &&
                                            touched.imei &&
                                            touched.imei[i] &&
                                            touched.imei[i]['reImei'] &&
                                            (
                                              <span className="invalid-feedback p-0"
                                                style={{ display: 'block' }}>{errors.imei[i]['reImei']}</span>
                                            )}
                                          {i !== 0 && <button
                                            type="button"
                                            className="button button-remove"
                                            onClick={() => remove(i)}
                                          ></button>}
                                        </div>
                                      </Col>
                                    </Row>
                                  )
                                })}
                                <Button
                                  type="button"
                                  className={values.imei.length >= 5 ? 'btn mt-3 d-none text-capitalize' : 'btn mt-3 text-capitalize'}
                                  onClick={() => push({ imei: "", reImei: "" })}
                                  disabled={values.imei.length >= 5}
                                  color="outline-primary"
                                >
                                  {i18n.t('addImeIs')}
                                </Button>
                              </div>
                            )
                          }}
                        />
                      </div>
                      <hr/>
                      <Row>
                        <Col md={6}>
                          <Field name="uid" component={renderInput} type="text"
                            label={t('UID')} placeholder={t('UID')} />
                        </Col>
                        <Col md={6}>
                          <Field name="serialNumber" component={renderInput} type="text"
                            label={t('serialNumber')} placeholder={t('serialNumber')} />
                        </Col>
                        <Col md={6}>
                          <Field name="color" component={renderInput} type="text"
                            label={t('color')} placeholder={t('color')} />
                        </Col>
                        <Col md={6}>
                          <Field name="brand" component={renderInput} type="text"
                            label={t('brand')} placeholder={t('brand')} />
                        </Col>
                        <Col md={6}>
                          <Field name="modelName" component={renderInput} type="text"
                            label={t('modelName')} placeholder={t('modelName')} />
                        </Col>
                      </Row>
                      <Button className='btn btn-primary float-right' color="primary" type="submit">{t('submit')}</Button>
                    </CardBody>
                  </Card>

                </Form>
          )
        }
      </I18n>
    )
  }
}

/**
 * Formik HOC
 * @type {React.ComponentType<any>}
 */
 const DeviceInfoEnhanced = withFormik({
  mapPropsToValues: () => ({
    imei: [{ imei: '', reImei: '' }],
    uid: '',
    serialNumber: '',
    color: '',
    brand: '',
    modelName: ''
  }),
  /**
   * Formik validations
   * @param values
   */
  validate: values => {
    let errors = {}
    let imei = [];
    if (values.imei.length > 0) {
      for (let i = 0; i < values.imei.length; i++) {
        if (typeof errors.imei === "undefined") {
          errors.imei = [];
        }
        if (typeof errors.imei[i] === "undefined") {
          errors.imei[i] = {};
        }


        if (!values.imei[i].imei) {
          errors.imei[i].imei = i18n.t('validation.thisFieldIsRequired')
        } else if (!/^(?=.[A-F]*)(?=.[0-9]*)[A-F0-9]{14,16}$/.test(values.imei[i].imei)) {
          errors.imei[i].imei = i18n.t('validation.imeiMustContain')
        }

        if (!values.imei[i].reImei) {
          errors.imei[i].reImei = i18n.t('validation.thisFieldIsRequired')
        } else if (!/^(?=.[A-F]*)(?=.[0-9]*)[A-F0-9]{14,16}$/.test(values.imei[i].reImei)) {
          errors.imei[i].reImei = i18n.t('validation.imeiMustContain')
        } else if (values.imei[i].imei !== values.imei[i].reImei) {
          errors.imei[i].reImei = i18n.t('validation.enteredImeiDoesnTMatch')
        }
        if (values.imei[i].imei.length > 0) {
          imei.push(values.imei[i].imei)
        }
        if (Object.keys(errors.imei[i]).length === 0) {
          delete (errors.imei[i]);
        }
        if (Object.keys(errors.imei).length === 0) {
          delete (errors.imei);
        }
      }
    }
    if (values.uid === '') {
      errors.uid = i18n.t('validation.thisFieldIsRequired')
    }
    if (values.serialNumber === '') {
      errors.serialNumber = i18n.t('validation.thisFieldIsRequired')
    }
    else if (/\s/.test(values.serialNumber)) {
      errors.serialNumber = i18n.t('validation.serialNumberMustContainCharactersAndACombinationOf')
    } 
    if (values.color === '') {
      errors.color = i18n.t('validation.thisFieldIsRequired')
    } else if (!isNaN(values.color)) {
      errors.color = i18n.t('validation.cannotBeDigitsOnly')
    }
    if (values.brand === '') {
      errors.brand = i18n.t('validation.thisFieldIsRequired')
    } else if (!isNaN(values.brand)) {
      errors.brand = i18n.t('validation.cannotBeDigitsOnly')
    }
    if (values.modelName === '') {
      errors.modelName = i18n.t('validation.thisFieldIsRequired')
    } else if (!isNaN(values.modelName)) {
      errors.modelName = i18n.t('validation.cannotBeDigitsOnly')
    }

    return errors;
  },
  /**
   * Formik submit function
   * @param values
   * @param bag
   */
  handleSubmit: (values, bag) => {
    let data = {
      "uid": values.uid,
      "user_serial_no": values.serialNumber,
      "user_color": values.color,
      "user_brand": values.brand,
      "user_model": values.modelName,
    }
    data.user_imeis = [];
    for (let i = 0; i < values.imei.length; i++) {
      data.user_imeis[i] = values.imei[i].imei
    }
    /**
     * Add single MNO API call
     */
    bag.props.singlePublicInfoSubmission(data)
    if (values.serialNumber || values.color || values.brand || values.modelName || values.uid || values.imei !== []) {
      values.serialNumber = values.color = values.brand = values.modelName = values.uid = '';
      values.imei = [{ imei: '', reImei: '' }];
    }
  },
  displayName: 'DeviceInfo', // helps with React DevTools
})(DeviceInfo);


export default connect(null, {singlePublicInfoSubmission})(DeviceInfoEnhanced);