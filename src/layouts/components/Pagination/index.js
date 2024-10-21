import Paginate from "react-paginate";
import classNames from "classnames/bind";
import styles from "./Pagination.module.scss";

function Pagination({ currentPage, pageCount, onPageChange}) {
    const cx = classNames.bind(styles);

    // Hàm chuyển trang
    const handlePageChange = (selectedItem) => {
        onPageChange(selectedItem.selected); // Gọi hàm onPageChange từ component cha
    };

    return (
        <div className={cx('issuesPagination', styles.pagination)} >
            <Paginate
                 forcePage={currentPage}
                 pageCount={pageCount}
                 marginPagesDisplayed={2}
                 pageRangeDisplayed={5}
                 onPageChange={handlePageChange}
                 nextLabel="&rarr;"
                 previousLabel="&larr;"
                 pageLinkClassName={cx('pageLink')}
                 previousLinkClassName={cx('previousLink')}
                 nextLinkClassName={cx('nextLink')}
                 activeLinkClassName={cx('activePage')}
            />
        </div>
    );
}

export default Pagination;
