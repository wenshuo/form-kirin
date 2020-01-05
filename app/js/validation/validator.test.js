import sinon from 'sinon';
import Validator, { VALIDATION_METHODS, getErrorMessage } from './validator';

describe('Validator Class', () => {
  it('initialized validators to empty array', () => {
    expect(new Validator().validators).to.eql([]);
  });

  it('add builtin validation', () => {
    const validator = new Validator();
    validator.addValidateMethod('required');

    expect(validator.validators[0].fn).to.eql(VALIDATION_METHODS.required);
  });

  it('add builtin validation with arguments', () => {
    const validator = new Validator();
    validator.addValidateMethod('maxLength', 12);

    expect(validator.validators[0].fn).to.eql(VALIDATION_METHODS.maxLength);
    expect(validator.validators[0].args.maxLength).to.eql(12);
  });

  it('form level validator take precedency over builtins', () => {
    const formLevelValidators = {
      maxLength: () => 'test'
    };

    const validator = new Validator();
    validator.addValidateMethod('maxLength', 12, formLevelValidators);

    expect(validator.validators[0].fn).to.eql(formLevelValidators.maxLength);
    expect(validator.validators[0].args.maxLength).to.eql(12);
  });

  it('call each validator with correct arguments', () => {
    const maxLength = sinon.spy(VALIDATION_METHODS, 'maxLength');
    const validator = new Validator();
    validator.addValidateMethod('maxLength', 12);
    const errorMessages = {
      required: 'this is required'
    };
    const value = 'test';
    const fieldName = 'name';
    const values = {
      name: 'test'
    };
    validator.validate(errorMessages, value, fieldName, values);
    expect(maxLength.calledWith({ errorMessages, value, fieldName, values, maxLength: 12 })).to.be.true;
    maxLength.restore();
  });

  it('join each message with single space', (done) => {
    const validator = new Validator();
    validator.addValidateMethod('required');
    validator.addValidateMethod('minLength', 10);
    const expectedResult = 'firstName is required. firstName can\'t be shorter than 10 characters. You enter 0 characters.';
    validator.validate({}, '', 'firstName')
      .then(msg => {
        expect(msg).to.eql(expectedResult);
        done();
      });
  });

  describe('getErrorMessage method:', () => {
    it('user defined string message', () => {
      const msg = getErrorMessage('required', { required: 'first name is required.' }, {}, { fieldName: 'first name' });
      expect(msg).to.eql('first name is required.');
    });

    it('user defined function message', () => {
      const msg = getErrorMessage(
        'required',
        {
          required({ fieldName }) {
            return `${fieldName} is required.`;
          }
        },
        {},
        { fieldName: 'first name' }
      );
      expect(msg).to.eql('first name is required.');
    });

    it('use default error message', () => {
      const msg = getErrorMessage('required', {}, { required: () => 'this field is required.' }, {});
      expect(msg).to.eql('this field is required.');
    });

    it('return empty message if not found', () => {
      const msg = getErrorMessage('required', {}, {}, {});
      expect(msg).to.eql('');
    });
  });

  describe('builtin validation methods', () => {
    describe('required validator', () => {
      it('error message when value is missing', () => {
        expect(VALIDATION_METHODS.required({ value: '', fieldName: 'name' })).to.eql('name is required.');
        expect(VALIDATION_METHODS.required({ value: undefined, fieldName: 'name' })).to.eql('name is required.');
        expect(VALIDATION_METHODS.required({ value: null, fieldName: 'name' })).to.eql('name is required.');
      });

      it('empty error message when value is present', () => {
        expect(VALIDATION_METHODS.required({ value: 'yes', fieldName: 'name' })).to.eql('');
      });
    });

    describe('max validator', () => {
      it('empty message when value is not a number', () => {
        expect(VALIDATION_METHODS.max({ value: 'test' })).to.eql('');
      });

      it('empty message when value is smaller than max', () => {
        expect(VALIDATION_METHODS.max({ value: 8, max: 10})).to.eql('');
      });

      it('error message when value is larger than max', () => {
        expect(VALIDATION_METHODS.max({ value: 18, max: 10, fieldName: 'quantity'})).to.eql('quantity can\'t not be greater than 10. You enter 18.');
      });
    });

    describe('min validator', () => {
      it('empty message when value is not a number', () => {
        expect(VALIDATION_METHODS.min({ value: 'test' })).to.eql('');
      });

      it('empty message when value is greater than min', () => {
        expect(VALIDATION_METHODS.min({ value: 8, min: 5})).to.eql('');
      });

      it('error message when value is smaller than min', () => {
        expect(VALIDATION_METHODS.min({ value: 8, min: 10, fieldName: 'quantity'})).to.eql('quantity can\'t not be smaller than 10. You enter 8.');
      });
    });

    describe('maxLength validator', () => {
      it('empty message for non string', () => {
        expect(VALIDATION_METHODS.maxLength({ maxLength: 10, value: null })).to.eql('');
        expect(VALIDATION_METHODS.maxLength({ maxLength: 10, value: undefined })).to.eql('');
        expect(VALIDATION_METHODS.maxLength({ maxLength: 10, value: true })).to.eql('');
        expect(VALIDATION_METHODS.maxLength({ maxLength: 10, value: {} })).to.eql('');
        expect(VALIDATION_METHODS.maxLength({ maxLength: 10, value: 1 })).to.eql('');
      });

      it('empty message when length is less than or equal to maxLength', () => {
        expect(VALIDATION_METHODS.maxLength({ value: 'test', maxLength: 5})).to.eql('');
        expect(VALIDATION_METHODS.maxLength({ value: 'tests', maxLength: 5})).to.eql('');
      });

      it('error message when length is greater than maxLength', () => {
        expect(VALIDATION_METHODS.maxLength({ value: 'test', maxLength: 3, fieldName: 'name'})).to.eql('name can\'t be longer than 3 characters. You enter 4 characters.');
      });
    });

    describe('minLength validator', () => {
      it('empty message for non string', () => {
        expect(VALIDATION_METHODS.minLength({ minLength: 10, value: null })).to.eql('');
        expect(VALIDATION_METHODS.minLength({ minLength: 10, value: undefined })).to.eql('');
        expect(VALIDATION_METHODS.minLength({ minLength: 10, value: true })).to.eql('');
        expect(VALIDATION_METHODS.minLength({ minLength: 10, value: {} })).to.eql('');
        expect(VALIDATION_METHODS.minLength({ minLength: 10, value: 1 })).to.eql('');
      });

      it('empty message when length is greater than or equal to minLength', () => {
        expect(VALIDATION_METHODS.minLength({ value: 'test', minLength: 2 })).to.eql('');
        expect(VALIDATION_METHODS.minLength({ value: 'tests', minLength: 2 })).to.eql('');
      });

      it('error message when length is less than minLength', () => {
        expect(VALIDATION_METHODS.minLength({ value: 'te', minLength: 3, fieldName: 'name' })).to.eql('name can\'t be shorter than 3 characters. You enter 2 characters.');
      });
    });

    describe('pattern validator', () => {
      it('empty message for non string', () => {
        expect(VALIDATION_METHODS.pattern({ pattern: 'test', value: null })).to.eql('');
        expect(VALIDATION_METHODS.pattern({ pattern: 'test', value: undefined })).to.eql('');
        expect(VALIDATION_METHODS.pattern({ pattern: 'test', value: true })).to.eql('');
        expect(VALIDATION_METHODS.pattern({ pattern: 'test', value: {} })).to.eql('');
        expect(VALIDATION_METHODS.pattern({ pattern: 'test', value: 1 })).to.eql('');
      });

      it('empty message when pattern matches', () => {
        expect(VALIDATION_METHODS.pattern({ value: 'test', pattern: 'test' })).to.eql('');
      });

      it('error message when pattern does not match', () => {
        expect(VALIDATION_METHODS.pattern({ value: 'te', pattern: 'test', fieldName: 'name' })).to.eql('te is not valid value for name.');
      });
    });
  });
});
