// Danh sách giá trị các bao lì xì
const envelopes = [
    { value: 1000 }, { value: 1000 },
    { value: 2000 }, { value: 2000 },
    { value: 5000 }, { value: 5000 }, { value: 5000 }, { value: 5000 }, { value: 5000 },
    { value: 10000 }, { value: 10000 }, { value: 10000 }, { value: 10000 },
    { value: 20000 }, { value: 20000 }, { value: 20000 }, { value: 20000 },
    { value: 50000 }, { value: 100000 },
    { value: "Thư tình yêu" }
];

// Biến toàn cục để lưu số bao lì xì đã rút
let drawnEnvelopes = [];

// Lưu lịch sử rút bao lì xì
let history = [];

// Biến để lưu index của bao lì xì được chọn
let selectedEnvelopeIndex = null;

// Hiển thị bao lì xì
function renderEnvelopes() {
    const envelopeContainer = document.getElementById('envelope-container');
    envelopeContainer.innerHTML = ''; // Xóa bao cũ nếu có

    // Xáo trộn danh sách bao lì xì
    const shuffledEnvelopes = envelopes.sort(() => 0.5 - Math.random());

    // Tạo bao lì xì
    shuffledEnvelopes.forEach((envelope, index) => {
        const envelopeDiv = document.createElement('div');
        envelopeDiv.classList.add('envelope');
        envelopeDiv.setAttribute('data-index', index);
        envelopeDiv.addEventListener('click', () => selectEnvelope(index, envelope.value));
        envelopeContainer.appendChild(envelopeDiv);
    });
}

// Hiển thị modal xác nhận khi chọn bao lì xì
function selectEnvelope(index, value) {
    const confirmationModal = document.getElementById('confirmation-modal');
    const confirmYesButton = document.getElementById('confirm-yes');
    const confirmNoButton = document.getElementById('confirm-no');

    // Lưu lại bao lì xì đang chọn
    selectedEnvelopeIndex = index;

    // Hiển thị modal
    confirmationModal.style.display = 'flex';

    // Sự kiện khi người dùng chọn Yes
    confirmYesButton.onclick = function() {
        openEnvelope(selectedEnvelopeIndex, value);  // Mở bao lì xì
        confirmationModal.style.display = 'none';  // Ẩn modal
    };

    // Sự kiện khi người dùng chọn No
    confirmNoButton.onclick = function() {
        confirmationModal.style.display = 'none';  // Ẩn modal
    };

    // Cho phép người dùng click vào vùng trống để ẩn thông báo
    document.getElementById('result-overlay').addEventListener('click', function() {
        this.style.display = 'none';
    });
}

// Hàm mở bao lì xì
function openEnvelope(index, value) {
    const resultElement = document.getElementById('result');
    const resultOverlay = document.getElementById('result-overlay');

    // Giới hạn số lần rút là 11 bao
    if (drawnEnvelopes.length >= 11) {
        resultElement.innerText = "Em đã rút hết 11 bao lì xì!";
        resultOverlay.style.display = 'flex';
        return;
    }

    // Kiểm tra nếu bao đã được rút
    if (drawnEnvelopes.includes(index)) {
        resultElement.innerText = "Bao lì xì này đã được rút rồi!";
        resultOverlay.style.display = 'flex';
        return;
    }

    // Hiển thị kết quả với định dạng tiền
    const formattedValue = typeof value === 'number' 
    ? `${value.toLocaleString().replace(/,/g, '.')} VNĐ`
    : value;

    resultElement.innerText = formattedValue === "Thư tình yêu" 
    ? "Chúc mừng! Em đã nhận được bức thư tình yêu!" 
    : `Em đã nhận được ${formattedValue}!`;


    // Hiển thị thông báo ở giữa màn hình
    resultOverlay.style.display = 'flex';

    // Đổi màu bao lì xì và không cho chọn lại
    const envelopeDiv = document.querySelector(`.envelope[data-index="${index}"]`);
    envelopeDiv.classList.add('gray');
    envelopeDiv.removeEventListener('click', () => selectEnvelope(index, value));

    drawnEnvelopes.push(index);

    // Lưu lịch sử
    const currentTime = new Date();
    const timeString = currentTime.toLocaleString();  // Lấy thời gian theo định dạng địa phương
    const historyItem = {
        time: timeString,
        value: formattedValue === "Thư tình yêu" ? value : `${value.toLocaleString()} VNĐ`
    };
    history.push(historyItem);

    // Cập nhật lịch sử hiển thị
    updateHistory();
}

// Cập nhật và hiển thị lịch sử
function updateHistory() {
    const historyContainer = document.getElementById('history');
    historyContainer.innerHTML = '';  // Xóa lịch sử cũ

    history.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `${item.time} + <strong>${item.value}</strong>`;
        historyContainer.appendChild(li);
    });
}

