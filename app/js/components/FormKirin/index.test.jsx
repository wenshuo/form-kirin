/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import FormKirin from '.';
import BasicField from '../BasicField';
import { simulateEvent } from '../../helpers/test';

/* eslint-disable no-empty-function */
function createBasicForm(props) {
  return mount(
    <FormKirin {...props}>
      {
        ({ values, handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <input type="text" name="firstName" value={values.firstName} onChange={handleChange} />
            <button type="submit">submit</button>
          </form>
        )
      }
    </FormKirin>
  );
}

function createFormWithDefinedControl(props, controlProps) {
  return mount(
    <FormKirin {...props}>
      {
        ({ handleSubmit, handleReset }) => (
          <form onSubmit={handleSubmit} onReset={handleReset}>
            <BasicField
              name="firstName"
              {...controlProps}
            />
            <button type="submit">submit</button>
          </form>
        )
      }
    </FormKirin>
  );
}

function createUserDefinedForm(props = {}, fieldProps = {}, fieldName, errorMsg, shouldSetTouched) {
  return mount(
    <FormKirin {...props}>
      {
        ({ handleSubmit, handleReset, setFieldValue, setFieldTouched, setFieldError }) => (
          <form onSubmit={handleSubmit} onReset={handleReset}>
            <input
              name="firstName"
              onChange={e => { setFieldValue('firstName', e.target.value, true); setFieldError(fieldName, errorMsg, shouldSetTouched); } }
              onBlur={() => setFieldTouched('firstName', true)}
              {...fieldProps}
            />
            <button type="submit">submit</button>
          </form>
        )
      }
    </FormKirin>
  );
}

describe('Form', () => {
  describe('render prop', () => {
    it('pass props', () => {
      const callback = sinon.spy();

      shallow(
        <FormKirin>
          {callback}
        </FormKirin>
      );

      const expectedProps = [
        'handleSubmit',
        'handleReset',
        'values',
        'errors',
        'touched',
        'isSubmitting',
        'isValidating',
        'resetForm',
        'setErrors',
        'setFieldError',
        'handleBlur',
        'handleChange',
        'setField',
        'unsetField',
        'setTouched',
        'setFieldTouched',
        'setFieldValue',
        'dirty',
        'isValid',
        'resource'
      ];

      const props = callback.args[0][0];

      expectedProps.forEach(prop => expect(props).to.have.property(prop));
    });
  });

  describe('form submission', () => {
    it('can not submit again when isSubmitting is true', () => {
      const onSubmit = sinon.spy();

      const el = createBasicForm({ onSubmit });
      el.setState({ isSubmitting: true });
      el.find('form').simulate('submit');
      expect(onSubmit.called).to.be.false;
    });

    it('do not submit without onSubmit', (done) => {
      const el = mount(<FormKirin>{() => <div>form</div>}</FormKirin>);

      el.instance().submitForm({})
        .then((result) => {
          expect(result).to.be.false;
          done();
        }).catch(e => {
          console.log(e);
          done();
        });
    });

    it('set isSubmitting to true before calling user defined onSubmit handler', (done) => {
      // eslint-disable-next-line no-empty-function
      const el = createBasicForm({ onSubmit: () => {} });
      el.find('form').simulate('submit');
      setTimeout(() => {
        expect(el.state('isSubmitting')).to.be.true;
        done();
      }, 0);
    });

    it('set isSubmitting to false after setSubmitting is called', () => {
      const onSubmit = (values, { setSubmitting }) => {
        setSubmitting(false);
        expect(el.state('isSubmitting')).to.be.false;
      };
      const el = createBasicForm({ onSubmit });
      el.find('form').simulate('submit');
    });

    it('set isValidating to false before validation', () => {
      const el = createBasicForm({
        onSubmit: () => {},
        validateForm: () => {
          return new Promise((resolve) => {
            setTimeout(resolve, 1000);
          });
        }
      });
      el.find('form').simulate('submit');
      expect(el.state('isValidating')).to.be.true;
    });

    it('set isValidating to false before submission', () => {
      const el = createBasicForm({
        onSubmit(values, { setSubmitting }) {
          setSubmitting(false);
          expect(el.state('isValidating')).to.be.false;
        }
      });
      el.find('form').simulate('submit');
    });

    it('run form level validation', (done) => {
      const errors = { firstName: 'first name is required.' };
      const onSubmit = sinon.spy();
      const el = createBasicForm({
        onSubmit,
        validateForm(values) {
          if (!values.firstName) {
            return errors;
          }

          return  {};
        }
      });
      el.find('form').simulate('submit');
      expect(onSubmit.called).to.be.false;
      setTimeout(() => {
        expect(el.state('errors')).to.eql(errors);
        done();
      },0);
    });

    it('run form level async validation', (done) => {
      const errors = { firstName: 'first name is required.' };
      const onSubmit = sinon.spy();
      const el = createBasicForm({
        onSubmit,
        validateForm() {
          return Promise.resolve(errors);
        }
      });
      el.find('form').simulate('submit');
      expect(onSubmit.called).to.be.false;
      setTimeout(() => {
        expect(el.state('errors')).to.eql(errors);
        done();
      },0);
    });

    it('run field level validation', (done) => {
      const onSubmit = sinon.spy();
      const validateFirstName = () => {
        return 'First name is required.';
      };

      const el = createFormWithDefinedControl({ onSubmit }, { validate: validateFirstName });

      el.find('form').simulate('submit');
      expect(onSubmit.called).to.be.false;
      setTimeout(() => {
        expect(el.state('errors')).to.eql({ firstName: 'First name is required.' });
        done();
      },0);
    });

    it('pass arguments to field level validation', (done) => {
      const validateFirstName = sinon.spy();
      const el = createFormWithDefinedControl({
        initialValues: { firstName: '' },
        onSubmit: sinon.spy()
      }, { validate: validateFirstName });
      el.find('form').simulate('submit');

      setTimeout(() => {
        expect(validateFirstName.calledWith('', 'firstName', el.state('values'), el.props())).to.be.true;
        done();
      },0);
    });

    it('run field level async validation', (done) => {
      const onSubmit = sinon.spy();
      const validateFirstName = () => {
        return Promise.resolve('First name is required.');
      };

      const el = createFormWithDefinedControl({ onSubmit }, { validate: validateFirstName });

      el.find('form').simulate('submit');
      expect(onSubmit.called).to.be.false;
      setTimeout(() => {
        expect(el.state('errors')).to.eql({ firstName: 'First name is required.' });
        done();
      },0);
    });

    it('merge form and field level validation errors', (done) => {
      const onSubmit = sinon.spy();
      const validateFirstName = () => {
        return 'Field level validation.';
      };
      const validateForm = () => {
        return {
          firstName: 'Form level validation.'
        };
      };

      const el = createFormWithDefinedControl({ onSubmit, validateForm }, { validate: validateFirstName });

      el.find('form').simulate('submit');
      expect(onSubmit.called).to.be.false;
      setTimeout(() => {
        expect(el.state('errors').firstName).to.eql('Form level validation.Field level validation.');
        done();
      },0);
    });


    it('touch field before submission', (done) => {
      const onSubmit = sinon.spy();
      const validateFirstName = () => {
        return 'Field level validation.';
      };

      const el = createFormWithDefinedControl({ onSubmit }, { validate: validateFirstName });

      el.find('form').simulate('submit');
      expect(onSubmit.called).to.be.false;
      setTimeout(() => {
        expect(el.state('touched').firstName).to.be.true;
        done();
      },0);
    });

    it('submit form when there are no validation errors', (done) => {
      const onSubmit = sinon.spy();
      const validateFirstName = () => {
        return '';
      };

      const el = createFormWithDefinedControl({ onSubmit }, { validate: validateFirstName });
      // initially submitCount is zero.
      expect(el.state('submitCount')).to.eql(0);
      el.find('form').simulate('submit');
      setTimeout(() => {
        expect(onSubmit.called).to.be.true;
        expect(el.state('submitCount')).to.eql(1);
        done();
      }, 0);
    });

    it('onSubmit handler get values', (done) => {
      const onSubmit = sinon.spy();

      const el = createBasicForm({ onSubmit, initialValues: { firstName: '' } });
      const formData = { firstName: 'Jack' };
      el.setState({ values: formData });
      el.find('form').simulate('submit');
      setTimeout(() => {
        const instance = el.instance();
        expect(onSubmit.calledWith(formData, instance.formSetters(), el.props())).to.be.true;
        done();
      }, 0);
    });
  });

  describe('form reset', () => {
    it('run user defined onReset handler', (done) => {
      const onReset = sinon.spy();
      const el = createFormWithDefinedControl({
        onReset,
        initialValues: { firstName: '' }
      });
      simulateEvent('change', el.find('input'), 'firstName', 'Jack');
      setTimeout(() => {
        expect(el.state('values').firstName).to.eql('Jack');
        el.find('form').simulate('reset');
        expect(onReset.calledWith({ firstName: 'Jack' })).to.be.true;
        done();
      }, 0);
    });

    it('resetForm with values', (done) => {
      const initialValues = {
        firstName: ''
      };
      const newValues = {
        firstName: 'na'
      };
      const el = mount(
        <FormKirin initialValues={initialValues}>
          {
            ({ values, handleChange, handleSubmit, resetForm }) => (
              <form onSubmit={handleSubmit}>
                <input type="text" name="firstName" value={values.firstName} onChange={handleChange} />
                <button type="button" onClick={() => {resetForm(newValues);}}>reset</button>
              </form>
            )
          }
        </FormKirin>
      );
      simulateEvent('change', el.find('input'), 'firstName', 'Jack');
      setTimeout(() => {
        expect(el.state('values').firstName).to.eql('Jack');
        el.find('button').simulate('click');
        expect(el.state('values')).to.eql(newValues);
        expect(el.state('initialValues')).to.eql(newValues);
        done();
      }, 0);
    });

    it('onReset reset form data', (done) => {
      const onReset = sinon.spy();
      const el = createFormWithDefinedControl({
        onReset,
        validateOnChange: true,
        initialValues: { firstName: '' }
      }, {
        validate() {
          return 'First name is required.';
        }
      });
      simulateEvent('change', el.find('input'), 'firstName', 'Jack');
      simulateEvent('blur', el.find('input'), 'firstName');
      setTimeout(() => {
        expect(el.state('values').firstName).to.eql('Jack');
        expect(el.state('touched').firstName).to.be.true;
        expect(el.state('errors').firstName).to.eql('First name is required.');
        el.find('form').simulate('reset');
        expect(el.state('values')).to.eql({ firstName: '' }); // reset to initially values
        expect(el.state('touched')).to.eql({});
        expect(el.state('errors')).to.eql({});
        expect(el.state('isSubmitting')).to.be.false;
        expect(el.state('isValidating')).to.be.false;
        expect(el.state('submitCount')).to.eql(0);
        const instance = el.instance();
        expect(onReset.calledWith({ firstName: 'Jack' }, instance.formSetters(), el.props())).to.be.true;
        done();
      }, 0);
    });
  });

  describe('field mounting', () => {
    it('register field when mount', () => {
      const validate = () => 'First name is required.';
      const el = createFormWithDefinedControl({
        validateOnChange: true,
        initialValues: { firstName: '' }
      }, {
        validate
      });
      const field = el.instance().fields.firstName;

      expect(field.name).to.eql('firstName');
      expect(field).to.have.property('validate');
    });

    it('deregister field when unmount', () => {
      class ConditionalField extends Component {
        constructor(props) {
          super(props);
          this.state = {
            show: true
          };
          this.hide = this.hide.bind(this);
        }

        hide() {
          this.setState({ show: false });
        }

        render() {
          return (
            <FormKirin initialValues={{ firstName: '' }}>
              {
                () => (
                  <form>
                    {
                      this.state.show && (
                        <BasicField
                          name="firstName"
                        />
                      )
                    }
                    <button type="button" onClick={this.hide}>hide</button>
                  </form>
                )
              }
            </FormKirin>
          );
        }
      }

      const el = mount(<ConditionalField />);
      expect(el.find('input').exists()).to.be.true;
      expect(el.find('button').simulate('click'));
      expect(el.find('input').exists()).to.be.false;
      expect(el.find(FormKirin).instance().fields.firstName).to.be.undefined;
    });
  });

  describe('handleChange', () => {
    it('set field value', () => {
      const el = createFormWithDefinedControl();
      simulateEvent('change', el.find('input'), 'firstName', 'Jack');
      expect(el.state('values').firstName).to.eql('Jack');
    });

    it('do not run field validation when validateOnChange is falsy', () => {
      const validate = sinon.spy();
      const el = createFormWithDefinedControl({ validateOnChange: false }, { validate });
      simulateEvent('change', el.find('input'), 'firstName', 'Jack');
      expect(validate.called).to.be.false;
    });

    it('run field validation when validateOnChange is true', () => {
      const validate = sinon.spy();
      const el = createFormWithDefinedControl({ validateOnChange: true }, { validate });
      simulateEvent('change', el.find('input'), 'firstName', 'Jack');
      expect(validate.called).to.be.true;
    });

    it('set field validation errors', (done) => {
      const errorMsg = 'firstName is requird.';
      const validate = () => errorMsg;
      const el = createFormWithDefinedControl({ validateOnChange: true }, { validate });
      simulateEvent('change', el.find('input'), 'firstName', 'Jack');
      setTimeout(() => {
        expect(el.state('errors').firstName).to.eql(errorMsg);
        done();
      }, 0);
    });

    it('call user defined onChange', (done) => {
      const onChange = sinon.spy();
      const el = createFormWithDefinedControl({}, { onChange });
      simulateEvent('change', el.find('input'), 'firstName', 'Jack');
      setTimeout(() => {
        expect(onChange.called).to.be.true;
        done();
      }, 0);
    });
  });

  describe('handleBlur', () => {
    it('set touched', () => {
      const el = createFormWithDefinedControl({});
      simulateEvent('blur', el.find('input'), 'firstName');
      expect(el.state('touched').firstName).to.be.true;
    });

    it('do not run field validation when validateOnBlur is falsy', () => {
      const validate = sinon.spy();
      const el = createFormWithDefinedControl({ validateOnBlur: false }, { validate });
      simulateEvent('blur', el.find('input'), 'firstName');
      expect(validate.called).to.be.false;
    });

    it('run field validation when validateOnBlur is true', () => {
      const validate = sinon.spy();
      const el = createFormWithDefinedControl({ validateOnBlur: true }, { validate });
      simulateEvent('blur', el.find('input'), 'firstName');
      expect(validate.called).to.be.true;
    });

    it('set field validation errors', (done) => {
      const errorMsg = 'firstName is requird.';
      const validate = () => errorMsg;
      const el = createFormWithDefinedControl({ validateOnBlur: true }, { validate });
      simulateEvent('blur', el.find('input'), 'firstName');
      setTimeout(() => {
        expect(el.state('errors').firstName).to.eql(errorMsg);
        done();
      }, 0);
    });

    it('call user defined onBlur', (done) => {
      const onBlur = sinon.spy();
      const el = createFormWithDefinedControl({}, { onBlur });
      simulateEvent('blur', el.find('input'), 'firstName');
      setTimeout(() => {
        expect(onBlur.called).to.be.true;
        done();
      }, 0);
    });
  });

  describe('setFieldValue', () => {
    it('set value', () => {
      const el = createUserDefinedForm();
      simulateEvent('change', el.find('input'), 'firstName', 'Jack');
      expect(el.state('values').firstName).to.eql('Jack');
    });

    it('do not run field validation when validateOnChange is falsy', () => {
      const validateFirstName = sinon.spy();
      const el = createUserDefinedForm({
        validateOnChange: false,
        validate: { firstName: validateFirstName }
      });
      simulateEvent('change', el.find('input'), 'firstName', 'Jack');
      expect(validateFirstName.called).to.be.false;
    });

    it('run field validation when validateOnChange is true', () => {
      const validateFirstName = sinon.spy();
      const el = createUserDefinedForm({
        validateOnChange: true,
        validate: { firstName: validateFirstName }
      });
      simulateEvent('change', el.find('input'), 'firstName', 'Jack');
      expect(validateFirstName.called).to.be.true;
    });

    it('set field validation errors', (done) => {
      const errorMsg = 'firstName is requird.';
      const validateFirstName = () => errorMsg;
      const el = createUserDefinedForm({
        validateOnChange: true,
        validate: { firstName: validateFirstName }
      });
      simulateEvent('change', el.find('input'), 'firstName', 'Jack');
      setTimeout(() => {
        expect(el.state('errors').firstName).to.eql(errorMsg);
        done();
      }, 0);
    });
  });

  describe('setFieldTouched', () => {
    it('set field touched', () => {
      const el = createUserDefinedForm();
      simulateEvent('blur', el.find('input'), 'firstName');
      expect(el.state('touched').firstName).to.be.true;
    });
  });

  describe('setTouched', () => {
    it('set touched', (done) => {
      const initialValues = {
        firstName: ''
      };
      const touched = {
        firstName: true
      };
      const errors = {
        firstName: 'this field is required'
      };
      const onSubmit = (values, { setErrors, setTouched }) => {
        //pretend server side validation failed and we setErrors imperatively
        setErrors(errors);
        setTouched(touched);
      };

      const el = createFormWithDefinedControl({ initialValues, onSubmit }, {});

      el.find('form').simulate('submit');
      setTimeout(() => {
        expect(el.state('touched')).to.eql(touched);
        done();
      }, 0);
    });
  });

  describe('setFieldErrors', () => {
    it('set errors', () => {
      const errors = {
        firstName: 'first name is required.'
      };
      const el = createUserDefinedForm({ validateOnChange: true }, {}, 'firstName', errors.firstName);
      simulateEvent('change', el.find('input'), 'firstName', 'Jack');
      expect(el.state('errors')).to.eql(errors);
    });

    it('set touched', () => {
      const errors = {
        firstName: 'first name is required.'
      };
      const el = createUserDefinedForm({ validateOnChange: true }, {}, 'firstName', errors.firstName, true);
      simulateEvent('change', el.find('input'), 'firstName', 'Jack');
      expect(el.state('errors')).to.eql(errors);
      expect(el.state('touched').firstName).to.be.true;
    });
  });

  describe('setErrors', () => {
    it('set errors', (done) => {
      const initialValues = {
        firstName: ''
      };
      const errors = {
        firstName: 'this field is required'
      };
      const onSubmit = (values, { setErrors }) => {
        //pretend server side validation failed and we setErrors imperatively
        setErrors(errors);
      };

      const el = createFormWithDefinedControl({ initialValues, onSubmit }, {});

      el.find('form').simulate('submit');
      setTimeout(() => {
        expect(el.state('errors')).to.eql(errors);
        done();
      }, 0);
    });

    it('set touched', (done) => {
      const initialValues = {
        firstName: ''
      };
      const errors = {
        firstName: 'this field is required'
      };
      const touched = {
        firstName: true
      };
      const onSubmit = (values, { setErrors }) => {
        //pretend server side validation failed and we setErrors imperatively
        setErrors(errors, true);
      };

      const el = createFormWithDefinedControl({ initialValues, onSubmit }, {});

      el.find('form').simulate('submit');
      setTimeout(() => {
        expect(el.state('errors')).to.eql(errors);
        expect(el.state('touched')).to.eql(touched);
        done();
      }, 0);
    });
  });

  describe('validation props', () => {
    let el;
    const validate = (value, name) => {
      return value && value.startsWith('test') ? `${name} can not start with test.` : '';
    };

    const validationProps = {
      isEmail({ value, fieldName }) {
        return /^.+@.+\..+$/.test(value) ? '' : `${fieldName} must be a valid email.`;
      }
    };

    beforeEach(() => {
      el = mount(
        <FormKirin validateOnBlur enableValidationProps validationProps={validationProps}>
          {
            ({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <BasicField
                  id="firstName"
                  name="firstName"
                  required
                  minLength="5"
                  validate={validate}
                />
                <BasicField
                  id="email"
                  name="email"
                  required
                  type="email"
                  isEmail
                />
                <BasicField
                  id="quantity"
                  name="quantity"
                  type="number"
                  required
                  max="10"
                />
                <button type="submit">submit</button>
              </form>
            )
          }
        </FormKirin>
      );
    });

    it('enableValidationProps', (done) => {
      simulateEvent('blur', el.find('input#firstName'), 'firstName');
      setTimeout(() => {
        expect(el.state('errors').firstName).to.eql('firstName is required.');
        done();
      }, 0);
    });

    it('join error messages for validation props', (done) => {
      simulateEvent('change', el.find('input#firstName'), 'firstName', 'test');
      simulateEvent('blur', el.find('input#firstName'), 'firstName');

      setTimeout(() => {
        const msg = 'firstName can\'t be shorter than 5 characters. You enter 4 characters.firstName can not start with test.';
        expect(el.state('errors').firstName).to.eql(msg);
        done();
      }, 0);
    });

    it('form level validation props', (done) => {
      simulateEvent('change', el.find('input#email'), 'email', 'test');
      simulateEvent('blur', el.find('input#email'), 'email');

      setTimeout(() => {
        expect(el.state('errors').email).to.eql('email must be a valid email.');
        done();
      }, 0);
    });

    it('must not forward custom validation props to form control', () => {
      expect(el.find('input#email').props()).to.not.have.property('isEmail');
    });
  });

  describe('reinitialize', () => {
    it('reset states', () => {
      class TestExample extends Component {
        constructor(props) {
          super(props);

          this.state = { initialValues: { firstName: '' } };
        }

        render() {
          return (
            <FormKirin enableReinitialize initialValues={this.state.initialValues}>
              {
                ({ values, handleChange }) => (
                  <form>
                    <input type="text" name="firstName" value={values.firstName} onChange={handleChange} />
                    <button type="submit">submit</button>
                  </form>
                )
              }
            </FormKirin>
          );
        }
      }

      const el = mount(<TestExample />);
      expect(el.find('input').prop('value')).to.eql('');
      el.setState({ initialValues: { firstName: 'test' } });
      expect(el.find('input').prop('value')).to.eql('test');
    });
  });

  describe('validateOnMount', () => {
    it('by default do not run validate on mount', (done) => {
      const validateForm = sinon.spy();

      createFormWithDefinedControl({
        validateForm
      }, {});

      setTimeout(() => {
        expect(validateForm.called).to.be.false;
        done();
      }, 0);
    });

    it('execute validation', (done) => {
      const validateForm = sinon.spy();

      createFormWithDefinedControl({
        validateForm,
        validateOnMount: true
      }, {});

      setTimeout(() => {
        expect(validateForm.called).to.be.true;
        done();
      }, 0);
    });
  });

  describe('validateOnReinitialize', () => {
    class TestExample extends Component {
      constructor(props) {
        super(props);

        this.state = { initialValues: { firstName: '' } };
      }

      render() {
        return (
          <FormKirin
            enableReinitialize
            initialValues={this.state.initialValues}
            validateOnReinitialize={this.props.validateOnReinitialize}
            validateForm={this.props.validateForm}
          >
            {
              ({ values, handleChange }) => (
                <form>
                  <input type="text" name="firstName" value={values.firstName} onChange={handleChange} />
                  <button type="submit">submit</button>
                </form>
              )
            }
          </FormKirin>
        );
      }
    }

    it('do not execute validation if false', (done) => {
      const validateForm = sinon.spy();

      const el = mount(<TestExample validateOnReinitialize={false} validateForm={validateForm} />);
      el.setState({ initialValues: { firstName: 'test' } });
      setTimeout(() => {
        expect(validateForm.called).to.be.false;
        done();
      }, 0);
    });

    it('execute validation if true', (done) => {
      const validateForm = sinon.spy();

      const el = mount(<TestExample validateOnReinitialize validateForm={validateForm} />);
      el.setState({ initialValues: { firstName: 'test' } });
      setTimeout(() => {
        expect(validateForm.called).to.be.true;
        done();
      }, 0);
    });
  });

  describe('validateOnReset', () => {
    it('do not execute validation if false', (done) => {
      const validateForm = sinon.spy();

      const el = createFormWithDefinedControl({
        validateForm,
        validateOnReset: false
      }, {});

      el.find('form').simulate('reset');
      setTimeout(() => {
        expect(validateForm.called).to.be.false;
        done();
      }, 0);
    });

    it('execute validation if true', (done) => {
      const validateForm = sinon.spy();

      const el = createFormWithDefinedControl({
        validateForm,
        validateOnReset: true
      }, {});

      el.find('form').simulate('reset');
      setTimeout(() => {
        expect(validateForm.called).to.be.true;
        done();
      }, 0);
    });
  });

  describe('resource', () => {
    describe('get', () => {
      it('set loading to true', (done) => {
        let resolveValue;

        const el = createFormWithDefinedControl({
          resource: {
            get: () => {
              return new Promise((resolve) => {
                resolveValue = resolve;
              });
            }
          }
        });
        expect(el.state().isLoading).to.be.true;
        resolveValue();

        setTimeout(() => {
          expect(el.state().isLoading).to.be.true;
          done();
        }, 0);
      });

      it('set loading to false', (done) => {
        const el = createFormWithDefinedControl({
          resource: {
            get: (currentValues, { setLoading }) => setLoading(false)
          }
        });

        setTimeout(() => {
          expect(el.state().isLoading).to.be.false;
          done();
        }, 0);
      });

      it('initialize form sync', (done) => {
        const values = {
          firstName: 'it works'
        };

        const el = createFormWithDefinedControl({
          resource: {
            get: () => values
          }
        });

        setTimeout(() => {
          expect(el.state().values).to.eql(values);
          done();
        }, 0);
      });

      it('initialize form async', (done) => {
        const values = {
          firstName: 'it works'
        };

        const el = createFormWithDefinedControl({
          resource: {
            get: () => Promise.resolve(values)
          }
        });

        setTimeout(() => {
          expect(el.state().values).to.eql(values);
          done();
        }, 0);
      });

      it('pass arguments', (done) => {
        const getMethod = sinon.spy();

        const resource = {
          get: getMethod
        };


        const el = createFormWithDefinedControl({
          resource
        });

        setTimeout(() => {
          const instance = el.instance();
          expect(getMethod.calledWith({}, instance.formSetters(), el.props())).to.be.true;
          done();
        }, 0);
      });

      it('validate after get if validateOnMount is on', (done) => {
        const values = {
          firstName: 'test'
        };

        const el = createFormWithDefinedControl({
          validateOnMount: true,
          validateForm(formValues) {
            return {
              firstName: formValues.firstName === values.firstName && 'first name is not valid'
            };
          },
          resource: {
            get: () => Promise.resolve(values)
          }
        });

        setTimeout(() => {
          expect(el.state().values).to.eql(values);
          expect(el.state().errors.firstName).to.eql('first name is not valid');
          done();
        }, 0);
      });
    });

    describe('update', () => {
      it('onSubmit takes precedency', (done) => {
        const onSubmit = sinon.spy();
        const submitForm = sinon.spy();

        const el = createFormWithDefinedControl({
          resource: {
            get: () => ({}),
            update: submitForm
          },
          onSubmit
        });

        el.find('form').simulate('submit');
        setTimeout(() => {
          expect(onSubmit.called).to.be.true;
          expect(submitForm.called).to.be.false;
          done();
        }, 0);
      });

      it('call resource update for form submit', (done) => {
        const submitForm = sinon.spy();

        const el = createFormWithDefinedControl({
          resource: {
            get: () => ({}),
            update: submitForm
          }
        });

        el.find('form').simulate('submit');
        setTimeout(() => {
          expect(submitForm.called).to.be.true;
          done();
        }, 0);
      });

      it('pass arguments', (done) => {
        const submitForm = sinon.spy();

        const el = createFormWithDefinedControl({
          resource: {
            get: () => ({}),
            update: submitForm
          }
        });

        el.find('form').simulate('submit');
        setTimeout(() => {
          const instance = el.instance();
          expect(submitForm.calledWith(el.state().values, instance.formSetters(), el.props())).to.be.true;
          done();
        }, 0);
      });
    });

    describe('other methods', () => {
      it('pass arguments', () => {
        const deleteAction = sinon.spy();

        const el = createFormWithDefinedControl({
          resource: {
            delete: deleteAction
          }
        });

        const instance = el.instance();
        instance.resource.delete();
        expect(deleteAction.calledWith(el.state().values, instance.formSetters(), el.props())).to.be.true;
      });
    });
  });
});
/* eslint-enable react/prop-types */
