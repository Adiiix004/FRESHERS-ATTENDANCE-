// =====================================================
// KJIT CAMPUS - ATTENDANCE REPORT
// 20 STUDENTS + 6 PERIODS
// Uses the same "attendanceData" localStorage
// =====================================================


// =====================================================
// STUDENTS
// =====================================================

const students = [
    { roll: 1, name: "Aditya Mali" },
    { roll: 2, name: "Student 2" },
    { roll: 3, name: "Student 3" },
    { roll: 4, name: "Student 4" },
    { roll: 5, name: "Student 5" },
    { roll: 6, name: "Student 6" },
    { roll: 7, name: "Student 7" },
    { roll: 8, name: "Student 8" },
    { roll: 9, name: "Student 9" },
    { roll: 10, name: "Student 10" },
    { roll: 11, name: "Student 11" },
    { roll: 12, name: "Student 12" },
    { roll: 13, name: "Student 13" },
    { roll: 14, name: "Student 14" },
    { roll: 15, name: "Student 15" },
    { roll: 16, name: "Student 16" },
    { roll: 17, name: "Student 17" },
    { roll: 18, name: "Student 18" },
    { roll: 19, name: "Student 19" },
    { roll: 20, name: "Student 20" }
];


// =====================================================
// LOAD ATTENDANCE DATA
// =====================================================

let attendanceData =
    JSON.parse(
        localStorage.getItem("attendanceData")
    ) || {};


// =====================================================
// HTML ELEMENTS
// =====================================================

const reportDate =
    document.getElementById("reportDate");

const reportSearch =
    document.getElementById("reportSearch");

const reportBody =
    document.getElementById("reportBody");


// =====================================================
// SET TODAY'S DATE
// =====================================================

const today = new Date();

const todayString =
    today.toISOString().split("T")[0];

if (reportDate) {
    reportDate.value = todayString;
}


// =====================================================
// GET ATTENDANCE FOR STUDENT / PERIOD
// =====================================================

function getAttendance(roll, period) {

    const date =
        reportDate.value;

    if (!attendanceData[date]) {
        return "";
    }

    if (!attendanceData[date][roll]) {
        return "";
    }

    return (
        attendanceData[date][roll][period]
        || ""
    );
}


// =====================================================
// CALCULATE STUDENT ATTENDANCE
// =====================================================

function calculateStudentAttendance(roll) {

    let present = 0;
    let absent = 0;

    for (
        let period = 1;
        period <= 6;
        period++
    ) {

        const status =
            getAttendance(
                roll,
                period
            );

        if (status === "P") {
            present++;
        }

        if (status === "A") {
            absent++;
        }
    }

    const total =
        present + absent;

    let percentage = 0;

    if (total > 0) {

        percentage =
            Math.round(
                (present / total) * 100
            );

    }

    return {
        present: present,
        absent: absent,
        percentage: percentage
    };
}


// =====================================================
// PERIOD STATUS
// =====================================================

function periodStatus(status) {

    if (status === "P") {

        return `
            <span class="report-present">
                ✓
            </span>
        `;

    }

    if (status === "A") {

        return `
            <span class="report-absent">
                ✕
            </span>
        `;

    }

    return `
        <span class="report-none">
            —
        </span>
    `;
}


// =====================================================
// STATUS BADGE
// =====================================================

function getStatusBadge(percentage) {

    if (percentage >= 75) {

        return `
            <span class="status good">
                🟢 Good
            </span>
        `;

    }

    if (percentage >= 50) {

        return `
            <span class="status warning">
                🟠 Average
            </span>
        `;

    }

    return `
        <span class="status danger">
            🔴 Low
        </span>
    `;
}


// =====================================================
// DISPLAY REPORT
// =====================================================

