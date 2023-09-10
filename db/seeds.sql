INSERT INTO departments ( id, department_name )
    VALUES
        ( 1, 'Shipping' ),
        ( 2, 'Retail' ),
        ( 3, 'Human Resources' ),
        ( 4, 'Corporate' );

INSERT INTO roles( id, title, salary, department_id )
    VALUES
        -- Shipping Roles
        ( 1, 'Manager', 50000.00, 1 ),
        ( 2, 'Assistant Manager', 42000.00, 1 ),
        ( 3, 'Packer', 36000.00, 1 ),
        ( 4, 'Puller', 32000.00, 1 ),
        ( 5, 'Loader', 34000.00, 1 ),
        -- Retail Roles
        ( 6, 'Manager', 60000.00, 2),
        ( 7, 'Assistant Manager', 53000.00, 2 ),
        ( 8, 'Stock person', 33000.00, 2 ),
        ( 9, 'Clerk', 38000.00, 2 ),
        ( 10, 'Maintenance', 35000.00, 2 ),
        -- Human Resources Roles
        ( 11, 'Manager', 62000.00, 3 ),
        ( 12, 'Assistant Manager', 55000.00, 3 ),
        ( 13, 'Employee Advocate', 42000.00, 3 ),
        ( 14, 'Accountant', 80000.00, 3 ),
        -- Corporate Roles
        ( 15, 'Owner', 120000, 4 ),
        ( 16, 'Administrative Assistant', 75000, 4 );

INSERT INTO employees( id, first_name, last_name, role_id, manager_id )
    VALUES
        -- Shipping Shift 1 Employees
        ( 1, 'Anna', 'Lee', 1, NULL ),
        ( 2, 'Benjamin', 'Carter', 2, 1 ),
        ( 3, 'Claire', 'Smith', 3, 1 ),
        ( 4, 'Daniel', 'Jones', 3, 1 ),
        ( 5, 'Emily', 'Johnson', 3, 1 ),
        ( 6, 'Frederick', 'Wilson', 4, 1 ),
        ( 7, 'Gabriella', 'Miller', 4, 1 ),
        ( 8, 'Harrison', 'Davis', 5, 1 ),
        -- Shipping Shift 2 Employees
        ( 9, 'Ivy', 'Taylor', 1, NULL ),
        ( 10, 'Jacob', 'Brown', 2, 9 ),
        ( 11, 'Kayla', 'Williams', 3, 9 ),
        ( 12, 'Lucas', 'Martin', 3, 9  ),
        ( 13, 'Madison', 'Thompson', 3, 9  ),
        ( 14, 'Nathan', 'Garcia', 4, 9  ),
        ( 15, 'Olivia', 'Anderson', 4, 9  ),
        ( 16, 'Parker', 'White', 5, 9  ),
        -- Retail Shift 1 Employees
        ( 17, 'Quinn', 'Lopez', 6, NULL ),
        ( 18, 'Ryan', 'Lee', 7, 17 ),
        ( 19, 'Sophia', 'Rodriguez', 8, 17 ),
        ( 20, 'Tyler', 'Walker', 8, 17 ),
        ( 21, 'Zoe', 'Harris', 8, 17 ),
        ( 22, 'Aaron', 'Lewis', 8, 17 ),
        ( 23, 'Bailey', 'Clark', 8, 17 ),
        ( 24, 'Cameron', 'Hall', 9, 17 ),
        ( 25, 'Dylan', 'Young', 9, 17 ),
        ( 26, 'Ella', 'Allen', 10, 17 ),
        -- Retail Shift 2 Employees
        ( 27, 'Gavin', 'Wright', 6, 41 ),
        ( 28, 'Hailey', 'King', 7, 27 ),
        ( 29, 'Isaac', 'Scott', 8, 27 ),
        ( 30, 'Julia', 'Green', 8, 27 ),
        ( 31, 'Kyle', 'Baker', 8, 27 ),
        ( 32, 'Leah', 'Hill', 8, 27 ),
        ( 33, 'Mason', 'Adams', 8, 27 ),
        ( 34, 'Natalie', 'Evans', 9, 27 ),
        ( 35, 'Owen', 'Collins', 9, 27 ),
        ( 36, 'Peyton', 'Campbell', 10, 27 ),
        -- Human Resources Employees
        ( 37, 'Riley', 'Mitchell', 11, NULL ),
        ( 38, 'Sean', 'Murphy', 13, 37 ),
        ( 39, 'Taylor', 'Wood', 13, 37 ),
        ( 40, 'Zachary', 'Moore', 14, 37 ),
        -- Corporate Employees
        ( 41, 'Emma', 'Watson', 15, NULL ),
        ( 42, 'Oliver', 'White', 16, 41 );

UPDATE employees
    SET manager_id = 41
    WHERE id IN (1, 9, 17, 37);