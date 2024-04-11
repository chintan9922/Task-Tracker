const form = document.getElementById("task-form");
const addButton = document.getElementById("add-task");
const task = document.querySelector("#task-field");
const date = document.querySelector("#date-field");
const errorMsg = document.getElementById("errorname");
const erroredit = document.getElementById("errormodal");
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
const editTask = document.getElementById("edittask");
const editDate = document.getElementById("editdate");
const updateBtn = document.getElementById("update-task");

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

function errorname() {
    errorMsg.style.display = "block";
    errorMsg.style.color = "red";
    task.style.borderColor = "red";
}

function errortask() {
    erroredit.style.display = "block";
    erroredit.style.color = "red";
    editTask.style.borderColor = "red";
}

function setDefault() {
    errorMsg.style.display = "none";
    task.style.borderColor = "black";
    erroredit.style.display = "none";
    editTask.style.borderColor = "black";
}

addButton.addEventListener("click", (e) => {
    e.preventDefault();
    const { elements } = form;
    const output = {
        task: elements.task.value,
        date: elements.date.value,
    };
    if (output.task) {
        setDefault();
        setData(output);
        listTodo();
        // console.log(output);
    } else {
        errorname();
    }
});

let listTodo = () => {
    let data = getData();
    let html = `<table id="myTable">
        <tr>
        <th id="number"> No. </th>
        <th id="task"> Task </th>
        <th id="date"> Date </th>
        <th id="cbox"> Complete </th>
        <th id="edit"> Edit </th>
        <th id="delete"> Delete </th>
        </tr>`;
    if (data) {
        // console.log(data, 'list');
        data.forEach((value, index) => {
            let rowColor = value.completed
                ? "green"
                : value.date === formattedDateTime ||
                  value.date < formattedDateTime
                ? "red"
                : "yellow";
            html += ` <tr id="a${index}" style="background-color: ${rowColor}">
            <td>${index + 1}</td>
            <td>${value.task}</td>
            <td>${value.date}</td>
            <td><input class="task-checkbox" type="checkbox" id="checkbox${index}" value="${
                value.task
            }" onclick="complete('${index}','${value.date}')" ${
                value.completed ? "checked" : ""
            } /></td>
            <td><button onclick="openModal('${index}')">Edit</button></td>
            <td><button onclick="removeData('${index}')">Remove</button></td>
          </tr>`;
        });
    }
    html += `</table>`;
    document.getElementById("table-view").innerHTML = html;
};

async function complete(itemId, date) {
    const row = document.querySelector(`#a${itemId}`);
    const checkbox = document.getElementById(`checkbox${itemId}`);
    const data = JSON.parse(localStorage.getItem("save"));

    if (checkbox.checked) {
        row.style.backgroundColor = "green";
        data[itemId].completed = true;
    } else {
        if (date === formattedDateTime || date < formattedDateTime) {
            // console.log('red')
            row.style.backgroundColor = "red";
        } else {
            // console.log('yellow')
            row.style.backgroundColor = "yellow";
        }
        data[itemId].completed = false;
    }

    localStorage.setItem("save", JSON.stringify(data));
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
        alert("user already added in list");
    } else {
        let data = getData();
        data = data != false ? data : [];
        data.push(item);
        data = JSON.stringify(data);
        localStorage.setItem("save", data);
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

var modal = document.getElementById("editModal");

let id;

function openModal(index) {
    editDate.setAttribute("min", formattedDateTime);
    modal.style.display = "block";
    const data = JSON.parse(localStorage.getItem("save"));
    editTask.value = data[index].task;
    editDate.value = data[index].date;
    id = index;
}

function closeModal() {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

updateBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const data = JSON.parse(localStorage.getItem("save"));
    if (editTask.value) {
        setDefault();
        // setData(output);
        data[id].task = editTask.value;
        data[id].date = editDate.value;
        console.log(editTask.value);
        console.log(getData(data));

        if (getData(data[id]) != false) {
            alert("user already added in list");
        } else {
            localStorage.setItem("save", JSON.stringify(data));
            closeModal();
            listTodo();
        }
    } else {
        errortask();
    }
});
