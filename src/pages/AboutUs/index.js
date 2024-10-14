import React from 'react';
import './index.scss';


const AboutUs = () => {
    return (
        <div className="about-container">
            <section className="about-header">
                <h1>Về Chúng Tôi</h1>
                <p>
                    Chào mừng đến với TicketRessel - Nền tảng đặt vé sự kiện hàng đầu Việt Nam!
                </p>
            </section>

            <section className="about-content">
                <div className="about-mission">
                    <h2>Sứ Mệnh</h2>
                    <p>
                        LoLoca được thành lập với mục tiêu mang lại trải nghiệm du lịch tuyệt vời và thuận tiện nhất cho khách hàng, giúp khách hàng dễ dàng kết nối với những hướng dẫn viên chuyên nghiệp và uy tín.
                    </p>
                </div>

                <div className="about-values">
                    <h2>Giá Trị Cốt Lõi</h2>
                    <ul>
                        <li><strong>Hiểu Biết</strong>: Lắng nghe và hỗ trợ khách hàng tối đa.</li>
                        <li><strong>Khác Biệt</strong>: Áp dụng công nghệ mới để nâng cao trải nghiệm.</li>
                        <li><strong>An Toàn</strong>: Bảo mật và an toàn cho thông tin của khách hàng.</li>
                        <li><strong>Lợi Ích</strong>: Đem lại giá trị thiết thực và toàn diện cho khách hàng.</li>
                    </ul>
                </div>

                <div className="about-team">
                    <h2>Đội Ngũ Của Chúng Tôi</h2>
                    <p>
                        Chúng tôi là một tập thể những con người năng động, sáng tạo, và nhiệt huyết, luôn không ngừng cải thiện chất lượng dịch vụ để đáp ứng nhu cầu của khách hàng.
                    </p>
                </div>
            </section>

            <section className="about-contact">
                <h2>Liên Hệ</h2>
                <p>
                    Nếu bạn có bất kỳ câu hỏi hay thắc mắc nào, đừng ngần ngại liên hệ với chúng tôi:
                </p>
                <ul>
                    <li>Email: support@loloca.com</li>
                    <li>Số điện thoại: 0123-456-789</li>
                    <li>Địa chỉ: Lô E2a-7, Đường D1, Khu Công nghệ cao, Tp. Thủ Đức, TP.HCM</li>
                </ul>
            </section>
        </div>
    );
};

export default AboutUs;