// Đảm bảo rằng sidebar chiếm hết chiều cao trang ngay cả khi nội dung thay đổi
function updateSidebarHeight() {
    var contentHeight = document.body.scrollHeight; // Lấy chiều cao của toàn bộ nội dung
    var sidebars = document.querySelectorAll('.sidebar img');
    
    sidebars.forEach(function(sidebar) {
        sidebar.style.height = contentHeight + 'px'; // Cập nhật chiều cao
    });
}

// Function to format time (HH:MM:SS) and date (Day, Month, Year)
function updateClock() {
    const now = new Date();

    // Get the current time
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // Get the current date
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = now.getFullYear();

    // Format the date and time
    const timeString = `${hours}:${minutes}:${seconds}`;
    const dateString = `${day}/${month}/${year}`;

    // Update the clock element with the formatted time and date
    document.getElementById('clock').innerText = `${timeString} - ${dateString}`;
}

// Function to format time (HH:MM:SS) and date (Day, Month, Year)
function updateClock() {
    // Lấy thời gian thực tế từ hệ thống (ngày giờ hiện tại)
    const now = new Date(); // Lấy thời gian hệ thống thực tế

    // Giờ hiện tại từ thời gian thực tế
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // Lấy ngày, tháng, năm từ biến now
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = now.getFullYear();

    // Định dạng giờ và ngày
    const timeString = `${hours}:${minutes}:${seconds}`;
    const dateString = `${day}/${month}/${year}`;

    // Ngày bắt đầu Tết (Mùng 1 Tết là 29/1/2025)
    const startTetDate = new Date('2025-1-29');

    // Nếu ngày hiện tại nhỏ hơn ngày bắt đầu Tết, không hiển thị ngày Tết
    if (now < startTetDate) {
        const clockElement = document.getElementById('clock');
        clockElement.innerHTML = `${timeString} - ${dateString}`;
        return; // Không làm gì thêm nếu chưa đến ngày Tết
    }

    // Tính sự khác biệt giữa ngày hiện tại và ngày bắt đầu Tết
    const daysDifference = Math.floor((now - startTetDate) / (1000 * 60 * 60 * 24));

    let tetDayString = '';
    if (daysDifference >= 0 && daysDifference <= 9) {
        // Hiển thị từ Mùng 1 đến Mùng 10
        tetDayString = `<span class="tet-day">- Mùng ${daysDifference + 1} Tết</span>`;
    }

    // Cập nhật hiển thị thời gian và ngày tháng
    const clockElement = document.getElementById('clock');
    clockElement.innerHTML = `${timeString} - ${dateString} ${tetDayString}`;
}

// Gọi hàm updateClock mỗi giây để cập nhật thời gian liên tục
setInterval(updateClock, 1000);

// Cập nhật mỗi giây
setInterval(updateClock, 1000);

// Khởi tạo khi trang tải xong
window.onload = updateClock;


// Update the clock every second
setInterval(updateClock, 1000);

// Initial call to display clock immediately when the page loads
updateClock();

document.getElementById('logout-button').addEventListener('click', function() {
    // Khi bấm vào nút đăng xuất, chuyển hướng về trang đăng nhập
    window.location.href = 'index.html'; // Điều hướng đến trang đăng nhập
});

// Danh sách các bài hát
const playlist = [
    'music/TetTetTetTetDenRoi.mp3',
    'music/TetDongDay.mp3',
    'music/NamQuaDaLamGi.mp3',
];

const audioElement = document.getElementById('backgroundMusic');
let currentTrackIndex = 0; // Chỉ số bài hát hiện tại

// Hàm phát nhạc
function playTrack(index) {
    if (index >= playlist.length) {
        currentTrackIndex = 0; // Quay lại bài đầu tiên nếu hết playlist
    } else {
        currentTrackIndex = index;
    }
    audioElement.src = playlist[currentTrackIndex]; // Gán bài hát vào thẻ audio
    audioElement.play(); // Phát bài hát
}

// Khi bài hát kết thúc, chuyển sang bài tiếp theo
audioElement.addEventListener('ended', function () {
    playTrack(currentTrackIndex + 1); // Phát bài tiếp theo
});

// Thiết lập âm lượng và phát bài đầu tiên
audioElement.volume = 0.3; // Đặt âm lượng (0.0 đến 1.0)
playTrack(0); // Phát bài đầu tiên khi tải trang

// Gọi hàm khi trang tải và khi nội dung thay đổi
window.onload = updateSidebarHeight;
window.onresize = updateSidebarHeight;

// Khởi tạo trang web
renderEnvelopes();
