Feature: rafters add command

  Background:
    Given a clean temporary directory
    And a Next.js project with shadcn installed
    And Tailwind v4 is configured
    And rafters is initialized

  Scenario: Add a single component
    When I run "rafters add button"
    Then the command should succeed
    And file "components/ui/button.tsx" should exist
    And the file should contain valid TypeScript

  Scenario: Add multiple components
    When I run "rafters add button card dialog"
    Then the command should succeed
    And file "components/ui/button.tsx" should exist
    And file "components/ui/card.tsx" should exist
    And file "components/ui/dialog.tsx" should exist

  Scenario: Add component with dependencies
    When I run "rafters add dialog"
    Then the command should succeed
    And npm dependencies should be listed for installation

  Scenario: Add component that already exists
    Given component "button" is already installed
    When I run "rafters add button"
    Then the command should fail
    And the error should contain "already exists"

  Scenario: Overwrite existing component
    Given component "button" is already installed
    When I run "rafters add button --overwrite"
    Then the command should succeed
    And file "components/ui/button.tsx" should exist

  Scenario: List available components
    When I run "rafters add --list"
    Then the command should succeed
    And the output should contain available components

  Scenario: Add non-existent component
    When I run "rafters add nonexistent-component"
    Then the command should fail
    And the error should contain "not found"
