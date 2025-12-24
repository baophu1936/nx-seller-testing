export interface IUserData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  username?: string;
  password?: string;
  terms?: boolean;
}
const getRandomId = () => Math.floor(Math.random() * 10000);
// Chuyển validUser thành một hàm để sinh dữ liệu mới mỗi lần gọi

export const createValidUser = (): IUserData => {
  const id = getRandomId();
  return {
    firstName: 'Phu',
    lastName: 'Bao',
    phone: `91${id}`, // Sinh số điện thoại ngẫu nhiên
    email: `baophu${id}@gmail.com`, // Email luôn mới
    username: `user${id}`, // Username luôn mới
    password: 'Password@123',
    terms: true,
  };
};

export const createValidUserPhone = (): IUserData => {
  const id = getRandomId();
  return {
    firstName: 'Phu',
    lastName: 'Bao',
    phone: `+91${id}`, // Sinh số điện thoại ngẫu nhiên
    email: `baophu${id}@gmail.com`, // Email luôn mới
    username: `user${id}`, // Username luôn mới
    password: 'Password@123',
    terms: true,
  };
};

const validUser: IUserData = {
  firstName: 'Phu',
  lastName: 'Bao',
  phone: '1915509105',
  email: 'baophu18818@gmail.com',
  username: 'baophu199',
  password: 'Password@123',
  terms: true,
};

export const SignUpTestData = {
  validUser,
  invalidEmail: { ...validUser, email: 'test111gmail.com' },
  existingUser: { ...validUser, username: 'baophu170' },
  passwordValidation: {
    tooShort: 'tyt',
    noLowercase: 'AAAA123',
    noUppercase: 'aaaa123',
    noNumber: 'AAaa@@',
  },
  invalidPhone: {
    tooLong: '1234567890123456', // Sai: Quá 15 chữ số
    startsWithZero: '0915509105', // Sai: Theo regex trên, số đầu tiên phải là [1-9]
    withSpecialChar: '+84-915-509',
    withPlus: '+1234', // Sai: Không được có dấu gạch ngang
  },
  passwordValidationRules: {
    tooShort: 'tyt', // Sai: Quá ngắn
    noLowercase: 'AAAA123', // Sai: Không có chữ thường
    noUppercase: 'aaaa123', // Sai: Không có chữ hoa
    noNumber: 'AAaa@@', // Sai: Không có số
  },
};

export const PhoneValidationData = {
  valid: '84915509105', // Khớp pattern
  errorPattern: '0915509105', // Lỗi: bắt đầu bằng số 0
  errorTooLong: '1234567890123456', // Lỗi: 16 chữ số (quá 15)
  withSpecialChar: '+84-915-509',
  serverErrorMessage:
    'The request body is invalid. See error object `details` property for more info.',
};

export const Validationemail = "Please include an '@' in the email address.";

export const fieldRequiredMessage = 'Please fill out this field.';

export const PasswordErrorMessages = {
  short: 'Password must be greater than or equal to 4.',
  uppercase: 'Password must contain at least one uppercase letter (A-Z)',
  lowercase: 'Password must contain at least one lowercase letter (a-z)',
  number: 'Password must contain at least one number (0-9)',
};
