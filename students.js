"use strict";

// ==========================================
// KJIT STUDENT MANAGEMENT
// ==========================================

const STUDENTS_KEY = "kjitStudents";


// ==========================================
// DEFAULT STUDENTS
// ==========================================

const defaultStudents = [
    { roll: 1, name: "Aditya Mali", department: "Computer Engineering", semester: "Semester 1", active: true },
    { roll: 2, name: "Student 2", department: "Computer Engineering", semester: "Semester 1", active: true },
    { roll: 3, name: "Student 3", department: "Computer Engineering", semester: "Semester 1", active: true },
    { roll: 4, name: "Student 4", department: "Computer Engineering", semester: "Semester 1", active: true },
    { roll: 5, name: "Student 5", department: "Computer Engineering", semester: "Semester 1", active: true },
    { roll: 6, name: "Student 6", department: "Computer Engineering", semester: "Semester 1", active: true },
    { roll: 7, name: "Student 7", department: "Computer Engineering", semester: "Semester 1", active: true },
    { roll: 8, name: "Student 8", department: "Computer Engineering", semester: "Semester 1", active: true },
    { roll: 9, name: "Student 9", department: "Computer Engineering", semester: "Semester 1", active: true },
    { roll: 10, name: "Student 10", department: "Computer Engineering", semester: "Semester 1", active: true },
    { roll: 11, name: "Student 11", department: "Computer Engineering", semester: "Semester 1", active: true },
    { roll: 12, name: "Student 12", department: "Computer Engineering", semester: "Semester 1", active: true },
    { roll: 13, name: "Student 13", department: "Computer Engineering", semester: "Semester 1", active: true },
    { roll: 14, name: "Student 14", department: "Computer Engineering", semester: "Semester 1", active: true },
    { roll: 15, name: "Student 15", department: "Computer Engineering", semester: "Semester 1", active: true },
    { roll: 16, name: "Student 16", department: "Computer Engineering", semester: "Semester 1", active: true },
    { roll: 17, name: "Student 17", department: "Computer Engineering", semester: "Semester 1", active: true },
    { roll: 18, name: "Student 18", department: "Computer Engineering", semester: "Semester 1", active: true },
    { roll: 19, name: "Student 19", department: "Computer Engineering", semester: "Semester 1", active: true },
    { roll: 20, name: "Student 20", department: "Computer Engineering", semester: "Semester 1", active: true }
];


// ==========================================
// LOAD STUDENTS
// ==========================================

function getStudents() {

    const saved =
        localStorage.getItem(
            STUDENTS_KEY
        );

    if (saved) {

        try {

            return JSON.parse(saved);

        } catch (error) {

            console.error(error);

        }

    }

    localStorage.setItem(
        STUDENTS_KEY,
        JSON.stringify(defaultStudents)
    );

    return [...defaultStudents];
}


// ==========================================
// SAVE STUDENTS
// ==========================================

function saveStudents(students) {

    localStorage.setItem(
        STUDENTS_KEY,
        JSON.stringify(students)
    );

}


// ==========================================
// DATA
// ==========================================

let students =
    getStudents();


// ==========================================
// DOM
// ==========================================

const studentBody =
    document.getElementById(
        "studentBody"
    );

const studentSearch =
    document.getElementById(
        "studentSearch"
    );

const addStudentButton =
    document.getElementById(
        "addStudentButton"
    );


// ==========================================
// RENDER TABLE
// ==========================================

function renderStudents() {

    if (!studentBody) {
        return;
    }

    students =
        getStudents();

    studentBody.innerHTML =
        "";


    const search =
        studentSearch
            ? studentSearch.value
                .toLowerCase()
                .trim()
            : "";


    students.forEach(
        (student, index) => {

            if (
                search &&
                !String(student.roll)
                    .includes(search) &&
                !student.name
                    .toLowerCase()
                    .includes(search)
            ) {

                return;

            }


            const row =
                document.createElement(
                    "tr"
                );


            // Roll

            const roll =
                document.createElement(
                    "td"
                );

            roll.textContent =
                String(student.roll)
                    .padStart(2, "0");


            // Name

            const name =
                document.createElement(
                    "td"
                );

            name.textContent =
                student.name;

            name.className =
                "student-name";


            // Department

            const department =
                document.createElement(
                    "td"
                );

            department.textContent =
                student.department ||
                "Computer Engineering";


            // Semester

            const semester =
                document.createElement(
                    "td"
                );

            semester.textContent =
                student.semester ||
                "Semester 1";


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
                "status good";


            status.textContent =
                student.active !== false
                    ? "Active"
                    : "Inactive";


            if (
                student.active === false
            ) {

                status.className =
                    "status danger";

            }


            statusCell.appendChild(
                status
            );


            // Actions

            const actionCell =
                document.createElement(
                    "td"
                );


            const editButton =
                document.createElement(
                    "button"
                );

            editButton.className =
                "table-action edit";

            editButton.textContent =
                "✏️";

            editButton.title =
                "Edit Student";


            editButton.onclick =
                () => editStudent(index);


            const deleteButton =
                document.createElement(
                    "button"
                );

            deleteButton.className =
                "table-action delete";

            deleteButton.textContent =
                "🗑️";

            deleteButton.title =
                "Delete Student";


            deleteButton.onclick =
                () => deleteStudent(index);


            actionCell.appendChild(
                editButton
            );

            actionCell.appendChild(
                deleteButton
            );


            row.appendChild(roll);

            row.appendChild(name);

            row.appendChild(department);

            row.appendChild(semester);

            row.appendChild(statusCell);

            row.appendChild(actionCell);


            studentBody.appendChild(
                row
            );

        }
    );


    updateStudentCount();

}


