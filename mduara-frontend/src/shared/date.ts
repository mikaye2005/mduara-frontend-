import dayjs from 'dayjs';

export function formatCurrency(value: number) {
    return `KES ${value.toLocaleString()}`;
}

export function formatDate(date: string | Date, formatString = 'MMM D, YYYY') {
    return dayjs(date).format(formatString);
}

export function formatRelativeDayLabel(date: string | Date) {
    const target = dayjs(date);
    const today = dayjs();

    if (target.isSame(today, 'day')) {
        return 'Today';
    }

    if (target.isSame(today.add(1, 'day'), 'day')) {
        return 'Tomorrow';
    }

    return target.format('ddd, MMM D');
}

export function getGreeting(date = dayjs()) {
    const hour = date.hour();

    if (hour >= 17) {
        return 'Good evening';
    }

    if (hour >= 12) {
        return 'Good afternoon';
    }

    return 'Good morning';
}