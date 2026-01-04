Feature: Token Validation
  As a system consumer
  I want to validate JWT tokens
  So that I can ensure requests are authenticated

  Scenario: Validate valid token
    Given I have a valid JWT token
    When I validate the token
    Then the validation should succeed
    And I should receive the token payload

  Scenario: Validate expired token
    Given I have an expired JWT token
    When I validate the token
    Then the validation should fail
    And I should receive an expired token error

  Scenario: Validate invalid token
    Given I have an invalid JWT token
    When I validate the token
    Then the validation should fail
    And I should receive an invalid token error

  Scenario: Validate malformed token
    Given I have a malformed token string
    When I validate the token
    Then the validation should fail