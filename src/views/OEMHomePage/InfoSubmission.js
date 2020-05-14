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
import { Row, Col, Button, Form, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import i18n from "i18next";
import RenderModal from '../../components/Form/RenderModal'
import {withFormik, Field} from 'formik';
import renderInput from '../../components/Form/RenderInput';


class InfoSubmission extends Component {
    /**
     * Close Modal and Reset fields
     */
    closeModal() {
      this.props.closeModal()
      /**
       * Reset Formik Fields
       */
      this.props.handleReset()
    }
  
    render() {
      const {
        handleSubmit,
        enable,
        selectedIMEI
      } = this.props
      return (
        <I18n ns="translations">
          {
            (t, {i18n}) => (
              <div>
                <RenderModal show={enable}>
                  <ModalHeader>{t('addInfoFor')}: {selectedIMEI}</ModalHeader>
                  <div className="steps-loading">
                    <Form onSubmit={handleSubmit}>
                      <ModalBody>
                          <Row>
                          <Col md={12}>
                            <Field name="serialNumber" component={renderInput} type="text" 
                                   label={t('serialNumber')} placeholder={t('serialNumber')}/>
                          </Col>
                          <Col md={12}>
                            <Field name="color" component={renderInput} type="text" 
                                   label={t('color')} placeholder={t('color')}/>
                          </Col>
                          <Col md={12}>
                            <Field name="brand" component={renderInput} type="text" 
                                   label={t('brand')} placeholder={t('brand')}/>
                          </Col>
                          <Col md={12}>
                            <Field name="modelName" component={renderInput} type="text" 
                                   label={t('modelName')} placeholder={t('modelName')}/>
                          </Col>
                          </Row>
                      </ModalBody>
                      <ModalFooter>
                        <Button className='eq-width' color="secondary" type="button" onClick={() => {
                          this.closeModal()
                        }}>{t('modal.close')}</Button>
                        <Button className='eq-width' color="primary" type="submit">{t('modal.add')}</Button>
                      </ModalFooter>
                    </Form>
                  </div>
                </RenderModal>
              </div>
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
  export const EnhancedModalForm = withFormik({
    mapPropsToValues: () => ({
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
        "oem_imei": bag.props.selectedIMEI,
        "oem_serial_no": values.serialNumber,
        "oem_color": values.color,
        "oem_brand": values.brand,
        "oem_model": values.modelName,
      }
      /**
       * Add single MNO API call
       */
      bag.props.addSingleIMEIInfo(data)
      if (values.serialNumber || values.color || values.brand || values.modelName) {
        values.serialNumber = values.color = values.brand = values.modelName = '';
      }
    },
    displayName: 'InfoSubmission', // helps with React DevTools
  })(InfoSubmission);
  