// ======================================================
// KJIT CAMPUS - DAILY ATTENDANCE SYSTEM
// FINAL INTEGRATED SCRIPT
// ======================================================

"use strict";


// ======================================================
// DEFAULT STUDENTS
// ======================================================

const defaultStudents = [
    { roll: "CE-01", name: "AAKASH ASHVINKUMAR PARMAR", department: "Computer Engineering", semester: "Semester 1" },
    { roll: "CE-02", name: "ALTAFBHAI AJITBHAI GHANCHI", department: "Computer Engineering", semester: "Semester 1" },
    { roll: "CE-03", name: "SATYAM TIWARI", department: "Computer Engineering", semester: "Semester 1" },
    { roll: "CE-04", name: "DEVDATT NILAMKUMAR JOSHI", department: "Computer Engineering", semester: "Semester 1" },
    { roll: "CE-05", name: "SHREYANSHI DHANDHUKIYA NILESHBHAI", department: "Computer Engineering", semester: "Semester 1" },
    { roll: "CE-06", name: "ADITYA DHARMESH MALI", department: "Computer Engineering", semester: "Semester 1" },
    { roll: "CE-07", name: "JAINUL MOHAMMADAMIN KHATRI", department: "Computer Engineering", semester: "Semester 1" },
    { roll: "CE-08", name: "SIDDHI KIRANKUMAR PARMAR", department: "Computer Engineering", semester: "Semester 1" },
    { roll: "CE-09", name: "PRATHABEN KANJIA", department: "Computer Engineering", semester: "Semester 1" },
    { roll: "CE-10", name: "RAJDIPSINH ROHITSINH RAJPUT", department: "Computer Engineering", semester: "Semester 1" },
    { roll: "CE-11", name: "RUDRA BHAVIK BHAVSAR", department: "Computer Engineering", semester: "Semester 1" },
    { roll: "CE-12", name: "MOKSHA HITESHBHAI SHAH", department: "Computer Engineering", semester: "Semester 1" },
    { roll: "CE-13", name: "SHIVAM VIPULKUMAR JOTANGIYA", department: "Computer Engineering", semester: "Semester 1" },
    { roll: "CE-14", name: "JIMIT JITENDRA VALA", department: "Computer Engineering", semester: "Semester 1" },
    { roll: "CE-15", name: "VEERKUMAR ASHISHBHAI PATEL", department: "Computer Engineering", semester: "Semester 1" },
    { roll: "CE-16", name: "YASH ASHOKBHAI AGRWAL", department: "Computer Engineering", semester: "Semester 1" },
    { roll: "CE-17", name: "RIDHIMA PATEL", department: "Computer Engineering", semester: "Semester 1" },
    { roll: "CE-18", name: "PAVANSINH RATHOD", department: "Computer Engineering", semester: "Semester 1" },
    { roll: "CE-19", name: "VAIBHAV RAJESHBHAI DHANAVADE", department: "Computer Engineering", semester: "Semester 1" },
    { roll: "CE-20", name: "DHRUV ANIL VANI", department: "Computer Engineering", semester: "Semester 1" }
];


// ======================================================
// STORAGE KEYS
// ======================================================

const STUDENTS_KEY = "kjitStudents";
const ATTENDANCE_KEY = "attendanceData";


// ======================================================
// GET STUDENTS
// ======================================================

function getStudents() {

    try {

        const saved =
            localStorage.getItem(STUDENTS_KEY);

        if (saved) {
            return JSON.parse(saved);
        }

    } catch (error) {

        console.error(
            "Unable to load students:",
            error
        );

    }

    const students =
        defaultStudents.map(student => ({
            ...student,
            active: true
        }));

    localStorage.setItem(
        STUDENTS_KEY,
        JSON.stringify(students)
    );

    return students;
}


// ======================================================
// GET ATTENDANCE
// ======================================================

function getAttendanceData() {

    try {

        const saved =
            localStorage.getItem(ATTENDANCE_KEY);

        if (saved) {
            return JSON.parse(saved);
        }

    } catch (error) {

        console.error(
            "Unable to load attendance:",
            error
        );

    }

    return {};
}


// ======================================================
// GLOBAL DATA
// ======================================================

let students = getStudents();

let attendanceData =
    getAttendanceData();


// ======================================================
// DOM ELEMENTS
// ======================================================

const dateInput =
    document.getElementById("date");

const searchInput =
    document.getElementById("search");

const attendanceBody =
    document.getElementById("attendanceBody");


// ======================================================
// TODAY'S DATE
// ======================================================

function setToday() {

    if (!dateInput) {
        return;
    }

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");

    dateInput.value =
        `${year}-${month}-${day}`;
}


// ======================================================
// SAVE STUDENTS
// ======================================================

