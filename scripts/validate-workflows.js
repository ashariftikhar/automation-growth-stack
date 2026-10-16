#!/usr/bin/env node

/**
 * Ashflow Automation Growth Stack - Workflow Validator CLI
 * 
 * Traverses templates/, parses each workflow.json, validates n8n schema specifications,
 * verifies node graph topology, and verifies connection integrity.
 */

const fs = require('fs');
const path = require('path');

const TEMPLATES_DIR = path.resolve(__dirname, '..', 'templates');

// ANSI Color helper
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(msg) {
  console.log(msg);
}

function findWorkflowFiles(baseDir) {
  const workflowPaths = [];
  if (!fs.existsSync(baseDir)) {
    return workflowPaths;
  }

  const entries = fs.readdirSync(baseDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const candidate = path.join(baseDir, entry.name, 'workflow.json');
      if (fs.existsSync(candidate)) {
        workflowPaths.push(candidate);
      }
    }
  }

  return workflowPaths;
}

function validateWorkflow(filePath) {
  const relativePath = path.relative(path.resolve(__dirname, '..'), filePath);
  const errors = [];
  const warnings = [];

  let raw = '';
  try {
    raw = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    return {
      filePath,
      relativePath,
      valid: false,
      errors: [`Unable to read file: ${err.message}`],
      warnings: [],
      stats: null
    };
  }

  let workflow;
  try {
    workflow = JSON.parse(raw);
  } catch (err) {
    return {
      filePath,
      relativePath,
      valid: false,
      errors: [`Invalid JSON syntax: ${err.message}`],
      warnings: [],
      stats: null
    };
  }

  // Validate workflow root properties
  if (typeof workflow !== 'object' || workflow === null) {
    errors.push('Root structure must be a JSON object.');
    return { filePath, relativePath, valid: false, errors, warnings, stats: null };
  }

  if (!workflow.name || typeof workflow.name !== 'string') {
    errors.push('Missing or invalid "name" attribute.');
  }

  if (!Array.isArray(workflow.nodes) || workflow.nodes.length === 0) {
    errors.push('Missing or empty "nodes" array.');
  }

  if (typeof workflow.connections !== 'object' || workflow.connections === null) {
    errors.push('Missing or invalid "connections" object.');
  }

  if (errors.length > 0) {
    return { filePath, relativePath, valid: false, errors, warnings, stats: null };
  }

  // Validate nodes and build node lookup
  const nodeNames = new Set();
  const nodeIds = new Set();
  const nodeTypes = {};

  for (let i = 0; i < workflow.nodes.length; i++) {
    const node = workflow.nodes[i];
    const prefix = `Node #${i + 1}`;

    if (!node.id || typeof node.id !== 'string') {
      errors.push(`${prefix} is missing a valid 'id'.`);
    } else if (nodeIds.has(node.id)) {
      errors.push(`${prefix} has duplicate id '${node.id}'.`);
    } else {
      nodeIds.add(node.id);
    }

    if (!node.name || typeof node.name !== 'string') {
      errors.push(`${prefix} is missing a valid 'name'.`);
    } else if (nodeNames.has(node.name)) {
      errors.push(`${prefix} has duplicate name '${node.name}'. Node names in n8n must be unique.`);
    } else {
      nodeNames.add(node.name);
    }

    if (!node.type || typeof node.type !== 'string') {
      errors.push(`${prefix} ('${node.name || 'unnamed'}') is missing a valid 'type'.`);
    } else {
      nodeTypes[node.type] = (nodeTypes[node.type] || 0) + 1;
    }

    if (typeof node.typeVersion !== 'number') {
      warnings.push(`${prefix} ('${node.name || 'unnamed'}') does not specify numeric 'typeVersion'.`);
    }

    if (!Array.isArray(node.position) || node.position.length !== 2 || typeof node.position[0] !== 'number' || typeof node.position[1] !== 'number') {
      warnings.push(`${prefix} ('${node.name || 'unnamed'}') position should be [x, y] coordinates.`);
    }
  }

  // Validate connections and topology
  let connectionCount = 0;
  for (const [sourceNode, connectionConfig] of Object.entries(workflow.connections)) {
    if (!nodeNames.has(sourceNode)) {
      errors.push(`Connection references non-existent source node: "${sourceNode}".`);
    }

    if (connectionConfig && typeof connectionConfig === 'object') {
      // Loop outputs (main, error, etc.)
      for (const [outputType, outputLines] of Object.entries(connectionConfig)) {
        if (Array.isArray(outputLines)) {
          for (let lineIdx = 0; lineIdx < outputLines.length; lineIdx++) {
            const targets = outputLines[lineIdx];
            if (Array.isArray(targets)) {
              for (const target of targets) {
                connectionCount++;
                if (!target.node) {
                  errors.push(`Malformed connection entry from "${sourceNode}" (${outputType}[${lineIdx}]).`);
                } else if (!nodeNames.has(target.node)) {
                  errors.push(`Connection from "${sourceNode}" points to non-existent target node: "${target.node}".`);
                }
              }
            }
          }
        }
      }
    }
  }

  return {
    filePath,
    relativePath,
    name: workflow.name,
    valid: errors.length === 0,
    errors,
    warnings,
    stats: {
      totalNodes: workflow.nodes.length,
      totalConnections: connectionCount,
      uniqueTypes: Object.keys(nodeTypes).length,
      types: nodeTypes
    }
  };
}

