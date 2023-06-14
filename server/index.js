const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const crypto = require("crypto");
// const session = require("express-session");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "",
    database: "esociety",
});

app.post("/createuser", (req, res) => {
    const houseno = req.body.houseno;
    const housetype = req.body.housetype;
    const ownername = req.body.ownername;
    const ownercnic = req.body.ownercnic;
    const ownerphone = req.body.ownerphone;
    const password = req.body.password;
    const hash = crypto.createHash("md5").update(password).digest("hex");
    const role = req.body.role;
    const tenantname = req.body.tenantname;
    const tenantcnic = req.body.tenantcnic;
    const tenantphone = req.body.tenantphone;
    // console.log(hash);
    db.query(
        "INSERT INTO users (houseno, housetype, houseownername, houseownercnic, houseownerphone, password, role, tenantname, tenantcnic, tenantphone) VALUES(?,?,?,?,?,?,?,?,?,?)", [
            houseno,
            housetype,
            ownername,
            ownercnic,
            ownerphone,
            hash,
            role,
            tenantname,
            tenantcnic,
            tenantphone,
        ],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.post("/login", (req, res) => {
    const houseno = req.body.houseno;
    const password = req.body.password;
    const hash = crypto.createHash("md5").update(password).digest("hex");

    db.query(
        "SELECT id, houseownername, houseno, role FROM users WHERE houseno = ? AND password = ?", [houseno, hash],
        (err, result) => {
            if (err) {
                return res.json({ Message: "Server Side Error" });
            } else if (result.length === 0) {
                return res.json({ Message: "Invalid Credentials" });
            } else {
                res.send(result);
            }
        }
    );
});

app.get("/logout", (req, res) => {
    res.cookie("token", { expires: Date.now() });
    res.status(200).send("Logout Successfully");
});

app.post("/entervisitor", (req, res) => {
    const visitorname = req.body.visitorname;
    const visitorcnic = req.body.visitorcnic;
    const visitorphone = req.body.visitorphone;
    const vehicleno = req.body.vehicleno;
    const wheregoing = req.body.wheregoing;
    // console.log(hash);
    db.query(
        "INSERT INTO visitors (name, cnicnumber, phone, vehiclenumber, wheregoing) VALUES(?,?,?,?,?)", [visitorname, visitorcnic, visitorphone, vehicleno, wheregoing],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.post("/addMaintenanceAdmin", (req, res) => {
    const houseid = req.body.houseno;
    const month = req.body.month;
    const year = req.body.year;
    db.query(
        "INSERT INTO maintenancerecord (houseno, month, year, status) VALUES(?,?,?,?)", [houseid, month, year, "paid"],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.post("/addEmergencyService", (req, res) => {
    const servicename = req.body.servicename;
    db.query(
        "INSERT INTO emergencyservices (servicename) VALUES(?)", [servicename],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.post("/addIndoorService", (req, res) => {
    const servicename = req.body.servicename;
    db.query(
        "INSERT INTO indoorservices (servicename) VALUES(?)", [servicename],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.post("/addComplaint", (req, res) => {
    const houseid = req.body.houseid;
    const complaint = req.body.complaint;
    db.query(
        "INSERT INTO complaints (houseno, message) VALUES(?,?)", [houseid, complaint],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.post("/bookEmergencyService", (req, res) => {
    const houseid = req.body.houseno;
    const serviceid = req.body.servicename;
    db.query(
        "INSERT INTO emergency (houseno, emergencytype) VALUES(?,?)", [houseid, serviceid],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.post("/bookIndoorService", (req, res) => {
    const houseid = req.body.houseno;
    const serviceid = req.body.servicename;
    db.query(
        "INSERT INTO indoor (houseno, servicetype) VALUES(?,?)", [houseid, serviceid],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.post("/saveIndoorServiceProvider", (req, res) => {
    const name = req.body.name;
    const shopno = req.body.shopno;
    const phone = req.body.phone;
    const cnic = req.body.cnic;
    const servicetype = req.body.servicetype;
    db.query(
        "INSERT INTO serviceprovider (name, shopno, phone, cnicnumber, servicetype) VALUES(?,?,?,?,?)", [name, shopno, phone, cnic, servicetype],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.post("/addTankerBooking", (req, res) => {
    const houseno = req.body.houseno;
    db.query(
        "INSERT INTO watertankerrecord (houseno, status) VALUES(?,?)", [houseno, "Pending"],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.get("/getallusers", (req, res) => {
    db.query("SELECT * FROM users WHERE role = 'user'", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.get("/getallmaintenanacerecord", (req, res) => {
    db.query(
        "SELECT maintenancerecord.id, users.houseno, maintenancerecord.month, maintenancerecord.year, maintenancerecord.status FROM users INNER JOIN maintenancerecord ON users.id = maintenancerecord.houseno ORDER BY maintenancerecord.id DESC",
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.get("/getallwaterrecord", (req, res) => {
    db.query(
        "SELECT watertankerrecord.id, users.houseno, watertankerrecord.status, watertankerrecord.bookingdate FROM users INNER JOIN watertankerrecord ON users.id = watertankerrecord.houseno ORDER BY watertankerrecord.id DESC",
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.get("/getallemergencyservicesrecord", (req, res) => {
    db.query("SELECT * FROM emergencyservices", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.get("/getallindoorservicesrecord", (req, res) => {
    db.query("SELECT * FROM indoorservices", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.get("/getallhouses", (req, res) => {
    db.query(
        "SELECT id, houseno FROM users WHERE role = 'user'",
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.get("/getallemergencyservicestobook", (req, res) => {
    db.query("SELECT id, servicename FROM emergencyservices", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.get("/getallindoorservicestobook", (req, res) => {
    db.query("SELECT id, servicename FROM indoorservices", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.get("/getallindoorserviceprovider", (req, res) => {
    db.query(
        "SELECT serviceprovider.id, serviceprovider.name, serviceprovider.shopno, serviceprovider.phone, serviceprovider.cnicnumber, indoorservices.servicename FROM serviceprovider INNER JOIN indoorservices ON serviceprovider.servicetype = indoorservices.id ORDER BY serviceprovider.id DESC",
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.get("/getallvisitors", (req, res) => {
    db.query("SELECT * FROM visitors", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.get("/getmycomplaints", (req, res) => {
    const userid = req.query.userid;
    db.query(
        "SELECT * FROM complaints WHERE houseno = ? ORDER BY id DESC", [userid],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.get("/getallcomplaints", (req, res) => {
    db.query(
        "SELECT users.houseno, complaints.id, complaints.message, complaints.complaintdate FROM users INNER JOIN complaints ON users.id = complaints.houseno ORDER BY complaints.id DESC",
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.get("/getallmyemergencyservices", (req, res) => {
    const userid = req.query.userid;
    db.query(
        "SELECT emergency.id, emergencyservices.servicename, emergency.emergencydate FROM emergency INNER JOIN emergencyservices ON emergency.emergencytype = emergencyservices.id WHERE emergency.houseno = ? ORDER BY emergency.id DESC", [userid],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.get("/getallmywaterrecord", (req, res) => {
    const userid = req.query.userid;
    db.query(
        "SELECT id, status, bookingdate FROM watertankerrecord WHERE houseno = ? ORDER BY id DESC", [userid],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.get("/getallmymainrecord", (req, res) => {
    const userid = req.query.userid;
    db.query(
        "SELECT id, month, year, status FROM maintenancerecord WHERE houseno = ? ORDER BY id DESC", [userid],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.get("/getallmyindoorservices", (req, res) => {
    const userid = req.query.userid;
    db.query(
        "SELECT indoor.id, indoorservices.servicename, indoor.servicedate FROM indoor INNER JOIN indoorservices ON indoor.servicetype = indoorservices.id WHERE indoor.houseno = ? ORDER BY indoor.id DESC", [userid],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.get("/getallbookedemergencyservices", (req, res) => {
    db.query(
        "SELECT emergency.id, emergencyservices.servicename, emergency.emergencydate, users.houseno FROM emergency INNER JOIN emergencyservices ON emergency.emergencytype = emergencyservices.id INNER JOIN users ON emergency.houseno = users.id ORDER BY emergency.id DESC",
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.get("/getallbookedindoorservices", (req, res) => {
    db.query(
        "SELECT indoor.id, indoorservices.servicename, indoor.servicedate, users.houseno FROM indoor INNER JOIN indoorservices ON indoor.servicetype = indoorservices.id INNER JOIN users ON indoor.houseno = users.id ORDER BY indoor.id DESC",
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.listen(3001, () => {
    console.log("Backend server is running");
});