function saveStudents() {

    localStorage.setItem(
        STUDENTS_KEY,
        JSON.stringify(students)
    );

}


// ======================================================
// SAVE ATTENDANCE
// ======================================================

function saveAttendance() {

    localStorage.setItem(
        ATTENDANCE_KEY,
        JSON.stringify(
            attendanceData
        )
    );

}


// ======================================================
// LOAD LATEST STUDENTS
// ======================================================

function refreshStudents() {

    students =
        getStudents();

}


// ======================================================
// GET STATUS
// ======================================================

function getStatus(
    roll,
    period
) {

    if (!dateInput) {
        return "";
    }

    const date =
        dateInput.value;

    if (
        !attendanceData[date]
    ) {
        return "";
    }

    if (
        !attendanceData[date][roll]
    ) {
        return "";
    }

    return (
        attendanceData
            [date]
            [roll]
            [period] || ""
    );
}


// ======================================================
// MARK ATTENDANCE
// ======================================================

function changeAttendance(
    roll,
    period
) {

    if (!dateInput) {
        return;
    }

    const date =
        dateInput.value;

    if (!date) {

        alert(
            "Please select a date first."
        );

        return;
    }


    if (!attendanceData[date]) {

        attendanceData[date] = {};

    }


    if (
        !attendanceData[date][roll]
    ) {

        attendanceData
            [date]
            [roll] = {};

    }


    const current =
        getStatus(
            roll,
            period
        );


    /*
        EMPTY → PRESENT
        PRESENT → ABSENT
        ABSENT → EMPTY
    */

    if (current === "") {

        attendanceData
            [date]
            [roll]
            [period] = "P";

    }

    else if (current === "P") {

        attendanceData
            [date]
            [roll]
            [period] = "A";

    }

    else {

        attendanceData
            [date]
            [roll]
            [period] = "";

    }


    saveAttendance();

    renderAttendance();

}


// ======================================================
// STUDENT STATISTICS
// ======================================================

function calculateStudentAttendance(
    roll
) {

    let present = 0;

    let absent = 0;


    if (!dateInput) {

        return {
            present: 0,
            absent: 0,
            total: 0,
            percentage: 0
        };

    }


    const date =
        dateInput.value;


    const studentData =
        attendanceData[date]?.[roll];


    if (studentData) {

        for (
            let period = 1;
            period <= 6;
            period++
        ) {

            if (
                studentData[period] === "P"
            ) {

                present++;

            }

            else if (
                studentData[period] === "A"
            ) {

                absent++;

            }

        }

    }


    const total =
        present + absent;


    const percentage =
        total > 0
            ? Math.round(
                (present / total) * 100
            )
            : 0;


    return {

        present,
        absent,
        total,
        percentage

    };

}


// ======================================================
// GET STATUS CLASS
// ======================================================

function getPercentageClass(
    percentage
) {

    if (percentage >= 75) {
        return "percentage-good";
    }

    if (percentage >= 50) {
        return "percentage-warning";
    }

    return "percentage-danger";

}


// ======================================================
// GET STATUS TEXT
// ======================================================

function getStatusText(
    percentage
) {

    if (percentage >= 75) {
        return "Good";
    }

    if (percentage >= 50) {
        return "Warning";
    }

    return "Low";

}


// ======================================================
// CREATE ATTENDANCE BUTTON
// ======================================================

function createAttendanceButton(
    roll,
    period
) {

    const button =
        document.createElement(
            "button"
        );


    button.className =
        "attendance-button";


    const status =
        getStatus(
            roll,
            period
        );


    if (status === "P") {

        button.textContent =
            "✓";

        button.title =
            "Present - click to mark Absent";

        button.classList.add(
            "present"
        );

    }

    else if (status === "A") {

        button.textContent =
            "✕";

        button.title =
            "Absent - click to clear";

        button.classList.add(
            "absent"
        );

    }

    else {

        button.textContent =
            "Mark";

        button.title =
            "Click to mark Present";

        button.classList.add(
            "not-marked"
        );

    }


    button.addEventListener(
        "click",
        () => {

            changeAttendance(
                roll,
                period
            );

        }
    );


    return button;

}


// ======================================================
// RENDER ATTENDANCE TABLE
// ======================================================

