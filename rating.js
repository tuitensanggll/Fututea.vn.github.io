// Quản lý đánh giá
class RatingManager {
    constructor() {
        this.reviews = this.loadReviews();
        this.selectedRating = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.displayReviews();
        this.updateAverageRating();
    }

    setupEventListeners() {
        // Stars input
        const starsInput = document.querySelectorAll('.star-input');
        starsInput.forEach(star => {
            star.addEventListener('click', (e) => this.selectRating(e.target.dataset.value));
            star.addEventListener('mouseover', (e) => this.hoverRating(e.target.dataset.value));
        });

        document.getElementById('starsInput').addEventListener('mouseleave', () => this.resetHover());

        // Text area character count
        document.getElementById('reviewContent').addEventListener('input', (e) => {
            document.getElementById('charCount').textContent = e.target.value.length;
        });

        // Submit button
        document.getElementById('submitReview').addEventListener('click', () => this.submitReview());
    }

    selectRating(value) {
        this.selectedRating = parseInt(value);
        this.updateStarsInput();
    }

    hoverRating(value) {
        const starsInput = document.querySelectorAll('.star-input');
        starsInput.forEach((star, index) => {
            if (index < parseInt(value)) {
                star.classList.add('hover');
            } else {
                star.classList.remove('hover');
            }
        });
    }

    resetHover() {
        const starsInput = document.querySelectorAll('.star-input');
        starsInput.forEach(star => star.classList.remove('hover'));
        this.updateStarsInput();
    }

    updateStarsInput() {
        const starsInput = document.querySelectorAll('.star-input');
        starsInput.forEach((star, index) => {
            if (index < this.selectedRating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
        document.getElementById('selectedRating').value = this.selectedRating;
    }

    submitReview() {
        const title = document.getElementById('reviewTitle').value.trim();
        const content = document.getElementById('reviewContent').value.trim();
        const verified = document.getElementById('verifiedPurchase').checked;

        // Validation
        if (this.selectedRating === 0) {
            alert('Vui lòng chọn số sao đánh giá!');
            return;
        }

        if (!title) {
            alert('Vui lòng nhập tiêu đề đánh giá!');
            return;
        }

        if (!content) {
            alert('Vui lòng nhập nội dung đánh giá!');
            return;
        }

        // Tạo review object
        const review = {
            id: Date.now(),
            rating: this.selectedRating,
            title: title,
            content: content,
            verified: verified,
            author: 'Người dùng ẩn danh',
            date: new Date().toLocaleDateString('vi-VN')
        };

        // Thêm vào danh sách
        this.reviews.unshift(review);
        this.saveReviews();
        this.displayReviews();
        this.updateAverageRating();
        this.resetForm();

        alert('Cảm ơn bạn đã đánh giá!');
    }

    displayReviews() {
        const container = document.getElementById('reviewsContainer');
        const count = document.getElementById('reviewCount');

        count.textContent = this.reviews.length;

        if (this.reviews.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!</p></div>';
            return;
        }

        container.innerHTML = this.reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <div class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                    <div class="review-title">${this.escapeHtml(review.title)}</div>
                    <div class="review-date">${review.date}</div>
                </div>
                ${review.verified ? '<span class="review-verified">✓ Đã mua</span>' : ''}
                <div class="review-content">${this.escapeHtml(review.content)}</div>
                <div class="review-author">Bởi: ${review.author}</div>
            </div>
        `).join('');
    }

    updateAverageRating() {
        if (this.reviews.length === 0) {
            document.getElementById('starsDisplay').innerHTML = '<span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span>';
            document.getElementById('ratingText').textContent = 'Chưa có đánh giá';
            return;
        }

        const average = (this.reviews.reduce((sum, r) => sum + r.rating, 0) / this.reviews.length).toFixed(1);
        const roundedAverage = Math.round(average);

        const starsDisplay = document.querySelectorAll('#starsDisplay .star');
        starsDisplay.forEach((star, index) => {
            if (index < roundedAverage) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });

        document.getElementById('ratingText').textContent = `${average} / 5 (${this.reviews.length} đánh giá)`;
    }

    resetForm() {
        this.selectedRating = 0;
        document.getElementById('reviewTitle').value = '';
        document.getElementById('reviewContent').value = '';
        document.getElementById('verifiedPurchase').checked = false;
        document.getElementById('charCount').textContent = '0';
        this.updateStarsInput();
    }

    saveReviews() {
        localStorage.setItem('productReviews', JSON.stringify(this.reviews));
    }

    loadReviews() {
        const saved = localStorage.getItem('productReviews');
        return saved ? JSON.parse(saved) : [];
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// Khởi tạo khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    new RatingManager();
});