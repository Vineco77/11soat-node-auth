Feature: Token Generation
  As a system user
  I want to generate JWT tokens
  So that I can authenticate my requests

  Scenario: Generate client token without CPF
    Given I am a user with valid client data
    When I generate a JWT token
    Then I should receive a valid token
    And the token should have client type

  Scenario: Generate client token with unregistered CPF
    Given I am a user with valid CPF that is not registered as employee
    When I generate a JWT token
    Then I should receive a valid token
    And the token should have client type
    And the token should contain the CPF

  Scenario: Generate employee token with registered CPF
    Given I am a user with a CPF that is registered as employee
    When I generate a JWT token
    Then I should receive a valid token
    And the token should have employee type
    And the token should contain the CPF

  Scenario: Fail to generate token with invalid CPF format
    Given I am a user with invalid CPF format
    When I try to generate a JWT token
    Then the token generation should fail
    And I should receive a validation error

  Scenario: Generate token with minimal data
    Given I am a user with no additional data
    When I generate a JWT token
    Then I should receive a valid token
    And the token should have client type