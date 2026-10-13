import { registerDecorator, ValidationOptions } from 'class-validator';
import { cpf, cnpj } from 'cpf-cnpj-validator';

export function cpfcnpjvalidator(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCpfOrCnpj',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          if (!value) return true;
          return cpf.isValid(value) || cnpj.isValid(value);
        },
        defaultMessage() {
          return 'CPF ou CNPJ inválido';
        },
      },
    });
  };
}