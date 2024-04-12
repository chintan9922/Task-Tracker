const form = document.getElementById("task-form");
const addButton = document.getElementById("add-task");
const task = document.querySelector("#task-field");
const description = document.querySelector("#description-field");
const date = document.querySelector("#date-field");
const errortask = document.getElementById("errorTask");
const errorDes = document.getElementById("errorDescription");
const editTaskSpan = document.getElementById("errorTaskModal");
const editDescSpan = document.getElementById("errorDescriptionModal");
const modal = document.getElementById("editModal");
var span = document.getElementsByClassName("close")[0];
const editTask = document.getElementById("edittask");
const editDate = document.getElementById("editdate");
const editDesc = document.getElementById("editdescription");
const updateBtn = document.getElementById("update-task");
const viewDesc = document.getElementById("descriptionModal");
const displayDes = document.getElementById("displayDes");
const topView = document.getElementById("top-view");

var now = new Date();

var year = now.getFullYear();
var month = (now.getMonth() + 1).toString().padStart(2, "0");
var day = now.getDate().toString().padStart(2, "0");
// var hours = now.getHours().toString().padStart(2, "0");
// var minutes = now.getMinutes().toString().padStart(2, "0");
var formattedDateTime = year + "-" + month + "-" + day;
// year + "-" + month + "-" + day + "T" + hours + ":" + minutes;

document.getElementById("date-field").setAttribute("min", formattedDateTime);
document.getElementById("date-field").setAttribute("value", formattedDateTime);

function error() {
    errortask.style.display = "block";
    errortask.style.color = "red";
    task.style.borderColor = "red";
    errorDes.style.display = "block";
    errorDes.style.color = "red";
    description.style.borderColor = "red";
}

function errorTask() {
    errortask.style.display = "block";
    errortask.style.color = "red";
    task.style.borderColor = "red";
    errorDes.style.display = "none";
    description.style.borderColor = "black";
}

function errorDescription() {
    errortask.style.display = "none";
    task.style.borderColor = "black";
    errorDes.style.display = "block";
    errorDes.style.color = "red";
    description.style.borderColor = "red";
}

function editError() {
    editTaskSpan.style.display = "block";
    editTaskSpan.style.color = "red";
    editTask.style.borderColor = "red";
    editDescSpan.style.display = "block";
    editDescSpan.style.color = "red";
    editDesc.style.borderColor = "red";
}

function errorEditTask() {
    editTaskSpan.style.display = "block";
    editTaskSpan.style.color = "red";
    editTask.style.borderColor = "red";
    editDescSpan.style.display = "none";
    editDesc.style.borderColor = "black";
}

function errorEditDescription() {
    editTaskSpan.style.display = "none";
    editTask.style.borderColor = "black";
    editDescSpan.style.display = "block";
    editDescSpan.style.color = "red";
    editDesc.style.borderColor = "red";
}

function setDefault() {
    errortask.style.display = "none";
    task.style.borderColor = "black";
    errorDes.style.display = "none";
    description.style.borderColor = "black";
    editDescSpan.style.display = "none";
    editDesc.style.borderColor = "black";
    editTaskSpan.style.display = "none";
    editTask.style.borderColor = "black";
}

addButton.addEventListener("click", (e) => {
    e.preventDefault();
    const { elements } = form;
    let id;
    const data = JSON.parse(localStorage.getItem("save"));
    data ? (id = data.length) : (id = 0);
    const output = {
        id: (id += 1),
        task: elements.task.value,
        date: elements.date.value,
        description: elements.description.value,
        completed: false,
    };

    if (output.task && output.description) {
        setDefault();
        setData(output);
        listTodo();
        count();
        // console.log(output, 'first');
    } else if (output.task) {
        errorDescription();
    } else if (output.description) {
        errorTask();
    } else {
        error();
    }
});

