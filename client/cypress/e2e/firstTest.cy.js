describe("cypress demo", () => {
  it("it renders the default elements on the screen", () => {
    cy.visit("http://localhost:3000");

    cy.get('[data-testid="cypress-title"]')
      .should("exist")
      .should("have.text", "TO DO LIST");
  });


  it("it allows the user to add a new task", () => {
    const newTask = 'Buy groceries';

    // Intercept the POST request
    cy.intercept('POST', '**/api/tasks', {
        statusCode: 201,
        body: { task: newTask },
    }).as('createTask');

    // Intercept the GET request that refreshes tasks
    cy.intercept('GET', '**/api/task', {
        statusCode: 200,
        body: [{ task: newTask }],
    }).as('getTasks');

    cy.visit("http://localhost:3000");

    // Type into the input field
    cy.get('input[name="task"]')
        .should('be.visible')
        .type(newTask)
        .should('have.value', newTask);

    // Submit the form
    cy.get('form').submit();

    // Wait for the API call to complete
    cy.wait('@createTask').its('response.statusCode').should('eq', 201);

    // Wait for the GET request to refresh tasks
    cy.wait('@getTasks');

    // Check if the new task appears in the UI
    cy.contains(newTask).should('exist');

    // Verify that the input field is cleared after submission
    cy.get('input[name="task"]').should('have.value', '');

  })

  it("it renders the todos on the screen", () => {

    cy.intercept("GET", "**/api/task").as("getTasks"); 
    cy.visit("http://localhost:3000");

    cy.wait("@getTasks").then((interception) => {
        // Ensure the API responded successfully
        let tasks = interception.response.body;
        if (typeof tasks === 'string') tasks = JSON.parse(tasks); // Force convert to JSON
        
        expect(Array.isArray(tasks)).to.be.true;
        expect(tasks.length).to.be.greaterThan(0);

        tasks.forEach((task) => {
            cy.log(`Checking task: ${task.task} with ID: ${task._id}`);
            cy.get(`[data-testid="${task._id}"]`).should('exist');
        });
    });
    
  });
});
