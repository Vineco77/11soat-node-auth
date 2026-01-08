Feature: Employee Management - Creation
  As a system administrator
  I want to create new employees
  So that they can access the system with employee privileges

  Scenario: Successfully create employee
    Given I am an administrator with valid secret key
    And no employee exists with the provided CPF
    When I create an employee
    Then the employee should be created successfully
    And I should receive the employee ID

  Scenario: Fail to create employee with existing CPF
    Given I am an administrator with valid secret key
    And an employee already exists with the provided CPF
    When I try to create an employee
    Then the creation should fail
    And I should receive a conflict error

  Scenario: Fail to create employee without authorization
    Given I am not an administrator
    When I try to create an employee
    Then the creation should fail
    And I should receive an unauthorized error

  Scenario: Fail to create employee with invalid CPF format
    Given I am an administrator with valid secret key
    And I provide invalid CPF format
    When I try to create an employee
    Then the creation should fail
    And I should receive a validation error