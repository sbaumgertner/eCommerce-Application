export function createProductURL(productKey: string): string {
    const URL = window.location.href.split('/');
    URL.pop();
    URL.push('product', productKey);
    return URL.join('/');
}
