document.addEventListener("DOMContentLoaded", () => {
  fetchSchoolSchedule();
  displayCurrentTime();
  setInterval(displayCurrentTime, 1000);  // 매 초마다 현재 시각 업데이트
  fetchWeeklySchedule();  // 1주일 일정 불러오기
});

function displayCurrentTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  document.getElementById("current-time").textContent = `현재 시각: ${timeString}`;
}

async function fetchSchoolSchedule() {
  const today = new Date().toISOString().split("T")[0];
  const apiUrl = `https://open.neis.go.kr/hub/SchoolSchedule?ATPT_OFCDC_SC_CODE=J10&SD_SCHUL_CODE=7530475&Type=json&AA_YMD=${today}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.SchoolSchedule) {
      const scheduleList = document.getElementById("schedule-list");
      scheduleList.innerHTML = "";  // 초기화

      data.SchoolSchedule[1].row.forEach(event => {
        const listItem = document.createElement("li");
        listItem.textContent = `${event.EVENT_NM} (${event.EVENT_CNTNT})`;
        scheduleList.appendChild(listItem);
      });
    } else {
      document.getElementById("schedule-list").innerHTML = "<li>오늘 일정이 없습니다.</li>";
    }
  } catch (error) {
    console.error("일정 불러오기 실패:", error);
    document.getElementById("schedule-list").innerHTML = "<li>일정 정보를 가져올 수 없습니다.</li>";
  }
}

async function fetchWeeklySchedule() {
  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + 7);  // 1주일 후까지 설정

  const startStr = today.toISOString().split("T")[0];
  const endStr = endDate.toISOString().split("T")[0];
  const apiUrl = `https://open.neis.go.kr/hub/SchoolSchedule?ATPT_OFCDC_SC_CODE=J10&SD_SCHUL_CODE=7530475&Type=json&AA_YMD=${startStr}&AA_YMD_TO=${endStr}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const weeklyScheduleList = document.getElementById("weekly-schedule-list");

    if (data.SchoolSchedule) {
      weeklyScheduleList.innerHTML = "";  // 초기화

      data.SchoolSchedule[1].row.forEach(event => {
        const listItem = document.createElement("li");
        listItem.textContent = `${event.AA_YMD} - ${event.EVENT_NM} (${event.EVENT_CNTNT})`;
        weeklyScheduleList.appendChild(listItem);
      });
    } else {
      weeklyScheduleList.innerHTML = "<li>1주일 간 일정이 없습니다.</li>";
    }
  } catch (error) {
    console.error("1주일 일정 불러오기 실패:", error);
    document.getElementById("weekly-schedule-list").innerHTML = "<li>일정 정보를 가져올 수 없습니다.</li>";
  }
}

function addTask() {
  const taskInput = document.getElementById("task-input");
  const taskTime = document.getElementById("task-time");
  const taskList = document.getElementById("task-list");

  if (taskInput.value && taskTime.value) {
    const listItem = document.createElement("li");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "삭제";
    deleteButton.className = "delete-btn";
    deleteButton.onclick = () => listItem.remove();

    const deadline = new Date();
    const [hours, minutes] = taskTime.value.split(":");
    deadline.setHours(hours);
    deadline.setMinutes(minutes);
    deadline.setSeconds(0);

    listItem.textContent = `${taskInput.value} - 마감 시간: ${taskTime.value} `;

    const countdown = document.createElement("span");
    countdown.className = "countdown";
    listItem.appendChild(countdown);
    listItem.appendChild(deleteButton);
    taskList.appendChild(listItem);

    updateCountdown(countdown, deadline);  // 남은 시간 계산
    setInterval(() => updateCountdown(countdown, deadline), 1000);

    taskInput.value = "";
    taskTime.value = "";
  } else {
    alert("과제 이름과 시간을 모두 입력하세요.");
  }
}

function updateCountdown(countdownElement, deadline) {
  const now = new Date();
  const timeRemaining = deadline - now;

  if (timeRemaining > 0) {
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    countdownElement.textContent = `남은 시간: ${hours}시간 ${minutes}분 ${seconds}초`;
  } else {
    countdownElement.textContent = "마감되었습니다.";
  }
}
