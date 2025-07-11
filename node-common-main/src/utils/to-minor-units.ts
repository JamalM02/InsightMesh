const zeroDecimalCurrencies = new Set([
    'BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF',
    'KRW', 'MGA', 'PYG', 'RWF', 'UGX', 'VND',
    'VUV', 'XAF', 'XOF', 'XPF'
]);

export function toMinorUnits(amount: string, currency: string): number {

    const normalizedCurrency = currency.toUpperCase();
    const parsedAmount = parseFloat(amount);
    if (zeroDecimalCurrencies.has(normalizedCurrency)) {
        return Math.round(parsedAmount);
    }

    return Math.round(parsedAmount * 100);
}