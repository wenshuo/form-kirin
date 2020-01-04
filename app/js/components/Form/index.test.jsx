import React, { useState, Component } from 'react';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import Form from '.';
import BasicField from '../BasicField';
import { simulateEvent } from '../../helpers/test';

/* eslint-disable no-empty-function */
function createBasicForm(props) {
  return mount(
    <Form {...props}>
      {
        ({ values, handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <input type="text" name="firstName" value={values.firstName} onChange={handleChange} />
            <button type="submit">submit</button>
          </form>
        )
      }
    </Form>
  );
}

function createFormWithDefinedControl(props, controlProps) {
  return mount(
    <Form {...props}>
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
    </Form>
  );
}

function createUserDefinedForm(props = {}, fieldProps = {}, fieldName, errorMsg, shouldSetTouched) {
  return mount(
    <Form {...props}>
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
    </Form>
  );
}

describe('Form', () => {
  describe('render prop', () => {
    it('pass props', () => {
      const callback = sinon.spy();

      shallow(
        <Form>
          {callback}
        </Form>
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
        'isValid'
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
      const el = mount(<Form>{() => <div>form</div>}</Form>);

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
        expect(onSubmit.calledWith(formData)).to.be.true;
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
        <Form initialValues={initialValues}>
          {
            ({ values, handleChange, handleSubmit, resetForm }) => (
              <form onSubmit={handleSubmit}>
                <input type="text" name="firstName" value={values.firstName} onChange={handleChange} />
                <button type="button" onClick={() => {resetForm(newValues);}}>reset</button>
              </form>
            )
          }
        </Form>
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
      function ConditionalField() {
        const [show, setShow] = useState(true);

        return (
          <Form initialValues={{ firstName: '' }}>
            {
              ({ values, handleChange }) => (
                <form>
                  {
                    show && (
                      <input
                        type="text"
                        name="firstName"
                        value={values.firstName}
                        onChange={handleChange}
                      />
                    )
                  }
                  <button type="button" onClick={() => {setShow(false);}}>hide</button>
                </form>
              )
            }
          </Form>
        );
      }

      const el = mount(<ConditionalField />);
      expect(el.find('input').exists()).to.be.true;
      expect(el.find('button').simulate('click'));
      expect(el.find('input').exists()).to.be.false;
      expect(el.find(Form).instance().fields.firstName).to.be.undefined;
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

    it('call user defined handleChange', (done) => {
      const handleChange = sinon.spy();
      const el = createFormWithDefinedControl({}, { handleChange });
      simulateEvent('change', el.find('input'), 'firstName', 'Jack');
      setTimeout(() => {
        expect(handleChange.called).to.be.true;
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

    it('call user defined handleBlur', (done) => {
      const handleBlur = sinon.spy();
      const el = createFormWithDefinedControl({}, { handleBlur });
      simulateEvent('blur', el.find('input'), 'firstName');
      setTimeout(() => {
        expect(handleBlur.called).to.be.true;
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
        <Form validateOnBlur enableValidationProps validationProps={validationProps}>
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
        </Form>
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
            <Form enableReinitialize initialValues={this.state.initialValues}>
              {
                ({ values, handleChange }) => (
                  <form>
                    <input type="text" name="firstName" value={values.firstName} onChange={handleChange} />
                    <button type="submit">submit</button>
                  </form>
                )
              }
            </Form>
          );
        }
      }

      const el = mount(<TestExample />);
      expect(el.find('input').prop('value')).to.eql('');
      el.setState({ initialValues: { firstName: 'test' } });
      expect(el.find('input').prop('value')).to.eql('test');
    });
  });
});
/* eslint-enable-next-line no-empty-function */
