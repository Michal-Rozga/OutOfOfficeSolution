CREATE TABLE IF NOT EXISTS Users (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Username TEXT NOT NULL UNIQUE,
    PasswordHash TEXT NOT NULL,
    EmployeeID INTEGER,
    FOREIGN KEY (EmployeeID) REFERENCES Employees(ID)
);

CREATE TABLE IF NOT EXISTS Employees (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    FullName TEXT NOT NULL,
    Subdivision TEXT NOT NULL,
    Position TEXT NOT NULL,
    Status TEXT NOT NULL,
    PeoplePartner INTEGER NOT NULL,
    OutOfOfficeBalance INTEGER NOT NULL,
    Photo TEXT,
    RoleID INTEGER,
    FOREIGN KEY (RoleID) REFERENCES Roles(ID)
);

CREATE TABLE IF NOT EXISTS LeaveRequests (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    EmployeeID INTEGER,
    AbsenceReason TEXT NOT NULL,
    StartDate TEXT NOT NULL,
    EndDate TEXT NOT NULL,
    Comment TEXT,
    Status TEXT NOT NULL,
    FOREIGN KEY (EmployeeID) REFERENCES Employees(ID)
);

CREATE TABLE IF NOT EXISTS ApprovalRequests (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    ApproverID INTEGER,
    LeaveRequestID INTEGER,
    Status TEXT NOT NULL,
    Comment TEXT,
    FOREIGN KEY (ApproverID) REFERENCES Employees(ID),
    FOREIGN KEY (LeaveRequestID) REFERENCES LeaveRequests(ID)
);

CREATE TABLE IF NOT EXISTS Projects (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    ProjectType TEXT NOT NULL,
    StartDate TEXT NOT NULL,
    EndDate TEXT,
    ProjectManagerID INTEGER,
    Comment TEXT,
    Status TEXT NOT NULL,
    FOREIGN KEY (ProjectManagerID) REFERENCES Employees(ID)
);

CREATE TABLE IF NOT EXISTS Roles (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL UNIQUE
);