function renderAttendance() {

    if (!attendanceBody) {
        return;
    }


    refreshStudents();


    attendanceBody.innerHTML =
        "";


    const searchText =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const activeStudents =
        students.filter(
            student =>
                student.active !== false
        );


    activeStudents.forEach(
        student => {


            if (
                searchText &&
                !student.name
                    .toLowerCase()
                    .includes(
                        searchText
                    ) &&
                !String(student.roll)
                    .includes(
                        searchText
                    )
            ) {

                return;

            }


            const row =
                document.createElement(
                    "tr"
                );


            // Roll

            const rollCell =
                document.createElement(
                    "td"
                );

            rollCell.textContent =
                String(
                    student.roll
                ).padStart(
                    2,
                    "0"
                );


            // Name

            const nameCell =
                document.createElement(
                    "td"
                );

            nameCell.textContent =
                student.name;

            nameCell.className =
                "student-name";


            row.appendChild(
                rollCell
            );

            row.appendChild(
                nameCell
            );


            // Period 1-6

            for (
                let period = 1;
                period <= 6;
                period++
            ) {

                const cell =
                    document.createElement(
                        "td"
                    );


                cell.appendChild(
                    createAttendanceButton(
                        student.roll,
                        period
                    )
                );


                row.appendChild(
                    cell
                );

            }


            // Statistics

            const stats =
                calculateStudentAttendance(
                    student.roll
                );


            const presentCell =
                document.createElement(
                    "td"
                );

            presentCell.textContent =
                stats.present;


            const absentCell =
                document.createElement(
                    "td"
                );

            absentCell.textContent =
                stats.absent;


            const percentageCell =
                document.createElement(
                    "td"
                );

            percentageCell.textContent =
                stats.percentage +
                "%";


            percentageCell.className =
                getPercentageClass(
                    stats.percentage
                );


            // Status

            const statusCell =
                document.createElement(
                    "td"
                );


            const status =
                document.createElement(
                    "span"
                );


            status.className =
                "status";


            const statusText =
                getStatusText(
                    stats.percentage
                );


            status.textContent =
                statusText;


            if (
                stats.percentage >= 75
            ) {

                status.classList.add(
                    "good"
                );

            }

            else if (
                stats.percentage >= 50
            ) {

                status.classList.add(
                    "warning"
                );

            }

            else {

                status.classList.add(
                    "danger"
                );

            }


            statusCell.appendChild(
                status
            );


            row.appendChild(
                presentCell
            );

            row.appendChild(
                absentCell
            );

            row.appendChild(
                percentageCell
            );

            row.appendChild(
                statusCell
            );


            attendanceBody.appendChild(
                row
            );

        }
    );


    updateDashboard();

}


// ======================================================
// UPDATE DASHBOARD
// ======================================================

function updateDashboard() {

    refreshStudents();


    const activeStudents =
        students.filter(
            student =>
                student.active !== false
        );


    let present = 0;

    let absent = 0;


    activeStudents.forEach(
        student => {

            const stats =
                calculateStudentAttendance(
                    student.roll
                );

            present +=
                stats.present;

            absent +=
                stats.absent;

        }
    );


    const total =
        present + absent;


    const percentage =
        total > 0
            ? Math.round(
                present /
                total *
                100
            )
            : 0;


    setText(
        "totalStudents",
        activeStudents.length
    );


    setText(
        "totalPresent",
        present
    );


    setText(
        "totalAbsent",
        absent
    );


    setText(
        "attendancePercentage",
        percentage + "%"
    );

}


// ======================================================
// SET TEXT HELPER
// ======================================================

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }

}


// ======================================================
// SAVE BUTTON
// ======================================================

const saveButton =
    document.getElementById(
        "saveButton"
    );


if (saveButton) {

    saveButton.addEventListener(
        "click",
        () => {

            saveAttendance();

            saveStudents();

            showMessage(
                "Attendance saved successfully! ✓"
            );

        }
    );

}


// ======================================================
// RESET BUTTON
// ======================================================

const resetButton =
    document.getElementById(
        "resetButton"
    );


if (resetButton) {

    resetButton.addEventListener(
        "click",
        () => {

            if (!dateInput) {
                return;
            }


            const date =
                dateInput.value;


            if (!date) {

                alert(
                    "Please select a date."
                );

                return;

            }


            const confirmReset =
                confirm(
                    `Reset all attendance for ${date}?`
                );


            if (!confirmReset) {
                return;
            }


            delete attendanceData[
                date
            ];


            saveAttendance();

            renderAttendance();


            showMessage(
                "Attendance reset successfully."
            );

        }
    );

}


// ======================================================
// SEARCH
// ======================================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        renderAttendance
    );

}


// ======================================================
// DATE CHANGE
// ======================================================

if (dateInput) {

    dateInput.addEventListener(
        "change",
        renderAttendance
    );

}


// ======================================================
// DARK MODE
// ======================================================

function toggleDarkMode() {

    document.body.classList.toggle(
        "dark"
    );


    const isDark =
        document.body.classList.contains(
            "dark"
        );


    localStorage.setItem(
        "kjitDarkMode",
        isDark
            ? "true"
            : "false"
    );


    updateThemeIcon();

}


