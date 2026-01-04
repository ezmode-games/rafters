Feature: rafters mcp command

  Background:
    Given a clean temporary directory
    And a Next.js project with shadcn installed
    And Tailwind v4 is configured
    And rafters is initialized

  Scenario: Start MCP server
    When I start "rafters mcp"
    Then the server should start successfully
    And it should listen for MCP connections

  Scenario: MCP server exposes tools
    When the MCP server is running
    Then it should expose the "get_design_tokens" tool
    And it should expose the "update_token" tool
    And it should expose the "list_components" tool
    And it should expose the "add_component" tool

  Scenario: Get design tokens via MCP
    When I call MCP tool "get_design_tokens" with namespace "colors"
    Then the response should contain color tokens
    And the tokens should be valid DTCG format

  Scenario: Update token via MCP
    When I call MCP tool "update_token" with token path and value
    Then the token file should be updated
    And the theme should be regenerated

  Scenario: MCP server handles invalid requests
    When I call MCP tool with invalid parameters
    Then the server should return an error
    And the error should be properly formatted
