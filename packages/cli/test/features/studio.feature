Feature: rafters studio command

  Background:
    Given a clean temporary directory
    And a Next.js project with shadcn installed
    And Tailwind v4 is configured
    And rafters is initialized

  Scenario: Start studio server
    When I run "rafters studio"
    Then the server should start on default port
    And it should be accessible via HTTP

  Scenario: Start studio on custom port
    When I run "rafters studio --port 4000"
    Then the server should start on port 4000

  Scenario: Studio serves token editor
    Given the studio server is running
    When I request the root path
    Then the response should be HTML
    And it should contain the token editor UI

  Scenario: Studio API returns tokens
    Given the studio server is running
    When I request "/api/tokens"
    Then the response should be JSON
    And it should contain token namespaces

  Scenario: Studio API updates tokens
    Given the studio server is running
    When I POST to "/api/tokens" with updated values
    Then the token files should be updated
    And the theme should be regenerated

  Scenario: Studio handles missing rafters config
    Given rafters is not initialized
    When I run "rafters studio"
    Then the command should fail
    And the error should suggest running init first