// ==========================================
// STUDENT COUNT
// ==========================================

function updateStudentCount() {

    const activeCount =
        students.filter(
            student =>
                student.active !== false
        ).length;


    const element =
        document.getElementById(
            "studentCount"
        );


    if (element) {

        element.textContent =
            activeCount;

    }

}


// ==========================================
// ADD STUDENT
// ==========================================

function addStudent() {

    const nameInput =
        document.getElementById(
            "studentName"
        );

    const rollInput =
        document.getElementById(
            "studentRoll"
        );

    const departmentInput =
        document.getElementById(
            "studentDepartment"
        );

    const semesterInput =
        document.getElementById(
            "studentSemester"
        );


    if (
        !nameInput ||
        !rollInput
    ) {

        return;

    }


    const name =
        nameInput.value.trim();

    const roll =
        Number(
            rollInput.value
        );


    const department =
        departmentInput
            ? departmentInput.value.trim()
            : "Computer Engineering";


    const semester =
        semesterInput
            ? semesterInput.value
            : "Semester 1";


    if (!name) {

        alert(
            "Please enter student name."
        );

        return;

    }


    if (!roll) {

        alert(
            "Please enter roll number."
        );

        return;

    }


    const duplicate =
        students.some(
            student =>
                Number(student.roll) === roll
        );


    if (duplicate) {

        alert(
            "This roll number already exists."
        );

        return;

    }


    students.push({

        roll: roll,

        name: name,

        department:
            department ||
            "Computer Engineering",

        semester:
            semester ||
            "Semester 1",

        active: true

    });


    students.sort(
        (a, b) =>
            Number(a.roll) -
            Number(b.roll)
    );


    saveStudents(students);

    closeModal();

    clearForm();

    renderStudents();


    showToast(
        "Student added successfully! ✓"
    );

}


// ==========================================
// EDIT STUDENT
// ==========================================

function editStudent(index) {

    const student =
        students[index];


    if (!student) {
        return;
    }


    const newName =
        prompt(
            "Student Name:",
            student.name
        );


    if (
        newName === null
    ) {

        return;

    }


    const cleanName =
        newName.trim();


    if (!cleanName) {

        alert(
            "Student name cannot be empty."
        );

        return;

    }


    student.name =
        cleanName;


    saveStudents(students);

    renderStudents();


    showToast(
        "Student updated successfully! ✓"
    );

}


// ==========================================
// DELETE STUDENT
// ==========================================

function deleteStudent(index) {

    const student =
        students[index];


    if (!student) {
        return;
    }


    const confirmDelete =
        confirm(
            `Delete ${student.name}?`
        );


    if (!confirmDelete) {
        return;
    }


    students.splice(
        index,
        1
    );


    saveStudents(students);

    renderStudents();


    showToast(
        "Student deleted successfully."
    );

}


// ==========================================
// MODAL
// ==========================================

function openModal() {

    const modal =
        document.getElementById(
            "studentModal"
        );


    if (modal) {

        modal.classList.add(
            "show"
        );

    }

}


function closeModal() {

    const modal =
        document.getElementById(
            "studentModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

}


function clearForm() {

    const fields = [

        "studentName",
        "studentRoll",
        "studentDepartment"

    ];


    fields.forEach(
        id => {

            const element =
                document.getElementById(
                    id
                );

            if (element) {

                element.value =
                    "";

            }

        }
    );

}


// ==========================================
// BUTTON
// ==========================================

if (addStudentButton) {

    addStudentButton.addEventListener(
        "click",
        openModal
    );

}


// ==========================================
// SEARCH
// ==========================================

if (studentSearch) {

    studentSearch.addEventListener(
        "input",
        renderStudents
    );

}


// ==========================================
// TOAST
// ==========================================

function showToast(message) {

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
                "0 10px 30px rgba(0,0,0,.2)"

        }
    );


    document.body.appendChild(
        toast
    );


    setTimeout(
        () => toast.remove(),
        2500
    );

}


// ==========================================
// GLOBAL FUNCTIONS
// ==========================================

window.addStudent =
    addStudent;

window.editStudent =
    editStudent;

window.deleteStudent =
    deleteStudent;

window.openModal =
    openModal;

window.closeModal =
    closeModal;


// ==========================================
// START
// ==========================================

renderStudents();