let listTodo = () => {
    let data = getData();
    let html = `<table id="myTable">
        <tr>
        <th id="number" onclick="sortNo()"> No. </th>
        <th id="date" onclick="sortDate()"> Date </th>
        <th id="task" onclick="sortTask()"> Task </th>
        <th id="des"> Description </th>
        <th id="cbox" onclick="sortCheck()"> Status </th>
        <th id="edit"> Edit </th>
        <th id="delete"> Delete </th>
        </tr>`;
    if (data) {
        console.log(data, "list");
        data.forEach((value, index) => {
            let rowColor = value.completed
                ? "#00cc00"
                : value.date === formattedDateTime ||
                  value.date < formattedDateTime
                ? "#ff0000"
                : "black";
            html += ` <tr >
            <td id="a${index}" style="color: ${rowColor}; font-size: 22px">${
                value.id
            }</td>
            <td id="b${index}" style="color: ${rowColor}; font-size: 22px">${
                value.date
            }</td>
            <td id="c${index}" style="color: ${rowColor}; font-size: 22px">${
                value.task
            }</td>
            <td><button onclick="viewModal('${index}')">View</button></td>
            <td><input class="task-checkbox" type="checkbox" id="checkbox${index}" value="${
                value.task
            }" onclick="complete('${index}','${value.date}')" ${
                value.completed ? "checked" : ""
            } style="width: 50px; height:20px;"/></td>
            <td>
            <i class="fa-solid fa-pen-to-square" onclick="openModal('${index}')"></i>
            </td>
            <td>
            <i class="fas fa-trash" onclick="removeData('${index}')"></i>
            </td>
          </tr>`;
        });
    }
    html += `</table>`;

    document.getElementById("table-view").innerHTML = html;
};

async function complete(itemId, date) {
    const field1 = document.querySelector(`#a${itemId}`);
    const field2 = document.querySelector(`#b${itemId}`);
    const field3 = document.querySelector(`#c${itemId}`);
    const checkbox = document.getElementById(`checkbox${itemId}`);
    const data = JSON.parse(localStorage.getItem("save"));

    if (checkbox.checked) {
        field1.style.color = "#00cc00";
        field2.style.color = "#00cc00";
        field3.style.color = "#00cc00";
        data[itemId].completed = true;
    } else {
        if (date === formattedDateTime || date < formattedDateTime) {
            // console.log('red')
            field1.style.color = "#ff0000";
            field2.style.color = "#ff0000";
            field3.style.color = "#ff0000";
        } else {
            // console.log('yellow')
            field1.style.color = "black";
            field2.style.color = "black";
            field3.style.color = "black";
        }
        data[itemId].completed = false;
    }

    localStorage.setItem("save", JSON.stringify(data));
    count();
}

let getData = (item = null) => {
    let data = JSON.parse(localStorage.getItem("save"));
    // data ? console.log(data, "data") : null;
    // console.log(item,'into')
    if (data) {
        if (item) {
            // console.log(item, "item");
            for (let i = 0; i < data.length; i++) {
                // console.log(data[i], "name");
                if (data[i].task === item.task && data[i].date === item.date) {
                    return data[item];
                }
            }
            return false;
        }
        return data;
    }
    return false;
};

listTodo();

let setData = (item) => {
    // console.log(item, "item");
    if (getData(item) != false) {
        alert("This task already exists in the list.");
    } else {
        let data = getData();
        data = data != false ? data : [];
        data.push(item);

        data = JSON.stringify(data);
        localStorage.setItem("save", data);
        document.getElementById("task-form").reset();
    }
};

let removeData = (itemId) => {
    let data = getData();
    if (data) {
        // console.log(data, 'inremove');
        let newData = data.filter((v, i) => {
            return i != itemId;
        });
        newData = JSON.stringify(newData);
        localStorage.setItem("save", newData);
        listTodo();
    } else {
        alert("no data found");
    }
};

let id;

function openModal(index) {
    editDate.setAttribute("min", formattedDateTime);
    modal.style.display = "block";
    const data = JSON.parse(localStorage.getItem("save"));
    editTask.value = data[index].task;
    editDate.value = data[index].date;
    editDesc.value = data[index].description;
    id = index;
}

function viewModal(index) {
    viewDesc.style.display = "block";
    const data = JSON.parse(localStorage.getItem("save"));
    // editTask.value = data[index].task;
    // editDate.value = data[index].date;
    displayDes.innerHTML = data[index].description;
    // id = index;
}

function closeModal() {
    if ((modal.style.display = "block")) {
        modal.style.display = "none";
        setDefault();
    }
    if ((viewDesc.style.display = "block")) {
        viewDesc.style.display = "none";
    }
}

window.onclick = function (event) {
    if (event.target == modal || event.target == viewDesc) {
        if ((modal.style.display = "block")) {
            modal.style.display = "none";
            setDefault();
        }
        if ((viewDesc.style.display = "block")) {
            viewDesc.style.display = "none";
        }
    }
};

updateBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const data = JSON.parse(localStorage.getItem("save"));

    // if (editTask.value && editDesc.value) {
    //     setDefault();
    //     data[id].task = editTask.value;
    //     data[id].date = editDate.value;
    //     data[id].description = editDesc.value;

    //     if (getData(data[id]) !== false) {
    //         alert("This task already exists in the list.");
    //     } else {
    //         localStorage.setItem("save", JSON.stringify(data));
    //         closeModal();
    //         listTodo();
    //     }
    // } else {
    //     errorEditTask();
    // }

    if (editTask.value && editDesc.value) {
        setDefault();
        data[id].task = editTask.value;
        data[id].date = editDate.value;
        data[id].description = editDesc.value;
        if (getData(data[id]) !== false) {
            alert("This task already exists in the list.");
        } else {
            localStorage.setItem("save", JSON.stringify(data));
            closeModal();
            listTodo();
        }
    } else if (editTask.value) {
        errorEditDescription();
    } else if (editDesc.value) {
        errorEditTask();
    } else {
        editError();
    }
});

function count() {
    const data = JSON.parse(localStorage.getItem("save"));

    let completedCount = 0;
    let pendingCount = 0;

    data?.forEach((task) => {
        if (task.completed) {
            completedCount++;
        } else {
            pendingCount++;
        }
    });

    // console.log("Completed tasks:", completedCount);
    // console.log("Pending tasks:", pendingCount);

    const xValues = ["Completed", "Pending"];
    const yValues = [completedCount, pendingCount];
    const barColors = ["#00cc00", "#ff0000"];

    new Chart("myChart", {
        type: "doughnut",
        data: {
            labels: xValues,
            datasets: [
                {
                    backgroundColor: barColors,
                    data: yValues,
                },
            ],
        },
    });
}
count();

function collapse() {
    if (topView.style.display === "flex") {
        topView.style.display = "none";
    } else if (topView.style.display === "none") {
        topView.style.display = "flex";
    }
}

let dateClicked = false;
function sortDate() {
    let data = JSON.parse(localStorage.getItem("save"));
    if (dateClicked) {
        data.sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        });
        data = JSON.stringify(data);
        localStorage.setItem("save", data);
        listTodo();
        dateClicked = false;
    } else {
        data.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        data = JSON.stringify(data);
        localStorage.setItem("save", data);
        listTodo();
        dateClicked = true;
    }
}

let noClicked = false;
function sortNo() {
    let data = JSON.parse(localStorage.getItem("save"));
    if (noClicked) {
        data.sort((a, b) => {
            return a.id - b.id;
        });
        data = JSON.stringify(data);
        localStorage.setItem("save", data);
        listTodo();
        noClicked = false;
    } else {
        data.sort((a, b) => {
            return b.id - a.id;
        });
        data = JSON.stringify(data);
        localStorage.setItem("save", data);
        listTodo();
        noClicked = true;
    }
}

let taskClicked = false;
function sortTask() {
    let data = JSON.parse(localStorage.getItem("save"));
    if (taskClicked) {
        data.sort((a, b) =>
            a.task.toUpperCase() > b.task.toUpperCase()
                ? 1
                : b.task.toUpperCase() > a.task.toUpperCase()
                ? -1
                : 0,
        );
        data = JSON.stringify(data);
        localStorage.setItem("save", data);
        listTodo();
        taskClicked = false;
    } else {
        data.sort((a, b) =>
            b.task.toUpperCase() > a.task.toUpperCase()
                ? 1
                : a.task.toUpperCase() > b.task.toUpperCase()
                ? -1
                : 0,
        );
        data = JSON.stringify(data);
        localStorage.setItem("save", data);
        listTodo();
        taskClicked = true;
    }
}

let checkClicked = false;
function sortCheck() {
    let data = JSON.parse(localStorage.getItem("save"));
    if (checkClicked) {
        data.sort((a,b) => b.completed - a.completed)
        data = JSON.stringify(data);
        localStorage.setItem("save", data);
        listTodo();
        checkClicked = false;
    } else {
        data.sort((a,b) => a.completed - b.completed)
        data = JSON.stringify(data);
        localStorage.setItem("save", data);
        listTodo();
        checkClicked = true;
    }
}