function run() {
  log(`\n${colors.bright}${colors.cyan}====================================================${colors.reset}`);
  log(`${colors.bright}${colors.cyan}  ⚡ Ashflow Automation Growth Stack - Workflow Validator${colors.reset}`);
  log(`${colors.bright}${colors.cyan}====================================================${colors.reset}\n`);

  const workflowFiles = findWorkflowFiles(TEMPLATES_DIR);

  if (workflowFiles.length === 0) {
    log(`${colors.red}❌ No workflow.json files found under: ${TEMPLATES_DIR}${colors.reset}\n`);
    process.exit(1);
  }

  log(`Found ${colors.bright}${workflowFiles.length}${colors.reset} workflow template(s) to validate...\n`);

  let passedCount = 0;
  let failedCount = 0;

  for (const file of workflowFiles) {
    const result = validateWorkflow(file);

    if (result.valid) {
      passedCount++;
      log(`${colors.green}✔ PASS${colors.reset} ${colors.bright}${result.name}${colors.reset}`);
      log(`       ${colors.dim}File:${colors.reset} ${result.relativePath}`);
      log(`       ${colors.dim}Nodes:${colors.reset} ${result.stats.totalNodes} | ${colors.dim}Connections:${colors.reset} ${result.stats.totalConnections} | ${colors.dim}Node Types:${colors.reset} ${result.stats.uniqueTypes}`);
      if (result.warnings.length > 0) {
        for (const warn of result.warnings) {
          log(`       ${colors.yellow}⚠ Warning: ${warn}${colors.reset}`);
        }
      }
    } else {
      failedCount++;
      log(`${colors.red}✖ FAIL${colors.reset} ${colors.bright}${result.name || result.relativePath}${colors.reset}`);
      log(`       ${colors.dim}File:${colors.reset} ${result.relativePath}`);
      for (const err of result.errors) {
        log(`       ${colors.red}✖ Error: ${err}${colors.reset}`);
      }
      for (const warn of result.warnings) {
        log(`       ${colors.yellow}⚠ Warning: ${warn}${colors.reset}`);
      }
    }
    log('');
  }

  log(`${colors.bright}----------------------------------------------------${colors.reset}`);
  log(`Total Workflows: ${colors.bright}${workflowFiles.length}${colors.reset}`);
  log(`Passed:          ${colors.green}${passedCount}${colors.reset}`);
  log(`Failed:          ${failedCount > 0 ? colors.red : colors.dim}${failedCount}${colors.reset}`);
  log(`${colors.bright}----------------------------------------------------${colors.reset}\n`);

  if (failedCount > 0) {
    log(`${colors.red}Validation failed with ${failedCount} error(s).${colors.reset}\n`);
    process.exit(1);
  } else {
    log(`${colors.green}🚀 All workflows passed validation successfully! Ready for production deployment.${colors.reset}\n`);
    process.exit(0);
  }
}

if (require.main === module) {
  run();
}

module.exports = { validateWorkflow, findWorkflowFiles };