function updateThemeIcon() {

    const button =
        document.getElementById(
            "themeButton"
        );


    if (!button) {
        return;
    }


    const isDark =
        document.body.classList.contains(
            "dark"
        );


    button.textContent =
        isDark
            ? "☀️"
            : "🌙";

}


function loadDarkMode() {

    const saved =
        localStorage.getItem(
            "kjitDarkMode"
        );


    if (saved === "true") {

        document.body.classList.add(
            "dark"
        );

    }


    updateThemeIcon();

}


const themeButton =
    document.getElementById(
        "themeButton"
    );


if (themeButton) {

    themeButton.addEventListener(
        "click",
        toggleDarkMode
    );

}


// ======================================================
// EXPORT CSV
// ======================================================

function exportAttendance() {

    if (!dateInput) {

        alert(
            "Attendance page not found."
        );

        return;

    }


    const date =
        dateInput.value;


    const rows = [];


    rows.push([
        "Roll No",
        "Student Name",
        "Period 1",
        "Period 2",
        "Period 3",
        "Period 4",
        "Period 5",
        "Period 6",
        "Present",
        "Absent",
        "Percentage"
    ]);


    students
        .filter(
            student =>
                student.active !== false
        )
        .forEach(
            student => {

                const stats =
                    calculateStudentAttendance(
                        student.roll
                    );


                const periods = [];


                for (
                    let p = 1;
                    p <= 6;
                    p++
                ) {

                    const status =
                        getStatus(
                            student.roll,
                            p
                        );


                    periods.push(
                        status === "P"
                            ? "Present"
                            : status === "A"
                                ? "Absent"
                                : "Not Marked"
                    );

                }


                rows.push([

                    student.roll,

                    student.name,

                    ...periods,

                    stats.present,

                    stats.absent,

                    stats.percentage + "%"

                ]);

            }
        );


    const csv =
        rows
            .map(
                row =>
                    row
                        .map(
                            value =>
                                `"${String(value)
                                    .replaceAll(
                                        '"',
                                        '""'
                                    )}"`
                        )
                        .join(",")
            )
            .join("\n");


    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        `KJIT-Attendance-${date}.csv`;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );


    showMessage(
        "Attendance exported successfully! 📥"
    );

}


// ======================================================
// EXPORT BUTTON
// ======================================================

const exportButton =
    document.getElementById(
        "exportButton"
    );


if (exportButton) {

    exportButton.addEventListener(
        "click",
        exportAttendance
    );

}


// ======================================================
// PRINT
// ======================================================

function printAttendance() {

    window.print();

}


const printButton =
    document.getElementById(
        "printButton"
    );


if (printButton) {

    printButton.addEventListener(
        "click",
        printAttendance
    );

}


// ======================================================
// SIMPLE MESSAGE
// ======================================================

function showMessage(
    message
) {

    const old =
        document.querySelector(
            ".toast-message"
        );


    if (old) {
        old.remove();
    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        "toast-message";


    toast.textContent =
        message;


    Object.assign(
        toast.style,
        {

            position: "fixed",

            right: "25px",

            bottom: "25px",

            zIndex: "99999",

            padding: "13px 18px",

            borderRadius: "12px",

            background:
                "linear-gradient(135deg,#2563eb,#7c3aed)",

            color: "white",

            fontSize: "13px",

            fontWeight: "700",

            boxShadow:
                "0 10px 30px rgba(0,0,0,.2)",

            animation:
                "toastIn .25s ease"

        }
    );


    document.body.appendChild(
        toast
    );


    setTimeout(
        () => {

            toast.remove();

        },
        2500
    );

}


// ======================================================
// SIDEBAR NAVIGATION
// ======================================================

function openPage(
    page
) {

    window.location.href =
        page;

}


window.openPage =
    openPage;


// ======================================================
// INITIALIZE
// ======================================================

setToday();

loadDarkMode();

refreshStudents();

renderAttendance();


// ======================================================
// GLOBAL FUNCTIONS
// ======================================================

window.changeAttendance =
    changeAttendance;

window.exportAttendance =
    exportAttendance;

window.printAttendance =
    printAttendance;

window.toggleDarkMode =
    toggleDarkMode;
// ======================================================
// SIDEBAR
// ======================================================

function toggleSidebar() {

    const sidebar =
        document.querySelector(".sidebar");

    if (!sidebar) {
        return;
    }

    sidebar.classList.toggle("open");

}


// ======================================================
// SETTINGS
// ======================================================

function openSettings(event) {

    if (event) {
        event.preventDefault();
    }

    alert(
        "⚙️ Settings\n\n" +
        "KJIT Campus Attendance System\n\n" +
        "More settings will be added soon."
    );

}


window.toggleSidebar =
    toggleSidebar;

window.openSettings =
    openSettings;