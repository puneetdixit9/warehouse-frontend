
import React, { useState, useEffect } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import AuthService from '../services/auth.service'


const Profile = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
    const [editable, setEditable] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [department, setDepartment] = useState("");
    const [userFunction, setUserFunction] = useState("");
    const [role, setRole] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");

    useEffect(() => {
      if (!user) {
          AuthService.get_profile({}).then((response) => {
              if (response.status === 200) {
                  setUser(response.data)
                  setFirstName(response.data.first_name)
                  setLastName(response.data.last_name)
                  setDepartment(response.data.department)
                  setUserFunction(response.data.function)
                  setMobileNumber(response.data.mobile_number)
                  setEmail(response.data.email)
                  setUsername(response.data.username)
                  setRole(response.data.role)
                  localStorage.setItem("user", JSON.stringify(response.data))                
              } else {
                  alert("Error in fetching the profile")
                  console.error("Error in fetching profile")
              }
          }).catch((error) => console.error(error));
      } else {
        setFirstName(user.first_name)
        setLastName(user.last_name)
        setDepartment(user.department)
        setUserFunction(user.function)
        setMobileNumber(user.mobile_number)
        setEmail(user.email)
        setUsername(user.username)
        setRole(user.role)
      }
  }, []);

    const handleEditProfile = () => {
        setEditable(true);
    };

    const handleSaveChanges = () => {
      let request_body = {
        first_name: firstName,
        last_name: lastName,
        function: userFunction,
        mobile_number: mobileNumber,
        department: department,
        role: role
      } 
      AuthService.update_profile({ body: JSON.stringify(request_body) }).then((response) => {
          if (response.status === 200) {
            request_body["email"] = user.email;
            request_body["username"] = user.username;
            localStorage.setItem("user", JSON.stringify(request_body))
            alert("Profile Updated Sucessfully")
            setEditable(false);
          } else {
            alert("Error in updating the Profile")
          }
        })
        console.log("Save Changes clicked!");
    };

    const handleCancelChanges = () => {
        console.log("Cancel Changes clicked!");
        setEditable(false);
        setFirstName(user.first_name);
        setLastName(user.last_name);
        setDepartment(user.department);
        setUserFunction(user.function);
        setMobileNumber(user.mobile_number);
        setRole(user.role);
    };

    const handleChangeFirstName = (event) => {
        setFirstName(event.target.value);
    };

    const handleChangeLastName = (event) => {
        setLastName(event.target.value);
    };

    const handleChangeDepartment = (event) => {
        if (event.target.value !== "") {
          setDepartment(event.target.value);
        }
    };

    const handleChangeuserFunction = (event) => {
        setUserFunction(event.target.value);
    };

    const handleChangeUserRole = (event) => {
        setRole(event.target.value);
    };

    const handleChangeMobileNumber = (event) => {
        setMobileNumber(event.target.value);
    };

    return (
        <Card className="my-3 shadow-sm">
            <Card.Body>
                <div className="d-flex align-items-center mb-3">
                    <div className="flex-shrink-0">
                        <img
                            src="https://picsum.photos/200"
                            alt={"firstName"}
                            className="rounded-circle"
                            width="80"
                            height="80"
                        />
                    </div>
                    <div className="ms-3">
                        <Card.Title className="fw-bold">
                            {editable ? (
                                <Form.Control
                                    type="text"
                                    value={firstName}
                                    placeholder="First Name"
                                    onChange={handleChangeFirstName}
                                />
                            ) : (
                                <span>
                                    {firstName} {lastName}
                                </span>
                            )}
                        </Card.Title>
                        {editable ? <Card.Title className="fw-bold">
                                <Form.Control
                                    type="text"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={handleChangeLastName}
                                />
                           
                        </Card.Title> : null}
                        <Card.Subtitle className="text-muted">
    <span>Email: </span>
    <span>{email}</span>
  </Card.Subtitle>
  <Card.Subtitle className="text-muted">
    <span>Username: </span>
    <span>{username}</span>
  </Card.Subtitle>
                    </div>
                </div>
                <div className="mb-3">
                    <span className="fw-bold me-2">Department:</span>
                    {editable ? (
                        <Form.Control
                            type="text"
                            value={department}
                            onChange={handleChangeDepartment}
                        />
                    ) : (
                        <span>{department}</span>
                    )}
                </div>
                <div className="mb-3">
                    <span className="fw-bold me-2">Function:</span>
                    {editable ? (
                        <Form.Control
                            type="text"
                            value={userFunction}
                            onChange={handleChangeuserFunction}
                        />
                    ) : (
                        <span>{userFunction}</span>
                    )}
                </div>
                <div className="mb-3">
                    <span className="fw-bold me-2">Role:</span>
                    {editable ? (
                        <Form.Control
                            type="text"
                            value={role}
                            onChange={handleChangeUserRole}
                        />
                    ) : (
                        <span>{role}</span>
                    )}
                </div>
                <div className="mb-3">
                    <span className="fw-bold me-2">Mobile Number:</span>
                    {editable ? (
                        <Form.Control
                            type="tel"
                            value={mobileNumber}
                            onChange={handleChangeMobileNumber}
                        />
                    ) : (
                        <span>{mobileNumber}</span>
                    )}
                </div>
                <div className="d-flex justify-content-end">
                    {!editable && (
                        <Button
                            variant="primary"
                            onClick={handleEditProfile}
                            className="me-3"
                        >
                            Edit Profile
                        </Button>
                    )}
                    {!editable && (
                        <Link
                            className="btn"
                            to={"/change-password"}
                            style={{backgroundColor: "red"}}
                        >
                            Change Password
                        </Link>
                    )}
                    {editable && (
                        <>
                            <Button
                                variant="success"
                                onClick={handleSaveChanges}
                                className="me-3"
                            >
                                Save Changes
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={handleCancelChanges}
                            >
                                Cancel Changes
                            </Button>
                        </>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
};

export default Profile;

