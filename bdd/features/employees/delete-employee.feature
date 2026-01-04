Feature: Employee Management - Deletion
  As a system administrator
  I want to delete employees
  So that I can remove unnecessary access

  Scenario: Successfully delete employee
    Given I am an administrator with valid secret key
    And an employee exists with the provided CPF
    When I delete the employee
    Then the employee should be deleted successfully
    And I should receive a success message

  Scenario: Fail to delete non-existent employee
    Given I am an administrator with valid secret key
    And no employee exists with the provided CPF
    When I try to delete the employee
    Then the deletion should fail
    And I should receive a not found error

  Scenario: Fail to delete employee without authorization
    Given I am not an administrator
    When I try to delete an employee
    Then the deletion should fail
    And I should receive an unauthorized error