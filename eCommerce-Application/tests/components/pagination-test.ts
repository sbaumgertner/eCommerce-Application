/**
 * @jest-environment jsdom
 */
import { Pagination } from '../../src/components/pagination/pagination';

test('renders the pagination component', () => {
    const currentPage = 5;
    const maxPage = 10;

    const pagination = new Pagination(currentPage, maxPage);

    const paginationElem = pagination.getComponent();

    expect(paginationElem.classList.contains('pagination')).toBe(true);
    expect(paginationElem.childElementCount).toBe(5);
});

test('disables the first and previous page buttons when current page is 1', () => {
    const currentPage = 1;
    const maxPage = 10;

    const pagination = new Pagination(currentPage, maxPage);

    const firstPageBtn = (pagination as any).firstPageBtn;
    const prevPageBtn = (pagination as any).prevPageBtn;

    expect(firstPageBtn.disabled).toBe(true);
    expect(prevPageBtn.disabled).toBe(true);
});

test('disables the next and last page buttons when current page is at maximum page', () => {
    const currentPage = 10;
    const maxPage = 10;

    const pagination = new Pagination(currentPage, maxPage);

    const nextPageBtn = (pagination as any).nextPageBtn;
    const lastPageBtn = (pagination as any).lastPageBtn;

    expect(nextPageBtn.disabled).toBe(true);
    expect(lastPageBtn.disabled).toBe(true);
});
