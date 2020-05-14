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
import {  I18n } from 'react-i18next';
import { Button, Form, ModalBody, ModalFooter, CardHeader } from 'reactstrap';
import i18n from "i18next";
import { getExtension } from "../../utilities/helpers";
import RenderModal from '../../components/Form/RenderModal'
import { withFormik } from 'formik';
import StepLoading from "../../components/Loaders/StepLoading";
import RenderFileInput from "../../components/Form/RenderFileInput";


class BulkUpload extends Component {
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
      setFieldValue,
      setFieldTouched,
      errors,
      values,
      handleSubmit,
      loading,
      enable
    } = this.props
    return (
      <I18n ns="translations">
        {
          (t, { i18n }) => (
            <div>
              <RenderModal show={enable}>
                <CardHeader><b>{t('uploadDocument')}</b></CardHeader>
                <div className="steps-loading">
                  <Form onSubmit={handleSubmit}>
                    <ModalBody>
                      {loading &&
                        <StepLoading />
                      }
                      <div className="row">
                        <div className="col-xs-12 col-sm-6">
                          <RenderFileInput
                            onChange={setFieldValue}
                            acceptFormats=".csv"
                            onBlur={setFieldTouched}
                            error={errors.file}
                            values={values.file}
                            fieldName="file"
                            type="file"
                            inputClass="asitfield"
                            label={t('selectFile')}
                            requiredStar
                          />
                        </div>
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <Button className='eq-width' color="secondary" type="button" onClick={() => {
                        this.closeModal()
                      }}>{t('modal.close')}</Button>
                      <Button className='eq-width' color="primary" type="submit">{t('submit')}</Button>
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
export const EnhancedModalBulkForm = withFormik({
  mapPropsToValues: () => ({
    file: ""
  }),
  /**
   * Formik validations
   * @param values
   */
  validate: values => {
    let errors = {}
    if (!values.file) {
      errors.file = i18n.t('validation.thisFieldIsRequired')
    } else if (getExtension(values.file.name) !== 'csv' && getExtension(values.file.name) !== 'txt') {
      errors.file = i18n.t('validation.invalideFileExtension')
    } else if (values.file.size > 20971520) {
      errors.file = i18n.t('validation.fileSize')
    }
    return errors;
  },
  /**
   * Formik submit function
   * @param values
   * @param bag
   */
  handleSubmit: (values, bag) => {
    console.log(values.file.name)
    const formData = new FormData();
    formData.append('file', values.file);
    bag.props.bulkUpload(formData);
    bag.props.closeModal();
  },
  displayName: 'BulkUpload', // helps with React DevTools
})(BulkUpload);
