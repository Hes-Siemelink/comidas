# Coding agents

This directory contains the definitions of the agents working on the project. Each agent has a different responsibility. For example, one agent distills the work items from the specifications, another does the coding, and another does validation and testing. Just like a real team!

## Agent Template

To define a new agent, use the [agent_template.md](agent_template.md) as a starting point. It explains the structure and sections to include for a new agent definition.

## Current Agents

- Planner – Reads the spec and defines the work in the backlog folder
- Coder – Does the actual coding according to the tasks in the backlog directory and the spec folder
- Architect – Proposes and reviews the overall architecture of the product
