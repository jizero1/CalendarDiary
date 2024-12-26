const currentDate = document.querySelector(".current-date"); // 달,연도 <p>태그
const daysTag = document.querySelector(".calendar_days"); // 날짜 <li>태그
const preNextIcon = document.querySelectorAll(".wrapper span"); // 달력 넘기는 부분 <> <span>태그

let date = new Date();
let year = date.getFullYear();
let month = date.getMonth();
let day = date.getDate();

const monthNames = ["January", "February", "March", "Aprill", "May",
    "June", "July", "August", "September", "October", "November", "December"];

// ------------------ 달력 생성 함수 ------------------ //
const renderCalendar = () => {

    const days = document.querySelectorAll('.calendar_days li'); // 모든 날짜 요소를 가져옴

    let lastDateofMonth = new Date(year, month + 1, 0).getDate(), // 현재 월의 마지막 날짜 가져오기
        lastDateofLastMonth = new Date(year, month, 0).getDate(), // 현재 월이 아닌, 전 월의 마지막 날짜가져오기
        firstDayofMonth = new Date(year, month, 1).getDay(), // 현재 월의 첫번째 요일( 0 = 일요일, 6 = 토요일 ) 가져오기
        lastDayofMonth = new Date(year, month, lastDateofMonth).getDay(); // 현재 월의 마지막 요일 ( 0 = 일요일, 6 = 토요일 )가져오기

    let liTag = "";

    // * 달력의 앞부분 (29,30,31..)
    for (let i = firstDayofMonth; i > 0; i--) {
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`; // i는 현재월의 첫번째요일(0~6), (전월의 마지막날짜 - i + 1) 
    };
    // * 달력의 중앙(현재 달의 날짜)부분 (1, 2, 3..)
    for (let i = 1; i <= lastDateofMonth; i++) { // i는 1부터 현재월의 마지막날짜까지 반복
        let isToday = (i ===  day) && (month === new Date().getMonth()) && (year === new Date().getFullYear()) ? "active" : "";
        liTag += `<li id="day-${i}" class="${isToday}">${i}</li>`; // 위 세가지 조건이 모두 true 일경우, isToday변수에 active를 할당
    };
    // * 달력의 끝부분 (1, 2, 3...)
    for (let i = lastDayofMonth; i < 6; i++) {
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`; // i는 현재월의 마지막 날짜, (i - 현재월의 마지막 날짜 + 1)
    };
   
    daysTag.innerHTML = liTag; 



    // ------------------ 모든 날짜에 모달 기능 추가 ------------------ //
    for (let i = 1; i <= lastDateofMonth; i++) {
        const dayElement = document.querySelector("#day-"+i); // id가 #day-i인 모든 <li>날짜요소 불러오기
        const dayID = dayElement.id; // 각 날짜의 id (day-1, day-2 등)
        const modalCheckID = year + "년" + (month+1) + "월" + dayID; // 날짜별 고유 ID

        // 화면을 새로고침하거나, 이전달 또는 다음달로 이동시 renderCalendar()함수가 호출되고,
        // 달력이 재렌더링되어 날짜별로 표시된 "📝"이모티콘이 사라지는 문제가 생김. 
        // 이를 해결하기 위해 for문으로 달력의 마지막 날짜까지 돌며, 해당 날짜에 이모티콘 데이터가 있는지 확인후, 
        // 데이터가 존재한다면 localStorage에 저장된"📝"이모티콘을 dayElement에 추가함.
        const savedData = localStorage.getItem(modalCheckID); // modalCheckID에는 각 날짜별로 "📝" 이모티콘이 저장되어있음
        if (savedData) {
            dayElement.textContent += savedData;
        };


        // ------------------ 모달 1. 날짜 클릭시 모달띄우기 ------------------ //
        dayElement.addEventListener('click',function(e) {

            const clickDay = e.target.id;
            const clickMonth = month+1;
            const clickDMY = year + "년" + clickMonth + "월" + clickDay;
            const modalTextID = year+"."+clickMonth+"."+i; // 모달 상단 텍스트별 고유 ID



            // ------------------ 모달 2. 모달창 HTML 생성 및 추가 ------------------ //
            const modalID = `modal-${clickDMY}`; // 모달마다 고유 id 생성
            const modalHTML = `
            <div class="modal" id="${modalID}">
                <h2 class="modal-h2">${modalTextID}</h2>
                <button class="modal-x"><i class="fa-solid fa-x"></i></button>
                <label class="fileLabel" for="fileInput"><i class="fa-solid fa-plus"></i></label>
                <input type="file" id="fileInput" style="display: none;">
                <img class="img">
                <textarea id="textArea"></textarea>
                <div>
                <button id="img-remove" class="btnStyle">이미지 삭제</button>
                <button class="modal-save btnStyle">확인</button>
                </div>
            </div>`;

            document.querySelector("#modal-container").insertAdjacentHTML('beforeend',modalHTML); // 부모요소 끝에 modalHTML을 삽입




            // ------------------ 모달 3. 모달 확인(저장)버튼 ------------------ //
            const text = document.querySelector("#textArea");
            const textID = clickDMY+"텍스트"; // 모달별 텍스트 구별을 위한 id
            const modalCloseID = document.querySelector(`#${modalID}`); // 모달별 id (모달창 닫는 용도로 이용)
            const getFile = localStorage.getItem(clickDMY+"img");

            document.querySelector(`#${modalID} .modal-save`).addEventListener('click',function() {
                const saveText = text.value; // textarea에 입력된 값을 변수에 저장
                localStorage.setItem(textID,saveText); 

                const getText = localStorage.getItem(textID); // localStorage에 저장된 텍스트 가져오기

                if (getText || file) {
                    if (savedData === null) {
                        localStorage.setItem(modalCheckID, "📝");
                         dayElement.textContent += "📝";
                    };
                } else if (!getText && (!getFile || !file)) {
                    alert("이미지 없음");
                    localStorage.removeItem(modalCheckID);
                    dayElement.textContent = dayElement.textContent.replace("📝", "");
                };

                if (!getText) {
                    localStorage.removeItem(textID);
                };

                modalCloseID.remove(); // 확인버튼 누르면 모달 닫기
            });

            

        
            // ------------------ 모달 4. 저장된 텍스트 띄우기 ------------------ //
            const getText = localStorage.getItem(textID);
            if (getText) {
                text.textContent= getText;
            } 
        


            // ------------------ 모달 5. 이미지 업로드 ------------------ //
            const fileInput = document.querySelector(`#${modalID} #fileInput`);
            const img = document.querySelector(`#${modalID} .img`);

            let file; // 모달3번에서 이모티콘 추가시 이용되기 때문에 전역변수로 설정.

            fileInput.addEventListener('change', function (e) {
                file = e.target.files[0];

                if (file) {
                    const reader = new FileReader(); // 이미지 파일을 읽는 객체 (다 읽으면 onload이벤트를 트리거함)

                    reader.onload = function (e) { // 성공적으로 파일을 읽을시 실행되는 함수
                        img.setAttribute('src', e.target.result); // <img>태그의 src 속성값을 e.target.result로 변경 (e.target.result안에는 파일데이터가 담겨있음)
                        img.style.display = 'block'; // 이미지를 보이게 함.
                        localStorage.setItem(clickDMY+"img", e.target.result); // 파일정보를 localStorage에 저장
                    };

                    reader.readAsDataURL(file); // File객체를 인수로 받아 해당 파일을 Data URL 형식으로 읽음
                    fileInput.style.display = 'none'; // 이미지 파일 업로드후, 파일 선택란 숨기기
                };
            });
            


            


            // ------------------ 모달 6. 저장된 이미지 띄우기 ------------------ //
            const imgRemove = document.querySelector('#img-remove'); // 이미지 삭제버튼 불러오기

            if (getFile) { // localStorage안에 이미지가 있을경우
                img.setAttribute('src', getFile); // <img>태그의 src부분에 이미지데이터를 넣음
                img.style.display = 'block'; // 이미지를 보이게 함.
                fileInput.style.display = 'none'; // 파일선택란 숨기기
            } else { // localStorage안에 이미지가 없을경우 
                img.style.display = 'none'; // 이미지 안보이게 함.
                imgRemove.style.display = 'none'; // 이미지 삭제버튼도 안보이게 함. (삭제할 이미지가 없으니까)
            };



            // ------------------ 모달 7. 이미지 삭제 ------------------ //

            // 이미지 삭제버튼 누를시 처리
            imgRemove.addEventListener('click', function () {
                img.style.display = 'none';
                localStorage.removeItem(clickDMY+"img"); // localStorage안에 저장된 이미지 삭제
                imgRemove.style.display = 'none';
            }); 
            
            

            // ------------------ 모달 8. 모달 닫기 (저장x, 그냥 닫기)------------------ //
            document.querySelector('.modal-x').addEventListener('click',function() {
                modalCloseID.remove();
            });
        });
    };
};



// ------------------ < 이전 2024 December 다음 > 달력 렌더링 ------------------ //
// 이전(prev) 다음(next) 클릭할때마다 현재 연도와 월을 조정하여 새로운 달력을 렌더링함.
preNextIcon.forEach(i => {
    i.addEventListener("click", () => {
        // i.id가 prev이냐 아니냐에 따라 month를 -1하거나 +1함.
        month = i.id === "prev" ? month - 1 : month + 1;
        // 12월 이상이 되었을때 undifinded가 뜨는 오류를 해결하기 위해,
        // 0 이하이거나 11 이상이되면 date, year, month를 새로 추출.
        if (month < 0 || month > 11) {
            date = new Date(year, month);
            year = date.getFullYear();
            month = date.getMonth();
        } else {
            date = new Date();
        };
        // 달력 함수 호출 (새로운 달력 렌더링)
        renderCalendar();
    });
});
// window.onload()시 달력 렌더링
renderCalendar();