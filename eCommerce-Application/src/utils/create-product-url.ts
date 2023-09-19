export function createProductURL(productKey: string, currentPage: string): string {
    const URL = window.location.href.split('/');
    const index = URL.indexOf(currentPage);
    URL.splice(index);
    URL.push('product', productKey);
    return URL.join('/');
}
