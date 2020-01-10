import sinon from 'sinon';
import Validator, { VALIDATION_METHODS, getErrorMessage } from './validator';

describe('Validator Class', () => {
  it('initialized validators to empty array', () => {
    expect(new Validator().validators).to.eql([]);
  });

  it('add builtin validation', () => {
    const validator = new Validator();
    validator.addValidateMethod('required');

    expect(validator.validators[0]).to.eql(VALIDATION_METHODS.required);
  });

  it('form level validator take precedency over builtins', () => {
    const formLevelValidators = {
      maxLength: () => 'test'
    };

    const validator = new Validator();
    validator.addValidateMethod('maxLength', formLevelValidators);

    expect(validator.validators[0]).to.eql(formLevelValidators.maxLength);
  });

  it('call each validator with correct arguments', () => {
    const maxLength = sinon.spy(VALIDATION_METHODS, 'maxLength');
    const validator = new Validator();
    validator.addValidateMethod('maxLength');
    const errorMessages = {
      required: 'this is required'
    };
    const value = 'test';
    const fieldName = 'name';
    const values = {
      name: 'test'
    };
    const props = { maxLength: 12, errorMessages };
    validator.validate(value, fieldName, values, props);
    expect(maxLength.calledWith(value, fieldName, values, props)).to.be.true;
    maxLength.restore();
  });

  it('join each message with single space', (done) => {
    const validator = new Validator();
    validator.addValidateMethod('required');
    validator.addValidateMethod('minLength');
    const expectedResult = 'firstName is required. firstName can\'t be shorter than 10 characters. You enter 0 characters.';
    validator.validate('', 'firstName', null, { minLength: 10 })
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
        expect(VALIDATION_METHODS.required('', 'name' )).to.eql('name is required.');
        expect(VALIDATION_METHODS.required(undefined, 'name')).to.eql('name is required.');
        expect(VALIDATION_METHODS.required(null, 'name')).to.eql('name is required.');
      });

      it('empty error message when value is present', () => {
        expect(VALIDATION_METHODS.required('yes', 'name')).to.eql('');
      });
    });

    describe('max validator', () => {
      it('empty message when value is not a number', () => {
        expect(VALIDATION_METHODS.max('test')).to.eql('');
      });

      it('empty message when value is smaller than max', () => {
        expect(VALIDATION_METHODS.max(8, 'quantity',{}, { max: 10 })).to.eql('');
      });

      it('error message when value is larger than max', () => {
        expect(VALIDATION_METHODS.max(18, 'quantity', {}, { max: 10 })).to.eql('quantity can\'t not be greater than 10. You enter 18.');
      });
    });

    describe('min validator', () => {
      it('empty message when value is not a number', () => {
        expect(VALIDATION_METHODS.min('test')).to.eql('');
      });

      it('empty message when value is greater than min', () => {
        expect(VALIDATION_METHODS.min(8, 'quantity', {}, { min: 5 })).to.eql('');
      });

      it('error message when value is smaller than min', () => {
        expect(VALIDATION_METHODS.min(8, 'quantity', {}, { min: 10 })).to.eql('quantity can\'t not be smaller than 10. You enter 8.');
      });
    });

    describe('maxLength validator', () => {
      it('empty message for non string', () => {
        expect(VALIDATION_METHODS.maxLength(null, 'name', {}, { maxLength: 10 })).to.eql('');
        expect(VALIDATION_METHODS.maxLength(undefined, 'name', {}, { maxLength: 10 })).to.eql('');
        expect(VALIDATION_METHODS.maxLength(true, 'name', {}, { maxLength: 10 })).to.eql('');
        expect(VALIDATION_METHODS.maxLength({}, 'name', {}, { maxLength: 10 })).to.eql('');
        expect(VALIDATION_METHODS.maxLength(1, 'name', {}, { maxLength: 10 })).to.eql('');
      });

      it('empty message when length is less than or equal to maxLength', () => {
        expect(VALIDATION_METHODS.maxLength('test', 'name', {}, { maxLength: 5 })).to.eql('');
        expect(VALIDATION_METHODS.maxLength('tests', 'name', {}, { maxLength: 5 })).to.eql('');
      });

      it('error message when length is greater than maxLength', () => {
        expect(VALIDATION_METHODS.maxLength('test', 'name', {}, { maxLength: 3 })).to.eql('name can\'t be longer than 3 characters. You enter 4 characters.');
      });
    });

    describe('minLength validator', () => {
      it('empty message for non string', () => {
        expect(VALIDATION_METHODS.minLength(null, 'name', {}, { minLength: 10 })).to.eql('');
        expect(VALIDATION_METHODS.minLength(undefined, 'name', {}, { minLength: 10 })).to.eql('');
        expect(VALIDATION_METHODS.minLength(true, 'name',  {}, { minLength: 10 })).to.eql('');
        expect(VALIDATION_METHODS.minLength({}, 'name', {}, { minLength: 10 })).to.eql('');
        expect(VALIDATION_METHODS.minLength(1, 'name', {}, { minLength: 10 })).to.eql('');
      });

      it('empty message when length is greater than or equal to minLength', () => {
        expect(VALIDATION_METHODS.minLength('test', 'name', {}, { minLength: 2 })).to.eql('');
        expect(VALIDATION_METHODS.minLength('tests', 'name', {}, { minLength: 2 })).to.eql('');
      });

      it('error message when length is less than minLength', () => {
        expect(VALIDATION_METHODS.minLength('te', 'name', {}, { minLength: 3 })).to.eql('name can\'t be shorter than 3 characters. You enter 2 characters.');
      });
    });

    describe('pattern validator', () => {
      it('empty message for non string', () => {
        expect(VALIDATION_METHODS.pattern(null, 'name', {}, { pattern: 'test' })).to.eql('');
        expect(VALIDATION_METHODS.pattern(undefined, 'name', {}, { pattern: 'test' })).to.eql('');
        expect(VALIDATION_METHODS.pattern(true, 'name', {}, { pattern: 'test' })).to.eql('');
        expect(VALIDATION_METHODS.pattern({}, 'name', {}, { pattern: 'test' })).to.eql('');
        expect(VALIDATION_METHODS.pattern(1, 'name', {}, { pattern: 'test' })).to.eql('');
      });

      it('empty message when pattern matches', () => {
        expect(VALIDATION_METHODS.pattern('test', 'name', {}, { pattern: 'test' })).to.eql('');
      });

      it('error message when pattern does not match', () => {
        expect(VALIDATION_METHODS.pattern('te', 'name', {}, { pattern: 'test' })).to.eql('te is not valid value for name.');
      });
    });
  });
});
