import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Header, Form, Input, Icon, Modal, Button } from "semantic-ui-react";

const endpoint = "http://localhost:9000";

const ToDoList = () => {
    const [task, setTask] = useState("");
    const [items, setItems] = useState([]);
    const [isDuplicate, setIsDuplicate] = useState(false);

    useEffect(() => {
        getTask();
    }, []);

    const getTask = () => {
        axios.get(`${endpoint}/api/task`).then((res) => {
            if (res.data) {
                setItems(res.data);
            } else {
                setItems([]);
            }
        });
    };

    const onChange = (event) => {
        setTask(event.target.value);
    };

    const onSubmit = (event) => {
        event.preventDefault();
        setIsDuplicate(false)
        if (task.trim()&& !items.some(t => t.task === task.trim())) {
            axios.post(`${endpoint}/api/tasks`, { task: task.trim() }, {
                headers: { "Content-Type": "application/json" },
            }).then(() => {
                getTask();
                setTask("");
            });
        } else setIsDuplicate(true);
        
    };

    const completeTask = (id) => {
        axios.put(`${endpoint}/api/completeTask/${id}`).then(() => {
            setItems((prevItems) => prevItems.map(item =>
                item._id === id ? { ...item, status: true } : item
            ));
            getTask();
        });
    };

    const undoTask = (id) => {
        axios.put(`${endpoint}/api/undoTask/${id}`).then(() => {
            setItems((prevItems) => prevItems.map(item =>
                item._id === id ? { ...item, status: false } : item
            ));
            getTask();
        });
    };

    const deleteTask = (id) => {
        axios.delete(`${endpoint}/api/deleteTask/${id}`).then(() => {
            getTask();
        });
    };

    return (
        <div>
            <Header as="h2" color="yellow" data-testid="cypress-title">TO DO LIST</Header>
            <Form onSubmit={onSubmit}>
                <Input
                    type="text"
                    name="task"
                    onChange={onChange}
                    value={task}
                    fluid
                    placeholder="Create Task"
                />
            </Form>
            {/* Warning Modal */}
            <Modal open={isDuplicate} onClose={() => setIsDuplicate(false)} closeOnDocumentClick={false} size="tiny">
                <Modal.Header>
                <Icon name="warning circle" color="red" /> Duplicate Task
                </Modal.Header>
                <Modal.Content>
                <p>A task with this name already exists. Please enter a different task.</p>
                </Modal.Content>
                <Modal.Actions>
                <Button color="red" onClick={() => setIsDuplicate(false)}>Close</Button>
                </Modal.Actions>
            </Modal>
            <Card.Group style={{ marginTop: 10 }}>
                {items.map((item) => {
                    let color = item.status ? "green" : "yellow";
                    let style = item.status ? { textDecoration: "line-through" } : {};

                    return (
                        <Card key={item._id} color={color} fluid data-testid={item._id}>
                            <Card.Content>
                                <Card.Header textAlign="left">
                                    <div style={style}>{item.task}</div>
                                </Card.Header>
                                <Card.Meta textAlign="right">
                                    <Icon name="check circle" color="green" data-testid="complete-task" onClick={() => completeTask(item._id)} />
                                    <span style={{ paddingRight: 10 }}>Done</span>
                                    <Icon name="undo" color="blue" data-testid="undo-task"  onClick={() => undoTask(item._id)} />
                                    <span style={{ paddingRight: 10 }}>Undo</span>
                                    <Icon name="delete" color="red" data-testid="delete-task"  onClick={() => deleteTask(item._id)} />
                                    <span style={{ paddingRight: 10 }}>Delete</span>
                                </Card.Meta>
                            </Card.Content>
                        </Card>
                    );
                })}
            </Card.Group>
        </div>
    );
};

export default ToDoList;
