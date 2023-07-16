import { Rule } from 'antd/es/form';

  export const nameRules: Rule[] = [
    { required: true, message: 'Please enter a name' },
    { pattern: /^[^\d]+$/, message: 'Name cannot contain numbers' },
  ];

  export const emailRules: Rule[] = [
    { required: true, message: 'Please enter an email' },
    { type: 'email', message: 'Please enter a valid email' },
  ];

  export const streetRules: Rule[] = [
    { required: true, message: 'Please enter a street' },
    { pattern: /^[^\d]+$/, message: 'Name cannot contain numbers' },
  ];

  export const cityRules: Rule[] = [
    { required: true, message: 'Please enter a city' },
    { pattern: /^[^\d]+$/, message: 'Name cannot contain numbers' },
  ];

  export const genderRules: Rule[] = [
    { required: true, message: 'Please select a gender' },
  ];

  export const phoneRules: Rule[] = [
    { required: true, message: 'Please enter a phone number' },
    { pattern: /^[+()\- \d]{10,}$/, message: 'Phone number must be 10 digits with an optional +' }
  ];
  

