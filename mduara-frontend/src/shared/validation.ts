import * as Yup from 'yup';

const kenyaPhoneRegex = /^(?:\+254|0)[71]\d{8}$/;

export const signInSchema = Yup.object({
    phone: Yup.string().matches(kenyaPhoneRegex, 'Use a valid Kenyan phone number').required('Phone number is required'),
    pin: Yup.string().matches(/^\d{4}$/, 'PIN must be 4 digits').required('PIN is required'),
});

export const registerSchema = Yup.object({
    fullName: Yup.string().min(2, 'Enter your full name').required('Full name is required'),
    phone: Yup.string().matches(kenyaPhoneRegex, 'Use a valid Kenyan phone number').required('Phone number is required'),
    email: Yup.string().email('Enter a valid email').required('Email is required'),
    pin: Yup.string().matches(/^\d{4}$/, 'PIN must be 4 digits').required('PIN is required'),
});