function displayReport() {

    if (!reportBody) {
        return;
    }

    reportBody.innerHTML = "";

    const searchText =
        reportSearch
            ? reportSearch.value
                .toLowerCase()
                .trim()
            : "";


    let totalPresent = 0;
    let totalAbsent = 0;


    students.forEach(student => {

        // Search
        if (
            searchText &&
            !student.name
                .toLowerCase()
                .includes(searchText) &&
            !student.roll
                .toString()
                .includes(searchText)
        ) {

            return;

        }


        const statistics =
            calculateStudentAttendance(
                student.roll
            );


        totalPresent +=
            statistics.present;

        totalAbsent +=
            statistics.absent;


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${String(student.roll).padStart(2, "0")}
            </td>

            <td class="student-name">
                ${student.name}
            </td>

            <td>
                ${periodStatus(
                    getAttendance(
                        student.roll,
                        1
                    )
                )}
            </td>

            <td>
                ${periodStatus(
                    getAttendance(
                        student.roll,
                        2
                    )
                )}
            </td>

            <td>
                ${periodStatus(
                    getAttendance(
                        student.roll,
                        3
                    )
                )}
            </td>

            <td>
                ${periodStatus(
                    getAttendance(
                        student.roll,
                        4
                    )
                )}
            </td>

            <td>
                ${periodStatus(
                    getAttendance(
                        student.roll,
                        5
                    )
                )}
            </td>

            <td>
                ${periodStatus(
                    getAttendance(
                        student.roll,
                        6
                    )
                )}
            </td>

            <td>
                <strong>
                    ${statistics.present}
                </strong>
            </td>

            <td>
                <strong>
                    ${statistics.absent}
                </strong>
            </td>

            <td>
                <strong>
                    ${statistics.percentage}%
                </strong>
            </td>

            <td>
                ${getStatusBadge(
                    statistics.percentage
                )}
            </td>

        `;


        reportBody.appendChild(row);

    });


    // =================================================
    // OVERALL ATTENDANCE
    // =================================================

    const totalMarked =
        totalPresent + totalAbsent;


    let overallPercentage = 0;


    if (totalMarked > 0) {

        overallPercentage =
            Math.round(
                (totalPresent /
                    totalMarked) * 100
            );

    }


    // =================================================
    // UPDATE SUMMARY CARDS
    // =================================================

    const studentsElement =
        document.getElementById(
            "reportStudents"
        );

    const presentElement =
        document.getElementById(
            "reportPresent"
        );

    const absentElement =
        document.getElementById(
            "reportAbsent"
        );

    const percentageElement =
        document.getElementById(
            "reportPercentage"
        );

    const progressElement =
        document.getElementById(
            "reportProgress"
        );


    if (studentsElement) {

        studentsElement.textContent =
            students.length;

    }


    if (presentElement) {

        presentElement.textContent =
            totalPresent;

    }


    if (absentElement) {

        absentElement.textContent =
            totalAbsent;

    }


    if (percentageElement) {

        percentageElement.textContent =
            overallPercentage + "%";

    }


    if (progressElement) {

        progressElement.style.width =
            overallPercentage + "%";

    }

}


// =====================================================
// MARK ALL STUDENTS PRESENT
// FOR ALL 6 PERIODS
// =====================================================

function markAllPresent() {

    const date =
        reportDate.value;


    if (!date) {

        alert(
            "Please select a date first."
        );

        return;

    }


    if (!attendanceData[date]) {

        attendanceData[date] = {};

    }


    students.forEach(student => {

        if (
            !attendanceData[date][student.roll]
        ) {

            attendanceData[date][student.roll] =
                {};

        }


        for (
            let period = 1;
            period <= 6;
            period++
        ) {

            attendanceData[date][student.roll][period] =
                "P";

        }

    });


    saveAttendance();

    displayReport();


    alert(
        "All students marked Present for all 6 periods. ✅"
    );

}


// =====================================================
// CLEAR SELECTED DATE
// =====================================================

function clearReportDate() {

    const date =
        reportDate.value;


    if (!date) {

        return;

    }


    if (!attendanceData[date]) {

        alert(
            "No attendance found for this date."
        );

        return;

    }


    const confirmation =
        confirm(
            "Are you sure you want to clear attendance for " +
            date +
            "?"
        );


    if (!confirmation) {

        return;

    }


    delete attendanceData[date];


    saveAttendance();

    displayReport();


    alert(
        "Attendance cleared successfully."
    );

}


// =====================================================
// SAVE ATTENDANCE
// =====================================================

function saveAttendance() {

    localStorage.setItem(
        "attendanceData",
        JSON.stringify(
            attendanceData
        )
    );

}


// =====================================================
// SEARCH
// =====================================================

if (reportSearch) {

    reportSearch.addEventListener(
        "input",
        displayReport
    );

}


// =====================================================
// DATE CHANGE
// =====================================================

if (reportDate) {

    reportDate.addEventListener(
        "change",
        displayReport
    );

}


// =====================================================
// MOBILE SIDEBAR
// =====================================================

function toggleSidebar() {

    const sidebar =
        document.querySelector(
            ".sidebar"
        );


    if (sidebar) {

        sidebar.classList.toggle(
            "open"
        );

    }

}


// =====================================================
// DARK MODE
// =====================================================

const themeButton =
    document.getElementById(
        "themeButton"
    );


if (themeButton) {

    themeButton.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "dark-mode"
            );


            if (
                document.body.classList.contains(
                    "dark-mode"
                )
            ) {

                themeButton.textContent =
                    "☀️";

            }

            else {

                themeButton.textContent =
                    "🌙";

            }

        }
    );

}


// =====================================================
// MAKE FUNCTIONS AVAILABLE TO HTML
// =====================================================

window.markAllPresent =
    markAllPresent;

window.clearReportDate =
    clearReportDate;

window.toggleSidebar =
    toggleSidebar;


// =====================================================
// START REPORT
// =====================================================

displayReport();