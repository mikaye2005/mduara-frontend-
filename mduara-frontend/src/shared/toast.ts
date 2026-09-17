import Toast from 'react-native-toast-message';

interface ToastPayload {
    title: string;
    message?: string;
}

export function showSuccessToast({ message, title }: ToastPayload) {
    Toast.show({ text1: title, text2: message, type: 'success' });
}

export function showErrorToast({ message, title }: ToastPayload) {
    Toast.show({ text1: title, text2: message, type: 'error' });
}

export function showInfoToast({ message, title }: ToastPayload) {
    Toast.show({ text1: title, text2: message, type: 'info' });
}